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

export const SellerStorefront: React.FC<{ storeNameParam?: string }> = ({ storeNameParam }) => {
    const params = useParams<{ sellerId?: string }>();
    const router = useRouter();
    const { products, addToCart, orders, reviews, getAllUsers } = useStore();
    const [sellerInfo, setSellerInfo] = useState<User | null>(null);

    const identifier = storeNameParam || params.sellerId;

    useEffect(() => {
        // Fetch seller details to get brand color and banner
        const loadSellerInfo = async () => {
            const users = await getAllUsers();
            let seller;
            if (storeNameParam) {
                const decoded = decodeURIComponent(storeNameParam).toLowerCase();
                seller = users.find(u => 
                    u.storeName?.toLowerCase() === decoded || 
                    u.name.toLowerCase() === decoded
                );
            } else {
                seller = users.find(u => u.id === identifier);
            }
            if (seller) setSellerInfo(seller);
        };
        if (identifier) loadSellerInfo();
    }, [identifier, storeNameParam, getAllUsers]);

    const resolvedSellerId = sellerInfo?.id || params.sellerId;
    const sellerProducts = products.filter(p => p.creatorId === resolvedSellerId);
    const sellerName = sellerInfo?.name || sellerProducts[0]?.creator || 'Unknown Creator';
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
            <div className="relative h-64 md:h-80 bg-brand-dark overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: `url(${sellerInfo?.storeBanner || 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?auto=format&fit=crop&q=80&w=1200'})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/50 to-transparent" />
                {/* Back button */}
                <div className="absolute top-6 left-6 z-10">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 bg-white text-brand-dark hover:bg-gray-50 text-sm font-bold transition-all shadow-sm rounded-full px-4 py-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                </div>
            </div>

            <div className="container mx-auto px-6 max-w-6xl">
                {/* Profile Card — overlaps banner */}
                <motion.div initial="hidden" animate="visible" variants={fadeUp} className="-mt-24 mb-16 relative z-10">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-elevated p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-8">
                        {/* Avatar */}
                        {sellerInfo?.avatar ? (
                            <img
                                src={sellerInfo.avatar}
                                alt={sellerName}
                                className="w-32 h-32 rounded-3xl object-cover border-8 border-white shadow-md -mt-16 md:mt-0 bg-white"
                            />
                        ) : (
                            <div className="w-32 h-32 bg-brand-light rounded-3xl flex items-center justify-center text-brand-primary text-5xl font-bold border-8 border-white shadow-md -mt-16 md:mt-0">
                                {sellerName.charAt(0)}
                            </div>
                        )}
                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-brand-dark mb-2">{sellerInfo?.storeName || sellerName}</h1>
                            <p className="text-gray-500 text-base mb-6 max-w-2xl leading-relaxed">
                                {sellerInfo?.storeDescription || sellerInfo?.bio || 'Digital product creator and educator on Banolite.'}
                            </p>

                            {/* Stats row */}
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="flex items-center gap-2 bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-full font-bold">
                                    <Package className="w-4 h-4" />
                                    {sellerProducts.length} Products
                                </span>
                                <span className="flex items-center gap-2 bg-gray-100 text-brand-dark px-3 py-1.5 rounded-full font-bold">
                                    <TrendingUp className="w-4 h-4 text-gray-500" />
                                    {totalSales} Sales
                                </span>
                                {avgRating && (
                                    <span className="flex items-center gap-2 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full font-bold">
                                        <Star className="w-4 h-4 fill-current" />
                                        {avgRating} Avg Rating
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Social Links */}
                        <div className="flex items-center gap-2">
                            {sellerInfo?.socialLinks?.twitter && (
                                <a href={sellerInfo.socialLinks.twitter.startsWith('http') ? sellerInfo.socialLinks.twitter : `https://twitter.com/${sellerInfo.socialLinks.twitter}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-brand-light border border-selar-border rounded-xl hover:bg-selar-border/30 transition-all">
                                    <Twitter className="w-4 h-4 text-brand-dark" />
                                </a>
                            )}
                            {sellerInfo?.socialLinks?.website && (
                                <a href={sellerInfo.socialLinks.website.startsWith('http') ? sellerInfo.socialLinks.website : `https://${sellerInfo.socialLinks.website}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-brand-light border border-selar-border rounded-xl hover:bg-selar-border/30 transition-all">
                                    <Globe className="w-4 h-4 text-brand-dark" />
                                </a>
                            )}
                            {!sellerInfo?.socialLinks?.twitter && !sellerInfo?.socialLinks?.website && (
                                <span className="text-xs text-brand-muted italic">No social links</span>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Featured Product Spotlight */}
                {featuredProduct && (
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16">
                        <h2 className="font-display font-extrabold text-2xl text-brand-dark mb-6 flex items-center gap-2">
                            <Award className="w-6 h-6 text-brand-primary" /> Featured Product
                        </h2>
                        <div
                            className="bg-white rounded-3xl border border-gray-50 shadow-elevated overflow-hidden flex flex-col md:flex-row group cursor-pointer transition-all"
                            onClick={() => router.push(`/book/${featuredProduct.id}`)}
                        >
                            <div className={`md:w-2/5 aspect-[4/3] md:aspect-auto ${featuredProduct.color} overflow-hidden relative`}>
                                <img src={featuredProduct.coverUrl} alt={featuredProduct.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1.5 bg-white text-brand-dark text-xs font-black uppercase tracking-wider rounded-full shadow-md">Bestseller</span>
                                </div>
                            </div>
                            <div className="md:w-3/5 p-8 md:p-10 flex flex-col justify-center">
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="px-3 py-1 bg-brand-primary/10 text-xs font-extrabold uppercase rounded-full text-brand-primary tracking-wide">
                                        {featuredProduct.type}
                                    </span>
                                    {featuredProduct.rating > 0 && (
                                        <span className="flex items-center gap-1 text-sm font-bold text-amber-500">
                                            <Star className="w-4 h-4 fill-current" /> {featuredProduct.rating}
                                        </span>
                                    )}
                                </div>
                                <h3 className="font-display font-black text-3xl text-brand-dark mb-3 group-hover:text-brand-primary transition-colors">
                                    {featuredProduct.title}
                                </h3>
                                <p className="text-gray-500 text-base leading-relaxed mb-8 line-clamp-3">
                                    {featuredProduct.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-3xl font-black text-brand-dark">₦{featuredProduct.price.toFixed(2)}</span>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); addToCart(featuredProduct); }}
                                        className="px-6 py-3 text-white rounded-full font-bold text-sm hover:shadow-lg transition-all flex items-center gap-2" style={{ backgroundColor: sellerInfo?.brandColor || '#111827' }}
                                    >
                                        <ShoppingCart className="w-5 h-5" /> Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* All Products Grid */}
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-12">
                    <h2 className="font-display font-extrabold text-2xl text-brand-dark mb-6 flex items-center gap-2">
                        <Package className="w-6 h-6 text-gray-400" /> All Products
                        <span className="text-base font-medium text-gray-500 ml-1">({sellerProducts.length})</span>
                    </h2>

                    <motion.div
                        initial="hidden" whileInView="visible" viewport={{ once: true }}
                        variants={stagger}
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    >
                        {(otherProducts.length > 0 ? otherProducts : sellerProducts).map(product => (
                            <motion.div
                                key={product.id}
                                variants={fadeUp}
                                whileHover={{ y: -6, transition: { duration: 0.3 } }}
                                className="bg-white rounded-3xl overflow-hidden border border-gray-50 shadow-sm hover:shadow-elevated transition-all group cursor-pointer"
                                onClick={() => router.push(`/book/${product.id}`)}
                            >
                                <div className={`aspect-[4/3] ${product.color} relative overflow-hidden`}>
                                    <img
                                        src={product.coverUrl}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white px-3 py-1.5 rounded-full text-xs font-black tracking-wide text-brand-dark uppercase shadow-sm">
                                            {product.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 md:p-8">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-xs text-brand-primary font-bold">{product.tags[0]}</span>
                                        {product.rating > 0 && (
                                            <span className="flex items-center gap-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                                                <Star className="w-3 h-3 fill-current" />
                                                {product.rating}
                                            </span>
                                        )}
                                    </div>
                                    <h3 className="font-extrabold text-brand-dark text-lg mb-3 line-clamp-2 group-hover:text-brand-primary transition-colors leading-snug">
                                        {product.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-4 md:mt-6">
                                        <span className="text-2xl font-black text-brand-dark">₦{product.price.toFixed(2)}</span>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                                            className="p-3 bg-gray-100 text-brand-dark rounded-full hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                                        >
                                            <ShoppingCart className="w-5 h-5" />
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
