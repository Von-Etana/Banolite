'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Shield, Zap, Target } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { SubscriptionTier } from '../../types';
import toast from 'react-hot-toast';

const PricingPage = () => {
  const { user, updateUserProfile, toggleAuth } = useStore();
  const [isProcessing, setIsProcessing] = useState<SubscriptionTier | null>(null);

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!user) {
      toggleAuth();
      return;
    }

    if (user.subscriptionPlan === tier) {
      toast('You are already on this plan.', { icon: 'ℹ️' });
      return;
    }

    setIsProcessing(tier);
    try {
      // If upgrading to Business or Pro, initialize a Paystack Subscription Checkout
      if (tier === 'pro' || tier === 'business') {
        const response = await fetch('/api/subscriptions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tier,
            email: user.email,
            userId: user.id
          }),
        });
        const data = await response.json();

        if (!response.ok) throw new Error(data.error || 'Failed to initialize checkout');
        if (data.authorizationUrl) {
           window.location.href = data.authorizationUrl;
        }
      } else {
        // If downgrading to Starter (Free), just update immediately
        await new Promise((resolve) => setTimeout(resolve, 800));
        updateUserProfile({ subscriptionPlan: tier });
        toast.success('Successfully downgraded to Starter plan.');
        setIsProcessing(null);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to start subscription process. Please try again.');
      setIsProcessing(null);
    }
  };

  const tiers = [
    {
      id: 'starter' as SubscriptionTier,
      name: 'Starter',
      price: 'Free',
      period: 'forever',
      description: 'Perfect for new creators just getting started.',
      icon: Target,
      features: [
        { name: 'Up to 5 Products', included: true },
        { name: '10% Transaction Fee', included: true },
        { name: 'Standard Storefront', included: true },
        { name: 'Basic Support', included: true },
        { name: 'Custom Domain', included: false },
        { name: 'Dedicated Account Manager', included: false },
      ],
      buttonText: user?.subscriptionPlan === 'starter' ? 'Current Plan' : 'Get Started',
      popular: false,
    },
    {
      id: 'pro' as SubscriptionTier,
      name: 'Pro',
      price: '₦5,000',
      period: 'per month',
      description: 'For growing creators who need more power and lower fees.',
      icon: Zap,
      features: [
        { name: 'Up to 50 Products', included: true },
        { name: '5% Transaction Fee', included: true },
        { name: 'Premium Storefront Themes', included: true },
        { name: 'Priority Support', included: true },
        { name: 'Custom Domain', included: true },
        { name: 'Dedicated Account Manager', included: false },
      ],
      buttonText: user?.subscriptionPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
      popular: true,
    },
    {
      id: 'business' as SubscriptionTier,
      name: 'Business',
      price: '₦15,000',
      period: 'per month',
      description: 'The ultimate toolkit for serious digital businesses.',
      icon: Shield,
      features: [
        { name: 'Unlimited Products', included: true },
        { name: '2% Transaction Fee', included: true },
        { name: 'Premium Storefront Themes', included: true },
        { name: '24/7 Priority Support', included: true },
        { name: 'Custom Domain', included: true },
        { name: 'Dedicated Account Manager', included: true },
      ],
      buttonText: user?.subscriptionPlan === 'business' ? 'Current Plan' : 'Upgrade to Business',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-[#F8FAFC]">
      {/* Header */}
      <div className="container mx-auto px-6 text-center max-w-3xl mb-20">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-brand-dark mb-6 leading-tight"
        >
          Simple, transparent pricing for every creator.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-gray-500 font-medium"
        >
          Start for free, upgrade when you need to. No hidden fees, ever.
        </motion.p>
      </div>

      {/* Pricing Grid */}
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {tiers.map((tier, index) => {
            const isCurrentPlan = user?.subscriptionPlan === tier.id;
            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative bg-white rounded-3xl p-8 border hover:-translate-y-2 transition-transform duration-300 ${
                  tier.popular
                    ? 'border-brand-primary shadow-[0_20px_50px_rgba(126,34,206,0.15)] ring-4 ring-brand-primary/10'
                    : 'border-gray-200 shadow-xl shadow-gray-200/50'
                }`}
              >
                {tier.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-brand-primary text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full shadow-lg shadow-brand-primary/30">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-8">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-sm border ${
                      tier.popular
                        ? 'bg-brand-primary/10 text-brand-primary border-brand-primary/20'
                        : 'bg-gray-50 text-gray-600 border-gray-100'
                    }`}
                  >
                    <tier.icon className="w-7 h-7" />
                  </div>
                  <h3 className="font-display font-bold text-2xl text-brand-dark mb-2">{tier.name}</h3>
                  <p className="text-gray-500 font-medium h-12 text-sm">{tier.description}</p>
                </div>

                <div className="mb-8 flex items-end gap-1">
                  <span className="font-display font-bold text-4xl text-brand-dark">{tier.price}</span>
                  {tier.price !== 'Free' && <span className="text-gray-500 font-medium mb-1">/{tier.period}</span>}
                </div>

                <div className="space-y-4 mb-8 flex-1">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          feature.included ? 'bg-green-50 text-green-500' : 'bg-gray-50 text-gray-300'
                        }`}
                      >
                        {feature.included ? <Check className="w-3 h-3 stroke-[3]" /> : <X className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span className={`text-sm font-medium ${feature.included ? 'text-gray-700' : 'text-gray-400 line-through decoration-gray-300'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => handleSubscribe(tier.id)}
                  disabled={isProcessing === tier.id || isCurrentPlan}
                  className={`w-full py-4 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 flex justify-center items-center ${
                    isCurrentPlan
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed shadow-none border border-gray-200'
                      : tier.popular
                      ? 'bg-brand-primary text-white hover:bg-brand-primary/90 hover:shadow-lg hover:shadow-brand-primary/20'
                      : 'bg-brand-dark text-white hover:bg-black hover:shadow-lg hover:shadow-black/20'
                  }`}
                >
                  {isProcessing === tier.id ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    tier.buttonText
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
