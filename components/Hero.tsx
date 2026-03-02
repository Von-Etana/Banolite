'use client';
import React from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const Hero: React.FC = () => {
  const { toggleAuth, user, siteContent } = useStore();

  return (
    <section className="pt-32 pb-24 relative overflow-hidden bg-cream flex flex-col items-center justify-center text-center">
      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display font-bold text-6xl md:text-7xl lg:text-[80px] leading-[1.05] text-brand-dark tracking-[-2px] mb-8">
            {siteContent.heroHeadline || "Level up. From creator to entrepreneur."}
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <p className="text-brand-muted text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed mb-10">
            {siteContent.heroSubheadline || "You make the content, you reap the rewards. Grow your business, not theirs."}
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {!user || user.role !== 'seller' ? (
            <button
              onClick={toggleAuth}
              className="btn-primary text-lg"
            >
              Start for Free
            </button>
          ) : (
            <Link href="/dashboard" className="btn-primary text-lg">
              Go to Dashboard
            </Link>
          )}
          <Link href="/products" className="btn-outline text-lg">
            Explore Marketplace
          </Link>
        </motion.div>

        {/* Hero Mockup or Image placeholder */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="mt-20 w-full max-w-5xl mx-auto relative rounded-[32px] overflow-hidden shadow-elevated border-8 border-white bg-white">
          <div className="aspect-[16/9] w-full bg-brand-bgDark relative overflow-hidden flex items-center justify-center">
            {/* Simulated App UI */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF3E14]/10 to-[#8F0182]/10" />
            <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200" alt="Platform dashboard" className="w-full h-full object-cover opacity-80" />
          </div>
        </motion.div>

      </div>
    </section>
  );
};