import { Home, PlusCircle, Users, Calendar, Receipt, Shield, Landmark, BarChart3, Settings } from 'lucide-react';
import { Page } from '../store/types';

interface NavProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const NAV: { page: Page; label: string; icon: React.ElementType }[] = [
  { page: 'home',      label: 'الرئيسية',  icon: Home },
  { page: 'newJob',    label: 'شغل جديد', icon: PlusCircle },
  { page: 'customers', label: 'العملاء',   icon: Users },
  { page: 'daily',     label: 'كشف اليوم', icon: Calendar },
  { page: 'expenses',  label: 'المصروفات', icon: Receipt },
  { page: 'trusts',    label: 'الأمانات',  icon: Shield },
  { page: 'vault',     label: 'الخزنة',    icon: Landmark },
  { page: 'reports',   label: 'التقارير',  icon: BarChart3 },
  { page: 'settings',  label: 'الإعدادات', icon: Settings },
];

export default function Navigation({ currentPage, onNavigate }: NavProps) {
  return (
    <nav className="bg-white border-b border-stone-200 shadow-sm sticky top-0 z-40">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-1 px-2 py-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1 min-w-max">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-700 flex items-center justify-center ml-2 flex-shrink-0">
              <span className="text-white text-xs font-bold">وذ</span>
            </div>
            {NAV.map(({ page, label, icon: Icon }) => (
              <button
                key={page}
                onClick={() => onNavigate(page)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  currentPage === page
                    ? 'bg-yellow-600 text-white shadow-md'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Icon size={15} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
