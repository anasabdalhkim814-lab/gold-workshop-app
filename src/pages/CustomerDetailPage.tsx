import { useState } from 'react';
import { useStoreContext } from '../store/StoreContext';
import { ArrowRight, Edit2, Save, X, User, Phone, MapPin } from 'lucide-react';
import { Page } from '../store/types';

interface Props {
  customerId: string;
  onNavigate: (page: Page) => void;
}

export default function CustomerDetailPage({ customerId, onNavigate }: Props) {
  const store = useStoreContext();
  const customer = store.customers.find(c => c.id === customerId);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(customer?.name || '');
  const [editCity, setEditCity] = useState(customer?.city || '');
  const [editPhone, setEditPhone] = useState(customer?.phone || '');
  const [editNotes, setEditNotes] = useState(customer?.notes || '');

  if (!customer) {
    return (
      <div className="text-center py-10 text-stone-400">
        <User size={40} className="mx-auto mb-2" />
        <p>العميل غير موجود</p>
        <button onClick={() => onNavigate('customers')} className="text-gold-600 mt-2 text-sm">العودة</button>
      </div>
    );
  }

  const jobs = store.getCustomerJobs(customerId);
  const stats = store.getCustomerStats(customerId);
  const trusts = store.getCustomerTrusts(customerId);

  const handleSaveEdit = () => {
    store.updateCustomer({ ...customer, name: editName, city: editCity, phone: editPhone, notes: editNotes });
    setEditing(false);
  };

  const statusLabels: Record<string, string> = { paid: 'مدفوع', deferred: 'أجل', partial: 'جزئي' };
  const statusColors: Record<string, string> = { paid: 'bg-emerald-100 text-emerald-700', deferred: 'bg-amber-100 text-amber-700', partial: 'bg-blue-100 text-blue-700' };

  return (
    <div className="space-y-4 animate-fadeInUp">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => onNavigate('customers')} className="p-1">
          <ArrowRight size={20} className="text-stone-500" />
        </button>
        <h1 className="text-xl font-bold text-stone-800 flex-1">كشف العميل</h1>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="p-2 text-stone-400 hover:text-gold-600">
            <Edit2 size={18} />
          </button>
        ) : (
          <div className="flex gap-1">
            <button onClick={handleSaveEdit} className="p-2 text-emerald-600"><Save size={18} /></button>
            <button onClick={() => setEditing(false)} className="p-2 text-red-400"><X size={18} /></button>
          </div>
        )}
      </div>

      {/* Customer Info */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
        {editing ? (
          <div className="space-y-2">
            <input value={editName} onChange={e => setEditName(e.target.value)} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm" />
            <input value={editCity} onChange={e => setEditCity(e.target.value)} placeholder="المدينة" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm" />
            <input value={editPhone} onChange={e => setEditPhone(e.target.value)} placeholder="الهاتف" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm" />
            <textarea value={editNotes} onChange={e => setEditNotes(e.target.value)} placeholder="ملاحظات" rows={2} className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm resize-none" />
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold text-stone-800">{customer.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-xs text-stone-400">
              {customer.city && <span className="flex items-center gap-1"><MapPin size={12} />{customer.city}</span>}
              {customer.phone && <span className="flex items-center gap-1"><Phone size={12} />{customer.phone}</span>}
            </div>
            {customer.notes && <p className="text-xs text-stone-500 mt-1">{customer.notes}</p>}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-white rounded-xl p-3 border border-stone-100 text-center">
          <p className="text-xs text-stone-400">إجمالي الشغل</p>
          <p className="text-lg font-bold text-stone-800">{stats.totalWork.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-stone-100 text-center">
          <p className="text-xs text-stone-400">إجمالي المستلم</p>
          <p className="text-lg font-bold text-emerald-600">{stats.totalReceived.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-stone-100 text-center">
          <p className="text-xs text-stone-400">إجمالي الديون</p>
          <p className="text-lg font-bold text-amber-600">{stats.totalDebt.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-stone-100 text-center">
          <p className="text-xs text-stone-400">عدد العمليات</p>
          <p className="text-lg font-bold text-stone-700">{stats.jobCount}</p>
        </div>
      </div>

      {/* Jobs List */}
      <div>
        <h3 className="text-sm font-bold text-stone-600 mb-2">سجل العمليات</h3>
        <div className="space-y-2">
          {jobs.map(j => (
            <div key={j.id} className="bg-white rounded-xl p-3 border border-stone-100 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[j.status]}`}>{statusLabels[j.status]}</span>
                <span className="text-xs text-stone-400">{j.date} - {j.time}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><p className="text-stone-400">القطعة</p><p className="font-medium">{j.pieceTypeName}</p></div>
                <div><p className="text-stone-400">النقاط</p><p className="font-medium">{j.points}</p></div>
                <div><p className="text-stone-400">المبلغ</p><p className="font-medium">{j.totalAmount.toLocaleString()}</p></div>
              </div>
              {j.notes && <p className="text-xs text-stone-400 mt-1">{j.notes}</p>}
           
{j.remaining > 0 && !j.isSettled && (
  <button
    onClick={() => store.settleJob(j.id)}
    className="mt-2 w-full bg-emerald-600 text-white rounded-lg py-2 text-xs"
  >
    استلام المبلغ المتبقي
  </button>
)}

{j.isSettled && (
  <p className="text-xs text-emerald-600 mt-2">
    تم التسديد بتاريخ {j.settledDate} الساعة {j.settledTime}
  </p>
)}
 </div>
          ))}
          {jobs.length === 0 && (
            <p className="text-center text-stone-400 text-sm py-4">لا توجد عمليات بعد</p>
          )}
        </div>
      </div>

      {/* Trust Items */}
      {trusts.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-stone-600 mb-2">الأمانات</h3>
          <div className="space-y-2">
            {trusts.map(t => (
              <div key={t.id} className="bg-white rounded-xl p-3 border border-stone-100 shadow-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${t.pieceStatus === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {t.pieceStatus === 'delivered' ? 'تم التسليم' : 'عندي'}
                  </span>
                  <span className="text-xs text-stone-400">{t.date}</span>
                </div>
                <p className="text-sm font-medium">{t.pieceTypeName} - {t.workDescription}</p>
                <p className="text-xs text-stone-400">المبلغ: {t.totalAmount.toLocaleString()} | المدفوع: {t.amountPaid.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Last deal */}
      {stats.lastDeal && (
        <div className="text-xs text-stone-400 text-center pb-4">
          آخر تعامل: {stats.lastDeal}
        </div>
      )}
    </div>
  );
}
