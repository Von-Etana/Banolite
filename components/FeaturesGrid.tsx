'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { Globe, CreditCard, Ticket, BarChart3, Users, FileText, Mail, Filter, Sparkles } from 'lucide-react';
import Link from 'next/link';

const features = [
   {
      title: 'WEBSITE',
      headline: 'Set up a fully integrated, easy to manage, no-code website.',
      color: 'bg-[#ACEFF8]',
      icon: Globe
   },
   {
      title: 'PAYMENTS',
      headline: 'Manage checkout and payments with industry-leading security.',
      color: 'bg-[#BDB2FF]',
      icon: CreditCard
   },
   {
      title: 'TICKET SALES',
      headline: 'Sell tickets for your live events, webinars, and masterclasses.',
      color: 'bg-[#A1DBE3]',
      icon: Ticket
   },
   {
      title: 'ANALYTICS',
      headline: 'Find the numbers that matter for reports you’ll actually use.',
      color: 'bg-[#FF98B0]',
      icon: BarChart3
   },
   {
      title: 'CONTACTS',
      headline: 'Grow 1:1 relationships with your followers off social media.',
      color: 'bg-[#EBF47E]',
      icon: Users
   },
   {
      title: 'PAGES',
      headline: 'Fast and powerful code-free landing pages.',
      color: 'bg-[#BDB2FF]',
      icon: FileText
   },
   {
      title: 'EMAILS',
      headline: 'Build meaningful emails to target your customers.',
      color: 'bg-[#A1DBE3]',
      icon: Mail
   },
   {
      title: 'FUNNELS',
      headline: 'Convert new customers with proven ready-made funnels.',
      color: 'bg-[#FF98B0]',
      icon: Filter
   }
];

export const FeaturesGrid: React.FC = () => {
   return (
      <section className="py-32 bg-brand-dark text-white relative z-20">
         <div className="container mx-auto px-6 max-w-7xl">
            <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-20">
               <div className="lg:w-1/2">
                  <h2 className="font-display font-bold text-5xl md:text-[64px] tracking-[-2px] leading-[1.05] mb-6">
                     Creator<br />takes all.
                  </h2>
                  <p className="text-xl text-white/80 leading-relaxed max-w-md">
                     You do all the work, so you keep all the money — and own all your content. No more changing algorithms, chasing engagement, and unfair revenue shares. With us, you’re in control.
                  </p>
               </div>
               <div className="lg:w-1/2 flex justify-start lg:justify-end mt-4 lg:mt-0">
                  <Link href="/pricing" className="btn-secondary text-base">
                     See Pricing Plans →
                  </Link>
               </div>
            </div>

            {/* Top 3 value props */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
               {[
                  { title: 'No revenue sharing. Ever.', desc: 'You make the content, you reap the rewards.', color: 'text-[#ACEFF8]' },
                  { title: 'Grow your business, not theirs.', desc: 'You own 100% of what you make.', color: 'text-[#FF98B0]' },
                  { title: 'Designed to scale.', desc: 'Dream big. There are no limits on what you can make and earn.', color: 'text-[#E8FF8C]' }
               ].map((prop, i) => (
                  <motion.div
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true, margin: '-50px' }}
                     transition={{ delay: i * 0.1, duration: 0.5 }}
                     className="bg-[#282525] p-10 rounded-3xl"
                  >
                     <div className={`mb-6 ${prop.color}`}>
                        <Sparkles className="w-10 h-10" />
                     </div>
                     <h3 className="font-bold text-2xl mb-4">{prop.title}</h3>
                     <p className="text-white/70 text-lg leading-relaxed">{prop.desc}</p>
                  </motion.div>
               ))}
            </div>

            {/* Feature Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
               {features.map((feature, i) => (
                  <motion.div
                     key={feature.title}
                     initial={{ opacity: 0, scale: 0.95 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true, margin: '-50px' }}
                     transition={{ delay: i * 0.05, duration: 0.4 }}
                     className="bg-white rounded-3xl p-8 flex flex-col justify-between h-[360px] group hover:shadow-card-hover transition-all cursor-pointer border border-transparent hover:border-brand-primary/20"
                  >
                     <div>
                        <h4 className="font-display font-bold text-3xl tracking-tight text-brand-dark mb-4">{feature.title}</h4>
                        <p className="text-brand-dark font-medium text-[17px] leading-snug">{feature.headline}</p>
                     </div>

                     <div className="flex justify-between items-end">
                        <span className="font-bold text-[15px] text-brand-dark group-hover:text-brand-primary transition-colors flex items-center gap-1">
                           Learn More <span className="text-xl leading-none w-4 h-4 translate-y-[-1px]">&rarr;</span>
                        </span>
                        <div className={`w-14 h-14 rounded-2xl ${feature.color} flex items-center justify-center -mb-2 -mr-2 shadow-sm transform group-hover:scale-110 transition-transform duration-300`}>
                           <feature.icon className="w-6 h-6 text-brand-dark" />
                        </div>
                     </div>
                  </motion.div>
               ))}
            </div>

         </div>
      </section>
   );
};