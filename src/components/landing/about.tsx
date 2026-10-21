'use client';

import React from 'react';
import { Dumbbell, ShieldCheck, HeartPulse, Sparkles, Wind, Users } from 'lucide-react';

export function LandingAbout() {
  const features = [
    {
      icon: Dumbbell,
      title: 'Eng So‘nggi Trenajyorlar',
      desc: 'Italiya va Germaniya ishlab chiqaruvchilarining zamonaviy biomexanik uskunalar to‘plami (Technogym, Hammer Strength).',
    },
    {
      icon: Users,
      title: 'Professional Murabbiylar',
      desc: 'Har bir a’zoga individual yondashuv, tana tahlili va shaxsiy mashg‘ulot dasturi ishlab chiquvchi sertifikatlangan instruktorlar.',
    },
    {
      icon: HeartPulse,
      title: 'Kardio va Krossfit Zonalari',
      desc: 'Yurak-qon tomir tizimini mustahkamlovchi yugurish yo‘lakchalari, velotrenajyorlar va funksional mashg‘ulot zonalari.',
    },
    {
      icon: Wind,
      title: 'Mikroiqlim va Toza Havo',
      desc: 'Zal ichida harorat va kislorod miqdorini barqaror ushlab turuvchi 4 bosqichli HEPA ventilyatsiya va sovutish tizimi.',
    },
    {
      icon: Sparkles,
      title: 'Sauna va Qulay Kiyinish Xonalari',
      desc: 'Mashg‘ulotdan so‘ng mushaklarni dam oldirish uchun fin saunasi, keng shaxsiy shkafchalar va zamonaviy dush kabinalari.',
    },
    {
      icon: ShieldCheck,
      title: 'Shaffof Boshqaruv va Qulaylik',
      desc: 'Abonementingiz, tashriflaringiz va to‘lovlaringiz Power Zone raqamli tizimida 100% aniq va shaffof qayd etiladi.',
    },
  ];

  return (
    <section id="haqimizda" className="py-24 bg-[#0d131f] border-t border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-500/10 border border-lime-500/25 text-lime-400 text-xs font-bold uppercase tracking-wider mb-3">
            Klub Haqida
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Natijaga Intiluvchilar Uchun Mukammal Makon
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-400 leading-relaxed">
            Biz shunchaki sport zali emasmiz. Power Zone — bu sog‘lom turmush tarzi, yuqori kayfiyat va o‘z maqsadlariga erishayotgan hamfikrlar hamjamiyati.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-7 rounded-2xl bg-[#111827]/70 border border-zinc-800/80 hover:border-lime-500/40 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-xl bg-lime-500/10 border border-lime-500/20 text-lime-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(132,204,22,0.15)]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-lime-300 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Highlight Image Banner */}
        <div className="mt-14 relative rounded-3xl overflow-hidden border border-zinc-800">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 sm:p-12 flex flex-col justify-center bg-gradient-to-br from-zinc-900 to-[#101726]">
              <span className="text-xs font-bold uppercase tracking-wider text-lime-400 mb-2">
                Individual Yondashuv
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-4">
                Birinchi Mashg‘ulotda Murabbiy Maslahati Mutlaqo Bepul
              </h3>
              <p className="text-zinc-300 text-sm leading-relaxed mb-6">
                Yangi boshlayotgan bo‘lsangiz, tajribali murabbiyimiz trenajyorlardan to‘g‘ri foydalanishni tushuntiradi, jismoniy holatingizni baholaydi va maqsadlaringizga mos mashqlar rejasini tuzishda ko‘maklashadi.
              </p>
              <div>
                <a
                  href="#tariflar"
                  className="inline-flex items-center gap-2 text-sm font-bold text-lime-400 hover:text-lime-300 hover:underline"
                >
                  <span>Tariflar bilan tanishing va a’zo bo‘ling</span>
                  <span>→</span>
                </a>
              </div>
            </div>

            <div className="relative min-h-[300px] lg:min-h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000&q=80"
                alt="Power Zone mashg'ulot maydoni"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
