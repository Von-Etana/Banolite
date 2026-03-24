'use client';
import React, { useState } from 'react';
import { ShoppingCart, Eye, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useCurrency } from '../context/CurrencyContext';
import Link from 'next/link';
import { ProductType } from '../types';
import { motion } from 'framer-motion';

export const ProductSection: React.FC = () => {
  const { products, addToCart } = useStore();
  const { formatPrice } = useCurrency();
  const [filter, setFilter] = useState<ProductType | 'ALL'>('ALL');

  const filteredProducts = filter === 'ALL'
    ? products
    : products.filter(p => p.type === filter);

  const categories: { label: string; value: ProductType | 'ALL' }[] = [
    { label: 'All Assets', value: 'ALL' },
    { label: 'eBooks', value: 'EBOOK' },
    { label: 'Courses', value: 'COURSE' },
    { label: 'Tickets', value: 'TICKET' },
    { label: 'Services', value: 'SERVICE' },
  ];

  return (
    <section id="store" className="py-20">
      <div className="container mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6"
        >
          <div>
            <h2 className="section-heading mb-2">Explore Marketplace</h2>
            <p className="section-subtext">High-quality digital assets from top creators worldwide.</p>
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto hide-scroll">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${filter === cat.value
                  ? 'bg-brand-dark text-white border-brand-dark'
                  : 'bg-white text-brand-muted border-selar-border hover:border-brand-dark/30'
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-4 border border-gray-200 hover:border-gray-300 hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-300 group flex flex-col"
            >
              <Link href={`/book/${product.id}`} className="aspect-[4/5] rounded-xl mb-4 relative overflow-hidden flex items-center justify-center cursor-pointer bg-gray-100 shadow-inner">
                <img src={product.coverUrl} alt={product.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />

                <div className="absolute top-3 left-3 bg-brand-dark text-white shadow-md text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-md">
                  {product.type}
                </div>

                <div className="absolute top-3 right-3 bg-white px-2.5 py-1 rounded-md text-xs font-bold text-brand-dark shadow-md border border-gray-100">
                  {formatPrice(product.price)}
                </div>

                {/* Hover Overlay - Solid (No Blur) */}
                <div className="absolute inset-0 bg-brand-dark/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xl text-brand-dark transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Eye className="w-3.5 h-3.5" /> View Product
                  </div>
                </div>
              </Link>

              <div className="px-1 pb-1 flex-1 flex flex-col">
                <Link href={`/book/${product.id}`} className="block">
                  <h3 className="font-bold text-base text-gray-900 mb-1.5 hover:text-brand-primary transition-colors line-clamp-1">{product.title}</h3>
                </Link>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">by {product.creator.split(' ')[0]}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-2.5 rounded-xl bg-gray-50 text-gray-700 hover:bg-brand-primary hover:text-white hover:shadow-lg hover:shadow-brand-primary/20 transition-all border border-gray-200 hover:border-brand-primary"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-brand-light rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Eye className="w-7 h-7 text-brand-muted" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark mb-1">No products found</h3>
            <p className="text-brand-muted text-sm">Try a different category filter.</p>
          </div>
        )}

      </div>
    </section>
  );
};