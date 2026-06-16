import { useState } from 'react';
import { useStoreContext } from '../store/StoreContext';
import { Search, Plus, ChevronLeft, Phone, MapPin, FileText } from 'lucide-react';
import { Page } from '../store/types';

interface Props {
  onNavigate: (page: Page, data?: Record<string, string>) => void;
}

export default function CustomersPage({ onNavigate }: Props) {
  const store = useStoreContext();
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [addError, setAddError] = useState('');

  const filtered = store.customers.filter(c =>
    c.name.includes(search)
  );

  const handleAdd = () => {
    if (!newName.trim()) return;
    const ok = store.addCustomer({ name: newName.trim(), city: newCity.trim(), phone: newPhone.trim(), notes: newNotes.trim() });
    if (!ok) {
      setAddError('الاسم موجود مسبقاً');
      return;
    }
    setNewName(''); setNewCity(''); setNewPhone(''); setNewNotes('');
    setShowAdd(false); setAddError('');
  };

  return (
    <div className="space-y-4 animate-fadeInUp">
      <h1 className="text-xl font-bold text-stone-800">العملاء</h1>

      {/* Search */}
      <div className="relative">
        <Search className="absolute right-3 top-2.5 text-stone-400" size={16} />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="ابحث عن عميل..."
          className="w-full bg-white border border-stone-200 rounded-lg pr-9 pl-3 py-2.5 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
        />
      </div>

      {/* Add Customer Button */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="w-full bg-white border border-dashed border-gold-300 rounded-lg p-3 flex items-center justify-center gap-2 text-gold-600 hover:bg-gold-50 transition-colors"
      >
        <Plus size={18} />
        <span className="text-sm font-medium">إضافة عميل جديد</span>
      </button>

      {/* Add Customer Form */}
      {showAdd && (
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm space-y-3 animate-fadeInUp">
          <input
            type="text"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="اسم العميل"
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
          <input
            type="text"
            value={newCity}
            onChange={e => setNewCity(e.target.value)}
            placeholder="المدينة"
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
          <input
            type="text"
            value={newPhone}
            onChange={e => setNewPhone(e.target.value)}
            placeholder="رقم الهاتف"
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
          <textarea
            value={newNotes}
            onChange={e => setNewNotes(e.target.value)}
            placeholder="ملاحظات"
            rows={2}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none resize-none"
          />
          {addError && <p className="text-red-500 text-xs">{addError}</p>}
          <button
            onClick={handleAdd}
            disabled={!newName.trim()}
            className="w-full bg-gold-500 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-40"
          >
            إضافة
          </button>
        </div>
      )}

      {/* Customer List */}
      <div className="space-y-2">
        {filtered.map(c => {
          const stats = store.getCustomerStats(c.id);
          return (
            <button
              key={c.id}
              onClick={() => onNavigate('customerDetail', { customerId: c.id })}
              className="w-full bg-white rounded-xl p-4 border border-stone-100 shadow-sm hover:shadow-md transition-all text-right"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ChevronLeft size={16} className="text-stone-400" />
                </div>
                <h3 className="font-bold text-stone-800">{c.name}</h3>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-stone-50 rounded-lg p-2 text-center">
                  <p className="text-stone-400">الشغل</p>
                  <p className="font-bold text-stone-700">{stats.totalWork.toLocaleString()}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-2 text-center">
                  <p className="text-stone-400">المستلم</p>
                  <p className="font-bold text-emerald-600">{stats.totalReceived.toLocaleString()}</p>
                </div>
                <div className="bg-stone-50 rounded-lg p-2 text-center">
                  <p className="text-stone-400">الديون</p>
                  <p className="font-bold text-amber-600">{stats.totalDebt.toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 mt-2 text-xs text-stone-400">
                {c.city && <span className="flex items-center gap-1"><MapPin size={12} />{c.city}</span>}
                {c.phone && <span className="flex items-center gap-1"><Phone size={12} />{c.phone}</span>}
                {stats.jobCount > 0 && <span className="flex items-center gap-1"><FileText size={12} />{stats.jobCount} عملية</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
