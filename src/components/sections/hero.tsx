"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-brand-graphite">
      {/* Background Campaign Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=1920"
          alt="Timevision Ótica Editorial de Luxo"
          fill
          className="object-cover object-center grayscale brightness-50 contrast-125"
          priority
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-graphite/40 via-brand-graphite/20 to-brand-graphite/90" />
        
        {/* Subtle Brand Pattern Watermark Over Background */}
        <div className="absolute inset-0 bg-[url('/pattern/BASE_PADRÃO.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl px-6 text-center">
        {/* Superlabel (Lora font) */}
        <span className="inline-block font-body text-[10px] md:text-xs font-semibold tracking-[0.15em] text-brand-gold uppercase mb-6 bg-brand-graphite/50 backdrop-blur-sm border border-brand-gold/25 px-4 py-2 rounded-full">
          Boutique Óptica Atemporal · Recreio dos Bandeirantes, RJ
        </span>

        {/* H1 Title (Soligant display font) */}
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-brand-off-white leading-[1.05] tracking-tight mb-8 drop-shadow-2xl">
          A Elegância que sua
          <br />
          <span className="text-brand-gold italic">Visão Merece</span>
        </h1>

        {/* Subheading (Lora font) */}
        <p className="font-body text-base md:text-xl text-brand-off-white/80 max-w-3xl mx-auto mb-12 leading-relaxed">
          Curadoria exclusiva de armações internacionais de grife, lentes de altíssima precisão e
          atendimento personalizado com a exclusividade e conveniência que você busca.
        </p>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            asChild
            size="lg" 
            className="bg-brand-gold hover:bg-brand-gold/90 text-brand-graphite font-body font-bold text-sm tracking-wider uppercase px-8 py-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg shadow-brand-gold/20"
          >
            <Link href="https://wa.me/5521999999999?text=Ol%C3%A1!%20Gostaria%20de%20solicitar%20um%20or%C3%A7amento%20VIP." target="_blank">
              Solicitar Orçamento VIP
            </Link>
          </Button>
          <Button 
            asChild
            variant="outline" 
            size="lg" 
            className="border-brand-gold text-brand-gold hover:bg-brand-gold/10 font-body font-bold text-sm tracking-wider uppercase px-8 py-6 rounded-full transition-all duration-300"
          >
            <Link href="#vitrine">
              Conheça as Coleções
            </Link>
          </Button>
        </div>
      </div>

      {/* Monogram Brand Watermark in bottom-right corner */}
      <div className="absolute bottom-8 right-8 z-10 hidden md:block opacity-10">
        <img src="/logos/icone/1.svg" className="h-16 w-auto" alt="Timevision Monogram" />
      </div>
    </section>
  );
}

