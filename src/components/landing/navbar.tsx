'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Dumbbell, Menu, X, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Biz Haqimizda', href: '#haqimizda' },
    { name: 'Galereya', href: '#galereya' },
    { name: 'Tariflar', href: '#tariflar' },
    { name: 'Fitnes Bar', href: '#mahsulotlar' },
    { name: 'Aloqa & Manzil', href: '#aloqa' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#090d16]/85 backdrop-blur-md border-b border-zinc-800/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-lime-500/15 border border-lime-500/30 flex items-center justify-center text-lime-400 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(132,204,22,0.2)]">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white">
              POWER <span className="text-lime-400">ZONE</span>
            </span>
            <span className="block text-[9px] uppercase tracking-widest text-zinc-400 font-bold -mt-0.5">
              Quva • Akbarobod Markazi
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-zinc-300 hover:text-lime-400 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/admin"
            className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-zinc-800/60 flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-lime-400" />
            <span>Admin Panel</span>
          </Link>

          <a href="#tariflar">
            <Button variant="primary" size="sm" className="shadow-lg shadow-lime-500/20">
              <span>A’zo bo‘lish</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </a>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/admin"
            className="text-xs text-lime-400 p-2 rounded-lg bg-zinc-900 border border-zinc-800"
          >
            <Shield className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-zinc-300 hover:text-white rounded-lg hover:bg-zinc-800"
            aria-label="Menyuni ochish"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d131f] border-b border-zinc-800 px-6 py-6 space-y-4 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-zinc-200 hover:text-lime-400 transition-colors py-1"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-zinc-800/80 flex flex-col gap-3">
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 border border-zinc-700 text-sm font-semibold text-zinc-300"
            >
              <Shield className="w-4 h-4 text-lime-400" />
              <span>Admin Boshqaruv Tizimi</span>
            </Link>

            <a
              href="#tariflar"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full"
            >
              <Button variant="primary" className="w-full py-3">
                <span>A’zo bo‘lish</span>
              </Button>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
