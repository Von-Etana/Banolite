'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { UserPlus, UploadCloud, Rocket } from 'lucide-react';

const steps = [
    {
        id: '01',
        title: 'Create Your Store',
        description: 'Sign up in seconds. Personalize your storefront with your brand colors, banner, and bio.',
        icon: UserPlus,
        color: 'bg-brand-purple/10 text-brand-purple border-brand-purple/20'
    },
    {
        id: '02',
        title: 'Upload Assets',
        description: 'Upload your eBooks, video courses, or set up calendar slots for coaching and events.',
        icon: UploadCloud,
        color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
        id: '03',
        title: 'Launch & Earn',
        description: 'Share your link. We handle the payment processing, file delivery, and automated emails.',
        icon: Rocket,
        color: 'bg-brand-orange/10 text-brand-orange border-brand-orange/20'
    }
];

export const HowToJoinSection: React.FC = () => {
    return (
        <section className="py-24 bg-brand-dark text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-purple/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/2 h-full bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    className="text-center max-w-2xl mx-auto mb-16"
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-white/80 uppercase tracking-wider mb-6 backdrop-blur-md">
                        Start Selling Today
                    </span>
                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Built for creators, designed for simplicity.</h2>
                    <p className="text-white/60 text-lg">
                        You focus on creating. We'll handle the logistics, hosting, and global checkout processing.
                        No coding required.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            className="bg-white/5 border border-white/10 p-8 rounded-[2rem] relative group hover:bg-white/10 transition-colors"
                        >
                            <div className="absolute top-8 right-8 text-5xl font-display font-bold text-white/5 group-hover:text-white/10 transition-colors">
                                {step.id}
                            </div>

                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-8 border ${step.color} bg-white`}>
                                <step.icon className="w-6 h-6" />
                            </div>

                            <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                            <p className="text-white/60 leading-relaxed text-sm">
                                {step.description}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section >
    );
};
