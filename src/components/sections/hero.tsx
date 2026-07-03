"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative h-[75vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.webp"
          alt="TimeVision Otimização de Processos"
          fill
          className="object-cover object-top scale-x-110"
          priority
          quality={80}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/80" />
      </div>

      <div className="relative z-10 max-w-6xl px-6 text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 drop-shadow-lg">
          Otimização Inteligente para 
          <br />
          <span className="text-[#04d9ff]">Óticas e Laboratórios</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto mb-10 drop-shadow-md">
          Aceleramos a gestão do seu negócio com tecnologia de ponta.
          Automatize processos, reduza erros e aumente sua lucratividade.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="outline" 
            size="lg" 
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm hover:border-[#04d9ff] transition-all"
            onClick={() => document.getElementById('solucoes')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Nossas Soluções
          </Button>
          <Button 
            size="lg" 
            className="bg-[#04d9ff] hover:bg-[#00b8d4] text-black font-bold shadow-lg hover:shadow-cyan-500/50 transition-all"
            onClick={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Agendar Demonstração
          </Button>
        </div>
      </div>
    </section>
  );
}
