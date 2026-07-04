'use client';

import Link from "next/link";
import { MapPin, Instagram, Clock, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

const GOLD = "#B5996A";
const GRAPHITE = "#242424"; // Charcoal dark grey background matching brand guidelines

export function Footer() {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) return null;

  const links = [
    { label: "A Boutique", href: "/sobre" },
    { label: "Coleções & Grifes", href: "/colecoes" },
    { label: "Lentes & Tecnologia", href: "/lentes" },
    { label: "Orçamento VIP", href: "/orcamento" },
    { label: "Rastreamento", href: "/rastreamento" },
  ];

  return (
    <footer className="pt-16 pb-8 px-6 text-brand-off-white" style={{ background: GRAPHITE, borderTop: `1px solid ${GOLD}30` }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img src="/logos/icone/1.svg" className="h-8 w-8 brightness-200" alt="Logo Timevision" />
              <img src="/logos/logo-light.svg" className="h-10 w-auto" alt="Timevision Ótica" />
            </div>
            <p className="text-sm font-body leading-relaxed max-w-xs text-brand-off-white/60 text-justify">
              Boutique óptica de alto padrão no Recreio dos Bandeirantes, Rio de Janeiro. Curadoria exclusiva de grifes internacionais e lentes de altíssima precisão.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a 
                href="https://instagram.com/oticastimevision" 
                target="_blank" 
                rel="noreferrer" 
                className="transition-opacity hover:opacity-60 text-brand-gold"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="tel:+5521999999999" 
                className="transition-opacity hover:opacity-60 text-brand-gold"
              >
                <Phone size={18} />
              </a>
            </div>
          </div>

          <div>
            <p className="mb-5 text-xs font-tagline text-brand-gold tracking-widest uppercase font-bold">Navegação</p>
            <div className="flex flex-col gap-2.5">
              {links.map((l) => (
                <Link 
                  key={l.href} 
                  href={l.href} 
                  className="text-sm text-brand-off-white/65 hover:text-white transition-colors font-body"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-5 text-xs font-tagline text-brand-gold tracking-widest uppercase font-bold">Contato</p>
            <div className="flex flex-col gap-4">
              {[
                { Icon: MapPin, text: "Av. das Américas, Recreio dos Bandeirantes, Rio de Janeiro — RJ" },
                { Icon: Instagram, text: "@oticastimevision" },
                { Icon: Clock, text: "Seg–Sex 10h–19h · Sáb 10h–17h" },
              ].map(({ Icon, text }) => (
                <div key={text} className="flex items-start gap-2.5">
                  <Icon size={14} color={GOLD} className="mt-0.5 flex-shrink-0" />
                  <span className="text-sm font-body text-brand-off-white/65 leading-relaxed text-justify">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-brand-off-white/30" style={{ borderColor: `${GOLD}20` }}>
          <p className="text-[10px] font-tagline tracking-widest uppercase">
            © 2026 TIMEVISION ÓTICA. TODOS OS DIREITOS RESERVADOS.
          </p>
          <p className="text-[10px] font-tagline tracking-widest uppercase">
            DESENVOLVIDO POR THALITAKUME®
          </p>
        </div>
      </div>
    </footer>
  );
}
