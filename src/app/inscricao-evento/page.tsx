import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, CalendarCheck, MapPin } from 'lucide-react';

export default function EventRegistrationPage() {
  // Em uma implementação real, os dados do evento podem vir do Firebase/CMS
  return (
    <div className="min-h-screen bg-[#111] text-brand-off-white flex flex-col font-body py-12 px-4">
      <div className="max-w-2xl mx-auto w-full space-y-8">
        
        {/* Header/Logo */}
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ background: "#B5996A" }}>
            <span className="font-display text-brand-graphite font-bold text-2xl">TV</span>
          </div>
          <div>
            <h1 className="text-3xl font-headline font-black uppercase text-white">Timevision Ótica</h1>
            <p className="text-brand-gold tracking-widest text-sm uppercase mt-1">Ação Promocional</p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-brand-gold" />
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold font-headline text-white">Inscreva-se no Evento</CardTitle>
            <CardDescription className="text-slate-400">
              Garanta seu horário de atendimento e descontos exclusivos.
            </CardDescription>
          </CardHeader>
          
          {/* Informações do Evento Padrão */}
          <div className="px-6 py-4 mx-6 mb-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col gap-3">
            <div className="flex items-center gap-3 text-slate-300">
              <CalendarCheck className="h-5 w-5 text-brand-gold" />
              <span className="text-sm font-semibold">Em breve (Data a definir)</span>
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="h-5 w-5 text-brand-gold" />
              <span className="text-sm font-semibold">Local do Evento</span>
            </div>
          </div>

          <CardContent>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              alert('Inscrição simulada com sucesso! No futuro será salva no Firebase.');
            }}>
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Nome Completo</label>
                <input
                  type="text"
                  required
                  placeholder="Seu nome"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="(00) 00000-0000"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">E-mail</label>
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Gostaria de agendar exame de vista?</label>
                <select className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-brand-gold transition-colors">
                  <option value="sim">Sim, preciso fazer o exame</option>
                  <option value="nao">Não, já tenho minha receita</option>
                </select>
              </div>

              <Button type="submit" className="w-full bg-brand-gold text-brand-graphite hover:bg-brand-gold/90 font-bold py-6 mt-4 text-lg uppercase tracking-wider">
                <Sparkles className="mr-2 h-5 w-5" /> Confirmar Inscrição
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
