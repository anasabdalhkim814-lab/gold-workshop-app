import { useStoreContext } from '../store/StoreContext';
import Notifications from '../components/Notifications';
import { PlusCircle, Calendar, Users, TrendingUp, AlertTriangle, Wallet } from 'lucide-react';
import { Page } from '../store/types';

interface Props {
  onNavigate: (page: Page) => void;
}

export default function HomePage({ onNavigate }: Props) {
  const store = useStoreContext();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'صباح الخير' : hour < 17 ? 'مساء الخير' : 'مساء النور';
  const customerName = store.settings.ownerName;

  return (
    <div className="space-y-5 animate-fadeInUp">
      {/* Welcome */}
      <div className="bg-gradient-to-l from-gold-600 to-gold-800 rounded-2xl p-5 text-white shadow-lg">
        <h1 className="text-2xl font-bold">{greeting} {customerName}</h1>
        <p className="text-gold-100 mt-1 text-sm">
          {new Date().toLocaleDateString('ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      {/* Notifications */}
      <Notifications />

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onNavigate('newJob')}
          className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 hover:shadow-md transition-all flex flex-col items-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <PlusCircle size={20} className="text-emerald-600" />
          </div>
          <span className="text-sm font-medium text-stone-700">شغل جديد</span>
        </button>
        <button
          onClick={() => onNavigate('daily')}
          className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 hover:shadow-md transition-all flex flex-col items-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <Calendar size={20} className="text-blue-600" />
          </div>
          <span className="text-sm font-medium text-stone-700">كشف اليوم</span>
        </button>
        <button
          onClick={() => onNavigate('customers')}
          className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 hover:shadow-md transition-all flex flex-col items-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Users size={20} className="text-purple-600" />
          </div>
          <span className="text-sm font-medium text-stone-700">العملاء</span>
        </button>
        <button
          onClick={() => onNavigate('vault')}
          className="bg-white rounded-xl p-4 shadow-sm border border-stone-100 hover:shadow-md transition-all flex flex-col items-center gap-2"
        >
          <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center">
            <Wallet size={20} className="text-gold-600" />
          </div>
          <span className="text-sm font-medium text-stone-700">الخزنة</span>
        </button>
      </div>

      {/* Today's Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
        <h2 className="text-base font-bold text-stone-800 mb-3">ملخص اليوم</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-stone-50 rounded-lg p-3 text-center">
            <TrendingUp size={16} className="text-emerald-500 mx-auto mb-1" />
            <p className="text-xs text-stone-500">الدخل</p>
            <p className="text-lg font-bold text-emerald-600">{store.todayIncome.toLocaleString()}</p>
          </div>
          <div className="bg-stone-50 rounded-lg p-3 text-center">
            <AlertTriangle size={16} className="text-amber-500 mx-auto mb-1" />
            <p className="text-xs text-stone-500">الديون</p>
            <p className="text-lg font-bold text-amber-600">{store.todayDebt.toLocaleString()}</p>
          </div>
          <div className="bg-stone-50 rounded-lg p-3 text-center">
            <Wallet size={16} className="text-blue-500 mx-auto mb-1" />
            <p className="text-xs text-stone-500">المدفوع</p>
            <p className="text-lg font-bold text-blue-600">{store.todayPaid.toLocaleString()}</p>
          </div>
          <div className="bg-stone-50 rounded-lg p-3 text-center">
            <Calendar size={16} className="text-stone-400 mx-auto mb-1" />
            <p className="text-xs text-stone-500">العمليات</p>
            <p className="text-lg font-bold text-stone-700">{store.todayJobs.length}</p>
          </div>
        </div>
      </div>

      {/* Vault Balance */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-stone-100">
        <h2 className="text-base font-bold text-stone-800 mb-3">رصيد الخزنة</h2>
        <div className="flex gap-3">
          <div className="flex-1 bg-stone-50 rounded-lg p-3 text-center">
            <p className="text-xs text-stone-500">ريال يمني</p>
            <p className="text-lg font-bold text-stone-800">{store.vaultCash.yemeniRiyal.toLocaleString()}</p>
          </div>
          <div className="flex-1 bg-stone-50 rounded-lg p-3 text-center">
            <p className="text-xs text-stone-500">ريال سعودي</p>
            <p className="text-lg font-bold text-stone-800">{store.vaultCash.saudiRiyal.toLocaleString()}</p>
          </div>
        </div>
        {store.vaultCash.yemeniRiyal < store.settings.vaultLowBalance && (
          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg p-2 text-xs text-amber-700 flex items-center gap-1">
            <AlertTriangle size={14} />
            <span>رصيد الخزنة أقل من الحد ({store.settings.vaultLowBalance.toLocaleString()})</span>
          </div>
        )}
      </div>

      {/* Total Debt Warning */}
      {store.totalDebt > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
          <div>
            <p className="text-sm font-bold text-amber-800">إجمالي الديون المستحقة</p>
            <p className="text-lg font-bold text-amber-600">{store.totalDebt.toLocaleString()} ريال</p>
          </div>
        </div>
      )}
    </div>
  );
}
