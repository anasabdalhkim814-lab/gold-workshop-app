import { useState } from 'react';
import { useStoreContext } from '../store/StoreContext';
import { Plus, Trash2 } from 'lucide-react';
import { EXPENSE_CATEGORIES, Expense } from '../store/types';

export default function ExpensesPage() {
  const store = useStoreContext();
  const [showAdd, setShowAdd] = useState(false);
  const [category, setCategory] = useState<Expense['category']>('personal');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');

  const allExpenses = [...store.expenses].sort((a, b) => b.date.localeCompare(a.date));

  const handleAdd = () => {
    if (!description.trim() || !amount) return;
    store.addExpense({ category, description: description.trim(), amount: parseFloat(amount) || 0 });
    setDescription(''); setAmount(''); setShowAdd(false);
  };

  return (
    <div className="space-y-4 animate-fadeInUp">
      <h1 className="text-xl font-bold text-stone-800">المصروفات</h1>

      {/* Today Summary */}
      <div className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm text-stone-500">مصروفات اليوم</span>
          <span className="text-lg font-bold text-red-600">{store.todayExpenseTotal.toLocaleString()} ريال</span>
        </div>
      </div>

      {/* Add Expense */}
      <button
        onClick={() => setShowAdd(!showAdd)}
        className="w-full bg-white border border-dashed border-gold-300 rounded-lg p-3 flex items-center justify-center gap-2 text-gold-600 hover:bg-gold-50 transition-colors"
      >
        <Plus size={18} />
        <span className="text-sm font-medium">إضافة مصروف</span>
      </button>

      {showAdd && (
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-sm space-y-3 animate-fadeInUp">
          {/* Category */}
          <div className="grid grid-cols-5 gap-1">
            {(Object.entries(EXPENSE_CATEGORIES) as [Expense['category'], string][]).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`py-1.5 rounded-lg text-xs font-medium transition-all ${
                  category === key ? 'bg-gold-500 text-white' : 'bg-stone-50 text-stone-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="البيان"
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="المبلغ"
            className="w-full bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gold-400 outline-none"
          />
          <button
            onClick={handleAdd}
            disabled={!description.trim() || !amount}
            className="w-full bg-gold-500 text-white rounded-lg py-2 text-sm font-medium disabled:opacity-40"
          >
            إضافة
          </button>
        </div>
      )}

      {/* Expense List */}
      <div className="space-y-2">
        {allExpenses.map(e => (
          <div key={e.id} className="bg-white rounded-xl p-3 border border-stone-100 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => { if (confirm('حذف هذا المصروف؟')) store.deleteExpense(e.id); }} className="text-red-300 hover:text-red-500">
                <Trash2 size={14} />
              </button>
              <div>
                <p className="text-sm font-medium text-stone-800">{e.description}</p>
                <p className="text-xs text-stone-400">
                  <span className="inline-block bg-stone-100 px-1.5 py-0.5 rounded">{EXPENSE_CATEGORIES[e.category]}</span>
                  {' - '}{e.date}
                </p>
              </div>
            </div>
            <span className="text-sm font-bold text-red-600">{e.amount.toLocaleString()}</span>
          </div>
        ))}
        {allExpenses.length === 0 && (
          <p className="text-center text-stone-400 text-sm py-8">لا توجد مصروفات</p>
        )}
      </div>
    </div>
  );
}
