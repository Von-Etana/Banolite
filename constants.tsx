import { Product, Testimonial, Topic, Coach, Event } from './types';
import { Palette, Layout, Type, Maximize, MousePointer2, Droplet, Video, Ticket, Briefcase } from 'lucide-react';
import React from 'react';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    title: 'My Amazing Character and I',
    creator: 'Etima',
    creatorId: 'seller-1',
    price: 99.00,
    description: 'An amazing book to help you build character and become your best self.',
    coverUrl: '/etima-images/1.jpeg',
    color: 'bg-indigo-100',
    tags: ['Self-help', 'Kids'],
    rating: 4.8,
    type: 'EBOOK',
    salesCount: 142,
    createdAt: new Date('2024-01-01'),
    fileSize: '15 MB'
  },
  {
    id: '2',
    title: 'My Big Feelings And I',
    creator: 'Etima',
    creatorId: 'seller-2',
    price: 24.50,
    description: 'Learn how to navigate complex emotions and develop emotional intelligence.',
    coverUrl: '/etima-images/WhatsApp%20Image%202026-05-23%20at%2010.20.32%20(1).jpeg',
    color: 'bg-blue-100',
    tags: ['Emotions', 'Kids'],
    rating: 4.9,
    type: 'EBOOK',
    salesCount: 850,
    createdAt: new Date('2024-01-15'),
    fileSize: '15 MB'
  },
  {
    id: '3',
    title: 'My Wonderful Siblings and I',
    creator: 'Etima',
    creatorId: 'seller-3',
    price: 15.00,
    description: 'A beautiful story about sibling relationships, sharing, and love.',
    coverUrl: '/etima-images/WhatsApp%20Image%202026-05-23%20at%2010.20.32.jpeg',
    color: 'bg-orange-100',
    tags: ['Family', 'Kids'],
    rating: 4.7,
    type: 'EBOOK',
    salesCount: 45,
    createdAt: new Date('2024-02-01'),
    fileSize: '15 MB'
  },
  {
    id: '4',
    title: 'NO IS ENOUGH',
    creator: 'Etima',
    creatorId: 'seller-4',
    price: 15.00,
    description: 'Learn the power of setting boundaries and saying no with confidence.',
    coverUrl: '/etima-images/WhatsApp%20Image%202026-05-23%20at%2010.20.33%20(1).jpeg',
    color: 'bg-pink-100',
    tags: ['Boundaries', 'Self-help'],
    rating: 5.0,
    type: 'EBOOK',
    salesCount: 12,
    createdAt: new Date('2024-02-15'),
    fileSize: '15 MB'
  },
  {
    id: '5',
    title: 'RED FLAGS DON’T LIE',
    creator: 'Etima',
    creatorId: 'seller-5',
    price: 45.00,
    description: 'Identify the early warning signs in relationships and protect your peace.',
    coverUrl: '/etima-images/WhatsApp%20Image%202026-05-23%20at%2010.20.33%20(2).jpeg',
    color: 'bg-yellow-100',
    tags: ['Relationships', 'Self-help'],
    rating: 4.6,
    type: 'EBOOK',
    salesCount: 320,
    createdAt: new Date('2024-03-01'),
    fileSize: '12 MB'
  },
  {
    id: '6',
    title: 'THE SPIRITUALLY INTELLIGENT GIRL',
    creator: 'Etima',
    creatorId: 'seller-6',
    price: 35.00,
    description: 'A guide to growing in spiritual intelligence and finding your purpose.',
    coverUrl: '/etima-images/WhatsApp%20Image%202026-05-23%20at%2010.20.33.jpeg',
    color: 'bg-green-100',
    tags: ['Spirituality', 'Women'],
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
    content: 'Selling my digital assets on Banolite has been a game changer. The instant payouts and simple course hosting are world-class.',
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
    content: 'I\'ve tried many platforms, but Banolite offers the best commission rates and the smoothest buyer experience.',
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