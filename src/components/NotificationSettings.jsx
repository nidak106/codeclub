import { useEffect, useState } from 'react';
import { Bell, Check, LoaderCircle, Mail, X } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { API_BASE_URL } from '../api';

function NotificationSettings() {
  const { user, token } = useAuth();
  const [enabled, setEnabled] = useState(Boolean(user?.email_notifications_enabled));
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setEnabled(Boolean(user?.email_notifications_enabled));
  }, [user?.email_notifications_enabled]);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.setTimeout(() => setToast(null), 4000);
  };

  const updatePreference = async (nextEnabled) => {
    setEnabled(nextEnabled);
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email_notifications_enabled: nextEnabled }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.status !== 'success') throw new Error(payload.error || 'Could not update notification settings.');
      showToast('success', nextEnabled ? 'Critical email alerts enabled.' : 'Critical email alerts disabled.');
    } catch (error) {
      setEnabled(!nextEnabled);
      showToast('error', error.message);
    } finally {
      setSaving(false);
    }
  };

  const sendTestEmail = async () => {
    setSending(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/user/send-test-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || payload.status !== 'success') throw new Error(payload.error || 'Could not send the test email.');
      showToast('success', 'Test alert email sent. Check your inbox.');
    } catch (error) {
      showToast('error', error.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mt-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm" aria-labelledby="notification-settings-title">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-blue-50 p-2 text-blue-700"><Bell size={18} /></div>
        <div className="min-w-0 flex-1">
          <h2 id="notification-settings-title" className="text-sm font-semibold text-gray-900">Email notifications</h2>
          <p className="mt-1 text-xs leading-5 text-gray-500">Receive email alerts for critical faults.</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          aria-label="Receive email alerts for critical faults"
          disabled={saving}
          onClick={() => updatePreference(!enabled)}
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'} disabled:cursor-wait disabled:opacity-60`}
        >
          <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
      <button
        type="button"
        onClick={sendTestEmail}
        disabled={sending}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60"
      >
        {sending ? <LoaderCircle size={14} className="animate-spin" /> : <Mail size={14} />}
        Send Test Alert Email
      </button>
      {toast ? (
        <div role="status" className={`mt-3 flex items-start gap-2 rounded-lg px-3 py-2 text-xs font-medium ${toast.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {toast.type === 'success' ? <Check size={14} className="mt-0.5 shrink-0" /> : <X size={14} className="mt-0.5 shrink-0" />}
          <span>{toast.message}</span>
        </div>
      ) : null}
    </section>
  );
}

export default NotificationSettings;
