import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { toast } from 'react-toastify';

const RATE_LIMIT_COOLDOWN_MS = 60 * 1000; // 1 minute cooldown after rate limit

const LoginPanel = ({ onSuccess, showVendorLink = false, onVendorRegister, isAdminLogin = false }) => {
  const [currentState, setCurrentState] = useState('Login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const lastAttemptRef = useRef(0);
  const cooldownUntilRef = useRef(0);

  const isRateLimited = () => Date.now() < cooldownUntilRef.current;

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (!supabase) {
      toast.error('Database not configured. Please add Supabase credentials.');
      return;
    }
    if (isRateLimited()) {
      const mins = Math.ceil((cooldownUntilRef.current - Date.now()) / 60000);
      toast.error(`Please wait ${mins} minute(s) before trying again. Email service is temporarily busy.`);
      return;
    }
    setLoading(true);
    lastAttemptRef.current = Date.now();
    try {
      if (currentState === 'Login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (isAdminLogin) {
          const adminEmails = ['daniyalijaz922@gmail.com'];
          if (!adminEmails.includes(email)) {
            await supabase.auth.signOut();
            throw new Error('Admin access only. Please use the main site to sign in.');
          }
        }
        toast.success('Welcome back!');
        onSuccess?.();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        toast.success('Account created! Check your email to confirm.');
        setCurrentState('Login');
      }
    } catch (err) {
      const msg = err?.message || '';
      if (msg.toLowerCase().includes('rate limit') || msg.toLowerCase().includes('email') && msg.toLowerCase().includes('limit')) {
        cooldownUntilRef.current = Date.now() + RATE_LIMIT_COOLDOWN_MS;
        toast.error('Email service is busy. Please wait a few minutes before trying again.');
      } else {
        toast.error(msg || 'Something went wrong');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!supabase) {
      toast.error('Database not configured. Please add Supabase credentials.');
      return;
    }
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      toast.error(err.message || 'Google sign-in failed');
    }
  };

  return (
    <form onSubmit={onSubmitHandler} className="flex flex-col gap-4 text-stone-800">
      <div className="inline-flex items-center gap-2 mb-1">
        <p className="prata-regular text-2xl sm:text-3xl">{currentState}</p>
        <span className="w-8 h-px bg-terracotta-500" />
      </div>

      {currentState === 'Sign Up' && (
        <input
          type="text"
          className="w-full px-3 py-2.5 border border-cream-300 rounded-xl focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-400 outline-none transition bg-white"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      )}

      <input
        type="email"
        className="w-full px-3 py-2.5 border border-cream-300 rounded-xl focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-400 outline-none transition bg-white"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        className="w-full px-3 py-2.5 border border-cream-300 rounded-xl focus:ring-2 focus:ring-terracotta-200 focus:border-terracotta-400 outline-none transition bg-white"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
      />

      <div className="w-full flex justify-between text-sm">
        <p className="cursor-pointer text-stone-500 hover:text-terracotta-500 transition-colors">
          Forgot your password?
        </p>
        {currentState === 'Login' ? (
          <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer font-medium">
            Create account
          </p>
        ) : (
          <p onClick={() => setCurrentState('Login')} className="cursor-pointer font-medium">
            Login here
          </p>
        )}
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={loading}
        className="w-full bg-stone-900 text-cream-100 font-medium px-8 py-3 rounded-xl hover:bg-stone-800 transition-colors disabled:opacity-50"
      >
        {loading ? 'Please wait...' : currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </motion.button>

      <div className="w-full flex items-center my-1">
        <span className="flex-1 h-px bg-cream-200" />
        <span className="mx-2 text-[11px] uppercase tracking-[0.2em] text-stone-400">or</span>
        <span className="flex-1 h-px bg-cream-200" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        className="w-full border border-cream-300 bg-white text-sm px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 hover:border-terracotta-400 hover:bg-cream-50 transition-colors"
      >
        <span className="w-4 h-4 rounded-full bg-gradient-to-br from-yellow-400 via-red-500 to-blue-500" />
        <span>Continue with Google</span>
      </button>

      {showVendorLink && (
        <button
          type="button"
          onClick={onVendorRegister}
          className="text-sm text-terracotta-600 hover:text-terracotta-700 text-left"
        >
          Register your business (Vendor)
        </button>
      )}
    </form>
  );
};

export default LoginPanel;

