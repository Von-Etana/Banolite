'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, MessageCircleQuestion } from 'lucide-react';

const faqs = [
    {
        question: 'What types of products can I sell on Banolite?',
        answer: 'You can sell almost any digital asset! The platform supports PDFs, eBooks, video courses, audio files, Zip archives, and even physical event tickets or live 1-on-1 coaching sessions. The maximum file size for direct uploads is 50MB, but you can link out to larger external files if needed.'
    },
    {
        question: 'How much does it cost to use the platform?',
        answer: 'Signing up and listing your products on Banolite is completely free. We only make money when you do, by taking a small flat platform fee per transaction to cover payment processing, hosting, and email delivery.'
    },
    {
        question: 'How and when do I get paid?',
        answer: 'We support instant payouts and scheduled transfers depending on your region. Once a buyer purchases your product, the funds are held securely and then routed directly to your connected bank account or digital wallet.'
    },
    {
        question: 'Do buyers need an account to purchase my products?',
        answer: 'No! Buyers can check out seamlessly using their email address without creating an account. They will instantly receive an automated email receipt containing their secure download links or ticket QR codes.'
    },
    {
        question: 'Can I customize my storefront?',
        answer: 'Absolutely. Every creator gets a personalized storefront URL. You can customize your brand colors, upload a custom banner image, add your biography, and organize your products into categories so your profile matched your personal brand.'
    }
];

export const FaqSection: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleAccordion = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="py-24 bg-brand-light border-y border-selar-border/50">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-selar-border/50">
                        <MessageCircleQuestion className="w-8 h-8 text-brand-purple" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-brand-dark mb-4 drop-shadow-sm">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-brand-muted text-lg">
                        Everything you need to know about the product and billing.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className={`bg-white border ${openIndex === index ? 'border-brand-purple/30 shadow-md' : 'border-selar-border shadow-sm'} rounded-[1.5rem] overflow-hidden transition-all`}
                        >
                            <button
                                onClick={() => toggleAccordion(index)}
                                className="w-full text-left px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4 focus:outline-none"
                            >
                                <span className={`font-bold text-lg md:text-xl ${openIndex === index ? 'text-brand-purple' : 'text-brand-dark'}`}>
                                    {faq.question}
                                </span>
                                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openIndex === index ? 'bg-brand-purple text-white' : 'bg-brand-light text-brand-muted'}`}>
                                    {openIndex === index ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                </div>
                            </button>
                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0 text-brand-muted leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
