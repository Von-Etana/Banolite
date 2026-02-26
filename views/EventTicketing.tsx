import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ticket as TicketIcon, MapPin, Calendar, CheckCircle2 } from 'lucide-react';
import { Event } from '../types';
import { useStore } from '../context/StoreContext';
import { format } from 'date-fns';

interface EventTicketingProps {
    event: Event | null;
    onClose: () => void;
}

export const EventTicketing: React.FC<EventTicketingProps> = ({ event, onClose }) => {
    const { buyTicket, user, toggleAuth } = useStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    if (!event) return null;

    const handlePurchase = async () => {
        if (!user) {
            onClose();
            toggleAuth();
            return;
        }
        setIsProcessing(true);
        try {
            await buyTicket(event.id, event.price);
            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
            }, 2000);
        } catch (error) {
            console.error(error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
                >
                    {/* Header Image */}
                    <div className="relative h-48 bg-brand-dark">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60" />
                        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/20 backdrop-blur hover:bg-black/40 rounded-full transition-colors text-white">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="absolute bottom-4 left-6">
                            <span className="px-3 py-1 bg-brand-purple text-white text-xs font-bold uppercase tracking-wider rounded-lg mb-2 inline-block">
                                {event.type}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                                <h3 className="text-2xl font-bold text-brand-dark mb-2">Ticket Secured!</h3>
                                <p className="text-brand-muted">Your virtual pass has been added to your Library.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-display font-bold text-brand-dark mb-2">{event.title}</h2>
                                <p className="text-brand-muted mb-6 text-sm">{event.description}</p>

                                <div className="space-y-4 mb-8">
                                    <div className="flex items-center gap-3 text-brand-dark font-medium">
                                        <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-brand-purple" />
                                        </div>
                                        <div>
                                            <p className="text-sm">Date & Time</p>
                                            <p className="text-sm text-brand-muted">{format(event.date, 'EEEE, MMMM do, yyyy')}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-brand-dark font-medium">
                                        <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-brand-purple" />
                                        </div>
                                        <div>
                                            <p className="text-sm">Location</p>
                                            <p className="text-sm text-brand-muted">{event.type}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-selar-border flex justify-between items-center">
                                    <div>
                                        <p className="text-brand-muted text-sm">Ticket Price</p>
                                        <p className="text-3xl font-bold text-brand-dark">
                                            {event.price === 0 ? 'Free' : `$${event.price.toFixed(2)}`}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handlePurchase}
                                        disabled={isProcessing}
                                        className="px-8 py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-black transition-colors disabled:opacity-50 flex items-center gap-2 shadow-elevated"
                                    >
                                        <TicketIcon className="w-5 h-5" />
                                        {isProcessing ? 'Processing...' : 'Get Ticket'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
