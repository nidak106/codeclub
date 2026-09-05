import { useEffect, useMemo, useState } from 'react';
import { Bell, Check, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const severityOrder = { critical: 0, warning: 1, info: 2 };

function HeaderAlertCenter() {
  const [alerts, setAlerts] = useState([]);
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState(() => new Set());

  const loadAlerts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/dashboard/stats`);
      const payload = await response.json();
      if (payload.status === 'success') setAlerts(payload.data?.anomalies || []);
    } catch {
      setAlerts([]);
    }
  };

  useEffect(() => {
    const refresh = window.setTimeout(loadAlerts, 0);
    const handleDataUpload = () => loadAlerts();
    window.addEventListener('energy-data-updated', handleDataUpload);
    return () => {
      window.clearTimeout(refresh);
      window.removeEventListener('energy-data-updated', handleDataUpload);
    };
  }, []);

  const sortedAlerts = useMemo(() => [...alerts].sort((a, b) => (severityOrder[a.severity] ?? 2) - (severityOrder[b.severity] ?? 2)), [alerts]);
  const alertId = (alert) => alert.id || `${alert.Date}-${alert.zscore}-${alert.Extra_Cost}`;
  const unreadAlerts = sortedAlerts.filter((alert) => !readIds.has(alertId(alert)));
  const unreadCount = unreadAlerts.filter((alert) => alert.severity === 'critical' || alert.severity === 'warning').length;

  const acknowledge = (id) => setReadIds((current) => new Set(current).add(id));
  const dismiss = (id) => {
    setAlerts((current) => current.filter((alert) => alertId(alert) !== id));
    setReadIds((current) => new Set(current).add(id));
  };

  return (
    <div className="relative">
      <button type="button" aria-label="Open alert center" onClick={() => setOpen((current) => !current)} className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800">
        <Bell size={20} />
        {unreadCount > 0 ? <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-black text-white">{unreadCount}</span> : null}
      </button>
      {open ? (
        <>
          <button type="button" aria-label="Close alert center" className="fixed inset-0 z-20 cursor-default" onClick={() => setOpen(false)} />
          <aside className="absolute right-0 z-30 mt-3 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:w-96">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div><h2 className="font-black text-slate-800">Alert Center</h2><p className="text-xs text-slate-400">{unreadCount} unread priority alerts</p></div>
              <button type="button" aria-label="Close alert center" onClick={() => setOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X size={16} /></button>
            </div>
            <div className="max-h-96 space-y-2 overflow-y-auto py-3">
              {sortedAlerts.length ? sortedAlerts.map((alert) => {
                const id = alertId(alert);
                const acknowledged = readIds.has(id);
                return <div key={id} className="rounded-xl border border-slate-100 p-3">
                  <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-black uppercase text-slate-500">{alert.severity}</p><p className="mt-1 text-sm font-semibold text-slate-800">{alert.Date} · {alert.zscore.toFixed(1)} sigma</p></div><span className="text-xs text-slate-400">PKR {alert.Extra_Cost.toFixed(0)}</span></div>
                  <div className="mt-2 flex gap-2"><button type="button" disabled={acknowledged} onClick={() => acknowledge(id)} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600 disabled:cursor-default disabled:opacity-60"><Check size={13} /> {acknowledged ? 'Acknowledged' : 'Acknowledge'}</button><button type="button" onClick={() => dismiss(id)} className="rounded-lg px-2 py-1 text-xs font-bold text-slate-400 hover:bg-red-50 hover:text-red-600">Dismiss</button></div>
                </div>;
              }) : <p className="py-8 text-center text-sm text-slate-400">No active alerts</p>}
            </div>
          </aside>
        </>
      ) : null}
    </div>
  );
}

export default HeaderAlertCenter;