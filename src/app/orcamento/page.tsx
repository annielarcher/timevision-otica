'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Check, ChevronRight, CheckCircle, Send, Plus } from "lucide-react";

const GOLD = "#B5996A";
const GRAPHITE = "#3D3D3D";
const WINE = "#900D13";
const OFF_WHITE = "#F9F7F8";
const GRAY = "#585858";

type RxData = { 
  od?: Record<string, string>; 
  oe?: Record<string, string>; 
  dnp?: string; 
  altura?: string; 
};

const products = [
  { id: 1, brand: "Ray-Ban", name: "Clubmaster RB3016", category: "Masculino", price: "R$ 1.290", img: "1511499767150-a48a237f0083" },
  { id: 2, brand: "Tom Ford", name: "FT5634-B Blue Block", category: "Feminino", price: "R$ 3.850", img: "1574258495973-f010dfbb5371" },
  { id: 3, brand: "Gucci", name: "GG0010S Titanium", category: "Solar", price: "R$ 4.200", img: "1508214751196-bcfd4ca60f91" },
  { id: 4, brand: "Prada", name: "PR 56ZS Minimal", category: "Feminino", price: "R$ 3.650", img: "1548036161-4b6c6f931c27" },
  { id: 5, brand: "Oakley", name: "Holbrook XL", category: "Solar", price: "R$ 890", img: "1511499767150-a48a237f0083" },
  { id: 6, brand: "Timevision", name: "Signature No. 3", category: "Titânio", price: "R$ 2.100", img: "1574258495973-f010dfbb5371" },
];

function PrescriptionGrid({ value, onChange }: { value: RxData; onChange: (v: RxData) => void }) {
  const fields = [
    { label: "Esférico", key: "esferico" }, 
    { label: "Cilíndrico", key: "cilindrico" }, 
    { label: "Eixo", key: "eixo" }, 
    { label: "Adição", key: "adicao" }
  ];
  const eyes: { label: string; key: "od" | "oe" }[] = [
    { label: "OD — Olho Direito", key: "od" }, 
    { label: "OE — Olho Esquerdo", key: "oe" }
  ];
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: GRAPHITE }}>
              <th className="p-3 text-left font-tagline text-brand-gold tracking-widest text-[10px] uppercase font-normal">Olho</th>
              {fields.map(f => (
                <th key={f.key} className="p-3 text-center font-tagline text-brand-off-white tracking-widest text-[10px] uppercase font-normal">{f.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {eyes.map(eye => (
              <tr key={eye.key} style={{ borderBottom: "1px solid rgba(61,61,61,0.1)" }}>
                <td className="p-3 whitespace-nowrap font-tagline text-brand-graphite text-xs tracking-wider uppercase font-medium">{eye.label}</td>
                {fields.map(f => (
                  <td key={f.key} className="p-2 text-center">
                    <input
                      type="text"
                      placeholder="—"
                      value={value?.[eye.key]?.[f.key] || ""}
                      onChange={e => onChange({ ...value, [eye.key]: { ...(value?.[eye.key] || {}), [f.key]: e.target.value } })}
                      className="w-full text-center p-2 text-sm outline-none transition-colors"
                      style={{ fontFamily: "var(--font-lora)", border: "1px solid rgba(61,61,61,0.18)", background: OFF_WHITE, color: GRAPHITE }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-4 mt-4">
        {[
          { label: "DNP (mm)", key: "dnp", placeholder: "Ex: 32/33" }, 
          { label: "Altura (mm)", key: "altura", placeholder: "Ex: 20/21" }
        ].map(f => (
          <div key={f.key} className="flex-1">
            <label className="block mb-1.5 text-xs font-tagline tracking-widest text-brand-graphite uppercase">{f.label}</label>
            <input
              type="text"
              placeholder={f.placeholder}
              value={(value as any)?.[f.key] || ""}
              onChange={e => onChange({ ...value, [f.key]: e.target.value })}
              className="w-full p-3 text-sm outline-none"
              style={{ fontFamily: "var(--font-lora)", border: "1px solid rgba(61,61,61,0.18)", background: OFF_WHITE, color: GRAPHITE }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function OrcamentoWizard() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [rx, setRx] = useState<RxData>({});
  const [frame, setFrame] = useState<typeof products[0] | null>(null);

  useEffect(() => {
    const frameId = searchParams.get("frame");
    if (frameId) {
      const selected = products.find(p => p.id === Number(frameId));
      if (selected) {
        setFrame(selected);
      }
    }
  }, [searchParams]);

  function buildWA() {
    const od = rx?.od || {};
    const oe = rx?.oe || {};
    return encodeURIComponent(
      `*Orçamento VIP — Timevision Ótica*\n\n` +
      `👤 *Cliente:* ${form.name}\n📧 ${form.email}\n📱 ${form.phone}\n\n` +
      `👓 *Receita:*\nOD: Esf ${od.esferico || "—"} | Cil ${od.cilindrico || "—"} | Eixo ${od.eixo || "—"} | Add ${od.adicao || "—"}\n` +
      `OE: Esf ${oe.esferico || "—"} | Cil ${oe.cilindrico || "—"} | Eixo ${oe.eixo || "—"} | Add ${oe.adicao || "—"}\n\n` +
      `🕶️ *Armação:* ${frame ? `${frame.brand} — ${frame.name} (${frame.price})` : "A definir"}`
    );
  }

  const steps = ["Seus Dados", "Receita Visual", "Armação", "Confirmação"];

  return (
    <div className="pt-24 min-h-screen bg-brand-off-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 text-xs mb-4" style={{ background: GOLD, color: OFF_WHITE, fontFamily: "var(--font-lora)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            Orçamento Exclusivo
          </span>
          <h1 className="mt-4 text-brand-graphite font-display text-4xl font-bold">Orçamento VIP</h1>
          <p className="mt-2 text-sm text-brand-gray-mid font-body">Atendimento personalizado em até 2 horas úteis</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center mb-5">
          {[1, 2, 3, 4].map((s, i) => (
            <div key={s} className="flex items-center">
              <div 
                className="w-8 h-8 flex items-center justify-center text-xs font-bold transition-all" 
                style={{ 
                  fontFamily: "var(--font-lora)", 
                  background: step >= s ? (step === s ? GRAPHITE : GOLD) : "transparent", 
                  color: step >= s ? OFF_WHITE : "rgba(61,61,61,0.3)", 
                  border: `1px solid ${step >= s ? (step === s ? GRAPHITE : GOLD) : "rgba(61,61,61,0.2)"}` 
                }}
              >
                {step > s ? <Check size={11} /> : s}
              </div>
              {i < 3 && <div className="w-12 h-px" style={{ background: step > s ? GOLD : "rgba(61,61,61,0.15)" }} />}
            </div>
          ))}
        </div>
        <div className="flex justify-between mb-10 px-1">
          {steps.map((label, i) => (
            <span 
              key={label} 
              className="text-[10px] uppercase text-center font-tagline tracking-wider" 
              style={{ color: step === i + 1 ? GRAPHITE : "rgba(61,61,61,0.35)", flex: 1 }}
            >
              {label}
            </span>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="mb-8 font-display text-brand-graphite text-2xl font-bold">Seus Dados</h2>
            <div className="flex flex-col gap-5">
              {[
                { label: "Nome Completo", key: "name", type: "text", ph: "Seu nome completo" }, 
                { label: "E-mail", key: "email", type: "email", ph: "seu@email.com" }, 
                { label: "Telefone / WhatsApp", key: "phone", type: "tel", ph: "(21) 99999-9999" }
              ].map(f => (
                <div key={f.key}>
                  <label className="block mb-2 text-xs font-tagline text-brand-graphite tracking-widest uppercase">{f.label}</label>
                  <input 
                    type={f.type} 
                    placeholder={f.ph} 
                    value={(form as any)[f.key]} 
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })} 
                    className="w-full p-4 outline-none transition-colors border" 
                    style={{ fontFamily: "var(--font-lora)", borderColor: "rgba(61,61,61,0.2)", background: "#fff", color: GRAPHITE }} 
                  />
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-end">
              <button 
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-8 py-3 text-xs tracking-widest uppercase text-brand-off-white bg-brand-gold font-tagline"
              >
                Próximo <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="mb-4 font-display text-brand-graphite text-2xl font-bold">Receita Visual</h2>
            <p className="mb-6 text-sm text-brand-gray-mid font-body leading-relaxed text-justify">Preencha os dados da sua receita. Se não tiver em mãos ou preferir fazer triagem no local, pode deixar em branco.</p>
            <div className="p-6 border bg-white" style={{ borderColor: "rgba(61,61,61,0.12)" }}>
              <PrescriptionGrid value={rx} onChange={setRx} />
            </div>
            <div className="mt-10 flex justify-between">
              <button 
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-8 py-3 text-xs tracking-widest uppercase text-brand-graphite border border-brand-graphite font-tagline"
              >
                Voltar
              </button>
              <button 
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-8 py-3 text-xs tracking-widest uppercase text-brand-off-white bg-brand-gold font-tagline"
              >
                Próximo <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="mb-4 font-display text-brand-graphite text-2xl font-bold">Escolha sua Armação</h2>
            <p className="mb-6 text-sm text-brand-gray-mid font-body">Selecione uma armação de interesse ou deixe em branco para recomendações personalizadas.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {products.map(p => (
                <div 
                  key={p.id} 
                  onClick={() => setFrame(frame?.id === p.id ? null : p)} 
                  className="flex gap-3 p-4 cursor-pointer transition-all border-2" 
                  style={{ 
                    borderColor: frame?.id === p.id ? GOLD : "rgba(61,61,61,0.12)", 
                    background: frame?.id === p.id ? `${GOLD}07` : "#fff" 
                  }}
                >
                  <div className="w-20 h-14 overflow-hidden flex-shrink-0 bg-zinc-100 relative">
                    <img 
                      src={`https://images.unsplash.com/photo-${p.img}?w=120&h=80&fit=crop&auto=format&q=60`} 
                      alt={p.name} 
                      className="w-full h-full object-cover grayscale" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] mb-0.5 font-tagline text-brand-gold tracking-widest uppercase">{p.brand}</p>
                    <p className="text-sm font-medium truncate font-body text-brand-graphite">{p.name}</p>
                    <p className="text-sm font-display text-brand-graphite font-bold">{p.price}</p>
                  </div>
                  {frame?.id === p.id && <Check size={16} color={GOLD} className="flex-shrink-0 self-center" />}
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-between">
              <button 
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-8 py-3 text-xs tracking-widest uppercase text-brand-graphite border border-brand-graphite font-tagline"
              >
                Voltar
              </button>
              <button 
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-8 py-3 text-xs tracking-widest uppercase text-brand-off-white bg-brand-gold font-tagline"
              >
                Próximo <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="text-center">
            <div className="w-16 h-16 flex items-center justify-center mx-auto mb-6 bg-brand-gold/15 border-2 border-brand-gold">
              <CheckCircle size={30} color={GOLD} />
            </div>
            <h2 className="mb-4 font-display text-brand-graphite text-3xl font-bold">Pronto, {form.name || "Cliente"}!</h2>
            <p className="mb-8 mx-auto text-brand-gray-mid font-body leading-relaxed max-w-md text-justify">Seu pedido de orçamento foi preparado. Clique abaixo para enviar as informações diretamente ao WhatsApp VIP da Timevision Ótica.</p>
            <div className="text-left p-6 mb-8 border bg-white" style={{ borderColor: "rgba(61,61,61,0.12)" }}>
              <p className="mb-3 text-xs uppercase font-tagline text-brand-gold tracking-widest">Resumo do Pedido</p>
              <div className="flex flex-col gap-1 text-sm font-body text-brand-graphite">
                <p><strong>Cliente:</strong> {form.name}</p>
                <p><strong>Telefone:</strong> {form.phone}</p>
                {frame && <p><strong>Armação:</strong> {frame.brand} — {frame.name}</p>}
              </div>
            </div>
            <a 
              href={`https://wa.me/5521999999999?text=${buildWA()}`} 
              target="_blank" 
              rel="noreferrer" 
              className="inline-flex items-center gap-2 px-8 py-4 text-xs uppercase tracking-widest transition-all text-brand-off-white bg-brand-gold font-tagline hover:opacity-85"
            >
              <Send size={15} />Enviar para WhatsApp VIP
            </a>
            <p className="mt-4 text-xs text-brand-gray-mid font-body italic">Tempo de resposta médio: até 2 horas úteis</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrcamentoPage() {
  return (
    <Suspense fallback={<div className="pt-32 pb-20 text-center text-brand-graphite font-body">Carregando...</div>}>
      <OrcamentoWizard />
    </Suspense>
  );
}
