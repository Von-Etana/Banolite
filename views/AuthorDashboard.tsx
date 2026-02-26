'use client';
import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { FileUpload } from '../components/FileUpload';
import {
   LayoutDashboard, Package, DollarSign, Settings,
   Plus, Edit2, Trash2, ExternalLink, TrendingUp, Users,
   ArrowUpRight, ArrowDownCircle, Bell, Star, MoreVertical,
   BookOpen, Image as ImageIcon, BarChart3, User as UserIcon,
   X, CheckCircle, LayoutGrid, Wallet, History,
   ChevronRight, FileText, Video, Ticket, Briefcase,
   ShoppingCart, Sparkles, TrendingDown, Save, Upload, Eye
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Product, Payout, ProductType, Order } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
type Tab = 'overview' | 'products' | 'customers' | 'wallet' | 'settings';

export const CreatorDashboard: React.FC = () => {
   const {
      user,
      products,
      addProduct,
      updateProduct,
      deleteProduct,
      getSellerStats,
      orders,
      siteContent,
      updateUserProfile
   } = useStore();
   const router = useRouter();
   const [activeTab, setActiveTab] = useState<Tab>('overview');

   // Modal States
   const [isAddModalOpen, setIsAddModalOpen] = useState(false);
   const [isEditing, setIsEditing] = useState(false);
   const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
   const [isPreviewMode, setIsPreviewMode] = useState(false);

   // Profile Edit State (now Settings)
   const [profileForm, setProfileForm] = useState({
      name: user?.name || '',
      bio: user?.bio || '',
      location: user?.location || '',
      storeName: user?.storeName || '',
      storeDescription: user?.storeDescription || '',
      storeBanner: user?.storeBanner || '',
      avatar: user?.avatar || '',
      brandColor: user?.brandColor || '#111827',
   });

   // Mock Payout History
   const payoutHistory: Payout[] = [
      { id: 'p1', sellerId: user?.id || '', amount: 500, date: new Date('2024-02-28'), status: 'completed' },
      { id: 'p2', sellerId: user?.id || '', amount: 1200, date: new Date('2024-03-15'), status: 'pending' },
   ];

   // Form States
   const [productForm, setProductForm] = useState<Partial<Product>>({
      title: '',
      description: '',
      price: 0,
      tags: ['Design'],
      category: 'Education',
      discountOffer: 0,
      coverUrl: '',
      color: 'bg-white border border-selar-border shadow-sm',
      type: 'EBOOK'
   });

   // Check for seller role
   if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      return (
         <div className="min-h-screen pt-32 flex flex-col items-center justify-center container mx-auto px-6 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mb-6">
               <BookOpen className="w-10 h-10" />
            </div>
            <h1 className="font-display font-bold text-3xl text-brand-dark mb-4">Access Restricted</h1>
            <p className="text-gray-500 max-w-md mb-8">This dashboard is only available to registered sellers. Please log in with a seller account.</p>
            <button onClick={() => router.push('/')} className="px-6 py-3 bg-selar-black text-white rounded-xl font-bold">Return Home</button>
         </div>
      );
   }

   // Get seller's products and orders
   const sellerProducts = products.filter(p => p.creatorId === user.id);
   const sellerOrders = orders.filter(o => o.items.some(i => sellerProducts.some(sp => sp.id === i.id)));
   const stats = getSellerStats();

   const handleOpenAdd = () => {
      setProductForm({
         title: '',
         description: '',
         price: 0,
         tags: ['General'],
         category: 'Education',
         discountOffer: 0,
         coverUrl: `https://picsum.photos/seed/${Date.now()}/400/500`,
         color: 'bg-zinc-50',
         type: 'EBOOK'
      });
      setIsEditing(false);
      setIsPreviewMode(false);
      setIsAddModalOpen(true);
   };

   const handleOpenEdit = (product: Product) => {
      setProductForm(product);
      setIsEditing(true);
      setIsPreviewMode(false);
      setIsAddModalOpen(true);
   };

   const handleSubmitProduct = (e?: React.FormEvent) => {
      e?.preventDefault();
      if (isEditing && productForm.id) {
         updateProduct(productForm as Product);
      } else {
         addProduct({
            title: productForm.title || 'Untitled Asset',
            creator: user.name,
            creatorId: user.id,
            price: Number(productForm.price) || 0,
            description: productForm.description || 'No description provided.',
            coverUrl: productForm.coverUrl || `https://picsum.photos/seed/${Date.now()}/400/500`,
            color: productForm.color || 'bg-white border border-selar-border shadow-sm',
            tags: productForm.tags || ['General'],
            category: productForm.category || 'Education',
            discountOffer: Number(productForm.discountOffer) || 0,
            type: productForm.type || 'EBOOK'
         });
      }
      setIsAddModalOpen(false);
      setIsPreviewMode(false);
   };

   const handleDelete = () => {
      if (showDeleteConfirm) {
         deleteProduct(showDeleteConfirm);
         setShowDeleteConfirm(null);
      }
   };

   const handleSaveProfile = () => {
      updateUserProfile({
         name: profileForm.name,
         avatar: profileForm.avatar,
         bio: profileForm.bio,
         location: profileForm.location,
         storeName: profileForm.storeName,
         storeDescription: profileForm.storeDescription,
         storeBanner: profileForm.storeBanner,
      });
   };

   const getTypeIcon = (type: ProductType) => {
      switch (type) {
         case 'COURSE': return <Video className="w-5 h-5" />;
         case 'TICKET': return <Ticket className="w-5 h-5" />;
         case 'SERVICE': return <Briefcase className="w-5 h-5" />;
         default: return <FileText className="w-5 h-5" />;
      }
   };

   const tabs = [
      { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'products', label: 'My Products', icon: Package },
      { id: 'customers', label: 'Customers', icon: Users },
      { id: 'wallet', label: 'Wallet & Payouts', icon: DollarSign },
      { id: 'settings', label: 'Store Settings', icon: Settings },
   ];

   return (
      <div className="min-h-screen pt-16 bg-cream">
         {/* Sidebar — Desktop */}
         <aside className="w-16 lg:w-60 bg-white border-r border-selar-border fixed h-[calc(100vh-64px)] top-16 left-0 overflow-y-auto hidden md:block">
            <div className="p-6">
               <h2 className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-6 hidden lg:block">Creator Menu</h2>
               <nav className="space-y-2">
                  {tabs.map((item) => (
                     <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as Tab)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id
                           ? 'bg-selar-black text-white shadow-lg shadow-subtle hover:shadow-elevated'
                           : 'text-gray-500 hover:bg-gray-50 hover:text-selar-black'
                           }`}
                     >
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium hidden lg:block">{item.label}</span>
                     </button>
                  ))}
               </nav>
            </div>
         </aside>

         {/* Mobile Bottom Nav */}
         <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-selar-border z-30 md:hidden">
            <div className="flex items-center justify-around py-2">
               {tabs.map((item) => (
                  <button
                     key={item.id}
                     onClick={() => setActiveTab(item.id as Tab)}
                     className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all ${activeTab === item.id
                        ? 'text-brand-dark'
                        : 'text-brand-muted'
                        }`}
                  >
                     <item.icon className="w-5 h-5" />
                     <span className="text-[10px] font-medium">{item.label.split(' ')[0]}</span>
                  </button>
               ))}
            </div>
         </div>

         {/* Main Content */}
         <div className="md:ml-16 lg:ml-60 p-4 lg:p-8 pb-24 md:pb-8 overflow-x-hidden">

            {activeTab === 'overview' && (
               <div className="animate-fade-in space-y-8">
                  <div className="flex justify-between items-center">
                     <h1 className="font-display font-bold text-3xl text-brand-dark">Welcome back, {user.name.split(' ')[0]}</h1>
                     <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3">
                        <span className="text-xs text-gray-500 font-bold uppercase">Store Status:</span>
                        <span className="flex items-center gap-1.5 text-green-500 text-xs font-bold">
                           <div className="w-2 h-2 bg-white border border-selar-border shadow-sm0 rounded-full animate-pulse"></div>
                           Live
                        </span>
                     </div>
                  </div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border border-selar-border shadow-sm rounded-xl flex items-center justify-center text-selar-black">
                           <DollarSign className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                           <h3 className="text-2xl font-bold text-brand-dark">${stats.totalRevenue.toFixed(2)}</h3>
                        </div>
                     </div>
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border border-selar-border shadow-sm rounded-xl flex items-center justify-center text-selar-black">
                           <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-sm text-gray-500 font-medium">Total Products</p>
                           <h3 className="text-2xl font-bold text-brand-dark">{stats.totalProducts}</h3>
                        </div>
                     </div>
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border border-selar-border shadow-sm rounded-xl flex items-center justify-center text-selar-black">
                           <TrendingUp className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-sm text-gray-500 font-medium">Total Sales</p>
                           <h3 className="text-2xl font-bold text-brand-dark">{stats.totalSales}</h3>
                        </div>
                     </div>
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border border-selar-border shadow-sm rounded-xl flex items-center justify-center text-selar-black">
                           <Users className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-sm text-gray-500 font-medium">Customers</p>
                           <h3 className="text-2xl font-bold text-brand-dark">{stats.totalCustomers}</h3>
                        </div>
                     </div>
                  </div>

                  {/* Analytics Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-2">
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-brand-dark mb-6">Revenue Over Time</h3>
                        <div className="h-72 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={stats.revenueByMonth} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                 <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
                                 <RechartsTooltip cursor={{ stroke: '#F3F4F6', strokeWidth: 2 }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                 <Line type="monotone" dataKey="revenue" stroke="#7C3AED" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                              </LineChart>
                           </ResponsiveContainer>
                        </div>
                     </div>
                     <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-lg text-brand-dark mb-6">Top Products by Sales</h3>
                        {stats.topProducts.length > 0 ? (
                           <div className="h-72 w-full">
                              <ResponsiveContainer width="100%" height="100%">
                                 <BarChart data={stats.topProducts} margin={{ top: 5, right: 20, bottom: 5, left: -20 }} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="title" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} width={120} />
                                    <RechartsTooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                    <Bar dataKey="sales" fill="#111827" radius={[0, 4, 4, 0]} barSize={24} />
                                 </BarChart>
                              </ResponsiveContainer>
                           </div>
                        ) : (
                           <div className="h-72 w-full flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl">
                              <p className="text-gray-500 font-medium text-sm">No sales data yet.</p>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <h3 className="font-bold text-lg text-brand-dark mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 gap-3">
                           <button onClick={() => setIsAddModalOpen(true)} className="p-4 bg-zinc-50 rounded-xl text-left hover:bg-zinc-100 transition-all border border-brand-purple/10">
                              <Plus className="w-5 h-5 text-selar-black mb-2" />
                              <p className="font-semibold text-sm">New Product</p>
                              <p className="text-xs text-gray-500">Create listing</p>
                           </button>
                           <button onClick={() => setActiveTab('customers')} className="p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-all">
                              <Users className="w-5 h-5 text-selar-black mb-2" />
                              <p className="font-semibold text-sm">Customers</p>
                              <p className="text-xs text-gray-500">View your buyers</p>
                           </button>
                           <button onClick={() => setActiveTab('wallet')} className="p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-all">
                              <Wallet className="w-5 h-5 text-green-500 mb-2" />
                              <p className="font-semibold text-sm">Withdraw</p>
                              <p className="text-xs text-gray-500">Get paid</p>
                           </button>
                           <button onClick={() => setActiveTab('settings')} className="p-4 bg-gray-50 rounded-xl text-left hover:bg-gray-100 transition-all">
                              <Settings className="w-5 h-5 text-gray-500 mb-2" />
                              <p className="font-semibold text-sm">Settings</p>
                              <p className="text-xs text-gray-500">Edit profile</p>
                           </button>
                        </div>
                     </div>

                     {/* Recent Notifications (Placeholder for now, as notifications are removed from useStore) */}
                     <div className="bg-white rounded-2xl border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="font-bold text-lg text-brand-dark">Recent Activity</h3>
                           <button onClick={() => setActiveTab('overview')} className="text-xs text-selar-black font-semibold">View all</button>
                        </div>
                        <div className="space-y-3">
                           <p className="text-gray-500 text-sm text-center py-4">No recent activity to display.</p>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'products' && (
               <div className="animate-fade-in space-y-8">
                  <div className="flex justify-between items-center">
                     <h1 className="font-display font-bold text-3xl text-brand-dark">My Products</h1>
                     <button
                        onClick={handleOpenAdd}
                        className="bg-selar-black text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-selar-black/90 transition-all shadow-lg shadow-subtle hover:shadow-elevated"
                     >
                        <Plus className="w-5 h-5" />
                        Create Product
                     </button>
                  </div>

                  {sellerProducts.length === 0 ? (
                     <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                           <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="font-bold text-xl text-brand-dark mb-2">No products yet</h3>
                        <p className="text-gray-500 mb-6">Create your first product to start selling!</p>
                        <button onClick={handleOpenAdd} className="px-6 py-3 bg-selar-black text-white rounded-xl font-bold">
                           Create Product
                        </button>
                     </div>
                  ) : (
                     <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                        <table className="w-full text-left">
                           <thead className="bg-gray-50 border-b border-gray-100">
                              <tr>
                                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product</th>
                                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Price</th>
                                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Sales</th>
                                 <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                              </tr>
                           </thead>
                           <tbody className="divide-y divide-gray-100">
                              {sellerProducts.map(p => (
                                 <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4">
                                       <div className="flex items-center gap-4">
                                          <div className={`w-12 h-16 ${p.color} rounded overflow-hidden`}>
                                             <img src={p.coverUrl} className="w-full h-full object-cover" alt="" />
                                          </div>
                                          <div>
                                             <h4 className="font-bold text-brand-dark text-sm">{p.title}</h4>
                                             <span className="text-xs text-gray-500">{p.tags[0]}</span>
                                          </div>
                                       </div>
                                    </td>
                                    <td className="px-6 py-4">
                                       <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-1 rounded uppercase tracking-wider">{p.type}</span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-brand-dark">${p.price.toFixed(2)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{p.salesCount || 0}</td>
                                    <td className="px-6 py-4 text-right">
                                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <button onClick={() => handleOpenEdit(p)} className="p-2 hover:bg-white border border-selar-border shadow-sm text-selar-black rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                                          <button onClick={() => setShowDeleteConfirm(p.id)} className="p-2 hover:bg-white border border-selar-border shadow-sm text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                                       </div>
                                    </td>
                                 </tr>
                              ))}
                              {sellerProducts.length === 0 && (
                                 <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                       No products yet. Click "Add Product" to get started!
                                    </td>
                                 </tr>
                              )}
                           </tbody>
                        </table>
                     </div>
                  )}
               </div>
            )}

            {activeTab === 'customers' && (
               <div className="animate-fade-in space-y-6">
                  <div className="flex justify-between items-center">
                     <div>
                        <h1 className="font-display font-bold text-3xl text-brand-dark">My Customers</h1>
                        <p className="text-gray-500">Review who has purchased your products</p>
                     </div>
                  </div>

                  <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                     <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase tracking-wider">
                           <tr>
                              <th className="px-6 py-4">Order ID</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Items Purchased</th>
                              <th className="px-6 py-4">Amount</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {sellerOrders.map(order => {
                              // Filter items in this order to ONLY show the ones this seller owns
                              const relevantItems = order.items.filter(item => sellerProducts.some(sp => sp.id === item.id));
                              if (relevantItems.length === 0) return null;

                              return (
                                 <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{order.id.slice(0, 8).toUpperCase()}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                       <div className="flex flex-col gap-1">
                                          {relevantItems.map((item, i) => {
                                             const pTitle = sellerProducts.find(product => product.id === item.id)?.title;
                                             return (
                                                <span key={i} className="text-sm font-medium text-brand-dark">
                                                   {pTitle || "Unknown Product"} <span className="text-gray-400">x{item.quantity}</span>
                                                </span>
                                             )
                                          })}
                                       </div>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-brand-dark">
                                       ${relevantItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0).toFixed(2)}
                                    </td>
                                 </tr>
                              )
                           })}
                           {sellerOrders.length === 0 && (
                              <tr>
                                 <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                                    Waiting for your first sale...
                                 </td>
                              </tr>
                           )}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {activeTab === 'wallet' && (
               <div className="animate-fade-in space-y-8">
                  <h1 className="font-display font-bold text-3xl text-brand-dark">Seller Wallet</h1>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                     {/* Balance Card */}
                     <div className="lg:col-span-1 bg-selar-black rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                        <div className="relative z-10">
                           <div className="flex justify-between items-center mb-2">
                              <p className="text-white/60 text-sm font-medium">Net Available Balance</p>
                              <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded-full text-white/70">
                                 {siteContent.platformFeePercentage}% Fee deducted
                              </span>
                           </div>
                           <h3 className="text-4xl font-bold mb-8">${(user.walletBalance || 0).toFixed(2)}</h3>
                           <button className="w-full bg-white text-brand-dark py-4 rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                              <ArrowDownCircle className="w-5 h-5" />
                              Withdraw Earnings
                           </button>
                        </div>
                        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-white/5 rounded-full blur-none hidden"></div>
                     </div>

                     {/* Payout History */}
                     <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                           <h3 className="font-bold text-xl flex items-center gap-2">
                              <History className="w-5 h-5 text-gray-400" />
                              Payout History
                           </h3>
                        </div>
                        <div className="overflow-x-auto">
                           <table className="w-full text-left">
                              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                                 <tr>
                                    <th className="px-6 py-4">Reference</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Status</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-100">
                                 {payoutHistory.map(p => (
                                    <tr key={p.id}>
                                       <td className="px-6 py-4 font-mono text-sm text-gray-500">#{p.id.toUpperCase()}</td>
                                       <td className="px-6 py-4 font-bold text-brand-dark">${p.amount.toFixed(2)}</td>
                                       <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.date).toLocaleDateString()}</td>
                                       <td className="px-6 py-4">
                                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${p.status === 'completed' ? 'bg-white border border-selar-border shadow-sm text-selar-black' : 'bg-white border border-selar-border shadow-sm text-selar-black'
                                             }`}>
                                             {p.status}
                                          </span>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === 'settings' && (
               <div className="animate-fade-in space-y-8">
                  <h1 className="font-display font-bold text-3xl text-brand-dark">Store Settings</h1>
                  <div className="bg-white rounded-2xl border border-selar-border p-6 md:p-8 space-y-6">
                     <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Display Name</label>
                        <input
                           value={profileForm.name}
                           onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                           className="input-field"
                           placeholder="Your full name"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Bio</label>
                        <textarea
                           value={profileForm.bio}
                           onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                           className="input-field"
                           rows={3}
                           placeholder="Tell buyers about yourself"
                        />
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Store Name</label>
                           <input
                              value={profileForm.storeName}
                              onChange={e => setProfileForm({ ...profileForm, storeName: e.target.value })}
                              className="input-field"
                              placeholder="Your store name"
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Location</label>
                           <input
                              value={profileForm.location}
                              onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
                              className="input-field"
                              placeholder="Your city/country"
                           />
                        </div>
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Store Description</label>
                        <textarea
                           value={profileForm.storeDescription}
                           onChange={e => setProfileForm({ ...profileForm, storeDescription: e.target.value })}
                           className="input-field"
                           rows={3}
                           placeholder="Describe what your store offers"
                        />
                     </div>
                     <div>
                        <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Store Brand Color</label>
                        <div className="flex items-center gap-4">
                           <input
                              type="color"
                              value={profileForm.brandColor}
                              onChange={e => setProfileForm({ ...profileForm, brandColor: e.target.value })}
                              className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0 overflow-hidden"
                           />
                           <p className="text-sm text-gray-500">Pick a primary color for your storefront buttons and accents.</p>
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Profile Avatar</label>
                           <FileUpload
                              bucket="avatars"
                              accept="image/*"
                              label="Avatar"
                              hint="Upload a profile photo"
                              onUploadComplete={(url) => setProfileForm({ ...profileForm, avatar: url })}
                           />
                        </div>
                        <div>
                           <label className="block text-xs font-bold text-brand-muted uppercase mb-2">Store Banner</label>
                           <FileUpload
                              bucket="banners"
                              accept="image/*"
                              label="Banner Image"
                              hint="Recommended: 1400x400px"
                              onUploadComplete={(url) => setProfileForm({ ...profileForm, storeBanner: url })}
                              currentUrl={profileForm.storeBanner}
                           />
                        </div>
                     </div>
                     <button
                        onClick={handleSaveProfile}
                        className="btn-primary flex items-center gap-2"
                     >
                        <Save className="w-4 h-4" />
                        Save Changes
                     </button>
                  </div>
               </div>
            )}
         </div>

         {/* Product Modal */}
         {
            isAddModalOpen && (
               <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-scale-in">
                     <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <div>
                           <h3 className="font-bold text-xl">
                              {isPreviewMode ? 'Listing Preview' : (isEditing ? 'Edit Product' : 'Create New Product')}
                           </h3>
                           <p className="text-xs text-gray-500 font-medium">
                              {isPreviewMode ? 'This is how your product will appear to buyers.' : 'Fill in the details for your digital product.'}
                           </p>
                        </div>
                        <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-white rounded-full text-gray-400 hover:text-gray-600 transition-all"><X className="w-6 h-6" /></button>
                     </div>

                     <div className="flex-1 overflow-y-auto">
                        {!isPreviewMode ? (
                           <div className="p-8">
                              <form id="product-form" onSubmit={(e) => { e.preventDefault(); setIsPreviewMode(true); }} className="space-y-6">
                                 <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 sm:col-span-1">
                                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Title</label>
                                       <input
                                          required
                                          value={productForm.title}
                                          onChange={e => setProductForm({ ...productForm, title: e.target.value })}
                                          type="text"
                                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-selar-black/20 transition-all"
                                          placeholder="e.g. Master UI Design"
                                       />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Type</label>
                                       <select
                                          value={productForm.type}
                                          onChange={e => setProductForm({ ...productForm, type: e.target.value as ProductType })}
                                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-selar-black/20 transition-all"
                                       >
                                          <option value="EBOOK">Digital Product / eBook</option>
                                          <option value="COURSE">Online Video Course</option>
                                          <option value="TICKET">Event Ticket</option>
                                          <option value="SERVICE">Professional Service</option>
                                       </select>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Detailed Description</label>
                                       <textarea
                                          required
                                          value={productForm.description}
                                          onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-selar-black/20 transition-all"
                                          rows={4}
                                          placeholder="Explain the value of your product..."
                                       />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Product Category</label>
                                       <select
                                          value={productForm.category || 'Education'}
                                          onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-selar-black/20 transition-all mb-4"
                                       >
                                          <option value="Education">Education & Learning</option>
                                          <option value="Technology">Software & Tech</option>
                                          <option value="Business">Business & Finance</option>
                                          <option value="Design">Creative & Design</option>
                                          <option value="Lifestyle">Lifestyle & Health</option>
                                       </select>

                                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2 mt-2">Discount Limit (%)</label>
                                       <input
                                          value={productForm.discountOffer || 0}
                                          onChange={e => setProductForm({ ...productForm, discountOffer: Number(e.target.value) })}
                                          type="number"
                                          min="0"
                                          max="100"
                                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-selar-black/20 transition-all"
                                          placeholder="e.g. 20 (for 20% off)"
                                       />
                                       <p className="text-[10px] text-gray-400 mt-1">Leave at 0 if no discount applies.</p>
                                    </div>
                                    <div>
                                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Price (USD)</label>
                                       <div className="relative">
                                          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">$</span>
                                          <input
                                             required
                                             value={productForm.price}
                                             onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                                             type="number"
                                             step="0.01"
                                             className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 pl-8 focus:outline-none focus:ring-2 focus:ring-selar-black/20 transition-all"
                                          />
                                       </div>
                                    </div>
                                    <div>
                                       <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Primary Category</label>
                                       <input
                                          value={productForm.tags?.[0]}
                                          onChange={e => setProductForm({ ...productForm, tags: [e.target.value] })}
                                          type="text"
                                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-selar-black/20 transition-all"
                                          placeholder="e.g. Learning"
                                       />
                                    </div>

                                    <div className="col-span-2 grid grid-cols-2 gap-4">
                                       <FileUpload
                                          bucket="files"
                                          accept=".pdf,.zip,.mp4,.epub"
                                          label="Product Content"
                                          hint="PDF, ZIP, MP4 or EPUB"
                                          onUploadComplete={(url) => setProductForm({ ...productForm, fileUrl: url })}
                                          currentUrl={productForm.fileUrl}
                                       />
                                       <FileUpload
                                          bucket="covers"
                                          accept="image/*"
                                          label="Cover Image"
                                          hint="JPEG, PNG or WebP"
                                          onUploadComplete={(url) => setProductForm({ ...productForm, coverUrl: url })}
                                          currentUrl={productForm.coverUrl}
                                       />
                                    </div>
                                 </div>
                              </form>
                           </div>
                        ) : (
                           <div className="animate-slide-up">
                              <div className="bg-white border border-selar-border shadow-sm/50 p-4 border-b border-blue-100 flex items-center gap-2 text-blue-700 text-sm font-bold">
                                 <Eye className="w-4 h-4" /> Preview Active
                              </div>
                              <div className="p-8">
                                 <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
                                    <div className="md:col-span-2">
                                       <div className={`aspect-[4/5] rounded-3xl ${productForm.color || 'bg-zinc-50'} overflow-hidden shadow-2xl relative flex items-center justify-center p-8 group`}>
                                          <img src={productForm.coverUrl} className="w-full h-full object-cover rounded-xl shadow-lg transform group-hover:scale-105 transition-all duration-500" alt="Preview" />
                                          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-[10px] font-bold text-selar-black flex items-center gap-1.5 uppercase">
                                             {getTypeIcon(productForm.type || 'EBOOK')}
                                             {productForm.type}
                                          </div>
                                       </div>
                                    </div>

                                    <div className="md:col-span-3 flex flex-col">
                                       <div className="flex items-center gap-3 mb-4">
                                          <span className="text-xs font-bold text-selar-black bg-zinc-100 px-3 py-1 rounded-full uppercase">
                                             {productForm.tags?.[0] || 'General'}
                                          </span>
                                       </div>

                                       <h2 className="text-3xl font-display font-bold text-brand-dark mb-2">{productForm.title || 'Untitled Asset'}</h2>
                                       <p className="text-gray-500 text-sm mb-6 font-medium">by <span className="text-selar-black font-bold">{user.name}</span></p>

                                       <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 flex-1">
                                          <h4 className="text-xs font-bold text-gray-400 uppercase mb-3">Product Description</h4>
                                          <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                                             {productForm.description || 'Provide a compelling description of what buyers will get.'}
                                          </p>
                                       </div>

                                       <div className="flex items-center justify-between p-6 bg-selar-black rounded-2xl text-white shadow-xl shadow-brand-dark/20">
                                          <div>
                                             <p className="text-[10px] font-bold text-white/50 uppercase">Instant Access</p>
                                             <p className="text-3xl font-bold">${(productForm.price || 0).toFixed(2)}</p>
                                          </div>
                                          <div className="bg-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-bold border border-white/10">
                                             <ShoppingCart className="w-4 h-4" />
                                             Add to Bag
                                          </div>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}
                     </div>

                     <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                        {isPreviewMode ? (
                           <>
                              <button
                                 onClick={() => setIsPreviewMode(false)}
                                 className="px-6 py-3 bg-white border border-gray-200 text-brand-dark rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
                              >
                                 <Settings className="w-4 h-4" />
                                 Back to Editor
                              </button>
                              <button
                                 onClick={() => handleSubmitProduct()}
                                 className="bg-selar-black text-white px-10 py-3 rounded-xl font-bold hover:bg-selar-black/90 transition-all shadow-lg flex items-center gap-2"
                              >
                                 <CheckCircle className="w-5 h-5" />
                                 Confirm & Publish
                              </button>
                           </>
                        ) : (
                           <>
                              <div className="flex items-center gap-2 text-xs text-gray-500 font-medium italic">
                                 <Sparkles className="w-3 h-3 text-selar-black" />
                                 Auto-saving draft...
                              </div>
                              <div className="flex gap-3">
                                 <button
                                    onClick={() => setIsPreviewMode(true)}
                                    className="px-6 py-3 bg-white border border-gray-200 text-brand-dark rounded-xl font-bold hover:bg-gray-100 transition-all flex items-center gap-2"
                                 >
                                    <Eye className="w-4 h-4 text-selar-black" />
                                    Preview Listing
                                 </button>
                                 <button
                                    onClick={handleSubmitProduct}
                                    className="bg-selar-black text-white px-10 py-3 rounded-xl font-bold hover:bg-selar-black/90 transition-all shadow-lg"
                                 >
                                    {isEditing ? 'Update Listing' : 'Publish Product'}
                                 </button>
                              </div>
                           </>
                        )}
                     </div>
                  </div>
               </div>
            )
         }

         {/* Delete Confirmation */}
         {
            showDeleteConfirm && (
               <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl animate-scale-in">
                     <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                        <Trash2 className="w-6 h-6" />
                     </div>
                     <h3 className="text-center font-bold text-xl mb-2 text-brand-dark">Delete Product?</h3>
                     <p className="text-center text-gray-500 text-sm mb-6">Are you sure? This action cannot be undone.</p>
                     <div className="flex gap-3">
                        <button onClick={() => setShowDeleteConfirm(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">Cancel</button>
                        <button onClick={handleDelete} className="flex-1 py-3 bg-white border border-selar-border shadow-sm0 text-white rounded-xl font-bold shadow-lg">Delete</button>
                     </div>
                  </div>
               </div>
            )
         }
      </div >
   );
};
