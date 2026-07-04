'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const GOLD = "#B5996A";
const GRAPHITE = "#242424"; // Graphite background matching layout.tsx
const OFF_WHITE = "#F9F7F8";

export function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { label: "A Boutique", href: "/sobre" },
    { label: "Coleções", href: "/colecoes" },
    { label: "Lentes & Tecnologia", href: "/lentes" },
    { label: "Rastreamento", href: "/rastreamento" },
  ];

  // Se for a página do painel administrativo, podemos esconder ou manter o header simplificado
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={{ background: GRAPHITE, borderBottom: `1px solid ${GOLD}35` }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 transition-opacity hover:opacity-80">
          <img src="/logos/icone/1.svg" className="h-8 w-8 brightness-200" alt="Logo Timevision" />
          <img src="/logos/logo-light.svg" className="h-10 w-auto" alt="Timevision Ótica" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link 
                key={l.href} 
                href={l.href} 
                className="text-xs transition-all duration-200 uppercase font-tagline tracking-widest py-1"
                style={{ 
                  color: active ? GOLD : "rgba(249,247,248,0.72)", 
                  borderBottom: `1.5px solid ${active ? GOLD : "transparent"}`
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <Link 
            href="/orcamento" 
            className="inline-flex items-center justify-center px-6 py-2.5 text-xs font-tagline tracking-widest uppercase transition-all duration-200 text-brand-graphite bg-brand-gold hover:opacity-75"
          >
            Orçamento VIP
          </Link>
          <Link 
            href="/admin" 
            className="text-[9px] font-tagline tracking-widest transition-opacity opacity-30 hover:opacity-60 text-brand-off-white"
          >
            ADM
          </Link>
        </div>

        <button className="md:hidden text-brand-off-white" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-6 flex flex-col gap-4 transition-all duration-300" style={{ background: GRAPHITE, borderTop: `1px solid ${GOLD}20` }}>
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link 
                key={l.href} 
                href={l.href} 
                onClick={() => setOpen(false)}
                className="text-left py-2 font-body text-sm font-medium"
                style={{ color: active ? GOLD : OFF_WHITE }}
              >
                {l.label}
              </Link>
            );
          })}
          <div className="flex flex-col gap-3 pt-2">
            <Link 
              href="/orcamento" 
              onClick={() => setOpen(false)}
              className="w-full text-center py-3 text-xs font-tagline tracking-widest uppercase text-brand-graphite bg-brand-gold"
            >
              Orçamento VIP
            </Link>
            <Link 
              href="/admin" 
              onClick={() => setOpen(false)}
              className="text-center py-1.5 text-[10px] font-tagline tracking-widest uppercase text-brand-off-white/40"
            >
              Painel ADM
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
