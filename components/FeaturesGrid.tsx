'use client';
import React from 'react';
import { ArrowRight, Video, Zap, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const cardVariants = {
   hidden: { opacity: 0, y: 24 },
   visible: (i: number) => ({
      opacity: 1, y: 0,
      transition: { duration: 0.5, delay: i * 0.12, ease: 'easeOut' as const },
   }),
};

export const FeaturesGrid: React.FC = () => {
   return (
      <section className="py-20 container mx-auto px-6">
         <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

            {/* Card 1: Large — spans 7 cols */}
            <motion.div
               custom={0}
               initial="hidden"
               whileInView="visible"
               viewport={{ once: true, margin: '-50px' }}
               variants={cardVariants}
               whileHover={{ y: -4, transition: { duration: 0.2 } }}
            >
               <Link href="/products" className="md:col-span-7 bg-[#0D1B2A] rounded-2xl p-8 md:p-10 relative overflow-hidden group h-72 md:h-80 block">
                  <div className="relative z-10">
                     <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center mb-5 text-white">
                        <Zap className="w-5 h-5" />
                     </div>
                     <h3 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">Creator Tools</h3>
                     <p className="text-gray-400 text-sm max-w-xs">Download templates, fonts, and premium digital assets from top creators worldwide.</p>
                     <div className="mt-6 w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                        <ArrowRight className="w-4 h-4 text-white" />
                     </div>
                  </div>
                  <img
                     src="https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=400"
                     alt="Stack of tools"
                     className="absolute bottom-0 right-0 w-48 opacity-60 group-hover:opacity-80 transition-opacity"
                  />
               </Link>
            </motion.div>

            {/* Right Stack — 2 cards in 5 cols */}
            <div className="md:col-span-5 flex flex-col gap-4">
               <motion.div
                  custom={1}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={cardVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
               >
                  <Link href="/products" className="bg-orange-50 rounded-2xl p-8 relative overflow-hidden group h-36 md:h-[calc(50%-0.5rem)] block border border-selar-border/50">
                     <div className="relative z-10">
                        <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-3 shadow-subtle">
                           <Video className="w-4 h-4 text-orange-600" />
                        </div>
                        <h3 className="font-display font-bold text-lg text-brand-dark">Top Courses</h3>
                        <p className="text-brand-muted text-xs">Master new skills with video masterclasses</p>
                     </div>
                  </Link>
               </motion.div>

               <motion.div
                  custom={2}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-50px' }}
                  variants={cardVariants}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
               >
                  <Link href="/discover" className="bg-indigo-50 rounded-2xl p-8 relative overflow-hidden group h-36 md:h-[calc(50%-0.5rem)] block border border-selar-border/50">
                     <div className="relative z-10 flex items-start justify-between">
                        <div>
                           <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center mb-3 shadow-subtle">
                              <Users className="w-4 h-4 text-indigo-600" />
                           </div>
                           <h3 className="font-display font-bold text-lg text-brand-dark">Live Events</h3>
                           <p className="text-brand-muted text-xs">Webinars, workshops & summits</p>
                        </div>
                        <div className="bg-white/80 px-2 py-1 rounded-lg text-[10px] font-bold text-brand-dark border border-selar-border/50">
                           ★ 4.9
                        </div>
                     </div>
                  </Link>
               </motion.div>
            </div>

         </div>
      </section>
   );
};