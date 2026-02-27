'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, User, Order, Review, Notification, StoredUser, UserRole, SiteContent, Booking, Ticket, AnalyticsSummary } from '../types';
import { PRODUCTS } from '../constants';
import { createClient } from '../lib/supabase/client';
import {
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  generateId,
  STORAGE_KEYS
} from '../services/storageService';

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

interface StoreContextType {
  // State
  cart: CartItem[];
  isCartOpen: boolean;
  isAuthOpen: boolean;
  isCheckoutOpen: boolean;
  user: StoredUser | null;
  orders: Order[];
  reviews: Review[];
  products: Product[];
  notifications: Notification[];
  cartTotal: number;
  siteContent: SiteContent;
  isLoading: boolean;

  // Booking & Ticket State
  bookings: Booking[];
  tickets: Ticket[];

  // Cart actions
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;

  // Modal toggles
  toggleCart: () => void;
  toggleAuth: () => void;
  toggleCheckout: () => void;

  // Auth actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: UserRole) => Promise<void>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Order actions
  createPendingOrder: (paymentMethod: string, email: string, additionalInfo?: { bookingDate?: string; attendeeName?: string }) => Promise<Order>;
  getUserOrders: () => Order[];

  // Booking & Ticket actions
  bookCoach: (coachId: string, date: Date, amount: number) => Promise<Booking>;
  buyTicket: (eventId: string, amount: number) => Promise<Ticket>;
  getUserBookings: () => Booking[];
  getUserTickets: () => Ticket[];

  // Review actions
  addReview: (productId: string, rating: number, comment: string) => void;
  getProductReviews: (productId: string) => Review[];

  // Product actions
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'salesCount' | 'rating'>) => Product;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  getSellerProducts: (sellerId: string) => Product[];

  // User actions
  updateUserProfile: (data: Partial<StoredUser>) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  getUnreadNotifications: () => Notification[];

  getSellerStats: () => AnalyticsSummary;

  // Admin actions
  getAllUsers: () => Promise<User[]>;
  updateUserRole: (userId: string, role: UserRole) => void;
  deleteUser: (userId: string) => void;

  // CMS actions
  updateSiteContent: (content: SiteContent) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Helper to transform DB row to frontend Product type
function dbToProduct(row: any): Product {
  return {
    id: row.id,
    title: row.title,
    creator: row.creator,
    creatorId: row.creator_id,
    price: parseFloat(row.price),
    description: row.description || '',
    coverUrl: row.cover_url || '',
    color: row.color || 'bg-gray-100',
    tags: row.tags || [],
    category: row.category,
    discountOffer: row.discount_offer ? parseFloat(row.discount_offer) : undefined,
    rating: parseFloat(row.rating) || 0,
    type: row.type,
    salesCount: row.sales_count || 0,
    createdAt: new Date(row.created_at),
    lessons: row.lessons,
    duration: row.duration,
    eventDate: row.event_date ? new Date(row.event_date) : undefined,
    eventLocation: row.event_location,
    ticketsAvailable: row.tickets_available,
    billingPeriod: row.billing_period,
    fileUrl: row.file_url,
    fileSize: row.file_size,
  };
}

// Helper to transform DB profile to StoredUser
function dbToUser(profile: any): StoredUser {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    avatar: profile.avatar,
    role: profile.role as UserRole,
    purchasedProductIds: profile.purchased_product_ids || [],
    bio: profile.bio,
    location: profile.location,
    walletBalance: parseFloat(profile.wallet_balance) || 0,
    createdAt: new Date(profile.created_at),
    storeName: profile.store_name,
    storeDescription: profile.store_description,
    storeBanner: profile.store_banner,
    socialLinks: {
      twitter: profile.social_twitter,
      website: profile.social_website,
    },
  };
}

// Fallback initial products from constants
const getInitialProducts = (): Product[] => {
  return PRODUCTS.map(p => ({
    ...p,
    creatorId: 'default-seller',
    salesCount: p.salesCount || 0,
    createdAt: new Date(),
  }));
};

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const supabase = createClient();

  const [cart, setCart] = useState<CartItem[]>(() =>
    getStorageItem<CartItem[]>(STORAGE_KEYS.CART, [])
  );
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [user, setUser] = useState<StoredUser | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>(getInitialProducts);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [siteContent, setSiteContent] = useState<SiteContent>({
    heroHeadline: "Master Your Craft with Premium Digital Resources",
    heroSubheadline: "Join thousands of creators and professionals learning from top-tier ebooks, courses, and coaching.",
    aboutTitle: "Empowering Creators Worldwide",
    aboutContent: "Banolite is a premier digital marketplace connecting experts with eager learners.",
    platformFeePercentage: 5,
    platformTaxPercentage: 10
  });

  // ===== SUPABASE AUTH LISTENER =====
  useEffect(() => {
    // Get initial session
    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          if (profile) {
            setUser(dbToUser(profile));
          }
        }
      } catch (err) {
        console.error('Auth init error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        if (profile) {
          setUser(dbToUser(profile));
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setOrders([]);
        setNotifications([]);
        setBookings([]);
        setTickets([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== FETCH PRODUCTS FROM SUPABASE =====
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setProducts(data.map(dbToProduct));
        }
        // If no products in DB, keep fallback constants
      } catch (err) {
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== FETCH USER-SCOPED DATA =====
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      try {
        // Fetch unified user data from API securely
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const res = await fetch('/api/orders', {
            headers: { Authorization: `Bearer ${session.access_token}` }
          });
          if (res.ok) {
            const data = await res.json();

            setOrders((data.orders || []).map((o: any) => ({
              id: o.id,
              userId: o.user_id,
              items: (o.order_items || []).map((oi: any) => ({
                id: oi.product_id,
                productId: oi.product_id,
                title: oi.products?.title,
                coverUrl: oi.products?.cover_url,
                type: oi.products?.type,
                quantity: oi.quantity,
                price: oi.price,
              })),
              total: parseFloat(o.total),
              date: new Date(o.created_at),
              status: o.status,
              paymentMethod: o.payment_method,
              email: o.email,
            })));

            setBookings((data.bookings || []).map((b: any) => ({
              id: b.id,
              userId: b.user_id,
              coachId: b.coach_id,
              date: new Date(b.date),
              status: b.status,
              meetLink: b.meet_link,
              amount: parseFloat(b.amount),
              coachInfo: b.coach,
            })));

            setTickets((data.tickets || []).map((t: any) => ({
              id: t.id,
              userId: t.user_id,
              eventId: t.event_id,
              purchaseDate: new Date(t.created_at),
              qrCode: t.qr_code || `QR-${t.id}`,
              status: t.status,
              amount: parseFloat(t.amount),
              eventInfo: t.event,
            })));
          }
        }

        // Fetch notifications
        const { data: notifData } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50);

        if (notifData) {
          setNotifications(notifData.map((n: any) => ({
            id: n.id,
            userId: n.user_id,
            type: n.type,
            message: n.message,
            date: new Date(n.created_at),
            read: n.read,
            link: n.link,
          })));
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      }
    };

    fetchUserData();
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== FETCH ALL REVIEWS =====
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (data && data.length > 0) {
          setReviews(data.map((r: any) => ({
            id: r.id,
            productId: r.product_id,
            userId: r.user_id,
            userName: r.user_name,
            rating: r.rating,
            comment: r.comment || '',
            date: new Date(r.created_at),
          })));
        }
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchReviews();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== FETCH SITE CONTENT =====
  useEffect(() => {
    const fetchSiteContent = async () => {
      try {
        const { data } = await supabase
          .from('site_content')
          .select('*')
          .eq('id', 1)
          .single();

        if (data) {
          setSiteContent({
            heroHeadline: data.hero_headline,
            heroSubheadline: data.hero_subheadline,
            aboutTitle: data.about_title,
            aboutContent: data.about_content,
            platformFeePercentage: parseFloat(data.platform_fee_percentage),
            platformTaxPercentage: parseFloat(data.platform_tax_percentage),
          });
        }
      } catch (err) {
        // Keep defaults
      }
    };

    fetchSiteContent();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Persist cart to localStorage (cart stays client-side)
  useEffect(() => {
    setStorageItem(STORAGE_KEYS.CART, cart);
  }, [cart]);

  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // ===== CART ACTIONS (unchanged) =====
  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);
  const toggleAuth = useCallback(() => setIsAuthOpen(prev => !prev), []);
  const toggleCheckout = useCallback(() => setIsCheckoutOpen(prev => !prev), []);

  // ===== SUPABASE AUTH ACTIONS =====
  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        if (profile) {
          setUser(dbToUser(profile));
        }
      }

      setIsAuthOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login failed' };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const register = useCallback(async (data: RegisterData): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: data.role,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (authData.user) {
        // Wait a moment for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update profile with additional fields
        await supabase.from('profiles').update({
          store_name: data.role === 'seller' ? `${data.name}'s Store` : null,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.email}`,
        }).eq('id', authData.user.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profile) {
          setUser(dbToUser(profile));
        }
      }

      setIsAuthOpen(false);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Registration failed' };
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loginAsDemo = useCallback(async (role: UserRole) => {
    const email = role === 'seller' ? 'seller@demo.com' : role === 'admin' ? 'admin@demo.com' : 'buyer@demo.com';
    const password = 'demo123456';

    // Try login first
    const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });

    if (loginError) {
      // If not found, sign up
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: `Demo ${role.charAt(0).toUpperCase() + role.slice(1)}`, role } },
      });

      if (signUpError) {
        console.error('Demo login failed:', signUpError);
        return;
      }

      if (authData.user) {
        await new Promise(resolve => setTimeout(resolve, 500));
        await supabase.from('profiles').update({
          store_name: role === 'seller' ? 'Demo Store' : null,
          store_description: role === 'seller' ? 'Best digital products in town' : null,
          wallet_balance: role === 'seller' ? 1250.50 : 0,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`,
        }).eq('id', authData.user.id);
      }
    }

    // Fetch profile
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();
      if (profile) setUser(dbToUser(profile));
    }

    setIsAuthOpen(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOrders([]);
    setNotifications([]);
    setBookings([]);
    setTickets([]);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== ORDER ACTIONS (calls API route) =====
  const createPendingOrder = useCallback(async (paymentMethod: string, email: string, additionalInfo?: { bookingDate?: string; attendeeName?: string }): Promise<Order> => {
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;

    const orderPayload = {
      items: cart.map(item => ({
        productId: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        creatorId: item.creatorId,
      })),
      total: cartTotal,
      paymentMethod,
      email,
      additionalInfo, // Pass extra fields to API
    };

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(orderPayload),
    });

    const orderData = await res.json();

    if (!res.ok) {
      throw new Error(orderData.error || 'Order failed');
    }

    // This order is initially pending, it will be marked completed after successful payment
    return {
      id: orderData.id,
      userId: user?.id || 'guest',
      items: [...cart],
      total: cartTotal,
      date: new Date(orderData.created_at),
      status: 'pending',
      paymentMethod,
      email,
    };
  }, [cart, cartTotal, user]);


  const getUserOrders = useCallback(() => {
    if (!user) return [];
    return orders.filter(o => o.userId === user.id);
  }, [orders, user]);

  // ===== REVIEW ACTIONS (calls Supabase) =====
  const addReview = useCallback(async (productId: string, rating: number, comment: string) => {
    if (!user) return;

    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        product_id: productId,
        user_id: user.id,
        user_name: user.name,
        rating,
        comment,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add review:', error);
      return;
    }

    const newReview: Review = {
      id: review.id,
      productId,
      userId: user.id,
      userName: user.name,
      rating,
      comment,
      date: new Date(review.created_at),
    };
    setReviews(prev => [newReview, ...prev]);

    // Update product average rating locally
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const productReviews = [...reviews.filter(r => r.productId === productId), newReview];
        const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        return { ...p, rating: Math.round(avgRating * 10) / 10 };
      }
      return p;
    }));
  }, [user, reviews]); // eslint-disable-line react-hooks/exhaustive-deps

  const getProductReviews = useCallback((productId: string) => {
    return reviews.filter(r => r.productId === productId);
  }, [reviews]);

  // ===== PRODUCT ACTIONS (calls Supabase) =====
  const addProduct = useCallback((productData: Omit<Product, 'id' | 'createdAt' | 'salesCount' | 'rating'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: generateId(),
      createdAt: new Date(),
      salesCount: 0,
      rating: 0,
    };

    // Insert into Supabase (async, optimistic update)
    supabase.from('products').insert({
      title: newProduct.title,
      creator: newProduct.creator,
      creator_id: newProduct.creatorId,
      price: newProduct.price,
      description: newProduct.description,
      cover_url: newProduct.coverUrl,
      color: newProduct.color,
      tags: newProduct.tags,
      category: newProduct.category,
      type: newProduct.type,
      discount_offer: newProduct.discountOffer,
      lessons: newProduct.lessons,
      duration: newProduct.duration,
      file_url: newProduct.fileUrl,
      file_size: newProduct.fileSize,
    }).select().single().then(({ data }) => {
      if (data) {
        // Update with real DB ID
        setProducts(prev => prev.map(p => p.id === newProduct.id ? dbToProduct(data) : p));
      }
    });

    setProducts(prev => [...prev, newProduct]);
    return newProduct;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const updateProduct = useCallback((product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));

    supabase.from('products').update({
      title: product.title,
      price: product.price,
      description: product.description,
      cover_url: product.coverUrl,
      tags: product.tags,
      category: product.category,
      type: product.type,
      discount_offer: product.discountOffer,
    }).eq('id', product.id).then(({ error }) => {
      if (error) console.error('Failed to update product:', error);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    supabase.from('products').delete().eq('id', productId).then(({ error }) => {
      if (error) console.error('Failed to delete product:', error);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getSellerProducts = useCallback((sellerId: string) => {
    return products.filter(p => p.creatorId === sellerId);
  }, [products]);

  // ===== USER ACTIONS =====
  const updateUserProfile = useCallback(async (data: Partial<StoredUser>) => {
    if (!user) return;

    const updatedUser = { ...user, ...data };
    setUser(updatedUser);

    // Map to DB columns
    const dbUpdate: Record<string, any> = {};
    if (data.name !== undefined) dbUpdate.name = data.name;
    if (data.avatar !== undefined) dbUpdate.avatar = data.avatar;
    if (data.bio !== undefined) dbUpdate.bio = data.bio;
    if (data.location !== undefined) dbUpdate.location = data.location;
    if (data.storeName !== undefined) dbUpdate.store_name = data.storeName;
    if (data.storeDescription !== undefined) dbUpdate.store_description = data.storeDescription;
    if (data.storeBanner !== undefined) dbUpdate.store_banner = data.storeBanner;
    if (data.socialLinks?.twitter !== undefined) dbUpdate.social_twitter = data.socialLinks.twitter;
    if (data.socialLinks?.website !== undefined) dbUpdate.social_website = data.socialLinks.website;

    if (Object.keys(dbUpdate).length > 0) {
      await supabase.from('profiles').update(dbUpdate).eq('id', user.id);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  // ===== NOTIFICATION ACTIONS =====
  const markNotificationRead = useCallback(async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    await supabase.from('notifications').update({ read: true }).eq('id', id);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getUnreadNotifications = useCallback(() => {
    if (!user) return [];
    return notifications.filter(n => n.userId === user.id && !n.read);
  }, [notifications, user]);

  // ===== BOOKING & TICKET ACTIONS =====
  const bookCoach = useCallback(async (coachId: string, date: Date, amount: number): Promise<Booking> => {
    const meetLink = `https://meet.google.com/${generateId().substring(0, 9)}`;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user?.id,
        coach_id: coachId,
        date: date.toISOString(),
        amount,
        meet_link: meetLink,
      })
      .select()
      .single();

    const newBooking: Booking = {
      id: data?.id || generateId(),
      userId: user?.id || 'guest',
      coachId,
      date,
      status: 'upcoming',
      amount,
      meetLink,
    };
    setBookings(prev => [newBooking, ...prev]);

    if (user) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'system',
        message: 'Booking confirmed! Your session is scheduled.',
        link: '/library',
      });
    }

    return newBooking;
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const buyTicket = useCallback(async (eventId: string, amount: number): Promise<Ticket> => {
    const qrCode = `QR-${generateId()}`;

    const { data } = await supabase
      .from('tickets')
      .insert({
        user_id: user?.id,
        event_id: eventId,
        amount,
        qr_code: qrCode,
      })
      .select()
      .single();

    const newTicket: Ticket = {
      id: data?.id || generateId(),
      userId: user?.id || 'guest',
      eventId,
      purchaseDate: new Date(),
      qrCode,
      status: 'valid',
      amount,
    };
    setTickets(prev => [newTicket, ...prev]);

    if (user) {
      await supabase.from('notifications').insert({
        user_id: user.id,
        type: 'system',
        message: 'Ticket purchased! You can view your pass in your Library.',
        link: '/library',
      });
    }

    return newTicket;
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const getUserBookings = useCallback(() => {
    return bookings.filter(b => b.userId === (user?.id || 'guest'));
  }, [bookings, user]);

  const getUserTickets = useCallback(() => {
    return tickets.filter(t => t.userId === (user?.id || 'guest'));
  }, [tickets, user]);

  // ===== SELLER ANALYTICS =====
  const getSellerStats = useCallback((): AnalyticsSummary => {
    if (!user || user.role !== 'seller') {
      return { totalSales: 0, totalRevenue: 0, totalProducts: 0, totalCustomers: 0, revenueByMonth: [], topProducts: [] };
    }

    const sellerProducts = products.filter(p => p.creatorId === user.id);
    const totalSales = sellerProducts.reduce((sum, p) => sum + (p.salesCount || 0), 0);

    const sellerOrderItems = orders.flatMap(o =>
      o.items.map(item => ({ item, date: o.date }))
    ).filter(data => data.item.creatorId === user.id);

    const totalRevenue = sellerOrderItems.reduce((sum, data) => sum + (data.item.price * data.item.quantity), 0);

    const customerIds = new Set(
      orders.filter(o => o.items.some(item => item.creatorId === user.id)).map(o => o.userId)
    );

    const monthlyRevenue: Record<string, number> = {};
    sellerOrderItems.forEach(({ item, date }) => {
      const orderDate = new Date(date);
      const monthName = orderDate.toLocaleString('default', { month: 'short' });
      monthlyRevenue[monthName] = (monthlyRevenue[monthName] || 0) + (item.price * item.quantity);
    });
    const revenueByMonth = Object.entries(monthlyRevenue).map(([month, revenue]) => ({ month, revenue }));

    const productStats: Record<string, { sales: number; revenue: number }> = {};
    sellerOrderItems.forEach(({ item }) => {
      if (!productStats[item.title]) productStats[item.title] = { sales: 0, revenue: 0 };
      productStats[item.title].sales += item.quantity;
      productStats[item.title].revenue += item.price * item.quantity;
    });
    const topProducts = Object.entries(productStats)
      .map(([title, stats]) => ({ title, sales: stats.sales, revenue: stats.revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return { totalSales, totalRevenue, totalProducts: sellerProducts.length, totalCustomers: customerIds.size, revenueByMonth, topProducts };
  }, [user, products, orders]);

  // ===== ADMIN ACTIONS =====
  const getAllUsers = useCallback(async (): Promise<User[]> => {
    if (!user || user.role !== 'admin') return [];

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return [];

      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      });

      if (res.ok) {
        const data = await res.json();
        return data as User[];
      }
    } catch (err) {
      console.error('Failed to fetch admin users:', err);
    }
    return [];
  }, [user]);

  const updateUserRole = useCallback(async (userId: string, role: UserRole) => {
    if (!user || user.role !== 'admin') return;
    await supabase.from('profiles').update({ role }).eq('id', userId);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const deleteUser = useCallback(async (userId: string) => {
    if (!user || user.role !== 'admin') return;
    // Note: this only deletes the profile; the auth user remains.
    // Full user deletion requires the service role via API route.
    await supabase.from('profiles').delete().eq('id', userId);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateSiteContent = useCallback(async (content: SiteContent) => {
    if (!user || user.role !== 'admin') return;
    setSiteContent(content);

    await supabase.from('site_content').update({
      hero_headline: content.heroHeadline,
      hero_subheadline: content.heroSubheadline,
      about_title: content.aboutTitle,
      about_content: content.aboutContent,
      platform_fee_percentage: content.platformFeePercentage,
      platform_tax_percentage: content.platformTaxPercentage,
    }).eq('id', 1);
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StoreContext.Provider value={{
      cart, isCartOpen, isAuthOpen, isCheckoutOpen, user, orders, reviews, products, notifications, cartTotal, siteContent, isLoading,
      bookings, tickets,
      bookCoach, buyTicket, getUserBookings, getUserTickets,
      addToCart, removeFromCart, updateQuantity, clearCart, toggleCart, toggleAuth, toggleCheckout,
      login, register, logout, createPendingOrder, getUserOrders, addReview, getProductReviews,
      addProduct, updateProduct, deleteProduct, getSellerProducts,
      updateUserProfile, markNotificationRead, getUnreadNotifications, getSellerStats,
      loginAsDemo, getAllUsers, updateUserRole, deleteUser, updateSiteContent
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within a StoreProvider');
  return context;
};