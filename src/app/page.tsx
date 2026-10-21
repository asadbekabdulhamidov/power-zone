'use client';

import React from 'react';
import { LandingNavbar } from '@/components/landing/navbar';
import { LandingHero } from '@/components/landing/hero';
import { LandingAbout } from '@/components/landing/about';
import { LandingGallery } from '@/components/landing/gallery';
import { LandingPricing } from '@/components/landing/pricing';
import { LandingProductsShowcase } from '@/components/landing/products-showcase';
import { LandingLocationContact } from '@/components/landing/location-contact';
import { LandingFooter } from '@/components/landing/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-lime-500 selection:text-zinc-950">
      {/* Sticky Navigation */}
      <LandingNavbar />

      {/* Main Sections */}
      <main className="flex-1">
        <LandingHero />
        <LandingAbout />
        <LandingGallery />
        <LandingPricing />
        <LandingProductsShowcase />
        <LandingLocationContact />
      </main>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
