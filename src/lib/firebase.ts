import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut as fbSignOut, User } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase env vars are available
const isFirebaseConfigured = !!(
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
  process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
);

let app;
let auth: any = null;
let db: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Failed to initialize Firebase:', error);
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn(
      'Firebase environment variables are missing. Falling back to LocalStorage for data management.'
    );
  }
}

export { auth, db };

// Interfaces for our POS/Admin system
export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  telefone: string;
  cep: string;
  endereco: string;
  dataNascimento: string;
  criadoEm: string;
  cadastradoPor?: string; // Tracks team member email
}

export interface Produto {
  id: string;
  nome: string; // ex: Ray-Ban Aviator
  categoria: 'armação' | 'lente' | 'acessório' | 'outro';
  quantidade: number;
  precoCusto: number;
  precoVenda: number;
  criadoPor?: string; // Tracks team member email
}

export interface ReceitaVisual {
  dataReceita?: string; // Obrigatório nas novas
  
  // LONGE
  longeEsfericoOD?: string;
  longeEsfericoOE?: string;
  longeCilindricoOD?: string;
  longeCilindricoOE?: string;
  longeEixoOD?: string;
  longeEixoOE?: string;
  longeDnpOD?: string;
  longeDnpOE?: string;
  longeAlturaOD?: string;
  longeAlturaOE?: string;

  // PERTO
  pertoEsfericoOD?: string;
  pertoEsfericoOE?: string;
  pertoCilindricoOD?: string;
  pertoCilindricoOE?: string;
  pertoEixoOD?: string;
  pertoEixoOE?: string;
  pertoDnpOD?: string;
  pertoDnpOE?: string;
  pertoAlturaOD?: string;
  pertoAlturaOE?: string;

  adicao?: string;
  codigoLente?: string;

  // LEGACY
  esfericoOD?: string;
  esfericoOE?: string;
  cilindricoOD?: string;
  cilindricoOE?: string;
  eixoOD?: string;
  eixoOE?: string;
  dnpOD?: string;
  dnpOE?: string;
  alturaOD?: string;
  alturaOE?: string;
}

export interface Venda {
  id: string; // ex: TV-1001
  clienteId: string;
  clienteNome: string;
  clienteCpf: string;
  clienteEmail: string;
  clienteEndereco: string;
  clienteTelefone: string;
  produtos: {
    id: string;
    nome: string;
    quantidade: number;
    precoVenda: number;
    precoCusto: number;
  }[];
  valorTotal: number;
  custoTotal: number;
  lucroTotal: number;
  receita?: ReceitaVisual;
  status: 'recebido' | 'laboratorio' | 'montagem' | 'pronto' | 'entregue' | 'orcamento' | 'cancelado';
  dataVenda: string;
  dataEntrega?: string;
  pagamento?: {
    metodo: string;
    parcelas: string;
    sinal: number;
    pagamentoNaEntrega?: boolean;
  };
  validadeOrcamento?: string;
  vendedorId?: string; // Tracks team member email
  vendedorNome?: string; // Tracks team member name
  eventoId?: string; // Linked promotional event ID
  laboratorioId?: string;
  laboratorioNome?: string;
}

export interface LenteLaboratorio {
  id: string;
  nome: string;
  valorBase: number;
  multiplicadorCusto: number;
  multiplicadorVenda: number;
  precoCusto: number;
  precoVenda: number;
}

export interface Laboratorio {
  id: string;
  nome: string;
  telefone?: string;
  endereco?: string;
  representante?: string;
  lentes: LenteLaboratorio[];
  criadoEm: string;
}

export interface Evento {
  id: string;
  nome: string;
  data: string;
  local: string;
  status: 'ativo' | 'arquivado';
  criadoEm: string;
  criadoPor?: string; // Team member email
}

export interface MembroEquipe {
  email: string;
  nome: string;
  emailRecuperacao?: string;
  primeiroAcessoDone: boolean;
  criadoEm: string;
}

// Helper generic database actions with localStorage fallback
export async function getItems<T>(collectionName: string): Promise<T[]> {
  // Always allow fetching 'equipe' without auth so the login screen can check first access status
  if (isFirebaseConfigured && db && (auth?.currentUser || collectionName === 'equipe')) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const items: any[] = [];
      querySnapshot.forEach((docSnap) => {
        items.push({ id: docSnap.id, ...docSnap.data() });
      });
      return items as T[];
    } catch (e) {
      console.error(`Firebase error listing ${collectionName}, falling back to localStorage:`, e);
    }
  }
  
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem(`tv_${collectionName}`);
    return local ? JSON.parse(local) : [];
  }
  return [];
}

export async function saveItem<T extends { id?: string; email?: string }>(collectionName: string, item: T): Promise<void> {
  const documentId = item.id || item.email;
  if (!documentId) throw new Error('Item must have an id or email to be saved');
  
  if (isFirebaseConfigured && db && auth?.currentUser) {
    try {
      await setDoc(doc(db, collectionName, documentId), item);
      return;
    } catch (e) {
      console.error(`Firebase error saving ${collectionName}/${documentId}, falling back to localStorage:`, e);
    }
  }

  if (typeof window !== 'undefined') {
    const items = await getItems<T>(collectionName);
    const index = items.findIndex((i) => (i.id || i.email) === documentId);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    localStorage.setItem(`tv_${collectionName}`, JSON.stringify(items));
  }
}

export async function deleteItem(collectionName: string, id: string): Promise<void> {
  if (isFirebaseConfigured && db && auth?.currentUser) {
    try {
      await deleteDoc(doc(db, collectionName, id));
      return;
    } catch (e) {
      console.error(`Firebase error deleting ${collectionName}/${id}, falling back to localStorage:`, e);
    }
  }

  if (typeof window !== 'undefined') {
    const items = await getItems<{ id?: string; email?: string }>(collectionName);
    const filtered = items.filter((i) => (i.id || i.email) !== id);
    localStorage.setItem(`tv_${collectionName}`, JSON.stringify(filtered));
  }
}

export async function updateItemStatus(collectionName: string, id: string, status: string): Promise<void> {
  if (isFirebaseConfigured && db && auth?.currentUser) {
    try {
      await updateDoc(doc(db, collectionName, id), { status });
      return;
    } catch (e) {
      console.error(`Firebase error updating status ${collectionName}/${id}, falling back to localStorage:`, e);
    }
  }

  if (typeof window !== 'undefined') {
    const items = await getItems<{ id?: string; email?: string; status?: string }>(collectionName);
    const index = items.findIndex((i) => (i.id || i.email) === id);
    if (index >= 0) {
      items[index].status = status;
      localStorage.setItem(`tv_${collectionName}`, JSON.stringify(items));
    }
  }
}

export async function getItemById<T extends { id?: string; email?: string }>(collectionName: string, id: string): Promise<T | null> {
  if (isFirebaseConfigured && db && auth?.currentUser) {
    try {
      const docSnap = await getDoc(doc(db, collectionName, id));
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { id: docSnap.id, ...data } as T;
      }
      return null;
    } catch (e) {
      console.error(`Firebase error getting ${collectionName}/${id}, falling back to localStorage:`, e);
    }
  }

  if (typeof window !== 'undefined') {
    const items = await getItems<T>(collectionName);
    const found = items.find((i) => (i.id || i.email) === id);
    return found || null;
  }
  return null;
}

export async function saveLead(lead: { nome: string; whatsapp: string; email: string; exame: string; criadoEm: string; eventoId?: string }): Promise<void> {
  if (isFirebaseConfigured && db) {
    try {
      await setDoc(doc(db, 'inscricoes', `lead-${Date.now()}`), lead);
      return;
    } catch (e) {
      console.error('Firebase error saving lead, falling back to localStorage:', e);
    }
  }
  
  if (typeof window !== 'undefined') {
    const local = localStorage.getItem('tv_inscricoes');
    const items = local ? JSON.parse(local) : [];
    items.push({ id: `lead-${Date.now()}`, ...lead });
    localStorage.setItem('tv_inscricoes', JSON.stringify(items));
  }
}
