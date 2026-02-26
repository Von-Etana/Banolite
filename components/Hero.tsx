'use client';
import React from 'react';
import { ArrowUpRight, Sparkles, PlusCircle, TrendingUp, Package, Users } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

const stats = [
  { label: 'Active Creators', value: '2,000+', icon: Users },
  { label: 'Digital Products', value: '10K+', icon: Package },
  { label: 'Satisfaction', value: '98%', icon: TrendingUp },
];

export const Hero: React.FC = () => {
  const { toggleAuth, user, siteContent } = useStore();

  return (
    <section className="pt-28 pb-20 relative overflow-hidden">
      {/* Subtle background dots */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #111 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

          {/* Text Content */}
          <div className="lg:w-1/2 space-y-8">
            <motion.div custom={0} initial="hidden" animate="visible" variants={fadeUp}>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-light border border-selar-border rounded-lg text-xs font-semibold text-brand-dark uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-brand-purple" />
                The All-In-One Digital Storefront
              </span>
            </motion.div>

            <motion.h1
              custom={1}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] text-brand-dark tracking-tight"
            >
              {siteContent.heroHeadline}
            </motion.h1>

            <motion.p
              custom={2}
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="text-brand-muted text-lg max-w-md leading-relaxed"
            >
              {siteContent.heroSubheadline}
            </motion.p>

            <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row items-center gap-3">
              <Link href="/products" className="w-full sm:w-auto bg-brand-dark text-white px-7 py-3.5 rounded-xl font-semibold shadow-subtle hover:shadow-elevated transition-all flex items-center justify-center gap-2 group text-sm">
                Browse Marketplace
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              {!user || user.role !== 'seller' ? (
                <button
                  onClick={toggleAuth}
                  className="w-full sm:w-auto bg-white border border-selar-border text-brand-dark px-7 py-3.5 rounded-xl font-semibold hover:shadow-elevated transition-all flex items-center justify-center gap-2 text-sm"
                >
                  <PlusCircle className="w-4 h-4 text-brand-purple" />
                  Start Selling
                </button>
              ) : (
                <Link href="/dashboard" className="w-full sm:w-auto bg-white border border-selar-border text-brand-dark px-7 py-3.5 rounded-xl font-semibold hover:shadow-elevated transition-all flex items-center justify-center gap-2 text-sm">
                  Go to Dashboard
                </Link>
              )}
            </motion.div>

            {/* Stats Row */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="flex items-center gap-6 pt-4">
              {stats.map((stat) => (
                <div key={stat.label} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-brand-light flex items-center justify-center">
                    <stat.icon className="w-4 h-4 text-brand-dark" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-brand-dark leading-tight">{stat.value}</p>
                    <p className="text-[10px] text-brand-muted">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Hero Bento Grid */}
          <div className="lg:w-1/2 relative">
            <div className="relative w-full max-w-[540px] mx-auto">
              {/* Grid Cards */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { emoji: '📘', title: 'eBooks', subtitle: 'PDF, EPUB, MOBI', bg: 'bg-blue-50', delay: 0.2 },
                  { emoji: '🎥', title: 'Courses', subtitle: 'HD Video Hosting', bg: 'bg-purple-50', delay: 0.3 },
                  { emoji: '🎟️', title: 'Tickets', subtitle: 'Events & Live', bg: 'bg-orange-50', delay: 0.4 },
                  { emoji: '💼', title: 'Services', subtitle: 'Consultancy', bg: 'bg-emerald-50', delay: 0.5 },
                ].map((card, i) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: card.delay, ease: 'easeOut' as const }}
                    whileHover={{ y: -4, transition: { duration: 0.2 } }}
                    className={`${card.bg} p-6 rounded-2xl border border-selar-border/50 cursor-pointer`}
                  >
                    <div className="text-2xl mb-3">{card.emoji}</div>
                    <h4 className="font-bold text-brand-dark text-sm">{card.title}</h4>
                    <p className="text-xs text-brand-muted mt-0.5">{card.subtitle}</p>
                  </motion.div>
                ))}
              </div>

              {/* Floating Sale Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.4 }}
                className="absolute -top-3 -right-3 bg-brand-dark text-white px-3 py-2 rounded-xl shadow-elevated flex items-center gap-2"
              >
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs font-semibold">New Sale: $49.00</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};