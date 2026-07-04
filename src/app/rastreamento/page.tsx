'use client';

import { useState } from "react";
import { getItems, Venda } from "@/lib/firebase";
import { Search, AlertCircle, Check, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const GOLD = "#B5996A";
const GRAPHITE = "#3D3D3D";
const WINE = "#900D13";
const PETROL = "#004168";
const OFF_WHITE = "#F9F7F8";
const GRAY = "#585858";

const FONT_DISPLAY = "var(--font-soligant)";
const FONT_BODY = "var(--font-lora)";
const FONT_LABEL = "var(--font-identification-05c)";

export default function RastreamentoPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Venda | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!query.trim()) {
      toast({
        variant: "destructive",
        title: "Campo Vazio",
        description: "Digite o CPF ou número do pedido para buscar.",
      });
      return;
    }

    setLoading(true);
    setSearched(true);
    setOrder(null);

    try {
      const sales = await getItems<Venda>("vendas");
      const cleanQuery = query.trim().toUpperCase().replace(/[.-]/g, "");

      const found = sales.find((s) => {
        if (s.status === 'orcamento') return false;
        const cleanCpf = s.clienteCpf.replace(/[.-]/g, "");
        return (
          s.id.toUpperCase() === cleanQuery || 
          cleanCpf === cleanQuery || 
          s.id.toUpperCase() === `TV-${cleanQuery}`
        );
      });

      if (found) {
        setOrder(found);
      } else {
        toast({
          variant: "destructive",
          title: "Pedido não encontrado",
          description: "Confira o número da O.S. ou o CPF digitado.",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar pedido:", error);
      toast({
        variant: "destructive",
        title: "Erro de Conexão",
        description: "Ocorreu um erro ao conectar ao banco de dados.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mapeamento dos passos do status
  const statusSteps = [
    { key: "recebido", label: "Pedido Recebido" },
    { key: "laboratorio", label: "No Laboratório" },
    { key: "montagem", label: "Em Montagem" },
    { key: "pronto", label: "Pronto para Entrega" },
    { key: "entregue", label: "Entregue" },
  ];

  const getStepStatus = (stepKey: string) => {
    if (!order) return false;
    const orderIndex = statusSteps.findIndex((s) => s.key === order.status);
    const stepIndex = statusSteps.findIndex((s) => s.key === stepKey);
    return stepIndex <= orderIndex;
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "recebido": return "Recebido";
      case "laboratorio": return "No Laboratório";
      case "montagem": return "Em Montagem";
      case "pronto": return "Pronto";
      case "entregue": return "Entregue";
      default: return "Em processamento";
    }
  };

  // Separa armação e lentes dos produtos salvos
  const armacao = order?.produtos.find(p => p.nome.toLowerCase().includes("armação") || p.nome.toLowerCase().includes("classic") || p.nome.toLowerCase().includes("elegance"))?.nome || "Curadoria Timevision";
  const lente = order?.produtos.find(p => p.nome.toLowerCase().includes("lente") || p.nome.toLowerCase().includes("zeiss") || p.nome.toLowerCase().includes("crizal") || p.nome.toLowerCase().includes("hoya"))?.nome || "Lentes de Alta Precisão";

  return (
    <div className="pt-24 min-h-screen" style={{ background: OFF_WHITE }}>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs mb-4" style={{ background: PETROL, color: OFF_WHITE, fontFamily: FONT_LABEL, letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Rastreamento
          </span>
          <h1 className="mt-4 text-brand-graphite font-display text-4xl font-bold">Acompanhe seu Pedido</h1>
          <p className="mt-2 text-sm text-brand-gray-mid font-body">Consulte o status de confecção dos seus óculos em tempo real</p>
        </div>

        <div className="flex gap-2 mb-3">
          <input 
            type="text" 
            placeholder="CPF ou número da O.S. (ex: 1001)" 
            value={query} 
            onChange={e => setQuery(e.target.value)} 
            onKeyDown={e => e.key === "Enter" && handleSearch()} 
            className="flex-1 p-4 outline-none border" 
            style={{ fontFamily: FONT_BODY, borderColor: "rgba(61,61,61,0.2)", background: "#fff", color: GRAPHITE }} 
          />
          <button 
            onClick={handleSearch} 
            className="px-5 flex items-center justify-center transition-opacity hover:opacity-80" 
            style={{ background: GRAPHITE, color: OFF_WHITE, minWidth: "52px" }}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: `${GOLD}40`, borderTopColor: GOLD }} />
            ) : (
              <Search size={19} />
            )}
          </button>
        </div>
        <p className="text-[10px] text-center text-brand-gray-mid/60 mb-10 font-body italic">
          Busque pelo CPF cadastrado na compra ou pelo número da Ordem de Serviço.
        </p>

        {searched && !order && !loading && (
          <div className="text-center p-8 border bg-white" style={{ borderColor: "rgba(61,61,61,0.12)" }}>
            <AlertCircle size={30} color={WINE} className="mx-auto mb-3" />
            <p className="font-body text-brand-graphite">Nenhum pedido ativo encontrado para <strong>"{query}"</strong>.</p>
            <p className="mt-2 text-xs text-brand-gray-mid font-body">Verifique o número da O.S. ou entre em contato com nosso atendimento.</p>
          </div>
        )}

        {order && (
          <div className="flex flex-col gap-4">
            <div className="p-6 bg-white border" style={{ borderColor: "rgba(61,61,61,0.1)" }}>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[10px] mb-1 font-tagline text-brand-gold tracking-widest uppercase">OS-{order.id}</p>
                  <h2 className="font-display text-brand-graphite text-xl font-bold">{order.clienteNome}</h2>
                </div>
                <span className="inline-block px-3 py-1 text-xs" style={{ background: PETROL, color: OFF_WHITE, fontFamily: FONT_LABEL, letterSpacing: "0.22em", textTransform: "uppercase" }}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t text-sm" style={{ borderColor: "rgba(61,61,61,0.1)" }}>
                <div>
                  <p className="text-[10px] mb-1 uppercase font-tagline text-brand-gray-mid tracking-widest">Armação</p>
                  <p className="font-body text-brand-graphite text-xs">{armacao}</p>
                </div>
                <div>
                  <p className="text-[10px] mb-1 uppercase font-tagline text-brand-gray-mid tracking-widest">Lentes</p>
                  <p className="font-body text-brand-graphite text-xs">{lente}</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white border" style={{ borderColor: "rgba(61,61,61,0.1)" }}>
              <p className="mb-6 text-[10px] uppercase font-tagline text-brand-gold tracking-widest">Status de Confecção</p>
              {statusSteps.map((s, i) => {
                const done = getStepStatus(s.key);
                return (
                  <div key={s.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div 
                        className="w-8 h-8 flex items-center justify-center flex-shrink-0" 
                        style={{ 
                          background: done ? GOLD : "rgba(61,61,61,0.08)", 
                          border: `2px solid ${done ? GOLD : "rgba(61,61,61,0.18)"}` 
                        }}
                      >
                        {done ? (
                          <Check size={13} color={OFF_WHITE} />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-brand-gray-mid/30" />
                        )}
                      </div>
                      {i < statusSteps.length - 1 && (
                        <div 
                          className="w-px my-1" 
                          style={{ 
                            background: done ? `${GOLD}40` : "rgba(61,61,61,0.1)", 
                            minHeight: "28px", 
                            flex: 1 
                          }} 
                        />
                      )}
                    </div>
                    <div className="pb-5">
                      <p className="font-body text-sm leading-8" style={{ color: done ? GRAPHITE : "rgba(61,61,61,0.35)" }}>{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
