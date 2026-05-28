'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

import dynamic from 'next/dynamic';

const PdfCover = dynamic(() => import('./PdfCover').then(mod => mod.PdfCover), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center bg-[#F9F9F9] text-brand-muted">Loading cover...</div>
});

const topSellers = [
    {
        id: 'book-1',
        title: 'My Amazing Character and I',
        author: 'Etima Umeh',
        price: '₦5,000',
        rating: 5.0,
        reviews: 124,
        image: '/etima-images/1.jpeg',
    },
    {
        id: 'book-2',
        title: 'My Big Feelings And I',
        author: 'Ngozi Obi',
        price: '₦5,000',
        rating: 4.9,
        reviews: 89,
        image: '/etima-images/WhatsApp%20Image%202026-05-23%20at%2010.20.32%20(1).jpeg',
    },
    {
        id: 'book-3',
        title: 'My Wonderful Siblings and I',
        author: 'Tosin Adewale',
        price: '₦5,000',
        rating: 4.8,
        reviews: 210,
        image: '/etima-images/WhatsApp%20Image%202026-05-23%20at%2010.20.32.jpeg',
    },
    {
        id: 'book-4',
        title: 'NO IS ENOUGH',
        author: 'Fatima Bello',
        price: '₦5,000',
        rating: 5.0,
        reviews: 156,
        image: '/etima-images/WhatsApp%20Image%202026-05-23%20at%2010.20.33%20(1).jpeg',
    },
    {
        id: 'book-5',
        title: "RED FLAGS DON'T LIE",
        author: 'Chinedu Okafor',
        price: '₦5,000',
        rating: 4.9,
        reviews: 102,
        image: "/etima-images/WhatsApp%20Image%202026-05-23%20at%2010.20.33%20(2).jpeg",
    },
    {
        id: 'book-6',
        title: 'THE SPIRITUALLY INTELLIGENT GIRL',
        author: 'Dr. Tomiwa Alabi',
        price: '₦5,000',
        rating: 5.0,
        reviews: 300,
        image: '/etima-images/WhatsApp%20Image%202026-05-23%20at%2010.20.33.jpeg',
    },
];

export const TopSellers: React.FC = () => {
    return (
        <section className="py-24 bg-white border-b border-[#E5E5E5]">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div>
                        <h2 className="font-display font-bold text-4xl tracking-[-1px] text-brand-dark mb-4">
                            Top Sellers
                        </h2>
                        <p className="text-lg text-brand-muted max-w-2xl">
                            Discover the most loved books that are changing lives. Get your copy today.
                        </p>
                    </div>
                    <button className="mt-6 md:mt-0 px-6 py-3 rounded-full bg-brand-dark text-white font-medium hover:bg-black transition-colors">
                        View All Books
                    </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {topSellers.map((book, i) => (
                        <motion.div
                            key={book.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-50px' }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="group cursor-pointer flex flex-col"
                        >
                            <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-5 bg-[#F9F9F9] border border-[#E5E5E5]">
                                <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                    <span className="px-6 py-3 bg-white text-brand-dark rounded-full font-bold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        Quick View
                                    </span>
                                </div>
                            </div>
                            
                            <div className="mt-auto">
                                <div className="flex items-center space-x-1 mb-2">
                                    <Star className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
                                    <span className="text-sm font-medium text-brand-dark">{book.rating}</span>
                                    <span className="text-sm text-brand-muted">({book.reviews})</span>
                                </div>
                                <h3 className="font-bold text-xl text-brand-dark font-display tracking-tight mb-1 group-hover:text-brand-primary transition-colors">
                                    {book.title}
                                </h3>
                                <p className="text-sm text-brand-muted mb-3">by {book.author}</p>
                                <div className="font-bold text-lg text-brand-dark">
                                    {book.price}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
