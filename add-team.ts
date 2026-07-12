import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDkXjqISwNaIANExEzqMl-Tc_FqSv4Wq3I",
  authDomain: "timevision-otica.firebaseapp.com",
  projectId: "timevision-otica",
  storageBucket: "timevision-otica.firebasestorage.app",
  messagingSenderId: "871786325276",
  appId: "1:871786325276:web:bfac0a258aa9af67cb06d9"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function addTeam() {
  const ana = {
    email: 'ana@timevision.com.br',
    nome: 'Ana',
    primeiroAcessoDone: false,
    criadoEm: new Date().toISOString()
  };

  const alef = {
    email: 'alef@timevision.com.br',
    nome: 'Alef',
    primeiroAcessoDone: false,
    criadoEm: new Date().toISOString()
  };

  console.log("Adicionando Ana...");
  await setDoc(doc(db, 'equipe', 'ana@timevision.com.br'), ana);
  console.log("Ana adicionada com sucesso!");

  console.log("Adicionando Alef...");
  await setDoc(doc(db, 'equipe', 'alef@timevision.com.br'), alef);
  console.log("Alef adicionado com sucesso!");
}

addTeam().catch(console.error);
