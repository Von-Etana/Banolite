'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Users, Mic, Briefcase, FileText, LayoutGrid, Heart, Sparkles } from 'lucide-react';

const products = [
    { id: 'courses', title: 'Online Courses', icon: GraduationCap, desc: 'Deliver high quality learning experiences.' },
    { id: 'coaching', title: 'Coaching', icon: Briefcase, desc: 'Setup 1:1 or group coaching programs.' },
    { id: 'podcasts', title: 'Podcasts', icon: Mic, desc: 'Host, publish, and monetize audio.' },
    { id: 'memberships', title: 'Memberships', icon: Users, desc: 'Build highly engaged, recurring revenue.' },
    { id: 'communities', title: 'Communities', icon: Heart, desc: 'Connect your audience with each other.' },
    { id: 'downloads', title: 'Downloads', icon: FileText, desc: 'Sell ebooks, templates, and digital files.' },
    { id: 'newsletters', title: 'Newsletters', icon: Sparkles, desc: 'Send paid or free recurring updates.' },
    { id: 'bundles', title: 'Bundles', icon: LayoutGrid, desc: 'Package any combo of products together.' },
];

export const DiscoverProducts: React.FC = () => {
    return (
        <section id="store" className="py-32 bg-[#F9F9F9]">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="font-display font-bold text-5xl md:text-6xl tracking-[-1.5px] leading-tight text-brand-dark mb-4">
                        Everything you need<br />to build your empire.
                    </h2>
                    <p className="text-xl text-brand-muted max-w-2xl mx-auto">
                        Sell all of your products in one place. Diversify your revenue and grow your business with a unified platform.
                    </p>
                </div>

                {/* Clean Uniform Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {products.map((prod, i) => {
                        const Icon = prod.icon;
                        return (
                            <motion.div
                                key={prod.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                className="bg-white rounded-2xl p-8 flex flex-col justify-between h-56 group border border-[#E5E5E5] hover:border-brand-primary/30 hover:shadow-card-hover transition-all cursor-pointer"
                            >
                                <div className="w-12 h-12 rounded-xl bg-[#F0F0F0] group-hover:bg-[#FF3E14]/10 flex items-center justify-center mb-6 transition-colors">
                                    <Icon className="w-6 h-6 text-brand-dark group-hover:text-brand-primary transition-colors" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-brand-dark font-display tracking-tight mb-2 group-hover:text-brand-primary transition-colors">{prod.title}</h3>
                                    <p className="text-[15px] text-brand-muted leading-snug">{prod.desc}</p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    );
};
