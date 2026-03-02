'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export const CTASection: React.FC = () => {
  return (
    <section className="bg-brand-primary">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-6 max-w-5xl py-32 text-center"
      >
        <h2 className="font-display font-bold text-5xl md:text-6xl lg:text-[72px] text-white leading-[1.1] tracking-[-1.5px] uppercase mb-12">
          Level up. From creator<br />to entrepreneur.
        </h2>

        <div className="flex justify-center">
          <Link
            href="/dashboard"
            className="bg-white px-10 py-4 rounded-full flex items-center gap-2 font-bold text-black hover:shadow-elevated hover:-translate-y-1 transition-all text-lg"
          >
            Get Started <span className="text-xl leading-none">&rarr;</span>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};