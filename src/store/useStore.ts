import { useState, useCallback, useEffect } from 'react';
import {
  Customer, PieceType, Job, Expense, TrustItem,
  VaultCash, VaultGold, VaultSilver, Settings, DailySummary,
  DEFAULT_CUSTOMERS, DEFAULT_PIECE_TYPES, DEFAULT_SETTINGS,
} from './types';

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function persist(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function timeStr(): string {
  return new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
}

export function useStore() {
  const [customers, setCustomers] = useState<Customer[]>(() => load('ws_customers', DEFAULT_CUSTOMERS));
  const [pieceTypes, setPieceTypes] = useState<PieceType[]>(() => load('ws_pieces', DEFAULT_PIECE_TYPES));
  const [jobs, setJobs] = useState<Job[]>(() => load('ws_jobs', []));
  const [expenses, setExpenses] = useState<Expense[]>(() => load('ws_expenses', []));
  const [trustItems, setTrustItems] = useState<TrustItem[]>(() => load('ws_trusts', []));
  const [vaultCash, setVaultCash] = useState<VaultCash>(() => load('ws_vaultCash', { yemeniRiyal: 0, saudiRiyal: 0 }));
  const [vaultGold, setVaultGold] = useState<VaultGold[]>(() => load('ws_vaultGold', []));
  const [vaultSilver, setVaultSilver] = useState<VaultSilver[]>(() => load('ws_vaultSilver', []));
  const [settings, setSettings] = useState<Settings>(() => load('ws_settings', DEFAULT_SETTINGS));
  const [dailySummaries, setDailySummaries] = useState<DailySummary[]>(() => load('ws_dailySummaries', []));
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  useEffect(() => persist('ws_customers', customers), [customers]);
  useEffect(() => persist('ws_pieces', pieceTypes), [pieceTypes]);
  useEffect(() => persist('ws_jobs', jobs), [jobs]);
  useEffect(() => persist('ws_expenses', expenses), [expenses]);
  useEffect(() => persist('ws_trusts', trustItems), [trustItems]);
  useEffect(() => persist('ws_vaultCash', vaultCash), [vaultCash]);
  useEffect(() => persist('ws_vaultGold', vaultGold), [vaultGold]);
  useEffect(() => persist('ws_vaultSilver', vaultSilver), [vaultSilver]);
  useEffect(() => persist('ws_settings', settings), [settings]);
  useEffect(() => persist('ws_dailySummaries', dailySummaries), [dailySummaries]);

  const snapshot = useCallback(() =>
    JSON.stringify({ customers, pieceTypes, jobs, expenses, trustItems, vaultCash, vaultGold, vaultSilver, settings, dailySummaries }),
    [customers, pieceTypes, jobs, expenses, trustItems, vaultCash, vaultGold, vaultSilver, settings, dailySummaries]
  );

  const pushUndo = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-19), snapshot()]);
    setRedoStack([]);
  }, [snapshot]);

  const restoreSnapshot = (raw: string) => {
    const d = JSON.parse(raw);
    setCustomers(d.customers);
    setPieceTypes(d.pieceTypes);
    setJobs(d.jobs);
    setExpenses(d.expenses);
    setTrustItems(d.trustItems);
    setVaultCash(d.vaultCash);
    setVaultGold(d.vaultGold);
    setVaultSilver(d.vaultSilver);
    setSettings(d.settings);
    setDailySummaries(d.dailySummaries);
  };

  const undo = useCallback(() => {
    if (undoStack.length === 0) return;
    const prev = undoStack[undoStack.length - 1];
    setUndoStack(s => s.slice(0, -1));
    setRedoStack(s => [...s, snapshot()]);
    restoreSnapshot(prev);
  }, [undoStack, snapshot]);

  const redo = useCallback(() => {
    if (redoStack.length === 0) return;
    const next = redoStack[redoStack.length - 1];
    setRedoStack(s => s.slice(0, -1));
    setUndoStack(s => [...s, snapshot()]);
    restoreSnapshot(next);
  }, [redoStack, snapshot]);

  // Customers
  const addCustomer = useCallback((c: Omit<Customer, 'id'>): boolean => {
    if (customers.some(x => x.name === c.name)) return false;
    pushUndo();
    setCustomers(prev => [...prev, { ...c, id: uid() }]);
    return true;
  }, [customers, pushUndo]);

  const updateCustomer = useCallback((c: Customer) => {
    pushUndo();
    setCustomers(prev => prev.map(x => x.id === c.id ? c : x));
  }, [pushUndo]);

  // Piece Types
  const addPieceType = useCallback((name: string) => {
    if (pieceTypes.some(x => x.name === name)) return;
    pushUndo();
    setPieceTypes(prev => [...prev, { id: uid(), name }]);
  }, [pieceTypes, pushUndo]);

  const removePieceType = useCallback((id: string) => {
    pushUndo();
    setPieceTypes(prev => prev.filter(x => x.id !== id));
  }, [pushUndo]);

  // Jobs
  const addJob = useCallback((job: Omit<Job, 'id' | 'date' | 'time' | 'totalAmount' | 'remaining'>): Job => {
    pushUndo();
    const totalAmount = job.points * job.pointPrice;
    const remaining = totalAmount - job.amountReceived;
    const newJob: Job = { ...job, id: uid(), date: todayStr(), time: timeStr(), totalAmount, remaining };
    setJobs(prev => [...prev, newJob]);
    if (job.status === 'paid' || job.status === 'partial') {
      setVaultCash(prev => ({ ...prev, yemeniRiyal: prev.yemeniRiyal + job.amountReceived }));
    }
    return newJob;
  }, [pushUndo]);

  const updateJob = useCallback((job: Job) => {
    pushUndo();
    setJobs(prev => prev.map(x =>
      x.id === job.id
        ? { ...job, totalAmount: job.points * job.pointPrice, remaining: job.points * job.pointPrice - job.amountReceived }
        : x
    ));
  }, [pushUndo]);
  const settleJob = useCallback((id: string) => {
  pushUndo();

  setJobs(prev =>
    prev.map(job =>
      job.id === id
        ? {
            ...job,
            isSettled: true,
            settledDate: todayStr(),
            settledTime: timeStr(),
            amountReceived: job.totalAmount,
            remaining: 0,
          }
        : job
    )
  );
}, [pushUndo]);
// Expenses
  const addExpense = useCallback((e: Omit<Expense, 'id' | 'date'>): Expense => {
    pushUndo();
    const newExp: Expense = { ...e, id: uid(), date: todayStr() };
    setExpenses(prev => [...prev, newExp]);
    setVaultCash(prev => ({ ...prev, yemeniRiyal: prev.yemeniRiyal - e.amount }));
    return newExp;
  }, [pushUndo]);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => {
      const exp = prev.find(e => e.id === id);
      if (exp) {
        pushUndo();
        setVaultCash(c => ({ ...c, yemeniRiyal: c.yemeniRiyal + exp.amount }));
      }
      return prev.filter(e => e.id !== id);
    });
  }, [pushUndo]);

  // Trust Items
  const addTrustItem = useCallback((t: Omit<TrustItem, 'id' | 'date' | 'remaining'>) => {
    pushUndo();
    setTrustItems(prev => [...prev, { ...t, id: uid(), date: todayStr(), remaining: t.totalAmount - t.amountPaid }]);
  }, [pushUndo]);

  const updateTrustItem = useCallback((t: TrustItem) => {
    pushUndo();
    setTrustItems(prev => prev.map(x => x.id === t.id ? { ...t, remaining: t.totalAmount - t.amountPaid } : x));
  }, [pushUndo]);

  const deliverTrustItem = useCallback((id: string) => {
    pushUndo();
    setTrustItems(prev => prev.map(x => x.id === id ? { ...x, pieceStatus: 'delivered' } : x));
  }, [pushUndo]);

  const undoDeliverTrustItem = useCallback((id: string) => {
    pushUndo();
    setTrustItems(prev => prev.map(x => x.id === id ? { ...x, pieceStatus: 'with_me' } : x));
  }, [pushUndo]);

  // Vault
  const addVaultGold = useCallback((g: Omit<VaultGold, 'id'>) => {
    pushUndo();
    setVaultGold(prev => [...prev, { ...g, id: uid() }]);
  }, [pushUndo]);

  const removeVaultGold = useCallback((id: string) => {
    pushUndo();
    setVaultGold(prev => prev.filter(x => x.id !== id));
  }, [pushUndo]);

  const addVaultSilver = useCallback((s: Omit<VaultSilver, 'id'>) => {
    pushUndo();
    setVaultSilver(prev => [...prev, { ...s, id: uid() }]);
  }, [pushUndo]);

  const removeVaultSilver = useCallback((id: string) => {
    pushUndo();
    setVaultSilver(prev => prev.filter(x => x.id !== id));
  }, [pushUndo]);

  const adjustVaultCash = useCallback((field: keyof VaultCash, amount: number) => {
    pushUndo();
    setVaultCash(prev => ({ ...prev, [field]: prev[field] + amount }));
  }, [pushUndo]);

  // Settings
  const updateSettings = useCallback((s: Settings) => {
    pushUndo();
    setSettings(s);
  }, [pushUndo]);

  // Close Day
  const closeDay = useCallback(() => {
    pushUndo();
    const today = todayStr();
    const todayJobs = jobs.filter(j => j.date === today);
    const summary: DailySummary = {
      date: today,
      closed: true,
      totalIncome: todayJobs.reduce((s, j) => s + j.totalAmount, 0),
      totalPaid: todayJobs.reduce((s, j) => s + j.amountReceived, 0),
      totalDebt: todayJobs.reduce((s, j) => s + j.remaining, 0),
      jobCount: todayJobs.length,
    };
    setDailySummaries(prev => [...prev.filter(d => d.date !== today), summary]);
    const { rentDaily, loanDaily, associationDaily, emergencyDaily, savingsDaily } = settings;
    const totalReserved = rentDaily + loanDaily + associationDaily + emergencyDaily + savingsDaily;
    if (totalReserved > 0) {
      setVaultCash(prev => ({ ...prev, yemeniRiyal: prev.yemeniRiyal - totalReserved }));
      setSettings(prev => ({
        ...prev,
        reserved: {
          rent: prev.reserved.rent + rentDaily,
          loan: prev.reserved.loan + loanDaily,
          association: prev.reserved.association + associationDaily,
          emergency: prev.reserved.emergency + emergencyDaily,
          savings: prev.reserved.savings + savingsDaily,
        },
      }));
    }
  }, [jobs, settings, pushUndo]);

  // Computed
  const today = todayStr();
  const todayJobs = jobs.filter(j => j.date === today);
  const todayIncome = todayJobs.reduce((s, j) => s + j.totalAmount, 0);
  const todayPaid = todayJobs.reduce((s, j) => s + j.amountReceived, 0);
  const todayDebt = todayJobs.reduce((s, j) => s + j.remaining, 0);
  const todayExpenses = expenses.filter(e => e.date === today);
  const todayExpenseTotal = todayExpenses.reduce((s, e) => s + e.amount, 0);
  const totalDebt = jobs.reduce((s, j) => s + j.remaining, 0);
  const isTodayClosed = dailySummaries.some(d => d.date === today && d.closed);

  const getCustomerJobs = useCallback((customerId: string) => jobs.filter(j => j.customerId === customerId), [jobs]);

  const getCustomerStats = useCallback((customerId: string) => {
    const cJobs = jobs.filter(j => j.customerId === customerId);
    const sorted = [...cJobs].sort((a, b) => b.date.localeCompare(a.date) || b.time.localeCompare(a.time));
    return {
      totalWork: cJobs.reduce((s, j) => s + j.totalAmount, 0),
      totalReceived: cJobs.reduce((s, j) => s + j.amountReceived, 0),
      totalDebt: cJobs.reduce((s, j) => s + j.remaining, 0),
      jobCount: cJobs.length,
      lastDeal: sorted.length > 0 ? sorted[0].date : '',
    };
  }, [jobs]);

  const getCustomerTrusts = useCallback((customerId: string) => trustItems.filter(t => t.customerId === customerId), [trustItems]);

  return {
    customers, pieceTypes, jobs, expenses, trustItems,
    vaultCash, vaultGold, vaultSilver, settings, dailySummaries,
    undoStack, redoStack,
    addCustomer, updateCustomer,
    addPieceType, removePieceType,
    addJob, updateJob,settleJob,
    addExpense, deleteExpense,
    addTrustItem, updateTrustItem, deliverTrustItem, undoDeliverTrustItem,
    addVaultGold, removeVaultGold, addVaultSilver, removeVaultSilver, adjustVaultCash,
    updateSettings, closeDay,
    undo, redo,
    todayJobs, todayIncome, todayPaid, todayDebt, todayExpenses, todayExpenseTotal,
    totalDebt, isTodayClosed,
    getCustomerJobs, getCustomerStats, getCustomerTrusts,
  };
}

export type StoreType = ReturnType<typeof useStore>;
