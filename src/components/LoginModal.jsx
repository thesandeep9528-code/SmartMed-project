import { useState } from 'react';
import { X, Mail, Lock, Zap, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginModal({ onClose }) {
  const { signIn, signUp, loginAsGuest, isMockMode } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (!email || !password) {
      setError('Email and password are required.');
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = isSignUp
        ? await signUp(email, password)
        : await signIn(email, password);

      if (authError) {
        setError(authError.message);
      } else {
        if (isSignUp) {
          setSuccess('Account created! Check your email to confirm, or log in directly if using Mock Mode.');
        } else {
          onClose();
        }
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative w-full max-w-md bg-gray-900 border border-gray-700 rounded-3xl shadow-2xl p-8 animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-500/10 rounded-2xl mb-4 border border-primary-500/20">
            <ShieldCheck className="w-7 h-7 text-primary-400" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="text-gray-400 text-sm mt-2">
            {isMockMode
              ? 'Running in Demo / Mock Mode — no real backend needed.'
              : 'Sign in to access your SmartMed dashboard.'}
          </p>
          {isMockMode && (
            <span className="mt-2 inline-block bg-orange-500/10 text-orange-400 border border-orange-500/20 text-xs px-3 py-1 rounded-full font-bold">
              Mock Auth Mode Active
            </span>
          )}
        </div>

        {/* One-Click Guest Login */}
        <button
          onClick={handleGuestLogin}
          className="w-full flex items-center justify-center gap-2 mb-6 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-primary-500/20 transition-all"
        >
          <Zap className="w-4 h-4" />
          Continue as Guest (Demo Mode)
        </button>

        <div className="relative flex items-center gap-4 mb-6">
          <div className="flex-1 h-px bg-gray-700" />
          <span className="text-gray-500 text-xs font-medium">or with email</span>
          <div className="flex-1 h-px bg-gray-700" />
        </div>

        {/* Email / Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-primary-500 transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl px-4 py-3">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-sm rounded-xl px-4 py-3">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-bold transition-all disabled:opacity-60"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <p className="text-center text-gray-500 text-sm mt-6">
          {isSignUp ? 'Already have an account? ' : 'No account yet? '}
          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccess(''); }}
            className="text-primary-400 font-bold hover:underline"
          >
            {isSignUp ? 'Sign In' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  );
}
