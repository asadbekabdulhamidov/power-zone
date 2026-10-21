'use client';

import React, { useState } from 'react';
import { Check, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFitnesFlow } from '@/context/fitnes-context';
import { MembershipPlan } from '@/types';
import { formatUZS } from '@/lib/utils';
import { JoinModal } from '@/components/landing/join-modal';

export function LandingPricing() {
  const { plans } = useFitnesFlow();
  const [selectedPlanForJoin, setSelectedPlanForJoin] = useState<MembershipPlan | null>(null);

  // Active plans only
  const activePlans = plans.filter((p) => p.status === 'active');

  return (
    <section id="tariflar" className="py-24 bg-[#0d131f] border-t border-zinc-800/80 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-lime-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/25 text-lime-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>A’zolik Shartlari</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
            Sizga Mos Keluvchi Qulay <span className="text-lime-400">Tariflar</span>
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Hech qanday yashirin to‘lovlarsiz shaffof narxlar. O‘z ritmingizga mos rejani tanlang va sog‘lom turmush tarziga bugunoq qadam qo‘ying.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {activePlans.map((plan) => {
            const isPopular = plan.popular;

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-gradient-to-b from-[#141e2e] to-[#0f1726] border-2 border-lime-500 shadow-2xl shadow-lime-500/15 md:-translate-y-2'
                    : 'bg-[#111827]/75 border border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-lime-500 text-zinc-950 font-black text-xs uppercase tracking-wider px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      Eng Ommabop Tanlov
                    </span>
                  </div>
                )}

                <div>
                  {/* Title & Tag */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1 min-h-[34px]">
                      {plan.description}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="my-6 pb-6 border-b border-zinc-800/80">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl font-black text-lime-400 tracking-tight">
                        {formatUZS(plan.price)}
                      </span>
                    </div>
                    <span className="text-xs text-zinc-400 font-medium block mt-1">
                      {plan.durationDays === 1
                        ? '1 ta mashg‘ulot uchun'
                        : `${plan.durationDays} kunlik a’zolik`}
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 mb-8">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                      Tarif imkoniyatlari:
                    </p>
                    <ul className="space-y-2.5">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs text-zinc-300 leading-snug"
                        >
                          <div className="w-4 h-4 rounded-full bg-lime-500/15 text-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  variant={isPopular ? 'lime' : 'outline'}
                  size="lg"
                  onClick={() => setSelectedPlanForJoin(plan)}
                  className="w-full text-sm font-bold tracking-wide"
                >
                  <span>Tanlash va A’zo Bo‘lish</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            );
          })}
        </div>

        {/* Membership Rules Callout Card */}
        <div className="mt-12 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-zinc-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-lime-500/10 text-lime-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">
                Qat’iy jadvallarsiz moslashuvchan rejim
              </p>
              <p className="text-zinc-400 mt-0.5">
                &ldquo;Haftasiga 3 kun&rdquo; tarifida o‘zingizga qulay kunlarni erkin tanlaysiz. Hech qanday majburiy kunlar yo‘q.
              </p>
            </div>
          </div>
          <a
            href="#manzil"
            className="text-lime-400 font-bold hover:underline shrink-0 text-right sm:text-left"
          >
            Klubga tashrif buyurish →
          </a>
        </div>
      </div>

      {/* Join Trial / Membership Modal */}
      {selectedPlanForJoin && (
        <JoinModal
          isOpen={!!selectedPlanForJoin}
          onClose={() => setSelectedPlanForJoin(null)}
          plan={selectedPlanForJoin}
        />
      )}
    </section>
  );
}
