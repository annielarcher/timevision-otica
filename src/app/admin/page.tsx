'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, Package, ShoppingCart, Sparkles, LogOut, Lock, 
  Search, Plus, Trash2, Edit3, CheckCircle, Clock, Eye, AlertTriangle, Calendar, FlaskConical, Ban
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  getItems, saveItem, deleteItem, updateItemStatus,
  Cliente, Produto, Venda, ReceitaVisual, auth, Evento, MembroEquipe, Laboratorio
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
  const [activeTab, setActiveTab] = useState<'dash' | 'pdv' | 'clientes' | 'estoque' | 'eventos' | 'mkt' | 'laboratorios'>('dash');
  const [marketingMode, setMarketingMode] = useState<'flyer' | 'banner'>('flyer');

  // Database states
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [equipe, setEquipe] = useState<MembroEquipe[]>([]);
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([]);

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
  const [pdvEventoId, setPdvEventoId] = useState('');
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
      const [cList, pList, vList, eList, lList, eqList, labList] = await Promise.all([
        getItems<Cliente>('clientes'),
        getItems<Produto>('produtos'),
        getItems<Venda>('vendas'),
        getItems<Evento>('eventos'),
        getItems<any>('inscricoes'),
        getItems<MembroEquipe>('equipe'),
        getItems<Laboratorio>('laboratorios')
      ]);
      setClientes(cList);
      setProdutos(pList);
      setVendas(vList);
      setEventos(eList);
      setLeads(lList);
      setEquipe(eqList);
      setLaboratorios(labList);
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailLower = loginEmail.toLowerCase().trim();

    if (loginStep === 'email') {
      // 1. Master Bypass local check
      const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      if (isLocalhost && emailLower === 'admin@timevision.com.br') {
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

    // 4. Master Bypass login for localhost
    const isLocalhost = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    if (isLocalhost && emailLower === 'admin@timevision.com.br' && loginPassword === 'timevision123') {
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
      cadastradoPor: editingCliente?.cadastradoPor || currentUser?.email || 'admin@timevision.com.br'
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
      criadoPor: editingEvento?.criadoPor || currentUser?.email || 'admin@timevision.com.br'
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

  // 7. POS Sale & OS/Budget Generation Trigger
  const handlePdvSale = (e: React.FormEvent, type: 'venda' | 'orcamento') => {
    e.preventDefault();
    if (!pdvClienteId || (!pdvFrameId && !pdvLensId)) {
      toast({
        variant: 'destructive',
        title: 'Dados Incompletos',
        description: 'Selecione um cliente e pelo menos um produto (armação ou lente).',
      });
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
      status: type === 'venda' ? 'recebido' : 'orcamento',
      dataVenda: orderDate,
      validadeOrcamento: type === 'orcamento' ? new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0] : undefined,
      vendedorId: currentUser?.email || 'admin@timevision.com.br',
      vendedorNome: currentUser?.nome || 'Consultor Óptico',
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
      if (selectedEventoId === 'loja' && v.eventoId) return false;
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
            { id: 'laboratorios', Icon: FlaskConical, label: "Laboratórios" }
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
              <h2 className="text-2xl font-headline font-bold">Visão Geral & Finanças</h2>
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
                      if (selectedEventoId === 'loja' && v.eventoId) return false;
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
                            
                            {v.eventoId && (
                              <span className="absolute bottom-2 right-2 text-[8px] uppercase tracking-wider bg-primary/10 text-primary border border-primary/30 px-1.5 py-0.5 rounded font-bold">
                                Ev: {eventos.find(ev => ev.id === v.eventoId)?.nome || 'Promocional'}
                              </span>
                            )}
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
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Vincular a Evento</label>
                      <select
                        value={pdvEventoId}
                        onChange={(e) => setPdvEventoId(e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-white focus:outline-none"
                      >
                        <option value="">Nenhum evento...</option>
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

      </main>
    </div>
  );
}
