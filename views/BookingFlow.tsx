import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';
import { Coach } from '../types';
import { useStore } from '../context/StoreContext';
import { format, addDays, startOfToday } from 'date-fns';

interface BookingFlowProps {
    coach: Coach | null;
    onClose: () => void;
}

export const BookingFlow: React.FC<BookingFlowProps> = ({ coach, onClose }) => {
    const { addToCart, user, toggleAuth } = useStore();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Generate next 14 days
    const today = startOfToday();
    const availableDates = Array.from({ length: 14 }).map((_, i) => addDays(today, i + 1));
    const availableTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '04:00 PM'];

    if (!coach) return null;

    const handleBook = async () => {
        if (!user) {
            onClose();
            toggleAuth();
            return;
        }
        if (!selectedDate || !selectedTime) return;

        setIsProcessing(true);
        // Combine date and time
        const [time, period] = selectedTime.split(' ');
        const [hours, minutes] = time.split(':');
        let hour = parseInt(hours);
        if (period === 'PM' && hour !== 12) hour += 12;
        if (period === 'AM' && hour === 12) hour = 0;

        const finalDate = new Date(selectedDate);
        finalDate.setHours(hour, parseInt(minutes), 0, 0);

        try {
            // Construct a pseudo-product for the cart
            const coachingProduct: any = {
                id: `coach-${coach.id}`,
                title: `1:1 Session with ${coach.name}`,
                creator: coach.name,
                creatorId: coach.id,
                price: coach.hourlyRate,
                description: `A 60-minute 1:1 coaching session with ${coach.name}.`,
                coverUrl: coach.avatar,
                color: 'bg-brand-purple/10',
                type: 'COACHING',
            };

            addToCart(coachingProduct, {
                bookingDate: finalDate.toISOString(),
                coachId: coach.id,
                duration: '60 mins'
            });

            setIsSuccess(true);
            setTimeout(() => {
                onClose();
                setIsSuccess(false);
            }, 1000);
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
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60"
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] border border-gray-100"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <h2 className="text-xl font-display font-bold text-gray-900">Book a Session</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-600">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 overflow-y-auto">
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                                <h3 className="text-2xl font-bold text-brand-dark mb-2">Booking Confirmed!</h3>
                                <p className="text-brand-muted">Your session with {coach.name} is scheduled.</p>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-8">
                                {/* Coach Info */}
                                <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-selar-border pb-6 md:pb-0 md:pr-6">
                                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-selar-border/50 bg-brand-light mb-4">
                                        <img src={coach.avatar} alt={coach.name} className="w-full h-full object-cover" />
                                    </div>
                                    <h3 className="font-semibold text-brand-dark text-lg mb-1">{coach.name}</h3>
                                    <p className="text-brand-purple text-sm font-medium mb-4">{coach.role}</p>

                                    <div className="pt-4 border-t border-selar-border text-sm flex justify-between">
                                        <span className="text-brand-muted">Session Rate</span>
                                        <span className="font-semibold text-brand-dark">₦{coach.hourlyRate}/hr</span>
                                    </div>
                                </div>

                                {/* Date & Time Selection */}
                                <div className="w-full md:w-2/3 flex flex-col gap-6">
                                    <div>
                                        <h4 className="font-medium flex items-center gap-2 mb-3 text-brand-dark">
                                            <CalendarIcon className="w-4 h-4 text-brand-muted" /> Select Date
                                        </h4>
                                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                                            {availableDates.map(date => {
                                                const isSelected = selectedDate?.toDateString() === date.toDateString();
                                                return (
                                                    <button
                                                        key={date.toISOString()}
                                                        onClick={() => setSelectedDate(date)}
                                                        className={`flex flex-col items-center justify-center flex-shrink-0 w-16 p-3 rounded-2xl border transition-all ${isSelected ? 'border-brand-primary bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                                                            }`}
                                                    >
                                                        <span className={`text-xs font-semibold uppercase mb-1 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>{format(date, 'EEE')}</span>
                                                        <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                                                            {format(date, 'd')}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {selectedDate && (
                                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                                            <h4 className="font-medium flex items-center gap-2 mb-3 text-brand-dark">
                                                <Clock className="w-4 h-4 text-brand-muted" /> Select Time
                                            </h4>
                                            <div className="grid grid-cols-3 gap-2">
                                                {availableTimes.map(time => {
                                                    const isSelected = selectedTime === time;
                                                    return (
                                                        <button
                                                            key={time}
                                                            onClick={() => setSelectedTime(time)}
                                                            className={`p-3 rounded-xl text-sm font-semibold border transition-all ${isSelected ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20' : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 bg-white'
                                                                }`}
                                                        >
                                                            {time}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {!isSuccess && (
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between items-center rounded-b-3xl">
                            <div className="text-sm">
                                <p className="text-gray-500 font-medium">Total Due</p>
                                <p className="text-2xl font-bold text-gray-900">₦{coach.hourlyRate.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={handleBook}
                                disabled={!selectedDate || !selectedTime || isProcessing}
                                className="px-8 py-3.5 bg-brand-dark text-white rounded-2xl font-bold hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-black/10"
                            >
                                {isProcessing ? 'Processing...' : 'Confirm Booking'}
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};
