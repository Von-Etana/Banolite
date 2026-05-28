'use client';
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, ArrowRight, ChevronLeft, ChevronRight, User } from 'lucide-react';

const events = [
    {
        id: 'event-1',
        title: 'Mastering Emotional Intelligence',
        organizer: 'Dr. Tomiwa Alabi',
        date: 'Oct 15, 2026',
        time: '10:00 AM - 2:00 PM',
        location: 'Virtual Masterclass',
        image: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?q=80&w=800&auto=format&fit=crop',
        price: '₦15,000'
    },
    {
        id: 'event-2',
        title: 'Creative Entrepreneur Summit 2026',
        organizer: 'Banolite Community',
        date: 'Nov 12 - Nov 14, 2026',
        time: 'All Day',
        location: 'Civic Centre, Lagos',
        image: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=800&auto=format&fit=crop',
        price: '₦50,000'
    },
    {
        id: 'event-3',
        title: 'Parenting with Purpose Seminar',
        organizer: 'Ngozi Obi',
        date: 'Dec 05, 2026',
        time: '9:00 AM - 1:00 PM',
        location: 'Virtual (Zoom)',
        image: 'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?q=80&w=800&auto=format&fit=crop',
        price: '₦20,000'
    },
    {
        id: 'event-4',
        title: 'Financial Freedom Bootcamp',
        organizer: 'Chinedu Okafor',
        date: 'Dec 18, 2026',
        time: '6:00 PM - 9:00 PM',
        location: 'Abuja Sheraton & Online',
        image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=800&auto=format&fit=crop',
        price: '₦25,000'
    },
    {
        id: 'event-5',
        title: 'High-Impact Public Speaking',
        organizer: 'Tosin Adewale',
        date: 'Jan 15, 2027',
        time: '10:00 AM - 4:00 PM',
        location: 'Virtual Workshop',
        image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800&auto=format&fit=crop',
        price: '₦30,000'
    },
    {
        id: 'event-6',
        title: 'Tech Career Transition Masterclass',
        organizer: 'Fatima Bello',
        date: 'Feb 10, 2027',
        time: '11:00 AM - 3:00 PM',
        location: 'Virtual Meetup',
        image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800&auto=format&fit=crop',
        price: '₦10,000'
    }
];

export const UpcomingEvents: React.FC = () => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollAmount = clientWidth * 0.75;
            scrollRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    return (
        <section className="py-24 bg-[#F4F4F4] relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-brand-primary/5 blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/5 blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 max-w-7xl relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="font-display font-bold text-4xl md:text-5xl tracking-[-1px] leading-tight text-brand-dark mb-4"
                        >
                            Upcoming & Top Events
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-brand-muted max-w-2xl"
                        >
                            Join top creators, coaches, and experts for transformative live sessions, masterclasses, and retreats designed to elevate your growth.
                        </motion.p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-3 mt-6 md:mt-0">
                        <button 
                            onClick={() => scroll('left')}
                            className="w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-white transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button 
                            onClick={() => scroll('right')}
                            className="w-12 h-12 rounded-full border border-gray-300 bg-white flex items-center justify-center text-brand-dark hover:bg-brand-dark hover:text-white transition-colors"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Sliding Horizontal Scroll Container */}
                <div 
                    ref={scrollRef}
                    className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scroll-smooth hide-scroll"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                >
                    {events.map((event, index) => (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-20px' }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            className="w-[300px] sm:w-[380px] flex-shrink-0 snap-start bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-card hover:shadow-card-hover hover:border-brand-primary/30 transition-all duration-300 flex flex-col justify-between group"
                        >
                            <div>
                                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                                    <img 
                                        src={event.image} 
                                        alt={event.title} 
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full font-bold text-sm text-brand-dark shadow-sm">
                                        {event.price}
                                    </div>
                                    <div className="absolute top-4 right-4 bg-brand-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                        LIVE EVENT
                                    </div>
                                </div>
                                
                                <div className="p-6">
                                    <div className="flex items-center gap-1.5 text-xs text-brand-muted font-semibold uppercase tracking-wider mb-2.5">
                                        <User className="w-3.5 h-3.5 text-brand-primary" />
                                        <span>by {event.organizer}</span>
                                    </div>
                                    <h3 className="font-display font-bold text-xl leading-snug text-brand-dark mb-4 group-hover:text-brand-primary transition-colors line-clamp-2">
                                        {event.title}
                                    </h3>
                                    
                                    <div className="space-y-2.5">
                                        <div className="flex items-center text-sm text-brand-muted">
                                            <Calendar className="w-4 h-4 mr-2.5 text-brand-primary flex-shrink-0" />
                                            <span>{event.date} • {event.time}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-brand-muted">
                                            <MapPin className="w-4 h-4 mr-2.5 text-brand-primary flex-shrink-0" />
                                            <span className="line-clamp-1">{event.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 pt-0">
                                <button className="flex items-center justify-center space-x-2 bg-brand-light hover:bg-brand-dark hover:text-white text-brand-dark font-bold py-3.5 px-6 rounded-2xl transition-all duration-300 w-full border border-transparent hover:border-brand-dark text-sm">
                                    <span>Reserve Your Spot</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
                
                <div className="mt-12 text-center">
                    <button className="font-bold text-[16px] text-brand-dark hover:text-brand-primary transition-colors flex items-center justify-center space-x-2 mx-auto group">
                        <span>View All Events</span>
                        <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </section>
    );
};
