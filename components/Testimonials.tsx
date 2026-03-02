'use client';
import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const testimonials = [
   {
      name: 'Justin Welsh',
      quote: '"I help people take the skills that they have, identify those, and turn them into income," Justin shares. As part of our vibrant creator community, Justin’s story serves as proof and inspiration that taking that big leap of faith, combined with robust resources, can be the prelude to unmatched success.',
      tags: ['Business', 'Courses'],
      gradient: 'from-transparent to-[#EBF47E]',
      image: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=600'
   },
   {
      name: 'Jacquelyn',
      quote: '“It just was organic, the way that I created a course for myself and for my audience. I really leaned into the community, asking them what they wanted to learn, what they struggled with, their top two fitness goals,” Jacquelyn says. “I just put together little challenges to get started online.”',
      tags: ['Fitness', 'Courses'],
      gradient: 'from-transparent to-[#FF757A]',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600'
   },
   {
      name: 'Eno Eka',
      quote: '“I had a successful six-figure career, traveling and having fun. I always documented what I was doing and the projects I was working on, and I started influencing [my audience] to see business analysis as a career because I shared how much fun it was.”',
      tags: ['Education', 'Coaching'],
      gradient: 'from-transparent to-[#BDB2FF]',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600'
   }
];

export const Testimonials: React.FC = () => {
   return (
      <section className="py-32 bg-cream">
         <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
               <div className="lg:w-1/2">
                  <h2 className="font-display font-bold text-5xl md:text-[54px] tracking-[-1.5px] leading-tight mb-4">
                     The top choice for creators of all sizes.
                  </h2>
               </div>
               <div className="lg:w-1/2 flex flex-col items-start lg:items-end">
                  <p className="text-lg text-brand-dark leading-relaxed mb-6 font-medium max-w-lg">
                     Learn the playbooks from successful creators so you can implement their strategies and scale your impact.
                  </p>
                  <Link href="/blog" className="btn-secondary text-base border-2">
                     Read Creator Stories →
                  </Link>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {testimonials.map((testimonial, i) => (
                  <motion.div
                     key={testimonial.name}
                     initial={{ opacity: 0, y: 30 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: '-50px' }}
                     transition={{ duration: 0.5, delay: i * 0.15 }}
                     className="relative rounded-3xl overflow-hidden h-[624px] group"
                  >
                     {/* Background Image */}
                     <div className="absolute inset-0 z-0">
                        <img
                           src={testimonial.image}
                           alt={testimonial.name}
                           className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                        />
                     </div>

                     {/* Gradient Overlay matching CSS linear-gradient(0deg, color 15%, transparent 55%) */}
                     <div className={`absolute inset-0 z-10 bg-gradient-to-t ${testimonial.gradient} opacity-90`} style={{ background: `linear-gradient(0deg, ${testimonial.gradient.split('to-')[1].replace(']', '').replace('[', '')} 15%, rgba(255,255,255,0) 65%)` }} />

                     {/* Content */}
                     <div className="absolute inset-0 z-20 p-8 flex flex-col justify-end text-brand-dark">
                        <h3 className="font-display font-bold text-3xl mb-4 italic uppercase tracking-tight drop-shadow-sm">
                           {testimonial.name}
                        </h3>

                        <div className="flex gap-2 mb-6">
                           {testimonial.tags.map(tag => (
                              <span key={tag} className="px-4 py-1 rounded-full border border-black/20 bg-white/30 backdrop-blur-sm text-sm font-medium">
                                 {tag}
                              </span>
                           ))}
                        </div>

                        <p className="text-[15px] leading-[130%] tracking-[-0.28px] font-medium mb-8 line-clamp-6">
                           {testimonial.quote}
                        </p>

                        <button className="self-start font-bold text-[14px] flex items-center gap-1 hover:underline">
                           Read More <span className="text-lg leading-none">&rarr;</span>
                        </button>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>
   );
};