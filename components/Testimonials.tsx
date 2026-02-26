'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../constants';
import { motion, AnimatePresence } from 'framer-motion';

export const Testimonials: React.FC = () => {
   const [current, setCurrent] = useState(0);
   const [isPaused, setIsPaused] = useState(false);

   const next = useCallback(() => {
      setCurrent(prev => (prev + 1) % TESTIMONIALS.length);
   }, []);

   const prev = useCallback(() => {
      setCurrent(prev => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
   }, []);

   // Auto-rotate
   useEffect(() => {
      if (isPaused) return;
      const timer = setInterval(next, 5000);
      return () => clearInterval(timer);
   }, [isPaused, next]);

   const testimonial = TESTIMONIALS[current];

   return (
      <section className="py-20 container mx-auto px-6">
         <div className="flex flex-col lg:flex-row items-center gap-16">

            {/* Left Text */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5 }}
               className="lg:w-1/3"
            >
               <h2 className="section-heading mb-4">
                  What People<br />Say About<br />Our Platform
               </h2>
               <p className="section-subtext mb-6 text-sm leading-relaxed">
                  Trusted by thousands of creators and learners worldwide. Here's what they have to say.
               </p>

               {/* Dots */}
               <div className="flex items-center gap-2">
                  {TESTIMONIALS.map((_, i) => (
                     <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-brand-dark w-6' : 'bg-gray-200'}`}
                     />
                  ))}
               </div>
            </motion.div>

            {/* Right Card */}
            <div
               className="lg:w-2/3 w-full relative"
               onMouseEnter={() => setIsPaused(true)}
               onMouseLeave={() => setIsPaused(false)}
            >
               <AnimatePresence mode="wait">
                  <motion.div
                     key={current}
                     initial={{ opacity: 0, x: 30 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -30 }}
                     transition={{ duration: 0.35, ease: 'easeInOut' as const }}
                     className="bg-white rounded-2xl p-8 md:p-10 shadow-elevated border border-selar-border relative"
                  >
                     <div className="absolute -top-4 -left-4 w-10 h-10 bg-brand-dark rounded-xl flex items-center justify-center text-white shadow-subtle">
                        <Quote className="w-4 h-4" />
                     </div>

                     <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                        <img
                           src={testimonial.avatar}
                           alt={testimonial.name}
                           className="w-16 h-16 rounded-2xl object-cover border border-selar-border"
                        />
                        <div>
                           <div className="flex gap-0.5 mb-3">
                              {[1, 2, 3, 4, 5].map(s => (
                                 <span key={s} className={`text-sm ${s <= testimonial.rating ? 'text-amber-400' : 'text-gray-200'}`}>★</span>
                              ))}
                           </div>
                           <p className="text-brand-dark text-base leading-relaxed mb-6">"{testimonial.content}"</p>
                           <div>
                              <h4 className="font-bold text-brand-dark text-sm">{testimonial.name}</h4>
                              <p className="text-xs text-brand-muted uppercase tracking-wide">{testimonial.role}</p>
                           </div>
                        </div>
                     </div>
                  </motion.div>
               </AnimatePresence>

               {/* Controls */}
               <div className="flex gap-2 mt-6 justify-end">
                  <button
                     onClick={prev}
                     className="w-10 h-10 rounded-xl bg-white border border-selar-border flex items-center justify-center text-brand-muted hover:text-brand-dark hover:shadow-subtle transition-all"
                  >
                     <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                     onClick={next}
                     className="w-10 h-10 rounded-xl bg-brand-dark flex items-center justify-center text-white hover:bg-brand-dark/90 transition-all"
                  >
                     <ArrowRight className="w-4 h-4" />
                  </button>
               </div>
            </div>

         </div>
      </section>
   );
};