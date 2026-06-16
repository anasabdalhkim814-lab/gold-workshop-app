import { useState, useRef, useEffect } from 'react';
import { useStoreContext } from '../store/StoreContext';
import { Mic, Save, RotateCcw, RotateCw, Check } from 'lucide-react';

export default function NewJobPage() {
  const store = useStoreContext();
  const [customerId, setCustomerId] = useState('');
  const [customerSearch, setCustomerSearch] = useState('');
  const [pieceTypeId, setPieceTypeId] = useState('');
  const [pieceSearch, setPieceSearch] = useState('');
  const [points, setPoints] = useState('');
  const [pointPrice, setPointPrice] = useState(store.settings.defaultPointPrice.toString());
  const [source, setSource] = useState<'shop' | 'direct'>('shop');
  const [status, setStatus] = useState<'paid' | 'deferred' | 'partial'>('paid');
  const [notes, setNotes] = useState('');
  const [amountReceived, setAmountReceived] = useState('');
  const [saved, setSaved] = useState(false);

  const customerRef = useRef<HTMLInputElement>(null);
  const pieceRef = useRef<HTMLInputElement>(null);
  const pointsRef = useRef<HTMLInputElement>(null);
  const priceRef = useRef<HTMLInputElement>(null);
  const receivedRef = useRef<HTMLInputElement>(null);

  const totalAmount = (parseFloat(points) || 0) * (parseFloat(pointPrice) || 0);
  const remaining = totalAmount - (parseFloat(amountReceived) || 0);

  const filteredCustomers = store.customers.filter(c =>
    c.name.includes(customerSearch)
  );
  const filteredPieces = store.pieceTypes.filter(p =>
    p.name.includes(pieceSearch)
  );

  const selectedCustomer = store.customers.find(c => c.id === customerId);

  useEffect(() => {
    customerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (status === 'paid') {
      setAmountReceived(totalAmount.toString());
    } else if (status === 'deferred') {
      setAmountReceived('0');
    }
  }, [status, totalAmount]);

  const handleSave = () => {
    if (!customerId || !pieceTypeId || !points || !pointPrice) return;

    store.addJob({
      customerId,
      customerName: selectedCustomer?.name || '',
      pieceTypeId,
      pieceTypeName: store.pieceTypes.find(p => p.id === pieceTypeId)?.name || '',
      points: parseFloat(points) || 0,
      pointPrice: parseFloat(pointPrice) || 0,
      source,
      status,
      notes,
      amountReceived: parseFloat(amountReceived) || 0,
    });

    setSaved(true);
    setTimeout(() => {
      setCustomerId('');
      setCustomerSearch('');
      setPieceTypeId('');
      setPieceSearch('');
      setPoints('');
      setPointPrice(store.settings.defaultPointPrice.toString());
      setSource('shop');
      setStatus('paid');
      setNotes('');
      setAmountReceived('');
      setSaved(false);
      customerRef.current?.focus();
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent, nextRef: React.RefObject<HTMLInputElement | null>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      nextRef.current?.focus();
    }
  };

  return (
    <div className="space-y-4 animate-fadeInUp">
      <h1 className="text-xl font-bold text-stone-800">شغل جديد</h1>

      {saved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center gap-2 animate-fadeInUp">
          <Check className="text-emerald-600" size={20} />
          <span className="text-emerald-700 font-medium">تم الحفظ بنجاح</span>
        </div>
      )}

      {/* Voice Record Button */}
      <button className="w-full bg-stone-100 hover:bg-stone-200 rounded-xl p-3 flex items-center justify-center gap-2 transition-colors border border-stone-200">
        <Mic size={18} className="text-stone-600" />
        <span className="text-sm text-stone-600">تسجيل صوتي</span>
      </button>

      {/* Customer Selection */}
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">العميل</label>
        <input
          ref={customerRef}
          type="text"
          value={customerSearch}
          onChange={e => {
            setCustomerSearch(e.target.value);
            setCustomerId('');
          }}
          onKeyDown={e => handleKeyDown(e, pieceRef)}
          placeholder="ابحث عن العميل..."
          className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none"
        />
        {customerSearch && !customerId && filteredCustomers.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-lg mt-1 shadow-lg max-h-40 overflow-y-auto">
            {filteredCustomers.map(c => (
              <button
                key={c.id}
                onClick={() => { setCustomerId(c.id); setCustomerSearch(c.name); pieceRef.current?.focus(); }}
                className="w-full text-right px-3 py-2 hover:bg-stone-50 text-sm border-b border-stone-100 last:border-0"
              >
                {c.name}
              </button>
            ))}
          </div>
        )}
        {customerId && (
          <div className="mt-1 bg-emerald-50 rounded-lg px-3 py-1.5 text-sm text-emerald-700 flex items-center gap-1">
            <Check size={14} /> {selectedCustomer?.name}
          </div>
        )}
      </div>

      {/* Piece Type Selection */}
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">نوع القطعة</label>
        <input
          ref={pieceRef}
          type="text"
          value={pieceSearch}
          onChange={e => {
            setPieceSearch(e.target.value);
            setPieceTypeId('');
          }}
          onKeyDown={e => handleKeyDown(e, pointsRef)}
          placeholder="ابحث عن نوع القطعة..."
          className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none"
        />
        {pieceSearch && !pieceTypeId && filteredPieces.length > 0 && (
          <div className="bg-white border border-stone-200 rounded-lg mt-1 shadow-lg max-h-40 overflow-y-auto">
            {filteredPieces.map(p => (
              <button
                key={p.id}
                onClick={() => { setPieceTypeId(p.id); setPieceSearch(p.name); pointsRef.current?.focus(); }}
                className="w-full text-right px-3 py-2 hover:bg-stone-50 text-sm border-b border-stone-100 last:border-0"
              >
                {p.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Points & Price */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">عدد النقاط</label>
          <input
            ref={pointsRef}
            type="number"
            value={points}
            onChange={e => setPoints(e.target.value)}
            onKeyDown={e => handleKeyDown(e, priceRef)}
            placeholder="0"
            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">سعر النقطة</label>
          <input
            ref={priceRef}
            type="number"
            value={pointPrice}
            onChange={e => setPointPrice(e.target.value)}
            onKeyDown={e => handleKeyDown(e, receivedRef)}
            placeholder="0"
            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none"
          />
        </div>
      </div>

      {/* Total Amount */}
      {totalAmount > 0 && (
        <div className="bg-gold-50 border border-gold-200 rounded-lg p-3 text-center">
          <p className="text-xs text-gold-600">المبلغ النهائي</p>
          <p className="text-xl font-bold text-gold-800">{totalAmount.toLocaleString()} ريال</p>
        </div>
      )}

      {/* Source */}
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">المصدر</label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSource('shop')}
            className={`py-2 rounded-lg text-sm font-medium transition-all ${
              source === 'shop' ? 'bg-gold-500 text-white' : 'bg-white border border-stone-200 text-stone-600'
            }`}
          >
            محل
          </button>
          <button
            onClick={() => setSource('direct')}
            className={`py-2 rounded-lg text-sm font-medium transition-all ${
              source === 'direct' ? 'bg-gold-500 text-white' : 'bg-white border border-stone-200 text-stone-600'
            }`}
          >
            زبون مباشر
          </button>
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">الحالة</label>
        <div className="grid grid-cols-3 gap-2">
          {(['paid', 'deferred', 'partial'] as const).map(s => {
            const labels = { paid: 'مدفوع', deferred: 'أجل', partial: 'مدفوع جزئياً' };
            const colors = {
              paid: s === 'paid' ? 'bg-emerald-500 text-white' : 'bg-white border border-stone-200 text-stone-600',
              deferred: s === 'deferred' ? 'bg-amber-500 text-white' : 'bg-white border border-stone-200 text-stone-600',
              partial: s === 'partial' ? 'bg-blue-500 text-white' : 'bg-white border border-stone-200 text-stone-600',
            };
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`py-2 rounded-lg text-sm font-medium transition-all ${colors[s]}`}
              >
                {labels[s]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Amount Received */}
      {(status === 'partial' || status === 'paid') && (
        <div>
          <label className="block text-sm font-medium text-stone-600 mb-1">المبلغ المستلم</label>
          <input
            ref={receivedRef}
            type="number"
            value={amountReceived}
            onChange={e => setAmountReceived(e.target.value)}
            placeholder="0"
            className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none"
          />
        </div>
      )}

      {/* Remaining */}
      {status !== 'paid' && remaining > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-center">
          <p className="text-xs text-amber-600">الباقي (دين)</p>
          <p className="text-lg font-bold text-amber-800">{remaining.toLocaleString()} ريال</p>
        </div>
      )}

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-stone-600 mb-1">ملاحظات</label>
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="ملاحظات إضافية..."
          rows={2}
          className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 focus:border-gold-400 outline-none resize-none"
        />
      </div>

      {/* Save & Undo/Redo */}
      <div className="flex gap-2 pb-4">
        <button
          onClick={store.undo}
          disabled={store.undoStack.length === 0}
          className="px-3 py-2.5 bg-stone-100 text-stone-500 rounded-lg text-sm disabled:opacity-30"
        >
          <RotateCcw size={18} />
        </button>
        <button
          onClick={store.redo}
          disabled={store.redoStack.length === 0}
          className="px-3 py-2.5 bg-stone-100 text-stone-500 rounded-lg text-sm disabled:opacity-30"
        >
          <RotateCw size={18} />
        </button>
        <button
          onClick={handleSave}
          disabled={!customerId || !pieceTypeId || !points}
          className="flex-1 bg-gold-500 hover:bg-gold-600 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
        >
          <Save size={18} />
          حفظ
        </button>
      </div>
    </div>
  );
}
