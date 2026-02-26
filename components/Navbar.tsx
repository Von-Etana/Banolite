'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, User as UserIcon, LogOut, LayoutDashboard, BookOpen, Shield, Coins, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCurrency } from '../context/CurrencyContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/discover', label: 'Discover' },
  { href: '/products', label: 'Marketplace' },
];

export const Navbar: React.FC = () => {
  const { toggleCart, cart, user, toggleAuth, logout } = useStore();
  const { currency, toggleCurrency } = useCurrency();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' as const }}
        className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrolled
          ? 'bg-white/95 backdrop-blur-sm border-b border-selar-border shadow-subtle'
          : 'bg-white border-b border-transparent'
          }`}
      >
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-brand-dark rounded-lg flex items-center justify-center text-white font-bold text-sm">
              R
            </div>
            <span className="font-display font-bold text-lg text-brand-dark">Redex</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive ? 'text-brand-dark' : 'text-brand-muted hover:text-brand-dark'
                    }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-dark rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {user && (
              <Link
                href="/library"
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${pathname === '/library' ? 'text-brand-dark' : 'text-brand-muted hover:text-brand-dark'
                  }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Library
                {pathname === '/library' && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 bg-brand-dark rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )}

            {user?.role === 'seller' && (
              <Link href="/dashboard" className="text-brand-dark font-semibold text-sm flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-brand-light transition-colors">
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
            )}

            {user?.role === 'admin' && (
              <Link href="/admin" className="text-red-600 font-semibold text-sm flex items-center gap-1.5 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                <Shield className="w-3.5 h-3.5" />
                Admin
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleCurrency}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-light text-brand-dark hover:bg-gray-200 transition-colors"
            >
              <Coins className="w-3 h-3 text-brand-muted" />
              {currency}
            </button>

            <button className="hidden sm:flex items-center justify-center w-9 h-9 rounded-lg text-brand-muted hover:bg-brand-light hover:text-brand-dark transition-colors">
              <Search className="w-4 h-4" />
            </button>

            {user ? (
              <div className="hidden md:flex items-center gap-2 pl-2 pr-1.5 py-1.5 bg-brand-light rounded-lg">
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
                  alt={user.name}
                  className="w-6 h-6 rounded-md"
                />
                <span className="text-xs font-semibold text-brand-dark">{user.name.split(' ')[0]}</span>
                <button
                  onClick={logout}
                  className="w-7 h-7 rounded-md bg-white flex items-center justify-center text-brand-muted hover:text-red-500 transition-colors"
                  title="Log Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={toggleAuth}
                className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-brand-muted hover:bg-brand-light hover:text-brand-dark transition-colors"
              >
                <UserIcon className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={toggleCart}
              className="bg-brand-dark px-4 py-2 rounded-lg text-white font-semibold text-xs flex items-center gap-2 hover:bg-brand-dark/90 transition-colors relative"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bag</span>
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-brand-purple text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-brand-dark hover:bg-brand-light transition-colors"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-30 bg-white border-b border-selar-border shadow-elevated p-4 md:hidden"
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${pathname === link.href ? 'bg-brand-light text-brand-dark font-semibold' : 'text-brand-muted hover:bg-brand-light'
                    }`}
                >
                  {link.label}
                </Link>
              ))}
              {user && (
                <Link href="/library" className="px-4 py-3 rounded-xl text-sm font-medium text-brand-muted hover:bg-brand-light flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> My Library
                </Link>
              )}
              {user?.role === 'seller' && (
                <Link href="/dashboard" className="px-4 py-3 rounded-xl text-sm font-medium text-brand-dark hover:bg-brand-light flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}
              {!user && (
                <button onClick={toggleAuth} className="px-4 py-3 rounded-xl text-sm font-medium text-brand-purple hover:bg-brand-light text-left flex items-center gap-2">
                  <UserIcon className="w-4 h-4" /> Sign In
                </button>
              )}
              {user && (
                <button onClick={logout} className="px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 text-left flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};