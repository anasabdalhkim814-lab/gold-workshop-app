import { useStoreContext } from '../store/StoreContext';
import { Lock, TrendingUp, Wallet, AlertTriangle, Calendar } from 'lucide-react';

export default function DailyPage() {
  const store = useStoreContext();

  const statusLabels: Record<string, string> = { paid: 'مدفوع', deferred: 'أجل', partial: 'جزئي' };
  const statusColors: Record<string, string> = { paid: 'bg-emerald-100 text-emerald-700', deferred: 'bg-amber-100 text-amber-700', partial: 'bg-blue-100 text-blue-700' };
  const sourceLabels: Record<string, string> = { shop: 'محل', direct: 'مباشر' };

  return (
    <div className="space-y-4 animate-fadeInUp">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-800">كشف اليوم</h1>
        {store.isTodayClosed && (
          <span className="flex items-center gap-1 text-xs text-stone-400 bg-stone-100 px-2 py-1 rounded-full">
            <Lock size={12} /> تم الإغلاق
          </span>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 border border-stone-100 text-center">
          <TrendingUp size={18} className="text-emerald-500 mx-auto mb-1" />
          <p className="text-xs text-stone-400">إجمالي الدخل</p>
          <p className="text-lg font-bold text-emerald-600">{store.todayIncome.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-100 text-center">
          <Wallet size={18} className="text-blue-500 mx-auto mb-1" />
          <p className="text-xs text-stone-400">إجمالي المدفوع</p>
          <p className="text-lg font-bold text-blue-600">{store.todayPaid.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-100 text-center">
          <AlertTriangle size={18} className="text-amber-500 mx-auto mb-1" />
          <p className="text-xs text-stone-400">إجمالي الديون</p>
          <p className="text-lg font-bold text-amber-600">{store.todayDebt.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-stone-100 text-center">
          <Calendar size={18} className="text-stone-400 mx-auto mb-1" />
          <p className="text-xs text-stone-400">عدد العمليات</p>
          <p className="text-lg font-bold text-stone-700">{store.todayJobs.length}</p>
        </div>
      </div>

      {/* Jobs */}
      <div>
        <h3 className="text-sm font-bold text-stone-600 mb-2">العمليات</h3>
        <div className="space-y-2">
          {store.todayJobs.map(j => (
            <div key={j.id} className="bg-white rounded-xl p-3 border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[j.status]}`}>{statusLabels[j.status]}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">{sourceLabels[j.source]}</span>
                </div>
                <span className="text-xs text-stone-400">{j.time}</span>
              </div>
              <div className="mt-1">
                <p className="text-sm font-medium text-stone-800">{j.customerName} - {j.pieceTypeName}</p>
                <div className="grid grid-cols-3 gap-2 text-xs mt-1">
                  <div><span className="text-stone-400">النقاط:</span> {j.points}</div>
                  <div><span className="text-stone-400">المبلغ:</span> {j.totalAmount.toLocaleString()}</div>
                  <div><span className="text-stone-400">المستلم:</span> {j.amountReceived.toLocaleString()}</div>
                </div>
                {j.notes && <p className="text-xs text-stone-400 mt-1">{j.notes}</p>}
              </div>
            </div>
          ))}
          {store.todayJobs.length === 0 && (
            <p className="text-center text-stone-400 text-sm py-8">لا توجد عمليات اليوم</p>
          )}
        </div>
      </div>

      {/* Close Day */}
      {!store.isTodayClosed && store.todayJobs.length > 0 && (
        <button
          onClick={() => {
            if (confirm('هل تريد إغلاق اليوم؟ لا يمكن التراجع عن هذه العملية.')) {
              store.closeDay();
            }
          }}
          className="w-full bg-stone-700 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2"
        >
          <Lock size={18} />
          إغلاق اليوم
        </button>
      )}
    </div>
  );
}
