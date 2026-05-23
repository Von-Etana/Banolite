'use client';
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

const events = [
    {
        id: 'event-1',
        title: 'Mastering Emotional Intelligence',
        date: 'Oct 15, 2026',
        time: '10:00 AM - 2:00 PM',
        location: 'Virtual Masterclass',
        image: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=800&auto=format&fit=crop',
        price: '₦15,000'
    },
    {
        id: 'event-2',
        title: 'The Spiritually Intelligent Girl Retreat',
        date: 'Nov 12 - Nov 14, 2026',
        time: 'All Day',
        location: 'Lagos, Nigeria',
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
        price: '₦50,000'
    },
    {
        id: 'event-3',
        title: 'Parenting with Purpose Seminar',
        date: 'Dec 05, 2026',
        time: '9:00 AM - 1:00 PM',
        location: 'Abuja Conference Center',
        image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800&auto=format&fit=crop',
        price: '₦20,000'
    }
];

const EventCard = ({ event, index }: { event: typeof events[0], index: number }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ["0 1", "1.2 1"] // animate as it enters from bottom
    });

    // 3D rotation transforms based on scroll
    const rotateX = useTransform(scrollYProgress, [0, 1], [45, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
    const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
    const y = useTransform(scrollYProgress, [0, 1], [100, 0]);

    return (
        <motion.div
            ref={cardRef}
            style={{
                rotateX,
                scale,
                opacity,
                y,
                transformPerspective: 1200,
                transformOrigin: "bottom center"
            }}
            className="flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-[#E5E5E5] group"
        >
            <div className="w-full md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full font-bold text-brand-dark">
                    {event.price}
                </div>
            </div>
            
            <div className="p-8 md:p-10 w-full md:w-3/5 flex flex-col justify-center bg-white">
                <h3 className="font-display font-bold text-3xl tracking-tight text-brand-dark mb-4 group-hover:text-brand-primary transition-colors">
                    {event.title}
                </h3>
                
                <div className="space-y-3 mb-8">
                    <div className="flex items-center text-brand-muted">
                        <Calendar className="w-5 h-5 mr-3 text-brand-primary" />
                        <span className="font-medium text-[16px]">{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center text-brand-muted">
                        <MapPin className="w-5 h-5 mr-3 text-brand-primary" />
                        <span className="font-medium text-[16px]">{event.location}</span>
                    </div>
                </div>
                
                <button className="flex items-center justify-center space-x-2 bg-[#F9F9F9] hover:bg-brand-dark hover:text-white text-brand-dark font-bold py-4 px-8 rounded-full transition-all duration-300 w-full md:w-auto md:self-start border border-[#E5E5E5] hover:border-brand-dark">
                    <span>Reserve Your Spot</span>
                    <ArrowRight className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    );
};

export const UpcomingEvents: React.FC = () => {
    return (
        <section className="py-32 bg-[#F4F4F4] relative overflow-hidden" style={{ perspective: "2000px" }}>
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 max-w-5xl relative z-10">
                <div className="text-center mb-20">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="font-display font-bold text-5xl md:text-6xl tracking-[-1.5px] leading-tight text-brand-dark mb-6"
                    >
                        Upcoming Events
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-brand-muted max-w-2xl mx-auto"
                    >
                        Join Etima Umeh for transformative live sessions, masterclasses, and retreats designed to elevate your personal growth.
                    </motion.p>
                </div>

                <div className="space-y-12">
                    {events.map((event, index) => (
                        <EventCard key={event.id} event={event} index={index} />
                    ))}
                </div>
                
                <div className="mt-16 text-center">
                    <button className="font-bold text-[16px] text-brand-dark hover:text-brand-primary transition-colors flex items-center justify-center space-x-2 mx-auto group">
                        <span>View All Events</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};
