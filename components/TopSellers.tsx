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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12">
                    <div>
                        <h2 className="font-sans font-bold text-2xl md:text-3xl tracking-tight text-brand-dark mb-2 md:mb-4">
                            Top Sellers
                        </h2>
                        <p className="text-sm md:text-base text-brand-muted max-w-2xl">
                            Discover the most loved books that are changing lives. Get your copy today.
                        </p>
                    </div>
                    <button className="mt-4 md:mt-0 px-5 py-2.5 md:px-6 md:py-3 rounded-full bg-brand-dark text-white text-sm md:text-base font-medium hover:bg-black transition-colors">
                        View All Books
                    </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {topSellers.map((book, i) => (
                        <motion.div
                            key={book.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-20px' }}
                            transition={{ duration: 0.4, delay: i * 0.05 }}
                            className="bg-white rounded-xl md:rounded-2xl p-2.5 md:p-4 border border-gray-200 hover:border-gray-300 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group flex flex-col"
                        >
                            <div className="relative aspect-square md:aspect-[4/5] rounded-lg md:rounded-xl overflow-hidden mb-2.5 md:mb-4 bg-gray-100 shadow-inner flex items-center justify-center cursor-pointer">
                                <img src={book.image} alt={book.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                                
                                <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-md text-[10px] md:text-xs font-bold text-brand-dark shadow-md border border-gray-100">
                                    {book.price}
                                </div>

                                <div className="absolute inset-0 bg-brand-dark/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                                    <span className="px-3 py-1.5 md:px-4 md:py-2 bg-white text-brand-dark rounded-lg text-[10px] md:text-xs font-bold shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                        Quick View
                                    </span>
                                </div>
                            </div>
                            
                            <div className="px-1 pb-0.5 md:pb-1 flex-1 flex flex-col cursor-pointer">
                                <div className="flex items-center space-x-1 mb-1 md:mb-1.5">
                                    <Star className="w-3 h-3 md:w-3.5 md:h-3.5 fill-[#FFB800] text-[#FFB800]" />
                                    <span className="text-[10px] md:text-xs font-medium text-brand-dark">{book.rating}</span>
                                    <span className="text-[10px] md:text-xs text-brand-muted">({book.reviews})</span>
                                </div>
                                <h3 className="font-bold text-sm md:text-base text-gray-900 font-sans tracking-tight mb-1 md:mb-1.5 group-hover:text-brand-primary transition-colors line-clamp-1">
                                    {book.title}
                                </h3>
                                <div className="mt-auto pt-2 md:pt-4 border-t border-gray-100">
                                    <span className="text-[10px] md:text-xs font-semibold text-gray-500 uppercase tracking-wide truncate">by {book.author}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
