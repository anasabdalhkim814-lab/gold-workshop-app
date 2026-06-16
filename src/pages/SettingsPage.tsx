import { useState } from 'react';
import { useStoreContext } from '../store/StoreContext';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Settings } from '../store/types';

export default function SettingsPage() {
  const store = useStoreContext();
  const [s, setS] = useState<Settings>({ ...store.settings });
  const [newCustomerName, setNewCustomerName] = useState('');
  const [newPieceName, setNewPieceName] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    store.updateSettings(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAddCustomer = () => {
    if (!newCustomerName.trim()) return;
    store.addCustomer({ name: newCustomerName.trim(), city: '', phone: '', notes: '' });
    setNewCustomerName('');
  };

  const handleAddPiece = () => {
    if (!newPieceName.trim()) return;
    store.addPieceType(newPieceName.trim());
    setNewPieceName('');
  };

  return (
    <div className="space-y-4 animate-fadeInUp">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-stone-800">الإعدادات</h1>
        {saved && <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">تم الحفظ</span>}
      </div>

      {/* Owner Name */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-stone-600">معلومات المستخدم</h3>
        <div>
          <label className="block text-xs text-stone-400 mb-1">اسم المستخدم</label>
          <input
            value={s.ownerName}
            onChange={e => setS(prev => ({ ...prev, ownerName: e.target.value }))}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
        </div>
      </div>

      {/* Financial Settings */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-stone-600">الإعدادات المالية</h3>
        <div>
          <label className="block text-xs text-stone-400 mb-1">سعر النقطة الافتراضي</label>
          <input
            type="number"
            value={s.defaultPointPrice}
            onChange={e => setS(prev => ({ ...prev, defaultPointPrice: parseFloat(e.target.value) || 0 }))}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-stone-400 mb-1">حد المديونية</label>
          <input
            type="number"
            value={s.debtLimit}
            onChange={e => setS(prev => ({ ...prev, debtLimit: parseFloat(e.target.value) || 0 }))}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
        </div>
        <div>
          <label className="block text-xs text-stone-400 mb-1">حد رصيد الخزنة المنخفض</label>
          <input
            type="number"
            value={s.vaultLowBalance}
            onChange={e => setS(prev => ({ ...prev, vaultLowBalance: parseFloat(e.target.value) || 0 }))}
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
        </div>
      </div>

      {/* Daily Reserved Amounts */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-stone-600">المبالغ اليومية المحجوزة</h3>
        {[
          { key: 'rentDaily', label: 'إيجار يومي' },
          { key: 'loanDaily', label: 'قرض يومي' },
          { key: 'associationDaily', label: 'جمعية يومي' },
          { key: 'emergencyDaily', label: 'طوارئ يومي' },
          { key: 'savingsDaily', label: 'ادخار يومي' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs text-stone-400 mb-1">{label}</label>
            <input
              type="number"
              value={s[key as keyof Settings] as number}
              onChange={e => setS(prev => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }))}
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
            />
          </div>
        ))}
      </div>

      {/* Customer Management */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-stone-600">إدارة العملاء</h3>
        <div className="flex gap-2">
          <input
            value={newCustomerName}
            onChange={e => setNewCustomerName(e.target.value)}
            placeholder="اسم العميل الجديد"
            className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm"
            onKeyDown={e => e.key === 'Enter' && handleAddCustomer()}
          />
          <button onClick={handleAddCustomer} className="px-3 py-2 bg-gold-100 text-gold-700 rounded-lg">
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {store.customers.map(c => (
            <div key={c.id} className="flex items-center justify-between py-1 text-sm border-b border-stone-50">
              <span className="text-stone-700">{c.name}</span>
              {c.id !== 'c1' && (
                <button
                  onClick={() => { store.updateCustomer({ ...c, name: c.name + '_محذوف' }); }}
                  className="text-red-300 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Piece Type Management */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-stone-600">إدارة أنواع القطع</h3>
        <div className="flex gap-2">
          <input
            value={newPieceName}
            onChange={e => setNewPieceName(e.target.value)}
            placeholder="نوع القطعة الجديد"
            className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm"
            onKeyDown={e => e.key === 'Enter' && handleAddPiece()}
          />
          <button onClick={handleAddPiece} className="px-3 py-2 bg-gold-100 text-gold-700 rounded-lg">
            <Plus size={16} />
          </button>
        </div>
        <div className="space-y-1 max-h-40 overflow-y-auto">
          {store.pieceTypes.map(p => (
            <div key={p.id} className="flex items-center justify-between py-1 text-sm border-b border-stone-50">
              <span className="text-stone-700">{p.name}</span>
              <button
                onClick={() => store.removePieceType(p.id)}
                className="text-red-300 hover:text-red-500"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-gold-500 hover:bg-gold-600 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 shadow-md"
      >
        <Save size={18} />
        حفظ الإعدادات
      </button>
    </div>
  );
}
