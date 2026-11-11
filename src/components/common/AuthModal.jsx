import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  Phone,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  Database,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    register,
    resendConfirmation,
    sendPasswordReset,
    completePasswordReset,
  } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [pendingConfirmEmail, setPendingConfirmEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setError('');
    setInfoMessage('');
  }, [authModalMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const isEmailNotConfirmedError =
    error && error.toLowerCase().includes('email not confirmed');

  const handleResendEmail = async (targetEmail) => {
    const cleanTarget = (targetEmail || email).trim();
    if (!cleanTarget) return;
    setLoading(true);
    setError('');
    const res = await resendConfirmation(cleanTarget);
    setLoading(false);
    if (res.success) {
      setInfoMessage(`Verification link resent to ${cleanTarget}. Please check your inbox.`);
    } else {
      setError(res.error || 'Could not resend verification email.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setInfoMessage('');
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        if (!email.trim() || !password) {
          setError('Please enter your email address and password.');
          return;
        }
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || 'Invalid login credentials.');
        } else {
          setPassword('');
        }
      } else if (authModalMode === 'register') {
        if (!name.trim() || !email.trim() || !password) {
          setError('Please complete all required fields.');
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters.');
          return;
        }
        const res = await register(name, email, password, phone);
        if (!res.success) {
          setError(res.error || 'Could not create your account.');
        } else if (res.needsEmailConfirmation) {
          setPendingConfirmEmail(res.email || email.trim());
          setPassword('');
        } else {
          setPassword('');
        }
      } else if (authModalMode === 'forgot') {
        if (!email.trim()) {
          setError('Please enter your registered email address.');
          return;
        }
        const res = await sendPasswordReset(email);
        if (!res.success) {
          setError(res.error || 'Failed to send password reset email.');
        } else {
          setInfoMessage(
            `Password recovery link sent to ${email.trim()}. Check your inbox to reset.`
          );
        }
      } else if (authModalMode === 'recovery') {
        if (password.length < 6) {
          setError('New password must be at least 6 characters.');
          return;
        }
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        const res = await completePasswordReset(password);
        if (!res.success) {
          setError(res.error || 'Could not update password.');
        } else {
          setPassword('');
          setConfirmPassword('');
        }
      }
    } catch (err) {
      setError(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setPendingConfirmEmail('');
    setError('');
    setInfoMessage('');
    setIsAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-sm shadow-2xl p-8 border border-[#E6DED5]">
        <button
          onClick={resetAndClose}
          className="absolute top-4 right-4 text-[#7F7972] hover:text-[#121214] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="font-serif text-3xl tracking-[0.25em] text-[#121214]">
            KRMU
          </span>
          <h3 className="font-serif text-xl text-[#121214] mt-2">
            {pendingConfirmEmail
              ? 'Verify Your Email'
              : authModalMode === 'login'
              ? 'Client Sign In'
              : authModalMode === 'register'
              ? 'Create Atelier Account'
              : authModalMode === 'forgot'
              ? 'Reset Account Password'
              : 'Choose New Password'}
          </h3>
          <p className="text-xs text-[#7F7972] mt-1">
            {pendingConfirmEmail
              ? 'One final verification step to activate your account.'
              : authModalMode === 'login'
              ? 'Sign in with your Supabase-secured KRMU account.'
              : authModalMode === 'register'
              ? 'Create a real account stored securely in KRMU Supabase.'
              : authModalMode === 'forgot'
              ? 'We will email you a secure password recovery link.'
              : 'Enter a new password for your KRMU account.'}
          </p>
        </div>

        {pendingConfirmEmail ? (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-sm space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <p className="text-xs text-emerald-900 font-semibold">
                Confirmation link sent to {pendingConfirmEmail}
              </p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Your profile has been created in KRMU. Please click the verification
                link in your inbox, then sign in below.
              </p>
            </div>

            {infoMessage && (
              <div className="p-2.5 bg-emerald-50 text-emerald-800 text-xs border border-emerald-200 rounded-sm">
                {infoMessage}
              </div>
            )}
            {error && (
              <div className="p-2.5 bg-red-50 text-red-700 text-xs border border-red-200 rounded-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                disabled={loading}
                onClick={() => handleResendEmail(pendingConfirmEmail)}
                className="w-full py-2.5 border border-[#D5C7B8] text-xs uppercase tracking-widest font-semibold text-[#121214] hover:bg-[#FAF8F5] disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Resend Verification Email'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmail(pendingConfirmEmail);
                  setPendingConfirmEmail('');
                  setAuthModalMode('login');
                }}
                className="w-full py-3 bg-[#121214] text-white hover:bg-[#C5A059] transition-colors text-xs uppercase tracking-[0.2em] font-semibold"
              >
                Proceed to Sign In
              </button>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-xs text-center border border-red-200 rounded-sm space-y-1.5">
                <p>{error}</p>
                {isEmailNotConfirmedError && email && (
                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => handleResendEmail(email)}
                    className="underline font-semibold text-red-900 hover:text-black"
                  >
                    Resend confirmation email
                  </button>
                )}
              </div>
            )}

            {infoMessage && (
              <div className="mb-4 p-2.5 bg-emerald-50 text-emerald-800 text-xs text-center border border-emerald-200 rounded-sm">
                {infoMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {authModalMode === 'register' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kabir Mehra"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3.5 py-2.5 pr-9 text-xs text-[#121214] focus:outline-none focus:border-black"
                    />
                    <User className="w-4 h-4 text-[#9E988F] absolute right-3 top-3" />
                  </div>
                </div>
              )}

              {authModalMode !== 'recovery' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="client@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3.5 py-2.5 pr-9 text-xs text-[#121214] focus:outline-none focus:border-black"
                    />
                    <Mail className="w-4 h-4 text-[#9E988F] absolute right-3 top-3" />
                  </div>
                </div>
              )}

              {authModalMode === 'register' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1">
                    Phone Number (Optional)
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3.5 py-2.5 pr-9 text-xs text-[#121214] focus:outline-none focus:border-black"
                    />
                    <Phone className="w-4 h-4 text-[#9E988F] absolute right-3 top-3" />
                  </div>
                </div>
              )}

              {authModalMode !== 'forgot' && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs uppercase tracking-wider text-[#7F7972]">
                      {authModalMode === 'recovery' ? 'New Password *' : 'Password *'}
                    </label>
                    {authModalMode === 'login' && (
                      <button
                        type="button"
                        onClick={() => setAuthModalMode('forgot')}
                        className="text-[11px] text-[#7F7972] underline hover:text-[#121214]"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder={
                        authModalMode === 'register' || authModalMode === 'recovery'
                          ? 'Minimum 6 characters'
                          : '••••••••••••'
                      }
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3.5 py-2.5 pr-16 text-xs text-[#121214] focus:outline-none focus:border-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-8 top-2.5 text-[#9E988F] hover:text-[#121214]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <Lock className="w-4 h-4 text-[#9E988F] absolute right-3 top-3" />
                  </div>
                </div>
              )}

              {authModalMode === 'recovery' && (
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1">
                    Confirm New Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3.5 py-2.5 pr-9 text-xs text-[#121214] focus:outline-none focus:border-black"
                    />
                    <ShieldCheck className="w-4 h-4 text-[#9E988F] absolute right-3 top-3" />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#121214] text-white hover:bg-[#C5A059] transition-colors text-xs uppercase tracking-[0.2em] font-semibold mt-2 disabled:opacity-50"
              >
                {loading
                  ? 'Connecting to Supabase...'
                  : authModalMode === 'login'
                  ? 'Sign In to Atelier'
                  : authModalMode === 'register'
                  ? 'Create Account'
                  : authModalMode === 'forgot'
                  ? 'Send Recovery Email'
                  : 'Update Password'}
              </button>
            </form>

            <div className="mt-5 pt-4 border-t border-[#F0ECE5] flex items-center justify-center gap-1.5 text-[11px] text-[#7F7972]">
              <Database className="w-3.5 h-3.5 text-emerald-600" />
              <span>Secured by Supabase Authentication & Postgres RLS</span>
            </div>

            {/* Switch mode */}
            <div className="mt-4 text-center text-xs text-[#7F7972]">
              {authModalMode === 'login' ? (
                <p>
                  New to KRMU?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('register')}
                    className="text-[#121214] underline font-semibold hover:text-[#C5A059]"
                  >
                    Create an account
                  </button>
                </p>
              ) : (
                <p>
                  Already registered?{' '}
                  <button
                    type="button"
                    onClick={() => setAuthModalMode('login')}
                    className="text-[#121214] underline font-semibold hover:text-[#C5A059]"
                  >
                    Sign in here
                  </button>
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
