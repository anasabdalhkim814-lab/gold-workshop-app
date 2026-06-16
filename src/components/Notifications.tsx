import { AlertTriangle, Bell, ShieldAlert, Wallet } from 'lucide-react';
import { useStoreContext } from '../store/StoreContext';

export default function Notifications() {
  const store = useStoreContext();
  const alerts: { id: string; type: 'danger' | 'warning' | 'info'; message: string; icon: React.ElementType }[] = [];

  if (store.totalDebt > store.settings.debtLimit) {
    alerts.push({ id: 'debt', type: 'danger', message: `المديونية تجاوزت الحد! (${store.totalDebt.toLocaleString()} ريال)`, icon: AlertTriangle });
  }
  if (store.vaultCash.yemeniRiyal < store.settings.vaultLowBalance) {
    alerts.push({ id: 'vault', type: 'warning', message: `رصيد الخزنة منخفض (${store.vaultCash.yemeniRiyal.toLocaleString()} ريال)`, icon: Wallet });
  }
  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const oldTrusts = store.trustItems.filter(t => t.pieceStatus === 'with_me' && new Date(t.date) < weekAgo);
  if (oldTrusts.length > 0) {
    alerts.push({ id: 'trust', type: 'warning', message: `${oldTrusts.length} أمانة تجاوزت أسبوعاً`, icon: ShieldAlert });
  }
  if (store.todayExpenseTotal > 5000) {
    alerts.push({ id: 'expenses', type: 'warning', message: `المصروفات مرتفعة اليوم (${store.todayExpenseTotal.toLocaleString()} ريال)`, icon: Bell });
  }
  if (new Date().getHours() >= 16 && store.todayJobs.some(j => j.status === 'deferred' || j.status === 'partial')) {
    alerts.push({ id: 'afternoon', type: 'info', message: 'تذكير: لديك شغل آجل اليوم', icon: Bell });
  }

  if (alerts.length === 0) return null;

  const colors = {
    danger:  'bg-red-50 border-red-300 text-red-800',
    warning: 'bg-amber-50 border-amber-300 text-amber-800',
    info:    'bg-blue-50 border-blue-300 text-blue-800',
  };

  return (
    <div className="space-y-2 mb-4">
      {alerts.map(a => {
        const Icon = a.icon;
        return (
          <div key={a.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm animate-fadeInUp ${colors[a.type]}`}>
            <Icon size={15} />
            <span>{a.message}</span>
          </div>
        );
      })}
    </div>
  );
}
