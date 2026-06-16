import { useState } from 'react';
import { useStoreContext } from '../store/StoreContext';
import { Plus, Trash2, Coins, Gem, CircleDot } from 'lucide-react';

export default function VaultPage() {
  const store = useStoreContext();
  const [showAddGold, setShowAddGold] = useState(false);
  const [showAddSilver, setShowAddSilver] = useState(false);
  const [goldName, setGoldName] = useState('');
  const [goldWeight, setGoldWeight] = useState('');
  const [goldNotes, setGoldNotes] = useState('');
  const [silverName, setSilverName] = useState('');
  const [silverWeight, setSilverWeight] = useState('');
  const [silverNotes, setSilverNotes] = useState('');
  const [adjustField, setAdjustField] = useState<'yemeniRiyal' | 'saudiRiyal' | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');

  const handleAddGold = () => {
    if (!goldName || !goldWeight) return;
    store.addVaultGold({ pieceName: goldName, weight: parseFloat(goldWeight) || 0, notes: goldNotes });
    setGoldName(''); setGoldWeight(''); setGoldNotes(''); setShowAddGold(false);
  };

  const handleAddSilver = () => {
    if (!silverName || !silverWeight) return;
    store.addVaultSilver({ pieceName: silverName, weight: parseFloat(silverWeight) || 0, notes: silverNotes });
    setSilverName(''); setSilverWeight(''); setSilverNotes(''); setShowAddSilver(false);
  };

  const handleAdjust = () => {
    if (!adjustField || !adjustAmount) return;
    store.adjustVaultCash(adjustField, parseFloat(adjustAmount) || 0);
    setAdjustField(null); setAdjustAmount('');
  };

  const totalGoldWeight = store.vaultGold.reduce((s, g) => s + g.weight, 0);
  const totalSilverWeight = store.vaultSilver.reduce((s, g) => s + g.weight, 0);

  return (
    <div className="space-y-4 animate-fadeInUp">
      <h1 className="text-xl font-bold text-stone-800">الخزنة</h1>

      {/* Cash */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
        <h2 className="text-sm font-bold text-stone-600 mb-3 flex items-center gap-2">
          <Coins size={16} className="text-gold-500" /> النقدية
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-stone-50 rounded-lg p-3 text-center relative">
            <p className="text-xs text-stone-400">ريال يمني</p>
            <p className="text-xl font-bold text-stone-800">{store.vaultCash.yemeniRiyal.toLocaleString()}</p>
            <div className="flex gap-1 mt-2 justify-center">
              <button onClick={() => setAdjustField('yemeniRiyal')} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">+</button>
              <button onClick={() => { setAdjustField('yemeniRiyal'); setAdjustAmount('-'); }} className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">-</button>
            </div>
          </div>
          <div className="bg-stone-50 rounded-lg p-3 text-center relative">
            <p className="text-xs text-stone-400">ريال سعودي</p>
            <p className="text-xl font-bold text-stone-800">{store.vaultCash.saudiRiyal.toLocaleString()}</p>
            <div className="flex gap-1 mt-2 justify-center">
              <button onClick={() => setAdjustField('saudiRiyal')} className="text-xs px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded">+</button>
              <button onClick={() => { setAdjustField('saudiRiyal'); setAdjustAmount('-'); }} className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">-</button>
            </div>
          </div>
        </div>
      </div>

      {/* Adjust Modal */}
      {adjustField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setAdjustField(null)}>
          <div className="bg-white rounded-xl p-4 w-72 space-y-3" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-stone-800">
              تعديل {adjustField === 'yemeniRiyal' ? 'ريال يمني' : 'ريال سعودي'}
            </h3>
            <input
              type="number"
              value={adjustAmount === '-' ? '' : adjustAmount}
              onChange={e => setAdjustAmount(e.target.value)}
              placeholder="المبلغ (موجب أو سالب)"
              className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
              autoFocus
            />
            <div className="flex gap-2">
              <button onClick={() => setAdjustField(null)} className="flex-1 py-2 bg-stone-100 rounded-lg text-sm text-stone-600">إلغاء</button>
              <button onClick={handleAdjust} className="flex-1 py-2 bg-gold-500 text-white rounded-lg text-sm font-medium">تأكيد</button>
            </div>
          </div>
        </div>
      )}

      {/* Reserved Amounts */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
        <h2 className="text-sm font-bold text-stone-600 mb-3">المبالغ المحجوزة</h2>
        <div className="space-y-2">
          {[
            { label: 'إيجار', value: store.settings.reserved.rent },
            { label: 'قرض', value: store.settings.reserved.loan },
            { label: 'جمعية', value: store.settings.reserved.association },
            { label: 'طوارئ', value: store.settings.reserved.emergency },
            { label: 'ادخار', value: store.settings.reserved.savings },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between text-sm">
              <span className="text-stone-500">{item.label}</span>
              <span className="font-medium text-stone-800">{item.value.toLocaleString()}</span>
            </div>
          ))}
          <div className="border-t border-stone-100 pt-2 flex items-center justify-between text-sm font-bold">
            <span>الإجمالي المحجوز</span>
            <span className="text-amber-600">{Object.values(store.settings.reserved).reduce((a, b) => a + b, 0).toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Gold */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-stone-600 flex items-center gap-2">
            <Gem size={16} className="text-gold-500" /> الذهب ({totalGoldWeight} غرام)
          </h2>
          <button onClick={() => setShowAddGold(!showAddGold)} className="text-xs px-2 py-1 bg-gold-100 text-gold-700 rounded-lg">
            <Plus size={14} />
          </button>
        </div>
        {showAddGold && (
          <div className="space-y-2 mb-3 animate-fadeInUp">
            <input value={goldName} onChange={e => setGoldName(e.target.value)} placeholder="اسم القطعة" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm" />
            <input value={goldWeight} onChange={e => setGoldWeight(e.target.value)} type="number" placeholder="الوزن (غرام)" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm" />
            <input value={goldNotes} onChange={e => setGoldNotes(e.target.value)} placeholder="ملاحظات" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm" />
            <button onClick={handleAddGold} className="w-full bg-gold-500 text-white rounded-lg py-1.5 text-sm">إضافة</button>
          </div>
        )}
        {store.vaultGold.map(g => (
          <div key={g.id} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
            <div>
              <p className="text-sm font-medium">{g.pieceName}</p>
              <p className="text-xs text-stone-400">{g.weight} غرام {g.notes && `- ${g.notes}`}</p>
            </div>
            <button onClick={() => store.removeVaultGold(g.id)} className="text-red-300 hover:text-red-500"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>

      {/* Silver */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-stone-600 flex items-center gap-2">
            <CircleDot size={16} className="text-silver-400" /> الفضة ({totalSilverWeight} غرام)
          </h2>
          <button onClick={() => setShowAddSilver(!showAddSilver)} className="text-xs px-2 py-1 bg-silver-100 text-silver-600 rounded-lg">
            <Plus size={14} />
          </button>
        </div>
        {showAddSilver && (
          <div className="space-y-2 mb-3 animate-fadeInUp">
            <input value={silverName} onChange={e => setSilverName(e.target.value)} placeholder="اسم القطعة" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm" />
            <input value={silverWeight} onChange={e => setSilverWeight(e.target.value)} type="number" placeholder="الوزن (غرام)" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm" />
            <input value={silverNotes} onChange={e => setSilverNotes(e.target.value)} placeholder="ملاحظات" className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm" />
            <button onClick={handleAddSilver} className="w-full bg-silver-500 text-white rounded-lg py-1.5 text-sm">إضافة</button>
          </div>
        )}
        {store.vaultSilver.map(s => (
          <div key={s.id} className="flex items-center justify-between py-2 border-b border-stone-50 last:border-0">
            <div>
              <p className="text-sm font-medium">{s.pieceName}</p>
              <p className="text-xs text-stone-400">{s.weight} غرام {s.notes && `- ${s.notes}`}</p>
            </div>
            <button onClick={() => store.removeVaultSilver(s.id)} className="text-red-300 hover:text-red-500"><Trash2 size={14} /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
