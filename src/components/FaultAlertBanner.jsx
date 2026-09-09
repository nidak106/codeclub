import { useState } from 'react';
import { AlertTriangle, Bell, Check, LoaderCircle, Mail, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { API_BASE_URL } from '../api';

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

function FaultAlertBanner({ alerts = [], title = 'Active fault alerts' }) {
  const { token } = useAuth();
  const [sendingIds, setSendingIds] = useState(() => new Set());
  const [sentIds, setSentIds] = useState(() => new Set());
  const [errorIds, setErrorIds] = useState(() => new Set());

  if (!alerts.length) return null;

  const sendAlertEmail = async (alert) => {
    const alertId = getAlertId(alert);
    setSendingIds((current) => new Set(current).add(alertId));
    setErrorIds((current) => {
      const next = new Set(current);
      next.delete(alertId);
      return next;
    });
    try {
      const response = await fetch(`${API_BASE_URL}/api/alerts/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          location: alert.location || 'Overall System',
          severity: alert.severity,
          zscore: alert.zscore,
          Date: alert.Date,
          Extra_Cost: alert.Extra_Cost,
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.status !== 'success') throw new Error(payload.error || 'Could not send the alert email.');
      setSentIds((current) => new Set(current).add(alertId));
    } catch {
      setErrorIds((current) => new Set(current).add(alertId));
    } finally {
      setSendingIds((current) => {
        const next = new Set(current);
        next.delete(alertId);
        return next;
      });
    }
  };

  return (
    <section className="mb-8 space-y-3" aria-label={title}>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-black uppercase tracking-[0.18em] text-slate-500">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
          {alerts.length} detected
        </span>
      </div>
      {alerts.map((alert) => {
        const severity = severityStyles[alert.severity] || severityStyles.info;
        const Icon = severity.Icon;
        const alertId = getAlertId(alert);
        const sending = sendingIds.has(alertId);
        const sent = sentIds.has(alertId);
        const failed = errorIds.has(alertId);

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
              {failed ? <p className="mt-1 text-xs font-bold text-red-700">Couldn&apos;t send the email. Try again.</p> : null}
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                disabled={sending || sent}
                onClick={() => sendAlertEmail(alert)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-3 py-2 text-xs font-bold hover:bg-white disabled:cursor-default disabled:opacity-60"
              >
                {sending ? <LoaderCircle size={14} className="animate-spin" /> : sent ? <Check size={14} /> : <Mail size={14} />}
                {sending ? 'Sending…' : sent ? 'Email sent' : 'Send alert email'}
              </button>
            </div>
          </div>
        );
      })}
    </section>
  );
}

export default FaultAlertBanner;