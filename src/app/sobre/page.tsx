'use client';

const GOLD = "#B5996A";
const GRAPHITE = "#3D3D3D";
const OFF_WHITE = "#F9F7F8";
const GRAY = "#585858";

const diamondPattern = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M20 2L38 20L20 38L2 20Z' fill='none' stroke='%23B5996A' stroke-width='0.5'/%3E%3C/svg%3E")`;

export default function SobrePage() {
  const attrs = [
    { name: "Compromisso", desc: "Com cada cliente, do primeiro contato à entrega final." },
    { name: "Dedicação", desc: "Total atenção na escolha da armação e precisão das lentes." },
    { name: "Respeito", desc: "Por cada pessoa e suas necessidades visuais únicas." },
    { name: "Ética", desc: "Transparência em preços, procedência e diagnósticos." },
    { name: "Responsabilidade", desc: "Social e ambiental em cada decisão da boutique." },
    { name: "Honestidade", desc: "Nunca indicamos o que não é necessário para sua saúde visual." },
    { name: "Seriedade", desc: "Profissionalismo e rigor técnico em cada par de óculos." },
    { name: "Verdade", desc: "Nossa maior promessa: nunca comprometemos sua visão." },
  ];

  return (
    <>
      <section className="relative flex items-end" style={{ height: "62vh", background: GRAPHITE }}>
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400&h=800&fit=crop&auto=format&q=75" 
            alt="Interior Timevision Ótica" 
            className="w-full h-full object-cover grayscale opacity-25" 
          />
        </div>
        <div className="absolute inset-0 opacity-[0.09]" style={{ backgroundImage: diamondPattern, backgroundSize: "40px 40px" }} />
        <div className="absolute right-12 top-1/2 -translate-y-1/2 opacity-[0.07] pointer-events-none hidden lg:block font-display text-[18rem] text-brand-off-white font-bold leading-none">TV</div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <span className="inline-block px-3 py-1 text-xs mb-4" style={{ background: GOLD, color: OFF_WHITE, fontFamily: "var(--font-identification-05c)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
            A Boutique
          </span>
          <h1 className="mt-4 text-brand-off-white font-display text-4xl md:text-6xl font-bold leading-tight">
            A História da
            <br />
            Timevision Ótica
          </h1>
        </div>
      </section>

      <section className="py-24 px-6 bg-brand-off-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          <div className="text-brand-graphite">
            <p className="mb-4 text-xs font-tagline text-brand-gold tracking-widest uppercase font-bold">O Conceito Recreio</p>
            <h2 className="mb-6 font-display text-3xl md:text-4xl font-bold leading-tight">Onde a elegância encontra a ciência da visão</h2>
            <div className="space-y-5 font-body text-brand-gray-mid leading-relaxed text-justify">
              <p>A Timevision Ótica nasceu no Recreio dos Bandeirantes com uma missão precisa: democratizar o acesso ao luxo verdadeiro na óptica. Não o luxo de aparência, mas o luxo de substância — aquele que você sente na qualidade da lente, na durabilidade da armação e no cuidado com a sua saúde visual.</p>
              <p>Localizada em uma das regiões mais vibrantes do Rio de Janeiro, nossa boutique foi concebida para oferecer uma experiência que vai além da simples venda de óculos. Cada visita é um ritual de atenção personalizada, onde nossos especialistas dedicam o tempo necessário para compreender não apenas sua necessidade refrativa, mas seu estilo de vida e suas aspirações.</p>
              <p>Com parcerias exclusivas com os maiores laboratórios de lentes do mundo — Zeiss, Essilor e Hoya — e acesso às mais importantes grifes de eyewear internacional, a Timevision fornece as melhores marcas com procedência garantida e a exclusividade que você busca.</p>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=600&h=700&fit=crop&auto=format&q=80" 
              alt="Armações de luxo" 
              className="w-full object-cover" 
              style={{ height: "520px" }} 
            />
            <div className="absolute -bottom-4 -left-4 w-full h-full border pointer-events-none" style={{ borderColor: GOLD, zIndex: -1 }} />
          </div>
        </div>
      </section>

      <section className="py-24 px-6" style={{ background: GRAPHITE }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 text-xs mb-4" style={{ background: GOLD, color: OFF_WHITE, fontFamily: "var(--font-identification-05c)", letterSpacing: "0.22em", textTransform: "uppercase" }}>
              Nossos Pilares
            </span>
            <h2 className="mt-4 mb-4 text-brand-off-white font-display text-4xl font-bold">8 Atributos da Timevision</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: `${GOLD}18` }}>
            {attrs.map((a, i) => (
              <div key={a.name} className="p-8" style={{ background: i % 2 === 0 ? GRAPHITE : "#2d2d2d" }}>
                <div className="mb-3 font-display text-brand-gold font-bold text-4xl opacity-40">0{i + 1}</div>
                <h3 className="mb-3 font-display text-brand-off-white text-xl font-bold">{a.name}</h3>
                <p className="text-sm leading-relaxed text-brand-off-white/60 font-body text-justify">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
