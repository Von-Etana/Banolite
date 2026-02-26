'use client';
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from 'next/navigation';
import {
    BookOpen, Download, Play, Ticket, Briefcase,
    Calendar, Clock, FileText, ExternalLink, Search,
    Filter, Grid, List, Star, Lock
} from 'lucide-react';
import { Product, Order, Booking, Ticket as TicketType } from '../types';
import { COACHES, EVENTS } from '../constants';
import { format } from 'date-fns';

type ViewMode = 'grid' | 'list';
type FilterType = 'all' | 'EBOOK' | 'COURSE' | 'TICKET' | 'SERVICE';

export const MyLibrary: React.FC = () => {
    const { user, products, orders, toggleAuth, getUserBookings, getUserTickets } = useStore();
    const router = useRouter();
    const [viewMode, setViewMode] = useState<ViewMode>('grid');
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'purchases' | 'bookings' | 'tickets'>('purchases');

    // If not logged in, show login prompt
    if (!user) {
        return (
            <div className="min-h-screen pt-32 pb-20">
                <div className="container mx-auto px-6 text-center">
                    <div className="w-20 h-20 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-selar-black" />
                    </div>
                    <h1 className="font-display font-bold text-3xl text-brand-dark mb-4">Sign in to view your library</h1>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        Access your purchased products, courses, and digital content by signing in to your account.
                    </p>
                    <button
                        onClick={toggleAuth}
                        className="px-8 py-3 bg-selar-black text-white rounded-xl font-bold hover:bg-selar-black/90 transition-all shadow-lg"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    // Get purchased products
    const purchasedProducts = products.filter(p => user.purchasedProductIds.includes(p.id));

    // Apply filters
    const filteredProducts = purchasedProducts.filter(p => {
        const matchesFilter = filter === 'all' || p.type === filter;
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.creator.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const userOrders = orders.filter(o => o.userId === user.id);
    const userBookings = getUserBookings();
    const userTickets = getUserTickets();

    const getProductIcon = (type: string) => {
        switch (type) {
            case 'COURSE': return <Play className="w-5 h-5" />;
            case 'TICKET': return <Ticket className="w-5 h-5" />;
            case 'SERVICE': return <Briefcase className="w-5 h-5" />;
            default: return <FileText className="w-5 h-5" />;
        }
    };

    const getActionButton = (product: Product) => {
        switch (product.type) {
            case 'COURSE':
                return (
                    <button className="w-full py-3 bg-selar-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-selar-black/90 transition-all">
                        <Play className="w-4 h-4" />
                        Start Learning
                    </button>
                );
            case 'TICKET':
                return (
                    <button className="w-full py-3 bg-brand-orange text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-orange/90 transition-all">
                        <Ticket className="w-4 h-4" />
                        View Ticket
                    </button>
                );
            case 'SERVICE':
                return (
                    <button className="w-full py-3 bg-selar-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all">
                        <Briefcase className="w-4 h-4" />
                        Contact Seller
                    </button>
                );
            default:
                return (
                    <button className="w-full py-3 bg-green-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition-all">
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                );
        }
    };

    return (
        <div className="min-h-screen pt-28 pb-20 bg-gray-50">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-display font-bold text-4xl text-brand-dark mb-2">My Library</h1>
                    <p className="text-gray-500">Access all your purchased digital products</p>
                </div>

                {/* Navigation Tabs */}
                <div className="flex items-center gap-8 border-b border-gray-200 mb-8">
                    <button
                        onClick={() => setActiveTab('purchases')}
                        className={`pb-4 font-bold transition-all border-b-2 ${activeTab === 'purchases' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        All Purchases <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{purchasedProducts.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`pb-4 font-bold transition-all border-b-2 ${activeTab === 'bookings' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        My Bookings <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{userBookings.length}</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('tickets')}
                        className={`pb-4 font-bold transition-all border-b-2 ${activeTab === 'tickets' ? 'border-brand-dark text-brand-dark' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                    >
                        My Tickets <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">{userTickets.length}</span>
                    </button>
                </div>

                {activeTab === 'purchases' && (
                    <>
                        {/* Filters and Search */}
                <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
                            {(['all', 'EBOOK', 'COURSE', 'TICKET', 'SERVICE'] as FilterType[]).map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${filter === f
                                        ? 'bg-white text-selar-black shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {f === 'all' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase() + 's'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search your library..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-selar-black/20"
                            />
                        </div>
                        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                            >
                                <Grid className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                            >
                                <List className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Products */}
                {filteredProducts.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-bold text-xl text-brand-dark mb-2">
                            {purchasedProducts.length === 0 ? "Your library is empty" : "No products match your filters"}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {purchasedProducts.length === 0
                                ? "Start exploring our marketplace to find amazing digital products!"
                                : "Try adjusting your search or filter criteria"}
                        </p>
                        {purchasedProducts.length === 0 && (
                            <button
                                onClick={() => router.push('/')}
                                className="px-6 py-3 bg-selar-black text-white rounded-xl font-bold hover:bg-selar-black/90 transition-all"
                            >
                                Browse Marketplace
                            </button>
                        )}
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all group">
                                <div className={`aspect-[4/3] ${product.color} relative overflow-hidden`}>
                                    <img
                                        src={product.coverUrl}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-selar-black flex items-center gap-1.5 uppercase">
                                            {getProductIcon(product.type)}
                                            {product.type}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <h3 className="font-bold text-brand-dark mb-1 line-clamp-2">{product.title}</h3>
                                    <p className="text-sm text-gray-500 mb-4">by {product.creator}</p>
                                    {getActionButton(product)}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filteredProducts.map((product) => (
                            <div key={product.id} className="bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all flex gap-4">
                                <div className={`w-24 h-32 ${product.color} rounded-xl overflow-hidden flex-shrink-0`}>
                                    <img
                                        src={product.coverUrl}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="bg-zinc-100 text-selar-black px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                                                {getProductIcon(product.type)}
                                                {product.type}
                                            </span>
                                            {product.rating > 0 && (
                                                <span className="flex items-center gap-1 text-selar-black text-xs">
                                                    <Star className="w-3 h-3 fill-current" />
                                                    {product.rating}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-brand-dark mb-1">{product.title}</h3>
                                        <p className="text-sm text-gray-500">by {product.creator}</p>
                                    </div>
                                    <div className="flex gap-3 mt-3">
                                        {product.type === 'EBOOK' && (
                                            <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-green-700 transition-all">
                                                <Download className="w-4 h-4" />
                                                Download
                                            </button>
                                        )}
                                        {product.type === 'COURSE' && (
                                            <button className="px-4 py-2 bg-selar-black text-white rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-selar-black/90 transition-all">
                                                <Play className="w-4 h-4" />
                                                Continue Learning
                                            </button>
                                        )}
                                        <button
                                            onClick={() => router.push(`/book/${product.id}`)}
                                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-gray-200 transition-all"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Passes & Bookings */}
                {(userBookings.length > 0 || userTickets.length > 0) && (
                    <div className="mt-12">
                        <h2 className="font-display font-bold text-2xl text-brand-dark mb-6 flex items-center gap-2">
                            <Ticket className="w-6 h-6 text-brand-purple" />
                            Passes & Bookings
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {userTickets.map(ticket => {
                                const event = EVENTS.find(e => e.id === ticket.eventId);
                                if (!event) return null;
                                return (
                                    <div key={ticket.id} className="bg-white rounded-2xl overflow-hidden border border-selar-border shadow-sm flex">
                                        <div className="w-1/3 bg-brand-dark relative">
                                            <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60" />
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-2 text-center bg-black/20">
                                                <span className="text-[10px] font-bold uppercase tracking-widest bg-brand-purple px-2 py-0.5 rounded-md mb-1">{event.type}</span>
                                                <span className="text-xl font-bold font-display">{format(event.date, 'dd')}</span>
                                                <span className="text-xs uppercase">{format(event.date, 'MMM')}</span>
                                            </div>
                                        </div>
                                        <div className="p-4 w-2/3 flex flex-col justify-between">
                                            <div>
                                                <h3 className="font-bold text-brand-dark text-sm mb-1 line-clamp-2">{event.title}</h3>
                                                <p className="text-xs text-brand-muted mb-2 flex items-center gap-1">
                                                    <Ticket className="w-3 h-3" /> Valid Pass
                                                </p>
                                            </div>
                                            <button className="text-xs font-bold text-brand-purple hover:text-brand-dark transition-colors flex items-center gap-1">
                                                View QR Code <ExternalLink className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                            {userBookings.map(booking => {
                                const coach = COACHES.find(c => c.id === booking.coachId);
                                if (!coach) return null;
                                return (
                                    <div key={booking.id} className="bg-white rounded-2xl p-4 border border-selar-border shadow-sm flex flex-col justify-between">
                                        <div className="flex items-center gap-3 mb-4">
                                            <img src={coach.avatar} alt={coach.name} className="w-12 h-12 rounded-xl object-cover bg-brand-light" />
                                            <div>
                                                <h3 className="font-bold text-brand-dark text-sm">{coach.name}</h3>
                                                <p className="text-xs text-brand-muted">Coaching Session</p>
                                            </div>
                                        </div>
                                        <div className="bg-brand-light rounded-xl p-3 flex justify-between items-center mb-4">
                                            <div>
                                                <p className="text-[10px] text-brand-muted uppercase font-bold tracking-wider mb-0.5">Scheduled For</p>
                                                <p className="text-sm font-semibold text-brand-dark">{format(new Date(booking.date), 'MMM do, h:mm a')}</p>
                                            </div>
                                            <Calendar className="w-5 h-5 text-brand-purple" />
                                        </div>
                                        <a href={booking.meetLink} target="_blank" rel="noreferrer" className="w-full py-2 bg-selar-black text-white rounded-lg font-bold text-xs text-center hover:bg-black transition-colors block">
                                            Join Meeting
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Recent Orders */}
                {userOrders.length > 0 && (
                    <div className="mt-12">
                        <h2 className="font-display font-bold text-2xl text-brand-dark mb-6">Recent Orders</h2>
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Order ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Items</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {userOrders.slice(0, 5).map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-mono text-sm text-gray-500">#{order.id.slice(0, 8).toUpperCase()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {new Date(order.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-brand-dark">${order.total.toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'completed'
                                                    ? 'bg-white border border-selar-border shadow-sm text-selar-black'
                                                    : 'bg-white border border-selar-border shadow-sm text-selar-black'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                    </>
                )}

                {activeTab === 'bookings' && (
                    <div className="space-y-4">
                        {userBookings.length === 0 ? (
                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Calendar className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="font-bold text-xl text-brand-dark mb-2">No upcoming bookings</h3>
                                <p className="text-gray-500 mb-6">You haven't booked any coaching sessions yet.</p>
                                <button
                                    onClick={() => router.push('/coaching')}
                                    className="px-6 py-3 bg-selar-black text-white rounded-xl font-bold hover:bg-selar-black/90 transition-all"
                                >
                                    Find a Coach
                                </button>
                            </div>
                        ) : (
                            userBookings.map((booking: any) => (
                                <div key={booking.id} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-16 h-16 bg-gray-100 rounded-full overflow-hidden">
                                            <img src={(booking.coachInfo && booking.coachInfo.avatar) ? booking.coachInfo.avatar : `https://ui-avatars.com/api/?name=${booking.coachInfo?.name || 'Coach'}&background=random`} alt="Coach" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-brand-dark text-lg">{booking.coachInfo?.name || 'Coach'} — 1-on-1 Session</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {format(new Date(booking.date), 'MMMM do, yyyy')}</span>
                                                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {format(new Date(booking.date), 'h:mm a')}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        {booking.meetLink ? (
                                            <a href={booking.meetLink} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-black transition-all inline-flex items-center gap-2">
                                                <Play className="w-4 h-4" /> Join Meeting
                                            </a>
                                        ) : (
                                            <span className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg text-sm font-bold flex items-center gap-2 border border-orange-200">
                                                <Clock className="w-4 h-4" /> Link pending
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {activeTab === 'tickets' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userTickets.length === 0 ? (
                            <div className="col-span-full bg-white rounded-3xl p-12 text-center border border-gray-100">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Ticket className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="font-bold text-xl text-brand-dark mb-2">No tickets found</h3>
                                <p className="text-gray-500 mb-6">Get tickets to exciting upcoming events.</p>
                                <button
                                    onClick={() => router.push('/events')}
                                    className="px-6 py-3 bg-selar-black text-white rounded-xl font-bold hover:bg-selar-black/90 transition-all"
                                >
                                    Browse Events
                                </button>
                            </div>
                        ) : (
                            userTickets.map((ticket: any) => (
                                <div key={ticket.id} className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm relative group">
                                    <div className="absolute top-0 left-0 right-0 h-3 bg-brand-orange"></div>
                                    <div className="p-6 pt-8">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-1">General Admission</p>
                                                <h3 className="font-display font-bold text-xl text-brand-dark line-clamp-2">{ticket.eventInfo?.title || 'Event Pass'}</h3>
                                            </div>
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                                                <Ticket className="w-6 h-6 text-gray-400" />
                                            </div>
                                        </div>
                                        
                                        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 border-dashed">
                                            <div className="text-center w-full">
                                                <div className="w-full h-32 bg-white rounded-lg flex flex-col items-center justify-center p-2 mb-2">
                                                    {/* Fake QR representation since we aren't importing a real QR library */}
                                                    <div className="grid grid-cols-4 grid-rows-4 gap-1 w-20 h-20 opacity-80">
                                                        {Array.from({length: 16}).map((_, i) => (
                                                            <div key={i} className={`${Math.random() > 0.4 ? 'bg-brand-dark' : 'bg-transparent'} rounded-xs`}></div>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="font-mono text-xs text-gray-500">{ticket.qrCode}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-3 pt-4 border-t border-gray-100">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Status</span>
                                                <span className="font-bold text-green-600 uppercase">Valid</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Purchased</span>
                                                <span className="font-medium text-brand-dark">{format(new Date(ticket.purchaseDate), 'MMM d, yyyy')}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-gray-500">Price</span>
                                                <span className="font-medium text-brand-dark">${ticket.amount}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                                        <button className="w-full py-2.5 bg-white border border-gray-200 text-brand-dark rounded-xl font-bold text-sm hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                                            <Download className="w-4 h-4" /> Download PDF Ticket
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
