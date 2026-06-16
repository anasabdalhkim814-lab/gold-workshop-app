export interface Customer {
  id: string;
  name: string;
  city: string;
  phone: string;
  notes: string;
}

export interface PieceType {
  id: string;
  name: string;
}

export interface Job {
  id: string;
  date: string;
  time: string;
  customerId: string;
  customerName: string;
  pieceTypeId: string;
  pieceTypeName: string;
  points: number;
  pointPrice: number;
  totalAmount: number;
  source: 'shop' | 'direct';
  status: 'paid' | 'deferred' | 'partial';
  notes: string;
  amountReceived: number;
  remaining: number;
isSettled?: boolean;
settledDate?: string;
settledTime?: string;
}

export interface Expense {
  id: string;
  date: string;
  category: 'personal' | 'house' | 'workshop' | 'restaurant' | 'other';
  description: string;
  amount: number;
}

export interface TrustItem {
  id: string;
  date: string;
  customerId: string;
  customerName: string;
  pieceTypeId: string;
  pieceTypeName: string;
  workDescription: string;
  totalAmount: number;
  amountPaid: number;
  remaining: number;
  pieceStatus: 'with_me' | 'delivered';
  paymentStatus: 'paid' | 'deferred' | 'partial';
}

export interface VaultCash {
  yemeniRiyal: number;
  saudiRiyal: number;
}

export interface VaultGold {
  id: string;
  pieceName: string;
  weight: number;
  notes: string;
}

export interface VaultSilver {
  id: string;
  pieceName: string;
  weight: number;
  notes: string;
}

export interface ReservedAmount {
  rent: number;
  loan: number;
  association: number;
  emergency: number;
  savings: number;
}

export interface Settings {
  ownerName: string;
  defaultPointPrice: number;
  debtLimit: number;
  vaultLowBalance: number;
  reserved: ReservedAmount;
  rentDaily: number;
  loanDaily: number;
  associationDaily: number;
  emergencyDaily: number;
  savingsDaily: number;
}

export interface DailySummary {
  date: string;
  closed: boolean;
  totalIncome: number;
  totalPaid: number;
  totalDebt: number;
  jobCount: number;
}

export type Page =
  | 'home'
  | 'newJob'
  | 'customers'
  | 'customerDetail'
  | 'daily'
  | 'expenses'
  | 'trusts'
  | 'vault'
  | 'reports'
  | 'settings';

export const EXPENSE_CATEGORIES: Record<Expense['category'], string> = {
  personal: 'شخصي',
  house: 'البيت',
  workshop: 'الورشة',
  restaurant: 'مطعم',
  other: 'أخرى',
};

export const DEFAULT_CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'زبون خارجي', city: '', phone: '', notes: '' },
  { id: 'c2', name: 'الوطنية', city: '', phone: '', notes: '' },
  { id: 'c3', name: 'ابو أسعد', city: '', phone: '', notes: '' },
  { id: 'c4', name: 'العامري', city: '', phone: '', notes: '' },
  { id: 'c5', name: 'ابو طلال', city: '', phone: '', notes: '' },
];

export const DEFAULT_PIECE_TYPES: PieceType[] = [
  { id: 'p1', name: 'تقصير محبس' },
  { id: 'p2', name: 'تقصير خاتم' },
  { id: 'p3', name: 'لحام خاتم' },
  { id: 'p4', name: 'لحام محبس' },
  { id: 'p5', name: 'سلس اسم' },
  { id: 'p6', name: 'سلس' },
  { id: 'p7', name: 'شبكة / اسوارة' },
];

export const DEFAULT_SETTINGS: Settings = {
  ownerName: 'أنس',
  defaultPointPrice: 500,
  debtLimit: 100000,
  vaultLowBalance: 50000,
  reserved: { rent: 0, loan: 0, association: 0, emergency: 0, savings: 0 },
  rentDaily: 1500,
  loanDaily: 500,
  associationDaily: 500,
  emergencyDaily: 500,
  savingsDaily: 0,
};

export const PRAYERS = [
  'اللهم افتح لنا أبواب رزقك',
  'يا فتاح يا عليم يا رزاق يا كريم',
  'اللهم جنبنا شر الأشرار وطوارق الليل والنهار',
  'اللهم ارزقنا رزقاً واسعاً حلالاً طيباً',
  'ربنا آتنا في الدنيا حسنة وفي الآخرة حسنة',
  'اللهم بارك لنا في أرزاقنا وأوقاتنا',
];
