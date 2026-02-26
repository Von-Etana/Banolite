'use client';
import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const columns = [
  {
    title: 'Information',
    links: [
      { label: 'Home', href: '/' },
      { label: 'Discover', href: '/discover' },
      { label: 'Marketplace', href: '/products' },
      { label: 'About Us', href: '/#about' },
    ],
  },
  {
    title: 'Categories',
    links: [
      { label: 'Video Courses', href: '/products' },
      { label: 'eBooks', href: '/products' },
      { label: 'Event Tickets', href: '/discover' },
      { label: 'Services', href: '/products' },
    ],
  },
  {
    title: 'Social',
    links: [
      { label: 'Twitter', href: '#' },
      { label: 'Instagram', href: '#' },
      { label: 'LinkedIn', href: '#' },
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export const Footer: React.FC = () => {
  return (
    <footer className="pt-16 pb-8 border-t border-selar-border">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={containerVariants}
        className="container mx-auto px-6"
      >
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <motion.div variants={itemVariants} className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-brand-dark rounded-lg flex items-center justify-center text-white font-bold text-xs">
                R
              </div>
              <span className="font-display font-bold text-lg text-brand-dark">Redex</span>
            </div>
            <p className="text-brand-muted text-sm max-w-xs leading-relaxed">
              The premium marketplace for digital products, courses, and creator assets. Start your journey today.
            </p>
          </motion.div>

          {/* Link Columns */}
          {columns.map((col) => (
            <motion.div key={col.title} variants={itemVariants}>
              <h4 className="font-semibold text-brand-dark mb-4 text-sm">{col.title}</h4>
              <ul className="space-y-2.5 text-sm">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-brand-muted hover:text-brand-dark transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-xs text-brand-muted pt-6 border-t border-selar-border">
          <p>© 2026 Redex Digital Marketplace</p>
          <div className="flex gap-6 mt-3 md:mt-0">
            <a href="#" className="hover:text-brand-dark transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-dark transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-dark transition-colors">Payout Policy</a>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};