'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle2, Calendar, MessageSquare, ArrowRight } from 'lucide-react';

const coaches = [
    {
        id: 'coach-1',
        name: 'Dr. Tomiwa Alabi',
        specialty: 'Leadership & Executive Growth',
        bio: 'Helping corporate leaders and executives double their team output and build emotional resilience.',
        rating: 4.9,
        reviews: 120,
        image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
        price: '₦35,000 / hr',
        sessions: '1:1 Coaching, Executive Retreats'
    },
    {
        id: 'coach-2',
        name: 'Ngozi Obi',
        specialty: 'Family & Marriage Coach',
        bio: 'Dedicated family counsellor helping modern couples design custom parenting strategies and conflict resolve.',
        rating: 5.0,
        reviews: 95,
        image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=600&auto=format&fit=crop',
        price: '₦25,000 / hr',
        sessions: 'Parenting Consultations, Workshops'
    },
    {
        id: 'coach-3',
        name: 'Chinedu Okafor',
        specialty: 'Wealth & Business Strategy',
        bio: 'Serial entrepreneur & business strategist showing creators how to build automated passive income funnels.',
        rating: 4.8,
        reviews: 180,
        image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=600&auto=format&fit=crop',
        price: '₦40,000 / hr',
        sessions: 'Business Audit, Sales Strategy'
    },
    {
        id: 'coach-4',
        name: 'Tosin Adewale',
        specialty: 'High-Performance Mindset',
        bio: 'Overcoming mental blocks & procrastination to design a purpose-driven workflow and lifestyle.',
        rating: 4.9,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop',
        price: '₦30,000 / hr',
        sessions: 'Performance Audits, Group Sessions'
    }
];

export const TopCoaches: React.FC = () => {
    return (
        <section className="py-24 bg-white border-b border-[#E5E5E5]">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="text-center mb-16">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-display font-bold text-4xl md:text-5xl tracking-[-1px] leading-tight text-brand-dark mb-4"
                    >
                        Top Coaches
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-lg text-brand-muted max-w-2xl mx-auto"
                    >
                        Book 1:1 sessions or enroll in programs with Nigeria's highest-rated certified industry experts.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {coaches.map((coach, index) => (
                        <motion.div
                            key={coach.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-20px' }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            whileHover={{ y: -6, transition: { duration: 0.2 } }}
                            className="bg-white rounded-3xl p-6 border border-gray-200 hover:border-brand-primary/30 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div>
                                <div className="relative w-full aspect-square rounded-2xl overflow-hidden mb-6 bg-gray-50">
                                    <img 
                                        src={coach.image} 
                                        alt={coach.name} 
                                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                        <Star className="w-3.5 h-3.5 fill-[#FFB800] text-[#FFB800]" />
                                        <span className="text-xs font-bold text-brand-dark">{coach.rating}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="inline-block bg-brand-light text-brand-dark text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">
                                        {coach.specialty}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="font-display font-bold text-xl text-brand-dark group-hover:text-brand-primary transition-colors">
                                            {coach.name}
                                        </h3>
                                        <CheckCircle2 className="w-4 h-4 text-blue-500 fill-current" />
                                    </div>
                                    <p className="text-sm text-brand-muted leading-relaxed line-clamp-3">
                                        {coach.bio}
                                    </p>
                                    
                                    <div className="pt-2 flex flex-col gap-1.5 text-xs text-brand-muted font-medium">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5 text-brand-primary animate-pulse" />
                                            <span>{coach.sessions}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MessageSquare className="w-3.5 h-3.5 text-brand-primary" />
                                            <span>Starts at <strong className="text-brand-dark font-bold">{coach.price}</strong></span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100">
                                <button className="w-full py-3 rounded-xl bg-brand-dark text-white text-sm font-bold hover:bg-brand-primary transition-colors flex items-center justify-center gap-2 shadow-sm">
                                    <span>Book 1:1 Session</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
