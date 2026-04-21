"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png"
              alt="SESAF Barber"
              width={200}
              height={70}
              className="group-hover:scale-105 transition-transform"
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/#services" className="text-zinc-400 hover:text-amber-400 transition-colors text-sm font-medium">
              Services
            </Link>
            <Link href="/#tarifs" className="text-zinc-400 hover:text-amber-400 transition-colors text-sm font-medium">
              Tarifs
            </Link>
            <Link href="/galerie" className="text-zinc-400 hover:text-amber-400 transition-colors text-sm font-medium">
              Galerie
            </Link>
            <Link href="/#about" className="text-zinc-400 hover:text-amber-400 transition-colors text-sm font-medium">
              À propos
            </Link>
            <Link href="/booking">
              <Button size="sm">Réserver maintenant</Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-zinc-400 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-3">
            <Link href="/#services" onClick={() => setIsOpen(false)} className="block text-zinc-400 hover:text-amber-400 transition-colors text-sm font-medium py-2">
              Services
            </Link>
            <Link href="/#tarifs" onClick={() => setIsOpen(false)} className="block text-zinc-400 hover:text-amber-400 transition-colors text-sm font-medium py-2">
              Tarifs
            </Link>
            <Link href="/galerie" onClick={() => setIsOpen(false)} className="block text-zinc-400 hover:text-amber-400 transition-colors text-sm font-medium py-2">
              Galerie
            </Link>
            <Link href="/#about" onClick={() => setIsOpen(false)} className="block text-zinc-400 hover:text-amber-400 transition-colors text-sm font-medium py-2">
              À propos
            </Link>
            <Link href="/booking" onClick={() => setIsOpen(false)}>
              <Button className="w-full mt-2">Réserver maintenant</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
