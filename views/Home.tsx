'use client';
import React from 'react';
import { Hero } from '../components/Hero';
import { FeaturesGrid } from '../components/FeaturesGrid';
import { AboutSection } from '../components/AboutSection';
import { HowToJoinSection } from '../components/HowToJoinSection';
import { DiscoverProducts } from '../components/DiscoverSection';
import { Testimonials } from '../components/Testimonials';
import { TopicsSection } from '../components/TopicsSection';
import { FaqSection } from '../components/FAQSection';
import { CTASection } from '../components/CTASection';

export const Home: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <Hero />
      <FeaturesGrid />
      <AboutSection />
      <HowToJoinSection />
      <DiscoverProducts />
      <Testimonials />
      <TopicsSection />
      <FaqSection />
      <CTASection />
    </div>
  );
};