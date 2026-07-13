'use client';

import React, { useState, useEffect } from 'react';
import { FileText, Printer, Download, User, ShieldCheck, HeartPulse, RefreshCw, Eye, X } from 'lucide-react';
import { Cliente, Produto, ReceitaVisual, Venda, saveItem, updateItemStatus, auth } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface WorkOrderGeneratorProps {
  initialVenda?: Partial<Venda>;
  onClose?: () => void;
  onSaveSuccess?: () => void;
}

export default function WorkOrderGenerator({ initialVenda, onClose, onSaveSuccess }: WorkOrderGeneratorProps) {
  const { toast } = useToast();
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelPassword, setCancelPassword] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  
  const [orderNumber, setOrderNumber] = useState(initialVenda?.id || `TV-${Math.floor(1000 + Math.random() * 9000)}`);
  const [orderDate, setOrderDate] = useState(initialVenda?.dataVenda || new Date().toISOString().split('T')[0]);
  
  // Client info
  const [clientName, setClientName] = useState(initialVenda?.clienteNome || 'Mariana da Silva');
  const [clientCpf, setClientCpf] = useState(initialVenda?.clienteCpf || '123.456.789-00');
  const [clientEmail, setClientEmail] = useState(initialVenda?.clienteEmail || 'mariana@email.com');
  const [clientPhone, setClientPhone] = useState(initialVenda?.clienteTelefone || '(21) 98888-7777');
  const [clientAddress, setClientAddress] = useState(initialVenda?.clienteEndereco || 'Rua das Flores, 123, Rio de Janeiro - RJ');
  const [clientNascimento, setClientNascimento] = useState('01/01/1990');
  const [clientCep, setClientCep] = useState('00000-000');

  // Eyewear details
  const [frameModel, setFrameModel] = useState(initialVenda?.produtos?.[0]?.nome || 'Timevision Classic Square Black');
  const [lensType, setLensType] = useState(initialVenda?.produtos?.[1]?.nome || 'Lente Zeiss 1.56 DuraVision BlueControl');
  const [priceTotal, setPriceTotal] = useState(initialVenda?.valorTotal || 599.00);
  const [warrantyMonths, setWarrantyMonths] = useState('12');

  // Eye Prescription (Receita)
  const [dataReceita, setDataReceita] = useState(initialVenda?.receita?.dataReceita || initialVenda?.dataVenda || new Date().toLocaleDateString('en-CA'));
  
  const [longeEsfericoOD, setLongeEsfericoOD] = useState(initialVenda?.receita?.longeEsfericoOD || initialVenda?.receita?.esfericoOD || '0.00');
  const [longeEsfericoOE, setLongeEsfericoOE] = useState(initialVenda?.receita?.longeEsfericoOE || initialVenda?.receita?.esfericoOE || '0.00');
  const [longeCilindricoOD, setLongeCilindricoOD] = useState(initialVenda?.receita?.longeCilindricoOD || initialVenda?.receita?.cilindricoOD || '0.00');
  const [longeCilindricoOE, setLongeCilindricoOE] = useState(initialVenda?.receita?.longeCilindricoOE || initialVenda?.receita?.cilindricoOE || '0.00');
  const [longeEixoOD, setLongeEixoOD] = useState(initialVenda?.receita?.longeEixoOD || initialVenda?.receita?.eixoOD || '');
  const [longeEixoOE, setLongeEixoOE] = useState(initialVenda?.receita?.longeEixoOE || initialVenda?.receita?.eixoOE || '');
  const [longeDnpOD, setLongeDnpOD] = useState(initialVenda?.receita?.longeDnpOD || initialVenda?.receita?.dnpOD || '');
  const [longeDnpOE, setLongeDnpOE] = useState(initialVenda?.receita?.longeDnpOE || initialVenda?.receita?.dnpOE || '');
  const [longeAlturaOD, setLongeAlturaOD] = useState(initialVenda?.receita?.longeAlturaOD || initialVenda?.receita?.alturaOD || '');
  const [longeAlturaOE, setLongeAlturaOE] = useState(initialVenda?.receita?.longeAlturaOE || initialVenda?.receita?.alturaOE || '');

  const [pertoEsfericoOD, setPertoEsfericoOD] = useState(initialVenda?.receita?.pertoEsfericoOD || '0.00');
  const [pertoEsfericoOE, setPertoEsfericoOE] = useState(initialVenda?.receita?.pertoEsfericoOE || '0.00');
  const [pertoCilindricoOD, setPertoCilindricoOD] = useState(initialVenda?.receita?.pertoCilindricoOD || '0.00');
  const [pertoCilindricoOE, setPertoCilindricoOE] = useState(initialVenda?.receita?.pertoCilindricoOE || '0.00');
  const [pertoEixoOD, setPertoEixoOD] = useState(initialVenda?.receita?.pertoEixoOD || '');
  const [pertoEixoOE, setPertoEixoOE] = useState(initialVenda?.receita?.pertoEixoOE || '');
  const [pertoDnpOD, setPertoDnpOD] = useState(initialVenda?.receita?.pertoDnpOD || '');
  const [pertoDnpOE, setPertoDnpOE] = useState(initialVenda?.receita?.pertoDnpOE || '');
  const [pertoAlturaOD, setPertoAlturaOD] = useState(initialVenda?.receita?.pertoAlturaOD || '');
  const [pertoAlturaOE, setPertoAlturaOE] = useState(initialVenda?.receita?.pertoAlturaOE || '');

  const [adicao, setAdicao] = useState(initialVenda?.receita?.adicao || '');
  const [codigoLente, setCodigoLente] = useState(initialVenda?.receita?.codigoLente || '');

  // Payment
  const [paymentMethod, setPaymentMethod] = useState(initialVenda?.isDoacao ? 'Doação' : 'Cartão de Crédito');
  const setPointAndCheckDoacao = (val: string) => {
    setPaymentMethod(val);
    if (val === 'Doação') {
      setPriceTotal(0);
    }
  };
  const [installments, setInstallments] = useState('1x');
  const [downPayment, setDownPayment] = useState('0.00');
  const [payOnDelivery, setPayOnDelivery] = useState(initialVenda?.pagamento?.pagamentoNaEntrega || false);
  const [laboratorioId, setLaboratorioId] = useState(initialVenda?.laboratorioId || '');
  const [laboratorios, setLaboratorios] = useState<any[]>([]);

  const [vendedorId, setVendedorId] = useState(initialVenda?.vendedorId || '');
  const [eventoId, setEventoId] = useState(initialVenda?.eventoId || '');
  const [eventos, setEventos] = useState<any[]>([]);
  const [equipe, setEquipe] = useState<any[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('tv_admin_user');
      if (stored) {
        try {
          setCurrentUser(JSON.parse(stored));
        } catch (e) {}
      }
    }
  }, []);

  useEffect(() => {
    // Fetch detailed client info to get DOB and CEP
    const fetchClient = async () => {
      try {
        const { getItemById, getItems } = await import('@/lib/firebase');
        
        if (initialVenda?.clienteId) {
          const cliente = await getItemById<any>('clientes', initialVenda.clienteId);
          if (cliente) {
            setClientNascimento(cliente.dataNascimento || '');
            setClientCep(cliente.cep || '');
          }
        }
        
        const labs = await getItems<any>('laboratorios');
        setLaboratorios(labs || []);
        
        const evs = await getItems<any>('eventos');
        setEventos(evs || []);
        
        const eq = await getItems<any>('equipe');
        setEquipe(eq || []);
      } catch (e) {
        console.error(e);
      }
    };
    fetchClient();
  }, [initialVenda]);

  const getLogoBase64 = (): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/png'));
        } else {
          resolve('');
        }
      };
      img.onerror = () => resolve('');
      img.src = '/logos/1.black-nobg.svg';
    });
  };

  const drawViaContent = (doc: any, yOffset: number, viaTitle: string, logoDataUrl?: string) => {
    // Outer border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(8, yOffset, 194, 140);

    // Header Area
    const isOrcamento = initialVenda?.status === 'orcamento';
    const docTitle = isOrcamento ? 'PROPOSTA DE ORÇAMENTO' : 'ORDEM DE SERVIÇO';
    
    // Header divider
    const lineStartX = logoDataUrl ? 50 : 8;
    doc.setDrawColor(220, 220, 220);
    doc.line(lineStartX, yOffset + 12, 202, yOffset + 12);
    
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 10, yOffset + 2, 38, 21.5);
      doc.setTextColor(15, 23, 42);
      doc.setFont('Lora', 'bold');
      doc.setFontSize(8.5);
      doc.text(`${docTitle}  -  ${viaTitle.toUpperCase()}`, 50, yOffset + 8.5);
    } else {
      doc.setTextColor(15, 23, 42);
      doc.setFont('Lora', 'bold');
      doc.setFontSize(8.5);
      doc.text(`TIMEVISION ÓTICA  |  ${docTitle}  -  ${viaTitle.toUpperCase()}`, 12, yOffset + 8.5);
    }

    // Order info top right
    doc.setFontSize(8);
    doc.text(`Nº: ${orderNumber}`, 160, yOffset + 8.5);

    doc.setTextColor(15, 23, 42);
    // Draw Header Store Details
    const headerTextX = logoDataUrl ? 50 : 12;
    doc.setFont('Lora', 'normal');
    doc.setFontSize(7.5);
    doc.text('CNPJ: 45.796.902/0001-14  |  Contato: oticastimevision@gmail.com  |  Tel: (21) 97769-6374', headerTextX, yOffset + 17);
    const vendedorNome = initialVenda?.vendedorNome || 'Consultor';
    
    // Parse orderDate correctly (assuming YYYY-MM-DD or ISO)
    const dt = new Date(orderDate);
    const validDate = new Date(dt.getTime() + 7 * 86400000).toLocaleDateString('pt-BR');
    // If orderDate is a simple YYYY-MM-DD string, new Date() parses it as UTC. We must use timeZone: 'UTC' to format it back properly.
    const orderDateFormatted = orderDate.includes('T') ? dt.toLocaleDateString('pt-BR') : dt.toLocaleDateString('pt-BR', { timeZone: 'UTC' });

    if (isOrcamento) {
      doc.text(`Data da Proposta: ${orderDateFormatted}  |  Validade: 7 dias (Até ${validDate})  |  Vendedor: ${vendedorNome}`, headerTextX, yOffset + 21);
    } else {
      doc.text(`Data do Pedido: ${orderDateFormatted}  |  Garantia: ${warrantyMonths} meses  |  Vendedor: ${vendedorNome}`, headerTextX, yOffset + 21);
    }

    // Client Info Box
    doc.setDrawColor(230, 230, 230);
    doc.rect(12, yOffset + 26, 186, 20); // Reduced height from 22 to 20
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('DADOS DO CLIENTE', 15, yOffset + 31);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    
    // Row 1
    doc.text(`Cliente: ${clientName}`, 15, yOffset + 37);
    doc.text(`CPF: ${clientCpf}`, 105, yOffset + 37);
    doc.text(`Nasc: ${clientNascimento || '-'}`, 150, yOffset + 37);

    // Row 2
    const addressStr = `Endereço: ${clientAddress || '-'}`;
    doc.text(addressStr.length > 55 ? addressStr.substring(0, 52) + '...' : addressStr, 15, yOffset + 42);
    doc.text(`CEP: ${clientCep || '-'}`, 105, yOffset + 42);
    doc.text(`Tel: ${clientPhone}`, 150, yOffset + 42);

    // Prescription Table (Exame de Vista)
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    const formattedDataReceita = dataReceita ? new Date(dataReceita).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '';
    doc.text(`RECEITA VISUAL (Data: ${formattedDataReceita})`, 15, yOffset + 60);

    // Grid header
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 247, 250);
    doc.rect(12, yOffset + 62, 186, 6, 'F');
    // Table border
    doc.setLineWidth(0.3);
    doc.rect(12, yOffset + 62, 186, 36, 'S');
    doc.setLineWidth(0.2);

    // ADIÇÃO vertical line
    doc.line(174, yOffset + 62, 174, yOffset + 98);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('ESFÉRICO', 44, yOffset + 66.5, { align: 'center' });
    doc.text('CILÍNDRICO', 70, yOffset + 66.5, { align: 'center' });
    doc.text('EIXO', 96, yOffset + 66.5, { align: 'center' });
    doc.text('DNP', 122, yOffset + 66.5, { align: 'center' });
    doc.text('ALTURA', 148, yOffset + 66.5, { align: 'center' });
    doc.text('ADIÇÃO', 186, yOffset + 66.5, { align: 'center' });
    
    // Grid horizontal lines
    doc.line(12, yOffset + 68, 198, yOffset + 68); // Below header
    doc.line(12, yOffset + 74, 174, yOffset + 74); // Below Longe OD
    doc.line(12, yOffset + 80, 174, yOffset + 80); // Below Longe OE
    
    // Thick separator for Longe/Perto
    doc.setLineWidth(0.6);
    doc.line(12, yOffset + 83, 174, yOffset + 83);
    doc.setLineWidth(0.2);

    doc.line(12, yOffset + 86, 174, yOffset + 86); // Above Perto OD
    doc.line(12, yOffset + 92, 174, yOffset + 92); // Below Perto OD

    // Rows Data
    doc.setFont('Helvetica', 'normal');
    
    // Longe OD
    doc.text('Longe OD', 14, yOffset + 72.5);
    doc.text(longeEsfericoOD || '-', 44, yOffset + 72.5, { align: 'center' });
    doc.text(longeCilindricoOD || '-', 70, yOffset + 72.5, { align: 'center' });
    doc.text(longeEixoOD ? `${longeEixoOD}°` : '-', 96, yOffset + 72.5, { align: 'center' });
    doc.text(longeDnpOD || '-', 122, yOffset + 72.5, { align: 'center' });
    doc.text(longeAlturaOD || '-', 148, yOffset + 72.5, { align: 'center' });

    // Longe OE
    doc.text('Longe OE', 14, yOffset + 78.5);
    doc.text(longeEsfericoOE || '-', 44, yOffset + 78.5, { align: 'center' });
    doc.text(longeCilindricoOE || '-', 70, yOffset + 78.5, { align: 'center' });
    doc.text(longeEixoOE ? `${longeEixoOE}°` : '-', 96, yOffset + 78.5, { align: 'center' });
    doc.text(longeDnpOE || '-', 122, yOffset + 78.5, { align: 'center' });
    doc.text(longeAlturaOE || '-', 148, yOffset + 78.5, { align: 'center' });

    // Perto OD
    doc.text('Perto OD', 14, yOffset + 90.5);
    doc.text(pertoEsfericoOD || '-', 44, yOffset + 90.5, { align: 'center' });
    doc.text(pertoCilindricoOD || '-', 70, yOffset + 90.5, { align: 'center' });
    doc.text(pertoEixoOD ? `${pertoEixoOD}°` : '-', 96, yOffset + 90.5, { align: 'center' });
    doc.text(pertoDnpOD || '-', 122, yOffset + 90.5, { align: 'center' });
    doc.text(pertoAlturaOD || '-', 148, yOffset + 90.5, { align: 'center' });

    // Perto OE
    doc.text('Perto OE', 14, yOffset + 96.5);
    doc.text(pertoEsfericoOE || '-', 44, yOffset + 96.5, { align: 'center' });
    doc.text(pertoCilindricoOE || '-', 70, yOffset + 96.5, { align: 'center' });
    doc.text(pertoEixoOE ? `${pertoEixoOE}°` : '-', 96, yOffset + 96.5, { align: 'center' });
    doc.text(pertoDnpOE || '-', 122, yOffset + 96.5, { align: 'center' });
    doc.text(pertoAlturaOE || '-', 148, yOffset + 96.5, { align: 'center' });

    // Adição Merged Cell
    doc.setFont('Helvetica', 'bold');
    doc.text(adicao || '-', 186, yOffset + 84.5, { align: 'center' });
    doc.setFont('Helvetica', 'normal');


    // Specifications
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('ESPECIFICAÇÕES DOS ÓCULOS', 15, yOffset + 103);
    doc.setFont('Lora', 'normal');
    doc.setFontSize(7.5);
    doc.text(`Armação: ${frameModel}`, 15, yOffset + 108);
    const lensesText = codigoLente ? `Lentes: ${lensType} (${codigoLente})` : `Lentes: ${lensType}`;
    doc.text(lensesText, 15, yOffset + 112);
    
    const showLab = ['laboratorio', 'montagem', 'pronto', 'entregue'].includes(initialVenda?.status || '');
    if (viaTitle === 'Via da Loja (1ª Via)' && showLab) {
      const labName = laboratorioId ? (laboratorios.find(l => l.id === laboratorioId)?.nome || 'Não Especificado') : '-';
      doc.setTextColor(181, 153, 106); // GOLD
      doc.setFont('Lora', 'bold');
      doc.text(`Lab. Responsável: ${labName}`, 15, yOffset + 116);
      doc.setTextColor(15, 23, 42);
    }

    // Financial Details
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('DADOS DE PAGAMENTO', 110, yOffset + 103);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(7.5);
    
    // If not paying on delivery, then it's fully paid now. Down payment logic applies only if paying on delivery.
    const sinalValue = payOnDelivery ? (Number(downPayment) || 0) : priceTotal;
    const balance = priceTotal - sinalValue;

    doc.text(`Forma: ${paymentMethod} (${installments})`, 110, yOffset + 108);
    
    if (payOnDelivery) {
      if (sinalValue > 0) {
        doc.text(`Sinal (Recebido): R$ ${sinalValue.toFixed(2)}`, 110, yOffset + 112);
      } else {
        doc.text(`Sinal: PAGAR NA ENTREGA`, 110, yOffset + 112);
      }
      doc.setFont('Helvetica', 'bold');
      doc.text(`VALOR TOTAL: R$ ${priceTotal.toFixed(2)}`, 160, yOffset + 108);
      doc.setTextColor(220, 38, 38); // Red for balance
      doc.text(`A RECEBER (ENTREGA): R$ ${balance.toFixed(2)}`, 160, yOffset + 112);
      doc.setTextColor(15, 23, 42); // Reset navy
    } else {
      // Fully paid
      doc.text(`Valor Pago (Integral): R$ ${priceTotal.toFixed(2)}`, 110, yOffset + 112);
      doc.setFont('Helvetica', 'bold');
      doc.text(`VALOR TOTAL: R$ ${priceTotal.toFixed(2)}`, 160, yOffset + 112);
    }
    doc.setFont('Helvetica', 'normal');

    // Signatures and Date
    const sigY = yOffset + 125;
    doc.line(15, sigY, 95, sigY);
    doc.setFontSize(7);
    doc.text('Assinatura do Consultor Óptico', 55, sigY + 3.5, { align: 'center' });
    doc.setFont('Helvetica', 'bold');
    doc.text(`Consultor: ${vendedorNome}`, 55, sigY + 7, { align: 'center' });
    doc.setFont('Helvetica', 'normal');

    doc.line(110, sigY, 190, sigY);
    doc.text('Assinatura do Cliente (Aceite e Termos)', 150, sigY + 3.5, { align: 'center' });

    // Terms
    doc.setFontSize(5.5);
    doc.setTextColor(100, 100, 100);
    const terms = isOrcamento 
      ? 'A validade desta proposta é de 7 dias úteis. Valores sujeitos a alteração.'
      : 'Autorizo a confecção dos óculos com as características acima descritas. Estou ciente de que as medidas e valores estão corretos. A garantia cobre defeitos de fabricação da armação pelo período informado. Lentes riscadas, trincadas ou danos causados por mau uso não estão inclusos.';
    const wrappedTerms = doc.splitTextToSize(terms, 186);
    doc.text(wrappedTerms, 105, yOffset + 137, { align: 'center' });
  };

  const drawViaClienteA6 = (doc: any, startX: number, startY: number, logoDataUrl?: string) => {
    // Outer border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(startX, startY, 92, 130);

    const isOrcamento = initialVenda?.status === 'orcamento';
    const titleText = isOrcamento ? 'ORÇAMENTO - CLIENTE' : 'VIA CLIENTE';
    
    // Header divider
    doc.setDrawColor(220, 220, 220);
    doc.line(startX, startY + 14, startX + 92, startY + 14);
    
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', startX + 2, startY + 2, 28, 11.5);
      doc.setTextColor(15, 23, 42);
      doc.setFont('Lora', 'bold');
      doc.setFontSize(8);
      doc.text(titleText, startX + 32, startY + 7);
    } else {
      doc.setTextColor(15, 23, 42);
      doc.setFont('Lora', 'bold');
      doc.setFontSize(7);
      doc.text('TIMEVISION | ' + titleText, startX + 2, startY + 7);
    }

    doc.setFontSize(7);
    doc.text('Nº: ' + orderNumber, startX + 72, startY + 7);

    // Order info below title
    const vendedorNome = initialVenda?.vendedorNome || 'Consultor';
    const dt = new Date(orderDate);
    const formattedOrderDate = orderDate.includes('T') ? dt.toLocaleDateString('pt-BR') : dt.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(5.5);
    const orderInfoX = logoDataUrl ? startX + 32 : startX + 2;
    doc.text(`Data: ${formattedOrderDate} | Gar: ${warrantyMonths}m | Vend: ${vendedorNome.split(' ')[0]}`, orderInfoX, startY + 11.5);

    // Client Info Box
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(245, 247, 250);
    doc.rect(startX + 2, startY + 17, 88, 14, 'F');
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('DADOS DO CLIENTE', startX + 4, startY + 21);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text('Nome: ' + clientName.substring(0, 30), startX + 4, startY + 25);
    doc.text('Tel: ' + clientPhone, startX + 4, startY + 29);

    // Specs
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('ESPECIFICAÇÕES', startX + 4, startY + 37);
    doc.setFont('Lora', 'normal');
    doc.setFontSize(6.5);
    const frameWrap = doc.splitTextToSize('Armação: ' + frameModel, 88);
    doc.text(frameWrap, startX + 4, startY + 41);
    const lensWrap = doc.splitTextToSize('Lentes: ' + lensType, 88);
    doc.text(lensWrap, startX + 4, startY + 45 + ((frameWrap.length - 1) * 3));

    // Financial
    const yFin = startY + 55;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('PAGAMENTO', startX + 4, yFin);
    
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.text('Forma: ' + paymentMethod + (paymentMethod === 'Cartão de Crédito' ? ' (' + installments + ')' : ''), startX + 4, yFin + 4);
    
    const sinalValue = payOnDelivery ? (Number(downPayment) || 0) : priceTotal;
    const balance = priceTotal - sinalValue;
    if (payOnDelivery) {
      doc.text('Sinal: R$ ' + sinalValue.toFixed(2), startX + 4, yFin + 8);
      doc.text('Total: R$ ' + priceTotal.toFixed(2), startX + 45, yFin + 4);
      doc.setTextColor(220, 38, 38);
      doc.setFont('Helvetica', 'bold');
      doc.text('A PAGAR: R$ ' + balance.toFixed(2), startX + 45, yFin + 8);
      doc.setTextColor(15, 23, 42);
    } else {
      doc.text('Valor Pago: R$ ' + priceTotal.toFixed(2), startX + 4, yFin + 8);
      doc.setFont('Helvetica', 'bold');
      doc.text('TOTAL: R$ ' + priceTotal.toFixed(2), startX + 45, yFin + 8);
    }

    doc.setFont('Helvetica', 'normal');
    
    // Tracking instructions
    const yTrack = startY + 70;
    doc.setFillColor(250, 250, 250);
    doc.rect(startX + 2, yTrack, 88, 22, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    doc.text('PRAZO E RASTREAMENTO', startX + 4, yTrack + 5);
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(6.5);
    const trackingText = 'Prazo de Entrega: 15 dias úteis.\n\nAcompanhe o andamento do seu pedido acessando:\nwww.timevision.com.br/rastreamento\nInsira o número do pedido (' + orderNumber + ') ou seu CPF.';
    const wrappedTracking = doc.splitTextToSize(trackingText, 84);
    doc.text(wrappedTracking, startX + 4, yTrack + 9);

    // Terms
    const yTerms = startY + 100;
    doc.setFontSize(5.5);
    doc.setTextColor(100, 100, 100);
    const terms = isOrcamento 
      ? 'Validade desta proposta: 7 dias úteis. Valores sujeitos a alteração.'
      : 'Garantia contra defeitos de fabricação pelo período informado. Mau uso, riscos ou trincas não são cobertos.';
    const wrappedTerms = doc.splitTextToSize(terms, 88);
    doc.text(wrappedTerms, startX + 46, yTerms, { align: 'center' });

    // Signature
    const sigY = startY + 120;
    doc.setDrawColor(15, 23, 42);
    doc.line(startX + 10, sigY, startX + 82, sigY);
    doc.text('Assinatura do Cliente', startX + 46, sigY + 3.5, { align: 'center' });

    // Footer
    doc.setFontSize(5);
    doc.setTextColor(120, 120, 120);
    const footerText = 'CNPJ: 45.796.902/0001-14 | Contato: oticastimevision@gmail.com | Tel: (21) 97769-6374';
    doc.text(footerText, startX + 46, startY + 128, { align: 'center' });
  };

  const drawViaLabA6 = (doc: any, startX: number, startY: number, logoDataUrl?: string) => {
    // Outer border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(startX, startY, 92, 130);

    const isOrcamento = initialVenda?.status === 'orcamento';
    const titleText = isOrcamento ? 'ORÇAMENTO - LAB' : 'VIA LABORATÓRIO';
    
    // Header divider
    doc.setDrawColor(220, 220, 220);
    doc.line(startX, startY + 14, startX + 92, startY + 14);
    
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', startX + 2, startY + 2, 28, 11.5);
      doc.setTextColor(15, 23, 42);
      doc.setFont('Lora', 'bold');
      doc.setFontSize(8);
      doc.text(titleText, startX + 32, startY + 8);
    } else {
      doc.setTextColor(15, 23, 42);
      doc.setFont('Lora', 'bold');
      doc.setFontSize(7);
      doc.text('TIMEVISION | ' + titleText, startX + 2, startY + 8);
    }

    doc.setFontSize(7);
    doc.text('Nº: ' + orderNumber, startX + 70, startY + 8);

    // Client Info Box
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(245, 247, 250);
    doc.rect(startX + 2, startY + 17, 88, 10, 'F');
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.text('Cli: ' + clientName.substring(0, 30), startX + 4, startY + 21);
    doc.setFont('Helvetica', 'normal');
    doc.text('Nasc: ' + (clientNascimento || '-'), startX + 50, startY + 21);
    doc.text('Armação: ' + frameModel.substring(0,35), startX + 4, startY + 25);

    let currentY = startY + 31;
    if (laboratorioId) {
      const labName = laboratorios.find(l => l.id === laboratorioId)?.nome || 'Não Especificado';
      doc.setTextColor(181, 153, 106); // GOLD
      doc.setFont('Lora', 'bold');
      doc.text('Lab: ' + labName, startX + 4, currentY);
      doc.setTextColor(15, 23, 42);
      currentY += 4;
    }
    
    doc.setFont('Lora', 'normal');
    const lensTextWrap = doc.splitTextToSize('Lentes: ' + lensType, 88);
    doc.text(lensTextWrap, startX + 4, currentY);
    currentY += (lensTextWrap.length * 3.5) + 1;

    // Receita (Compact Grid)
    const yGrid = currentY;
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    const formattedDataReceita = dataReceita ? new Date(dataReceita).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : '';
    doc.text('RECEITA VISUAL (' + formattedDataReceita + ')', startX + 4, yGrid);

    // Compact Table
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(245, 247, 250);
    doc.rect(startX + 2, yGrid + 2, 88, 5, 'F');
    // Table border
    doc.setLineWidth(0.3);
    doc.rect(startX + 2, yGrid + 2, 88, 32, 'S');
    doc.setLineWidth(0.2);
    
    // ADIÇÃO vertical line
    doc.line(startX + 78, yGrid + 2, startX + 78, yGrid + 34);

    doc.setFontSize(5);
    
    // Header
    doc.text('ESF', startX + 26, yGrid + 5.5, { align: 'center' });
    doc.text('CIL', startX + 38, yGrid + 5.5, { align: 'center' });
    doc.text('EIXO', startX + 50, yGrid + 5.5, { align: 'center' });
    doc.text('DNP', startX + 61, yGrid + 5.5, { align: 'center' });
    doc.text('ALT', startX + 71, yGrid + 5.5, { align: 'center' });
    doc.text('ADIÇÃO', startX + 84, yGrid + 5.5, { align: 'center' });

    // Rows Grid
    doc.line(startX + 2, yGrid + 7, startX + 90, yGrid + 7);
    doc.line(startX + 2, yGrid + 12, startX + 78, yGrid + 12);
    doc.line(startX + 2, yGrid + 17, startX + 78, yGrid + 17);
    
    doc.setLineWidth(0.6);
    doc.line(startX + 2, yGrid + 19, startX + 78, yGrid + 19); // Thick separator
    doc.setLineWidth(0.2);

    doc.line(startX + 2, yGrid + 21, startX + 78, yGrid + 21);
    doc.line(startX + 2, yGrid + 26, startX + 78, yGrid + 26);
    doc.line(startX + 2, yGrid + 31, startX + 78, yGrid + 31); // bottom border for Perto OE
    // Wait, the table border is 32 high (yGrid + 2 to yGrid + 34)
    // 34 is the bottom.

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(6);

    // Longe OD
    doc.text('Longe OD', startX + 4, yGrid + 10.5);
    doc.text(longeEsfericoOD || '-', startX + 26, yGrid + 10.5, { align: 'center' });
    doc.text(longeCilindricoOD || '-', startX + 38, yGrid + 10.5, { align: 'center' });
    doc.text(longeEixoOD ? longeEixoOD + '°' : '-', startX + 50, yGrid + 10.5, { align: 'center' });
    doc.text(longeDnpOD || '-', startX + 61, yGrid + 10.5, { align: 'center' });
    doc.text(longeAlturaOD || '-', startX + 71, yGrid + 10.5, { align: 'center' });

    // Longe OE
    doc.text('Longe OE', startX + 4, yGrid + 15.5);
    doc.text(longeEsfericoOE || '-', startX + 26, yGrid + 15.5, { align: 'center' });
    doc.text(longeCilindricoOE || '-', startX + 38, yGrid + 15.5, { align: 'center' });
    doc.text(longeEixoOE ? longeEixoOE + '°' : '-', startX + 50, yGrid + 15.5, { align: 'center' });
    doc.text(longeDnpOE || '-', startX + 61, yGrid + 15.5, { align: 'center' });
    doc.text(longeAlturaOE || '-', startX + 71, yGrid + 15.5, { align: 'center' });

    // Perto OD
    doc.text('Perto OD', startX + 4, yGrid + 24.5);
    doc.text(pertoEsfericoOD || '-', startX + 26, yGrid + 24.5, { align: 'center' });
    doc.text(pertoCilindricoOD || '-', startX + 38, yGrid + 24.5, { align: 'center' });
    doc.text(pertoEixoOD ? pertoEixoOD + '°' : '-', startX + 50, yGrid + 24.5, { align: 'center' });
    doc.text(pertoDnpOD || '-', startX + 61, yGrid + 24.5, { align: 'center' });
    doc.text(pertoAlturaOD || '-', startX + 71, yGrid + 24.5, { align: 'center' });

    // Perto OE
    doc.text('Perto OE', startX + 4, yGrid + 29.5);
    doc.text(pertoEsfericoOE || '-', startX + 26, yGrid + 29.5, { align: 'center' });
    doc.text(pertoCilindricoOE || '-', startX + 38, yGrid + 29.5, { align: 'center' });
    doc.text(pertoEixoOE ? pertoEixoOE + '°' : '-', startX + 50, yGrid + 29.5, { align: 'center' });
    doc.text(pertoDnpOE || '-', startX + 61, yGrid + 29.5, { align: 'center' });
    doc.text(pertoAlturaOE || '-', startX + 71, yGrid + 29.5, { align: 'center' });

    // Adição Merged Cell
    doc.setFont('Helvetica', 'bold');
    doc.text(adicao || '-', startX + 84, yGrid + 21, { align: 'center' });

    if (codigoLente) {
      doc.text(`CÓD. LENTE: ${codigoLente}`, startX + 4, yGrid + 40);
    }
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

      const logoDataUrl = await getLogoBase64();

      // Render vertical copies
      // Via 1 (Loja): y = 10 to 150
      drawViaContent(doc, 10, 'Via da Loja (1ª Via)', logoDataUrl);

      // Draw dotted cutting line in middle (Horizontal)
      doc.setDrawColor(180, 180, 180);
      doc.setLineWidth(0.3);
      for (let i = 4; i < 206; i += 4) {
        doc.line(i, 155, i + 2, 155);
      }
      doc.setFont('Helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(150, 150, 150);
      doc.text('CORTE AQUI PARA SEPARAR AS VIAS', 90, 154);

      // Draw dotted cutting line for bottom half (Vertical)
      if (!isOrcamento) {
        for (let i = 160; i < 290; i += 4) {
          doc.line(105, i, 105, i + 2);
        }
      }

      if (isOrcamento) {
        // For Orcamento, the client and store copies should be identical (A5 horizontal)
        drawViaContent(doc, 160, 'Via do Cliente (2ª Via)', logoDataUrl);
      } else {
        // Via 2 (Cliente A6) and Via 3 (Lab A6)
        drawViaClienteA6(doc, 10, 160, logoDataUrl);
        drawViaLabA6(doc, 108, 160, logoDataUrl);
      }

      const docFilename = isOrcamento ? `ORCAMENTO-${orderNumber}` : `OS-${orderNumber}`;
      doc.save(`${docFilename}-${clientName.toLowerCase().replace(/\s+/g, '-')}.pdf`);

      toast({
        title: 'Sucesso',
        description: isOrcamento ? 'Orçamento PDF gerado e baixado com sucesso!' : 'Ordem de Serviço PDF gerada e baixada com sucesso!',
      });
      
      const numInstallments = parseInt(installments) || 1;
      const isParceladoNaoCartao = paymentMethod !== 'Cartão de Crédito' && numInstallments > 1;

      let datasVencimento: { [key: number]: string } = initialVenda?.pagamento?.datasVencimento || {};
      let parcelasPagas: { [key: number]: boolean } = initialVenda?.pagamento?.parcelasPagas || {};

      if (isParceladoNaoCartao) {
        const saleDateObj = new Date(orderDate);
        for (let i = 1; i <= numInstallments; i++) {
          if (!datasVencimento[i]) {
            const dueDate = new Date(saleDateObj.getFullYear(), saleDateObj.getMonth() + i, saleDateObj.getDate());
            datasVencimento[i] = dueDate.toISOString().split('T')[0];
          }
          if (parcelasPagas[i] === undefined) {
            parcelasPagas[i] = false;
          }
        }
        Object.keys(datasVencimento).forEach(keyStr => {
          const k = parseInt(keyStr);
          if (k > numInstallments) {
            delete datasVencimento[k];
            delete parcelasPagas[k];
          }
        });
      } else {
        datasVencimento = {};
        parcelasPagas = {};
      }

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
          { id: 'lens-id', nome: lensType, quantity: 1, precoVenda: priceTotal * 0.6, precoCusto: priceTotal * 0.3 } as any
        ],
        valorTotal: paymentMethod === 'Doação' ? 0 : priceTotal,
        custoTotal: priceTotal * 0.3,
        lucroTotal: paymentMethod === 'Doação' ? -(priceTotal * 0.3) : priceTotal * 0.7,
        receita: {
          longeEsfericoOD,
          longeEsfericoOE,
          longeCilindricoOD,
          longeCilindricoOE,
          longeEixoOD,
          longeEixoOE,
          longeDnpOD,
          longeDnpOE,
          longeAlturaOD,
          longeAlturaOE,
          pertoEsfericoOD,
          pertoEsfericoOE,
          pertoCilindricoOD,
          pertoCilindricoOE,
          pertoEixoOD,
          pertoEixoOE,
          pertoDnpOD,
          pertoDnpOE,
          pertoAlturaOD,
          pertoAlturaOE,
          adicao,
          codigoLente,
          dataReceita
        } as any,
        status: (paymentMethod === 'Doação' ? 'doacao' : (initialVenda?.status || 'recebido')) as any,
        isDoacao: paymentMethod === 'Doação' ? true : (initialVenda?.isDoacao || undefined),
        dataVenda: orderDate,
        pagamento: {
          metodo: paymentMethod,
          parcelas: installments,
          sinal: payOnDelivery ? Number(downPayment) : priceTotal,
          pagamentoNaEntrega: payOnDelivery,
          parcelasPagas: isParceladoNaoCartao ? parcelasPagas : undefined,
          datasVencimento: isParceladoNaoCartao ? datasVencimento : undefined
        } as any,
        laboratorioId: laboratorioId || undefined,
        laboratorioNome: laboratorios.find(l => l.id === laboratorioId)?.nome || undefined,
        vendedorId: vendedorId || undefined,
        vendedorNome: equipe.find(m => m.email === vendedorId)?.nome || initialVenda?.vendedorNome || undefined,
        eventoId: eventoId || undefined,
        validadeOrcamento: isOrcamento ? new Date(new Date(orderDate).getTime() + 7 * 86400000).toISOString().split('T')[0] : undefined
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

  const handleSaveChangesOnly = async () => {
    setIsSaving(true);
    try {
      const numInstallments = parseInt(installments) || 1;
      const isParceladoNaoCartao = paymentMethod !== 'Cartão de Crédito' && numInstallments > 1;

      let datasVencimento: { [key: number]: string } = initialVenda?.pagamento?.datasVencimento || {};
      let parcelasPagas: { [key: number]: boolean } = initialVenda?.pagamento?.parcelasPagas || {};

      if (isParceladoNaoCartao) {
        const saleDateObj = new Date(orderDate);
        for (let i = 1; i <= numInstallments; i++) {
          if (!datasVencimento[i]) {
            const dueDate = new Date(saleDateObj.getFullYear(), saleDateObj.getMonth() + i, saleDateObj.getDate());
            datasVencimento[i] = dueDate.toISOString().split('T')[0];
          }
          if (parcelasPagas[i] === undefined) {
            parcelasPagas[i] = false;
          }
        }
        Object.keys(datasVencimento).forEach(keyStr => {
          const k = parseInt(keyStr);
          if (k > numInstallments) {
            delete datasVencimento[k];
            delete parcelasPagas[k];
          }
        });
      } else {
        datasVencimento = {};
        parcelasPagas = {};
      }

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
          { id: 'lens-id', nome: lensType, quantity: 1, precoVenda: priceTotal * 0.6, precoCusto: priceTotal * 0.3 } as any
        ],
        valorTotal: paymentMethod === 'Doação' ? 0 : priceTotal,
        custoTotal: priceTotal * 0.3,
        lucroTotal: paymentMethod === 'Doação' ? -(priceTotal * 0.3) : priceTotal * 0.7,
        receita: {
          longeEsfericoOD,
          longeEsfericoOE,
          longeCilindricoOD,
          longeCilindricoOE,
          longeEixoOD,
          longeEixoOE,
          longeDnpOD,
          longeDnpOE,
          longeAlturaOD,
          longeAlturaOE,
          pertoEsfericoOD,
          pertoEsfericoOE,
          pertoCilindricoOD,
          pertoCilindricoOE,
          pertoEixoOD,
          pertoEixoOE,
          pertoDnpOD,
          pertoDnpOE,
          pertoAlturaOD,
          pertoAlturaOE,
          adicao,
          codigoLente,
          dataReceita
        } as any,
        status: (paymentMethod === 'Doação' ? 'doacao' : (initialVenda?.status || 'recebido')) as any,
        isDoacao: paymentMethod === 'Doação' ? true : (initialVenda?.isDoacao || undefined),
        dataVenda: orderDate,
        pagamento: {
          metodo: paymentMethod,
          parcelas: installments,
          sinal: payOnDelivery ? Number(downPayment) : priceTotal,
          pagamentoNaEntrega: payOnDelivery,
          parcelasPagas: isParceladoNaoCartao ? parcelasPagas : undefined,
          datasVencimento: isParceladoNaoCartao ? datasVencimento : undefined
        } as any,
        laboratorioId: laboratorioId || undefined,
        laboratorioNome: laboratorios.find(l => l.id === laboratorioId)?.nome || undefined,
        vendedorId: vendedorId || undefined,
        vendedorNome: equipe.find(m => m.email === vendedorId)?.nome || initialVenda?.vendedorNome || undefined,
        eventoId: eventoId || undefined,
        validadeOrcamento: isOrcamento ? new Date(new Date(orderDate).getTime() + 7 * 86400000).toISOString().split('T')[0] : undefined
      };

      await saveItem('vendas', newVenda);
      toast({
        title: 'Sucesso',
        description: 'Alterações salvas com sucesso!',
      });
      if (onSaveSuccess) onSaveSuccess();
      if (onClose) onClose();
    } catch (error) {
      console.error('Error saving changes:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Erro ao salvar as alterações.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelOrder = () => {
    setCancelPassword('');
    setShowCancelModal(true);
  };

  const confirmCancelOrder = async () => {
    if (!initialVenda?.id || !cancelPassword) return;
    
    setIsCancelling(true);
    try {
      let isLocalAdmin = false;
      try {
        const userObj = JSON.parse(localStorage.getItem('tv_admin_user') || '{}');
        if (userObj.email === 'admin@timevision.com.br' && cancelPassword === 'timevision123') {
          isLocalAdmin = true;
        }
      } catch (e) {}

      if (!isLocalAdmin) {
        if (!auth.currentUser?.email) {
          toast({ title: 'Erro', description: 'Sessão inválida.', variant: 'destructive' });
          setIsCancelling(false);
          return;
        }
        await signInWithEmailAndPassword(auth, auth.currentUser.email, cancelPassword);
      }
      
      await updateItemStatus('vendas', initialVenda.id, 'cancelado');
      toast({ title: 'Pedido cancelado' });
      if (onSaveSuccess) onSaveSuccess();
      if (onClose) onClose();
    } catch (err) {
      toast({ title: 'Erro de Autenticação', description: 'Senha incorreta. O pedido não foi cancelado.', variant: 'destructive' });
      setIsCancelling(false);
    }
  };

  const isOrcamento = initialVenda?.status === 'orcamento';
  const isLaboratorio = initialVenda?.status !== 'orcamento' && initialVenda?.status !== 'recebido';

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 w-full max-w-[98vw] 2xl:max-w-[1600px] max-h-full overflow-hidden mx-auto bg-slate-900 text-slate-100 rounded-2xl border border-slate-800 shadow-xl">
      {/* 1. INPUT FORM */}
      <div className="flex-1 space-y-4 overflow-y-auto pr-4 pb-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="text-primary h-5.5 w-5.5" /> {isOrcamento ? 'Gerar Proposta de Orçamento' : 'Gerar Ordem de Serviço (O.S.)'}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground bg-slate-800 px-3 py-1 rounded-full font-bold">
              {isOrcamento ? '2 Vias (Loja/Cliente)' : '3 Vias (Loja/Cliente/Lab)'}
            </span>
            {onClose && (
              <button 
                onClick={onClose}
                className="text-slate-400 hover:text-white bg-slate-800 hover:bg-red-500 hover:text-white rounded-full p-1.5 transition-colors"
                title="Fechar Janela"
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
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
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-2 text-center text-[10px] text-slate-400 font-bold mb-1">
            <div>Olho</div>
            <div>Esférico</div>
            <div>Cilíndrico</div>
            <div>Eixo</div>
            <div>DNP</div>
            <div>Altura</div>
          </div>
          
          <div className="text-[10px] font-bold text-slate-500 mb-1 mt-2 uppercase">Longe</div>
          {/* Longe OD Row */}
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-2 items-center mb-2">
            <span className="text-xs font-bold text-slate-350">OD</span>
            <input type="text" value={longeEsfericoOD} onChange={(e) => setLongeEsfericoOD(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="0.00" />
            <input type="text" value={longeCilindricoOD} onChange={(e) => setLongeCilindricoOD(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="0.00" />
            <input type="text" value={longeEixoOD} onChange={(e) => setLongeEixoOD(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="Eixo" />
            <input type="text" value={longeDnpOD} onChange={(e) => setLongeDnpOD(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="DNP" />
            <input type="text" value={longeAlturaOD} onChange={(e) => setLongeAlturaOD(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="Alt" />
          </div>
          {/* Longe OE Row */}
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-2 items-center mb-3">
            <span className="text-xs font-bold text-slate-350">OE</span>
            <input type="text" value={longeEsfericoOE} onChange={(e) => setLongeEsfericoOE(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="0.00" />
            <input type="text" value={longeCilindricoOE} onChange={(e) => setLongeCilindricoOE(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="0.00" />
            <input type="text" value={longeEixoOE} onChange={(e) => setLongeEixoOE(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="Eixo" />
            <input type="text" value={longeDnpOE} onChange={(e) => setLongeDnpOE(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="DNP" />
            <input type="text" value={longeAlturaOE} onChange={(e) => setLongeAlturaOE(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="Alt" />
          </div>

          <div className="text-[10px] font-bold text-slate-500 mb-1 mt-2 uppercase">Perto</div>
          {/* Perto OD Row */}
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-2 items-center mb-2">
            <span className="text-xs font-bold text-slate-350">OD</span>
            <input type="text" value={pertoEsfericoOD} onChange={(e) => setPertoEsfericoOD(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="0.00" />
            <input type="text" value={pertoCilindricoOD} onChange={(e) => setPertoCilindricoOD(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="0.00" />
            <input type="text" value={pertoEixoOD} onChange={(e) => setPertoEixoOD(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="Eixo" />
            <input type="text" value={pertoDnpOD} onChange={(e) => setPertoDnpOD(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="DNP" />
            <input type="text" value={pertoAlturaOD} onChange={(e) => setPertoAlturaOD(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="Alt" />
          </div>
          {/* Perto OE Row */}
          <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-2 items-center mb-3">
            <span className="text-xs font-bold text-slate-350">OE</span>
            <input type="text" value={pertoEsfericoOE} onChange={(e) => setPertoEsfericoOE(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="0.00" />
            <input type="text" value={pertoCilindricoOE} onChange={(e) => setPertoCilindricoOE(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="0.00" />
            <input type="text" value={pertoEixoOE} onChange={(e) => setPertoEixoOE(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="Eixo" />
            <input type="text" value={pertoDnpOE} onChange={(e) => setPertoDnpOE(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="DNP" />
            <input type="text" value={pertoAlturaOE} onChange={(e) => setPertoAlturaOE(e.target.value)} className="bg-slate-950 border border-slate-800 rounded-lg p-1.5 text-center text-xs text-white" placeholder="Alt" />
          </div>
          {/* Adição and Código da Lente */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/50">
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-400">Adição</label>
              <input type="text" value={adicao} onChange={(e) => setAdicao(e.target.value)} placeholder="+0.00" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[9px] uppercase font-bold text-slate-400">Cód. da Lente</label>
              <input type="text" value={codigoLente} onChange={(e) => setCodigoLente(e.target.value)} placeholder="Ref/Código" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-xs text-white" />
            </div>
          </div>
        </div>

        {/* Glasses Specifications */}
        <div className="border-t border-slate-800 pt-3">
          <h3 className="text-xs font-bold text-primary uppercase tracking-wide mb-3 flex items-center gap-1.5"><ShieldCheck className="h-4 w-4" /> Detalhes da Venda</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentUser?.email === 'admin@timevision.com.br' && (
              <>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Consultor / Vendedor (Permissão Admin)</label>
                  <select
                    value={vendedorId}
                    onChange={(e) => setVendedorId(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                  >
                    <option value="">Selecione o consultor...</option>
                    <option value="admin@timevision.com.br">Administrador</option>
                    {equipe.map((member) => (
                      <option key={member.email} value={member.email}>{member.nome}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[9px] uppercase font-bold text-slate-400">Vincular a Evento (Permissão Admin)</label>
                  <select
                    value={eventoId}
                    onChange={(e) => setEventoId(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                  >
                    <option value="">Selecione a origem...</option>
                    <option value="loja">Loja Física</option>
                    {eventos.map((ev) => (
                      <option key={ev.id} value={ev.id}>{ev.nome}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
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
              <label className="text-[9px] uppercase font-bold text-slate-400">Laboratório Responsável</label>
              <select
                value={laboratorioId}
                onChange={(e) => setLaboratorioId(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              >
                <option value="">Selecione um laboratório</option>
                {laboratorios.map((lab) => (
                  <option key={lab.id} value={lab.id}>{lab.nome}</option>
                ))}
              </select>
            </div>
            
            {/* Pagamento */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-[9px] uppercase font-bold text-slate-400">Forma de Pagamento</label>
                <div className="flex items-center gap-1.5">
                  <input 
                    type="checkbox" 
                    id="payDelivery" 
                    checked={payOnDelivery}
                    onChange={(e) => setPayOnDelivery(e.target.checked)}
                    className="w-3 h-3 rounded border-slate-700 bg-slate-900"
                  />
                  <label htmlFor="payDelivery" className="text-[9px] uppercase font-bold text-slate-400 cursor-pointer">
                    Pagar na Entrega
                  </label>
                </div>
              </div>
              <select
                value={paymentMethod}
                onChange={(e) => setPointAndCheckDoacao(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              >
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Pix">Pix</option>
                <option value="Boleto">Boleto</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Doação">Doação / Cortesia</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">Parcelamento</label>
              <select
                value={installments}
                onChange={(e) => setInstallments(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              >
                <option value="1x">1x (À vista)</option>
                <option value="2x">2x</option>
                <option value="3x">3x</option>
                <option value="4x">4x</option>
                <option value="5x">5x</option>
                <option value="6x">6x</option>
                <option value="10x">10x</option>
                <option value="12x">12x</option>
              </select>
            </div>

            {payOnDelivery && (
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-slate-400">Sinal Recebido (R$)</label>
                <input
                  type="number"
                  step="any"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">Valor Total (R$)</label>
              <input
                type="number"
                step="any"
                value={priceTotal}
                onChange={(e) => setPriceTotal(Number(e.target.value))}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              />
            </div>
            {payOnDelivery && priceTotal - (Number(downPayment) || 0) > 0 ? (
              <div className="flex flex-col gap-1">
                <label className="text-[9px] uppercase font-bold text-red-500">Valor a Receber na Entrega (R$)</label>
                <div className="bg-slate-900 border border-red-500/30 text-red-400 rounded-lg p-2 text-sm font-bold">
                  {(priceTotal - (Number(downPayment) || 0)).toFixed(2)}
                </div>
              </div>
            ) : null}
            <div className="flex flex-col gap-1">
              <label className="text-[9px] uppercase font-bold text-slate-400">Garantia (Meses)</label>
              <select
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
              >
                <option value="3">3 Meses</option>
                <option value="6">6 Meses</option>
                <option value="12">12 Meses (1 Ano)</option>
                <option value="24">24 Meses (2 Anos)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-800">
          {initialVenda?.id && (
            <Button
              onClick={handleSaveChangesOnly}
              disabled={isSaving}
              type="button"
              className="flex-1 bg-green-700 hover:bg-green-600 text-white text-sm font-bold gap-2 py-5"
            >
              {isSaving ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          )}
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-bold gap-2 py-5"
          >
            <Download className="h-4.5 w-4.5" />
            {isExporting ? 'Processando PDF...' : (isOrcamento ? 'Gerar e Salvar Orçamento' : 'Gerar e Salvar O.S.')}
          </Button>
          {initialVenda?.id && initialVenda?.status !== 'cancelado' && (
            <Button
              variant="outline"
              type="button"
              onClick={handleCancelOrder}
              className="px-6 py-5 border-red-900/50 text-red-500 hover:bg-red-950 hover:text-red-400"
            >
              Cancelar Pedido
            </Button>
          )}
        </div>
      </div>

      {/* 2. ON-SCREEN PREVIEW */}
      <div className="hidden lg:flex flex-1 min-w-[420px] max-w-[500px] flex-col items-center bg-slate-950 p-6 rounded-xl border border-slate-800/80 justify-center">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Pré-visualização A4</h3>
        <div className="w-[300px] h-[424px] bg-white text-slate-900 rounded-sm shadow-2xl relative overflow-hidden text-[5px] p-2 flex flex-col justify-between border border-slate-350">
          
          {/* Via 1 */}
          <div className="border border-slate-300 p-1 bg-slate-50 flex-1 flex flex-col justify-between mb-1">
            <div className="flex justify-between items-center border-b border-slate-200 pb-0.5">
              <div className="flex items-center gap-1.5">
                <img src="/logos/1.black-nobg.svg" className="h-[12px] w-auto opacity-90" alt="Logo" />
                <div className="flex flex-col border-l border-slate-300 pl-1.5">
                  <span className="font-bold text-slate-800 text-[6px]">{isOrcamento ? 'ORÇAMENTO' : 'VIA LOJA'}</span>
                  <span className="text-[4px] text-slate-500">CNPJ: 45.796.902/0001-14</span>
                </div>
              </div>
              <span className="text-[5px]">{isOrcamento ? 'Pedido:' : 'OS:'} {orderNumber}</span>
            </div>
            <div className="mt-1">
              <span className="font-bold block text-[5.5px]">Cliente: {clientName}</span>
              <span>CPF: {clientCpf} | Nasc: {clientNascimento || '01/01/1990'}</span><br/>
              <span>Endereço: {clientAddress} | CEP: {clientCep || '00000-000'}</span>
            </div>
            <div className="mt-1 border border-slate-200 bg-white p-0.5">
              <div className="flex justify-between font-bold border-b border-slate-100 pb-0.5">
                <span>RECEITA VISUAL</span>
                <span className="font-normal text-[4px]">Data: {dataReceita ? new Date(dataReceita).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : ''}</span>
              </div>
              <div className="grid grid-cols-[auto_auto_auto_auto_auto_auto_auto] gap-0.5 text-[4px] leading-tight mt-0.5">
                <span></span><span className="font-bold">Olho</span><span className="font-bold">ESF</span><span className="font-bold">CIL</span><span className="font-bold">EIXO</span><span className="font-bold">DNP</span><span className="font-bold">ALT</span>
                <span className="font-bold text-[4px] text-slate-400">L</span><span className="font-bold">OD</span><span>{longeEsfericoOD}</span><span>{longeCilindricoOD}</span><span>{longeEixoOD || '-'}</span><span>{longeDnpOD || '-'}</span><span>{longeAlturaOD || '-'}</span>
                <span className="font-bold text-[4px] text-slate-400">O</span><span className="font-bold">OE</span><span>{longeEsfericoOE}</span><span>{longeCilindricoOE}</span><span>{longeEixoOE || '-'}</span><span>{longeDnpOE || '-'}</span><span>{longeAlturaOE || '-'}</span>
                
                <span className="font-bold text-[4px] text-slate-400 mt-0.5">P</span><span className="font-bold mt-0.5">OD</span><span className="mt-0.5">{pertoEsfericoOD}</span><span className="mt-0.5">{pertoCilindricoOD}</span><span className="mt-0.5">{pertoEixoOD || '-'}</span><span className="mt-0.5">{pertoDnpOD || '-'}</span><span className="mt-0.5">{pertoAlturaOD || '-'}</span>
                <span className="font-bold text-[4px] text-slate-400">E</span><span className="font-bold">OE</span><span>{pertoEsfericoOE}</span><span>{pertoCilindricoOE}</span><span>{pertoEixoOE || '-'}</span><span>{pertoDnpOE || '-'}</span><span>{pertoAlturaOE || '-'}</span>
              </div>
              {adicao && <div className="text-[4px] font-bold mt-0.5 border-t border-slate-100 pt-0.5">ADIÇÃO: {adicao}</div>}
            </div>
            <div className="mt-1">
              <span className="font-bold">Armação:</span> {frameModel} <br />
              <span className="font-bold">Lente:</span> {lensType} {codigoLente ? `(${codigoLente})` : ''}
              {laboratorioId && isLaboratorio && (
                <>
                  <br />
                  <span className="font-bold text-primary">Lab. Responsável:</span> {laboratorios.find(l => l.id === laboratorioId)?.nome}
                </>
              )}
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
              <div className="flex items-center gap-1.5">
                <img src="/logos/1.black-nobg.svg" className="h-[12px] w-auto opacity-90" alt="Logo" />
                <div className="flex flex-col border-l border-slate-300 pl-1.5">
                  <span className="font-bold text-slate-800 text-[6px]">{isOrcamento ? 'ORÇAMENTO' : 'VIA CLIENTE'}</span>
                  <span className="text-[4px] text-slate-500">CNPJ: 45.796.902/0001-14</span>
                </div>
              </div>
              <span className="text-[5px]">{isOrcamento ? 'Pedido:' : 'OS:'} {orderNumber}</span>
            </div>
            <div className="mt-1">
              <span className="font-bold block text-[5.5px]">Cliente: {clientName}</span>
              <span>CPF: {clientCpf} | Nasc: {clientNascimento || '01/01/1990'}</span><br/>
              <span>Tel: {clientPhone} | CEP: {clientCep || '00000-000'}</span>
            </div>
            <div className="mt-1 border border-slate-200 bg-white p-0.5">
              <div className="flex justify-between font-bold border-b border-slate-100 pb-0.5">
                <span>RECEITA VISUAL</span>
                <span className="font-normal text-[4px]">Data: {dataReceita ? new Date(dataReceita).toLocaleDateString('pt-BR', { timeZone: 'UTC' }) : ''}</span>
              </div>
              <div className="grid grid-cols-[auto_auto_auto_auto_auto_auto_auto] gap-0.5 text-[4px] leading-tight mt-0.5">
                <span></span><span className="font-bold">Olho</span><span className="font-bold">ESF</span><span className="font-bold">CIL</span><span className="font-bold">EIXO</span><span className="font-bold">DNP</span><span className="font-bold">ALT</span>
                <span className="font-bold text-[4px] text-slate-400">L</span><span className="font-bold">OD</span><span>{longeEsfericoOD}</span><span>{longeCilindricoOD}</span><span>{longeEixoOD || '-'}</span><span>{longeDnpOD || '-'}</span><span>{longeAlturaOD || '-'}</span>
                <span className="font-bold text-[4px] text-slate-400">O</span><span className="font-bold">OE</span><span>{longeEsfericoOE}</span><span>{longeCilindricoOE}</span><span>{longeEixoOE || '-'}</span><span>{longeDnpOE || '-'}</span><span>{longeAlturaOE || '-'}</span>
                
                <span className="font-bold text-[4px] text-slate-400 mt-0.5">P</span><span className="font-bold mt-0.5">OD</span><span className="mt-0.5">{pertoEsfericoOD}</span><span className="mt-0.5">{pertoCilindricoOD}</span><span className="mt-0.5">{pertoEixoOD || '-'}</span><span className="mt-0.5">{pertoDnpOD || '-'}</span><span className="mt-0.5">{pertoAlturaOD || '-'}</span>
                <span className="font-bold text-[4px] text-slate-400">E</span><span className="font-bold">OE</span><span>{pertoEsfericoOE}</span><span>{pertoCilindricoOE}</span><span>{pertoEixoOE || '-'}</span><span>{pertoDnpOE || '-'}</span><span>{pertoAlturaOE || '-'}</span>
              </div>
              {adicao && <div className="text-[4px] font-bold mt-0.5 border-t border-slate-100 pt-0.5">ADIÇÃO: {adicao}</div>}
            </div>
            <div className="mt-1">
              <span className="font-bold">Armação:</span> {frameModel} <br />
              <span className="font-bold">Lente:</span> {lensType} {codigoLente ? `(${codigoLente})` : ''}
            </div>
            <div className="mt-1 flex justify-between border-t border-slate-200 pt-0.5">
              <span>Assinatura Consultor</span>
              <span className="font-bold text-primary">Total: R$ {priceTotal.toFixed(2)}</span>
            </div>
          </div>

        </div>
      </div>
      
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-sm shadow-2xl flex flex-col gap-4">
            <h3 className="text-lg font-bold text-white text-center">Deseja cancelar este pedido?</h3>
            <p className="text-sm text-slate-400 text-center">Para confirmar o cancelamento, digite sua senha de acesso abaixo:</p>
            
            <input 
              type="password"
              value={cancelPassword}
              onChange={(e) => setCancelPassword(e.target.value)}
              placeholder="Sua senha..."
              className="bg-slate-950 border border-slate-700 p-3 rounded-lg text-white text-center tracking-widest focus:outline-none focus:border-red-500 transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && confirmCancelOrder()}
            />
            
            <div className="flex gap-3 mt-2">
              <Button 
                variant="outline" 
                className="flex-1 border-slate-700 text-slate-300 hover:text-white"
                onClick={() => setShowCancelModal(false)}
                disabled={isCancelling}
                type="button"
              >
                Voltar
              </Button>
              <Button 
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={confirmCancelOrder}
                disabled={!cancelPassword || isCancelling}
                type="button"
              >
                {isCancelling ? 'Cancelando...' : 'Confirmar'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
