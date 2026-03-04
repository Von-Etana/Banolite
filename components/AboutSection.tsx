'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, LifeBuoy, HeartHandshake } from 'lucide-react';
import Link from 'next/link';

const resources = [
   {
      title: 'Learning Hub',
      description: 'Free live training workshops, webinars, downloadable guides, and more.',
      icon: BookOpen,
      image: '/learning-hub.jpg'
   },
   {
      title: '24/7 Support',
      description: 'Our team is available 24/7 to provide answers and solve problems.',
      icon: LifeBuoy,
      image: '/support.webp'
   },
   {
      title: 'A Vibrant Community',
      description: 'Get support and advice from expert creators who know the platform.',
      icon: HeartHandshake,
      image: '/community.jpg'
   }
];

export const AboutSection: React.FC = () => {
   return (
      <section id="about" className="py-32 bg-cream">
         <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
               <div className="lg:w-1/2">
                  <h2 className="section-heading mb-6">
                     Learn, grow, and<br />build together.
                  </h2>
               </div>
               <div className="lg:w-1/2 flex flex-col items-start lg:items-end">
                  <p className="text-xl text-brand-dark leading-relaxed mb-6 font-medium">
                     We're much more than software; we're a powerful network of creators and experts ready to share their expertise to save you time and money. We make sure you're never on your own.
                  </p>
                  <Link href="/library" className="btn-secondary text-base">
                     View All Resources →
                  </Link>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {resources.map((resource, i) => (
                  <motion.div
                     key={resource.title}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: '-50px' }}
                     transition={{ duration: 0.5, delay: i * 0.1 }}
                     className="bg-[#FAF9F7] rounded-[24px] overflow-hidden flex flex-col border border-selar-border group hover:shadow-card-hover transition-all cursor-pointer"
                  >
                     <div className="h-64 relative overflow-hidden">
                        <img
                           src={resource.image}
                           alt={resource.title}
                           className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                        />
                     </div>
                     <div className="p-8 flex-grow flex flex-col justify-between">
                        <div>
                           <h3 className="font-bold text-[22px] text-brand-dark mb-3 leading-tight">{resource.title}</h3>
                           <p className="text-[15px] text-brand-muted leading-relaxed line-clamp-3">
                              {resource.description}
                           </p>
                        </div>
                        <span className="font-semibold text-[15px] text-brand-dark mt-8 inline-flex items-center gap-1 group-hover:text-brand-primary transition-colors">
                           Learn More <span className="text-xl leading-none translate-y-[-1px]">&rarr;</span>
                        </span>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>
   );
};