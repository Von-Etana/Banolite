'use client';
import React from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Star, TrendingUp } from 'lucide-react';

export const Hero: React.FC = () => {
  const { toggleAuth, user, siteContent } = useStore();

  return (
    <section className="relative min-h-[90vh] flex items-center pt-24 pb-16 overflow-hidden bg-cream">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-40 -mt-40 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-40 -mb-40 w-[500px] h-[500px] bg-brand-accent5/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Column: Text Content */}
          <div className="flex flex-col items-start text-left max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-selar-border shadow-sm mb-6"
            >
              <span className="flex h-2 w-2 rounded-full bg-green-500 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              </span>
              <span className="text-sm font-semibold text-brand-dark">Over 10,000+ creators active</span>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <h1 className="font-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[76px] leading-[1.05] text-brand-dark tracking-[-2px] mb-6">
                {siteContent.heroHeadline || "Turn your knowledge into a"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-[#8F0182]">thriving business.</span>
              </h1>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <p className="text-brand-muted text-lg sm:text-xl md:text-2xl leading-relaxed mb-10 max-w-xl">
                {siteContent.heroSubheadline || "Empower your journey. Build your audience, sell digital products, and manage everything in one seamless platform."}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              {!user || user.role !== 'seller' ? (
                <button
                  onClick={toggleAuth}
                  className="btn-primary text-lg w-full sm:w-auto group flex items-center justify-center gap-2"
                >
                  Start for Free
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              ) : (
                <Link href="/dashboard" className="btn-primary text-lg w-full sm:w-auto">
                  Go to Dashboard
                </Link>
              )}
              <Link href="/products" className="btn-outline text-lg w-full sm:w-auto">
                Explore Marketplace
              </Link>
            </motion.div>
          </div>

          {/* Right Column: Image and Floating Assets */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3, type: "spring", bounce: 0.4 }}
            className="relative lg:ml-auto w-full max-w-lg xl:max-w-xl mx-auto md:mx-0"
          >
            {/* Main Image Container */}
            <div className="relative rounded-[32px] overflow-hidden shadow-elevated border-8 border-white bg-white z-10 flex items-center justify-center">
              <img
                src="/Black-Influencers-1.jpg"
                alt="Creator Platform"
                className="w-full h-auto object-contain"
                onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/20 to-transparent pointer-events-none" />
            </div>

            {/* Floating Glassmorphism Badge 1 */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -left-12 z-20 bg-white/80 backdrop-blur-md border border-white p-4 rounded-2xl shadow-card"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand-accent3 flex items-center justify-center text-brand-dark">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted font-semibold uppercase tracking-wider">Rating</p>
                  <p className="text-xl font-bold text-brand-dark">4.9/5.0</p>
                </div>
              </div>
            </motion.div>

            {/* Floating Glassmorphism Badge 2 */}
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-8 -right-8 z-20 bg-white/90 backdrop-blur-md border border-white p-4 rounded-2xl shadow-elevated"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-brand-dark flex items-center justify-center text-white">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-brand-muted font-semibold uppercase tracking-wider">Revenue</p>
                  <p className="text-2xl font-display font-bold text-brand-primary">+$12.5k</p>
                </div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};