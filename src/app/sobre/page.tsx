import { Eye, Target, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: 'Saiba mais sobre a história e os valores da Timevision Ótica, pioneira em exames e óculos sob medida em empresas e comunidades.',
};

export default function SobrePage() {
  return (
    <div className="container py-12 md:py-20 mx-auto px-4 max-w-screen-xl">
      <header className="text-center mb-16">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Sobre a Timevision Ótica</h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-3xl mx-auto">Levar saúde visual de alta qualidade com conveniência e preços justos diretamente onde você está.</p>
      </header>

      <div className="max-w-4xl mx-auto space-y-12">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-headline text-3xl font-semibold text-primary mb-4 flex items-center gap-3"><Eye />Nossa Essência</h2>
            <p className="text-muted-foreground leading-relaxed text-justify">
              A Timevision Ótica nasceu de um desejo de revolucionar o acesso a óculos de qualidade e cuidados com a visão. Percebendo a rotina agitada das pessoas, criamos um modelo de negócio itinerante inovador: sem o custo de lojas físicas fixas tradicionais, levamos consultórios móveis completos e uma vitrine rica de armações diretamente a corporações, igrejas e associações comunitárias. Isso nos permite oferecer produtos de marcas renomadas e lentes fabricadas nos melhores laboratórios com preços de fábrica.
            </p>
          </div>
          <div className="relative h-64 bg-slate-900 rounded-lg overflow-hidden shadow-lg border border-border/20">
            <Image
              src="https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=600"
              alt="Óculos modernos"
              fill
              className="object-cover opacity-80"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="relative h-64 bg-slate-900 rounded-lg overflow-hidden shadow-lg border border-border/20 md:order-1">
            <Image
              src="https://images.unsplash.com/photo-1508296695146-257a814070b4?auto=format&fit=crop&q=80&w=600"
              alt="Atendimento óptico"
              fill
              className="object-cover opacity-80"
            />
          </div>
          <div className="md:order-2">
            <h2 className="font-headline text-3xl font-semibold text-primary mb-4 flex items-center gap-3"><Target />Nossa Missão</h2>
            <p className="text-muted-foreground leading-relaxed text-justify">
              Nossa missão é democratizar a saúde visual, assegurando que trabalhadores e membros de comunidades recebam exames de vista com optometristas certificados sem precisar se deslocar. Promovemos exames preventivos de acuidade visual gratuitos nas entidades parceiras, prevenindo problemas decorrentes de fadiga ocular digital e garantindo que todos enxerguem o mundo com total clareza e conforto.
            </p>
          </div>
        </div>

         <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="font-headline text-3xl font-semibold text-primary mb-4 flex items-center gap-3"><Users />Modelo B2B Inteligente</h2>
            <p className="text-muted-foreground leading-relaxed text-justify">
              Nosso foco está nas parcerias com o setor de Recursos Humanos de empresas e lideranças sociais/eclesiásticas. Ao agendar uma Ação de Saúde Visual, nós cuidamos de toda a logística e disponibilizamos condições facilitadas de pagamento e descontos em folha ou subsídios, tornando a aquisição dos óculos extremamente simples e acessível para todos os envolvidos.
            </p>
          </div>
          <div className="relative h-64 bg-slate-900 rounded-lg overflow-hidden shadow-lg border border-border/20">
            <Image
              src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=600"
              alt="Armações premium"
              fill
              className="object-cover opacity-80"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
