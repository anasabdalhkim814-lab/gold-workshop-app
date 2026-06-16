import { useState } from 'react';
import { useStoreContext } from '../store/StoreContext';
import { Plus, Package, CheckCircle, RotateCcw } from 'lucide-react';
import { TrustItem } from '../store/types';

export default function TrustsPage() {
  const store = useStoreContext();
  const [showAdd, setShowAdd] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [pieceTypeId, setPieceTypeId] = useState('');
  const [pieceSearch, setPieceSearch] = useState('');
  const [workDesc, setWorkDesc] = useState('');
  const [totalAmount, setTotalAmount] = useState('');
  const [amountPaid, setAmountPaid] = useState('0');
  const [paymentStatus, setPaymentStatus] = useState<TrustItem['paymentStatus']>('deferred');

  const filteredCustomers = store.customers.filter(c => c.name.includes(customerSearch));
  const filteredPieces = store.pieceTypes.filter(p => p.name.includes(pieceSearch));

  const handleAdd = () => {
    if (!customerId || !pieceTypeId || !totalAmount) return;
    store.addTrustItem({
      customerId,
      customerName: store.customers.find(c => c.id === customerId)?.name || '',
      pieceTypeId,
      pieceTypeName: store.pieceTypes.find(p => p.id === pieceTypeId)?.name || '',
      workDescription: workDesc.trim(),
      totalAmount: parseFloat(totalAmount) || 0,
      amountPaid: parseFloat(amountPaid) || 0,
      pieceStatus: 'with_me',
      paymentStatus,
    });
    setCustomerId(''); setCustomerSearch(''); setPieceTypeId(''); setPieceSearch('');
    setWorkDesc(''); setTotalAmount(''); setAmountPaid('0'); setShowAdd(false);
  };

  const handleDeliver = (id: string) => {
    if (confirm('هل تريد تأكيد تسليم هذه الأمانة؟')) {
      store.deliverTrustItem(id);
    }
  };

  const remaining = (parseFloat(totalAmount) || 0) - (parseFloat(amountPaid) || 0);

  return (
    <div className="space-y-4 animate-fadeInUp">
      <h1 className="text-xl font-bold text-stone-800">الأمانات</h1>

      {/* Add Trust */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="w-full bg-white border border-dashed border-gold-300 rounded-lg p-3 flex items-center justify-center gap-2 text-gold-600 hover:bg-gold-50 transition-colors"
      >
        <Plus size={18} />
        <span className="text-sm font-medium">إضافة أمانة</span>
      </button>

      {showAdd && (
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm space-y-3 animate-fadeInUp">
          <input
            type="text"
            value={customerSearch}
            onChange={e => { setCustomerSearch(e.target.value); setCustomerId(''); }}
            placeholder="العميل"
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
          {customerSearch && !customerId && filteredCustomers.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
              {filteredCustomers.map(c => (
                <button key={c.id} onClick={() => { setCustomerId(c.id); setCustomerSearch(c.name); }} className="w-full text-right px-3 py-2 hover:bg-stone-50 text-sm border-b border-stone-100">
                  {c.name}
                </button>
              ))}
            </div>
          )}
          <input
            type="text"
            value={pieceSearch}
            onChange={e => { setPieceSearch(e.target.value); setPieceTypeId(''); }}
            placeholder="نوع القطعة"
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
          {pieceSearch && !pieceTypeId && filteredPieces.length > 0 && (
            <div className="bg-white border border-stone-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
              {filteredPieces.map(p => (
                <button key={p.id} onClick={() => { setPieceTypeId(p.id); setPieceSearch(p.name); }} className="w-full text-right px-3 py-2 hover:bg-stone-50 text-sm border-b border-stone-100">
                  {p.name}
                </button>
              ))}
            </div>
          )}
          <input
            type="text"
            value={workDesc}
            onChange={e => setWorkDesc(e.target.value)}
            placeholder="وصف العمل"
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
          <input
            type="number"
            value={totalAmount}
            onChange={e => setTotalAmount(e.target.value)}
            placeholder="إجمالي الحساب"
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
          <input
            type="number"
            value={amountPaid}
            onChange={e => setAmountPaid(e.target.value)}
            placeholder="المدفوع"
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
          {remaining > 0 && (
            <p className="text-xs text-amber-600">الباقي: {remaining.toLocaleString()} ريال</p>
          )}
          <div className="grid grid-cols-3 gap-2">
            {(['paid', 'deferred', 'partial'] as const).map(s => {
              const labels = { paid: 'مدفوع', deferred: 'أجل', partial: 'جزئي' };
              return (
                <button key={s} onClick={() => setPaymentStatus(s)} className={`py-1.5 rounded-lg text-xs font-medium ${paymentStatus === s ? 'bg-gold-500 text-white' : 'bg-stone-50 text-stone-600'}`}>
                  {labels[s]}
                </button>
              );
            })}
          </div>
          <button onClick={handleAdd} disabled={!customerId || !pieceTypeId || !totalAmount} className="w-full bg-gold-500 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-40">
            إضافة
          </button>
        </div>
      )}

      {/* Trust Items */}
      <div className="space-y-2">
        {store.trustItems.map(t => {
          const daysSince = Math.floor((Date.now() - new Date(t.date).getTime()) / 86400000);
          const isOld = daysSince > 7 && t.pieceStatus === 'with_me';
          return (
            <div key={t.id} className={`bg-white rounded-xl p-3 border shadow-sm ${isOld ? 'border-amber-200' : 'border-stone-100'}`}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1">
                  {t.pieceStatus === 'with_me' ? (
                    <button onClick={() => handleDeliver(t.id)} className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200">
                      <Package size={12} /> عندي
                    </button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
                        <CheckCircle size={12} /> تم التسليم
                      </span>
                      <button onClick={() => store.undoDeliverTrustItem(t.id)} className="text-stone-300 hover:text-stone-500" title="تراجع">
                        <RotateCcw size={12} />
                      </button>
                    </div>
                  )}
                </div>
                <span className="text-xs text-stone-400">{t.date}</span>
              </div>
              <p className="text-sm font-medium text-stone-800">{t.customerName} - {t.pieceTypeName}</p>
              {t.workDescription && <p className="text-xs text-stone-400">{t.workDescription}</p>}
              <div className="flex items-center justify-between mt-1 text-xs">
                <span className="text-stone-400">الإجمالي: {t.totalAmount.toLocaleString()} | المدفوع: {t.amountPaid.toLocaleString()}</span>
                {t.remaining > 0 && <span className="text-amber-600">الباقي: {t.remaining.toLocaleString()}</span>}
              </div>
              {isOld && <p className="text-xs text-amber-600 mt-1">تجاوزت أسبوعاً ({daysSince} يوم)</p>}
            </div>
          );
        })}
        {store.trustItems.length === 0 && (
          <p className="text-center text-stone-400 text-sm py-8">لا توجد أمانات</p>
        )}
      </div>
    </div>
  );
}
