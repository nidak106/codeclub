import { useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { useAuth } from '../context/useAuth';

const DISCLAIMER_TEXT = 'The electricity consumption, fault detection, and forecasting data displayed in this application are calculated based on static CSV data files and statistical models, and do not represent real-time physical hardware measurements.';

export default function DisclaimerModal() {
  const { user, acceptDisclaimer } = useAuth();
  const [understood, setUnderstood] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user || user.disclaimer_accepted) return null;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await acceptDisclaimer();
    } catch (submitError) {
      setError(submitError.message);
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm" role="presentation">
      <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-3xl bg-white p-7 text-left shadow-2xl" role="dialog" aria-modal="true" aria-labelledby="disclaimer-title">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
          <AlertTriangle size={25} />
        </div>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Before you continue</p>
        <h2 id="disclaimer-title" className="mb-4 text-2xl font-black text-slate-900">Important data notice</h2>
        <p className="text-sm leading-7 text-slate-600">{DISCLAIMER_TEXT}</p>
        <label className="mt-6 flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-800">
          <input type="checkbox" checked={understood} onChange={(event) => setUnderstood(event.target.checked)} className="mt-0.5 h-5 w-5 accent-teal-600" />
          <span>I understand and agree</span>
        </label>
        {error && <p className="mt-3 text-sm font-medium text-red-600" role="alert">{error}</p>}
        <button type="submit" disabled={!understood || submitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 py-3.5 font-bold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40">
          {submitting ? 'Saving...' : <><Check size={18} /> Agree &amp; Continue</>}
        </button>
      </form>
    </div>
  );
}
