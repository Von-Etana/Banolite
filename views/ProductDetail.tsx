'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ShoppingCart, Star, ArrowLeft, Lock, Heart, Share2, Eye, BookOpen,
    Users, Clock, FileText, Check, ChevronRight, Sparkles
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const ProductDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const { addToCart, user, reviews, addReview, products, toggleAuth } = useStore();
    const product = products.find(b => b.id === id);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [addedToCart, setAddedToCart] = useState(false);

    if (!product) {
        return (
            <div className="min-h-screen pt-32 pb-20">
                <div className="container mx-auto px-6 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-10 h-10 text-gray-400" />
                    </div>
                    <h1 className="font-display font-bold text-3xl text-brand-dark mb-4">Product Not Found</h1>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">The product you're looking for doesn't exist or has been removed.</p>
                    <button onClick={() => router.push('/products')} className="px-8 py-3 bg-selar-black text-white rounded-xl font-bold">
                        Browse Products
                    </button>
                </div>
            </div>
        );
    }

    const productReviews = reviews.filter(r => r.productId === product.id);
    const averageRating = productReviews.length > 0
        ? productReviews.reduce((acc, r) => acc + r.rating, 0) / productReviews.length
        : 0;
    const hasPurchased = user?.purchasedProductIds.includes(product.id);

    // Star distribution
    const starDistribution = [5, 4, 3, 2, 1].map(star => ({
        star,
        count: productReviews.filter(r => r.rating === star).length,
        percentage: productReviews.length > 0
            ? (productReviews.filter(r => r.rating === star).length / productReviews.length) * 100
            : 0
    }));

    // Related products from same creator
    const creatorProducts = products.filter(p => p.creatorId === product.creatorId && p.id !== product.id).slice(0, 4);

    // Frequently bought together (random picks from other products)
    const frequentlyBought = products.filter(p => p.id !== product.id && p.category === product.category).slice(0, 2);
    const bundleTotal = product.price + frequentlyBought.reduce((s, p) => s + p.price, 0);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        addReview(product.id, rating, comment);
        setComment('');
    };

    const handleAddToCart = () => {
        addToCart(product);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2000);
    };

    return (
        <div className="min-h-screen pt-20 pb-20">
            {/* Breadcrumb */}
            <div className="container mx-auto px-6 py-4">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-brand-muted hover:text-brand-dark transition-colors text-sm font-medium"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to browsing
                </button>
            </div>

            {/* Hero Section */}
            <motion.div
                initial="hidden" animate="visible" variants={fadeUp}
                className="container mx-auto px-6"
            >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                    {/* Left: Cover Image */}
                    <div className="relative group">
                        <div className={`aspect-[4/5] rounded-3xl overflow-hidden ${product.color} border border-selar-border`}>
                            <img
                                src={product.coverUrl}
                                alt={product.title}
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700"
                            />
                        </div>
                        {/* Floating actions */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2">
                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/90 backdrop-blur text-gray-600 hover:text-red-500'}`}
                            >
                                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                            </button>
                            <button className="w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-600 hover:text-brand-dark transition-all shadow-md">
                                <Share2 className="w-4 h-4" />
                            </button>
                        </div>
                        {/* Type badge */}
                        <div className="absolute top-4 left-4">
                            <span className="px-3 py-1.5 bg-white/90 backdrop-blur rounded-lg text-[10px] font-bold uppercase tracking-wider text-brand-dark shadow-sm">
                                {product.type}
                            </span>
                        </div>
                    </div>

                    {/* Right: Product Info */}
                    <div className="flex flex-col justify-center lg:pl-4">
                        {/* Tags */}
                        <div className="flex items-center gap-2 mb-4 flex-wrap">
                            {product.tags.map(tag => (
                                <span key={tag} className="px-3 py-1 bg-brand-light border border-selar-border rounded-lg text-[11px] font-semibold text-brand-dark uppercase tracking-wide">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <h1 className="font-display font-bold text-3xl lg:text-4xl text-brand-dark mb-3 leading-tight tracking-tight">
                            {product.title}
                        </h1>

                        {/* Creator link */}
                        <button
                            onClick={() => router.push(`/store/${product.creatorId}`)}
                            className="flex items-center gap-2 text-brand-muted hover:text-brand-purple transition-colors mb-6 w-fit"
                        >
                            <div className="w-8 h-8 bg-brand-light rounded-full flex items-center justify-center text-brand-purple font-bold text-sm">
                                {product.creator.charAt(0)}
                            </div>
                            <span className="text-sm font-medium">{product.creator}</span>
                            <ChevronRight className="w-3 h-3" />
                        </button>

                        {/* Rating summary */}
                        {productReviews.length > 0 && (
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(averageRating) ? 'text-amber-400 fill-current' : 'text-gray-200 fill-current'}`} />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-brand-dark">{averageRating.toFixed(1)}</span>
                                <span className="text-sm text-brand-muted">({productReviews.length} reviews)</span>
                                <span className="text-sm text-brand-muted">•</span>
                                <span className="text-sm text-brand-muted flex items-center gap-1"><Eye className="w-3 h-3" /> {product.salesCount} sold</span>
                            </div>
                        )}

                        {/* Description */}
                        <p className="text-brand-muted leading-relaxed mb-8">
                            {product.description}
                        </p>

                        {/* Bento Info Grid */}
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            {product.type === 'EBOOK' && (
                                <>
                                    <div className="p-4 bg-white border border-selar-border rounded-xl">
                                        <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-1">Format</span>
                                        <span className="font-semibold text-brand-dark text-sm">PDF, EPUB</span>
                                    </div>
                                    <div className="p-4 bg-white border border-selar-border rounded-xl">
                                        <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-1">Language</span>
                                        <span className="font-semibold text-brand-dark text-sm">English</span>
                                    </div>
                                </>
                            )}
                            {product.type === 'COURSE' && (
                                <>
                                    <div className="p-4 bg-white border border-selar-border rounded-xl">
                                        <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-1">Lessons</span>
                                        <span className="font-semibold text-brand-dark text-sm">{product.lessons || 12} modules</span>
                                    </div>
                                    <div className="p-4 bg-white border border-selar-border rounded-xl">
                                        <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-1">Duration</span>
                                        <span className="font-semibold text-brand-dark text-sm">{product.duration || '6 hours'}</span>
                                    </div>
                                </>
                            )}
                            <div className="p-4 bg-white border border-selar-border rounded-xl">
                                <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-1">Sales</span>
                                <span className="font-semibold text-brand-dark text-sm">{product.salesCount}+ copies</span>
                            </div>
                            <div className="p-4 bg-white border border-selar-border rounded-xl">
                                <span className="text-[10px] text-brand-muted uppercase font-bold tracking-wider block mb-1">Category</span>
                                <span className="font-semibold text-brand-dark text-sm">{product.category || 'General'}</span>
                            </div>
                        </div>

                        {/* Price & CTA */}
                        <div className="flex items-center gap-4">
                            <div>
                                <span className="text-3xl font-bold text-brand-dark">${product.price.toFixed(2)}</span>
                                {product.discountOffer && product.discountOffer > 0 && (
                                    <span className="text-sm text-brand-muted line-through ml-2">
                                        ${(product.price / (1 - product.discountOffer / 100)).toFixed(2)}
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-sm ${addedToCart
                                    ? 'bg-green-500 text-white shadow-green-500/20'
                                    : 'bg-brand-dark text-white hover:bg-black shadow-brand-dark/20'
                                    }`}
                            >
                                {addedToCart ? (
                                    <><Check className="w-5 h-5" /> Added to Cart</>
                                ) : (
                                    <><ShoppingCart className="w-5 h-5" /> Add to Cart</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Reviews & Star Distribution */}
            <div className="container mx-auto px-6 mb-16">
                <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                    <h2 className="font-display font-bold text-2xl text-brand-dark mb-8">Reviews & Ratings</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Star Distribution */}
                        <div className="bg-white rounded-2xl border border-selar-border p-6">
                            <div className="text-center mb-6">
                                <p className="text-5xl font-bold text-brand-dark mb-1">{averageRating > 0 ? averageRating.toFixed(1) : '—'}</p>
                                <div className="flex justify-center gap-0.5 mb-2">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(averageRating) ? 'text-amber-400 fill-current' : 'text-gray-200 fill-current'}`} />
                                    ))}
                                </div>
                                <p className="text-sm text-brand-muted">{productReviews.length} reviews</p>
                            </div>
                            <div className="space-y-2.5">
                                {starDistribution.map(({ star, count, percentage }) => (
                                    <div key={star} className="flex items-center gap-3">
                                        <span className="text-xs font-bold text-brand-muted w-4 text-right">{star}</span>
                                        <Star className="w-3 h-3 text-amber-400 fill-current" />
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-400 rounded-full transition-all duration-500"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-brand-muted w-6 text-right">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Reviews List + Form */}
                        <div className="lg:col-span-2">
                            {/* Review Form */}
                            {user && hasPurchased && (
                                <div className="bg-white border border-selar-border rounded-2xl p-6 mb-6">
                                    <h3 className="font-bold text-brand-dark mb-4">Write a Review</h3>
                                    <form onSubmit={handleSubmitReview}>
                                        <div className="flex items-center gap-1 mb-4">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    onClick={() => setRating(star)}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    className="transition-transform hover:scale-125"
                                                >
                                                    <Star className={`w-6 h-6 ${star <= (hoverRating || rating) ? 'text-amber-400 fill-current' : 'text-gray-200 fill-current'}`} />
                                                </button>
                                            ))}
                                            <span className="text-sm text-brand-muted ml-2">{rating}/5</span>
                                        </div>
                                        <div className="relative mb-4">
                                            <textarea
                                                required
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                placeholder="Share your experience..."
                                                className="w-full bg-brand-light border border-selar-border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-brand-dark/10 transition-all resize-none"
                                                rows={3}
                                                maxLength={500}
                                            />
                                            <span className="absolute bottom-3 right-3 text-[10px] text-brand-muted">{comment.length}/500</span>
                                        </div>
                                        <button type="submit" className="px-6 py-2.5 bg-brand-dark text-white rounded-xl font-semibold text-sm hover:bg-black transition-colors">
                                            Submit Review
                                        </button>
                                    </form>
                                </div>
                            )}

                            {!user && (
                                <div className="bg-white border border-selar-border rounded-2xl p-8 text-center mb-6">
                                    <Lock className="w-6 h-6 text-brand-muted mx-auto mb-3" />
                                    <p className="text-brand-muted text-sm mb-3">Sign in and purchase this product to leave a review.</p>
                                    <button onClick={toggleAuth} className="px-5 py-2 bg-brand-dark text-white rounded-lg font-semibold text-sm">Sign In</button>
                                </div>
                            )}

                            {/* Reviews list */}
                            <div className="space-y-4">
                                {productReviews.length === 0 ? (
                                    <div className="bg-white border border-selar-border rounded-2xl p-8 text-center">
                                        <p className="text-brand-muted text-sm">No reviews yet. Be the first to review!</p>
                                    </div>
                                ) : (
                                    productReviews.map(review => (
                                        <div key={review.id} className="bg-white border border-selar-border rounded-2xl p-5">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 bg-brand-light rounded-full flex items-center justify-center text-brand-purple font-bold text-sm">
                                                        {review.userName.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-brand-dark text-sm">{review.userName}</h4>
                                                        <div className="flex gap-0.5">
                                                            {[1, 2, 3, 4, 5].map(s => (
                                                                <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-amber-400 fill-current' : 'text-gray-200 fill-current'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className="text-[10px] text-brand-muted">{new Date(review.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-brand-muted text-sm leading-relaxed">{review.comment}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* More from this Creator */}
            {creatorProducts.length > 0 && (
                <div className="container mx-auto px-6 mb-16">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-display font-bold text-2xl text-brand-dark">More from {product.creator}</h2>
                            <button
                                onClick={() => router.push(`/store/${product.creatorId}`)}
                                className="text-sm font-semibold text-brand-dark flex items-center gap-1 hover:gap-2 transition-all"
                            >
                                View Store <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                            {creatorProducts.map(p => (
                                <div
                                    key={p.id}
                                    onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); router.push(`/book/${p.id}`); }}
                                    className="min-w-[220px] max-w-[220px] bg-white rounded-2xl overflow-hidden border border-selar-border hover:shadow-lg transition-all cursor-pointer group flex-shrink-0"
                                >
                                    <div className={`aspect-[4/3] ${p.color} overflow-hidden`}>
                                        <img src={p.coverUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-brand-dark text-sm mb-1 line-clamp-2 group-hover:text-brand-purple transition-colors">{p.title}</h4>
                                        <p className="text-xs text-brand-muted mb-2">{p.type}</p>
                                        <span className="font-bold text-brand-dark text-sm">${p.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Frequently Bought Together */}
            {frequentlyBought.length > 0 && (
                <div className="container mx-auto px-6 mb-16">
                    <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
                        <h2 className="font-display font-bold text-2xl text-brand-dark mb-6 flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-brand-purple" /> Frequently Bought Together
                        </h2>
                        <div className="bg-white rounded-2xl border border-selar-border p-6">
                            <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
                                {/* Current product */}
                                <div className="flex items-center gap-3 flex-1">
                                    <div className={`w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 ${product.color}`}>
                                        <img src={product.coverUrl} alt={product.title} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-brand-dark text-sm line-clamp-1">{product.title}</p>
                                        <p className="text-sm font-bold text-brand-dark">${product.price.toFixed(2)}</p>
                                    </div>
                                </div>

                                {frequentlyBought.map((p, idx) => (
                                    <React.Fragment key={p.id}>
                                        <span className="text-2xl font-bold text-brand-muted">+</span>
                                        <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); router.push(`/book/${p.id}`); }}>
                                            <div className={`w-16 h-20 rounded-xl overflow-hidden flex-shrink-0 ${p.color}`}>
                                                <img src={p.coverUrl} alt={p.title} className="w-full h-full object-cover" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-brand-dark text-sm line-clamp-1 hover:text-brand-purple transition-colors">{p.title}</p>
                                                <p className="text-sm font-bold text-brand-dark">${p.price.toFixed(2)}</p>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-selar-border">
                                <div>
                                    <p className="text-xs text-brand-muted uppercase font-bold tracking-wider">Bundle Price</p>
                                    <p className="text-2xl font-bold text-brand-dark">${bundleTotal.toFixed(2)}</p>
                                </div>
                                <button
                                    onClick={() => {
                                        addToCart(product);
                                        frequentlyBought.forEach(p => addToCart(p));
                                    }}
                                    className="px-6 py-3 bg-brand-dark text-white rounded-xl font-bold text-sm hover:bg-black transition-colors shadow-lg"
                                >
                                    Add All to Cart
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};
