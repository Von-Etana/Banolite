'use client';
import React from 'react';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';
import { Package, Globe, Star, Zap, ShieldCheck, HeartHandshake } from 'lucide-react';

const bentoStats = [
   { label: 'Active Creators', value: '5,000+', icon: HeartHandshake, color: 'bg-brand-orange/10 text-brand-orange' },
   { label: 'Global Reach', value: '120+ Countries', icon: Globe, color: 'bg-brand-purple/10 text-brand-purple' },
   { label: 'Digital Assets', value: '50,000+', icon: Package, color: 'bg-blue-50 text-blue-600' },
   { label: 'Secure Payouts', value: '$2M+', icon: ShieldCheck, color: 'bg-emerald-50 text-emerald-600' },
];

export const AboutSection: React.FC = () => {
   const { siteContent } = useStore();

   return (
      <section id="about" className="py-24 container mx-auto px-6 max-w-7xl">
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="mb-16 max-w-3xl"
         >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-light border border-selar-border rounded-lg text-xs font-semibold text-brand-dark uppercase tracking-wider mb-6">
               About Banolite
            </span>
            <h2 className="section-heading mb-6">{siteContent.aboutTitle || "Empowering the Next Generation of Digital Creators"}</h2>
            <p className="text-brand-muted text-lg md:text-xl leading-relaxed whitespace-pre-wrap">
               {siteContent.aboutContent || "Banolite is the premier platform for educators, artists, and experts to monetize their knowledge. We provide the tools you need to sell digital products, courses, event tickets, and 1-on-1 coaching globally—without the technical headache."}
            </p>
         </motion.div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Card */}
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true, margin: '-80px' }}
               transition={{ duration: 0.5, delay: 0.1 }}
               className="bg-brand-light rounded-[2rem] p-6 md:p-10 relative overflow-hidden border border-selar-border"
            >
               <div className="flex flex-col h-full justify-between gap-8">
                  <div>
                     <h3 className="font-display font-bold text-3xl text-brand-dark mb-4">Built for Growth</h3>
                     <p className="text-brand-muted mb-8">
                        Whether you're selling your first eBook or managing a full-scale coaching business,
                        our infrastructure scales with you. Instant payouts, secure file delivery, and global reach built right in.
                     </p>
                     <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-selar-border shadow-sm">
                           <div className="w-12 h-12 bg-brand-purple/10 rounded-xl flex items-center justify-center">
                              <Zap className="w-6 h-6 text-brand-purple" />
                           </div>
                           <div>
                              <span className="font-bold text-brand-dark block">Zero Config Setup</span>
                              <span className="text-sm text-brand-muted">Start selling in under 5 minutes</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-selar-border shadow-sm">
                           <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center">
                              <Globe className="w-6 h-6 text-brand-orange" />
                           </div>
                           <div>
                              <span className="font-bold text-brand-dark block">Worldwide Audience</span>
                              <span className="text-sm text-brand-muted">Accept payments from anywhere</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </motion.div>

            {/* Bento Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
               {bentoStats.map((stat, i) => (
                  <motion.div
                     key={stat.label}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: '-50px' }}
                     transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
                     whileHover={{ y: -4, transition: { duration: 0.2 } }}
                     className="bg-white rounded-[2rem] p-8 border border-selar-border flex flex-col justify-between cursor-default hover:shadow-lg transition-all"
                  >
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${stat.color}`}>
                        <stat.icon className="w-7 h-7" />
                     </div>
                     <div>
                        <p className="text-3xl font-display font-bold text-brand-dark mb-1">{stat.value}</p>
                        <p className="text-sm font-medium text-brand-muted">{stat.label}</p>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>
   );
};