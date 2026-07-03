'use client';

import { useState } from 'react';
import type { Metadata } from 'next';
import { getItems, Venda } from '@/lib/firebase';
import { Search, Eye, ShoppingBag, Clock, FileText, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function RastreamentoPage() {
  const [query, setQuery] = useState('');
  const [order, setOrder] = useState<Venda | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        variant: 'destructive',
        title: 'Campo Vazio',
        description: 'Digite o CPF do titular ou o número do pedido.',
      });
      return;
    }

    setLoading(true);
    setSearched(true);
    setOrder(null);

    try {
      const sales = await getItems<Venda>('vendas');
      const cleanQuery = query.trim().toUpperCase().replace(/[.-]/g, ''); // Limpa pontos/traços do CPF

      const found = sales.find((s) => {
        const cleanCpf = s.clienteCpf.replace(/[.-]/g, '');
        return s.id.toUpperCase() === cleanQuery || cleanCpf === cleanQuery || s.id.toUpperCase() === `TV-${cleanQuery}`;
      });

      if (found) {
        setOrder(found);
      } else {
        toast({
          variant: 'destructive',
          title: 'Pedido Não Encontrado',
          description: 'Não encontramos nenhuma ordem ativa com os dados fornecidos.',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'Erro ao Buscar',
        description: 'Ocorreu um erro ao pesquisar seu pedido. Tente novamente.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Helper mapping order status to step indexes
  const statusSteps = [
    { key: 'recebido', label: 'Pedido Recebido', desc: 'Sua ordem foi registrada no sistema.' },
    { key: 'laboratorio', label: 'No Laboratório', desc: 'Suas lentes estão sendo confeccionadas.' },
    { key: 'montagem', label: 'Em Montagem', desc: 'As lentes estão sendo ajustadas à armação.' },
    { key: 'pronto', label: 'Pronto para Entrega', desc: 'Seus óculos estão prontos para envio ou retirada!' },
    { key: 'entregue', label: 'Entregue', desc: 'Pedido finalizado e entregue com sucesso!' },
  ];

  const getCurrentStepIndex = (status: string) => {
    return statusSteps.findIndex((step) => step.key === status);
  };

  const currentStepIndex = order ? getCurrentStepIndex(order.status) : 0;

  return (
    <div className="container py-12 md:py-20 mx-auto px-4 max-w-4xl">
      <header className="text-center mb-12">
        <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Acompanhe Seu Pedido</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Digite o número do seu pedido (Ex: TV-1001) ou CPF para verificar o status de confecção dos seus óculos.
        </p>
      </header>

      <Card className="bg-card border-border/60 shadow-lg mb-8 max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Ex: TV-1001 ou 000.000.000-00"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 h-12 bg-background border-border/40 focus-visible:ring-primary text-base"
              />
            </div>
            <Button type="submit" disabled={loading} className="h-12 bg-primary text-primary-foreground hover:bg-primary/90 px-8 text-base rounded-xl">
              {loading ? 'Buscando...' : 'Pesquisar'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {searched && order && (
        <div className="space-y-8 animate-fade-in">
          {/* Tracking Stepper */}
          <Card className="bg-card border-border/60 shadow-md">
            <CardHeader className="border-b border-border/20 pb-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div>
                  <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-primary" /> Pedido #{order.id}
                  </CardTitle>
                  <CardDescription>Registrado em {new Date(order.dataVenda).toLocaleDateString('pt-BR')}</CardDescription>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted-foreground block">Cliente</span>
                  <span className="font-semibold text-foreground">{order.clienteNome}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-8">
              {/* Vertical steps on mobile, horizontal on desktop */}
              <div className="relative flex flex-col md:flex-row justify-between gap-6 md:gap-2">
                {/* Horizontal line for desktop stepper */}
                <div className="absolute top-[18px] left-6 right-6 h-[3px] bg-slate-800 hidden md:block z-0" />
                
                {statusSteps.map((step, idx) => {
                  const isDone = idx <= currentStepIndex;
                  const isActive = idx === currentStepIndex;
                  return (
                    <div key={step.key} className="flex md:flex-col items-start md:items-center text-left md:text-center md:flex-1 relative z-10 gap-4 md:gap-2">
                      <div className={`h-9 w-9 rounded-full flex items-center justify-center font-bold text-sm border-2 ${
                        isDone 
                          ? 'bg-primary border-primary text-primary-foreground' 
                          : 'bg-background border-slate-700 text-muted-foreground'
                      } ${isActive ? 'ring-4 ring-primary/25' : ''}`}>
                        {isDone ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${isDone ? 'text-primary' : 'text-muted-foreground'}`}>{step.label}</h4>
                        <p className="text-[11px] text-muted-foreground max-w-[150px] leading-tight mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Eye Prescription and Order Items */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card border-border/60 shadow-md">
              <CardHeader className="pb-3 border-b border-border/20">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Eye className="h-5 w-5 text-primary" /> Receita Visual Associada
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-800 text-muted-foreground">
                        <th className="py-2">Olho</th>
                        <th className="py-2">Esférico</th>
                        <th className="py-2">Cilíndrico</th>
                        <th className="py-2">Eixo</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-800/50">
                        <td className="py-2 font-bold text-primary">OD (Direito)</td>
                        <td className="py-2">{order.receita.esfericoOD || 'Plano'}</td>
                        <td className="py-2">{order.receita.cilindricoOD || '0.00'}</td>
                        <td className="py-2">{order.receita.eixoOD ? `${order.receita.eixoOD}°` : '-'}</td>
                      </tr>
                      <tr className="border-b border-slate-800/50">
                        <td className="py-2 font-bold text-primary">OE (Esquerdo)</td>
                        <td className="py-2">{order.receita.esfericoOE || 'Plano'}</td>
                        <td className="py-2">{order.receita.cilindricoOE || '0.00'}</td>
                        <td className="py-2">{order.receita.eixoOE ? `${order.receita.eixoOE}°` : '-'}</td>
                      </tr>
                      {order.receita.adicao && (
                        <tr>
                          <td className="py-2 font-bold text-primary">Adição</td>
                          <td colSpan={3} className="py-2 font-semibold">{order.receita.adicao}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border/60 shadow-md">
              <CardHeader className="pb-3 border-b border-border/20">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" /> Detalhes dos Produtos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  {order.produtos.map((p) => (
                    <div key={p.id} className="flex justify-between items-center text-sm border-b border-slate-800/40 pb-2">
                      <div>
                        <span className="font-semibold text-foreground">{p.nome}</span>
                        <span className="text-xs text-muted-foreground block">Qtd: {p.quantidade}</span>
                      </div>
                      <span className="font-bold text-foreground">R$ {(p.precoVenda * p.quantidade).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 font-bold text-base text-primary">
                    <span>Valor Total do Pedido</span>
                    <span>R$ {order.valorTotal.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {searched && !order && !loading && (
        <Card className="bg-card border-border/60 shadow-md p-8 text-center max-w-md mx-auto">
          <CardContent className="pt-6">
            <h3 className="text-lg font-bold mb-2">Sem Resultados</h3>
            <p className="text-sm text-muted-foreground">
              Por favor, confira o número do pedido ou CPF e digite novamente. Caso tenha feito a compra recentemente, pode levar algumas horas para constar no sistema.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
