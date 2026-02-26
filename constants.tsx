import { Product, Testimonial, Topic, Coach, Event } from './types';
import { Palette, Layout, Type, Maximize, MousePointer2, Droplet, Video, Ticket, Briefcase } from 'lucide-react';
import React from 'react';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'Design Systems Masterclass',
    creator: 'Sarah Jenkins',
    creatorId: 'seller-1',
    price: 99.00,
    description: 'A complete video course on building scalable UI libraries with Figma and React. Learn to create a comprehensive design system from scratch, including tokens, components, and documentation.',
    coverUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=400',
    color: 'bg-indigo-100',
    tags: ['Design', 'UI/UX'],
    rating: 4.8,
    type: 'COURSE',
    salesCount: 142,
    createdAt: new Date('2024-01-01'),
    lessons: 24,
    duration: '8 hours'
  },
  {
    id: '2',
    title: 'The Modern React Handbook',
    creator: 'David Chen',
    creatorId: 'seller-2',
    price: 24.50,
    description: 'The definitive guide to modern React development in 2024. Covers hooks, state management, performance optimization, and best practices for production applications.',
    coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=400',
    color: 'bg-blue-100',
    tags: ['Development', 'React'],
    rating: 4.9,
    type: 'EBOOK',
    salesCount: 850,
    createdAt: new Date('2024-01-15'),
    fileSize: '15 MB'
  },
  {
    id: '3',
    title: 'SaaS Founders Summit 2024',
    creator: 'Tech Events Co.',
    creatorId: 'seller-3',
    price: 150.00,
    description: 'Entry ticket to the premier digital product conference of the year. Network with industry leaders, attend workshops, and discover the latest trends in SaaS.',
    coverUrl: 'https://images.unsplash.com/photo-1540575861501-7ad05823c9f5?auto=format&fit=crop&q=80&w=400',
    color: 'bg-orange-100',
    tags: ['Business', 'Networking'],
    rating: 4.7,
    type: 'TICKET',
    salesCount: 45,
    createdAt: new Date('2024-02-01'),
    eventDate: new Date('2024-06-15'),
    eventLocation: 'San Francisco, CA',
    ticketsAvailable: 200
  },
  {
    id: '4',
    title: 'UI/UX Portfolio Review',
    creator: 'Michael Arrington',
    creatorId: 'seller-4',
    price: 75.00,
    description: 'Get a 30-minute personalized video review of your design portfolio from an industry veteran. Receive actionable feedback to land your dream design job.',
    coverUrl: 'https://images.unsplash.com/photo-1542744094-3a31f08e7f17?auto=format&fit=crop&q=80&w=400',
    color: 'bg-pink-100',
    tags: ['Service', 'Coaching'],
    rating: 5.0,
    type: 'SERVICE',
    salesCount: 12,
    createdAt: new Date('2024-02-15')
  },
  {
    id: '5',
    title: 'JavaScript Performance Optimization',
    creator: 'Emma Rodriguez',
    creatorId: 'seller-5',
    price: 45.00,
    description: 'Master the art of writing blazing-fast JavaScript. Learn profiling, memory management, and advanced optimization techniques used by top tech companies.',
    coverUrl: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=400',
    color: 'bg-yellow-100',
    tags: ['Development', 'JavaScript'],
    rating: 4.6,
    type: 'EBOOK',
    salesCount: 320,
    createdAt: new Date('2024-03-01'),
    fileSize: '12 MB'
  },
  {
    id: '6',
    title: 'Startup Pitch Deck Template',
    creator: 'Venture Studio',
    creatorId: 'seller-6',
    price: 35.00,
    description: 'Professional Figma template used by YC-backed startups. Includes 30+ slides, investor-ready layouts, and data visualization components.',
    coverUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400',
    color: 'bg-green-100',
    tags: ['Business', 'Templates'],
    rating: 4.8,
    type: 'EBOOK',
    salesCount: 567,
    createdAt: new Date('2024-03-15'),
    fileSize: '25 MB'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Alex Johnson',
    role: 'Product Designer',
    avatar: 'https://i.pravatar.cc/150?img=68',
    content: 'Selling my digital assets on Redex has been a game changer. The instant payouts and simple course hosting are world-class.',
    rating: 5
  },
  {
    id: '2',
    name: 'Maria Garcia',
    role: 'Course Creator',
    avatar: 'https://i.pravatar.cc/150?img=44',
    content: 'The platform handles everything from tax to delivery. I just focus on creating great content for my students.',
    rating: 5
  },
  {
    id: '3',
    name: 'James Wilson',
    role: 'eBook Author',
    avatar: 'https://i.pravatar.cc/150?img=12',
    content: 'I\'ve tried many platforms, but Redex offers the best commission rates and the smoothest buyer experience.',
    rating: 5
  }
];

export const TOPICS: Topic[] = [
  { id: '1', title: 'Design Principles', icon: 'palette', color: 'text-brand-purple' },
  { id: '2', title: 'Video Courses', icon: 'video', color: 'text-red-500' },
  { id: '3', title: 'Live Events', icon: 'ticket', color: 'text-blue-500' },
  { id: '4', title: 'Consultancy', icon: 'briefcase', color: 'text-brand-orange' },
  { id: '5', title: 'React Dev', icon: 'maximize', color: 'text-indigo-500' },
  { id: '6', title: 'Typography', icon: 'type', color: 'text-green-500' },
];

export const getIcon = (name: string, className?: string) => {
  const props = { className: className || "w-5 h-5" };
  switch (name) {
    case 'palette': return <Palette {...props} />;
    case 'layout': return <Layout {...props} />;
    case 'type': return <Type {...props} />;
    case 'maximize': return <Maximize {...props} />;
    case 'video': return <Video {...props} />;
    case 'ticket': return <Ticket {...props} />;
    case 'briefcase': return <Briefcase {...props} />;
    case 'droplet': return <Droplet {...props} />;
    default: return <Palette {...props} />;
  }
};

export const COACHES: Coach[] = [
  { id: '1', name: 'Sarah Jenkins', role: 'Career Coach', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', rating: 4.9, reviews: 120, specialty: 'Leadership', hourlyRate: 150, about: 'Experienced tech leader helping professionals navigate career growth and leadership transition.' },
  { id: '2', name: 'David Chen', role: 'Tech Mentor', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David', rating: 4.8, reviews: 85, specialty: 'Engineering', hourlyRate: 120, about: 'Ex-FAANG engineer mentoring mid-to-senior developers on system design and architecture.' },
  { id: '3', name: 'Elena Rodriguez', role: 'Business Strategist', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', rating: 5.0, reviews: 200, specialty: 'Growth', hourlyRate: 200, about: 'Specializing in actionable go-to-market strategies for early-stage digital product founders.' },
  { id: '4', name: 'Marcus Wright', role: 'Design Lead', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus', rating: 4.7, reviews: 95, specialty: 'Product Design', hourlyRate: 110, about: 'Portfolio reviews, interview prep, and advanced UI/UX feedback.' },
];

export const EVENTS: Event[] = [
  { id: '1', title: 'Web3 Masterclass', date: new Date('2026-10-24T18:00:00Z'), type: 'Virtual', price: 0, image: 'https://images.unsplash.com/photo-1540317580384-e5d43616b9aa?auto=format&fit=crop&q=80&w=400', description: 'Deep dive into decentralized application development.', organizer: 'CryptoDevs', duration: '2 hours' },
  { id: '2', title: 'Design Leadership Summit', date: new Date('2026-11-12T09:00:00Z'), type: 'San Francisco, CA', price: 299, image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32d7?auto=format&fit=crop&q=80&w=400', description: 'The annual gathering for product design leaders.', organizer: 'DesignOps', duration: 'Full Day' },
  { id: '3', title: 'Freelance Growth Workshop', date: new Date('2026-12-05T14:00:00Z'), type: 'Virtual', price: 49, image: 'https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&q=80&w=400', description: 'Scale your consulting and freelance agency to 6 figures.', organizer: 'Freelance Pro', duration: '3 hours' },
];