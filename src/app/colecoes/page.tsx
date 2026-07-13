'use client';

import { useState } from "react";
import Link from "next/link";

const GOLD = "#B5996A";
const GRAPHITE = "#3D3D3D";
const WINE = "#900D13";
const PETROL = "#004168";
const OFF_WHITE = "#F9F7F8";

const diamondPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 2L38 20L20 38L2 20Z' fill='none' stroke='%23B5996A' stroke-width='0.5'/%3E%3C/svg%3E")`;

const products = [
  { id: 1, brand: "Ray-Ban", name: "Clubmaster RB3016", category: "Masculino", price: "R$ 1.290", img: "1511499767150-a48a237f0083" },
  { id: 2, brand: "Tom Ford", name: "FT5634-B Blue Block", category: "Feminino", price: "R$ 3.850", img: "1574258495973-f010dfbb5371" },
  { id: 3, brand: "Gucci", name: "GG0010S Titanium", category: "Solar", price: "R$ 4.200", img: "1508214751196-bcfd4ca60f91" },
  { id: 4, brand: "Prada", name: "PR 56ZS Minimal", category: "Feminino", price: "R$ 3.650", img: "1548036161-4b6c6f931c27" },
  { id: 5, brand: "Oakley", name: "Holbrook XL", category: "Solar", price: "R$ 890", img: "1511499767150-a48a237f0083" },
  { id: 6, brand: "Timevision", name: "Signature No. 3", category: "Titânio", price: "R$ 2.100", img: "1574258495973-f010dfbb5371" },
  { id: 7, brand: "Prada", name: "PR 08YS Sunglass", category: "Solar", price: "R$ 4.100", img: "1508214751196-bcfd4ca60f91" },
  { id: 8, brand: "Ray-Ban", name: "Aviator RB3025", category: "Solar", price: "R$ 1.150", img: "1511499767150-a48a237f0083" },
  { id: 9, brand: "Oakley", name: "Flak 2.0 XL", category: "Solar", price: "R$ 1.350", img: "1574258495973-f010dfbb5371" },
];

export default function ColecoesPage() {
  const [catFilter, setCatFilter] = useState("Todos");
  const [brandFilter, setBrandFilter] = useState("Todos");
  const cats = ["Todos", "Feminino", "Masculino", "Solar", "Titânio"];
  const brands = ["Todos", "Ray-Ban", "Tom Ford", "Gucci", "Prada", "Oakley", "Timevision"];
  
  const filtered = products.filter(p => 
    (catFilter === "Todos" || p.category === catFilter) && 
    (brandFilter === "Todos" || p.brand === brandFilter)
  );

  return (
    <section className="py-16 px-6 pt-32 min-h-screen" style={{ background: GRAPHITE }}>
      <div className="max-w-7xl mx-auto">
        <span className="inline-block px-3 py-1 text-xs mb-4" style={{ background: GOLD, color: OFF_WHITE, fontFamily: "var(--font-lora)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
          Curadoria Timevision
        </span>
        <h1 className="mt-4 mb-10 text-brand-off-white font-display text-4xl md:text-5xl font-bold">Coleções & Grifes</h1>
        
        <div className="flex flex-col gap-4 mb-8">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs mr-2 text-brand-gold font-tagline tracking-widest uppercase">Categoria</span>
            {cats.map(f => (
              <button 
                key={f} 
                onClick={() => setCatFilter(f)} 
                className="px-4 py-1.5 text-xs uppercase transition-all" 
                style={{ 
                  fontFamily: "var(--font-lora)", 
                  letterSpacing: "0.15em", 
                  background: catFilter === f ? GOLD : "transparent", 
                  color: catFilter === f ? OFF_WHITE : "rgba(249,247,248,0.45)", 
                  border: `1px solid ${catFilter === f ? GOLD : "rgba(249,247,248,0.2)"}` 
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-xs mr-2 text-brand-gold font-tagline tracking-widest uppercase">Grife</span>
            {brands.map(b => (
              <button 
                key={b} 
                onClick={() => setBrandFilter(b)} 
                className="px-4 py-1.5 text-xs uppercase transition-all" 
                style={{ 
                  fontFamily: "var(--font-lora)", 
                  letterSpacing: "0.15em", 
                  background: brandFilter === b ? PETROL : "transparent", 
                  color: brandFilter === b ? OFF_WHITE : "rgba(249,247,248,0.45)", 
                  border: `1px solid ${brandFilter === b ? PETROL : "rgba(249,247,248,0.2)"}` 
                }}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <p className="mb-6 text-xs text-brand-off-white/40 italic font-body">
          {filtered.length} {filtered.length === 1 ? "modelo encontrado" : "modelos encontrados"}
        </p>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-brand-off-white/30 italic font-body">
            Nenhum modelo para os filtros selecionados.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(product => (
              <div key={product.id} className="group relative overflow-hidden flex flex-col" style={{ background: "#1A1A1A" }}>
                <div className="relative overflow-hidden h-64 bg-zinc-900">
                  <img
                    src={`https://images.unsplash.com/photo-${product.img}?w=400&h=300&fit=crop&auto=format&q=75`}
                    alt={`${product.brand} ${product.name}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-3 py-1 text-xs" style={{ background: product.category === "Titânio" ? PETROL : GOLD, color: OFF_WHITE, fontFamily: "var(--font-lora)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
                      {product.category}
                    </span>
                  </div>
                </div>
                <div className="p-5 flex-grow flex flex-col">
                  <p className="text-xs mb-1 font-tagline text-brand-gold tracking-widest uppercase">{product.brand}</p>
                  <h3 className="mb-3 text-base font-body text-brand-off-white font-medium">{product.name}</h3>
                  <div className="flex items-center justify-between mt-auto pt-4">
                    <span className="font-display text-brand-gold text-lg font-bold">{product.price}</span>
                    <Link href={`/orcamento?frame=${product.id}`} className="text-xs py-2.5 px-4 font-tagline tracking-wider uppercase text-brand-graphite bg-brand-gold hover:opacity-75 transition-all">
                      Consultar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
