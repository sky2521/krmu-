import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode, setAuthModalMode, login, register } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (authModalMode === 'login') {
        if (!email || !password) {
          setError('Please provide your email and password.');
          setLoading(false);
          return;
        }
        await login(email, password);
      } else {
        if (!name || !email || !password) {
          setError('Please fill in all required fields.');
          setLoading(false);
          return;
        }
        await register(name, email, password, phone);
      }
    } catch (err) {
      setError(err?.message || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClient = () => {
    login('kabir@example.com', 'password123');
  };

  const handleDemoAdmin = () => {
    login('admin@krmu-atelier.com', 'adminSecret2026');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white rounded-sm shadow-2xl p-8 border border-[#E6DED5]">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-[#7F7972] hover:text-[#121214] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <span className="font-serif text-3xl tracking-[0.25em] text-[#121214]">KRMU</span>
          <h3 className="font-serif text-xl text-[#121214] mt-2">
            {authModalMode === 'login' ? 'Client Identification' : 'Create Atelier Account'}
          </h3>
          <p className="text-xs text-[#7F7972] mt-1">
            {authModalMode === 'login'
              ? 'Access saved measurements, tracking, and curated selections.'
              : 'Join the KRMU client directory for tailored experiences.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-2.5 bg-red-50 text-red-700 text-xs text-center border border-red-200">
            {error}
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
                  className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3.5 py-2.5 text-xs text-[#121214] focus:outline-none focus:border-black"
                />
                <User className="w-4 h-4 text-[#9E988F] absolute right-3 top-3" />
              </div>
            </div>
          )}

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
                className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3.5 py-2.5 text-xs text-[#121214] focus:outline-none focus:border-black"
              />
              <Mail className="w-4 h-4 text-[#9E988F] absolute right-3 top-3" />
            </div>
          </div>

          {authModalMode === 'register' && (
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1">
                Phone Number (for SMS Tracking)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3.5 py-2.5 text-xs text-[#121214] focus:outline-none focus:border-black"
                />
                <Phone className="w-4 h-4 text-[#9E988F] absolute right-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider text-[#7F7972] mb-1">
              Password *
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D5C7B8] px-3.5 py-2.5 text-xs text-[#121214] focus:outline-none focus:border-black"
              />
              <Lock className="w-4 h-4 text-[#9E988F] absolute right-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#121214] text-white hover:bg-[#C5A059] transition-colors text-xs uppercase tracking-[0.2em] font-semibold mt-2 disabled:opacity-50"
          >
            {loading
              ? 'Connecting to Supabase...'
              : authModalMode === 'login'
              ? 'Sign In to Atelier'
              : 'Create Account'}
          </button>
        </form>

        {/* Demo Fast Login Buttons */}
        <div className="mt-6 pt-5 border-t border-[#F0ECE5]">
          <p className="text-[11px] text-center uppercase tracking-widest text-[#8C867E] mb-2.5 font-medium">
            Instant Demo Sign-In
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleDemoClient}
              className="py-2 px-3 border border-[#D5C7B8] text-[11px] font-semibold text-[#121214] hover:bg-[#F3EFEA] transition-colors text-center"
            >
              Client (Kabir)
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="py-2 px-3 bg-[#121214] text-[11px] font-semibold text-[#C5A059] hover:bg-black transition-colors text-center"
            >
              Admin Mode
            </button>
          </div>
        </div>

        {/* Switch mode */}
        <div className="mt-5 text-center text-xs text-[#7F7972]">
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
      </div>
    </div>
  );
}
