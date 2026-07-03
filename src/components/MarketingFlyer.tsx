'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, Image as ImageIcon, Type, Calendar, HelpCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type PresetTemplate = 'b2b' | 'discount' | 'custom';

interface PresetConfig {
  title: string;
  tagline: string;
  promoText: string;
  details: string;
  bgGradient: string[];
}

const TEMPLATE_PRESETS: Record<PresetTemplate, PresetConfig> = {
  b2b: {
    title: 'Feira de Saúde Visual',
    tagline: 'Exame de Vista Gratuito no Local',
    promoText: 'Condições Exclusivas de Fábrica',
    details: 'Visita confirmada para exames e escolha de armações. Parceria com empresas e igrejas.',
    bgGradient: ['#0f172a', '#1e293b'], // Slate/Navy
  },
  discount: {
    title: 'Semana do Óculos Novo',
    tagline: 'Ganhe 20% de Desconto Completo',
    promoText: 'Armação + Lentes Zeiss ou Essilor',
    details: 'Apresente este panfleto digital no dia do atendimento e garanta seu desconto exclusivo.',
    bgGradient: ['#064e3b', '#065f46'], // Emerald Green
  },
  custom: {
    title: 'Escreva Seu Título Aqui',
    tagline: 'Subtítulo da campanha promocional',
    promoText: 'Grande Oferta Timevision',
    details: 'Informações sobre data, local e benefícios oferecidos aos clientes da ótica.',
    bgGradient: ['#311042', '#1a052e'], // Purple
  },
};

export default function MarketingFlyer() {
  const { toast } = useToast();
  const [template, setTemplate] = useState<PresetTemplate>('b2b');
  const [title, setTitle] = useState(TEMPLATE_PRESETS.b2b.title);
  const [tagline, setTagline] = useState(TEMPLATE_PRESETS.b2b.tagline);
  const [promoText, setPromoText] = useState(TEMPLATE_PRESETS.b2b.promoText);
  const [details, setDetails] = useState(TEMPLATE_PRESETS.b2b.details);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync inputs when template preset changes
  useEffect(() => {
    setTitle(TEMPLATE_PRESETS[template].title);
    setTagline(TEMPLATE_PRESETS[template].tagline);
    setPromoText(TEMPLATE_PRESETS[template].promoText);
    setDetails(TEMPLATE_PRESETS[template].details);
  }, [template]);

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const drawFlyerOnCanvas = (ctx: CanvasRenderingContext2D, width: number, height: number): Promise<void> => {
    return new Promise((resolve) => {
      // 1. Draw Background Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      const colors = TEMPLATE_PRESETS[template].bgGradient;
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(1, colors[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Decorative vector rings
      ctx.strokeStyle = 'rgba(255, 215, 0, 0.08)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 350, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 280, 0, Math.PI * 2);
      ctx.stroke();

      // 2. Draw Store Header
      ctx.fillStyle = '#e2e8f0';
      ctx.font = 'bold 36px Helvetica';
      ctx.textAlign = 'center';
      ctx.fillText('TIMEVISION ÓTICA', width / 2, 90);

      // Small logo/divider line
      ctx.strokeStyle = '#e0a020'; // Gold accent
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(width / 2 - 80, 115);
      ctx.lineTo(width / 2 + 80, 115);
      ctx.stroke();

      // 3. Draw Title (Vibrant/Large)
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px Helvetica';
      ctx.fillText(title.toUpperCase(), width / 2, 210);

      // 4. Draw Tagline
      ctx.fillStyle = '#f5c842'; // Light Gold
      ctx.font = 'bold 32px Helvetica';
      ctx.fillText(tagline, width / 2, 270);

      // 5. Draw Frame/Product Image if uploaded
      if (uploadedImage) {
        const img = new Image();
        img.onload = () => {
          // Draw circle crop frame for product
          ctx.save();
          ctx.beginPath();
          ctx.arc(width / 2, 540, 200, 0, Math.PI * 2);
          ctx.clip();
          
          // Draw the image scaled to fit
          const scale = Math.max(400 / img.width, 400 / img.height);
          const x = width / 2 - (img.width * scale) / 2;
          const y = 540 - (img.height * scale) / 2;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
          
          ctx.restore();

          // Outer Gold ring for cropped product image
          ctx.strokeStyle = '#e0a020';
          ctx.lineWidth = 8;
          ctx.beginPath();
          ctx.arc(width / 2, 540, 200, 0, Math.PI * 2);
          ctx.stroke();

          // Proceed to text rendering below
          drawTextFooter(ctx, width, height);
          resolve();
        };
        img.src = uploadedImage;
      } else {
        // Draw placeholder illustration of glasses if no photo is uploaded
        ctx.strokeStyle = '#e0a020';
        ctx.lineWidth = 10;
        
        // Left glass frame
        ctx.beginPath();
        ctx.arc(width / 2 - 120, 520, 90, 0, Math.PI * 2);
        ctx.stroke();
        
        // Right glass frame
        ctx.beginPath();
        ctx.arc(width / 2 + 120, 520, 90, 0, Math.PI * 2);
        ctx.stroke();

        // Bridge line
        ctx.beginPath();
        ctx.arc(width / 2, 510, 40, Math.PI, 0);
        ctx.stroke();

        // Temples
        ctx.beginPath();
        ctx.moveTo(width / 2 - 210, 510);
        ctx.lineTo(width / 2 - 260, 480);
        ctx.moveTo(width / 2 + 210, 510);
        ctx.lineTo(width / 2 + 260, 480);
        ctx.stroke();

        ctx.fillStyle = '#f5c842';
        ctx.font = 'italic 24px Helvetica';
        ctx.fillText('[ Insira a Foto do Óculos no Painel Lateral ]', width / 2, 660);

        // Proceed to text rendering below
        drawTextFooter(ctx, width, height);
        resolve();
      }
    });
  };

  const drawTextFooter = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // 6. Draw Promotional Offer Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Helvetica';
    ctx.textAlign = 'center';
    
    // Draw rounded background block for promo text
    ctx.fillStyle = '#e0a020';
    ctx.fillRect(80, 780, width - 160, 90);
    
    ctx.fillStyle = '#0f172a'; // Navy text
    ctx.fillText(promoText.toUpperCase(), width / 2, 842);

    // 7. Draw Campaign Details
    ctx.fillStyle = '#e2e8f0';
    ctx.font = 'normal 26px Helvetica';
    const wrappedLines = [];
    const words = details.split(' ');
    let currentLine = '';
    
    for (let word of words) {
      const testLine = currentLine + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > width - 120 && currentLine !== '') {
        wrappedLines.push(currentLine);
        currentLine = word + ' ';
      } else {
        currentLine = testLine;
      }
    }
    wrappedLines.push(currentLine);

    let detailsY = 930;
    for (let line of wrappedLines) {
      ctx.fillText(line.trim(), width / 2, detailsY);
      detailsY += 36;
    }

    // 8. Footer CTA
    ctx.fillStyle = '#94a3b8';
    ctx.font = 'bold 22px Helvetica';
    ctx.fillText('Solicite seu atendimento: (21) 99999-9999', width / 2, height - 60);
  };

  // Re-draw preview whenever settings change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawFlyerOnCanvas(ctx, canvas.width, canvas.height);
      }
    }
  }, [title, tagline, promoText, details, uploadedImage, template]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `panf-timevision-${template}-${Date.now()}.png`;
      link.href = url;
      link.click();
      
      toast({
        title: 'Sucesso',
        description: 'Panfleto promocional baixado como imagem PNG!',
      });
    }
  };

  const resetFields = () => {
    setUploadedImage(null);
    setTitle(TEMPLATE_PRESETS[template].title);
    setTagline(TEMPLATE_PRESETS[template].tagline);
    setPromoText(TEMPLATE_PRESETS[template].promoText);
    setDetails(TEMPLATE_PRESETS[template].details);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-6xl mx-auto bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-xl">
      {/* Inputs controls */}
      <div className="flex-1 space-y-4 max-h-[85vh] overflow-y-auto pr-2">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Sparkles className="text-primary h-5.5 w-5.5" /> Gerador de Material Promocional
          </h2>
        </div>

        {/* Template Select */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Modelo de Campanha</span>
          <div className="grid grid-cols-3 gap-2 mt-1">
            <button
              onClick={() => setTemplate('b2b')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                template === 'b2b' 
                  ? 'bg-primary border-primary text-primary-foreground shadow' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Ação B2B / Saúde
            </button>
            <button
              onClick={() => setTemplate('discount')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                template === 'discount' 
                  ? 'bg-primary border-primary text-primary-foreground shadow' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Super Desconto
            </button>
            <button
              onClick={() => setTemplate('custom')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                template === 'custom' 
                  ? 'bg-primary border-primary text-primary-foreground shadow' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Customizado / Outro
            </button>
          </div>
        </div>

        {/* Upload Image */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
            <ImageIcon className="h-4 w-4 text-primary" /> Foto do Óculos / Armação
          </label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              id="flyer-img"
              onChange={handleImageUpload}
              className="hidden"
            />
            <label
              htmlFor="flyer-img"
              className="cursor-pointer bg-slate-950 border border-slate-800 text-slate-350 px-4 py-2 text-xs rounded-lg hover:border-primary transition-colors flex items-center gap-2"
            >
              Escolher Foto do Computador
            </label>
            {uploadedImage && (
              <Button
                variant="ghost"
                onClick={() => setUploadedImage(null)}
                className="text-xs text-red-400 hover:text-red-300"
              >
                Remover Imagem
              </Button>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1"><Type className="h-3 w-3" /> Título Principal</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
          />
        </div>

        {/* Subtitle */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1"><Type className="h-3 w-3" /> Subtítulo</label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
          />
        </div>

        {/* Promo text box */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1"><Type className="h-3 w-3" /> Oferta Destaque (Fundo Colorido)</label>
          <input
            type="text"
            value={promoText}
            onChange={(e) => setPromoText(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
            placeholder="Ex: Armação + Lente com 20% de Desconto"
          />
        </div>

        {/* Details description */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Detalhes & Data da Ação</label>
          <textarea
            rows={3}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white resize-none"
            placeholder="Data, local, endereço ou outras instruções importantes..."
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-3 border-t border-slate-800">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold gap-2 py-5"
          >
            <Download className="h-4.5 w-4.5" />
            Baixar Panfleto PNG
          </Button>
          <Button
            variant="outline"
            onClick={resetFields}
            className="px-4 py-5 border-slate-800 text-slate-400 hover:text-white"
          >
            Limpar
          </Button>
        </div>
      </div>

      {/* Canvas preview */}
      <div className="w-full lg:w-[360px] flex flex-col items-center bg-slate-950 p-4 rounded-xl border border-slate-800/80 justify-center">
        <span className="text-xs text-slate-400 uppercase tracking-widest mb-3">Pré-visualização Digital</span>
        <div className="w-[300px] h-[450px] relative overflow-hidden rounded-lg shadow-2xl border border-slate-800 bg-slate-900 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={800}
            height={1200}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
