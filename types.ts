export type ProductType = 'EBOOK' | 'COURSE' | 'TICKET' | 'SERVICE' | 'SUBSCRIPTION' | 'COACHING';

export interface Product {
  id: string;
  title: string;
  creator: string;
  creatorId: string;
  price: number;
  description: string;
  coverUrl: string;
  color: string;
  tags: string[];
  category?: string;
  discountOffer?: number;
  rating: number;
  type: ProductType;
  salesCount: number;
  createdAt: Date;
  // For courses
  lessons?: number;
  duration?: string;
  // For tickets
  eventDate?: Date;
  eventLocation?: string;
  ticketsAvailable?: number;
  // For subscriptions
  billingPeriod?: 'monthly' | 'yearly';
  // For digital products
  fileUrl?: string;
  fileSize?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  avatar?: string;
  role: UserRole;
  purchasedProductIds: string[];
  bio?: string;
  location?: string;
  walletBalance: number;
  createdAt: Date;
  // Seller fields
  storeName?: string;
  storeDescription?: string;
  storeBanner?: string;
  brandColor?: string;
  socialLinks?: {
    twitter?: string;
    website?: string;
  };
}

export interface StoredUser extends Omit<User, 'passwordHash'> {
  // Public user data without password
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  date: Date;
}

export type OrderStatus = 'pending' | 'completed' | 'refunded' | 'failed';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  date: Date;
  status: OrderStatus;
  paymentMethod: string;
  email: string;
}

export type NotificationType = 'sale' | 'review' | 'system' | 'payout' | 'order';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  date: Date;
  read: boolean;
  link?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  content: string;
  rating: number;
}

export interface Topic {
  id: string;
  title: string;
  icon: string;
  color: string;
}

export type PayoutStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Payout {
  id: string;
  sellerId: string;
  amount: number;
  date: Date;
  status: PayoutStatus;
  bankDetails?: string;
}

export interface Transaction {
  id: string;
  orderId: string;
  sellerId: string;
  amount: number;
  fee: number;
  net: number;
  date: Date;
  productTitle: string;
}

export interface AnalyticsSummary {
  totalSales: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  revenueByMonth: { month: string; revenue: number }[];
  topProducts: { title: string; sales: number; revenue: number }[];
}

export interface SiteContent {
  heroHeadline: string;
  heroSubheadline: string;
  aboutTitle: string;
  aboutContent: string;
  platformFeePercentage: number;
  platformTaxPercentage: number;
}

export interface Coach {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  reviews: number;
  specialty: string;
  hourlyRate: number;
  about: string;
}

export interface Event {
  id: string;
  title: string;
  date: Date;
  type: 'Virtual' | string; // e.g., 'San Francisco, CA'
  price: number;
  image: string;
  description: string;
  organizer: string;
  duration: string;
}

export interface Booking {
  id: string;
  userId: string;
  coachId: string;
  date: Date;
  status: 'upcoming' | 'completed' | 'cancelled';
  meetLink?: string;
  amount: number;
}

export interface Ticket {
  id: string;
  userId: string;
  eventId: string;
  purchaseDate: Date;
  qrCode: string;
  status: 'valid' | 'used' | 'refunded';
  amount: number;
}