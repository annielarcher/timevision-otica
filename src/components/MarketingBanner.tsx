'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Download, Sparkles, Image as ImageIcon, Type, Calendar, HelpCircle, RefreshCw, ImportIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Phone, QrCode, Maximize } from 'lucide-react';
import QRCode from 'qrcode';

type PresetTemplate = 'igreja' | 'b2b' | 'discount' | 'custom';

const BRAND_COLORS = [
  { name: 'Branco', hex: '#ffffff' },
  { name: 'Gelo', hex: '#F9F7F8' },
  { name: 'Dourado', hex: '#B5996A' },
  { name: 'Grafite', hex: '#3D3D3D' },
  { name: 'Cinza Médio', hex: '#585858' },
  { name: 'Vinho', hex: '#900D13' },
  { name: 'Azul Petróleo', hex: '#004168' }
];

interface PresetConfig {
  title: string;
  tagline: string;
  promoText: string;
  details: string;
  bgGradient: string[];
}

const TEMPLATE_PRESETS: Record<PresetTemplate, PresetConfig> = {
  igreja: {
    title: 'Veja o que Deus preparou para você!',
    tagline: 'Visite nosso Stand no auditório',
    promoText: 'Atendimento VIP · Condições Exclusivas',
    details: 'A Timevision Ótica apresenta uma seleção especial de armações e condições exclusivas para os membros desta instituição.',
    bgGradient: ['#3D3D3D', '#1F1F1F'], // Brand Graphite/Charcoal Gradient
  },
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

export default function MarketingBanner() {
  const { toast } = useToast();
  const [template, setTemplate] = useState<PresetTemplate>('igreja');
  const [title, setTitle] = useState(TEMPLATE_PRESETS.igreja.title);
  const [tagline, setTagline] = useState(TEMPLATE_PRESETS.igreja.tagline);
  const [promoText, setPromoText] = useState(TEMPLATE_PRESETS.igreja.promoText);
  const [details, setDetails] = useState(TEMPLATE_PRESETS.igreja.details);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  
  // Banner Specific States
  const [bannerSize, setBannerSize] = useState<'rollup' | 'poster'>('rollup');
  const [qrUrl, setQrUrl] = useState('https://www.timevision.com.br/inscricao-evento');
  
  // Custom Styling and Position States
  const [titleColor, setTitleColor] = useState('#900D13');
  const [taglineColor, setTaglineColor] = useState('#900D13');
  const [promoBgColor, setPromoBgColor] = useState('#B5996A');
  const [promoTextColor, setPromoTextColor] = useState('#F9F7F8');
  const [detailsColor, setDetailsColor] = useState('#585858');

  const [titleY, setTitleY] = useState(300);
  const [taglineY, setTaglineY] = useState(400);
  const [imageY, setImageY] = useState(800);
  const [imageSize, setImageSize] = useState(250);
  const [promoY, setPromoY] = useState(1300);
  const [detailsY, setDetailsY] = useState(1500);
  
  const [isExporting, setIsExporting] = useState(false);
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

  const drawBannerOnCanvas = async (ctx: CanvasRenderingContext2D, width: number, height: number): Promise<void> => {
    const drawBackground = (): Promise<void> => {
      return new Promise((resolve) => {
        const bgImg = new Image();
        bgImg.onload = () => {
          // Draw cover style to avoid stretching
          const scale = Math.max(width / bgImg.width, height / bgImg.height);
          const drawWidth = bgImg.width * scale;
          const drawHeight = bgImg.height * scale;
          const dx = (width - drawWidth) / 2;
          const dy = (height - drawHeight) / 2;
          ctx.drawImage(bgImg, dx, dy, drawWidth, drawHeight);
          resolve();
        };
        bgImg.onerror = () => {
          // Fallback to gradient if SVG fails to load
          const gradient = ctx.createLinearGradient(0, 0, 0, height);
          const colors = TEMPLATE_PRESETS[template].bgGradient;
          gradient.addColorStop(0, colors[0]);
          gradient.addColorStop(1, colors[1]);
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height);
          
          ctx.fillStyle = '#B5996A';
          ctx.fillRect(0, 0, width, 15);
          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 36px Helvetica';
          ctx.textAlign = 'center';
          ctx.fillText('TIMEVISION ÓTICA', width / 2, 90);
          resolve();
        };
        bgImg.src = '/templates/template-feed.svg';
      });
    };

    const drawTitles = () => {
      ctx.textAlign = 'center';
      // Draw Title
      ctx.fillStyle = titleColor;
      let titleFontSize = 72;
      ctx.font = `bold ${titleFontSize}px Lora`;
      while (ctx.measureText(title.toUpperCase()).width > width - 100 && titleFontSize > 30) {
        titleFontSize -= 2;
        ctx.font = `bold ${titleFontSize}px Lora`;
      }
      ctx.fillText(title.toUpperCase(), width / 2, titleY);

      // Draw Tagline
      ctx.fillStyle = taglineColor;
      let taglineFontSize = 42;
      ctx.font = `bold ${taglineFontSize}px Lora`;
      while (ctx.measureText(tagline).width > width - 100 && taglineFontSize > 22) {
        taglineFontSize -= 2;
        ctx.font = `bold ${taglineFontSize}px Lora`;
      }
      ctx.fillText(tagline, width / 2, taglineY);
    };

    const drawProductImage = (): Promise<void> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.save();
          ctx.beginPath();
          ctx.arc(width / 2, imageY, imageSize, 0, Math.PI * 2);
          ctx.clip();
          const scale = Math.max((imageSize * 2) / img.width, (imageSize * 2) / img.height);
          const dx = width / 2 - (img.width * scale) / 2;
          const dy = imageY - (img.height * scale) / 2;
          ctx.drawImage(img, dx, dy, img.width * scale, img.height * scale);
          ctx.restore();
          
          // Outer Gold ring
          ctx.strokeStyle = '#B5996A';
          ctx.lineWidth = 10;
          ctx.beginPath();
          ctx.arc(width / 2, imageY, imageSize, 0, Math.PI * 2);
          ctx.stroke();
          resolve();
        };
        img.onerror = () => resolve();
        img.src = uploadedImage || '/images/flyer-model-default.png';
      });
    };

    const drawTextFooter = async () => {
      // Draw Promotional Offer Text
      ctx.textAlign = 'center';
      ctx.fillStyle = promoBgColor;
      ctx.fillRect(80, promoY, width - 160, 100);
      
      let promoFontSize = 52;
      ctx.font = `bold ${promoFontSize}px Lora`;
      const maxPromoWidth = width - 220;
      while (ctx.measureText(promoText.toUpperCase()).width > maxPromoWidth && promoFontSize > 24) {
        promoFontSize -= 2;
        ctx.font = `bold ${promoFontSize}px Lora`;
      }
      
      ctx.fillStyle = promoTextColor;
      const textY = promoY + 50 + (promoFontSize * 0.35);
      ctx.fillText(promoText.toUpperCase(), width / 2, textY);

      // Draw Campaign Details
      ctx.fillStyle = detailsColor;
      ctx.font = 'bold 32px Lora';
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

      let currentDetailsY = detailsY;
      for (let line of wrappedLines) {
        ctx.fillText(line.trim(), width / 2, currentDetailsY);
        currentDetailsY += 44;
      }

      // Draw QR Code
      if (qrUrl) {
        try {
          const qrDataUrl = await QRCode.toDataURL(qrUrl, {
            margin: 1,
            width: 250,
            color: { dark: '#000000', light: '#ffffff' }
          });
          
          return new Promise<void>((resolve) => {
            const qrImg = new Image();
            qrImg.onload = () => {
              const qrY = height - 380;
              // Draw white background box for QR to stand out
              ctx.fillStyle = '#ffffff';
              ctx.beginPath();
              ctx.roundRect(width / 2 - 140, qrY - 15, 280, 280, 16);
              ctx.fill();
              
              ctx.drawImage(qrImg, width / 2 - 125, qrY, 250, 250);
              
              // CTA text below QR
              ctx.fillStyle = '#e2e8f0';
              ctx.font = 'bold 24px Lora';
              ctx.fillText('Escaneie para se Inscrever', width / 2, qrY + 300);
              resolve();
            };
            qrImg.src = qrDataUrl;
          });
        } catch (err) {
          console.error("Failed to generate QR Code", err);
        }
      }

      // Footer contact
      ctx.fillStyle = '#585858';
      ctx.font = 'bold 24px Lora';
      ctx.fillText('☎ (21) 97769-6374' + '  \n  ' + 'www.timevision.com.br', width / 2, height - 20);
    };

    await drawBackground();
    drawTitles();
    await drawProductImage();
    await drawTextFooter();
  };

  // Re-draw preview whenever settings change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBannerOnCanvas(ctx, canvas.width, canvas.height);
      }
    }
  }, [
    title, tagline, promoText, details, uploadedImage, template,
    titleColor, taglineColor, promoBgColor, promoTextColor, detailsColor,
    titleY, taglineY, imageY, imageSize, promoY, detailsY, bannerSize, qrUrl
  ]);

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

  const handleDownloadPDF = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const isRollup = bannerSize === 'rollup';
      const pdfFormat = isRollup ? [90, 200] : [60, 90]; // cm dimensions
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'cm',
        format: pdfFormat,
      });
      // Convert canvas to JPEG for smaller PDF size
      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      
      doc.addImage(imgData, 'JPEG', 0, 0, pdfFormat[0], pdfFormat[1]);
      doc.save(`banner-timevision-${template}-${bannerSize}.pdf`);
      toast({
        title: 'PDF Gerado',
        description: 'Arquivo em alta qualidade baixado com sucesso!',
      });
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível gerar o PDF. Tente novamente.',
      });
    } finally {
      setIsExporting(false);
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-1">
            <button
              onClick={() => setTemplate('igreja')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                template === 'igreja' 
                  ? 'bg-primary border-primary text-primary-foreground shadow' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Ação igrejas
            </button>
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
              Customizado
            </button>
          </div>
        </div>

        {/* Banner Size */}
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <Maximize className="h-4 w-4 text-primary" /> Tamanho do Banner
          </span>
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              onClick={() => setBannerSize('rollup')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                bannerSize === 'rollup' 
                  ? 'bg-primary border-primary text-primary-foreground shadow' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Roll-up (90x200cm)
            </button>
            <button
              onClick={() => setBannerSize('poster')}
              className={`py-2 px-3 text-xs font-bold rounded-lg border transition-all ${
                bannerSize === 'poster' 
                  ? 'bg-primary border-primary text-primary-foreground shadow' 
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
            >
              Poster / Parede (60x90cm)
            </button>
          </div>
        </div>

        {/* QR Code Settings */}
        <div className="flex flex-col gap-1">
          <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1"><QrCode className="h-4 w-4 text-primary" /> Link do QR Code (Inscrição)</label>
          <input
            type="text"
            value={qrUrl}
            onChange={(e) => setQrUrl(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
            placeholder="https://site.com/link"
          />
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

        {/* Color Customization */}
        <div className="border-t border-slate-800 pt-3 mt-1 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Cores do Texto e Banner (Paleta da Marca)</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-400">Cor do Título</label>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {BRAND_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setTitleColor(c.hex)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      titleColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-white scale-110 shadow-md ring-2 ring-primary/45'
                        : 'border-slate-800 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-400">Cor do Subtítulo</label>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {BRAND_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setTaglineColor(c.hex)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      taglineColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-white scale-110 shadow-md ring-2 ring-primary/45'
                        : 'border-slate-800 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-400">Fundo Destaque</label>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {BRAND_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setPromoBgColor(c.hex)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      promoBgColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-white scale-110 shadow-md ring-2 ring-primary/45'
                        : 'border-slate-800 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-400">Texto Destaque</label>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {BRAND_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setPromoTextColor(c.hex)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      promoTextColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-white scale-110 shadow-md ring-2 ring-primary/45'
                        : 'border-slate-800 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
              <label className="text-[9px] uppercase font-bold text-slate-400">Cor dos Detalhes</label>
              <div className="flex flex-wrap gap-1 mt-0.5">
                {BRAND_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setDetailsColor(c.hex)}
                    className={`w-6 h-6 rounded-full border transition-all ${
                      detailsColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'border-white scale-110 shadow-md ring-2 ring-primary/45'
                        : 'border-slate-800 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Position Sliders */}
        <div className="border-t border-slate-800 pt-3 mt-1 space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Ajuste de Posições (Vertical)</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>POSIÇÃO TÍTULO</span>
                <span>{titleY}px</span>
              </div>
              <input
                type="range"
                min="100"
                max="400"
                value={titleY}
                onChange={(e) => setTitleY(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>POSIÇÃO SUBTÍTULO</span>
                <span>{taglineY}px</span>
              </div>
              <input
                type="range"
                min="150"
                max="500"
                value={taglineY}
                onChange={(e) => setTaglineY(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>POSIÇÃO ÓCULOS</span>
                <span>{imageY}px</span>
              </div>
              <input
                type="range"
                min="300"
                max="800"
                value={imageY}
                onChange={(e) => setImageY(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>TAMANHO ÓCULOS</span>
                <span>{imageSize}px</span>
              </div>
              <input
                type="range"
                min="100"
                max="300"
                value={imageSize}
                onChange={(e) => setImageSize(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>POSIÇÃO DESTAQUE</span>
                <span>{promoY}px</span>
              </div>
              <input
                type="range"
                min="500"
                max="1000"
                value={promoY}
                onChange={(e) => setPromoY(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>POSIÇÃO DETALHES</span>
                <span>{detailsY}px</span>
              </div>
              <input
                type="range"
                min="600"
                max="1600"
                value={detailsY}
                onChange={(e) => setDetailsY(Number(e.target.value))}
                className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 pt-3 border-t border-slate-800">
          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold gap-2 py-5"
            >
              <Download className="h-4.5 w-4.5" />
              Baixar PNG
            </Button>
            <Button
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex-1 bg-[#004168] text-white hover:bg-[#004168]/90 text-sm font-bold gap-2 py-5"
            >
              <Download className="h-4.5 w-4.5" />
              {isExporting ? 'Gerando PDF...' : `Baixar PDF Gráfica`}
            </Button>
          </div>
          <Button
            variant="outline"
            onClick={resetFields}
            className="w-full py-3 border-slate-800 text-slate-400 hover:text-white text-xs"
          >
            Limpar Campos
          </Button>
        </div>
      </div>

      {/* Canvas preview */}
      <div className="w-full lg:w-[360px] flex flex-col items-center bg-slate-950 p-4 rounded-xl border border-slate-800/80 justify-center">
        <span className="text-xs text-slate-400 uppercase tracking-widest mb-3">Pré-visualização Digital</span>
        <div className="w-[300px] h-[450px] relative overflow-hidden rounded-lg shadow-2xl border border-slate-800 bg-slate-900 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            width={900}
            height={bannerSize === 'rollup' ? 2000 : 1350}
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
}
