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
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white rounded-2xl p-3 border border-selar-border hover:shadow-card-hover transition-all duration-300 group flex flex-col"
            >
              <Link href={`/book/${product.id}`} className="aspect-[4/5] rounded-xl mb-3 relative overflow-hidden flex items-center justify-center cursor-pointer bg-brand-light">
                <img src={product.coverUrl} alt={product.title} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />

                <div className="absolute top-2.5 left-2.5 badge-dark text-[9px]">
                  {product.type}
                </div>

                <div className="absolute top-2.5 right-2.5 bg-white px-2 py-1 rounded-lg text-xs font-bold text-brand-dark border border-selar-border/50">
                  {formatPrice(product.price)}
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="bg-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-elevated">
                    <Eye className="w-3 h-3" /> View Listing
                  </div>
                </div>
              </Link>

              <div className="px-1 pb-1 flex-1 flex flex-col">
                <Link href={`/book/${product.id}`} className="block">
                  <h3 className="font-bold text-sm text-brand-dark mb-1 hover:text-brand-purple transition-colors line-clamp-1">{product.title}</h3>
                </Link>
                <p className="text-brand-muted text-xs mb-3 line-clamp-2">{product.description}</p>

                <div className="mt-auto pt-3 border-t border-selar-border/50 flex items-center justify-between gap-4">
                  <span className="text-xs font-medium text-brand-muted">by {product.creator.split(' ')[0]}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="p-2 rounded-lg bg-brand-dark text-white hover:bg-brand-purple transition-all"
                    title="Add to Cart"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
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