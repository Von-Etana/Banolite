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
    if (!user || user.role !== 'admin') {
        return (
            <div className="min-h-screen pt-32 pb-20">
                <div className="container mx-auto px-6 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="font-display font-bold text-3xl text-brand-dark mb-4">Access Denied</h1>
                    <p className="text-gray-500 max-w-md mx-auto mb-8">
                        This page is only accessible to platform administrators.
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="px-8 py-3 bg-selar-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all"
                    >
                        Return Home
                    </button>
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
        <div className="min-h-screen pt-20 bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 fixed h-[calc(100vh-80px)] top-20 left-0 overflow-y-auto hidden md:block">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 bg-selar-black rounded-xl flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-brand-dark">Admin Panel</h2>
                            <p className="text-xs text-gray-500">Platform Control</p>
                        </div>
                    </div>

                    <nav className="space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as Tab)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === tab.id
                                    ? 'bg-selar-black text-white shadow-lg shadow-subtle hover:shadow-elevated'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-selar-black'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                <span className="font-medium">{tab.label}</span>
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
                                <p className="text-gray-500">Monitor platform health and key metrics</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white border border-selar-border shadow-sm rounded-xl flex items-center justify-center text-selar-black">
                                        <DollarSign className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                                        <h3 className="text-2xl font-bold text-brand-dark">${totalRevenue.toFixed(2)}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center text-selar-black">
                                        <TrendingUp className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Platform Fees</p>
                                        <h3 className="text-2xl font-bold text-brand-dark">${calculatedPlatformFee.toFixed(2)}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white border border-selar-border shadow-sm rounded-xl flex items-center justify-center text-selar-black">
                                        <Users className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Users</p>
                                        <h3 className="text-2xl font-bold text-brand-dark">{totalUsers}</h3>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white border border-selar-border shadow-sm rounded-xl flex items-center justify-center text-selar-black">
                                        <Package className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 font-medium">Total Products</p>
                                        <h3 className="text-2xl font-bold text-brand-dark">{totalProducts}</h3>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                <h3 className="font-bold text-lg text-brand-dark mb-4">Quick Actions</h3>
                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => setActiveTab('cms')} className="p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-all">
                                        <LayoutTemplate className="w-5 h-5 text-selar-black mb-2" />
                                        <p className="font-semibold text-sm">Site Content</p>
                                        <p className="text-xs text-gray-500">Edit landing page</p>
                                    </button>
                                    <button onClick={() => setActiveTab('users')} className="p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-all">
                                        <Users className="w-5 h-5 text-selar-black mb-2" />
                                        <p className="font-semibold text-sm">Manage Users</p>
                                        <p className="text-xs text-gray-500">View all accounts</p>
                                    </button>
                                    <button onClick={() => setActiveTab('products')} className="p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-all">
                                        <Package className="w-5 h-5 text-green-500 mb-2" />
                                        <p className="font-semibold text-sm">Review Products</p>
                                        <p className="text-xs text-gray-500">View catalog</p>
                                    </button>
                                    <button onClick={() => setActiveTab('transactions')} className="p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-all">
                                        <DollarSign className="w-5 h-5 text-selar-black mb-2" />
                                        <p className="font-semibold text-sm">Payouts</p>
                                        <p className="text-xs text-gray-500">Manage withdrawals</p>
                                    </button>
                                    <button onClick={() => setActiveTab('settings')} className="p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-all">
                                        <Settings className="w-5 h-5 text-selar-black mb-2" />
                                        <p className="font-semibold text-sm">Platform Settings</p>
                                        <p className="text-xs text-gray-500">Configure fees</p>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 p-6">
                                <h3 className="font-bold text-lg text-brand-dark mb-4">Recent Activity</h3>
                                <div className="space-y-4">
                                    {orders.slice(0, 4).map((order, index) => (
                                        <div key={order.id} className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.status === 'completed' ? 'bg-white border border-selar-border shadow-sm text-selar-black' : 'bg-white border border-selar-border shadow-sm text-selar-black'
                                                }`}>
                                                {order.status === 'completed' ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-brand-dark">
                                                    Order #{order.id.slice(0, 6).toUpperCase()}
                                                </p>
                                                <p className="text-xs text-gray-500">${order.total.toFixed(2)} • {order.items.length} items</p>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {new Date(order.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    ))}
                                    {orders.length === 0 && (
                                        <p className="text-gray-500 text-sm text-center py-4">No recent activity</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'cms' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h1 className="font-display font-bold text-3xl text-brand-dark">Content Management</h1>
                                <p className="text-gray-500">Edit landing page content and text</p>
                            </div>
                            <button
                                onClick={() => {
                                    updateSiteContent(cmsForm);
                                    alert("Content saved!");
                                }}
                                className="px-6 py-2 bg-selar-black text-white rounded-xl font-bold flex items-center gap-2 hover:bg-selar-black/90 transition-all shadow-lg"
                            >
                                <Save className="w-4 h-4" /> Save Content
                            </button>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                <h3 className="font-bold text-lg text-brand-dark mb-4">Hero Section (Home)</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Main Headline</label>
                                        <input type="text" value={cmsForm.heroHeadline} onChange={(e) => setCmsForm({ ...cmsForm, heroHeadline: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-selar-black/20" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Subheadline</label>
                                        <textarea value={cmsForm.heroSubheadline} onChange={(e) => setCmsForm({ ...cmsForm, heroSubheadline: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-selar-black/20 h-24"></textarea>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                                <h3 className="font-bold text-lg text-brand-dark mb-4">About Us Section</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">About Title</label>
                                        <input type="text" value={cmsForm.aboutTitle} onChange={(e) => setCmsForm({ ...cmsForm, aboutTitle: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-selar-black/20" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">About Content</label>
                                        <textarea value={cmsForm.aboutContent} onChange={(e) => setCmsForm({ ...cmsForm, aboutContent: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-selar-black/20 h-32"></textarea>
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
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-selar-black/20 w-64"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Product</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Seller</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Type</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Price</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Sales</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {products.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-12 ${product.color} rounded overflow-hidden`}>
                                                        <img src={product.coverUrl} className="w-full h-full object-cover" alt="" />
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-brand-dark text-sm">{product.title}</p>
                                                        <p className="text-xs text-gray-500">{product.tags[0]}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{product.creator}</td>
                                            <td className="px-6 py-4">
                                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-[10px] font-bold uppercase rounded">
                                                    {product.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-brand-dark">${product.price.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{product.salesCount}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <a href={`/product/${product.id}`} target="_blank" rel="noreferrer" className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-selar-black transition-colors">
                                                        <Eye className="w-4 h-4" />
                                                    </a>
                                                    <button
                                                        onClick={() => { if (confirm(`Delete product ${product.title}?`)) deleteProduct(product.id); }}
                                                        className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="animate-fade-in space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="font-display font-bold text-3xl text-brand-dark">User Management</h1>
                            <div className="text-sm text-gray-500 font-bold bg-white px-4 py-2 rounded-lg border border-gray-100">{allUsers.length} Total Users</div>
                        </div>
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                        <tr>
                                            <th className="px-6 py-4">User</th>
                                            <th className="px-6 py-4">Role</th>
                                            <th className="px-6 py-4">Joined</th>
                                            <th className="px-6 py-4 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {allUsers.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.email}`} alt={u.name} className="w-10 h-10 rounded-full bg-gray-100" />
                                                        <div>
                                                            <p className="font-bold text-brand-dark text-sm">{u.name}</p>
                                                            <p className="text-xs text-gray-500">{u.email}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {editingUser === u.id ? (
                                                        <select
                                                            className="text-xs bg-white border border-gray-200 rounded px-2 py-1 outline-none"
                                                            value={tempRole}
                                                            onChange={(e) => setTempRole(e.target.value as UserRole)}
                                                        >
                                                            <option value="buyer">Buyer</option>
                                                            <option value="seller">Seller</option>
                                                            <option value="admin">Admin</option>
                                                        </select>
                                                    ) : (
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${u.role === 'admin' ? 'bg-white border border-selar-border shadow-sm text-selar-black' :
                                                            u.role === 'seller' ? 'bg-white border border-selar-border shadow-sm text-selar-black' :
                                                                'bg-gray-100 text-gray-600'
                                                            }`}>
                                                            {u.role}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    {new Date(u.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {editingUser === u.id ? (
                                                        <button
                                                            onClick={() => { updateUserRole(u.id, tempRole); setEditingUser(null); }}
                                                            className="p-2 bg-white border border-selar-border shadow-sm text-selar-black hover:bg-white border border-selar-border shadow-sm rounded-lg transition-colors"
                                                        >
                                                            <Save className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => { setEditingUser(u.id); setTempRole(u.role); }}
                                                                className="p-2 text-selar-black hover:bg-white border border-selar-border shadow-sm rounded-lg transition-colors"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => { if (confirm(`Delete ${u.email}?`)) deleteUser(u.id); }}
                                                                className="p-2 text-red-500 hover:bg-white border border-selar-border shadow-sm rounded-lg transition-colors"
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
                        <h1 className="font-display font-bold text-3xl text-brand-dark">Transactions</h1>
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Order ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Fee</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50/50">
                                            <td className="px-6 py-4 font-mono text-sm text-gray-500">#{order.id.slice(0, 8).toUpperCase()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-bold text-brand-dark">${order.total.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">${(order.total * 0.05).toFixed(2)}</td>
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
                            {orders.length === 0 && (
                                <div className="p-8 text-center text-gray-500">No transactions yet</div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="animate-fade-in space-y-6">
                        <h1 className="font-display font-bold text-3xl text-brand-dark">Platform Settings</h1>
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm max-w-2xl">
                            <h3 className="font-bold text-lg text-brand-dark mb-6">Financial Limits & Fees</h3>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Platform Fee Percentage (%)</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="30"
                                            value={cmsForm.platformFeePercentage}
                                            onChange={(e) => setCmsForm({ ...cmsForm, platformFeePercentage: Number(e.target.value) })}
                                            className="flex-1 accent-brand-purple"
                                        />
                                        <span className="font-bold text-brand-dark w-12 text-right">{cmsForm.platformFeePercentage}%</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Deducted from every seller transaction.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Customer Tax Percentage (%)</label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="30"
                                            value={cmsForm.platformTaxPercentage || 0}
                                            onChange={(e) => setCmsForm({ ...cmsForm, platformTaxPercentage: Number(e.target.value) })}
                                            className="flex-1 accent-brand-purple"
                                        />
                                        <span className="font-bold text-brand-dark w-12 text-right">{cmsForm.platformTaxPercentage || 0}%</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">Added to buyer checkouts (e.g. VAT).</p>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex justify-end">
                                    <button
                                        className="px-6 py-2.5 bg-selar-black text-white rounded-xl font-bold flex items-center gap-2 hover:bg-selar-black/90 transition-all shadow-lg"
                                        onClick={() => {
                                            updateSiteContent(cmsForm);
                                            alert("Financial Settings Saved!");
                                        }}
                                    >
                                        <Save className="w-4 h-4" />
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
