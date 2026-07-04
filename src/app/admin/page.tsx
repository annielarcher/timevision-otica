'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Package, ShoppingCart, Sparkles, LogOut, Lock, 
  Search, Plus, Trash2, Edit3, CheckCircle, Clock, Eye, AlertTriangle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  getItems, saveItem, deleteItem, updateItemStatus,
  Cliente, Produto, Venda, ReceitaVisual, auth
} from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import dynamic from 'next/dynamic';

const WorkOrderGenerator = dynamic(() => import('@/components/WorkOrderGenerator'), { ssr: false });
const MarketingFlyer = dynamic(() => import('@/components/MarketingFlyer'), { ssr: false });
const GOLD = "#B5996A";

export default function AdminPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isFirebaseMode, setIsFirebaseMode] = useState(false);
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'dash' | 'pdv' | 'clientes' | 'estoque' | 'mkt'>('dash');

  // Database states
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);

  // Search and Filter states
  const [searchClient, setSearchClient] = useState('');
  const [searchProduct, setSearchProduct] = useState('');

  // Modals / Editors
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);

  const [activeOSVenda, setActiveOSVenda] = useState<Partial<Venda> | null>(null);

  // PDV Order state
  const [pdvSaleType, setPdvSaleType] = useState<'venda' | 'orcamento'>('venda');
  const [pdvClienteId, setPdvClienteId] = useState('');
  const [pdvFrameId, setPdvFrameId] = useState('');
  const [pdvLensId, setPdvLensId] = useState('');
  const [pdvPriceTotal, setPdvPriceTotal] = useState(0);
  const [pdvEsfOD, setPdvEsfOD] = useState('0.00');
  const [pdvEsfOE, setPdvEsfOE] = useState('0.00');
  const [pdvCilOD, setPdvCilOD] = useState('0.00');
  const [pdvCilOE, setPdvCilOE] = useState('0.00');
  const [pdvEixoOD, setPdvEixoOD] = useState('');
  const [pdvEixoOE, setPdvEixoOE] = useState('');
  const [pdvAdicao, setPdvAdicao] = useState('');

  // 1. Initial Mock Database Setup (LocalStorage)
  const initializeMockData = () => {
    if (typeof window !== 'undefined') {
      const storedClients = localStorage.getItem('tv_clientes');
      const storedProducts = localStorage.getItem('tv_produtos');
      const storedSales = localStorage.getItem('tv_vendas');

      if (!storedClients) {
        const mockClients: Cliente[] = [
          { id: 'c-1', nome: 'Mariana da Silva', cpf: '123.456.789-00', email: 'mariana@email.com', telefone: '(21) 98888-7777', endereco: 'Rua das Flores, 123, Rio de Janeiro - RJ', criadoEm: new Date().toISOString() },
          { id: 'c-2', nome: 'Carlos Eduardo', cpf: '987.654.321-11', email: 'carlos@email.com', telefone: '(21) 97777-6666', endereco: 'Av. Central, 450, Niterói - RJ', criadoEm: new Date().toISOString() },
          { id: 'c-3', nome: 'Ana Beatriz Mendes', cpf: '456.123.789-22', email: 'ana@email.com', telefone: '(21) 96666-5555', endereco: 'Rua do Resende, 89, Rio de Janeiro - RJ', criadoEm: new Date().toISOString() }
        ];
        localStorage.setItem('tv_clientes', JSON.stringify(mockClients));
      }

      if (!storedProducts) {
        const mockProducts: Produto[] = [
          { id: 'p-1', nome: 'Timevision Classic Square Black', categoria: 'armação', quantidade: 8, precoCusto: 120, precoVenda: 289 },
          { id: 'p-2', nome: 'Timevision Elegance Gold', categoria: 'armação', quantidade: 2, precoCusto: 150, precoVenda: 319 },
          { id: 'p-3', nome: 'Lente Zeiss 1.56 DuraVision BlueControl', categoria: 'lente', quantidade: 15, precoCusto: 160, precoVenda: 320 },
          { id: 'p-4', nome: 'Lente Essilor Crizal Sapphire', categoria: 'lente', quantidade: 3, precoCusto: 250, precoVenda: 490 }
        ];
        localStorage.setItem('tv_produtos', JSON.stringify(mockProducts));
      }

      if (!storedSales) {
        const mockSales: Venda[] = [
          {
            id: '1001',
            clienteId: 'c-1',
            clienteNome: 'Mariana da Silva',
            clienteCpf: '123.456.789-00',
            clienteEmail: 'mariana@email.com',
            clienteEndereco: 'Rua das Flores, 123, Rio de Janeiro - RJ',
            clienteTelefone: '(21) 98888-7777',
            produtos: [
              { id: 'p-1', nome: 'Timevision Classic Square Black', quantidade: 1, precoVenda: 289, precoCusto: 120 },
              { id: 'p-3', nome: 'Lente Zeiss 1.56 DuraVision BlueControl', quantidade: 1, precoVenda: 320, precoCusto: 160 }
            ],
            valorTotal: 609,
            custoTotal: 280,
            lucroTotal: 329,
            receita: { esfericoOD: '+1.25', esfericoOE: '+1.50', cilindricoOD: '0.00', cilindricoOE: '0.00', eixoOD: '', eixoOE: '', adicao: '' },
            status: 'laboratorio',
            dataVenda: new Date(Date.now() - 86400000).toISOString().split('T')[0]
          },
          {
            id: '1002',
            clienteId: 'c-2',
            clienteNome: 'Carlos Eduardo',
            clienteCpf: '987.654.321-11',
            clienteEmail: 'carlos@email.com',
            clienteEndereco: 'Av. Central, 450, Niterói - RJ',
            clienteTelefone: '(21) 97777-6666',
            produtos: [
              { id: 'p-2', nome: 'Timevision Elegance Gold', quantidade: 1, precoVenda: 319, precoCusto: 150 },
              { id: 'p-4', nome: 'Lente Essilor Crizal Sapphire', quantidade: 1, precoVenda: 490, precoCusto: 250 }
            ],
            valorTotal: 809,
            custoTotal: 400,
            lucroTotal: 409,
            receita: { esfericoOD: '-2.50', esfericoOE: '-2.25', cilindricoOD: '-0.75', cilindricoOE: '-0.50', eixoOD: '90', eixoOE: '85', adicao: '' },
            status: 'pronto',
            dataVenda: new Date(Date.now() - 172800000).toISOString().split('T')[0]
          }
        ];
        localStorage.setItem('tv_vendas', JSON.stringify(mockSales));
      }
    }
  };

  // 2. Fetch Data from Storage/Firebase
  const loadData = async () => {
    try {
      const [cList, pList, vList] = await Promise.all([
        getItems<Cliente>('clientes'),
        getItems<Produto>('produtos'),
        getItems<Venda>('vendas')
      ]);
      setClientes(cList);
      setProdutos(pList);
      setVendas(vList);
    } catch (error) {
      console.error('Error loading DB:', error);
    }
  };

  useEffect(() => {
    initializeMockData();
    // Read login state if preserved
    if (typeof window !== 'undefined') {
      const isAuth = localStorage.getItem('tv_admin_auth') === 'true';
      if (isAuth) {
        setIsAuthenticated(true);
        loadData();
      }
    }
  }, []);

  // Update total price dynamically in PDV
  useEffect(() => {
    const frame = produtos.find(p => p.id === pdvFrameId);
    const lens = produtos.find(p => p.id === pdvLensId);
    let sum = 0;
    if (frame) sum += frame.precoVenda;
    if (lens) sum += lens.precoVenda;
    setPdvPriceTotal(sum);
  }, [pdvFrameId, pdvLensId, produtos]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Fallback / Test bypass static credentials (local mode/demo)
    if (loginEmail === 'admin@timevision.com' && loginPassword === 'timevision123') {
      setIsAuthenticated(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem('tv_admin_auth', 'true');
      }
      loadData();
      toast({
        title: 'Bem-vindo(a) (Bypass de Testes)',
        description: 'Login efetuado no modo local/offline, ignorando o Firebase Auth.',
      });
      return;
    }

    // 2. Se o Firebase estiver configurado e o auth inicializado, tenta autenticação Firebase
    if (auth) {
      try {
        await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        setIsAuthenticated(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('tv_admin_auth', 'true');
        }
        loadData();
        toast({
          title: 'Bem-vindo(a)',
          description: 'Login efetuado com sucesso via Firebase.',
        });
        return;
      } catch (error: any) {
        console.error("Firebase auth error:", error);
        toast({
          variant: 'destructive',
          title: 'Erro de Autenticação Firebase',
          description: error.message || 'E-mail ou senha incorretos.',
        });
        return;
      }
    }

    // Se as credenciais locais falharem e não houver Firebase/outro meio
    toast({
      variant: 'destructive',
      title: 'Erro de Autenticação',
      description: 'E-mail ou senha incorretos.',
    });
  };

  const handleLogout = async () => {
    setIsAuthenticated(false);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tv_admin_auth');
    }
    if (auth) {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("Firebase signout error:", error);
      }
    }
  };

  // 4. Save Customer (Create/Update)
  const handleSaveCliente = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const clientData: Cliente = {
      id: editingCliente?.id || `cli-${Math.floor(1000 + Math.random() * 9000)}`,
      nome: formData.get('nome') as string,
      cpf: formData.get('cpf') as string,
      email: formData.get('email') as string,
      telefone: formData.get('telefone') as string,
      endereco: formData.get('endereco') as string,
      criadoEm: editingCliente?.criadoEm || new Date().toISOString()
    };

    if (!clientData.nome || !clientData.cpf) {
      toast({ variant: 'destructive', title: 'Campos Obrigatórios', description: 'Preencha Nome e CPF.' });
      return;
    }

    await saveItem('clientes', clientData);
    toast({ title: 'Sucesso', description: 'Cliente salvo com sucesso!' });
    setIsClientModalOpen(false);
    setEditingCliente(null);
    setPdvClienteId(clientData.id);
    loadData();
  };

  // 5. Save Product (Create/Update)
  const handleSaveProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const productData: Produto = {
      id: editingProduto?.id || `prod-${Math.floor(1000 + Math.random() * 9000)}`,
      nome: formData.get('nome') as string,
      categoria: formData.get('categoria') as any,
      quantidade: Number(formData.get('quantidade')),
      precoCusto: Number(formData.get('precoCusto')),
      precoVenda: Number(formData.get('precoVenda')),
    };

    if (!productData.nome || !productData.precoVenda) {
      toast({ variant: 'destructive', title: 'Campos Obrigatórios', description: 'Preencha Nome e Preço de Venda.' });
      return;
    }

    await saveItem('produtos', productData);
    toast({ title: 'Sucesso', description: 'Produto cadastrado no estoque!' });
    setIsProductModalOpen(false);
    setEditingProduto(null);
    loadData();
  };

  // 6. Delete Handlers
  const handleDeleteCliente = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este cliente?')) {
      await deleteItem('clientes', id);
      toast({ title: 'Removido', description: 'Cliente excluído do sistema.' });
      loadData();
    }
  };

  const handleDeleteProduto = async (id: string) => {
    if (confirm('Tem certeza que deseja remover este produto do estoque?')) {
      await deleteItem('produtos', id);
      toast({ title: 'Removido', description: 'Produto excluído do estoque.' });
      loadData();
    }
  };

  // 7. POS Sale & OS/Budget Generation Trigger
  const handlePdvSale = (e: React.FormEvent, type: 'venda' | 'orcamento') => {
    e.preventDefault();
    if (!pdvClienteId) {
      toast({ variant: 'destructive', title: 'Dados Incompletos', description: 'Selecione um cliente cadastrado.' });
      return;
    }

    const client = clientes.find(c => c.id === pdvClienteId);
    if (!client) return;

    const frame = produtos.find(p => p.id === pdvFrameId);
    const lens = produtos.find(p => p.id === pdvLensId);

    const saleProducts = [];
    if (frame) {
      saleProducts.push({ id: frame.id, nome: frame.nome, quantidade: 1, precoVenda: frame.precoVenda, precoCusto: frame.precoCusto });
      // Decrement stock in LocalStorage/DB ONLY if it is a real sale, NOT a budget proposal!
      if (type === 'venda') {
        saveItem('produtos', { ...frame, quantidade: Math.max(0, frame.quantidade - 1) });
      }
    }
    if (lens) {
      saleProducts.push({ id: lens.id, nome: lens.nome, quantidade: 1, precoVenda: lens.precoVenda, precoCusto: lens.precoCusto });
      // Decrement stock
      if (type === 'venda') {
        saveItem('produtos', { ...lens, quantidade: Math.max(0, lens.quantidade - 1) });
      }
    }

    // Set O.S. generator data to trigger the modal/WorkOrder view
    const saleId = `${Math.floor(1000 + Math.random() * 9000)}`;
    const pendingVenda: Partial<Venda> = {
      id: saleId,
      clienteId: client.id,
      clienteNome: client.nome,
      clienteCpf: client.cpf,
      clienteEmail: client.email,
      clienteEndereco: client.endereco,
      clienteTelefone: client.telefone,
      produtos: saleProducts,
      valorTotal: pdvPriceTotal,
      receita: {
        esfericoOD: pdvEsfOD,
        esfericoOE: pdvEsfOE,
        cilindricoOD: pdvCilOD,
        cilindricoOE: pdvCilOE,
        eixoOD: pdvEixoOD,
        eixoOE: pdvEixoOE,
        adicao: pdvAdicao
      },
      status: type === 'venda' ? 'recebido' : 'orcamento',
      dataVenda: orderDate,
      validadeOrcamento: type === 'orcamento' ? new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] : undefined
    };

    setActiveOSVenda(pendingVenda);
  };

  // Financial Calculators
  const realSales = vendas.filter(v => v.status !== 'orcamento');
  const totalRevenue = realSales.reduce((acc, curr) => acc + curr.valorTotal, 0);
  const totalCost = realSales.reduce((acc, curr) => acc + (curr.custoTotal || curr.valorTotal * 0.5), 0);
  const totalProfit = totalRevenue - totalCost;
  const averageMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  const lowStockCount = produtos.filter(p => p.quantidade <= 3).length;

  const filteredClientes = clientes.filter(c => 
    c.nome.toLowerCase().includes(searchClient.toLowerCase()) || 
    c.cpf.includes(searchClient)
  );

  const filteredProdutos = produtos.filter(p => 
    p.nome.toLowerCase().includes(searchProduct.toLowerCase())
  );

  // Status updates in dashboard
  const handleUpdateStatus = async (vendaId: string, newStatus: any) => {
    await updateItemStatus('vendas', vendaId, newStatus);
    toast({ title: 'Status Atualizado', description: `Pedido #${vendaId} alterado com sucesso.` });
    loadData();
  };

  // Get current date string for input
  const orderDate = new Date().toISOString().split('T')[0];

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center bg-slate-950 p-4">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent pointer-events-none" />
          <CardHeader className="text-center relative z-10">
            <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mx-auto mb-4 border border-primary/30">
              <Lock className="h-6 w-6" />
            </div>
            <CardTitle className="text-2xl font-black font-headline">Acesso Restrito</CardTitle>
            <CardDescription>Insira as credenciais para acessar o painel PDV Timevision.</CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">E-mail</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="admin@timevision.com"
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-white"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Senha</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-white"
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5 font-bold">
                Entrar no Painel
              </Button>
              {process.env.NODE_ENV === 'development' && (
                <Button 
                  type="button" 
                  onClick={() => {
                    setIsAuthenticated(true);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('tv_admin_auth', 'true');
                    }
                    loadData();
                    toast({
                      title: 'Modo de Testes Ativo',
                      description: 'Entrando sem necessidade de credenciais.',
                    });
                  }}
                  variant="outline" 
                  className="w-full border-slate-800 text-slate-400 font-bold"
                >
                  Pular Autenticação (Modo Desenvolvedor)
                </Button>
              )}
            </form>
          </CardContent>
          <div className="p-4 bg-slate-950 border-t border-slate-900 text-[10px] text-center text-slate-500">
            Senha Padrão local: <span className="text-primary font-bold">timevision123</span>
          </div>
        </Card>
      </div>
    );
  }

  // Render OS Generator Modal View if active
  if (activeOSVenda) {
    return (
      <div className="bg-slate-950 min-h-screen py-12 px-4">
        <WorkOrderGenerator
          initialVenda={activeOSVenda}
          onClose={() => {
            setActiveOSVenda(null);
            // Reset PDV inputs
            setPdvClienteId('');
            setPdvFrameId('');
            setPdvLensId('');
            setPdvPriceTotal(0);
          }}
          onSaveSuccess={() => {
            loadData();
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-brand-off-white flex flex-col font-body">
      
      {/* HEADER BAR */}
      <div className="px-5 py-4 flex items-center justify-between sticky top-0 z-40" style={{ background: "#161616", borderBottom: `1px solid ${GOLD}20` }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0" style={{ background: GOLD }}>
            <span className="font-display text-brand-graphite font-bold text-sm">TV</span>
          </div>
          <div>
            <p className="font-tagline text-brand-off-white tracking-widest text-xs uppercase">Painel PDV & Gestão</p>
            <p className="font-body text-brand-off-white/40 text-[10px]">Timevision Ótica — Módulo Corporativo</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs hidden sm:block font-tagline text-brand-gold tracking-widest">
            {new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short", year: "numeric" })}
          </span>
          <button 
            onClick={handleLogout} 
            className="p-2 rounded-lg bg-red-950/20 text-red-400 hover:bg-red-950/50 transition-colors flex items-center gap-1.5 text-xs font-tagline tracking-wider"
          >
            <LogOut className="h-4 w-4" /> Sair
          </button>
        </div>
      </div>

      {/* HORIZONTAL TAB NAVIGATION */}
      <div className="overflow-x-auto" style={{ background: "#1A1A1A", borderBottom: `1px solid ${GOLD}12` }}>
        <div className="flex px-4">
          {[
            { id: 'dash', Icon: TrendingUp, label: "Dashboard" },
            { id: 'pdv', Icon: ShoppingCart, label: "Nova Venda" },
            { id: 'clientes', Icon: Users, label: "Clientes" },
            { id: 'estoque', Icon: Package, label: "Estoque" },
            { id: 'mkt', Icon: Sparkles, label: "Marketing" }
          ].map(({ id, Icon, label }) => (
            <button 
              key={id} 
              onClick={() => setActiveTab(id as any)} 
              className="flex items-center gap-2 px-6 py-4 text-xs uppercase whitespace-nowrap transition-all border-b-2 font-tagline tracking-widest" 
              style={{ 
                color: activeTab === id ? GOLD : "rgba(249,247,248,0.38)", 
                borderColor: activeTab === id ? GOLD : "transparent" 
              }}
            >
              <Icon size={13} />{label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
        
        {/* TABA 1: DASHBOARD */}
        {activeTab === 'dash' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold">Visão Geral & Finanças</h2>
            
            {/* Financial Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-slate-900 border-slate-800 shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="text-[10px] uppercase font-extrabold text-slate-400">Faturamento Total</CardDescription>
                  <CardTitle className="text-2xl font-black text-white">R$ {totalRevenue.toFixed(2)}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="bg-slate-900 border-slate-800 shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="text-[10px] uppercase font-extrabold text-slate-400">Custo Total Produtos</CardDescription>
                  <CardTitle className="text-2xl font-black text-white">R$ {totalCost.toFixed(2)}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="bg-slate-900 border-slate-800 shadow border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                  <CardDescription className="text-[10px] uppercase font-extrabold text-slate-400">Lucro Líquido</CardDescription>
                  <CardTitle className="text-2xl font-black text-green-400">R$ {totalProfit.toFixed(2)}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="bg-slate-900 border-slate-800 shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="text-[10px] uppercase font-extrabold text-slate-400">Margem Comercial Média</CardDescription>
                  <CardTitle className="text-2xl font-black text-primary">{averageMargin.toFixed(1)}%</CardTitle>
                </CardHeader>
              </Card>
            </div>

            {/* Notifications & Warning alerts */}
            {lowStockCount > 0 && (
              <div className="bg-amber-950/20 border border-amber-800/60 p-4 rounded-xl flex items-center gap-3 text-amber-300">
                <AlertTriangle className="h-6 w-6 shrink-0" />
                <div>
                  <h4 className="font-bold text-sm">Alerta de Estoque Baixo</h4>
                  <p className="text-xs">Existem {lowStockCount} produtos com quantidade igual ou inferior a 3 unidades no estoque.</p>
                </div>
              </div>
            )}

            {/* Sales List & Tracker Status Updates */}
            <Card className="bg-slate-900 border-slate-800 shadow">
              <CardHeader className="border-b border-slate-800 pb-4">
                <CardTitle className="text-lg font-bold">Histórico de Pedidos & Rastreamento</CardTitle>
                <CardDescription>Gerencie o status físico de fabricação dos óculos dos clientes.</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 px-0">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-xs text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-450 uppercase text-[10px] font-bold">
                        <th className="py-3 px-4">Pedido</th>
                        <th className="py-3 px-4">Cliente</th>
                        <th className="py-3 px-4">Itens</th>
                        <th className="py-3 px-4">Valor</th>
                        <th className="py-3 px-4">Data</th>
                        <th className="py-3 px-4 text-center">Status de Confecção</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendas.map((v) => (
                        <tr key={v.id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                          <td className="py-3 px-4 font-bold text-primary">#{v.id}</td>
                          <td className="py-3 px-4 font-semibold">{v.clienteNome}</td>
                          <td className="py-3 px-4 text-slate-400">
                            {v.produtos.map(p => p.nome).join(' + ')}
                          </td>
                          <td className="py-3 px-4 font-black">R$ {v.valorTotal.toFixed(2)}</td>
                          <td className="py-3 px-4">{new Date(v.dataVenda).toLocaleDateString('pt-BR')}</td>
                          <td className="py-3 px-4 text-center">
                            <select
                              value={v.status}
                              onChange={(e) => handleUpdateStatus(v.id, e.target.value)}
                              className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-[11px] text-white focus:outline-none"
                            >
                              <option value="orcamento">Orçamento (7 dias)</option>
                              <option value="recebido">Pedido Recebido</option>
                              <option value="laboratorio">No Laboratório</option>
                              <option value="montagem">Em Montagem</option>
                              <option value="pronto">Pronto p/ Entrega</option>
                              <option value="entregue">Entregue</option>
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button 
                              onClick={() => setActiveOSVenda(v)}
                              size="sm" 
                              variant="ghost" 
                              className="h-8 text-primary hover:text-primary gap-1"
                            >
                              <Eye className="h-3.5 w-3.5" /> {v.status === 'orcamento' ? 'Re-gerar Orçamento' : 'Re-gerar O.S.'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TAB 2: NOVA VENDA */}
        {activeTab === 'pdv' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold">Nova Venda & Cadastro de Receita</h2>
            <Card className="bg-slate-900 border-slate-800 shadow">
              <CardContent className="pt-6">
                <form onSubmit={(e) => handlePdvSale(e, pdvSaleType)} className="space-y-6">
                  {/* Select Customer */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Cliente da Compra</label>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCliente(null);
                            setIsClientModalOpen(true);
                          }}
                          className="text-[10px] font-bold text-primary hover:underline flex items-center gap-1"
                        >
                          <Plus className="h-3 w-3" /> Cadastrar Novo
                        </button>
                      </div>
                      <select
                        value={pdvClienteId}
                        onChange={(e) => setPdvClienteId(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                        required
                      >
                        <option value="">Selecione um cliente...</option>
                        {clientes.map(c => (
                          <option key={c.id} value={c.id}>{c.nome} ({c.cpf})</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selecionar Armação</label>
                      <select
                        value={pdvFrameId}
                        onChange={(e) => setPdvFrameId(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                      >
                        <option value="">Nenhuma armação...</option>
                        {produtos.filter(p => p.categoria === 'armação').map(p => (
                          <option key={p.id} value={p.id}>{p.nome} (Qtd: {p.quantidade}) - R$ {p.precoVenda.toFixed(2)}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Selecionar Lente</label>
                      <select
                        value={pdvLensId}
                        onChange={(e) => setPdvLensId(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                      >
                        <option value="">Nenhuma lente...</option>
                        {produtos.filter(p => p.categoria === 'lente').map(p => (
                          <option key={p.id} value={p.id}>{p.nome} (Qtd: {p.quantidade}) - R$ {p.precoVenda.toFixed(2)}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Eyeglass Prescription (Receita) */}
                  <div className="border-t border-slate-800 pt-4">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Cadastrar Receita de Visão (Para O.S.)</h4>
                    
                    <div className="grid grid-cols-4 gap-4 text-[10px] uppercase font-bold text-slate-400 text-center mb-1">
                      <div>Olho</div>
                      <div>Esférico</div>
                      <div>Cilíndrico</div>
                      <div>Eixo</div>
                    </div>

                    {/* OD Row */}
                    <div className="grid grid-cols-4 gap-4 items-center mb-3">
                      <span className="text-xs font-bold text-slate-350">Olho Direito (OD)</span>
                      <input
                        type="text"
                        value={pdvEsfOD}
                        onChange={(e) => setPdvEsfOD(e.target.value)}
                        placeholder="0.00"
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-center text-sm text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        value={pdvCilOD}
                        onChange={(e) => setPdvCilOD(e.target.value)}
                        placeholder="0.00"
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-center text-sm text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        value={pdvEixoOD}
                        onChange={(e) => setPdvEixoOD(e.target.value)}
                        placeholder="Ex: 90"
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-center text-sm text-white focus:outline-none"
                      />
                    </div>

                    {/* OE Row */}
                    <div className="grid grid-cols-4 gap-4 items-center mb-4">
                      <span className="text-xs font-bold text-slate-350">Olho Esquerdo (OE)</span>
                      <input
                        type="text"
                        value={pdvEsfOE}
                        onChange={(e) => setPdvEsfOE(e.target.value)}
                        placeholder="0.00"
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-center text-sm text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        value={pdvCilOE}
                        onChange={(e) => setPdvCilOE(e.target.value)}
                        placeholder="0.00"
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-center text-sm text-white focus:outline-none"
                      />
                      <input
                        type="text"
                        value={pdvEixoOE}
                        onChange={(e) => setPdvEixoOE(e.target.value)}
                        placeholder="Ex: 85"
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-center text-sm text-white focus:outline-none"
                      />
                    </div>

                    {/* Addition */}
                    <div className="flex flex-col gap-1 max-w-[200px]">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Adição (Para Perto)</label>
                      <input
                        type="text"
                        value={pdvAdicao}
                        onChange={(e) => setPdvAdicao(e.target.value)}
                        placeholder="Ex: +2.00"
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Calculations and Final Actions */}
                  <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <span className="text-xs text-slate-450 block uppercase font-bold">Valor Total a Pagar</span>
                      <span className="text-3xl font-black text-primary">R$ {pdvPriceTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button 
                        type="submit" 
                        onClick={() => setPdvSaleType('orcamento')}
                        variant="outline"
                        className="border-slate-800 text-slate-350 hover:bg-slate-850 hover:text-white font-bold px-6 py-6 text-xs uppercase tracking-wider rounded-xl"
                      >
                        Gerar Orçamento (7 dias)
                      </Button>
                      <Button 
                        type="submit" 
                        onClick={() => setPdvSaleType('venda')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-6 text-xs uppercase tracking-wider rounded-xl"
                      >
                        Registrar Venda & Abrir O.S.
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* TABA 3: CLIENTES */}
        {activeTab === 'clientes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-headline font-bold">Banco de Clientes</h2>
              <Button 
                onClick={() => {
                  setEditingCliente(null);
                  setIsClientModalOpen(true);
                }} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Novo Cliente
              </Button>
            </div>

            {/* Client Search */}
            <Card className="bg-slate-900 border-slate-800 shadow">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    value={searchClient}
                    onChange={(e) => setSearchClient(e.target.value)}
                    placeholder="Pesquisar por nome ou CPF do cliente..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Client list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredClientes.map((c) => {
                const customerPrescriptions = vendas.filter(v => v.clienteId === c.id);
                return (
                  <Card key={c.id} className="bg-slate-900 border-slate-800 shadow-md">
                    <CardHeader className="pb-3 flex flex-row justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold">{c.nome}</CardTitle>
                        <CardDescription className="text-xs text-slate-450 mt-1">CPF: {c.cpf}</CardDescription>
                      </div>
                      <div className="flex gap-1.5">
                        <button 
                          onClick={() => {
                            setEditingCliente(c);
                            setIsClientModalOpen(true);
                          }}
                          className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteCliente(c.id)}
                          className="p-1.5 rounded bg-red-950/20 text-red-400 hover:bg-red-950/60"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </CardHeader>
                    <CardContent className="text-xs text-slate-350 space-y-2 border-t border-slate-800/40 pt-3">
                      <div><span className="font-bold text-slate-450 uppercase text-[9px] block">Telefone</span> {c.telefone}</div>
                      <div><span className="font-bold text-slate-450 uppercase text-[9px] block">E-mail</span> {c.email || 'Não informado'}</div>
                      <div><span className="font-bold text-slate-450 uppercase text-[9px] block">Endereço</span> {c.endereco}</div>
                      
                      {/* Prescription history snippet */}
                      {customerPrescriptions.length > 0 && (
                        <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800/60">
                          <span className="font-bold text-primary uppercase text-[9px] block mb-1">Última Receita ({customerPrescriptions[0].id})</span>
                          <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
                            <span className="text-left font-bold text-slate-400">Olho</span><span>ESF</span><span>CIL</span><span>EIXO</span>
                            <span className="text-left font-semibold">OD</span>
                            <span>{customerPrescriptions[0].receita.esfericoOD}</span>
                            <span>{customerPrescriptions[0].receita.cilindricoOD}</span>
                            <span>{customerPrescriptions[0].receita.eixoOD || '-'}</span>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

          </div>
        )}

        {/* TABA 4: ESTOQUE */}
        {activeTab === 'estoque' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-headline font-bold">Controle de Estoque</h2>
              <Button 
                onClick={() => {
                  setEditingProduto(null);
                  setIsProductModalOpen(true);
                }} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Novo Item
              </Button>
            </div>

            {/* Product Search */}
            <Card className="bg-slate-900 border-slate-800 shadow">
              <CardContent className="pt-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                  <input
                    type="text"
                    value={searchProduct}
                    onChange={(e) => setSearchProduct(e.target.value)}
                    placeholder="Pesquisar por nome de armação, marca ou lentes..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Product inventory list */}
            <Card className="bg-slate-900 border-slate-800 shadow-md">
              <CardContent className="pt-6 px-0">
                <div className="overflow-x-auto w-full">
                  <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-450 uppercase text-[10px] font-bold">
                        <th className="py-3 px-4">Nome do Item</th>
                        <th className="py-3 px-4">Categoria</th>
                        <th className="py-3 px-4 text-center">Quantidade</th>
                        <th className="py-3 px-4">Preço Custo</th>
                        <th className="py-3 px-4 font-bold text-primary">Preço Venda</th>
                        <th className="py-3 px-4">Margem Lucro</th>
                        <th className="py-3 px-4 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProdutos.map((p) => {
                        const margin = p.precoVenda > 0 ? ((p.precoVenda - p.precoCusto) / p.precoVenda) * 100 : 0;
                        const isLowStock = p.quantidade <= 3;
                        return (
                          <tr key={p.id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-colors">
                            <td className="py-3 px-4 font-semibold text-slate-200">{p.nome}</td>
                            <td className="py-3 px-4 uppercase text-[9px] text-slate-450">{p.categoria}</td>
                            <td className="py-3 px-4 text-center">
                              <span className={`px-2.5 py-1 rounded-full font-bold text-[10px] ${isLowStock ? 'bg-red-950/40 text-red-400 border border-red-900/40' : 'bg-slate-950 text-slate-350'}`}>
                                {p.quantidade} {isLowStock ? '!' : ''}
                              </span>
                            </td>
                            <td className="py-3 px-4">R$ {p.precoCusto.toFixed(2)}</td>
                            <td className="py-3 px-4 font-black text-primary">R$ {p.precoVenda.toFixed(2)}</td>
                            <td className="py-3 px-4 text-green-400 font-bold">{margin.toFixed(0)}%</td>
                            <td className="py-3 px-4 text-right flex justify-end gap-1.5">
                              <button 
                                onClick={() => {
                                  setEditingProduto(p);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1.5 rounded bg-slate-850 text-slate-400 hover:text-white"
                              >
                                <Edit3 className="h-3.5 w-3.5" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduto(p.id)}
                                className="p-1.5 rounded bg-red-950/20 text-red-400 hover:bg-red-950/60"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Product Modal */}
            {isProductModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">{editingProduto ? 'Editar Item' : 'Cadastrar Item de Estoque'}</CardTitle>
                    <CardDescription>Preencha os detalhes do produto e margens de venda.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveProduto} className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Nome do Produto</label>
                        <input
                          type="text"
                          name="nome"
                          defaultValue={editingProduto?.nome || ''}
                          className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Categoria</label>
                          <select
                            name="categoria"
                            defaultValue={editingProduto?.categoria || 'armação'}
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                          >
                            <option value="armação">Armação</option>
                            <option value="lente">Lente</option>
                            <option value="acessório">Acessório</option>
                            <option value="outro">Outro</option>
                          </select>
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Quantidade</label>
                          <input
                            type="number"
                            name="quantidade"
                            defaultValue={editingProduto?.quantidade ?? 1}
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Preço de Custo (R$)</label>
                          <input
                            type="number"
                            name="precoCusto"
                            defaultValue={editingProduto?.precoCusto ?? 0}
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Preço de Venda (R$)</label>
                          <input
                            type="number"
                            name="precoVenda"
                            defaultValue={editingProduto?.precoVenda ?? 0}
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-slate-800">
                        <Button type="submit" className="flex-1 bg-primary text-primary-foreground font-bold">Salvar Item</Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsProductModalOpen(false);
                            setEditingProduto(null);
                          }}
                          className="border-slate-800 text-slate-400"
                        >
                          Cancelar
                        </Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* TABA 5: MARKETING */}
        {activeTab === 'mkt' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-headline font-bold">Gerador de Material de Marketing</h2>
            <MarketingFlyer />
          </div>
        )}

        {/* Client Modal (Globally Accessible) */}
        {isClientModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg bg-slate-900 border-slate-800 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{editingCliente ? 'Editar Cliente' : 'Cadastrar Novo Cliente'}</CardTitle>
                <CardDescription>Preencha os dados cadastrais do titular da compra.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveCliente} className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Nome Completo</label>
                    <input
                      type="text"
                      name="nome"
                      defaultValue={editingCliente?.nome || ''}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">CPF</label>
                      <input
                        type="text"
                        name="cpf"
                        defaultValue={editingCliente?.cpf || ''}
                        placeholder="000.000.000-00"
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Telefone</label>
                      <input
                        type="text"
                        name="telefone"
                        defaultValue={editingCliente?.telefone || ''}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">E-mail</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={editingCliente?.email || ''}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">Endereço Completo</label>
                    <input
                      type="text"
                      name="endereco"
                      defaultValue={editingCliente?.endereco || ''}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                    />
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-slate-800">
                    <Button type="submit" className="flex-1 bg-primary text-primary-foreground font-bold">Salvar Cliente</Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsClientModalOpen(false);
                        setEditingCliente(null);
                      }}
                      className="border-slate-800 text-slate-400"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

      </main>
    </div>
  );
}
