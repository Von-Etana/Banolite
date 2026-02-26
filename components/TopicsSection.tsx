'use client';
import React from 'react';
import { TOPICS, getIcon } from '../constants';

export const TopicsSection: React.FC = () => {
  return (
    <section className="py-20 container mx-auto px-6">
      <div className="flex flex-col-reverse lg:flex-row items-center gap-20">
        
        {/* Left Content (Topics List) */}
        <div className="lg:w-1/2">
           <span className="text-gray-500 font-medium mb-2 block">Some topics</span>
           <h2 className="font-display font-bold text-4xl text-brand-dark mb-6">
             What's inside<br/>the book
           </h2>
           <p className="text-gray-500 text-sm mb-12 max-w-sm">
             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas in felis euis.
           </p>

           <div className="grid grid-cols-2 gap-y-8 gap-x-4">
              {TOPICS.map((topic) => (
                 <div key={topic.id} className="flex items-center gap-3 group cursor-pointer">
                    <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform ${topic.color}`}>
                       {getIcon(topic.icon)}
                    </div>
                    <span className="font-medium text-brand-dark text-sm">{topic.title}</span>
                 </div>
              ))}
           </div>
        </div>

        {/* Right Graphic */}
        <div className="lg:w-1/2 flex justify-center relative">
           {/* Big Circle BG */}
           <div className="w-[400px] h-[400px] bg-brand-purple rounded-full relative overflow-hidden flex items-center justify-center">
              <div className="absolute w-[500px] h-[500px] bg-white/10 rounded-full animate-pulse"></div>
              
              {/* Floating Items */}
              <img 
                 src="https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=400" 
                 alt="Books"
                 className="w-48 h-auto object-cover rounded shadow-2xl relative z-10 transform -rotate-12 border-4 border-white"
              />
              
              <div className="absolute top-20 right-20 text-yellow-300 text-4xl">✨</div>
              <div className="absolute bottom-20 left-20 text-blue-300 text-4xl">🎓</div>
           </div>
           
           {/* Pink dot decoration */}
           <div className="absolute top-10 right-0 w-12 h-12 bg-brand-pink rounded-full blur-xl opacity-60"></div>
        </div>

      </div>
    </section>
  );
};