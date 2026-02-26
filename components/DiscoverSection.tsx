'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Book, MonitorPlay, Ticket, Briefcase } from 'lucide-react';
import Link from 'next/link';

const categories = [
    { id: 'ebooks', title: 'eBooks & Guides', icon: Book, desc: 'Comprehensive written manuals', span: 'md:col-span-2' },
    { id: 'courses', title: 'Video Courses', icon: MonitorPlay, desc: 'High definition masterclasses', span: '' },
    { id: 'tickets', title: 'Event Tickets', icon: Ticket, desc: 'Webinars and live sessions', span: '' },
    { id: 'services', title: 'Digital Services', icon: Briefcase, desc: 'Consulting and freelance work', span: 'md:col-span-2' },
];

export const DiscoverProducts: React.FC = () => {
    return (
        <section id="store" className="py-24 bg-white border-b border-selar-border">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="section-heading mb-3">Discover Products</h2>
                        <p className="section-subtext">
                            Explore thousands of digital assets crafted by top-tier creators.
                        </p>
                    </div>
                    <Link href="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-dark hover:text-brand-purple transition-colors group">
                        View All Catalog
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Asymmetric Bento Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    {categories.map((cat, i) => {
                        const Icon = cat.icon;
                        return (
                            <motion.div
                                key={cat.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.4, delay: i * 0.08 }}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className={`${cat.span} bg-brand-light border border-selar-border rounded-2xl p-7 flex flex-col justify-between h-44 group cursor-pointer`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="w-10 h-10 rounded-xl bg-white border border-selar-border/50 flex items-center justify-center shadow-subtle">
                                        <Icon className="w-5 h-5 text-brand-dark" />
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-brand-muted opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-brand-dark">{cat.title}</h3>
                                    <p className="text-xs text-brand-muted mt-0.5">{cat.desc}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};
