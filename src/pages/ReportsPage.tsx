import { useState } from 'react';
import { useStoreContext } from '../store/StoreContext';
import { BarChart3, TrendingUp, TrendingDown, Wallet } from 'lucide-react';

type ReportPeriod = 'daily' | 'monthly' | 'yearly';

export default function ReportsPage() {
  const store = useStoreContext();
  const [period, setPeriod] = useState<ReportPeriod>('daily');

  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const monthStr = todayStr.slice(0, 7);
  const yearStr = todayStr.slice(0, 4);

  const filteredJobs = store.jobs.filter(j => {
    if (period === 'daily') return j.date === todayStr;
    if (period === 'monthly') return j.date.startsWith(monthStr);
    return j.date.startsWith(yearStr);
  });

  const filteredExpenses = store.expenses.filter(e => {
    if (period === 'daily') return e.date === todayStr;
    if (period === 'monthly') return e.date.startsWith(monthStr);
    return e.date.startsWith(yearStr);
  });

  const totalIncome = filteredJobs.reduce((s, j) => s + j.totalAmount, 0);
  const totalReceived = filteredJobs.reduce((s, j) => s + j.amountReceived, 0);
  const totalDebt = filteredJobs.reduce((s, j) => s + j.remaining, 0);
  const totalExpenses = filteredExpenses.reduce((s, e) => s + e.amount, 0);
  const netProfit = totalReceived - totalExpenses;
  const jobCount = filteredJobs.length;

  // Group by date for daily view
  const jobsByDate: Record<string, typeof filteredJobs> = {};
  filteredJobs.forEach(j => {
    if (!jobsByDate[j.date]) jobsByDate[j.date] = [];
    jobsByDate[j.date].push(j);
  });

  const sortedDates = Object.keys(jobsByDate).sort().reverse();

  // Expense by category
  const expenseByCategory: Record<string, number> = {};
  filteredExpenses.forEach(e => {
    const catLabels: Record<string, string> = { personal: 'شخصي', house: 'البيت', workshop: 'الورشة', restaurant: 'مطعم', other: 'أخرى' };
    const label = catLabels[e.category] || e.category;
    expenseByCategory[label] = (expenseByCategory[label] || 0) + e.amount;
  });

  const periodLabels: Record<ReportPeriod, string> = { daily: 'يومية', monthly: 'شهرية', yearly: 'سنوية' };

  return (
    <div className="space-y-4 animate-fadeInUp">
      <h1 className="text-xl font-bold text-stone-800">التقارير</h1>

      {/* Period Selector */}
      <div className="grid grid-cols-3 gap-2">
        {(['daily', 'monthly', 'yearly'] as const).map(p => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`py-2 rounded-lg text-sm font-medium transition-all ${
              period === p ? 'bg-gold-500 text-white' : 'bg-white border border-stone-200 text-stone-600'
            }`}
          >
            {periodLabels[p]}
          </button>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 border border-stone-100 text-center">
          <TrendingUp size={18} className="text-emerald-500 mx-auto mb-1" />
          <p className="text-xs text-stone-400">إجمالي الدخل</p>
          <p className="text-lg font-bold text-emerald-600">{totalIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-100 text-center">
          <Wallet size={18} className="text-blue-500 mx-auto mb-1" />
          <p className="text-xs text-stone-400">المستلم</p>
          <p className="text-lg font-bold text-blue-600">{totalReceived.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-100 text-center">
          <TrendingDown size={18} className="text-red-500 mx-auto mb-1" />
          <p className="text-xs text-stone-400">المصروفات</p>
          <p className="text-lg font-bold text-red-600">{totalExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-100 text-center">
          <BarChart3 size={18} className="text-gold-500 mx-auto mb-1" />
          <p className="text-xs text-stone-400">صافي الربح</p>
          <p className={`text-lg font-bold ${netProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{netProfit.toLocaleString()}</p>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-stone-500">إجمالي الديون</span>
          <span className="font-bold text-amber-600">{totalDebt.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-stone-500">عدد العمليات</span>
          <span className="font-bold text-stone-700">{jobCount}</span>
        </div>
      </div>

      {/* Expense Breakdown */}
      {Object.keys(expenseByCategory).length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
          <h3 className="text-sm font-bold text-stone-600 mb-2">تفصيل المصروفات</h3>
          {Object.entries(expenseByCategory).map(([cat, amount]) => (
            <div key={cat} className="flex items-center justify-between py-1 text-sm">
              <span className="text-stone-500">{cat}</span>
              <span className="font-medium">{amount.toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}

      {/* Daily Breakdown (for monthly/yearly) */}
      {period !== 'daily' && sortedDates.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
          <h3 className="text-sm font-bold text-stone-600 mb-2">تفصيل يومي</h3>
          <div className="space-y-2">
            {sortedDates.map(date => {
              const dayJobs = jobsByDate[date];
              const dayIncome = dayJobs.reduce((s, j) => s + j.totalAmount, 0);
              const dayReceived = dayJobs.reduce((s, j) => s + j.amountReceived, 0);
              return (
                <div key={date} className="flex items-center justify-between py-1 text-sm border-b border-stone-50 last:border-0">
                  <span className="text-stone-500">{date}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-emerald-600">{dayIncome.toLocaleString()}</span>
                    <span className="text-blue-600">{dayReceived.toLocaleString()}</span>
                    <span className="text-stone-400">{dayJobs.length} عملية</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
