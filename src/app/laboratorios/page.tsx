import type { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { laboratorios } from '@/lib/institutional-data';
import { FlaskConical, Award, Globe, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Laboratórios Parceiros',
  description: 'Conheça as marcas e laboratórios parceiros da Timevision Ótica responsáveis pela fabricação das lentes de alta definição.',
};

export default function LaboratoriosPage() {
  return (
    <div className="container py-12 md:py-20 mx-auto px-4 max-w-screen-xl">
      <header className="text-center mb-16">
        <FlaskConical className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Laboratórios Parceiros</h1>
        <p className="text-muted-foreground mt-2 text-lg max-w-3xl mx-auto">
          Trabalhamos em estreita parceria com os laboratórios ópticos mais renomados do Brasil e do mundo para garantir precisão e tecnologia na fabricação de suas lentes.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {laboratorios.map((lab) => {
          const isGlobal = lab.origin.includes('Global');
          return (
            <Card key={lab.id} className="bg-card border-border/60 hover:border-primary/50 transition-colors shadow-md flex flex-col h-full overflow-hidden group">
              <CardHeader className="pt-6 pb-4">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-2xl font-bold">{lab.name}</CardTitle>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 uppercase ${isGlobal ? 'bg-primary/20 text-primary' : 'bg-slate-700 text-slate-200'}`}>
                    {isGlobal ? <Globe className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
                    {lab.origin}
                  </span>
                </div>
                <CardDescription className="text-xs text-primary font-semibold flex items-center gap-1.5 mt-1">
                  <Award className="h-3.5 w-3.5" /> Lente Certificada & Garantida
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow pb-6">
                <p className="text-sm text-muted-foreground text-justify leading-relaxed">
                  {lab.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
