'use client';
import React from 'react';
import { ArrowRight, Rocket, Gem, Target } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const CTASection: React.FC = () => {
  const { toggleAuth, user } = useStore();

  return (
    <section className="py-20 container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.5 }}
        className="bg-brand-dark rounded-2xl p-12 md:p-20 text-center relative overflow-hidden"
      >
        {/* Floating geometric shapes */}
        <motion.div
          animate={{ y: [-8, 8, -8] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const }}
          className="absolute top-12 left-12 w-12 h-12 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center"
        >
          <Rocket className="w-5 h-5 text-white/30" />
        </motion.div>
        <motion.div
          animate={{ y: [6, -6, 6] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' as const }}
          className="absolute top-16 right-16 w-10 h-10 bg-white/5 rounded-full border border-white/10 flex items-center justify-center"
        >
          <Gem className="w-4 h-4 text-white/30" />
        </motion.div>
        <motion.div
          animate={{ y: [-5, 5, -5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' as const }}
          className="absolute bottom-16 left-1/4 w-8 h-8 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center"
        >
          <Target className="w-3 h-3 text-white/30" />
        </motion.div>

        <span className="text-xs font-semibold tracking-widest text-white/40 uppercase mb-4 block">Get Started</span>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-white mb-8 leading-tight">
          Ready to launch your<br />Digital Empire?
        </h2>

        <div className="flex justify-center">
          {user ? (
            <Link
              href="/products"
              className="bg-white px-8 py-4 rounded-xl flex items-center gap-2 font-bold text-brand-dark hover:shadow-elevated transition-all group text-sm"
            >
              View Marketplace
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <button
              onClick={toggleAuth}
              className="bg-white px-8 py-4 rounded-xl flex items-center gap-2 font-bold text-brand-dark hover:shadow-elevated transition-all group text-sm"
            >
              Join as Creator
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </div>
      </motion.div>
    </section>
  );
};