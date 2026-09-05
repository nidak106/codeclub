import { useState } from 'react';
import { AlertTriangle, Bell, ShieldAlert } from 'lucide-react';

const severityStyles = {
  critical: {
    container: 'border-red-200 bg-red-50 text-red-900',
    icon: 'bg-red-100 text-red-600',
    Icon: ShieldAlert,
  },
  warning: {
    container: 'border-amber-200 bg-amber-50 text-amber-900',
    icon: 'bg-amber-100 text-amber-600',
    Icon: AlertTriangle,
  },
  info: {
    container: 'border-blue-200 bg-blue-50 text-blue-900',
    icon: 'bg-blue-100 text-blue-600',
    Icon: Bell,
  },
};

const getAlertId = (alert) => alert.id || `${alert.Date}-${alert.zscore}-${alert.Extra_Cost}`;

function FaultAlertBanner({ alerts = [], onDismiss, onAcknowledge, title = 'Active fault alerts' }) {
  const [dismissedIds, setDismissedIds] = useState(() => new Set());
  const [acknowledgedIds, setAcknowledgedIds] = useState(() => new Set());
  const visibleAlerts = alerts.filter((alert) => !dismissedIds.has(getAlertId(alert)));

  if (!visibleAlerts.length) return null;

  return (
    <section className="mb-8 space-y-3" aria-label={title}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {visibleAlerts.length} detected
        </span>
      </div>
      {visibleAlerts.map((alert) => {
        const severity = severityStyles[alert.severity] || severityStyles.info;
        const Icon = severity.Icon;
        const alertId = getAlertId(alert);
        const acknowledged = acknowledgedIds.has(alertId);

        return (
          <div key={alertId} className={`flex flex-col gap-4 rounded-2xl border p-4 shadow-sm sm:flex-row sm:items-center ${severity.container}`}>
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${severity.icon}`}>
              <Icon size={20} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-black capitalize">{alert.severity || 'info'} alert</p>
                {alert.Date ? <span className="text-xs opacity-70">{alert.Date}</span> : null}
              </div>
              <p className="mt-1 text-sm opacity-80">
                {alert.Total_Consumption?.toFixed?.(1) || alert.Total_Consumption} kWh detected at {Math.abs(alert.zscore || 0).toFixed(1)} sigma.
                {alert.Extra_Cost > 0 ? ` Estimated extra cost: PKR ${alert.Extra_Cost.toFixed(0)}.` : ''}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button type="button" disabled={acknowledged} onClick={() => { setAcknowledgedIds((current) => new Set(current).add(alertId)); onAcknowledge?.(alertId); }} className="rounded-lg bg-white/70 px-3 py-2 text-xs font-bold hover:bg-white disabled:cursor-default disabled:opacity-60">
                {acknowledged ? 'Acknowledged' : 'Acknowledge'}
              </button>
              <button type="button" onClick={() => { setDismissedIds((current) => new Set(current).add(alertId)); onDismiss?.(alertId); }} className="rounded-lg px-3 py-2 text-xs font-bold opacity-70 hover:bg-white/50">
                Dismiss
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default FaultAlertBanner;