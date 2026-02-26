'use client';
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '../context/StoreContext';
import { useEffect, useState } from 'react';
import { User } from '../types';
import {
    Star, MapPin, Globe, Twitter, ShoppingCart,
    ArrowLeft, Package, Users, Calendar, ChevronRight,
    ExternalLink, Award, TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export const SellerStorefront: React.FC = () => {
    const { sellerId } = useParams<{ sellerId: string }>();
    const router = useRouter();
    const { products, addToCart, orders, reviews, getAllUsers } = useStore();
    const [sellerInfo, setSellerInfo] = useState<User | null>(null);

    useEffect(() => {
        // Fetch seller details to get brand color and banner
        const loadSellerInfo = async () => {
            const users = await getAllUsers();
            const seller = users.find(u => u.id === sellerId);
            if(seller) setSellerInfo(seller);
        };
        loadSellerInfo();
    }, [sellerId, getAllUsers]);

    const sellerProducts = products.filter(p => p.creatorId === sellerId);
    const sellerName = sellerProducts[0]?.creator || 'Unknown Creator';
    const totalSales = sellerProducts.reduce((sum, p) => sum + (p.salesCount || 0), 0);

    // Calculate average rating across all seller products
    const sellerReviews = reviews.filter(r => sellerProducts.some(p => p.id === r.productId));
    const avgRating = sellerReviews.length > 0
        ? (sellerReviews.reduce((s, r) => s + r.rating, 0) / sellerReviews.length).toFixed(1)
        : null;

    // Featured product (highest sales)
    const featuredProduct = [...sellerProducts].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0))[0];
    const otherProducts = sellerProducts.filter(p => p.id !== featuredProduct?.id);

    if (sellerProducts.length === 0) {
        return (
            <div className="min-h-screen pt-32 pb-20">
                <div className="container mx-auto px-6 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package className="w-10 h-10 text-gray-400" />
                    </div>
                    <h1 className="font-display font-bold text-3xl text-brand-dark mb-4">Store Not Found</h1>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        This creator doesn&apos;t have any products yet or the store doesn&apos;t exist.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-8 py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-black transition-all"
                    >
                        Browse Marketplace
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-16 pb-20">
            {/* Hero Banner */}
            <div className="relative h-56 md:h-72 bg-brand-dark overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-30"
                    style={{ backgroundImage: `url(${sellerInfo?.storeBanner || 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=1200'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Back button */}
                <div className="absolute top-6 left-6 z-10">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-6">
                {/* Profile Card — overlaps banner */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="-mt-20 mb-10">
                    <div className="bg-white rounded-2xl border border-selar-border shadow-sm p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Avatar */}
                        <div className="w-24 h-24 bg-brand-light rounded-2xl flex items-center justify-center text-brand-purple text-4xl font-bold border-4 border-white shadow-md -mt-20 md:mt-0">
                            {sellerName.charAt(0)}
                        </div>
                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="font-display font-bold text-2xl md:text-3xl text-brand-dark mb-1">{sellerName}</h1>
                            <p className="text-brand-muted text-sm mb-4">Digital product creator and educator on Banolite.</p>

                            {/* Stats row */}
                            <div className="flex flex-wrap items-center gap-4 text-sm">
                                <span className="flex items-center gap-1.5 text-brand-muted font-medium">
                                    <Package className="w-4 h-4" />
                                    <span className="text-brand-dark font-bold">{sellerProducts.length}</span> Products
                                </span>
                                <span className="flex items-center gap-1.5 text-brand-muted font-medium">
                                    <TrendingUp className="w-4 h-4" />
                                    <span className="text-brand-dark font-bold">{totalSales}</span> Sales
                                </span>
                                {avgRating && (
                                    <span className="flex items-center gap-1.5 text-brand-muted font-medium">
                                        <Star className="w-4 h-4 text-amber-400 fill-current" />
                                        <span className="text-brand-dark font-bold">{avgRating}</span> Avg Rating
                                    </span>
                                )}
                                <span className="flex items-center gap-1.5 text-brand-muted font-medium">
                                    <Calendar className="w-4 h-4" />
                                    Joined 2024
                                </span>
                            </div>
                        </div>
                        {/* Social Links */}
                        <div className="flex items-center gap-2">
                            <button className="p-3 bg-brand-light border border-selar-border rounded-xl hover:bg-selar-border/30 transition-all">
                                <Twitter className="w-4 h-4 text-brand-dark" />
                            </button>
                            <button className="p-3 bg-brand-light border border-selar-border rounded-xl hover:bg-selar-border/30 transition-all">
                                <Globe className="w-4 h-4 text-brand-dark" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Featured Product Spotlight */}
                {featuredProduct && (
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
                        <h2 className="font-display font-bold text-xl text-brand-dark mb-5 flex items-center gap-2">
                            <Award className="w-5 h-5 text-amber-500" /> Featured Product
                        </h2>
                        <div
                            className="bg-white rounded-2xl border border-selar-border overflow-hidden flex flex-col md:flex-row group cursor-pointer hover:shadow-lg transition-all"
                            onClick={() => router.push(`/book/${featuredProduct.id}`)}
                        >
                            <div className={`md:w-2/5 aspect-[4/3] md:aspect-auto ${featuredProduct.color} overflow-hidden relative`}>
                                <img src={featuredProduct.coverUrl} alt={featuredProduct.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-3 left-3">
                                    <span className="px-2.5 py-1 bg-amber-400 text-brand-dark text-[10px] font-bold uppercase tracking-wider rounded-lg">Bestseller</span>
                                </div>
                            </div>
                            <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="px-2.5 py-1 bg-brand-light border border-selar-border text-[10px] font-bold uppercase rounded-lg text-brand-dark">
                                        {featuredProduct.type}
                                    </span>
                                    {featuredProduct.rating > 0 && (
                                        <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                                            <Star className="w-3 h-3 fill-current" /> {featuredProduct.rating}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-display font-bold text-2xl text-brand-dark mb-2 group-hover:text-brand-purple transition-colors">
                                    {featuredProduct.title}
                                </h3>
                                <p className="text-brand-muted text-sm leading-relaxed mb-6 line-clamp-3">
                                    {featuredProduct.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-2xl font-bold text-brand-dark">${featuredProduct.price.toFixed(2)}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); addToCart(featuredProduct); }}
                                        className="px-5 py-2.5 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-colors flex items-center gap-2" style={{ backgroundColor: sellerInfo?.brandColor || '#111827' }}
                                    >
                                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* All Products Grid */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
                    <h2 className="font-display font-bold text-xl text-brand-dark mb-5 flex items-center gap-2">
                        <Package className="w-5 h-5 text-brand-purple" /> All Products
                        <span className="text-sm font-normal text-brand-muted ml-1">({sellerProducts.length})</span>
                    </h2>

                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                    >
                        {(otherProducts.length > 0 ? otherProducts : sellerProducts).map(product => (
                            <motion.div
                                key={product.id}
                                variants={fadeUp}
                                whileHover={{ y: -4, transition: { duration: 0.2 } }}
                                className="bg-white rounded-2xl overflow-hidden border border-selar-border hover:shadow-lg transition-all group cursor-pointer"
                                onClick={() => router.push(`/book/${product.id}`)}
                            >
                                <div className={`aspect-[4/3] ${product.color} relative overflow-hidden`}>
                                    <img
                                        src={product.coverUrl}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-brand-dark uppercase shadow-sm">
                                            {product.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs text-brand-purple font-semibold">{product.tags[0]}</span>
                                        {product.rating > 0 && (
                                            <span className="flex items-center gap-1 text-amber-500 text-xs">
                                                <Star className="w-3 h-3 fill-current" />
                                                {product.rating}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-bold text-brand-dark mb-2 line-clamp-2 group-hover:text-brand-purple transition-colors text-sm">
                                        {product.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-lg font-bold text-brand-dark">${product.price.toFixed(2)}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                            className="p-2 text-white rounded-lg hover:opacity-90 transition-all" style={{ backgroundColor: sellerInfo?.brandColor || '#111827' }}
                                        >
                                            <ShoppingCart className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};
