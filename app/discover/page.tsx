'use client';

import React, { useState } from 'react';
import { DiscoverProducts } from '../../components/DiscoverSection';
import { Calendar as CalendarIcon, Users, Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { COACHES, EVENTS } from '../../constants';
import { Coach, Event } from '../../types';
import { BookingFlow } from '../../views/BookingFlow';
import { EventTicketing } from '../../views/EventTicketing';
import { format } from 'date-fns';

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DiscoverPage() {
    const [selectedCoach, setSelectedCoach] = useState<Coach | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

    return (
        <main className="min-h-screen pt-24 pb-20">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="container mx-auto px-6 py-12 text-center max-w-3xl"
            >
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-light border border-selar-border rounded-lg text-xs font-semibold text-brand-dark uppercase tracking-wider mb-6">
                    Discover
                </span>
                <h1 className="text-4xl md:text-5xl font-display font-bold text-brand-dark mb-4 tracking-tight">
                    Learn, Grow, and <span className="text-brand-purple">Connect</span>
                </h1>
                <p className="text-brand-muted text-lg">
                    Find top-tier coaches, attend exclusive events, and discover premium digital products.
                </p>
            </motion.div>

            {/* Coaches */}
            <section className="py-12 bg-white border-y border-selar-border">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                        <div>
                            <h2 className="text-2xl font-display font-bold text-brand-dark mb-1 flex items-center gap-2">
                                <Users className="w-5 h-5 text-brand-purple" />
                                Expert Coaches & Trainers
                            </h2>
                            <p className="text-brand-muted text-sm">Book 1-on-1 sessions with industry leaders.</p>
                        </div>
                        <button className="text-brand-dark font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-4 md:mt-0">
                            View all <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={stagger}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
                    >
                        {COACHES.map((coach) => (
                            <motion.div
                                key={coach.id}
                                variants={fadeUp}
                                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                className="bg-white p-5 rounded-2xl border border-selar-border hover:shadow-card-hover transition-all duration-300 group cursor-pointer"
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-selar-border/50 bg-brand-light">
                                        <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-brand-dark text-sm group-hover:text-brand-purple transition-colors">{coach.name}</h3>
                                        <p className="text-xs text-brand-muted">{coach.role}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="badge-muted">{coach.specialty}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 text-xs font-medium text-amber-600">
                                        <Star className="w-3 h-3 fill-current" />
                                        {coach.rating} <span className="text-brand-muted">({coach.reviews})</span>
                                    </div>
                                    <button
                                        onClick={() => setSelectedCoach(coach)}
                                        className="px-3 py-1.5 bg-brand-dark text-white text-xs font-semibold rounded-lg hover:bg-brand-dark/90 transition-colors"
                                    >
                                        Book
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Events */}
            <section className="py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                        <div>
                            <h2 className="text-2xl font-display font-bold text-brand-dark mb-1 flex items-center gap-2">
                                <CalendarIcon className="w-5 h-5 text-brand-purple" />
                                Upcoming Events
                            </h2>
                            <p className="text-brand-muted text-sm">Join webinars, workshops, and live sessions.</p>
                        </div>
                        <button className="text-brand-dark font-semibold text-sm flex items-center gap-1 hover:gap-2 transition-all mt-4 md:mt-0">
                            View all <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: '-50px' }}
                        variants={stagger}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                        {EVENTS.map((event) => (
                            <motion.div
                                key={event.id}
                                variants={fadeUp}
                                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                                className="bg-white rounded-2xl overflow-hidden border border-selar-border hover:shadow-card-hover transition-all duration-300 group flex flex-col"
                            >
                                <div className="h-44 relative overflow-hidden">
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-lg text-xs font-bold text-brand-dark border border-selar-border/50 shadow-subtle">
                                        {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
                                    </div>
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-xs font-semibold text-brand-purple mb-2">
                                        <span className="bg-brand-purple/10 px-2 py-0.5 rounded-md">{format(event.date, 'MMM do, yyyy')}</span>
                                        <span className="text-brand-muted">• {event.type}</span>
                                    </div>
                                    <h3 className="font-display font-bold text-lg text-brand-dark mb-4">{event.title}</h3>
                                    <button
                                        onClick={() => setSelectedEvent(event)}
                                        className="w-full py-2.5 mt-auto bg-brand-dark text-white text-xs font-semibold rounded-xl hover:bg-black transition-colors"
                                    >
                                        Get Tickets
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Products Teaser */}
            <DiscoverProducts />

            {/* Modals */}
            <BookingFlow coach={selectedCoach} onClose={() => setSelectedCoach(null)} />
            <EventTicketing event={selectedEvent} onClose={() => setSelectedEvent(null)} />
        </main>
    );
}
