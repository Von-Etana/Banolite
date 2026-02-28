'use client';
import React, { useState, useEffect } from 'react';
import {
  X, Lock, CheckCircle, Loader2, ShoppingBag,
  ArrowRight, ArrowLeft, CreditCard, Shield, Sparkles, PartyPopper
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCurrency } from '../context/CurrencyContext';
import { useRouter } from 'next/navigation';
import { PaystackButton } from './PaystackButton';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

type CheckoutStep = 'review' | 'payment' | 'success';

export const CheckoutModal: React.FC = () => {
  const { cart, createPendingOrder, clearCart, cartTotal, siteContent, user, toggleAuth, isCheckoutOpen, toggleCheckout } = useStore();
  const { formatPrice } = useCurrency();
  const router = useRouter();

  const [step, setStep] = useState<CheckoutStep>('review');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bookingDate: '',
    attendeeName: user?.name || '',
  });

  // Sync form data if user changes
  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, name: user.name, email: user.email }));
    }
  }, [user]);

  if (!isCheckoutOpen) return null;

  const taxRate = (siteContent.platformTaxPercentage || 0) / 100;
  const subtotal = cartTotal;
  const tax = subtotal * taxRate;
  const grandTotal = subtotal + tax;

  const handlePaystackSuccess = async (reference: any) => {
    setIsProcessing(true);

    let attempts = 0;
    const maxAttempts = 20; // 60 seconds total polling (20 * 3s)

    const pollInterval = setInterval(async () => {
      attempts++;
      try {
        const res = await fetch(`/api/orders/${orderRef}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'completed') {
            clearInterval(pollInterval);
            setIsProcessing(false);
            clearCart();
            setStep('success');
            return;
          }
        }
      } catch (err) {
        console.error('Polling error:', err);
      }

      if (attempts >= maxAttempts) {
        clearInterval(pollInterval);
        setIsProcessing(false);
        toast.success("Payment verifying. Check email shortly.", { duration: 6000 });
        clearCart();
        setStep('success');
      }
    }, 3000);
  };

  const handlePaystackClose = () => {
    // User closed the Paystack popup without completing payment
    console.log('Payment cancelled');
  };

  const handleClose = () => {
    if (step === 'success') {
      router.push('/library');
    }
    toggleCheckout();
    setStep('review');
    setOrderRef('');
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bookingDate: '',
      attendeeName: user?.name || '',
    });
  };

  const deliveryMessage = () => {
    const hasCourse = cart.some(i => i.type === 'COURSE');
    const hasService = cart.some(i => i.type === 'SERVICE');
    const hasTicket = cart.some(i => i.type === 'TICKET');
    const hasCoaching = cart.some(i => i.type === 'COACHING');

    if (hasCourse) return 'Your courses are now active in your library.';
    if (hasCoaching) return 'Your coaching session is confirmed. Check your email for meeting details.';
    if (hasService) return 'The creator has been notified. Expect a response within 24 hours.';
    if (hasTicket) return 'Your event passes have been sent to your email.';
    return 'Your digital files are ready for download in your library.';
  };

  const stepIndicator = (
    <div className="flex items-center justify-center gap-2 py-4">
      {['review', 'payment', 'success'].map((s, i) => (
        <React.Fragment key={s}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${step === s
            ? 'bg-brand-dark text-white shadow-md'
            : ['review', 'payment', 'success'].indexOf(step) > i
              ? 'bg-green-500 text-white'
              : 'bg-gray-100 text-gray-400'
            }`}>
            {['review', 'payment', 'success'].indexOf(step) > i ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          {i < 2 && (
            <div className={`w-12 h-0.5 rounded-full ${['review', 'payment', 'success'].indexOf(step) > i ? 'bg-green-500' : 'bg-gray-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="bg-brand-light p-5 flex justify-between items-center border-b border-selar-border sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-dark rounded-xl flex items-center justify-center">
              {step === 'success' ? (
                <PartyPopper className="w-4 h-4 text-white" />
              ) : (
                <ShoppingBag className="w-4 h-4 text-white" />
              )}
            </div>
            <div>
              <h2 className="font-display font-bold text-brand-dark">
                {step === 'review' && 'Review Order'}
                {step === 'payment' && 'Complete Payment'}
                {step === 'success' && 'Order Confirmed!'}
              </h2>
              <p className="text-[10px] text-brand-muted font-medium uppercase tracking-wider">
                {step === 'review' && `${cart.length} item${cart.length !== 1 ? 's' : ''} in your cart`}
                {step === 'payment' && 'Secure Paystack checkout'}
                {step === 'success' && 'Thank you for your purchase'}
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="p-2 hover:bg-white rounded-full text-brand-muted hover:text-brand-dark transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {stepIndicator}

        {/* Content */}
        <div className="px-6 pb-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: Review */}
            {step === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-5"
              >
                {!user && (
                  <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 flex justify-between items-center">
                    <span>Have an account?</span>
                    <button type="button" onClick={() => { toggleCheckout(); toggleAuth(); }} className="font-bold underline hover:no-underline">
                      Log in
                    </button>
                  </div>
                )}

                {/* Contact */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">Contact Details</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2 md:col-span-1">
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-brand-light border border-selar-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 text-sm transition-all"
                        placeholder="Full name"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-brand-light border border-selar-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 text-sm transition-all"
                        placeholder="Email address"
                      />
                    </div>
                  </div>
                </div>

                {/* Conditional Fields: Coaching & Tickets */}
                {(cart.some(i => i.type === 'COACHING') || cart.some(i => i.type === 'TICKET')) && (
                  <div className="space-y-3 pt-2 border-t border-selar-border">
                    <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">Additional Information</h3>
                    <div className="space-y-3">
                      {cart.some(i => i.type === 'COACHING') && (
                        <div>
                          <label className="block text-xs font-bold text-brand-dark mb-1">Select Booking Date & Time</label>
                          <input
                            required
                            type="datetime-local"
                            value={formData.bookingDate}
                            onChange={(e) => setFormData({ ...formData, bookingDate: e.target.value })}
                            className="w-full bg-brand-light border border-selar-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 text-sm transition-all"
                          />
                        </div>
                      )}
                      {cart.some(i => i.type === 'TICKET') && (
                        <div>
                          <label className="block text-xs font-bold text-brand-dark mb-1">Attendee Name on Ticket</label>
                          <input
                            required
                            type="text"
                            value={formData.attendeeName}
                            onChange={(e) => setFormData({ ...formData, attendeeName: e.target.value })}
                            className="w-full bg-brand-light border border-selar-border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 text-sm transition-all"
                            placeholder="John Doe"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Itemized Summary */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-brand-muted uppercase tracking-wider">Order Summary</h3>
                  <div className="bg-brand-light border border-selar-border rounded-xl overflow-hidden">
                    {cart.map((item, idx) => (
                      <div key={item.id} className={`flex items-center gap-3 p-3 ${idx < cart.length - 1 ? 'border-b border-selar-border' : ''}`}>
                        <div className={`w-12 h-14 rounded-lg overflow-hidden flex-shrink-0 ${item.color}`}>
                          <img src={item.coverUrl} alt={item.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-brand-dark text-sm truncate">{item.title}</p>
                          <p className="text-[10px] text-brand-muted uppercase">{item.type} • Qty {item.quantity}</p>
                        </div>
                        <span className="font-bold text-brand-dark text-sm flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="bg-white border border-selar-border rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Subtotal</span>
                    <span className="font-medium text-brand-dark">{formatPrice(subtotal)}</span>
                  </div>
                  {tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-brand-muted">Tax ({siteContent.platformTaxPercentage}%)</span>
                      <span className="font-medium text-brand-dark">{formatPrice(tax)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-selar-border">
                    <span className="font-bold text-brand-dark">Total</span>
                    <span className="font-bold text-brand-dark text-lg">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Continue */}
                <button
                  onClick={async () => {
                    if (!formData.email || !formData.name) return;
                    if (cart.some(i => i.type === 'COACHING') && !formData.bookingDate) return;
                    if (cart.some(i => i.type === 'TICKET') && !formData.attendeeName) return;

                    setIsProcessing(true);
                    try {
                      // 1. Create the pending order FIRST
                      const order = await createPendingOrder('paystack', formData.email, {
                        bookingDate: formData.bookingDate,
                        attendeeName: formData.attendeeName
                      });

                      // 2. Set the ID as the reference for Paystack
                      setOrderRef(order.id);
                      setStep('payment');
                    } catch (error: any) {
                      console.error('Failed to init order:', error);
                      toast.error(error.message || 'Failed to initialize checkout. Please try again.');
                    }
                    setIsProcessing(false);
                  }}
                  disabled={isProcessing || !formData.email || !formData.name || (cart.some(i => i.type === 'COACHING') && !formData.bookingDate) || (cart.some(i => i.type === 'TICKET') && !formData.attendeeName)}
                  className="w-full py-3.5 bg-brand-dark text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue to Payment'} <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: Payment */}
            {step === 'payment' && (
              <motion.div
                key="payment"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="space-y-6"
              >
                <button
                  onClick={() => setStep('review')}
                  className="flex items-center gap-2 text-brand-muted hover:text-brand-dark text-sm font-medium transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to review
                </button>

                {/* Payment Info */}
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4 border border-selar-border">
                    <CreditCard className="w-7 h-7 text-brand-dark" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-brand-dark mb-2">Secure Payment</h3>
                  <p className="text-brand-muted text-sm max-w-xs mx-auto">
                    You'll be redirected to Paystack's secure checkout to complete your payment.
                  </p>
                </div>

                {/* Payment Summary */}
                <div className="bg-brand-light border border-selar-border rounded-xl p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Paying to</span>
                    <span className="font-semibold text-brand-dark">Banolite</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-muted">Email</span>
                    <span className="font-semibold text-brand-dark">{formData.email}</span>
                  </div>
                  <div className="flex justify-between text-sm pt-2 border-t border-selar-border">
                    <span className="font-bold text-brand-dark">Amount</span>
                    <span className="font-bold text-brand-dark text-lg">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {/* Paystack Button */}
                <PaystackButton
                  email={formData.email}
                  amount={grandTotal}
                  reference={orderRef}
                  onSuccess={handlePaystackSuccess}
                  onClose={handlePaystackClose}
                  disabled={isProcessing}
                  className="w-full py-4 bg-[#0BA4DB] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-3 hover:bg-[#0994c7] transition-all shadow-lg disabled:opacity-70"
                >
                  {isProcessing ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 50 50" fill="none"><path d="M25 0C11.2 0 0 11.2 0 25s11.2 25 25 25 25-11.2 25-25S38.8 0 25 0z" fill="currentColor" opacity="0.2" /><path d="M13 19h24v3H13zM13 25h24v3H13zM13 31h16v3H13z" fill="white" /></svg>
                      Pay {formatPrice(grandTotal)} with Paystack
                    </>
                  )}
                </PaystackButton>

                {/* Security badge */}
                <div className="flex items-center justify-center gap-2 text-brand-muted">
                  <Shield className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-medium uppercase tracking-wider">256-bit SSL • PCI DSS Compliant</span>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Success */}
            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-6 space-y-6"
              >
                {/* Animated success icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-500"
                >
                  <CheckCircle className="w-10 h-10" />
                </motion.div>

                <div>
                  <h3 className="font-display font-bold text-2xl text-brand-dark mb-2">Payment Successful!</h3>
                  <p className="text-brand-muted text-sm max-w-xs mx-auto">{deliveryMessage()}</p>
                </div>

                {/* Receipt Card */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-brand-light border border-selar-border rounded-xl p-4 text-left max-w-xs mx-auto"
                >
                  <p className="text-[10px] text-brand-muted uppercase font-bold tracking-wider mb-3">Transaction Receipt</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Reference</span>
                      <span className="font-mono text-brand-dark text-xs">{orderRef.slice(0, 20)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-brand-muted">Items</span>
                      <span className="font-semibold text-brand-dark">{cart.length}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-selar-border">
                      <span className="font-bold text-brand-dark">Total Paid</span>
                      <span className="font-bold text-green-600">{formatPrice(grandTotal)}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Confetti dots */}
                <div className="flex items-center justify-center gap-1">
                  {[...Array(7)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ y: -20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className={`w-2 h-2 rounded-full ${['bg-brand-purple', 'bg-amber-400', 'bg-green-400', 'bg-pink-400', 'bg-blue-400', 'bg-orange-400', 'bg-cyan-400'][i]}`}
                    />
                  ))}
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-3.5 bg-brand-dark text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-black transition-all shadow-lg"
                >
                  <Sparkles className="w-4 h-4" /> Go to My Library
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};