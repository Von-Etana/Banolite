'use client';
import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useRouter } from 'next/navigation';
import {
    LayoutDashboard, Users, Package, DollarSign, Settings,
    TrendingUp, AlertTriangle, CheckCircle, XCircle, Eye,
    Search, Filter, MoreHorizontal, Shield, Lock, Trash2, Edit2, Save,
    LayoutTemplate
} from 'lucide-react';
import { UserRole, User } from '../types';

type Tab = 'overview' | 'cms' | 'users' | 'products' | 'transactions' | 'settings';

export const AdminDashboard: React.FC = () => {
    const { user, products, orders, getAllUsers, updateUserRole, deleteUser, deleteProduct, siteContent, updateSiteContent } = useStore();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    // Admin state
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [editingUser, setEditingUser] = useState<string | null>(null);

    useEffect(() => {
        if (user && user.role === 'admin') {
            getAllUsers().then(users => setAllUsers(users));
        }
    }, [user, getAllUsers]);
    const [tempRole, setTempRole] = useState<UserRole>('buyer');
    const [cmsForm, setCmsForm] = useState(siteContent);

    // Check if user is admin
    if (!user) {
        return <div className="min-h-screen pt-32 pb-20 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div></div>;
    }

    if (user.role !== 'admin') {
        return (
            <div className="min-h-screen pt-32 pb-20 bg-gray-50">
                <div className="container mx-auto px-6 text-center">
                    <div className="bg-white rounded-3xl shadow-elevated border border-gray-50 max-w-md mx-auto p-12">
                        <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100">
                            <Lock className="w-10 h-10 text-red-500" />
                        </div>
                        <h1 className="font-display font-bold text-3xl text-brand-dark mb-4">Access Denied</h1>
                        <p className="text-gray-500 mb-8 font-medium">
                            This page is only accessible to platform administrators.
                        </p>
                        <button
                            onClick={() => router.push('/')}
                            className="px-8 py-3.5 bg-brand-primary text-white rounded-2xl font-bold hover:bg-brand-primary/90 transition-all shadow-md"
                        >
                            Return Home
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Calculate platform stats
    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
    const calculatedPlatformFee = totalRevenue * (siteContent.platformFeePercentage / 100); // Dynamic platform fee
    const totalUsers = allUsers.length;
    const totalProducts = products.length;
    const totalOrders = orders.length;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'cms', label: 'Content', icon: LayoutTemplate },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'transactions', label: 'Transactions', icon: DollarSign },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen pt-24 bg-gray-50/50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white rounded-3xl shadow-elevated border border-gray-50 fixed h-[calc(100vh-112px)] top-24 left-6 overflow-y-auto hidden md:block z-20">
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-brand-primary/10 rounded-2xl flex items-center justify-center">
                            <Shield className="w-6 h-6 text-brand-primary" />
                        </div>
                        <div>
                            <h2 className="font-bold text-brand-dark">Admin Panel</h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Platform Control</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all font-bold group ${activeTab === tab.id
                                    ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-brand-dark'
                                    }`}
                            >
                                <tab.icon className={`w-5 h-5 transition-transform ${activeTab === tab.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                                <span className="text-sm">{tab.label}</span>
                            </button>
                        ))}
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 md:ml-64 p-6 lg:p-10">
                {activeTab === 'overview' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="font-display font-bold text-3xl text-brand-dark">Platform Overview</h1>
                                <p className="text-gray-500 font-medium">Monitor platform health and key metrics</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-3xl shadow-elevated border border-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-brand-primary/10 rounded-2xl flex items-center justify-center text-brand-primary shadow-sm">
                                        <DollarSign className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Revenue</p>
                                        <h3 className="text-2xl font-bold text-brand-dark">₦{totalRevenue.toFixed(2)}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-elevated border border-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 shadow-sm">
                                        <TrendingUp className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Platform Fees</p>
                                        <h3 className="text-2xl font-bold text-brand-dark">₦{calculatedPlatformFee.toFixed(2)}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-elevated border border-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 shadow-sm">
                                        <Users className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Users</p>
                                        <h3 className="text-2xl font-bold text-brand-dark">{totalUsers}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-3xl shadow-elevated border border-gray-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 shadow-sm">
                                        <Package className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Total Products</p>
                                        <h3 className="text-2xl font-bold text-brand-dark">{totalProducts}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-3xl shadow-elevated border border-gray-50 p-8">
                                <h3 className="font-display font-bold text-xl text-brand-dark mb-6">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <button onClick={() => setActiveTab('cms')} className="p-5 bg-gray-50 rounded-2xl text-left hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all group">
                                        <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <LayoutTemplate className="w-5 h-5 text-brand-primary" />
                                        </div>
                                        <p className="font-bold text-sm text-brand-dark">Site Content</p>
                                        <p className="text-xs text-gray-500 font-medium">Edit landing page</p>
                                    </button>
                                    <button onClick={() => setActiveTab('users')} className="p-5 bg-gray-50 rounded-2xl text-left hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all group">
                                        <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Users className="w-5 h-5 text-blue-500" />
                                        </div>
                                        <p className="font-bold text-sm text-brand-dark">Manage Users</p>
                                        <p className="text-xs text-gray-500 font-medium">View all accounts</p>
                                    </button>
                                    <button onClick={() => setActiveTab('products')} className="p-5 bg-gray-50 rounded-2xl text-left hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all group">
                                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Package className="w-5 h-5 text-purple-500" />
                                        </div>
                                        <p className="font-bold text-sm text-brand-dark">Review Products</p>
                                        <p className="text-xs text-gray-500 font-medium">View catalog</p>
                                    </button>
                                    <button onClick={() => setActiveTab('settings')} className="p-5 bg-gray-50 rounded-2xl text-left hover:bg-white hover:shadow-md border border-transparent hover:border-gray-100 transition-all group">
                                        <div className="w-10 h-10 bg-brand-dark/10 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <Settings className="w-5 h-5 text-brand-dark" />
                                        </div>
                                        <p className="font-bold text-sm text-brand-dark">Platform Settings</p>
                                        <p className="text-xs text-gray-500 font-medium">Configure fees</p>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-3xl shadow-elevated border border-gray-50 p-8">
                                <h3 className="font-display font-bold text-xl text-brand-dark mb-6">Recent Activity</h3>
                                <div className="space-y-5">
                                    {orders.slice(0, 4).map((order) => (
                                        <div key={order.id} className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-50 text-green-500">
                                                {order.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5 text-amber-500" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-brand-dark">
                                                    Order #{order.id.slice(0, 6).toUpperCase()}
                                                </p>
                                                <p className="text-xs text-gray-500 font-medium">₦{order.total.toFixed(2)} • {order.items.length} items</p>
                                            </div>
                                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">
                                                {new Date(order.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                    {orders.length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-8 text-center bg-gray-50 rounded-2xl">
                                            <TrendingUp className="w-8 h-8 text-gray-300 mb-2" />
                                            <p className="text-gray-500 text-sm font-medium">No recent activity</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'cms' && (
                    <div className="animate-fade-in space-y-8">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="font-display font-bold text-3xl text-brand-dark">Content Management</h1>
                                <p className="text-gray-500 font-medium">Edit landing page content and text</p>
                            </div>
                            <button
                                onClick={() => {
                                    updateSiteContent(cmsForm);
                                    alert("Content saved!");
                                }}
                                className="px-8 py-3.5 bg-brand-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-primary/90 transition-all shadow-md hover:shadow-lg"
                            >
                                <Save className="w-5 h-5" /> Save Content
                            </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-3xl shadow-elevated border border-gray-50 p-8">
                                <h3 className="font-display font-bold text-xl text-brand-dark mb-6">Hero Section (Home)</h3>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Main Headline</label>
                                        <input type="text" value={cmsForm.heroHeadline} onChange={(e) => setCmsForm({ ...cmsForm, heroHeadline: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/50 transition-all shadow-sm font-medium text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Subheadline</label>
                                        <textarea value={cmsForm.heroSubheadline} onChange={(e) => setCmsForm({ ...cmsForm, heroSubheadline: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/50 transition-all shadow-sm font-medium text-sm h-32 resize-none"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-3xl shadow-elevated border border-gray-50 p-8">
                                <h3 className="font-display font-bold text-xl text-brand-dark mb-6">About Us Section</h3>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">About Title</label>
                                        <input type="text" value={cmsForm.aboutTitle} onChange={(e) => setCmsForm({ ...cmsForm, aboutTitle: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/50 transition-all shadow-sm font-medium text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">About Content</label>
                                        <textarea value={cmsForm.aboutContent} onChange={(e) => setCmsForm({ ...cmsForm, aboutContent: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary/50 transition-all shadow-sm font-medium text-sm h-32 resize-none"></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="font-display font-bold text-3xl text-brand-dark">Product Management</h1>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-primary/20 w-64 shadow-sm text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl shadow-elevated border border-gray-50 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Seller</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Type</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sales</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 ${product.color} rounded-lg overflow-hidden flex-shrink-0`}>
                                                        <img src={product.coverUrl} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-brand-dark text-sm leading-tight">{product.title}</p>
                                                        <p className="text-xs text-gray-500 font-medium">{product.tags[0]}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">{product.creator}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase tracking-wider rounded-md">
                                                    {product.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-brand-dark">₦{product.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-medium">{product.salesCount}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <a href={`/product/${product.id}`} target="_blank" rel="noreferrer" className="p-2 bg-gray-50 hover:bg-brand-primary/10 rounded-lg text-gray-500 hover:text-brand-primary transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => { if (confirm(`Delete product ${product.title}?`)) deleteProduct(product.id); }}
                                                        className="p-2 bg-gray-50 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {products.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-gray-500 font-medium bg-gray-50/50">
                                                No products listed yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="font-display font-bold text-3xl text-brand-dark">User Management</h1>
                            <div className="text-sm text-brand-primary font-bold bg-brand-primary/10 px-4 py-2 rounded-xl border border-brand-primary/20 shadow-sm">{allUsers.length} Total Users</div>
                        </div>
                        <div className="bg-white rounded-3xl shadow-elevated border border-gray-50 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                                            <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {allUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`} alt={u.name} className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200" />
                                                        <div>
                                                            <p className="font-bold text-brand-dark text-sm leading-tight">{u.name}</p>
                                                            <p className="text-xs text-gray-500 font-medium">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {editingUser === u.id ? (
                                                        <select
                                                            className="text-xs font-bold bg-gray-50 border border-brand-primary rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-brand-primary/20 text-brand-dark"
                                                            value={tempRole}
                                                            onChange={(e) => setTempRole(e.target.value as UserRole)}
                                                        >
                                                            <option value="buyer">Buyer</option>
                                                            <option value="seller">Seller</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${u.role === 'admin' ? 'bg-brand-primary/10 text-brand-primary' :
                                                            u.role === 'seller' ? 'bg-blue-50 text-blue-600' :
                                                                'bg-gray-100 text-gray-500'
                                                            }`}>
                                                            {u.role}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {editingUser === u.id ? (
                                                        <button
                                                            onClick={() => { updateUserRole(u.id, tempRole); setEditingUser(null); }}
                                                            className="p-2 border border-brand-primary bg-brand-primary text-white hover:bg-brand-primary/90 shadow-sm rounded-lg transition-colors inline-flex"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => { setEditingUser(u.id); setTempRole(u.role); }}
                                                                className="p-2 bg-gray-50 text-gray-500 hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => { if (confirm(`Delete ${u.email}?`)) deleteUser(u.id); }}
                                                                className="p-2 bg-gray-50 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                                disabled={u.id === user.id} // prevent self deletion
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'transactions' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="font-display font-bold text-3xl text-brand-dark">Transactions</h1>
                        </div>
                        <div className="bg-white rounded-3xl shadow-elevated border border-gray-50 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Fee</th>
                                        <th className="px-6 py-4 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs font-bold text-brand-primary">#{order.id.slice(0, 8).toUpperCase()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">{new Date(order.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-bold text-brand-dark">₦{order.total.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500 font-medium">₦{(order.total * (siteContent.platformFeePercentage / 100)).toFixed(2)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${order.status === 'completed'
                                                    ? 'bg-green-50 text-green-600'
                                                    : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {orders.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-gray-500 font-medium bg-gray-50/50">
                                                No transactions processed yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="font-display font-bold text-3xl text-brand-dark">Platform Settings</h1>
                        </div>
                        <div className="bg-white rounded-3xl shadow-elevated border border-gray-50 p-8 max-w-2xl">
                            <h3 className="font-display font-bold text-xl text-brand-dark mb-6">Financial Limits & Fees</h3>

                            <div className="space-y-8">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Platform Fee Percentage (%)</label>
                                    <div className="flex items-center gap-6">
                                        <input
                                            type="range"
                                            min="0"
                                            max="30"
                                            value={cmsForm.platformFeePercentage}
                                            onChange={(e) => setCmsForm({ ...cmsForm, platformFeePercentage: Number(e.target.value) })}
                                            className="flex-1 accent-brand-primary h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="w-16 h-12 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
                                            <span className="font-bold text-brand-dark">{cmsForm.platformFeePercentage}%</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium mt-3">This percentage is automatically deducted from every seller's payout.</p>
                                </div>

                                <div className="pt-8 border-t border-gray-100">
                                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Customer Tax Percentage (%)</label>
                                    <div className="flex items-center gap-6">
                                        <input
                                            type="range"
                                            min="0"
                                            max="30"
                                            value={cmsForm.platformTaxPercentage || 0}
                                            onChange={(e) => setCmsForm({ ...cmsForm, platformTaxPercentage: Number(e.target.value) })}
                                            className="flex-1 accent-brand-primary h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                                        />
                                        <div className="w-16 h-12 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center">
                                            <span className="font-bold text-brand-dark">{cmsForm.platformTaxPercentage || 0}%</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 font-medium mt-3">This tax is added to the buyer's checkout total (e.g. VAT).</p>
                                </div>

                                <div className="pt-8 border-t border-gray-100 flex justify-end">
                                    <button
                                        className="px-8 py-3.5 bg-brand-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-primary/90 transition-all shadow-md hover:shadow-lg"
                                        onClick={() => {
                                            updateSiteContent(cmsForm);
                                            alert("Financial Settings Saved!");
                                        }}
                                    >
                                        <Save className="w-5 h-5" />
                                        Save Configuration
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
