'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Package, ShoppingCart, Sparkles, LogOut, Lock, 
  Search, Plus, Trash2, Edit3, CheckCircle, Clock, Eye, AlertTriangle, Calendar, FlaskConical, Ban,
  DollarSign, Percent, Heart, ShieldAlert, HelpCircle, Send, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  getItems, saveItem, deleteItem, updateItemStatus,
  Cliente, Produto, Venda, ReceitaVisual, auth, Evento, MembroEquipe, Laboratorio, ConfigFiscal
} from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import dynamic from 'next/dynamic';

const WorkOrderGenerator = dynamic(() => import('@/components/WorkOrderGenerator'), { ssr: false });
const MarketingFlyer = dynamic(() => import('@/components/MarketingFlyer'), { ssr: false });
const MarketingBanner = dynamic(() => import('@/components/MarketingBanner'), { ssr: false });
const LaboratoriosManager = dynamic(() => import('@/components/LaboratoriosManager'), { ssr: false });
const GOLD = "#B5996A";

export default function AdminPage() {
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginStep, setLoginStep] = useState<'email' | 'password'>('email');
  const [loginPassword, setLoginPassword] = useState('');
  const [isFirebaseMode, setIsFirebaseMode] = useState(false);
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState<'dash' | 'pdv' | 'clientes' | 'estoque' | 'eventos' | 'mkt' | 'laboratorios' | 'financeiro'>('dash');
  const [marketingMode, setMarketingMode] = useState<'flyer' | 'banner'>('flyer');

  // Database states
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [despesas, setDespesas] = useState<any[]>([]); // Operational Expenses
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [equipe, setEquipe] = useState<MembroEquipe[]>([]);
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([]);

  // Expense Logger Form States
  const [despesaCategoria, setDespesaCategoria] = useState<'gasolina' | 'coffee_break' | 'cartao_visita' | 'bolsa_personalizada' | 'material_expositivo' | 'software' | 'imposto' | 'outros'>('outros');
  const [despesaDescricao, setDespesaDescricao] = useState('');
  const [despesaValor, setDespesaValor] = useState(0);
  const [despesaData, setDespesaData] = useState(new Date().toISOString().split('T')[0]);
  const [despesaEventoId, setDespesaEventoId] = useState('');
  const [editingDespesaId, setEditingDespesaId] = useState<string | null>(null);

  // Tax and Invoice States
  const [taxSimplesNacionalBracket, setTaxSimplesNacionalBracket] = useState<'bracket1' | 'bracket2' | 'bracket3'>('bracket1');
  const [nfeInvoiceModalVenda, setNfeInvoiceModalVenda] = useState<Venda | null>(null);
  const [isEmittingNfe, setIsEmittingNfe] = useState(false);

  // Inline Sale Errors Editor States
  const [editingSaleErrorsId, setEditingSaleErrorsId] = useState<string | null>(null);
  const [saleErrorLente, setSaleErrorLente] = useState(0);
  const [saleErrorDevolucao, setSaleErrorDevolucao] = useState(0);
  const [saleErrorDesconto, setSaleErrorDesconto] = useState(0);
  const [saleTaxaCartao, setSaleTaxaCartao] = useState(0);

  // Fiscal Config States
  const [financeiroSubTab, setFinanceiroSubTab] = useState<'geral' | 'fiscal'>('geral');
  const [fiscalCnpj, setFiscalCnpj] = useState('');
  const [fiscalIe, setFiscalIe] = useState('');
  const [fiscalRazaoSocial, setFiscalRazaoSocial] = useState('');
  const [fiscalCscId, setFiscalCscId] = useState('');
  const [fiscalCscToken, setFiscalCscToken] = useState('');
  const [fiscalAmbiente, setFiscalAmbiente] = useState<'homologacao' | 'producao'>('homologacao');
  const [fiscalCertSenha, setFiscalCertSenha] = useState('');
  const [fiscalCertBase64, setFiscalCertBase64] = useState('');
  const [isFiscalHelpOpen, setIsFiscalHelpOpen] = useState(false);
  const [selectedMonthFilter, setSelectedMonthFilter] = useState<string>('todos');

  // Multi-user Auth states
  const [currentUser, setCurrentUser] = useState<{ email: string; nome: string } | null>(null);
  const [isFirstAccess, setIsFirstAccess] = useState(false);
  const [firstAccessName, setFirstAccessName] = useState('');
  const [firstAccessPassword, setFirstAccessPassword] = useState('');
  const [firstAccessRecovery, setFirstAccessRecovery] = useState('');
  
  // Password Recovery States
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [recoveryInputEmail, setRecoveryInputEmail] = useState('');
  const [recoveryInputGmail, setRecoveryInputGmail] = useState('');

  // Event modal/editor
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);

  // Search, Filter and Vendor tracking states
  const [searchClient, setSearchClient] = useState('');
  const [searchProduct, setSearchProduct] = useState('');
  const [selectedEventoId, setSelectedEventoId] = useState<string>('todos');
  const [selectedVendedorId, setSelectedVendedorId] = useState<string>('todos');
  
  // Kanban & Batch Edit States
  const [batchOrderIds, setBatchOrderIds] = useState('');
  const [batchStatus, setBatchStatus] = useState('laboratorio');

  // Modals / Editors
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState<Produto | null>(null);

  const [activeOSVenda, setActiveOSVenda] = useState<Partial<Venda> | null>(null);

  // PDV Order state
  const [pdvSaleType, setPdvSaleType] = useState<'venda' | 'orcamento'>('venda');
  const [pdvClienteId, setPdvClienteId] = useState('');
  const [pdvVendedorId, setPdvVendedorId] = useState('');
  const [pdvEventoId, setPdvEventoId] = useState('');
  const [pdvIsDoacao, setPdvIsDoacao] = useState(false);
  const [pdvLaboratorioId, setPdvLaboratorioId] = useState('');
  const [pdvFrameId, setPdvFrameId] = useState('');
  const [pdvLensId, setPdvLensId] = useState('');
  const [pdvPriceTotal, setPdvPriceTotal] = useState(0);
  const [pdvDataReceita, setPdvDataReceita] = useState('');
  
  const [pdvLongeEsfOD, setPdvLongeEsfOD] = useState('');
  const [pdvLongeEsfOE, setPdvLongeEsfOE] = useState('');
  const [pdvLongeCilOD, setPdvLongeCilOD] = useState('');
  const [pdvLongeCilOE, setPdvLongeCilOE] = useState('');
  const [pdvLongeEixoOD, setPdvLongeEixoOD] = useState('');
  const [pdvLongeEixoOE, setPdvLongeEixoOE] = useState('');
  const [pdvLongeDnpOD, setPdvLongeDnpOD] = useState('');
  const [pdvLongeDnpOE, setPdvLongeDnpOE] = useState('');
  const [pdvLongeAlturaOD, setPdvLongeAlturaOD] = useState('');
  const [pdvLongeAlturaOE, setPdvLongeAlturaOE] = useState('');

  const [pdvPertoEsfOD, setPdvPertoEsfOD] = useState('');
  const [pdvPertoEsfOE, setPdvPertoEsfOE] = useState('');
  const [pdvPertoCilOD, setPdvPertoCilOD] = useState('');
  const [pdvPertoCilOE, setPdvPertoCilOE] = useState('');
  const [pdvPertoEixoOD, setPdvPertoEixoOD] = useState('');
  const [pdvPertoEixoOE, setPdvPertoEixoOE] = useState('');
  const [pdvPertoDnpOD, setPdvPertoDnpOD] = useState('');
  const [pdvPertoDnpOE, setPdvPertoDnpOE] = useState('');
  const [pdvPertoAlturaOD, setPdvPertoAlturaOD] = useState('');
  const [pdvPertoAlturaOE, setPdvPertoAlturaOE] = useState('');

  const [pdvAdicao, setPdvAdicao] = useState('');
  const [pdvCodigoLente, setPdvCodigoLente] = useState('');

  // 1. Initial Mock Database Setup (LocalStorage)
  const initializeMockData = () => {
    if (typeof window !== 'undefined') {
      const storedClients = localStorage.getItem('tv_clientes');
      const storedProducts = localStorage.getItem('tv_produtos');
      const storedSales = localStorage.getItem('tv_vendas');

      if (!storedClients) {
        const mockClients: Cliente[] = [
          { id: 'c-1', nome: 'Mariana da Silva', cpf: '123.456.789-00', email: 'mariana@email.com', telefone: '(21) 98888-7777', endereco: 'Rua das Flores, 123, Rio de Janeiro - RJ', cep: '20000-000', dataNascimento: '1990-01-01', criadoEm: new Date().toISOString() },
          { id: 'c-2', nome: 'Carlos Eduardo', cpf: '987.654.321-11', email: 'carlos@email.com', telefone: '(21) 97777-6666', endereco: 'Av. Central, 450, Niterói - RJ', cep: '24000-000', dataNascimento: '1985-05-15', criadoEm: new Date().toISOString() },
          { id: 'c-3', nome: 'Ana Beatriz Mendes', cpf: '456.123.789-22', email: 'ana@email.com', telefone: '(21) 96666-5555', endereco: 'Rua do Resende, 89, Rio de Janeiro - RJ', cep: '20231-092', dataNascimento: '1995-10-20', criadoEm: new Date().toISOString() }
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
            receita: { longeEsfericoOD: '+1.25', longeEsfericoOE: '+1.50', longeCilindricoOD: '0.00', longeCilindricoOE: '0.00', longeEixoOD: '', longeEixoOE: '', adicao: '' },
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
            receita: { longeEsfericoOD: '-2.50', longeEsfericoOE: '-2.25', longeCilindricoOD: '-0.75', longeCilindricoOE: '-0.50', longeEixoOD: '90', longeEixoOE: '85', adicao: '' },
            status: 'pronto',
            dataVenda: new Date(Date.now() - 172800000).toISOString().split('T')[0]
          }
        ];
        localStorage.setItem('tv_vendas', JSON.stringify(mockSales));
      }

      const storedEvents = localStorage.getItem('tv_eventos');
      if (!storedEvents) {
        const mockEvents: Evento[] = [
          { id: 'ev-1', nome: 'Ação Social Igreja de Nilópolis', data: '2026-08-15', local: 'Rua Principal, Nilópolis', status: 'ativo', criadoEm: new Date().toISOString() },
          { id: 'ev-2', nome: 'Feira Industrial Saúde Visual', data: '2026-09-10', local: 'Auditório Firjan, Centro', status: 'ativo', criadoEm: new Date().toISOString() }
        ];
        localStorage.setItem('tv_eventos', JSON.stringify(mockEvents));
      }

      const storedEquipe = localStorage.getItem('tv_equipe');
      if (!storedEquipe) {
        const mockEquipe: MembroEquipe[] = [
          { email: 'ana@timevision.com.br', nome: 'Ana', primeiroAcessoDone: false, criadoEm: new Date().toISOString() },
          { email: 'moises@timevision.com.br', nome: 'Moisés', primeiroAcessoDone: false, criadoEm: new Date().toISOString() },
          { email: 'alef@timevision.com.br', nome: 'Alef', primeiroAcessoDone: false, criadoEm: new Date().toISOString() },
          { email: 'annie@timevision.com.br', nome: 'Annie', primeiroAcessoDone: false, criadoEm: new Date().toISOString() }
        ];
        localStorage.setItem('tv_equipe', JSON.stringify(mockEquipe));
      }
    }
  };

  // 2. Fetch Data from Storage/Firebase
  const loadData = async () => {
    try {
      const [cList, pList, vList, eList, lList, eqList, labList, dList] = await Promise.all([
        getItems<Cliente>('clientes'),
        getItems<Produto>('produtos'),
        getItems<Venda>('vendas'),
        getItems<Evento>('eventos'),
        getItems<any>('inscricoes'),
        getItems<MembroEquipe>('equipe'),
        getItems<Laboratorio>('laboratorios'),
        getItems<any>('despesas')
      ]);
      setClientes(cList);
      setProdutos(pList);
      setVendas(vList);
      setEventos(eList);
      setLeads(lList);
      setEquipe(eqList);
      setLaboratorios(labList);
      setDespesas(dList);

      // Load Fiscal Settings
      const fiscalConfigs = await getItems<ConfigFiscal>('config_fiscal');
      if (fiscalConfigs.length > 0) {
        const conf = fiscalConfigs[0];
        setFiscalCnpj(conf.cnpj || '');
        setFiscalIe(conf.ie || '');
        setFiscalRazaoSocial(conf.razaoSocial || '');
        setFiscalCscId(conf.cscId || '');
        setFiscalCscToken(conf.cscToken || '');
        setFiscalAmbiente(conf.ambiente || 'homologacao');
        setFiscalCertSenha(conf.certificadoSenha || '');
        setFiscalCertBase64(conf.certificadoBase64 || '');
      }
    } catch (error) {
      console.error('Error loading DB:', error);
    }
  };

  useEffect(() => {
    initializeMockData();
    
    // Always load equipe and events list on mount to validate team logins and first access
    getItems<MembroEquipe>('equipe').then(setEquipe).catch(console.error);
    getItems<Evento>('eventos').then(setEventos).catch(console.error);

    const checkLocalhostBypass = () => {
      const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if (isLocalhost) {
        const storedUser = localStorage.getItem('tv_admin_user');
        const isAuth = localStorage.getItem('tv_admin_auth') === 'true';
        if (isAuth && storedUser) {
           const parsedUser = JSON.parse(storedUser);
           if (parsedUser.email === 'admin@timevision.com.br') {
             setIsAuthenticated(true);
             setCurrentUser(parsedUser);
             loadData();
             setIsLoadingAuth(false);
             return true;
           }
        }
      }
      return false;
    };

    if (typeof window !== 'undefined') {
      // Check if this is a password reset redirect
      const params = new URLSearchParams(window.location.search);
      const resetEmail = params.get('reset_email');
      if (resetEmail) {
        setLoginEmail(resetEmail);
        setIsFirstAccess(true);
        toast({
          title: 'Redefinição de Senha',
          description: 'Defina sua nova senha de acesso abaixo.',
        });
      }
    }

    if (auth) {
      import('firebase/auth').then(({ onAuthStateChanged }) => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            setIsAuthenticated(true);
            const userProfile = { email: user.email || '', nome: user.displayName || 'Usuário Autenticado' };
            setCurrentUser(userProfile);
            if (typeof window !== 'undefined') {
              localStorage.setItem('tv_admin_user', JSON.stringify(userProfile));
              localStorage.setItem('tv_admin_auth', 'true');
            }
            loadData();
          } else {
            if (!checkLocalhostBypass()) {
              setIsAuthenticated(false);
              setCurrentUser(null);
              if (typeof window !== 'undefined') {
                localStorage.removeItem('tv_admin_auth');
                localStorage.removeItem('tv_admin_user');
              }
            }
          }
          setIsLoadingAuth(false);
        });
        return () => unsubscribe();
      });
    } else {
       // Fallback to purely local if Firebase is not configured
       const isAuth = localStorage.getItem('tv_admin_auth') === 'true';
       if (isAuth) {
         setIsAuthenticated(true);
         const storedUser = localStorage.getItem('tv_admin_user');
         if (storedUser) {
           setCurrentUser(JSON.parse(storedUser));
         }
         loadData();
       }
       setIsLoadingAuth(false);
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

  useEffect(() => {
    if (currentUser?.email) {
      setPdvVendedorId(currentUser.email);
    }
  }, [currentUser]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = loginEmail.toLowerCase().trim();

    if (loginStep === 'email') {
      // 1. Master Bypass for Admin
      if (emailLower === 'admin@timevision.com.br') {
        setLoginStep('password');
        return;
      }

      // 2. Check if email belongs to authorized team
      const teamMember = equipe.find(m => m.email.toLowerCase() === emailLower);
      if (!teamMember) {
        toast({
          variant: 'destructive',
          title: 'Acesso Negado',
          description: 'Este e-mail não faz parte da equipe autorizada.',
        });
        return;
      }

      // 3. First Access Flow
      if (!teamMember.primeiroAcessoDone) {
        setFirstAccessName(teamMember.nome);
        setIsFirstAccess(true);
        toast({
          title: 'Primeiro Acesso Detectado',
          description: 'Por favor, cadastre sua senha e e-mail de recuperação para continuar.',
        });
      } else {
        setLoginStep('password');
      }
      return;
    }

    // If loginStep === 'password'
    if (!loginPassword) {
      toast({
        variant: 'destructive',
        title: 'Senha Obrigatória',
        description: 'Por favor, insira sua senha para acessar.',
      });
      return;
    }

    // 4. Admin login bypass
    const adminSecret = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'tv-admin-local-fallback';
    if (emailLower === 'admin@timevision.com.br' && loginPassword === adminSecret) {
      if (auth) {
        try {
          const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('firebase/auth');
          try {
            await signInWithEmailAndPassword(auth, emailLower, loginPassword);
          } catch (e: any) {
            if (e.code === 'auth/user-not-found' || e.code === 'auth/invalid-credential') {
              await createUserWithEmailAndPassword(auth, emailLower, loginPassword);
            } else {
              console.error('Admin Firebase auth error:', e);
            }
          }
        } catch (err) {
          console.error('Admin Firebase setup error:', err);
        }
      }
      setIsAuthenticated(true);
      setCurrentUser({ email: 'admin@timevision.com.br', nome: 'Administrador Local' });
      if (typeof window !== 'undefined') {
        localStorage.setItem('tv_admin_auth', 'true');
        localStorage.setItem('tv_admin_user', JSON.stringify({ email: 'admin@timevision.com.br', nome: 'Administrador Local' }));
      }
      loadData();
      toast({
        title: 'Acesso Admin Local',
        description: 'Login efetuado via ambiente de desenvolvimento.',
      });
      return;
    }

    const teamMember = equipe.find(m => m.email.toLowerCase() === emailLower);
    if (!teamMember) return;

    // 5. Authenticate
    if (auth) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, emailLower, loginPassword);
        setIsAuthenticated(true);
        const userProfile = { email: emailLower, nome: teamMember.nome };
        setCurrentUser(userProfile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('tv_admin_auth', 'true');
          localStorage.setItem('tv_admin_user', JSON.stringify(userProfile));
        }
        loadData();
        toast({
          title: 'Bem-vindo(a)',
          description: `Login de ${teamMember.nome} efetuado com sucesso via Firebase.`,
        });
      } catch (error: any) {
        console.error("Firebase auth error:", error);
        toast({
          variant: 'destructive',
          title: 'Erro de Autenticação',
          description: 'E-mail ou senha incorretos.',
        });
      }
    } else {
      // Local/Offline auth: Read password from equipe document
      const localPassword = localStorage.getItem(`tv_pwd_${emailLower}`);
      if (localPassword === loginPassword) {
        setIsAuthenticated(true);
        const userProfile = { email: emailLower, nome: teamMember.nome };
        setCurrentUser(userProfile);
        if (typeof window !== 'undefined') {
          localStorage.setItem('tv_admin_auth', 'true');
          localStorage.setItem('tv_admin_user', JSON.stringify(userProfile));
        }
        loadData();
        toast({
          title: 'Bem-vindo(a) (Modo Local)',
          description: `Login de ${teamMember.nome} efetuado com sucesso.`,
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Erro de Autenticação',
          description: 'E-mail ou senha incorretos.',
        });
      }
    }
  };

  const handleFirstAccessSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = loginEmail.toLowerCase().trim();
    const teamMember = equipe.find(m => m.email.toLowerCase() === emailLower);
    if (!teamMember) return;

    if (firstAccessPassword.length < 6) {
      toast({
        variant: 'destructive',
        title: 'Senha Fraca',
        description: 'A senha deve conter no mínimo 6 caracteres.',
      });
      return;
    }

    try {
      if (auth) {
        const { createUserWithEmailAndPassword, signInWithEmailAndPassword } = await import('firebase/auth');
        try {
          await createUserWithEmailAndPassword(auth, emailLower, firstAccessPassword);
        } catch (authErr: any) {
          if (authErr.code === 'auth/email-already-in-use') {
            try {
              await signInWithEmailAndPassword(auth, emailLower, firstAccessPassword);
            } catch (loginErr) {
              throw new Error('Seu e-mail já possui um cadastro! Feche esta tela e clique em "Fazer Login" (use "Recuperar Senha" se necessário).');
            }
          } else {
            throw authErr;
          }
        }
      } else {
        localStorage.setItem(`tv_pwd_${emailLower}`, firstAccessPassword);
      }

      // Save updated team member profile
      const updatedMember: MembroEquipe = {
        ...teamMember,
        nome: firstAccessName,
        emailRecuperacao: firstAccessRecovery,
        primeiroAcessoDone: true
      };

      await saveItem('equipe', updatedMember);
      
      // Update state
      setEquipe(prev => prev.map(m => m.email === emailLower ? updatedMember : m));
      setIsAuthenticated(true);
      const userProfile = { email: emailLower, nome: firstAccessName };
      setCurrentUser(userProfile);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('tv_admin_auth', 'true');
        localStorage.setItem('tv_admin_user', JSON.stringify(userProfile));
      }

      setIsFirstAccess(false);
      loadData();

      toast({
        title: 'Cadastro Realizado!',
        description: `Seu usuário ${firstAccessName} foi cadastrado e logado.`,
      });
    } catch (err: any) {
      console.error('Error in first access registration:', err);
      toast({
        variant: 'destructive',
        title: 'Erro no Cadastro',
        description: err.message || 'Erro ao registrar usuário. Tente novamente.',
      });
    }
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = recoveryInputEmail.toLowerCase().trim();
    const teamMember = equipe.find(m => m.email.toLowerCase() === emailLower);

    if (!teamMember) {
      toast({
        variant: 'destructive',
        title: 'Usuário não encontrado',
        description: 'E-mail não faz parte da equipe autorizada.',
      });
      return;
    }

    if (!teamMember.primeiroAcessoDone) {
      toast({
        variant: 'destructive',
        title: 'Ação Bloqueada',
        description: 'Este usuário ainda não realizou o primeiro acesso para configurar a senha.',
      });
      return;
    }

    if (teamMember.emailRecuperacao !== recoveryInputGmail) {
      toast({
        variant: 'destructive',
        title: 'Verificação Falhou',
        description: 'O e-mail de recuperação não coincide com o e-mail cadastrado.',
      });
      return;
    }

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailLower, recoveryEmail: recoveryInputGmail })
      });
      
      const resData = await response.json();
      
      if (response.ok) {
        toast({
          title: 'Redefinição Enviada',
          description: `Um link de redefinição foi gerado para o e-mail: ${recoveryInputGmail}.`,
        });
        
        // Output token link for dev console bypass helper
        if (resData.debugLink) {
          console.log(`[DEVS RESET LINK]: ${resData.debugLink}`);
        }
        setIsForgotPassword(false);
      } else {
        throw new Error(resData.error || 'Erro na API.');
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao redefinir',
        description: error.message || 'Falha ao solicitar redefinição. Tente novamente.',
      });
    }
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
      cep: formData.get('cep') as string,
      endereco: formData.get('endereco') as string,
      dataNascimento: formData.get('dataNascimento') as string,
      criadoEm: editingCliente?.criadoEm || new Date().toISOString(),
      cadastradoPor: (formData.get('cadastradoPor') as string) || editingCliente?.cadastradoPor || currentUser?.email || 'admin@timevision.com.br',
      eventoId: (formData.get('eventoId') as string) || undefined
    };

    if (!clientData.nome || !clientData.cpf) {
      toast({ variant: 'destructive', title: 'Campos Obrigatórios', description: 'Preencha Nome e CPF.' });
      return;
    }

    try {
      await saveItem('clientes', clientData);
      toast({ title: 'Sucesso', description: 'Cliente salvo com sucesso!' });
      setIsClientModalOpen(false);
      setEditingCliente(null);
      setPdvClienteId(clientData.id);
      loadData();
    } catch (err: any) {
      console.error('Erro ao salvar cliente:', err);
      toast({ variant: 'destructive', title: 'Erro ao Salvar', description: err?.message || 'Não foi possível salvar o cliente.' });
    }
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
      criadoPor: editingProduto?.criadoPor || currentUser?.email || 'admin@timevision.com.br'
    };

    if (!productData.nome || !productData.precoVenda) {
      toast({ variant: 'destructive', title: 'Campos Obrigatórios', description: 'Preencha Nome e Preço de Venda.' });
      return;
    }

    try {
      await saveItem('produtos', productData);
      toast({ title: 'Sucesso', description: 'Produto cadastrado no estoque!' });
      setIsProductModalOpen(false);
      setEditingProduto(null);
      loadData();
    } catch (err: any) {
      console.error('Erro ao salvar produto:', err);
      toast({ variant: 'destructive', title: 'Erro ao Salvar', description: err?.message || 'Não foi possível salvar o produto.' });
    }
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

  // Event Handlers
  const handleSaveEvento = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const eventData: Evento = {
      id: editingEvento?.id || `ev-${Math.floor(1000 + Math.random() * 9000)}`,
      nome: formData.get('nome') as string,
      data: formData.get('data') as string,
      local: formData.get('local') as string,
      status: editingEvento?.status || 'ativo',
      criadoEm: editingEvento?.criadoEm || new Date().toISOString(),
      criadoPor: editingEvento?.criadoPor || currentUser?.email || 'admin@timevision.com.br',
      cor: editingEvento?.cor || ['bg-blue-500', 'bg-purple-500', 'bg-rose-500', 'bg-amber-500', 'bg-emerald-500', 'bg-cyan-500', 'bg-fuchsia-500'][Math.floor(Math.random() * 7)]
    };

    if (!eventData.nome || !eventData.data) {
      toast({ variant: 'destructive', title: 'Campos Obrigatórios', description: 'Preencha Nome e Data do evento.' });
      return;
    }

    try {
      await saveItem('eventos', eventData);
      toast({ title: 'Sucesso', description: 'Evento salvo com sucesso!' });
      setIsEventModalOpen(false);
      setEditingEvento(null);
      loadData();
    } catch (err: any) {
      console.error('Erro ao salvar evento:', err);
      toast({ variant: 'destructive', title: 'Erro ao Salvar', description: err?.message || 'Não foi possível salvar o evento.' });
    }
  };

  const handleArchiveEvento = async (event: Evento) => {
    const updated: Evento = {
      ...event,
      status: event.status === 'ativo' ? 'arquivado' : 'ativo'
    };
    await saveItem('eventos', updated);
    toast({ title: 'Status Alterado', description: `Evento ${event.status === 'ativo' ? 'arquivado' : 'ativado'} com sucesso.` });
    loadData();
  };

  const handleDeleteEvento = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir permanentemente este evento e suas configurações? As inscrições continuarão registradas.')) {
      await deleteItem('eventos', id);
      toast({ title: 'Evento Excluído', description: 'O evento foi removido com sucesso.' });
      loadData();
    }
  };

  // Financial Handlers
  const handleAddDespesa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (despesaValor <= 0 || !despesaDescricao) {
      toast({
        variant: 'destructive',
        title: 'Dados Inválidos',
        description: 'Preencha a descrição e um valor maior que zero.',
      });
      return;
    }
    
    if (editingDespesaId) {
      const updatedDespesa = {
        id: editingDespesaId,
        categoria: despesaCategoria,
        descricao: despesaDescricao,
        valor: Number(despesaValor),
        data: despesaData,
        eventoId: despesaEventoId !== '' ? despesaEventoId : undefined,
        criadoPor: currentUser?.email || 'admin@timevision.com.br'
      };
      await saveItem('despesas', updatedDespesa);
      toast({
        title: 'Despesa Atualizada',
        description: 'Custo operacional atualizado com sucesso.',
      });
      setEditingDespesaId(null);
    } else {
      const newDespesa = {
        id: `desp-${Math.floor(1000 + Math.random() * 9000)}`,
        categoria: despesaCategoria,
        descricao: despesaDescricao,
        valor: Number(despesaValor),
        data: despesaData,
        eventoId: despesaEventoId !== '' ? despesaEventoId : undefined,
        criadoPor: currentUser?.email || 'admin@timevision.com.br'
      };
      await saveItem('despesas', newDespesa);
      toast({
        title: 'Despesa Registrada',
        description: 'Custo operacional adicionado com sucesso.',
      });
    }
    
    setDespesaDescricao('');
    setDespesaValor(0);
    setDespesaCategoria('outros');
    setDespesaData(new Date().toISOString().split('T')[0]);
    setDespesaEventoId('');
    loadData();
  };

  const handleStartEditDespesa = (d: any) => {
    setEditingDespesaId(d.id);
    setDespesaCategoria(d.categoria);
    setDespesaDescricao(d.descricao);
    setDespesaValor(d.valor);
    setDespesaData(d.data);
    setDespesaEventoId(d.eventoId || '');
  };

  const handleCancelEditDespesa = () => {
    setEditingDespesaId(null);
    setDespesaDescricao('');
    setDespesaValor(0);
    setDespesaCategoria('outros');
    setDespesaData(new Date().toISOString().split('T')[0]);
    setDespesaEventoId('');
  };

  const handleDeleteDespesa = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      await deleteItem('despesas', id);
      toast({
        title: 'Despesa Excluída',
        description: 'Registro de despesa removido com sucesso.',
      });
      loadData();
    }
  };

  const handleSaveSaleErrors = async (venda: Venda) => {
    const updated: Venda = {
      ...venda,
      custoErroRefazerLente: Number(saleErrorLente),
      custoErroDevolucao: Number(saleErrorDevolucao),
      custoErroDesconto: Number(saleErrorDesconto),
      taxaCartaoJuros: Number(saleTaxaCartao)
    };
    await saveItem('vendas', updated);
    toast({
      title: 'Auditoria Atualizada',
      description: 'Custos com erros salvos com sucesso.',
    });
    setEditingSaleErrorsId(null);
    loadData();
  };

  const handleSimulateNfeEmit = async (venda: Venda) => {
    setIsEmittingNfe(true);
    toast({
      title: 'Conectando à SEFAZ...',
      description: 'Enviando dados do lote da NFC-e...',
    });
    
    try {
      const configFiscal: ConfigFiscal = {
        cnpj: fiscalCnpj,
        ie: fiscalIe,
        razaoSocial: fiscalRazaoSocial,
        cscId: fiscalCscId,
        cscToken: fiscalCscToken,
        ambiente: fiscalAmbiente,
        certificadoSenha: fiscalCertSenha,
        certificadoBase64: fiscalCertBase64
      };

      const res = await fetch('/api/nfe/emit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ venda, configFiscal })
      });
      
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Erro desconhecido na emissão da SEFAZ.');
      }
      
      const updated: Venda = {
        ...venda,
        nfeStatus: 'emitida',
        nfeChave: data.chave
      };
      
      await saveItem('vendas', updated);
      toast({
        title: 'NFC-e Emitida com Sucesso!',
        description: `Nota fiscal autorizada pela SEFAZ. Chave: ${data.chave.substring(0, 10)}...`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Falha na Emissão',
        description: err?.message || 'Erro ao transmitir nota fiscal para a SEFAZ.',
      });
    } finally {
      setIsEmittingNfe(false);
      loadData();
    }
  };

  const handleSaveConfigFiscal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const configData: ConfigFiscal = {
        id: 'default',
        cnpj: fiscalCnpj,
        ie: fiscalIe,
        razaoSocial: fiscalRazaoSocial,
        cscId: fiscalCscId,
        cscToken: fiscalCscToken,
        ambiente: fiscalAmbiente,
        certificadoSenha: fiscalCertSenha,
        certificadoBase64: fiscalCertBase64
      };
      await saveItem('config_fiscal', configData);
      toast({
        title: 'Configurações Salvas',
        description: 'Credenciais fiscais armazenadas com sucesso.',
      });
      loadData();
    } catch (err: any) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Erro ao Salvar',
        description: 'Não foi possível salvar as configurações fiscais.',
      });
    }
  };

  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      setFiscalCertBase64(base64);
      toast({
        title: 'Certificado Carregado',
        description: `Arquivo ${file.name} carregado com sucesso. Lembre-se de salvar as alterações.`,
      });
    };
    reader.onerror = () => {
      toast({
        variant: 'destructive',
        title: 'Erro de Leitura',
        description: 'Não foi possível ler o arquivo do certificado.',
      });
    };
    reader.readAsDataURL(file);
  };

  const handleMarkInstallmentAsPaid = async (venda: Venda, installmentIndex: number) => {
    try {
      const updatedPagamento = {
        ...(venda.pagamento || { metodo: 'Boleto', parcelas: '1x', sinal: 0 }),
        parcelasPagas: {
          ...(venda.pagamento?.parcelasPagas || {}),
          [installmentIndex]: true
        }
      };
      const updated: Venda = {
        ...venda,
        pagamento: updatedPagamento
      };
      await saveItem('vendas', updated);
      toast({
        title: 'Parcela Recebida',
        description: `Parcela ${installmentIndex} do pedido ${venda.id} marcada como paga com sucesso.`,
      });
      loadData();
    } catch (err: any) {
      console.error(err);
      toast({
        variant: 'destructive',
        title: 'Erro ao Atualizar',
        description: 'Não foi possível registrar o pagamento da parcela.',
      });
    }
  };

  // 7. POS Sale & OS/Budget Generation Trigger
  const handlePdvSale = async (e: React.FormEvent, type: 'venda' | 'orcamento') => {
    e.preventDefault();
    if (!pdvClienteId || (!pdvFrameId && !pdvLensId) || !pdvEventoId || !pdvVendedorId) {
      toast({
        variant: 'destructive',
        title: 'Dados Incompletos',
        description: 'Selecione o cliente, pelo menos um produto, a origem (evento/loja) e o consultor/vendedor.',
      });
      return;
    }


    const client = clientes.find(c => c.id === pdvClienteId);
    if (!client) return;

    // Automatically bind the client to the event
    if (pdvEventoId && client.eventoId !== pdvEventoId) {
      await saveItem('clientes', { ...client, eventoId: pdvEventoId });
    }

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
      valorTotal: pdvIsDoacao ? 0 : pdvPriceTotal,
      receita: {
        dataReceita: orderDate,
        longeEsfericoOD: pdvLongeEsfOD,
        longeEsfericoOE: pdvLongeEsfOE,
        longeCilindricoOD: pdvLongeCilOD,
        longeCilindricoOE: pdvLongeCilOE,
        longeEixoOD: pdvLongeEixoOD,
        longeEixoOE: pdvLongeEixoOE,
        longeDnpOD: pdvLongeDnpOD,
        longeDnpOE: pdvLongeDnpOE,
        longeAlturaOD: pdvLongeAlturaOD,
        longeAlturaOE: pdvLongeAlturaOE,
        pertoEsfericoOD: pdvPertoEsfOD,
        pertoEsfericoOE: pdvPertoEsfOE,
        pertoCilindricoOD: pdvPertoCilOD,
        pertoCilindricoOE: pdvPertoCilOE,
        pertoEixoOD: pdvPertoEixoOD,
        pertoEixoOE: pdvPertoEixoOE,
        pertoDnpOD: pdvPertoDnpOD,
        pertoDnpOE: pdvPertoDnpOE,
        pertoAlturaOD: pdvPertoAlturaOD,
        pertoAlturaOE: pdvPertoAlturaOE,
        adicao: pdvAdicao,
        codigoLente: pdvCodigoLente,
      },
      status: pdvIsDoacao ? 'doacao' : (type === 'venda' ? 'recebido' : 'orcamento'),
      isDoacao: pdvIsDoacao || undefined,
      dataVenda: orderDate,
      validadeOrcamento: type === 'orcamento' ? new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] : undefined,
      vendedorId: pdvVendedorId,
      vendedorNome: equipe.find(m => m.email === pdvVendedorId)?.nome || 'Consultor Óptico',
      eventoId: pdvEventoId !== '' ? pdvEventoId : undefined,
      laboratorioId: pdvLaboratorioId !== '' ? pdvLaboratorioId : undefined,
      laboratorioNome: laboratorios.find(l => l.id === pdvLaboratorioId)?.nome
    };

    let maxId = 1000;
    const isOrcamento = type === 'orcamento';
    const prefix = isOrcamento ? 'ORC-' : '';
    
    vendas.forEach(v => {
      if (isOrcamento && v.id.startsWith('ORC-')) {
        const num = parseInt(v.id.replace('ORC-', ''), 10);
        if (!isNaN(num) && num > maxId) maxId = num;
      } else if (!isOrcamento && !v.id.startsWith('ORC-')) {
        const numMatch = v.id.match(/\d+/);
        if (numMatch) {
          const num = parseInt(numMatch[0], 10);
          if (!isNaN(num) && num > maxId) maxId = num;
        }
      }
    });

    pendingVenda.id = `${prefix}${maxId + 1}`;

    setActiveOSVenda(pendingVenda);
  };

  // Financial Calculators
  const realSales = vendas.filter(v => {
    if (v.status === 'orcamento' || v.status === 'cancelado') return false;
    
    // Filter by Vendedor
    if (selectedVendedorId !== 'todos' && v.vendedorId !== selectedVendedorId) {
      return false;
    }
    
    // Filter by Evento
    if (selectedEventoId !== 'todos') {
      if (selectedEventoId === 'loja' && v.eventoId && v.eventoId !== 'loja') return false;
      if (selectedEventoId !== 'loja' && v.eventoId !== selectedEventoId) return false;
    }
    
    return true;
  });

  const totalRevenue = realSales.reduce((acc, curr) => acc + curr.valorTotal, 0);
  const totalCost = realSales.reduce((acc, curr) => acc + (curr.custoTotal || curr.valorTotal * 0.3), 0);
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
    const venda = vendas.find(v => v.id === vendaId);
    if (venda && venda.status === 'orcamento' && newStatus !== 'orcamento' && newStatus !== 'cancelado') {
      // Conversion from Orcamento to Pedido
      let maxId = 1000;
      vendas.forEach(v => {
        if (!v.id.startsWith('ORC-')) {
          const numMatch = v.id.match(/\d+/);
          if (numMatch) {
            const num = parseInt(numMatch[0], 10);
            if (!isNaN(num) && num > maxId) maxId = num;
          }
        }
      });
      const nextId = `${maxId + 1}`;
      
      const convertedVenda = { ...venda, id: nextId, status: newStatus };
      await deleteItem('vendas', vendaId);
      await saveItem('vendas', convertedVenda);
      
      toast({ title: 'Orçamento Convertido em Pedido', description: `Novo Pedido #${nextId} gerado com sucesso.` });
      loadData();
      return;
    }

    await updateItemStatus('vendas', vendaId, newStatus);
    toast({ title: 'Status Atualizado', description: `Pedido #${vendaId} alterado com sucesso.` });
    loadData();
  };

  const handleBatchUpdate = async () => {
    if (!batchOrderIds.trim()) {
      toast({ title: 'Aviso', description: 'Insira os números dos pedidos.', variant: 'destructive' });
      return;
    }
    const ids = batchOrderIds.match(/\d+/g);
    if (!ids || ids.length === 0) {
      toast({ title: 'Aviso', description: 'Nenhum número válido encontrado.', variant: 'destructive' });
      return;
    }
    
    let updatedCount = 0;
    for (const num of ids) {
      const fullId = `TV-${num}`;
      const venda = vendas.find(v => v.id === fullId || v.id === num);
      if (venda && venda.status !== batchStatus) {
        await updateItemStatus('vendas', venda.id, batchStatus);
        updatedCount++;
      }
    }
    
    if (updatedCount > 0) {
      toast({ title: 'Sucesso', description: `${updatedCount} pedidos atualizados.` });
      setBatchOrderIds('');
      loadData();
    } else {
      toast({ title: 'Aviso', description: 'Nenhum pedido precisou ser atualizado.' });
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Necessário para permitir o drop
  };
  
  const handleDrop = async (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      const venda = vendas.find(v => v.id === id);
      if (venda && venda.status !== newStatus) {
        await handleUpdateStatus(id, newStatus);
      }
    }
  };

  // Get current date string for input
  const orderDate = new Date().toISOString().split('T')[0];

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-4 border-slate-800 border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-xs uppercase font-bold tracking-widest text-slate-400">Verificando sessão segura...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    if (isFirstAccess) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-950 p-4">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent pointer-events-none" />
            <CardHeader className="text-center relative z-10">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mx-auto mb-4 border border-primary/30">
                <Sparkles className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black font-headline text-white">Primeiro Acesso / Redefinição</CardTitle>
              <CardDescription>Cadastre seus dados para ativar a conta de {loginEmail}.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <form onSubmit={handleFirstAccessSubmit} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Seu Nome</label>
                  <input
                    type="text"
                    value={firstAccessName}
                    onChange={(e) => setFirstAccessName(e.target.value)}
                    placeholder="Seu Nome Completo"
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-white"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Senha de Acesso (Min. 6 digitos)</label>
                  <input
                    type="password"
                    value={firstAccessPassword}
                    onChange={(e) => setFirstAccessPassword(e.target.value)}
                    placeholder="Sua senha desejada"
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-white"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">E-mail de Recuperação (Gmail, Hotmail, etc.)</label>
                  <input
                    type="email"
                    value={firstAccessRecovery}
                    onChange={(e) => setFirstAccessRecovery(e.target.value)}
                    placeholder="seu.pessoal@gmail.com"
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-white"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5 font-bold">
                  Salvar e Acessar Painel
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setIsFirstAccess(false)} 
                  variant="ghost" 
                  className="w-full text-slate-400 font-bold"
                >
                  Voltar para o Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    }

    if (isForgotPassword) {
      return (
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-950 p-4">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent pointer-events-none" />
            <CardHeader className="text-center relative z-10">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary mx-auto mb-4 border border-primary/30">
                <Clock className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-black font-headline text-white">Recuperação de Senha</CardTitle>
              <CardDescription>Insira os e-mails associados para solicitar a redefinição.</CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
              <form onSubmit={handlePasswordRecovery} className="space-y-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">E-mail Profissional (equipe)</label>
                  <input
                    type="email"
                    value={recoveryInputEmail}
                    onChange={(e) => setRecoveryInputEmail(e.target.value)}
                    placeholder="nome@timevision.com.br"
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-white"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">E-mail de Recuperação Pessoal Cadastrado</label>
                  <input
                    type="email"
                    value={recoveryInputGmail}
                    onChange={(e) => setRecoveryInputGmail(e.target.value)}
                    placeholder="seu.pessoal@gmail.com"
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-white"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5 font-bold">
                  Enviar E-mail de Recuperação
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setIsForgotPassword(false)} 
                  variant="ghost" 
                  className="w-full text-slate-400 font-bold"
                >
                  Voltar para o Login
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      );
    }

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
                  placeholder="admin@timevision.com.br"
                  className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-white disabled:opacity-50"
                  required
                  disabled={loginStep === 'password'}
                />
              </div>
              {loginStep === 'password' && (
                <div className="flex flex-col gap-1.5 text-left">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Senha</label>
                    <button 
                      type="button" 
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[10px] text-primary hover:underline font-bold"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm focus:outline-none focus:border-primary text-white"
                    autoFocus
                  />
                </div>
              )}
              <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-5 font-bold">
                {loginStep === 'email' ? 'Continuar' : 'Entrar no Painel'}
              </Button>
              {loginStep === 'password' && (
                <Button 
                  type="button" 
                  onClick={() => setLoginStep('email')} 
                  variant="ghost" 
                  className="w-full text-slate-400 font-bold"
                >
                  Voltar
                </Button>
              )}
              {process.env.NODE_ENV === 'development' && (
                <Button 
                  type="button" 
                  onClick={() => {
                    setIsAuthenticated(true);
                    setCurrentUser({ email: 'admin@timevision.com.br', nome: 'Desenvolvedor' });
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
        </Card>
      </div>
    );
  }

  // Render OS Generator Modal View if active
  if (activeOSVenda) {
    return (
      <div className="bg-slate-950/90 h-screen w-screen fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 overflow-hidden backdrop-blur-sm">
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
          <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 bg-transparent">
            <img src="/logos/icone/MARCA D´ÁGUA/icone-no-bg.svg" alt="Timevision Icon" className="w-full h-full object-contain" />
          </div>
          <div>
            <p className="font-tagline text-brand-off-white tracking-widest text-xs uppercase">Painel PDV & Gestão</p>
            <p className="font-body text-brand-off-white/40 text-[10px]">Olá, <strong className="text-brand-gold">{currentUser?.nome || 'Consultor'}</strong></p>
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
            { id: 'eventos', Icon: Calendar, label: "Eventos" },
            { id: 'mkt', Icon: Sparkles, label: "Marketing" },
            { id: 'laboratorios', Icon: FlaskConical, label: "Laboratórios" },
            { id: 'financeiro', Icon: DollarSign, label: "Financeiro" }
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

      <main className="flex-1 p-6 md:p-8 w-full">
        
        {/* TABA 1: DASHBOARD */}
        {activeTab === 'dash' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-headline font-bold flex items-center gap-2">
                Visão Geral & Finanças
                {currentUser?.email === 'admin@timevision.com.br' && (
                  <>
                    <button 
                      onClick={async () => {
                        if (!confirm('Vincular todas as vendas sem consultor ao Moisés?')) return;
                        try {
                          const moises = equipe.find(e => e.nome.toLowerCase().includes('moisés') || e.nome.toLowerCase().includes('moises'));
                          if (!moises) return alert('Consultor Moisés não encontrado na equipe!');
                          const vendasAll = await getItems<Venda>('vendas');
                          let updated = 0;
                          for (const v of vendasAll) {
                            if (!v.vendedorId || v.vendedorId === 'admin@timevision.com.br') {
                              v.vendedorId = moises.email;
                              v.vendedorNome = moises.nome;
                              await saveItem('vendas', v);
                              updated++;
                            }
                          }
                          alert(`Pronto! ${updated} vendas antigas foram vinculadas ao consultor Moisés.`);
                          loadData();
                        } catch (err) {
                          alert('Erro ao atualizar vendas: ' + err);
                        }
                      }}
                      className="text-[10px] bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-white px-2 py-1 rounded transition-colors"
                    >
                      Vincular Antigas ao Moisés
                    </button>

                    <button 
                      onClick={async () => {
                        if (!confirm('Tem certeza que deseja subir os dados do navegador (LocalStorage) para o Firebase na nuvem? ISSO PODE DUPLICAR DADOS se clicado duas vezes.')) return;
                        try {
                          const colecoes = ['equipe', 'eventos', 'clientes', 'produtos', 'vendas', 'laboratorios'];
                          let total = 0;
                          for (const col of colecoes) {
                            const localData = localStorage.getItem(`tv_${col}`);
                            if (localData) {
                              const items = JSON.parse(localData);
                              for (const item of items) {
                                await saveItem(col, item);
                                total++;
                              }
                            }
                          }
                          alert(`Migração completa! ${total} registros foram enviados do navegador para o Firebase.`);
                          loadData();
                        } catch (err) {
                          alert('Erro ao migrar dados: ' + err);
                        }
                      }}
                      className="text-[10px] bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white px-2 py-1 rounded transition-colors"
                    >
                      ☁️ Migrar Dados para Nuvem
                    </button>
                  </>
                )}
              </h2>
              <div className="flex flex-wrap gap-3">
                {/* Vendedor Filter */}
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
                  <span className="text-slate-400">Consultor:</span>
                  <select
                    value={selectedVendedorId}
                    onChange={(e) => setSelectedVendedorId(e.target.value)}
                    className="bg-transparent border-none text-white focus:outline-none font-bold text-xs cursor-pointer"
                  >
                    <option value="todos" className="bg-slate-900">Todos</option>
                    <option value="admin@timevision.com.br" className="bg-slate-900">Administrador</option>
                    {equipe.map(member => (
                      <option key={member.email} value={member.email} className="bg-slate-900">{member.nome}</option>
                    ))}
                  </select>
                </div>

                {/* Event Filter */}
                <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs">
                  <span className="text-slate-400">Origem (Evento):</span>
                  <select
                    value={selectedEventoId}
                    onChange={(e) => setSelectedEventoId(e.target.value)}
                    className="bg-transparent border-none text-white focus:outline-none font-bold text-xs cursor-pointer"
                  >
                    <option value="todos" className="bg-slate-900">Todos (Loja + Eventos)</option>
                    <option value="loja" className="bg-slate-900">Apenas Loja Física</option>
                    {eventos.map(ev => (
                      <option key={ev.id} value={ev.id} className="bg-slate-900">{ev.nome}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
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

            {/* Kanban Board & Batch Updater */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-end bg-slate-900 border border-slate-800 p-4 rounded-xl shadow">
                <div className="flex-1 w-full">
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Atualização em Lote (Insira os números dos pedidos)</label>
                  <input
                    type="text"
                    value={batchOrderIds}
                    onChange={(e) => setBatchOrderIds(e.target.value)}
                    placeholder="Ex: 1001, 1002, 1005"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="w-full md:w-48">
                  <label className="text-[10px] font-bold uppercase text-slate-400 mb-1 block">Novo Status</label>
                  <select
                    value={batchStatus}
                    onChange={(e) => setBatchStatus(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
                  >
                    <option value="orcamento">Orçamento (7 dias)</option>
                    <option value="recebido">Novo Pedido</option>
                    <option value="laboratorio">No Laboratório</option>
                    <option value="montagem">Em Montagem</option>
                    <option value="pronto">Pronto p/ Entrega</option>
                    <option value="entregue">Entregue</option>
                    <option value="cancelado">Cancelado</option>
                  </select>
                </div>
                <Button onClick={handleBatchUpdate} className="w-full md:w-auto bg-primary text-primary-foreground font-bold">
                  Atualizar Todos
                </Button>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
                {[
                  { id: 'orcamento', label: 'Orçamento', color: 'border-slate-500 text-slate-400' },
                  { id: 'recebido', label: 'Novo Pedido', color: 'border-blue-500 text-blue-400' },
                  { id: 'laboratorio', label: 'Laboratório', color: 'border-amber-500 text-amber-400' },
                  { id: 'montagem', label: 'Montagem', color: 'border-purple-500 text-purple-400' },
                  { id: 'pronto', label: 'Pronto', color: 'border-green-500 text-green-400' },
                  { id: 'entregue', label: 'Entregue', color: 'border-emerald-500 text-emerald-400' },
                  { id: 'cancelado', label: 'Cancelado', color: 'border-red-500 text-red-400' }
                ].map(col => {
                  const colOrders = vendas.filter(v => {
                    if (v.status !== col.id) return false;
                    if (selectedVendedorId !== 'todos' && v.vendedorId !== selectedVendedorId) return false;
                    if (selectedEventoId !== 'todos') {
                      if (selectedEventoId === 'loja' && v.eventoId && v.eventoId !== 'loja') return false;
                      if (selectedEventoId !== 'loja' && v.eventoId !== selectedEventoId) return false;
                    }
                    return true;
                  });

                  return (
                    <div 
                      key={col.id} 
                      className="min-w-[160px] max-w-[280px] flex-1 flex-shrink-0 bg-slate-900/50 rounded-xl border border-slate-800 flex flex-col snap-center"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, col.id)}
                    >
                      <div className={`p-3 border-b-2 ${col.color} bg-slate-900 rounded-t-xl flex justify-between items-center`}>
                        <h3 className="font-bold text-xs uppercase tracking-wider">{col.label}</h3>
                        <span className="bg-slate-800 text-[10px] py-0.5 px-2 rounded-full font-bold">{colOrders.length}</span>
                      </div>
                      <div className="p-2 flex-1 overflow-y-auto space-y-2 max-h-[600px] min-h-[150px]">
                        {colOrders.map(v => (
                          <div 
                            key={v.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, v.id)}
                            className="bg-slate-950 p-3 rounded-lg border border-slate-800 cursor-grab active:cursor-grabbing hover:border-slate-600 transition-colors relative"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-black text-primary text-sm">#{v.id}</span>
                              <Button 
                                onClick={() => setActiveOSVenda(v)}
                                size="sm" 
                                variant="ghost" 
                                className="h-6 w-6 p-0 text-slate-400 hover:text-primary"
                                title="Visualizar O.S."
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <div className="font-bold text-sm text-slate-200 truncate" title={v.clienteNome}>{v.clienteNome}</div>
                            <div className="text-[10px] text-slate-400 mt-1 uppercase">Lab: <span className="font-bold text-slate-300">{v.laboratorioNome || 'Não definido'}</span></div>
                            <div className="text-[10px] text-slate-400 uppercase">Valor: <span className="font-bold text-slate-300">R$ {v.valorTotal.toFixed(2)}</span></div>
                            <div className="text-[10px] text-slate-500 mt-1">{new Date(v.dataVenda).toLocaleDateString('pt-BR')}</div>
                            
                            {v.eventoId && (() => {
                              if (v.eventoId === 'loja') {
                                return <span className="absolute bottom-2 right-2 text-[8px] uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded font-bold shadow">LOJA</span>;
                              }
                              const ev = eventos.find(e => e.id === v.eventoId);
                              const colorClass = ev?.cor || 'bg-primary';
                              return (
                                <span className={`absolute bottom-2 right-2 text-[8px] uppercase tracking-wider ${colorClass} text-white px-1.5 py-0.5 rounded font-bold shadow`}>
                                  {ev?.nome || 'Promocional'}
                                </span>
                              );
                            })()}
                          </div>
                        ))}
                        {colOrders.length === 0 && (
                          <div className="text-center py-6 text-[10px] uppercase text-slate-500 font-bold border-2 border-dashed border-slate-800/50 rounded-lg h-full flex items-center justify-center">
                            Vazio
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
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
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Consultor / Vendedor</label>
                      <select
                        value={pdvVendedorId}
                        onChange={(e) => setPdvVendedorId(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                        required
                      >
                        <option value="">Selecione o consultor...</option>
                        <option value="admin@timevision.com.br">Administrador</option>
                        {equipe.map(member => (
                          <option key={member.email} value={member.email}>{member.nome}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vincular a Evento</label>
                      <select
                        value={pdvEventoId}
                        onChange={(e) => setPdvEventoId(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                        required
                      >
                        <option value="">Selecione a origem...</option>
                        <option value="loja">Loja Física</option>
                        {eventos.filter(ev => ev.status === 'ativo').map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.nome}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Laboratório</label>
                      <select
                        value={pdvLaboratorioId}
                        onChange={(e) => setPdvLaboratorioId(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                      >
                        <option value="">Nenhum...</option>
                        {laboratorios.map(lab => (
                          <option key={lab.id} value={lab.id}>{lab.nome}</option>
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

                    <div className="flex flex-col gap-1.5 justify-end">
                      <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm h-[46px]">
                        <input
                          type="checkbox"
                          id="pdv-is-doacao"
                          checked={pdvIsDoacao}
                          onChange={(e) => setPdvIsDoacao(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-primary focus:ring-primary cursor-pointer"
                        />
                        <label htmlFor="pdv-is-doacao" className="text-xs font-bold text-slate-350 cursor-pointer select-none">
                          Registrar como Doação / Cortesia
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Eyeglass Prescription (Receita) */}
                  <div className="border-t border-slate-800 pt-4">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Cadastrar Receita de Visão (Para O.S.)</h4>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-3">
                      <div className="text-[10px] uppercase font-bold text-slate-300 mb-2 border-b border-slate-800 pb-1">Medidas para Longe</div>
                      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-2 text-[10px] uppercase font-bold text-slate-500 text-center mb-2">
                        <div className="text-left">Olho</div>
                        <div>Esférico</div>
                        <div>Cilíndrico</div>
                        <div>Eixo</div>
                        <div>DNP</div>
                        <div>Altura</div>
                      </div>
                      
                      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-2 items-center mb-2">
                        <span className="text-[10px] font-bold text-slate-400 w-8">O.D.</span>
                        <input type="text" value={pdvLongeEsfOD} onChange={(e) => setPdvLongeEsfOD(e.target.value)} placeholder="0.00" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvLongeCilOD} onChange={(e) => setPdvLongeCilOD(e.target.value)} placeholder="0.00" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvLongeEixoOD} onChange={(e) => setPdvLongeEixoOD(e.target.value)} placeholder="Ex: 90" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvLongeDnpOD} onChange={(e) => setPdvLongeDnpOD(e.target.value)} placeholder="DNP" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvLongeAlturaOD} onChange={(e) => setPdvLongeAlturaOD(e.target.value)} placeholder="Alt" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                      </div>
                      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-2 items-center">
                        <span className="text-[10px] font-bold text-slate-400 w-8">O.E.</span>
                        <input type="text" value={pdvLongeEsfOE} onChange={(e) => setPdvLongeEsfOE(e.target.value)} placeholder="0.00" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvLongeCilOE} onChange={(e) => setPdvLongeCilOE(e.target.value)} placeholder="0.00" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvLongeEixoOE} onChange={(e) => setPdvLongeEixoOE(e.target.value)} placeholder="Ex: 85" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvLongeDnpOE} onChange={(e) => setPdvLongeDnpOE(e.target.value)} placeholder="DNP" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvLongeAlturaOE} onChange={(e) => setPdvLongeAlturaOE(e.target.value)} placeholder="Alt" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                      </div>
                    </div>

                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 mb-3">
                      <div className="text-[10px] uppercase font-bold text-slate-300 mb-2 border-b border-slate-800 pb-1">Medidas para Perto</div>
                      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-2 items-center mb-2">
                        <span className="text-[10px] font-bold text-slate-400 w-8">O.D.</span>
                        <input type="text" value={pdvPertoEsfOD} onChange={(e) => setPdvPertoEsfOD(e.target.value)} placeholder="0.00" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvPertoCilOD} onChange={(e) => setPdvPertoCilOD(e.target.value)} placeholder="0.00" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvPertoEixoOD} onChange={(e) => setPdvPertoEixoOD(e.target.value)} placeholder="Ex: 90" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvPertoDnpOD} onChange={(e) => setPdvPertoDnpOD(e.target.value)} placeholder="DNP" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvPertoAlturaOD} onChange={(e) => setPdvPertoAlturaOD(e.target.value)} placeholder="Alt" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                      </div>
                      <div className="grid grid-cols-[auto_1fr_1fr_1fr_1fr_1fr] gap-2 items-center">
                        <span className="text-[10px] font-bold text-slate-400 w-8">O.E.</span>
                        <input type="text" value={pdvPertoEsfOE} onChange={(e) => setPdvPertoEsfOE(e.target.value)} placeholder="0.00" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvPertoCilOE} onChange={(e) => setPdvPertoCilOE(e.target.value)} placeholder="0.00" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvPertoEixoOE} onChange={(e) => setPdvPertoEixoOE(e.target.value)} placeholder="Ex: 85" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvPertoDnpOE} onChange={(e) => setPdvPertoDnpOE(e.target.value)} placeholder="DNP" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                        <input type="text" value={pdvPertoAlturaOE} onChange={(e) => setPdvPertoAlturaOE(e.target.value)} placeholder="Alt" className="bg-slate-900 border border-slate-700 rounded p-1.5 text-center text-xs text-white" />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="flex flex-col gap-1 w-full sm:max-w-[200px]">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Adição</label>
                        <input
                          type="text"
                          value={pdvAdicao}
                          onChange={(e) => setPdvAdicao(e.target.value)}
                          placeholder="Ex: +2.00"
                          className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-full sm:max-w-[200px]">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Código da Lente (Lab)</label>
                        <input
                          type="text"
                          value={pdvCodigoLente}
                          onChange={(e) => setPdvCodigoLente(e.target.value)}
                          placeholder="Ref/Código"
                          className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Calculations and Final Actions */}
                  <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                    <div>
                      <span className="text-xs text-slate-450 block uppercase font-bold">Valor Total a Pagar</span>
                      <span className="text-3xl font-black text-primary">R$ {pdvIsDoacao ? '0.00' : pdvPriceTotal.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      {!pdvIsDoacao && (
                        <Button 
                          type="submit" 
                          onClick={() => setPdvSaleType('orcamento')}
                          variant="outline"
                          className="border-slate-800 text-slate-350 hover:bg-slate-850 hover:text-white font-bold px-6 py-6 text-xs uppercase tracking-wider rounded-xl"
                        >
                          Gerar Orçamento (7 dias)
                        </Button>
                      )}
                      <Button 
                        type="submit" 
                        onClick={() => setPdvSaleType('venda')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold px-8 py-6 text-xs uppercase tracking-wider rounded-xl"
                      >
                        {pdvIsDoacao ? 'Registrar Doação & Abrir O.S.' : 'Registrar Venda & Abrir O.S.'}
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
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg font-bold">{c.nome}</CardTitle>
                          {c.eventoId && (() => {
                              if (c.eventoId === 'loja') {
                                return <span className="text-[9px] uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded-full font-bold shadow">LOJA</span>;
                              }
                              const ev = eventos.find(e => e.id === c.eventoId);
                              const colorClass = ev?.cor || 'bg-primary';
                              return (
                                <span className={`text-[9px] uppercase tracking-wider ${colorClass} text-white px-1.5 py-0.5 rounded-full font-bold shadow`}>
                                  {ev?.nome || 'Promocional'}
                                </span>
                              );
                          })()}
                        </div>
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
                      <div>
                        <span className="font-bold text-slate-450 uppercase text-[9px] block mt-1">Consultor(a) Responsável</span> 
                        <span className="text-amber-500/90 font-medium">
                          {equipe.find(m => m.email === c.cadastradoPor)?.nome || (c.cadastradoPor === 'admin@timevision.com.br' ? 'Administrador' : c.cadastradoPor || 'ADM')}
                        </span>
                      </div>
                      
                      {/* Prescription history snippet */}
                      {customerPrescriptions.length > 0 && (
                        <div className="mt-3 bg-slate-950 p-2.5 rounded-lg border border-slate-800/60">
                          <span className="font-bold text-primary uppercase text-[9px] block mb-1">Última Receita ({customerPrescriptions[0].id})</span>
                          <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
                            <span className="text-left font-bold text-slate-400">Olho</span><span>ESF</span><span>CIL</span><span>EIXO</span>
                            <span className="text-left font-semibold">OD Longe</span>
                            <span>{customerPrescriptions[0].receita?.longeEsfericoOD || customerPrescriptions[0].receita?.esfericoOD}</span>
                            <span>{customerPrescriptions[0].receita?.longeCilindricoOD || customerPrescriptions[0].receita?.cilindricoOD}</span>
                            <span>{customerPrescriptions[0].receita?.longeEixoOD || customerPrescriptions[0].receita?.eixoOD || '-'}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-2 text-center text-[10px] items-center mt-1">
                            <span className="text-left font-semibold">OE Longe</span>
                            <span>{customerPrescriptions[0].receita?.longeEsfericoOE || customerPrescriptions[0].receita?.esfericoOE}</span>
                            <span>{customerPrescriptions[0].receita?.longeCilindricoOE || customerPrescriptions[0].receita?.cilindricoOE}</span>
                            <span>{customerPrescriptions[0].receita?.longeEixoOE || customerPrescriptions[0].receita?.eixoOE || '-'}</span>
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
                            step="any"
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
                            step="any"
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
                            step="any"
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-headline font-bold">Gerador de Material de Marketing</h2>
              <div className="flex bg-slate-900 border border-slate-800 rounded-lg p-1">
                <button
                  onClick={() => setMarketingMode('flyer')}
                  className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
                    marketingMode === 'flyer' ? 'bg-primary text-primary-foreground' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Panfleto Digital
                </button>
                <button
                  onClick={() => setMarketingMode('banner')}
                  className={`px-4 py-2 text-xs font-bold rounded-md transition-colors ${
                    marketingMode === 'banner' ? 'bg-primary text-primary-foreground' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Banner para Stand
                </button>
              </div>
            </div>
            
            {marketingMode === 'flyer' ? <MarketingFlyer /> : <MarketingBanner />}
          </div>
        )}

        {/* TABA 6: EVENTOS */}
        {activeTab === 'eventos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-headline font-bold">Gestão de Eventos Promocionais</h2>
                <p className="text-xs text-slate-400">Configure ações sociais, feiras e visualize leads inscritos.</p>
              </div>
              <Button 
                onClick={() => {
                  setEditingEvento(null);
                  setIsEventModalOpen(true);
                }} 
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" /> Novo Evento
              </Button>
            </div>

            {/* Event list */}
            <div className="grid grid-cols-1 gap-6">
              {eventos.map((ev) => {
                const eventLeads = leads.filter(l => l.eventoId === ev.id);
                const eventSales = vendas.filter(v => v.eventoId === ev.id && v.status !== 'orcamento');
                const eventRevenue = eventSales.reduce((sum, current) => sum + current.valorTotal, 0);
                
                // Construct subscription landing page URL
                const landingPageUrl = typeof window !== 'undefined' 
                  ? `${window.location.origin}/inscricao-evento?evento=${ev.id}`
                  : `/inscricao-evento?evento=${ev.id}`;

                return (
                  <Card key={ev.id} className={`bg-slate-900 border-slate-800 shadow-md ${ev.status === 'arquivado' ? 'opacity-65' : ''}`}>
                    <CardHeader className="pb-3 border-b border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg font-bold">{ev.nome}</CardTitle>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            ev.status === 'ativo' ? 'bg-green-950 text-green-400 border border-green-900/30' : 'bg-slate-950 text-slate-450 border border-slate-800'
                          }`}>
                            {ev.status === 'ativo' ? 'Ativo' : 'Arquivado'}
                          </span>
                        </div>
                        <CardDescription className="text-xs text-slate-450 mt-1 flex flex-wrap gap-x-4 gap-y-1">
                          <span>Data: {new Date(ev.data).toLocaleDateString('pt-BR')}</span>
                          <span>Local: {ev.local}</span>
                          {ev.criadoPor && <span>Criado por: {ev.criadoPor}</span>}
                        </CardDescription>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(landingPageUrl);
                            toast({ title: 'Link Copiado!', description: 'Link de inscrição copiado para a área de transferência.' });
                          }}
                          className="border-slate-800 text-slate-350 hover:bg-slate-800 text-[10px] py-1 px-2.5 font-semibold"
                        >
                          Copiar Link de Inscrição
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingEvento(ev);
                            setIsEventModalOpen(true);
                          }}
                          className="border-slate-800 text-slate-350 hover:bg-slate-800 text-[10px] py-1 px-2.5 font-semibold"
                        >
                          Editar
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => handleArchiveEvento(ev)}
                          className="border-slate-800 text-slate-350 hover:bg-slate-800 text-[10px] py-1 px-2.5 font-semibold"
                        >
                          {ev.status === 'ativo' ? 'Arquivar' : 'Reativar'}
                        </Button>
                        <Button 
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteEvento(ev.id)}
                          className="text-red-400 hover:bg-red-950/20 hover:text-red-300 text-[10px] py-1 px-2.5 font-semibold"
                        >
                          Excluir
                        </Button>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-4 space-y-4">
                      {/* Metric cards for the event */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/40">
                          <span className="text-[10px] uppercase font-bold text-slate-450 block">Inscrições (Leads)</span>
                          <span className="text-xl font-black text-white">{eventLeads.length}</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/40">
                          <span className="text-[10px] uppercase font-bold text-slate-450 block">Conversões em Venda</span>
                          <span className="text-xl font-black text-white">{eventSales.length}</span>
                        </div>
                        <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/40 col-span-2 sm:col-span-1">
                          <span className="text-[10px] uppercase font-bold text-slate-450 block text-primary">Receita Gerada</span>
                          <span className="text-xl font-black text-primary">R$ {eventRevenue.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Lead Lists */}
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Users size={12} className="text-primary" /> Leads Cadastrados
                        </h4>
                        
                        {eventLeads.length === 0 ? (
                          <p className="text-xs text-slate-500 italic py-2">Nenhum lead se cadastrou neste evento ainda.</p>
                        ) : (
                          <div className="overflow-x-auto border border-slate-800 rounded-lg">
                            <table className="w-full text-[11px] text-left border-collapse">
                              <thead>
                                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase text-[9px]">
                                  <th className="py-2 px-3">Nome</th>
                                  <th className="py-2 px-3">WhatsApp</th>
                                  <th className="py-2 px-3">E-mail</th>
                                  <th className="py-2 px-3">Necessidade</th>
                                  <th className="py-2 px-3 text-right">Data Inscrição</th>
                                </tr>
                              </thead>
                              <tbody>
                                {eventLeads.map((lead, idx) => (
                                  <tr key={idx} className="border-b border-slate-800/30 hover:bg-slate-850/30">
                                    <td className="py-2 px-3 font-semibold text-slate-200">{lead.nome}</td>
                                    <td className="py-2 px-3 text-slate-350">{lead.whatsapp}</td>
                                    <td className="py-2 px-3 text-slate-350">{lead.email}</td>
                                    <td className="py-2 px-3">
                                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold uppercase">
                                        {lead.exame}
                                      </span>
                                    </td>
                                    <td className="py-2 px-3 text-right text-slate-500">
                                      {lead.criadoEm ? new Date(lead.criadoEm).toLocaleDateString('pt-BR') : '-'}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}

              {eventos.length === 0 && (
                <div className="text-center py-12 bg-slate-900 border border-slate-800 rounded-xl">
                  <Calendar className="h-12 w-12 text-slate-650 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-300">Nenhum Evento Configurado</h3>
                  <p className="text-xs text-slate-500 mt-1">Crie um evento acima para começar a registrar leads.</p>
                </div>
              )}
            </div>

            {/* Event Creation Modal */}
            {isEventModalOpen && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">{editingEvento ? 'Editar Evento' : 'Configurar Novo Evento'}</CardTitle>
                    <CardDescription>Insira as informações do evento para geração de landing page e banners.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSaveEvento} className="space-y-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-slate-400">Nome do Evento</label>
                        <input
                          type="text"
                          name="nome"
                          defaultValue={editingEvento?.nome || ''}
                          placeholder="Ex: Ação Social Paróquia São Jorge"
                          className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Data do Evento</label>
                          <input
                            type="date"
                            name="data"
                            defaultValue={editingEvento?.data || ''}
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Local</label>
                          <input
                            type="text"
                            name="local"
                            defaultValue={editingEvento?.local || ''}
                            placeholder="Ex: Nilópolis, RJ"
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none focus:border-primary"
                            required
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4 border-t border-slate-800">
                        <Button type="submit" className="flex-1 bg-primary text-primary-foreground font-bold">
                          {editingEvento ? 'Salvar Alterações' : 'Criar Evento'}
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => {
                            setIsEventModalOpen(false);
                            setEditingEvento(null);
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
                    <label className="text-[10px] font-bold uppercase text-slate-400">Data de Nascimento</label>
                    <input
                      type="date"
                      name="dataNascimento"
                      defaultValue={editingCliente?.dataNascimento || ''}
                      className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                      required
                    />
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
                  <div className="grid grid-cols-[1fr_2fr] gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">CEP</label>
                      <input
                        type="text"
                        name="cep"
                        id="cep-input"
                        placeholder="00000-000"
                        defaultValue={editingCliente?.cep || ''}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                        required
                        onBlur={async (e) => {
                          const cep = e.target.value.replace(/\D/g, '');
                          if (cep.length === 8) {
                            try {
                              const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                              const data = await res.json();
                              if (!data.erro) {
                                const enderecoInput = document.getElementById('endereco-input') as HTMLInputElement;
                                if (enderecoInput) {
                                  enderecoInput.value = `${data.logradouro}, , ${data.bairro}, ${data.localidade} - ${data.uf}`;
                                }
                              }
                            } catch (error) {
                              console.error('Erro ao buscar CEP', error);
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-slate-400">Endereço Completo</label>
                      <input
                        type="text"
                        name="endereco"
                        id="endereco-input"
                        defaultValue={editingCliente?.endereco || ''}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-slate-405">Vincular a Evento</label>
                      <select
                        name="eventoId"
                        defaultValue={editingCliente?.eventoId || ''}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                      >
                        <option value="">Selecione a origem...</option>
                        <option value="loja">Loja Física</option>
                        {eventos.map(ev => (
                          <option key={ev.id} value={ev.id}>{ev.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-slate-405">Cadastrado por (Consultor)</label>
                      <select
                        name="cadastradoPor"
                        defaultValue={editingCliente?.cadastradoPor || currentUser?.email || 'admin@timevision.com.br'}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                      >
                        <option value="admin@timevision.com.br">Administrador</option>
                        {equipe.map(member => (
                          <option key={member.email} value={member.email}>{member.nome}</option>
                        ))}
                      </select>
                    </div>
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

        {/* TABA 7: LABORATÓRIOS */}
        {activeTab === 'laboratorios' && (
          <LaboratoriosManager />
        )}

        {/* TABA 8: GESTÃO FINANCEIRA */}
        {activeTab === 'financeiro' && (() => {
          // Extract unique months from sales and despesas
          const allMonthsSet = new Set<string>();
          vendas.forEach(v => {
            if (v.dataVenda && v.dataVenda.length >= 7) {
              allMonthsSet.add(v.dataVenda.substring(0, 7));
            }
          });
          despesas.forEach(d => {
            if (d.data && d.data.length >= 7) {
              allMonthsSet.add(d.data.substring(0, 7));
            }
          });
          const availableMonths = Array.from(allMonthsSet).sort((a, b) => b.localeCompare(a));

          // Filter collections by month if a month filter is selected
          const filteredSalesForMonth = vendas.filter(v => {
            if (v.status === 'cancelado' || v.status === 'orcamento') return false;
            if (selectedMonthFilter !== 'todos') {
              return v.dataVenda && v.dataVenda.substring(0, 7) === selectedMonthFilter;
            }
            return true;
          });

          const filteredDespesasForMonth = despesas.filter(d => {
            if (selectedMonthFilter !== 'todos') {
              return d.data && d.data.substring(0, 7) === selectedMonthFilter;
            }
            return true;
          });

          // Metrics calculations based on the filtered records
          const faturamentoBruto = filteredSalesForMonth.reduce((acc, v) => acc + (v.isDoacao ? 0 : (v.valorTotal || 0)), 0);
          const custoProdutos = filteredSalesForMonth.reduce((acc, v) => acc + (v.custoTotal || 0), 0);
          const custoErros = filteredSalesForMonth.reduce((acc, v) => acc + (v.custoErroRefazerLente || 0) + (v.custoErroDevolucao || 0) + (v.custoErroDesconto || 0), 0);
          const taxasCartao = filteredSalesForMonth.reduce((acc, v) => acc + (v.taxaCartaoJuros || 0), 0);
          const totalDespesasOperacionais = filteredDespesasForMonth.reduce((acc, d) => acc + (d.valor || 0), 0);
          const taxRate = taxSimplesNacionalBracket === 'bracket1' ? 0.04 : taxSimplesNacionalBracket === 'bracket2' ? 0.073 : 0.095;
          const impostosEstimados = faturamentoBruto * taxRate;
          const custosTotais = custoProdutos + totalDespesasOperacionais + custoErros + taxasCartao + impostosEstimados;
          const lucroLiquido = faturamentoBruto - custosTotais;

          // Cash Flow Projections (Next 6 months starting from current month)
          const today = new Date();
          const next6Months = Array.from({ length: 6 }).map((_, idx) => {
            const date = new Date(today.getFullYear(), today.getMonth() + idx, 1);
            const key = date.toISOString().substring(0, 7); // YYYY-MM
            
            // Format to Pt-BR
            const monthName = date.toLocaleString('pt-BR', { month: 'long' });
            const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);
            
            return {
              key,
              label: `${capitalizedMonth} / ${date.getFullYear()}`,
              entradas: 0,
              saidas: 0
            };
          });

          // Distribute Inflows (Entradas)
          vendas.forEach(v => {
            if (v.status === 'cancelado' || v.status === 'orcamento') return;
            const saleDateObj = new Date(v.dataVenda);
            if (isNaN(saleDateObj.getTime())) return;
            
            const total = v.isDoacao ? 0 : (v.valorTotal || 0);
            const method = v.pagamento?.metodo || 'Cartão de Crédito';
            const installmentsStr = v.pagamento?.parcelas || '1x';
            const numInstallments = parseInt(installmentsStr) || 1;
            const sinal = v.pagamento?.sinal || 0;
            const remaining = total - sinal;
            
            // Sinal is received in the month of the sale
            const saleMonthKey = v.dataVenda.substring(0, 7);
            const sinalProj = next6Months.find(m => m.key === saleMonthKey);
            if (sinalProj) {
              sinalProj.entradas += sinal;
            }
            
            // Remaining balance
            if (method === 'Cartão de Crédito' || numInstallments === 1) {
              // Cartão/1x is received immediately in full
              if (sinalProj) {
                sinalProj.entradas += remaining;
              }
            } else {
              // Custom installments (Boleto/Crediário) are split over subsequent months
              const installmentValue = remaining / numInstallments;
              for (let i = 1; i <= numInstallments; i++) {
                const dueDate = new Date(saleDateObj.getFullYear(), saleDateObj.getMonth() + i, saleDateObj.getDate());
                const dueMonthKey = dueDate.toISOString().substring(0, 7);
                const dueProj = next6Months.find(m => m.key === dueMonthKey);
                if (dueProj) {
                  dueProj.entradas += installmentValue;
                }
              }
            }
          });

          // Distribute Outflows (Saídas)
          despesas.forEach(d => {
            const depMonthKey = d.data.substring(0, 7);
            const proj = next6Months.find(m => m.key === depMonthKey);
            if (proj) {
              proj.saidas += d.valor;
            }
          });

          // Build list of installment details for non-credit card parcelled sales
          interface InstallmentItem {
            id: string;
            saleId: string;
            clienteNome: string;
            clienteTelefone: string;
            metodo: string;
            parcelaLabel: string;
            valor: number;
            dataVencimento: string;
            isPaga: boolean;
            isAtrasada: boolean;
            vendaOriginal: Venda;
            index: number;
          }

          const installmentAlerts: InstallmentItem[] = [];
          const todayStr = today.toISOString().split('T')[0];

          vendas.forEach(v => {
            if (v.status === 'cancelado' || v.status === 'orcamento') return;
            const method = v.pagamento?.metodo || '';
            const installmentsStr = v.pagamento?.parcelas || '1x';
            const numInstallments = parseInt(installmentsStr) || 1;
            
            if (method !== 'Cartão de Crédito' && numInstallments > 1) {
              const saleDateObj = new Date(v.dataVenda);
              if (isNaN(saleDateObj.getTime())) return;
              
              const total = v.valorTotal || 0;
              const sinal = v.pagamento?.sinal || 0;
              const remaining = total - sinal;
              const installmentValue = remaining / numInstallments;
              
              for (let i = 1; i <= numInstallments; i++) {
                const isPaga = v.pagamento?.parcelasPagas?.[i] || false;
                
                let dueDateStr = v.pagamento?.datasVencimento?.[i];
                if (!dueDateStr) {
                  const dueDate = new Date(saleDateObj.getFullYear(), saleDateObj.getMonth() + i, saleDateObj.getDate());
                  dueDateStr = dueDate.toISOString().split('T')[0];
                }
                
                const isAtrasada = !isPaga && dueDateStr < todayStr;
                
                installmentAlerts.push({
                  id: `${v.id}-p${i}`,
                  saleId: v.id,
                  clienteNome: v.clienteNome,
                  clienteTelefone: v.clienteTelefone || '',
                  metodo: method,
                  parcelaLabel: `${i}/${numInstallments}`,
                  valor: installmentValue,
                  dataVencimento: dueDateStr,
                  isPaga,
                  isAtrasada,
                  vendaOriginal: v,
                  index: i
                });
              }
            }
          });

          return (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-2xl font-headline font-bold">Gestão Financeira Integrada</h2>
                  <p className="text-sm text-slate-450">Demonstração de resultados, fluxo de caixa, custos operacionais e doações por meses.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold uppercase text-slate-400">Filtrar Mês:</label>
                    <select
                      value={selectedMonthFilter}
                      onChange={(e) => setSelectedMonthFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-850 rounded-lg p-2 text-xs text-white focus:outline-none"
                    >
                      <option value="todos">Todos os Meses</option>
                      {availableMonths.map(m => {
                        const [year, month] = m.split('-');
                        const monthName = new Date(Number(year), Number(month) - 1, 1).toLocaleString('pt-BR', { month: 'long' });
                        return (
                          <option key={m} value={m}>
                            {monthName.charAt(0).toUpperCase() + monthName.slice(1)} / {year}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-850">
                    <button
                      type="button"
                      onClick={() => setFinanceiroSubTab('geral')}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${financeiroSubTab === 'geral' ? 'bg-primary text-primary-foreground font-black' : 'text-slate-400 hover:text-white'}`}
                    >
                      Resumo e Lançamentos
                    </button>
                    <button
                      type="button"
                      onClick={() => setFinanceiroSubTab('fiscal')}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-all ${financeiroSubTab === 'fiscal' ? 'bg-primary text-primary-foreground font-black' : 'text-slate-400 hover:text-white'}`}
                    >
                      Configurações Fiscais
                    </button>
                  </div>
                </div>
              </div>

              {financeiroSubTab === 'fiscal' ? (
                <div className="max-w-3xl mx-auto space-y-6">
                  <Card className="bg-slate-900 border-slate-800 shadow">
                    <CardHeader className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-lg font-bold text-slate-200 flex items-center gap-2">
                          <ShieldAlert className="text-brand-gold h-5 w-5" /> Parâmetros de Emissão de NFC-e
                        </CardTitle>
                        <CardDescription>Insira as credenciais de homologação/produção e o certificado digital A1 para transmissão direta à SEFAZ.</CardDescription>
                      </div>
                      <Button
                        type="button"
                        onClick={() => setIsFiscalHelpOpen(true)}
                        variant="outline"
                        className="border-brand-gold/40 hover:bg-brand-gold/10 text-brand-gold text-xs font-bold gap-1.5 self-start"
                      >
                        <HelpCircle size={14} /> Como Ativar? (Guia)
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleSaveConfigFiscal} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400">CNPJ da Empresa</label>
                            <input
                              type="text"
                              value={fiscalCnpj}
                              onChange={(e) => setFiscalCnpj(e.target.value)}
                              placeholder="00.000.000/0001-00"
                              className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400">Inscrição Estadual (IE)</label>
                            <input
                              type="text"
                              value={fiscalIe}
                              onChange={(e) => setFiscalIe(e.target.value)}
                              placeholder="Insira apenas números"
                              className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Razão Social / Nome da Empresa</label>
                          <input
                            type="text"
                            value={fiscalRazaoSocial}
                            onChange={(e) => setFiscalRazaoSocial(e.target.value)}
                            placeholder="Razão Social Registrada"
                            className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400">ID do Token CSC (ex: 000001)</label>
                            <input
                              type="text"
                              value={fiscalCscId}
                              onChange={(e) => setFiscalCscId(e.target.value)}
                              placeholder="Identificador do CSC"
                              className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400">Token CSC (Código de Segurança)</label>
                            <input
                              type="text"
                              value={fiscalCscToken}
                              onChange={(e) => setFiscalCscToken(e.target.value)}
                              placeholder="Ex: d8418ab7-9876-..."
                              className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400">Ambiente de Operação</label>
                            <select
                              value={fiscalAmbiente}
                              onChange={(e) => setFiscalAmbiente(e.target.value as any)}
                              className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                            >
                              <option value="homologacao">Homologação (Ambiente de Testes)</option>
                              <option value="producao">Produção (Emissão com Valor Fiscal Real)</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase text-slate-400">Senha do Certificado A1</label>
                            <input
                              type="password"
                              value={fiscalCertSenha}
                              onChange={(e) => setFiscalCertSenha(e.target.value)}
                              placeholder="Senha do arquivo .pfx"
                              className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                              required={!fiscalCertBase64}
                            />
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5 border-t border-slate-800 pt-4">
                          <label className="text-[10px] font-bold uppercase text-slate-400">Arquivo do Certificado A1 (.pfx / .p12)</label>
                          <input
                            type="file"
                            accept=".pfx,.p12"
                            onChange={handleCertificateUpload}
                            className="bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                          />
                          {fiscalCertBase64 ? (
                            <span className="text-emerald-400 text-[10px] font-bold">✓ Certificado Carregado e Pronto para Uso</span>
                          ) : (
                            <span className="text-amber-500 text-[10px]">⚠ Certificado Digital Ausente. Carregue o arquivo de assinatura digital.</span>
                          )}
                        </div>

                        <div className="flex justify-end pt-4 border-t border-slate-800">
                          <Button type="submit" className="bg-primary text-primary-foreground font-bold px-8 py-5">
                            Salvar Configurações Fiscais
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <>
                  {/* Metrics cards */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card className="bg-slate-900 border-slate-800 shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400">Faturamento Bruto</span>
                            <h3 className="text-2xl font-black text-brand-gold mt-1">R$ {faturamentoBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                          </div>
                          <div className="bg-amber-500/10 p-2 rounded-lg text-amber-500"><TrendingUp size={16} /></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400">Custos Operacionais</span>
                            <h3 className="text-2xl font-black text-slate-200 mt-1">R$ {totalDespesasOperacionais.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                          </div>
                          <div className="bg-slate-850 p-2 rounded-lg text-slate-400"><DollarSign size={16} /></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400">Custos com Erros</span>
                            <h3 className="text-2xl font-black text-red-400 mt-1">R$ {custoErros.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                          </div>
                          <div className="bg-red-500/10 p-2 rounded-lg text-red-400"><ShieldAlert size={16} /></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400">Impostos Simples ({ (taxRate * 100).toFixed(1) }%)</span>
                            <h3 className="text-2xl font-black text-slate-200 mt-1">R$ {impostosEstimados.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</h3>
                          </div>
                          <div className="bg-blue-500/10 p-2 rounded-lg text-blue-400"><Percent size={16} /></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800 shadow">
                      <CardContent className="pt-6">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold uppercase text-slate-400">Resultado Líquido</span>
                            <h3 className={`text-2xl font-black mt-1 ${lucroLiquido >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>
                              R$ {lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </h3>
                          </div>
                          <div className={`p-2 rounded-lg ${lucroLiquido >= 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-500'}`}><CheckCircle size={16} /></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    
                    {/* Box 1: Simples Nacional Bracket Simulator */}
                    <Card className="bg-slate-900 border-slate-800 lg:col-span-1 shadow">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-200 flex items-center gap-2">
                          <Percent className="text-brand-gold h-5 w-5" /> Simulador de Impostos (Anexo I)
                        </CardTitle>
                        <CardDescription>Configure a faixa de enquadramento do Simples Nacional.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-slate-400">Faturamento Anual (Últimos 12 meses)</label>
                          <select
                            value={taxSimplesNacionalBracket}
                            onChange={(e) => setTaxSimplesNacionalBracket(e.target.value as any)}
                            className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                          >
                            <option value="bracket1">Até R$ 180.000,00 (Alíquota Efetiva: 4.0%)</option>
                            <option value="bracket2">R$ 180.000,01 a R$ 360.000,00 (Alíquota Efetiva: 7.3%)</option>
                            <option value="bracket3">R$ 360.000,01 a R$ 720.000,00 (Alíquota Efetiva: 9.5%)</option>
                          </select>
                        </div>
                        <div className="bg-slate-950 border border-slate-850 rounded-xl p-4 space-y-2">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Alíquota Selecionada:</span>
                            <span className="font-bold text-white">{(taxRate * 100).toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Faturamento Mensal Calculado:</span>
                            <span className="font-bold text-white">R$ {faturamentoBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="border-t border-slate-800 pt-2 flex justify-between text-sm">
                            <span className="font-bold text-slate-300">Imposto devido estimado:</span>
                            <span className="font-bold text-brand-gold">R$ {impostosEstimados.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                        <div className="text-[10px] text-slate-500 italic">
                          *Estimativa de DAS comercial básica.
                        </div>
                      </CardContent>
                    </Card>

                    {/* Box 3: Cash Flow Projections */}
                    <Card className="bg-slate-900 border-slate-800 lg:col-span-1 shadow">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-200 flex items-center gap-2">
                          <TrendingUp className="text-brand-gold h-5 w-5" /> Fluxo de Caixa Previsto
                        </CardTitle>
                        <CardDescription>Entradas e saídas operacionais projetadas para 6 meses.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                        {next6Months.map(m => {
                          const saldo = m.entradas - m.saidas;
                          return (
                            <div key={m.key} className="flex justify-between items-center bg-slate-950/60 p-2 rounded border border-slate-850 text-xs">
                              <div>
                                <span className="text-[9px] font-black text-slate-400 block uppercase">{m.label}</span>
                                <div className="flex gap-2 text-[8px] text-slate-500 mt-0.5">
                                  <span>Entr: R$ {m.entradas.toFixed(0)}</span>
                                  <span>Saí: R$ {m.saidas.toFixed(0)}</span>
                                </div>
                              </div>
                              <span className={`font-black ${saldo >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                R$ {saldo.toFixed(2)}
                              </span>
                            </div>
                          );
                        })}
                      </CardContent>
                    </Card>

                    {/* Box 2: Expenses Logger Form & List */}
                    <Card className="bg-slate-900 border-slate-800 lg:col-span-2 shadow">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-200 flex items-center gap-2">
                          <DollarSign className="text-brand-gold h-5 w-5" /> {editingDespesaId ? 'Editar Custo Operacional' : 'Registro de Custos Operacionais'}
                        </CardTitle>
                        <CardDescription>
                          {editingDespesaId ? 'Modifique os dados do custo operacional e clique em atualizar.' : 'Cadastre as despesas com gasolina, coffee breaks, materiais de exposição, etc.'}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <form onSubmit={handleAddDespesa} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-850">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Categoria</label>
                            <select
                              value={despesaCategoria}
                              onChange={(e) => setDespesaCategoria(e.target.value as any)}
                              className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                            >
                              <option value="gasolina">Gasolina / Combustível</option>
                              <option value="coffee_break">Coffee Break / Alimentação</option>
                              <option value="cartao_visita">Cartões de Visita</option>
                              <option value="bolsa_personalizada">Bolsas Personalizadas</option>
                              <option value="material_expositivo">Material Expositivo</option>
                              <option value="software">Software / Sistemas</option>
                              <option value="imposto">Impostos / Taxas</option>
                              <option value="outros">Outros Custos</option>
                            </select>
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Valor (R$)</label>
                            <input
                              type="number"
                              step="any"
                              value={despesaValor || ''}
                              onChange={(e) => setDespesaValor(Number(e.target.value))}
                              placeholder="0.00"
                              className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-1.5 md:col-span-2">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Descrição</label>
                            <input
                              type="text"
                              value={despesaDescricao}
                              onChange={(e) => setDespesaDescricao(e.target.value)}
                              placeholder="Ex: Combustível para ação em Nilópolis"
                              className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Data do Gasto</label>
                            <input
                              type="date"
                              value={despesaData}
                              onChange={(e) => setDespesaData(e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white"
                              required
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vincular a Evento</label>
                            <select
                              value={despesaEventoId}
                              onChange={(e) => setDespesaEventoId(e.target.value)}
                              className="bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-white focus:outline-none"
                            >
                              <option value="">Nenhum...</option>
                              {eventos.map(ev => (
                                <option key={ev.id} value={ev.id}>{ev.nome}</option>
                              ))}
                            </select>
                          </div>
                          <div className="md:col-span-2 flex justify-end gap-2">
                            {editingDespesaId && (
                              <Button 
                                type="button" 
                                onClick={handleCancelEditDespesa} 
                                variant="outline"
                                className="border-slate-800 text-slate-400 text-xs font-bold px-4 uppercase tracking-wider"
                              >
                                Cancelar
                              </Button>
                            )}
                            <Button type="submit" className="bg-primary text-primary-foreground font-bold px-6 text-xs uppercase tracking-wider">
                              {editingDespesaId ? 'Atualizar Despesa' : 'Adicionar Despesa'}
                            </Button>
                          </div>
                        </form>

                        {/* List of despesas */}
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                          {filteredDespesasForMonth.length === 0 ? (
                            <p className="text-xs text-slate-500 italic text-center py-4">Nenhum custo operacional registrado.</p>
                          ) : (
                            filteredDespesasForMonth.slice().reverse().map(d => {
                              const evt = eventos.find(e => e.id === d.eventoId);
                              return (
                                <div key={d.id} className="flex justify-between items-center bg-slate-950/60 p-3 rounded-lg border border-slate-850">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-850 text-slate-350">{d.categoria.replace('_', ' ')}</span>
                                      <span className="text-xs text-slate-450 font-bold">{d.data.split('-').reverse().join('/')}</span>
                                    </div>
                                    <p className="text-xs text-white font-medium mt-1">{d.descricao}</p>
                                    {evt && <p className="text-[9px] text-brand-gold font-bold uppercase mt-0.5">Origem: {evt.nome}</p>}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-black text-slate-200">R$ {d.valor.toFixed(2)}</span>
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditDespesa(d)}
                                      className="text-blue-400 hover:text-blue-300 p-1"
                                      title="Editar despesa"
                                    >
                                      <Edit3 size={14} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteDespesa(d.id)}
                                      className="text-red-500 hover:text-red-400 p-1"
                                      title="Excluir despesa"
                                    >
                                      <Trash2 size={14} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Row 2: Transaction Audits, Error Costs and NFC-e Generation */}
                  <div className="grid grid-cols-1 gap-6">
                    <Card className="bg-slate-900 border-slate-800 shadow">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-200 flex items-center gap-2">
                          <ShieldAlert className="text-brand-gold h-5 w-5" /> Auditoria de Pedidos, Custos com Erros & Emissão de Notas
                        </CardTitle>
                        <CardDescription>Gerencie custos extras de transações, refações de lentes, devoluções, e emita notas fiscais (NFC-e).</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                                <th className="py-3 px-2">Pedido ID</th>
                                <th className="py-3 px-2">Cliente / Data</th>
                                <th className="py-3 px-2">Total Pedido</th>
                                <th className="py-3 px-2">Juros/Taxa Transação</th>
                                <th className="py-3 px-2">Custos de Erros</th>
                                <th className="py-3 px-2 text-center">Nota Fiscal NFC-e</th>
                                <th className="py-3 px-2 text-right">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredSalesForMonth.length === 0 ? (
                                <tr>
                                  <td colSpan={7} className="py-6 text-center text-slate-500 italic">Nenhum pedido finalizado neste período.</td>
                                </tr>
                              ) : (
                                filteredSalesForMonth.slice().reverse().map(v => {
                                  const errRefaz = v.custoErroRefazerLente || 0;
                                  const errDevol = v.custoErroDevolucao || 0;
                                  const errDesc = v.custoErroDesconto || 0;
                                  const totalErros = errRefaz + errDevol + errDesc;
                                  const taxJuros = v.taxaCartaoJuros || 0;
                                  
                                  const isEditing = editingSaleErrorsId === v.id;

                                  return (
                                    <tr key={v.id} className="border-b border-slate-850 hover:bg-slate-950/40">
                                      <td className="py-4 px-2 font-mono font-bold text-slate-350">
                                        {v.id}
                                        {v.isDoacao && <span className="ml-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] px-1 py-0.5 rounded font-tagline uppercase font-bold">Doação</span>}
                                        {v.status === 'cancelado' && <span className="ml-2 bg-red-500/10 text-red-500 border border-red-500/30 text-[9px] px-1 py-0.5 rounded font-tagline uppercase font-bold">Cancelado</span>}
                                        {v.status === 'estornado' && <span className="ml-2 bg-amber-500/10 text-amber-500 border border-amber-500/30 text-[9px] px-1 py-0.5 rounded font-tagline uppercase font-bold">Estornado</span>}
                                      </td>
                                      <td className="py-4 px-2">
                                        <div className="font-bold text-white">{v.clienteNome}</div>
                                        <div className="text-[10px] text-slate-500">{v.dataVenda.split('-').reverse().join('/')}</div>
                                      </td>
                                      <td className="py-4 px-2 font-bold text-slate-200">
                                        R$ {(v.valorTotal || 0).toFixed(2)}
                                      </td>
                                      <td className="py-4 px-2">
                                        {isEditing ? (
                                          <div className="flex flex-col gap-1 w-20">
                                            <span className="text-[8px] text-slate-500 uppercase font-bold">Juros/Taxas</span>
                                            <input 
                                              type="number" 
                                              value={saleTaxaCartao} 
                                              onChange={(e) => setSaleTaxaCartao(Number(e.target.value))} 
                                              className="bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-white" 
                                            />
                                          </div>
                                        ) : (
                                          <span className="text-slate-300 font-medium">R$ {taxJuros.toFixed(2)}</span>
                                        )}
                                      </td>
                                      <td className="py-4 px-2">
                                        {isEditing ? (
                                          <div className="flex gap-2">
                                            <div className="flex flex-col gap-1 w-16">
                                              <span className="text-[8px] text-slate-500 uppercase font-bold">Lente</span>
                                              <input 
                                                type="number" 
                                                value={saleErrorLente} 
                                                onChange={(e) => setSaleErrorLente(Number(e.target.value))} 
                                                className="bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-white" 
                                              />
                                            </div>
                                            <div className="flex flex-col gap-1 w-16">
                                              <span className="text-[8px] text-slate-500 uppercase font-bold">Devolução</span>
                                              <input 
                                                type="number" 
                                                value={saleErrorDevolucao} 
                                                onChange={(e) => setSaleErrorDevolucao(Number(e.target.value))} 
                                                className="bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-white" 
                                              />
                                            </div>
                                            <div className="flex flex-col gap-1 w-16">
                                              <span className="text-[8px] text-slate-500 uppercase font-bold">Descontos</span>
                                              <input 
                                                type="number" 
                                                value={saleErrorDesconto} 
                                                onChange={(e) => setSaleErrorDesconto(Number(e.target.value))} 
                                                className="bg-slate-950 border border-slate-800 rounded p-1 text-[11px] text-white" 
                                              />
                                            </div>
                                          </div>
                                        ) : (
                                          <div>
                                            <div className="text-slate-350 font-bold">R$ {totalErros.toFixed(2)}</div>
                                            {totalErros > 0 && (
                                              <div className="text-[9px] text-slate-500">
                                                ({errRefaz > 0 && `Refazer: R$ ${errRefaz} `}
                                                {errDevol > 0 && `Devol: R$ ${errDevol} `}
                                                {errDesc > 0 && `Desconto: R$ ${errDesc}`})
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </td>
                                      <td className="py-4 px-2 text-center">
                                        {v.nfeStatus === 'emitida' ? (
                                          <div className="flex flex-col items-center gap-1">
                                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded font-tagline uppercase font-bold flex items-center gap-1">
                                              <CheckCircle size={10} /> NFC-e Autorizada
                                            </span>
                                            <button 
                                              type="button"
                                              onClick={() => setNfeInvoiceModalVenda(v)}
                                              className="text-[9px] font-bold text-brand-gold hover:underline"
                                            >
                                              Ver DANFE NFC-e
                                            </button>
                                          </div>
                                        ) : v.status === 'cancelado' || v.status === 'estornado' || v.isDoacao ? (
                                          <span className="text-slate-500 italic text-[10px]">Isento de NFC-e</span>
                                        ) : (
                                          <Button
                                            type="button"
                                            onClick={() => handleSimulateNfeEmit(v)}
                                            disabled={isEmittingNfe}
                                            variant="outline"
                                            className="border-blue-900/50 hover:bg-blue-950 hover:text-blue-400 text-blue-400 text-[10px] px-3 py-1.5 h-auto uppercase tracking-wider font-bold"
                                          >
                                            Emitir Nota Fiscal
                                          </Button>
                                        )}
                                      </td>
                                      <td className="py-4 px-2 text-right">
                                        {isEditing ? (
                                          <div className="flex gap-2 justify-end">
                                            <Button 
                                              type="button"
                                              onClick={() => handleSaveSaleErrors(v)} 
                                              className="bg-green-700 hover:bg-green-600 text-xs px-2.5 py-1.5 h-auto font-bold"
                                            >
                                              Salvar
                                            </Button>
                                            <Button 
                                              type="button"
                                              onClick={() => setEditingSaleErrorsId(null)} 
                                              variant="outline" 
                                              className="border-slate-800 text-slate-400 text-xs px-2.5 py-1.5 h-auto"
                                            >
                                              Voltar
                                            </Button>
                                          </div>
                                        ) : (
                                          <Button
                                            type="button"
                                            onClick={() => {
                                              setEditingSaleErrorsId(v.id);
                                              setSaleErrorLente(v.custoErroRefazerLente || 0);
                                              setSaleErrorDevolucao(v.custoErroDevolucao || 0);
                                              setSaleErrorDesconto(v.custoErroDesconto || 0);
                                              setSaleTaxaCartao(v.taxaCartaoJuros || 0);
                                            }}
                                            variant="outline"
                                            className="border-slate-800 text-slate-400 text-xs font-bold px-3 py-1.5 h-auto hover:bg-slate-850 hover:text-white"
                                          >
                                            <Edit3 size={11} className="mr-1" /> Auditar
                                          </Button>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Row 4: Controle de Parcelas & Alertas de Cobrança */}
                  <div className="grid grid-cols-1 gap-6">
                    <Card className="bg-slate-900 border-slate-800 shadow">
                      <CardHeader className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <CardTitle className="text-lg font-bold text-slate-200 flex items-center gap-2">
                            <AlertCircle className="text-brand-gold h-5 w-5" /> Controle de Parcelas & Cobrança (Boleto/Crediário)
                          </CardTitle>
                          <CardDescription>
                            Acompanhe os vencimentos de boletos/crediários, confirme recebimentos e envie lembretes de cobrança via WhatsApp.
                          </CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                                <th className="py-3 px-2">Pedido ID</th>
                                <th className="py-3 px-2">Cliente / Telefone</th>
                                <th className="py-3 px-2">Parcela</th>
                                <th className="py-3 px-2">Valor</th>
                                <th className="py-3 px-2">Vencimento</th>
                                <th className="py-3 px-2">Status</th>
                                <th className="py-3 px-2 text-right">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {installmentAlerts.length === 0 ? (
                                <tr>
                                  <td colSpan={7} className="py-6 text-center text-slate-500 italic">Nenhum parcelamento (Boleto/Crediário) cadastrado no sistema.</td>
                                </tr>
                              ) : (
                                installmentAlerts.map(inst => {
                                  const [year, month, day] = inst.dataVencimento.split('-');
                                  const formattedDueDate = `${day}/${month}/${year}`;
                                  
                                  const cleanPhone = inst.clienteTelefone.replace(/\D/g, '');
                                  const formattedPhone = cleanPhone.startsWith('55') ? cleanPhone : `55${cleanPhone}`;
                                  
                                  const messageText = inst.isAtrasada
                                    ? `Olá ${inst.clienteNome}, tudo bem? Identificamos que a parcela ${inst.parcelaLabel} no valor de R$ ${inst.valor.toFixed(2)}, com vencimento em ${formattedDueDate}, referente à sua Ordem de Serviço #${inst.saleId}, está pendente. Poderia por gentileza nos enviar o comprovante de pagamento? Obrigado!`
                                    : `Olá ${inst.clienteNome}, tudo bem? Lembramos que a parcela ${inst.parcelaLabel} no valor de R$ ${inst.valor.toFixed(2)}, referente à sua Ordem de Serviço #${inst.saleId}, vencerá em ${formattedDueDate}. Qualquer dúvida estamos à disposição!`;
                                  
                                  const encodedMessage = encodeURIComponent(messageText);
                                  const waUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;

                                  return (
                                    <tr key={inst.id} className="border-b border-slate-850 hover:bg-slate-950/40">
                                      <td className="py-4 px-2 font-mono font-bold text-slate-350">
                                        {inst.saleId}
                                      </td>
                                      <td className="py-4 px-2">
                                        <div className="font-bold text-white">{inst.clienteNome}</div>
                                        <div className="text-[10px] text-slate-500">{inst.clienteTelefone || 'Sem telefone'}</div>
                                      </td>
                                      <td className="py-4 px-2 font-bold text-slate-400">
                                        {inst.parcelaLabel}
                                      </td>
                                      <td className="py-4 px-2 font-black text-slate-200">
                                        R$ {inst.valor.toFixed(2)}
                                      </td>
                                      <td className="py-4 px-2 font-medium text-slate-300">
                                        {formattedDueDate}
                                      </td>
                                      <td className="py-4 px-2">
                                        {inst.isPaga ? (
                                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[9px] px-2 py-0.5 rounded font-tagline uppercase font-bold flex items-center gap-1 w-fit">
                                            <CheckCircle size={10} /> Pago
                                          </span>
                                        ) : inst.isAtrasada ? (
                                          <span className="bg-red-500/10 text-red-500 border border-red-500/30 text-[9px] px-2 py-0.5 rounded font-tagline uppercase font-bold flex items-center gap-1 w-fit animate-pulse">
                                            <AlertTriangle size={10} /> Atrasado
                                          </span>
                                        ) : (
                                          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/30 text-[9px] px-2 py-0.5 rounded font-tagline uppercase font-bold flex items-center gap-1 w-fit">
                                            <Clock size={10} /> No Prazo
                                          </span>
                                        )}
                                      </td>
                                      <td className="py-4 px-2 text-right">
                                        <div className="flex gap-2 justify-end">
                                          {!inst.isPaga && (
                                            <>
                                              <Button
                                                type="button"
                                                onClick={() => handleMarkInstallmentAsPaid(inst.vendaOriginal, inst.index)}
                                                className="bg-emerald-700 hover:bg-emerald-600 text-xs px-2.5 py-1.5 h-auto font-bold flex items-center gap-1"
                                                title="Confirmar Recebimento"
                                              >
                                                <CheckCircle size={10} /> Confirmar Pago
                                              </Button>
                                              <a
                                                href={waUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center justify-center bg-slate-950 border border-slate-800 text-brand-gold hover:bg-slate-850 hover:text-white rounded-lg text-xs font-bold px-3 py-1.5 h-auto transition-colors gap-1"
                                                title="Cobrar via WhatsApp"
                                              >
                                                <Send size={10} /> Cobrar
                                              </a>
                                            </>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Row 3: Eyewear Donations trace panel */}
                  <div className="grid grid-cols-1 gap-6">
                    <Card className="bg-slate-900 border-slate-800 shadow">
                      <CardHeader>
                        <CardTitle className="text-lg font-bold text-slate-200 flex items-center gap-2">
                          <Heart className="text-brand-gold h-5 w-5" /> Controle de Doações de Óculos
                        </CardTitle>
                        <CardDescription>Relação de óculos cortesia ou doações de lentes/armações vinculadas a ações sociais ou campanhas.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-widest text-[9px] font-bold">
                                <th className="py-3 px-2">O.S. doação</th>
                                <th className="py-3 px-2">Nome do Cliente</th>
                                <th className="py-3 px-2">CPF do Beneficiário</th>
                                <th className="py-3 px-2">Campanha / Evento de Origem</th>
                                <th className="py-3 px-2">Armação / Modelo Lente</th>
                                <th className="py-3 px-2">Valor Estimado original</th>
                                <th className="py-3 px-2">Custo para a Óptica</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredSalesForMonth.filter(v => v.isDoacao).length === 0 ? (
                                <tr>
                                  <td colSpan={7} className="py-6 text-center text-slate-500 italic">Nenhuma doação cadastrada neste período.</td>
                                </tr>
                              ) : (
                                filteredSalesForMonth.filter(v => v.isDoacao).slice().reverse().map(v => {
                                  const evt = eventos.find(e => e.id === v.eventoId);
                                  const frame = v.produtos?.find(p => p.id === 'arm-id')?.nome || 'Armação Padrão';
                                  const lens = v.produtos?.find(p => p.id === 'lens-id' || p.id === 'lens')?.nome || 'Lente Corretiva';
                                  const custo = v.custoTotal || 0;
                                  const originalRetail = custo / 0.3;
                                  return (
                                    <tr key={v.id} className="border-b border-slate-850 hover:bg-slate-950/40">
                                      <td className="py-4 px-2 font-mono font-bold text-brand-gold">{v.id}</td>
                                      <td className="py-4 px-2 font-bold text-white">{v.clienteNome}</td>
                                      <td className="py-4 px-2 font-mono text-slate-450">{v.clienteCpf || 'N/A'}</td>
                                      <td className="py-4 px-2 font-bold text-slate-300">
                                        {evt ? (
                                          <span className="px-2 py-0.5 bg-slate-950 border border-slate-850 text-[10px] uppercase font-bold text-brand-gold rounded-full">
                                            {evt.nome}
                                          </span>
                                        ) : (
                                          <span className="text-slate-500 italic">Loja Física / Não Vinculado</span>
                                        )}
                                      </td>
                                      <td className="py-4 px-2">
                                        <div className="text-slate-200 font-medium">{frame}</div>
                                        <div className="text-[10px] text-slate-500">{lens}</div>
                                      </td>
                                      <td className="py-4 px-2 text-slate-450 italic">R$ {originalRetail.toFixed(2)}</td>
                                      <td className="py-4 px-2 font-bold text-slate-200">R$ {custo.toFixed(2)}</td>
                                    </tr>
                                  );
                                })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              )}
            </div>
          );
        })()}

        {/* DANFE NFC-e Modal Simulation */}
        {nfeInvoiceModalVenda && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-xl bg-white text-slate-950 shadow-2xl p-6 border border-slate-350 text-[11px] font-mono leading-tight space-y-4">
              <div className="text-center border-b border-slate-400 pb-2">
                <h3 className="font-bold text-sm uppercase">Timevision Óptica Ltda</h3>
                <p>CNPJ: 12.345.678/0001-99 - IE: 87.654.321</p>
                <p>Av. das Américas, 4200 - Barra da Tijuca, RJ</p>
                <p className="font-bold border-t border-dashed border-slate-400 mt-2 pt-1 text-[12px]">
                  DANFE NFC-e - Documento Auxiliar da Nota Fiscal de Consumidor Eletrônica
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold border-b border-dashed border-slate-400 pb-1 text-slate-700">
                  <span>ITEM / DESCRIÇÃO</span>
                  <span>QTD x VL UNIT</span>
                  <span>VL TOTAL</span>
                </div>
                {nfeInvoiceModalVenda.produtos?.map((prod, idx) => (
                  <div key={idx} className="flex justify-between text-slate-800">
                    <span>{String(idx + 1).padStart(3, '0')} {prod.nome.toUpperCase()}</span>
                    <span>1 un x R$ {prod.precoVenda.toFixed(2)}</span>
                    <span>R$ {prod.precoVenda.toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-slate-400 pt-2 space-y-1">
                <div className="flex justify-between font-bold">
                  <span>QTD. TOTAL DE ITENS</span>
                  <span>{nfeInvoiceModalVenda.produtos?.length || 0}</span>
                </div>
                <div className="flex justify-between font-bold text-sm">
                  <span>VALOR TOTAL R$</span>
                  <span>R$ {(nfeInvoiceModalVenda.valorTotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>FORMA DE PAGAMENTO</span>
                  <span>{nfeInvoiceModalVenda.pagamento?.metodo?.toUpperCase() || 'CARTÃO'}</span>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-400 pt-2 text-center space-y-2">
                <div>
                  <p className="font-bold">ÁREA DO CONSUMIDOR</p>
                  <p>Consumidor: {nfeInvoiceModalVenda.clienteNome.toUpperCase()}</p>
                  <p>CPF: {nfeInvoiceModalVenda.clienteCpf}</p>
                </div>

                <div className="border-t border-dashed border-slate-400 pt-2 text-[10px] space-y-1 text-slate-700">
                  <p className="font-bold">NFC-e nº {nfeInvoiceModalVenda.id} - Série 001</p>
                  <p>Data de Emissão: {new Date(nfeInvoiceModalVenda.dataVenda).toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR')}</p>
                  <p>Protocolo de Autorização: 1332600049928374</p>
                  <p className="font-bold mt-2">CHAVE DE ACESSO</p>
                  <p className="tracking-widest font-sans font-bold select-all bg-slate-100 p-1 text-[9px] text-slate-800 border border-slate-200 rounded">
                    {nfeInvoiceModalVenda.nfeChave || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="border-t border-dashed border-slate-400 pt-4 flex flex-col items-center">
                <div className="w-5/6 h-8 bg-slate-900 flex items-center justify-center text-white text-[8px] tracking-[6px] font-sans font-bold">
                  ||||| | |||| ||| || |||||| | |||| ||||
                </div>
                <span className="text-[8px] text-slate-500 mt-1">Consulta via leitor de QR Code ou portal da SEFAZ</span>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-300">
                <Button 
                  type="button"
                  onClick={() => setNfeInvoiceModalVenda(null)} 
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider px-6"
                >
                  Fechar DANFE
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Help Guidelines Modal for Fiscal Integration */}
        {isFiscalHelpOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl p-6 overflow-y-auto max-h-[85vh] space-y-4">
              <CardHeader className="p-0 border-b border-slate-800 pb-3 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-bold text-slate-200 flex items-center gap-2">
                    <HelpCircle className="text-brand-gold h-5 w-5" /> Guia de Configuração da NFC-e (SEFAZ)
                  </CardTitle>
                  <CardDescription className="text-slate-450">Passo a passo técnico para credenciar o e-CNPJ e emitir notas.</CardDescription>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFiscalHelpOpen(false)}
                  className="text-slate-400 hover:text-white font-bold text-lg"
                >
                  ✕
                </button>
              </CardHeader>
              <CardContent className="p-0 text-slate-300 text-sm space-y-4 leading-relaxed pt-2">
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 space-y-2">
                  <h4 className="font-bold text-brand-gold text-xs uppercase tracking-wider">1. O que é necessário para ativação?</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-350">
                    <li><strong>Certificado Digital A1 (e-CNPJ)</strong>: Arquivo no formato <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200 font-mono text-[11px]">.pfx</code> ou <code className="bg-slate-900 px-1 py-0.5 rounded text-slate-200 font-mono text-[11px]">.p12</code> contendo a chave privada da empresa.</li>
                    <li><strong>Inscrição Estadual (IE)</strong>: Registro ativo junto à Receita Estadual.</li>
                    <li><strong>Código de Segurança do Contribuinte (CSC)</strong>: Um identificador ID e o token cadastrados na SEFAZ do seu estado.</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">2. Como configurar este painel:</h4>
                  <ol className="list-decimal list-inside space-y-2 text-xs text-slate-350">
                    <li>Preencha o <strong>CNPJ</strong>, <strong>Inscrição Estadual</strong> e <strong>Razão Social</strong> conforme cadastrados.</li>
                    <li>Preencha o <strong>ID do CSC</strong> (ex: <code className="font-mono">000001</code>) e a chave correspondente.</li>
                    <li>Faça o upload do seu arquivo de <strong>Certificado Digital A1</strong> e digite a respectiva senha do e-CNPJ.</li>
                    <li>Mantenha em <strong>Ambiente de Homologação</strong> para efetuar os testes iniciais e validar as emissões sem gerar cobranças ou registros legais reais.</li>
                    <li>Quando tudo estiver validado, mude o ambiente para <strong>Produção</strong> para emitir notas fiscais oficiais para seus clientes.</li>
                  </ol>
                </div>

                <div className="bg-blue-500/5 border border-blue-900/40 p-3.5 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-blue-400 block">💡 Nota de Integração</span>
                  <p className="text-slate-400">As configurações e o arquivo do certificado A1 são transmitidos e processados diretamente pela nossa API local, sem intermediários. Toda a documentação e instruções também estão salvas na raiz deste repositório no arquivo <code className="bg-slate-950 px-1 py-0.5 rounded text-slate-300 font-mono">NFE_INSTRUCTIONS.md</code>.</p>
                </div>
              </CardContent>

              <div className="flex justify-end pt-4 border-t border-slate-800">
                <Button 
                  type="button"
                  onClick={() => setIsFiscalHelpOpen(false)} 
                  className="bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider px-6"
                >
                  Entendi
                </Button>
              </div>
            </Card>
          </div>
        )}

      </main>
    </div>
  );
}
