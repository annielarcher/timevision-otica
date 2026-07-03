'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Printer, Download, User, ShieldCheck, HeartPulse, RefreshCw, Eye } from 'lucide-react';
import { Cliente, Produto, ReceitaVisual, Venda, saveItem } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface WorkOrderGeneratorProps {
  initialVenda?: Partial<Venda>;
  onClose?: () => void;
  onSaveSuccess?: () => void;
}

export default function WorkOrderGenerator({ initialVenda, onClose, onSaveSuccess }: WorkOrderGeneratorProps) {
  const { toast } = useToast();
  const [orderNumber, setOrderNumber] = useState(initialVenda?.id || `TV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [orderDate, setOrderDate] = useState(initialVenda?.dataVenda || new Date().toISOString().split('T')[0]);
  
  // Client info
  const [clientName, setClientName] = useState(initialVenda?.clienteNome || 'Mariana da Silva');
  const [clientCpf, setClientCpf] = useState(initialVenda?.clienteCpf || '123.456.789-00');
  const [clientEmail, setClientEmail] = useState(initialVenda?.clienteEmail || 'mariana@email.com');
  const [clientPhone, setClientPhone] = useState(initialVenda?.clienteTelefone || '(21) 98888-7777');
  const [clientAddress, setClientAddress] = useState(initialVenda?.clienteEndereco || 'Rua das Flores, 123, Rio de Janeiro - RJ');

  // Eyewear details
  const [frameModel, setFrameModel] = useState(initialVenda?.produtos?.[0]?.nome || 'Timevision Classic Square Black');
  const [lensType, setLensType] = useState(initialVenda?.produtos?.[1]?.nome || 'Lente Zeiss 1.56 DuraVision BlueControl');
  const [priceTotal, setPriceTotal] = useState(initialVenda?.valorTotal || 599.00);
  const [warrantyMonths, setWarrantyMonths] = useState('12');

  // Eye Prescription (Receita)
  const [esfericoOD, setEsfericoOD] = useState(initialVenda?.receita?.esfericoOD || '0.00');
  const [esfericoOE, setEsfericoOE] = useState(initialVenda?.receita?.esfericoOE || '0.00');
  const [cilindricoOD, setCilindricoOD] = useState(initialVenda?.receita?.cilindricoOD || '0.00');
  const [cilindricoOE, setCilindricoOE] = useState(initialVenda?.receita?.cilindricoOE || '0.00');
  const [eixoOD, setEixoOD] = useState(initialVenda?.receita?.eixoOD || '');
  const [eixoOE, setEixoOE] = useState(initialVenda?.receita?.eixoOE || '');
  const [adicao, setAdicao] = useState(initialVenda?.receita?.adicao || '');

  const [isExporting, setIsExporting] = useState(false);

  const drawViaContent = (doc: any, yOffset: number, viaTitle: string) => {
    // Outer border for A6 copy
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(8, yOffset, 194, 130);

    // Dotted accent lines or headers
    doc.setFillColor(15, 23, 42); // Primary Navy color
    doc.rect(8, yOffset, 194, 8, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(`TIMEVISION ÓTICA  |  ORDEM DE SERVIÇO  -  ${viaTitle.toUpperCase()}`, 12, yOffset + 5.5);

    // Order info top right
    doc.setFontSize(8);
    doc.text(`Nº: ${orderNumber}`, 160, yOffset + 5.5);

    doc.setTextColor(15, 23, 42);
    // Draw Header Store Details
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TIMEVISION ÓTICA', 12, yOffset + 15);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text('Contato: oticastimevision@gmail.com  |  Tel: (21) 99999-9999', 12, yOffset + 19);
    doc.text(`Data do Pedido: ${new Date(orderDate).toLocaleDateString('pt-BR')}  |  Garantia: ${warrantyMonths} meses`, 12, yOffset + 22.5);

    // Client Info Box
    doc.setDrawColor(230, 230, 230);
    doc.rect(12, yOffset + 26, 186, 22);
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('DADOS DO CLIENTE', 15, yOffset + 31);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Nome: ${clientName}`, 15, yOffset + 35);
    doc.text(`CPF: ${clientCpf}`, 15, yOffset + 39);
    doc.text(`Telefone: ${clientPhone}`, 15, yOffset + 43);

    doc.text(`Email: ${clientEmail}`, 110, yOffset + 35);
    doc.text(`Endereço: ${clientAddress}`, 110, yOffset + 39);

    // Prescription Table (Exame de Vista)
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('RECEITA VISUAL', 15, yOffset + 54);

    // Grid header
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 247, 250);
    doc.rect(12, yOffset + 56, 186, 5, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('OLHO', 15, yOffset + 59.5);
    doc.text('ESFÉRICO', 60, yOffset + 59.5);
    doc.text('CILÍNDRICO', 100, yOffset + 59.5);
    doc.text('EIXO', 140, yOffset + 59.5);
    
    // Grid rows
    doc.setFont('Helvetica', 'normal');
    // OD
    doc.line(12, yOffset + 67, 198, yOffset + 67);
    doc.text('OD (Olho Direito)', 15, yOffset + 64);
    doc.text(esfericoOD, 60, yOffset + 64);
    doc.text(cilindricoOD, 100, yOffset + 64);
    doc.text(eixoOD ? `${eixoOD}°` : '-', 140, yOffset + 64);

    // OE
    doc.line(12, yOffset + 73, 198, yOffset + 73);
    doc.text('OE (Olho Esquerdo)', 15, yOffset + 70);
    doc.text(esfericoOE, 60, yOffset + 70);
    doc.text(cilindricoOE, 100, yOffset + 70);
    doc.text(eixoOE ? `${eixoOE}°` : '-', 140, yOffset + 70);

    // Addition
    if (adicao) {
      doc.setFont('Helvetica', 'bold');
      doc.text(`ADIÇÃO: ${adicao}`, 15, yOffset + 76);
      doc.setFont('Helvetica', 'normal');
    }

    // Specifications
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('ESPECIFICAÇÕES DOS ÓCULOS', 15, yOffset + 83);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Armação: ${frameModel}`, 15, yOffset + 88);
    doc.text(`Lentes: ${lensType}`, 15, yOffset + 92);
    
    doc.setFont('Helvetica', 'bold');
    doc.text(`VALOR TOTAL: R$ ${priceTotal.toFixed(2)}`, 140, yOffset + 88);
    doc.setFont('Helvetica', 'normal');

    // Signatures and Date
    const sigY = yOffset + 104;
    doc.line(15, sigY, 95, sigY);
    doc.setFontSize(7);
    doc.text('Assinatura do Consultor Óptico', 15, sigY + 3.5);

    doc.line(110, sigY, 190, sigY);
    doc.text('Assinatura do Cliente (Aceite e Termos)', 110, sigY + 3.5);

    // Terms (Very small text)
    doc.setFontSize(5.5);
    doc.setTextColor(100, 100, 100);
    const terms = 'Termos de Garantia: A garantia cobre defeitos de fabricação da armação pelo período informado. Lentes riscadas, trincadas ou danos causados por mau uso não estão inclusos. O cliente declara que a receita visual confere com as informações prestadas.';
    const wrappedTerms = doc.splitTextToSize(terms, 186);
    doc.text(wrappedTerms, 12, yOffset + 117);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Render vertical copies
      // Via 1 (Loja): y = 10 to 140
      drawViaContent(doc, 10, 'Via da Loja (1ª Via)');

      // Draw dotted cutting line in middle
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      for (let i = 4; i < 206; i += 4) {
        doc.line(i, 148.5, i + 2, 148.5);
      }
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(150, 150, 150);
      doc.text('CORTE AQUI PARA SEPARAR AS VIAS', 90, 147.5);

      // Via 2 (Cliente): y = 155 to 285
      drawViaContent(doc, 155, 'Via do Cliente (2ª Via)');

      doc.save(`OS-${orderNumber}-${clientName.toLowerCase().replace(/\s+/g, '-')}.pdf`);

      toast({
        title: 'Sucesso',
        description: 'Ordem de Serviço PDF gerada e baixada com sucesso!',
      });
      
      // Save order to LocalStorage/Firebase
      const newVenda: Venda = {
        id: orderNumber,
        clienteId: initialVenda?.clienteId || `cli-${Math.floor(1000 + Math.random() * 9000)}`,
        clienteNome: clientName,
        clienteCpf: clientCpf,
        clienteEmail: clientEmail,
        clienteEndereco: clientAddress,
        clienteTelefone: clientPhone,
        produtos: [
          { id: 'arm-id', nome: frameModel, quantidade: 1, precoVenda: priceTotal * 0.4, precoCusto: priceTotal * 0.2 },
          { id: 'lens-id', nome: lensType, quantidade: 1, precoVenda: priceTotal * 0.6, precoCusto: priceTotal * 0.3 }
        ],
        valorTotal: priceTotal,
        custoTotal: priceTotal * 0.5,
        lucroTotal: priceTotal * 0.5,
        receita: {
          esfericoOD,
          esfericoOE,
          cilindricoOD,
          cilindricoOE,
          eixoOD,
          eixoOE,
          adicao
        },
        status: initialVenda?.status || 'recebido',
        dataVenda: orderDate
      };

      await saveItem('vendas', newVenda);
      if (onSaveSuccess) onSaveSuccess();

    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao gerar o PDF da Ordem de Serviço.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-6xl mx-auto bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-xl">
      {/* 1. INPUT FORM */}
      <div className="flex-1 space-y-4 max-h-[80vh] overflow-y-auto pr-2">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="text-primary h-5.5 w-5.5" /> Gerar Ordem de Serviço (O.S.)
          </h2>
          <span className="text-xs text-muted-foreground bg-slate-800 px-3 py-1 rounded-full font-bold">2 Vias A6 (A4)</span>
        </div>

        {/* Info */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Número do Pedido</label>
            <input
              type="text"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Data do Pedido</label>
            <input
              type="date"
              value={orderDate}
              onChange={(e) => setOrderDate(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
            />
          </div>
        </div>

        {/* Client Fields */}
        <div className="border-t border-slate-800 pt-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wide mb-3 flex items-center gap-1.5"><User className="h-4 w-4" /> Dados do Cliente</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">Nome Completo</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">CPF</label>
              <input
                type="text"
                value={clientCpf}
                onChange={(e) => setClientCpf(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">Telefone</label>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">E-mail</label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="text-[9px] uppercase font-bold text-slate-400">Endereço Completo</label>
              <input
                type="text"
                value={clientAddress}
                onChange={(e) => setClientAddress(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              />
            </div>
          </div>
        </div>

        {/* Prescription Fields */}
        <div className="border-t border-slate-800 pt-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wide mb-3 flex items-center gap-1.5"><Eye className="h-4 w-4" /> Receita Visual</h3>
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] text-slate-400 font-bold mb-1">
            <div>Olho</div>
            <div>Esférico</div>
            <div>Cilíndrico</div>
            <div>Eixo</div>
          </div>
          {/* OD Row */}
          <div className="grid grid-cols-4 gap-2 items-center mb-2">
            <span className="text-xs font-bold text-slate-350">OD</span>
            <input
              type="text"
              value={esfericoOD}
              onChange={(e) => setEsfericoOD(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white"
              placeholder="0.00"
            />
            <input
              type="text"
              value={cilindricoOD}
              onChange={(e) => setCilindricoOD(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white"
              placeholder="0.00"
            />
            <input
              type="text"
              value={eixoOD}
              onChange={(e) => setEixoOD(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white"
              placeholder="Eixo"
            />
          </div>
          {/* OE Row */}
          <div className="grid grid-cols-4 gap-2 items-center mb-3">
            <span className="text-xs font-bold text-slate-350">OE</span>
            <input
              type="text"
              value={esfericoOE}
              onChange={(e) => setEsfericoOE(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white"
              placeholder="0.00"
            />
            <input
              type="text"
              value={cilindricoOE}
              onChange={(e) => setCilindricoOE(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white"
              placeholder="0.00"
            />
            <input
              type="text"
              value={eixoOE}
              onChange={(e) => setEixoOE(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white"
              placeholder="Eixo"
            />
          </div>
          {/* Adicao */}
          <div className="flex flex-col gap-1 max-w-[150px]">
            <label className="text-[9px] uppercase font-bold text-slate-400">Adição (Presbiopia)</label>
            <input
              type="text"
              value={adicao}
              onChange={(e) => setAdicao(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
              placeholder="Ex: +2.00"
            />
          </div>
        </div>

        {/* Glasses Specifications */}
        <div className="border-t border-slate-800 pt-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wide mb-3 flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Detalhes da Venda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">Modelo da Armação</label>
              <input
                type="text"
                value={frameModel}
                onChange={(e) => setFrameModel(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">Tipo de Lente</label>
              <input
                type="text"
                value={lensType}
                onChange={(e) => setLensType(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">Valor Cobrado (R$)</label>
              <input
                type="number"
                value={priceTotal}
                onChange={(e) => setPriceTotal(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">Garantia (Meses)</label>
              <select
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              >
                <option value="6">6 Meses</option>
                <option value="12">12 Meses (1 Ano)</option>
                <option value="24">24 Meses (2 Anos)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-800">
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold gap-2 py-5"
          >
            <Download className="h-4.5 w-4.5" />
            {isExporting ? 'Processando PDF...' : 'Gerar e Salvar O.S.'}
          </Button>
          {onClose && (
            <Button
              variant="outline"
              onClick={onClose}
              className="px-6 py-5 border-slate-800 text-slate-400 hover:text-white"
            >
              Cancelar
            </Button>
          )}
        </div>
      </div>

      {/* 2. ON-SCREEN PREVIEW */}
      <div className="hidden lg:flex w-[380px] flex-col items-center bg-slate-950 p-4 rounded-xl border border-slate-800/80 justify-center">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Pré-visualização A4</h3>
        <div className="w-[300px] h-[424px] bg-white text-slate-900 rounded-sm shadow-2xl relative overflow-hidden text-[5px] p-2 flex flex-col justify-between border border-slate-350">
          
          {/* Via 1 */}
          <div className="border border-slate-300 p-1 bg-slate-50 flex-1 flex flex-col justify-between mb-1">
            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5">
              <span className="font-bold text-slate-800 text-[6px]">TIMEVISION ÓTICA - VIA LOJA</span>
              <span className="text-[5px]">OS: {orderNumber}</span>
            </div>
            <div className="mt-1">
              <span className="font-bold block text-[5.5px]">Cliente: {clientName}</span>
              <span>CPF: {clientCpf} | Endereço: {clientAddress}</span>
            </div>
            <div className="mt-1 border border-slate-200 bg-white p-0.5">
              <div className="font-bold border-b border-slate-100 pb-0.5">RECEITA VISUAL</div>
              <div className="grid grid-cols-4 gap-0.5">
                <span>Olho</span><span>ESF</span><span>CIL</span><span>EIXO</span>
                <span className="font-bold">OD</span><span>{esfericoOD}</span><span>{cilindricoOD}</span><span>{eixoOD || '-'}</span>
                <span className="font-bold">OE</span><span>{esfericoOE}</span><span>{cilindricoOE}</span><span>{eixoOE || '-'}</span>
              </div>
            </div>
            <div className="mt-1">
              <span className="font-bold">Armação:</span> {frameModel} <br />
              <span className="font-bold">Lente:</span> {lensType}
            </div>
            <div className="mt-1 flex justify-between border-t border-slate-200 pt-0.5">
              <span>Assinatura Cliente</span>
              <span className="font-bold text-primary">Total: R$ {priceTotal.toFixed(2)}</span>
            </div>
          </div>

          {/* Cutting Dotted Line */}
          <div className="border-t border-dashed border-slate-300 my-1 text-center text-[4px] text-slate-400 select-none">
            CORTE AQUI PARA SEPARAR VIAS
          </div>

          {/* Via 2 */}
          <div className="border border-slate-300 p-1 bg-slate-50 flex-1 flex flex-col justify-between">
            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5">
              <span className="font-bold text-slate-800 text-[6px]">TIMEVISION ÓTICA - VIA CLIENTE</span>
              <span className="text-[5px]">OS: {orderNumber}</span>
            </div>
            <div className="mt-1">
              <span className="font-bold block text-[5.5px]">Cliente: {clientName}</span>
              <span>CPF: {clientCpf} | Tel: {clientPhone}</span>
            </div>
            <div className="mt-1 border border-slate-200 bg-white p-0.5">
              <div className="font-bold border-b border-slate-100 pb-0.5">RECEITA VISUAL</div>
              <div className="grid grid-cols-4 gap-0.5">
                <span>Olho</span><span>ESF</span><span>CIL</span><span>EIXO</span>
                <span className="font-bold">OD</span><span>{esfericoOD}</span><span>{cilindricoOD}</span><span>{eixoOD || '-'}</span>
                <span className="font-bold">OE</span><span>{esfericoOE}</span><span>{cilindricoOE}</span><span>{eixoOE || '-'}</span>
              </div>
            </div>
            <div className="mt-1">
              <span className="font-bold">Armação:</span> {frameModel} <br />
              <span className="font-bold">Lente:</span> {lensType}
            </div>
            <div className="mt-1 flex justify-between border-t border-slate-200 pt-0.5">
              <span>Assinatura Consultor</span>
              <span className="font-bold text-primary">Total: R$ {priceTotal.toFixed(2)}</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
