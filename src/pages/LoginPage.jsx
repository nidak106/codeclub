import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Eye, EyeOff, Zap } from 'lucide-react';
import { useAuth } from '../context/useAuth';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      if (isRegistering) await register(form);
      else await login(form);
      navigate(location.state?.from || '/dashboard', { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-10 text-slate-900">
      <section className="w-full max-w-md rounded-[2rem] bg-white p-8 shadow-2xl sm:p-10">
        <Link to="/" className="mb-10 flex items-center gap-2 text-xl font-black italic text-slate-900"><span className="rounded-xl bg-teal-500 p-2 text-white"><Zap size={18} fill="currentColor" /></span> EnergySync</Link>
        <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-teal-700">Your energy workspace</p>
        <h1 className="text-3xl font-black text-slate-950">{isRegistering ? 'Create your account' : 'Welcome back'}</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">{isRegistering ? 'Start exploring your electricity analytics.' : 'Sign in to continue to your dashboard.'}</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block text-sm font-bold text-slate-700">Email<input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-normal outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" placeholder="you@example.com" /></label>
          <label className="block text-sm font-bold text-slate-700">Password<div className="relative mt-2"><input required minLength={8} type={showPassword ? 'text' : 'password'} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 font-normal outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100" placeholder="At least 8 characters" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></label>
          {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}
          <button disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3.5 font-bold text-white transition hover:bg-teal-700 disabled:opacity-50">{submitting ? 'Please wait...' : isRegistering ? 'Create account' : 'Sign in'} {!submitting && <ArrowRight size={18} />}</button>
        </form>
        <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="mt-7 w-full text-center text-sm font-semibold text-slate-500 hover:text-teal-700">{isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Create one"}</button>
      </section>
    </main>
  );
}
