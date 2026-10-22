'use client';

import React from 'react';
import { ArrowRight, CheckCircle2, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFitnesFlow } from '@/context/fitnes-context';

export function LandingHero() {
  const { websiteContent } = useFitnesFlow();
  const { hero, stats } = websiteContent;

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden bg-[#090d16]">
      {/* Background Photography with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero.backgroundImage || '/images/hero/hero-bg.webp'}
          alt="Power Zone zamonaviy fitnes zali"
          className="w-full h-full object-cover object-center brightness-[0.4] contrast-[1.05] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#090d16] via-[#090d16]/85 sm:via-[#090d16]/70 to-[#090d16]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090d16] via-transparent to-[#090d16]/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-lime-500/10 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          {hero.badge && (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-lime-500/15 border border-lime-500/30 text-lime-400 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md">
              <Flame className="w-3.5 h-3.5 text-lime-400 shrink-0" />
              <span>{hero.badge}</span>
            </div>
          )}

          {/* Main Uzbek Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase leading-[1.08]">
            {hero.title.includes('Kuchli') ? (
              <>
                {hero.title.split('Kuchli')[0]}
                <span className="text-lime-400">Kuchli</span>
                {hero.title.split('Kuchli')[1]}
              </>
            ) : (
              hero.title
            )}
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg text-zinc-300 leading-relaxed font-normal max-w-2xl">
            {hero.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <a href="#tariflar">
              <Button
                variant="lime"
                size="lg"
                className="w-full sm:w-auto text-base shadow-xl shadow-lime-500/25 py-3.5 px-8"
              >
                <span>A’zolikni boshlash</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>

            <a href="#haqimizda">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-base border-zinc-700 hover:border-zinc-500 py-3.5 px-8"
              >
                <span>Zal bilan tanishish</span>
              </Button>
            </a>
          </div>

          {/* Bullet highlights */}
          {hero.bullets && hero.bullets.length > 0 && (
            <div className="mt-8 pt-8 border-t border-zinc-800/80 flex flex-wrap gap-6 text-xs text-zinc-300 font-medium">
              {hero.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
                  <span>{bullet}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Stats Grid Under Hero */}
        {stats && stats.length > 0 && (
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-[#111827]/70 border border-zinc-800/80 backdrop-blur-xl">
            {stats.map((stat, idx) => (
              <div
                key={stat.id || idx}
                className={`p-4 text-center sm:text-left ${
                  idx > 0 ? 'sm:border-l border-zinc-800' : ''
                } ${idx >= 2 ? 'border-t sm:border-t-0 border-zinc-800' : ''}`}
              >
                <div
                  className={`text-3xl sm:text-4xl font-black tracking-tight ${
                    idx === stats.length - 1 ? 'text-lime-400' : 'text-white'
                  }`}
                >
                  {stat.value}
                </div>
                <p className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
