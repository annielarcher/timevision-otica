'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, ShieldCheck, HeartPulse, Sparkles, MessageCircle, Calendar, Star, ChevronDown, ChevronUp, ArrowRight, CheckCircle2 } from 'lucide-react';

import { especialistas, testimonials, marcasParceiras, catalogMock } from '@/lib/institutional-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export default function Home() {
  const [expandedTestimonial, setExpandedTestimonial] = useState<string | null>(null);

  const toggleTestimonial = (id: string) => {
    setExpandedTestimonial(expandedTestimonial === id ? null : id);
  };

  const handleWhatsAppContact = (productName: string, productId: string) => {
    const phone = '5521999999999'; // Substituir pelo número correto depois
    const text = encodeURIComponent(
      `Olá! Estava navegando no site da Timevision Ótica e tenho interesse na armação: ${productName} (Código: ${productId}). Como posso prosseguir com a compra?`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full min-h-[75vh] flex items-center text-white overflow-hidden bg-slate-950">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=1920"
            alt="Óculos premium Timevision"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
        
        <div className="container relative z-10 mx-auto px-4 py-20 flex flex-col items-center justify-center text-center max-w-4xl">
          <span className="text-primary font-semibold tracking-wider uppercase mb-3 animate-fade-in text-sm md:text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Uma Nova Visão Para Você
          </span>
          <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-none mb-6">
            Timevision Ótica
          </h1>
          <p className="text-muted-foreground text-lg md:text-2xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Atendimento óptico móvel personalizado direto em sua empresa ou igreja. Consultas de vista e óculos sob medida com o máximo conforto e preços justos.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base py-6 px-8 rounded-full shadow-lg shadow-primary/20 transform transition-transform hover:scale-105">
              <Link href="#vitrine">
                Conheça Nossa Vitrine
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground text-base py-6 px-8 rounded-full">
              <Link href="#b2b">
                Visitas Corporativas B2B
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Como Funciona / B2B Section */}
      <section id="b2b" className="py-16 md:py-24 bg-card border-y border-border/20">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="font-headline text-3xl md:text-5xl font-bold mb-4">Saúde Visual Onde Você Estiver</h2>
            <p className="text-muted-foreground text-lg md:text-xl">
              Atuamos sem loja física fixa para reduzir custos e repassar esses descontos aos clientes, com foco em ações coletivas planejadas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mb-12">
            <div className="p-6 rounded-2xl bg-background border border-border/60 hover:border-primary/50 transition-colors shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <Calendar className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Agendamento B2B</h3>
              <p className="text-muted-foreground text-justify">
                Agendamos com o RH da sua empresa ou com a liderança da sua igreja uma data especial para a nossa visita de saúde visual.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-border/60 hover:border-primary/50 transition-colors shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <Eye className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. Consulta no Local</h3>
              <p className="text-muted-foreground text-justify">
                Nossa equipe móvel e o optometrista responsável realizam a avaliação visual completa e indolor dos colaboradores ou membros.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-background border border-border/60 hover:border-primary/50 transition-colors shadow-sm">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-5">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Escolha & Entrega</h3>
              <p className="text-muted-foreground text-justify">
                Os atendidos escolhem as armações e lentes ideais no local com preços facilitados. Produzimos em laboratório parceiro e entregamos em mãos.
              </p>
            </div>
          </div>

          <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-6">
            <Link href="mailto:oticastimevision@gmail.com?subject=Solicitação de Visita B2B - Timevision Ótica">
              Agende uma Ação na sua Entidade <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Vitrine de Produtos */}
      <section id="vitrine" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider text-sm">Catálogo Virtual</span>
            <h2 className="font-headline text-3xl md:text-5xl font-bold mt-2">Destaques da Nossa Vitrine</h2>
            <p className="text-muted-foreground mt-2 text-lg">Escolha sua armação e solicite a confecção final com lentes pelo nosso WhatsApp.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {catalogMock.map((item) => (
              <Card key={item.id} className="bg-card border-border/60 shadow-md flex flex-col h-full transform-gpu transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/40 group overflow-hidden">
                <div className="relative h-64 bg-slate-900 flex items-center justify-center overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.nome}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-primary/95 text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
                    {item.tipo}
                  </div>
                </div>
                <CardHeader className="p-4 flex-grow">
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {item.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-bold uppercase bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <CardTitle className="text-lg font-bold line-clamp-1">{item.nome}</CardTitle>
                  <CardDescription className="text-sm line-clamp-3 mt-1.5 text-justify">
                    {item.descricao}
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-4 py-0 mb-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-muted-foreground">Preço Armação</span>
                    <span className="text-xl font-black text-primary">
                      R$ {item.preco.toFixed(2)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button
                    onClick={() => handleWhatsAppContact(item.nome, item.id)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-md gap-2"
                  >
                    <MessageCircle className="h-5 w-5 fill-white" />
                    Tenho Interesse
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Especialistas / Sócios Section */}
      <section id="especialistas" className="py-16 md:py-24 bg-card border-t border-border/20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-5xl font-bold">Nossos Especialistas</h2>
            <p className="text-muted-foreground mt-2 text-lg">Conheça os profissionais que guiam nosso padrão de saúde visual.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {especialistas.map((esp) => (
              <Card key={esp.id} className="bg-background border-border/60 shadow-md flex flex-col text-center items-center p-8 transform-gpu will-change-transform">
                <Avatar className="h-28 w-28 mx-auto border-4 border-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">{esp.nome.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle className="font-headline text-2xl pt-4">{esp.nome}</CardTitle>
                <CardDescription className="text-primary font-semibold text-sm mt-1">{esp.cargo}</CardDescription>
                <CardContent className="mt-4 flex-grow text-justify">
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {esp.bio}
                  </p>
                  <blockquote className="text-primary/95 italic border-l-2 border-primary/50 pl-4 text-sm mt-2 text-left font-serif">
                    "{esp.quote}"
                  </blockquote>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Marcas Parceiras Section */}
      <section id="marcas" className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-5xl font-bold">Principais Grifes de Armações</h2>
            <p className="text-muted-foreground mt-2 text-lg">Trabalhamos com marcas mundiais que são sinônimo de design, qualidade e conforto.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {marcasParceiras.map((marca) => (
              <Card key={marca.id} className="bg-card border-border/60 shadow-sm flex flex-col items-center p-6 text-center hover:border-primary/40 transition-colors">
                <CardTitle className="text-2xl font-bold text-primary">{marca.name}</CardTitle>
                <CardDescription className="font-semibold text-muted-foreground text-xs mt-1 uppercase tracking-wider">{marca.category}</CardDescription>
                <CardContent className="mt-4">
                  <p className="text-sm text-muted-foreground text-justify">
                    {marca.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-16 md:py-24 bg-card border-t border-border/20">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="font-headline text-3xl md:text-5xl font-bold">O Que Nossos Clientes Dizem</h2>
            <p className="text-muted-foreground mt-2 text-lg">Histórias de quem experimentou nosso atendimento itinerante.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {testimonials.map((testimonial) => {
              const isExpanded = expandedTestimonial === testimonial.id;
              const isLong = testimonial.quote.length > 150;

              return (
                <Card key={testimonial.id} className="bg-background border-border/60 shadow-md flex flex-col transform-gpu will-change-transform">
                  <CardHeader className="flex flex-row items-center gap-4 pb-4">
                    <Avatar className="h-12 w-12 border-2 border-primary">
                      <AvatarFallback className="bg-primary/20 text-primary text-lg font-bold">{testimonial.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base font-bold">{testimonial.name}</CardTitle>
                      <CardDescription className="text-primary font-semibold text-xs">{testimonial.title}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <blockquote className={cn(
                        "text-muted-foreground italic border-l-4 border-primary/50 pl-4 text-sm text-justify transition-all ease-in-out duration-500",
                        isLong && "overflow-hidden",
                        isLong && !isExpanded && "max-h-24 line-clamp-4",
                        isLong && isExpanded && "max-h-[999px]"
                      )}>
                      "{testimonial.quote}"
                    </blockquote>
                  </CardContent>
                  <CardFooter className="pt-4 flex justify-between items-center">
                    <div className="flex gap-1 text-primary">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <Star className="h-4 w-4 fill-primary text-primary" />
                    </div>
                    {isLong && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => toggleTestimonial(testimonial.id)}
                        className="text-primary hover:text-primary/90 p-0 text-xs"
                      >
                        {isExpanded ? 'Ler menos' : 'Ler mais'}
                        {isExpanded ? <ChevronUp className="ml-1 h-3.5 w-3.5" /> : <ChevronDown className="ml-1 h-3.5 w-3.5" /> }
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* B2B Call to Action */}
      <section className="py-20 md:py-28 bg-background border-t border-border/20 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <HeartPulse className="mx-auto h-14 w-14 text-primary mb-6 animate-pulse" />
          <h2 className="font-headline text-3xl md:text-5xl lg:text-6xl font-black mb-6">
            Parcerias B2B Saudáveis
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
            Ofereça exames de acuidade visual gratuitos aos seus colaboradores ou membros religiosos. Preços subsidiados e condições de pagamento exclusivas de fábrica.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 text-base py-6 px-10 rounded-full shadow-lg shadow-primary/30 transform transition-transform hover:scale-105">
              <Link href="mailto:oticastimevision@gmail.com?subject=Interesse em Ação Corporativa B2B">
                Fale Conosco
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full text-base px-10 py-6">
              <Link href="/rastreamento">
                Rastrear Meu Pedido
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
