'use client';
import React from 'react';
import Link from 'next/link';

const columns = [
  {
    title: 'Platform',
    links: [
      { label: 'Website', href: '#' },
      { label: 'Payments', href: '#' },
      { label: 'Mobile App', href: '#' },
      { label: 'Analytics', href: '#' },
      { label: 'Email Marketing', href: '#' },
    ],
  },
  {
    title: 'Creators',
    links: [
      { label: 'Online Courses', href: '/products' },
      { label: 'Communities', href: '/products' },
      { label: 'Podcasts', href: '/products' },
      { label: 'Memberships', href: '/products' },
      { label: 'Downloads', href: '/products' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '#' },
      { label: 'Help Center', href: '#' },
      { label: 'Contact Support', href: '#' },
      { label: 'Creator Guides', href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/#about' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
      { label: 'Partners', href: '#' },
    ],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="pt-24 pb-12 bg-white">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-20">
          {/* Brand */}
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="inline-block mb-6">
              <span className="font-display font-black text-2xl tracking-tighter text-brand-dark">
                BANOLITE.
              </span>
            </Link>
            <p className="text-[15px] text-brand-muted max-w-xs leading-relaxed mb-6 font-medium">
              The premier platform for creators to build their brand, share their knowledge, and grow their revenue stream on their own terms.
            </p>
            <div className="flex items-center gap-4">
              {['Twitter', 'Instagram', 'LinkedIn', 'YouTube'].map(social => (
                <a key={social} href="#" className="text-brand-muted hover:text-brand-primary text-sm font-medium transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-bold text-brand-dark mb-6 text-[15px] tracking-wide">{col.title}</h4>
              <ul className="space-y-4 text-[15px]">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-brand-muted hover:text-brand-primary font-medium transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center text-[13px] text-brand-muted pt-8 border-t border-[#E5E5E5] font-medium">
          <p>© {new Date().getFullYear()} Banolite. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-brand-dark transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-dark transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-dark transition-colors">Data Processing Addendum</a>
          </div>
        </div>
      </div>
    </footer>
  );
};