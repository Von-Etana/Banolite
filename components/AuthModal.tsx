'use client';
import React, { useState } from 'react';
import { X, Mail, Lock, User, Github, Eye, EyeOff, Store, ShoppingBag, CheckCircle, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, toggleAuth, login, register, loginAsDemo } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer' as UserRole,
  });

  if (!isAuthOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (!result.success) {
          setError(result.error || 'Login failed');
        }
      } else {
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setIsLoading(false);
          return;
        }
        const result = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        });
        if (!result.success) {
          setError(result.error || 'Registration failed');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }

    setIsLoading(false);
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setFormData({ name: '', email: '', password: '', role: 'buyer' });
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 8) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 75, label: 'Good', color: 'bg-blue-500' };
    }
    if (password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return { strength: 100, label: 'Strong', color: 'bg-green-500' };
    }
    return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-[80] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-elevated border border-gray-100 relative animate-scale-in">
        <button
          onClick={toggleAuth}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8 text-center">
          <div className="w-16 h-16 bg-brand-primary shadow-md shadow-brand-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
            {isLogin ? <User className="w-8 h-8" /> : <CheckCircle className="w-8 h-8" />}
          </div>

          <h2 className="text-3xl font-display font-extrabold text-brand-dark mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-sm mb-8">
            {isLogin ? 'Enter your details to access your account' : 'Join Banolite to buy or sell digital products'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 text-left">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 ml-1 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 pl-12 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/50 shadow-sm transition-all text-sm font-medium"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 ml-1 uppercase tracking-wider">I want to</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'buyer' })}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'buyer'
                        ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                        : 'border-gray-100 bg-gray-50 hover:border-gray-300'
                        }`}
                    >
                      <ShoppingBag className={`w-6 h-6 ${formData.role === 'buyer' ? 'text-brand-primary' : 'text-gray-400'}`} />
                      <span className={`text-sm font-bold ${formData.role === 'buyer' ? 'text-brand-primary' : 'text-gray-600'}`}>
                        Buy Products
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, role: 'seller' })}
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.role === 'seller'
                        ? 'border-brand-primary bg-brand-primary/5 shadow-sm'
                        : 'border-gray-100 bg-gray-50 hover:border-gray-300'
                        }`}
                    >
                      <Store className={`w-6 h-6 ${formData.role === 'seller' ? 'text-brand-primary' : 'text-gray-400'}`} />
                      <span className={`text-sm font-bold ${formData.role === 'seller' ? 'text-brand-primary' : 'text-gray-600'}`}>
                        Sell Products
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 ml-1 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 pl-12 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/50 shadow-sm transition-all text-sm font-medium"
                  placeholder="you@company.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2 ml-1 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 pl-12 pr-12 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/50 shadow-sm transition-all text-sm font-medium"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password strength indicator (only for registration) */}
              {!isLogin && formData.password && (
                <div className="mt-3">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${passwordStrength.strength}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5 font-medium flex justify-between">
                    <span>Password strength</span>
                    <span className={`font-bold ${passwordStrength.color.replace('bg-', 'text-')}`}>{passwordStrength.label}</span>
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold text-base flex items-center justify-center gap-2 hover:bg-brand-primary/90 transition-all shadow-md hover:shadow-lg disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          <div className="mt-8 mb-6 flex items-center gap-4">
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Or</span>
            <div className="h-px bg-gray-200 flex-1"></div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => loginAsDemo('buyer')}
              className="py-3 px-4 bg-brand-primary/10 text-brand-primary rounded-2xl text-sm font-bold hover:bg-brand-primary hover:text-white transition-all shadow-sm flex items-center justify-center"
            >
              Demo Buyer
            </button>
            <button
              onClick={() => loginAsDemo('seller')}
              className="py-3 px-4 bg-brand-dark/10 text-brand-dark rounded-2xl text-sm font-bold hover:bg-brand-dark hover:text-white transition-all shadow-sm flex items-center justify-center"
              title="Access Seller Dashboard"
            >
              Demo Seller
            </button>
          </div>

          <p className="mt-6 text-sm text-gray-500 font-medium pt-6 border-t border-gray-100">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={switchMode}
              className="font-bold text-brand-primary hover:text-brand-dark transition-colors"
            >
              {isLogin ? 'Sign up for free' : 'Log in here'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};