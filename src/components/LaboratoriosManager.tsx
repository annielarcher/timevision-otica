import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, FileUp, Settings, Search } from 'lucide-react';
import { getItems, saveItem, deleteItem, Laboratorio, LenteLaboratorio } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function LaboratoriosManager() {
  const { toast } = useToast();
  const [laboratorios, setLaboratorios] = useState<Laboratorio[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLab, setEditingLab] = useState<Laboratorio | null>(null);
  const [searchLab, setSearchLab] = useState('');

  useEffect(() => {
    loadLaboratorios();
  }, []);

  const loadLaboratorios = async () => {
    setLoading(true);
    const data = await getItems<Laboratorio>('laboratorios');
    setLaboratorios(data || []);
    setLoading(false);
  };

  const handleSaveLab = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);

    const labData: Laboratorio = {
      id: editingLab?.id || `lab-${Date.now()}`,
      nome: formData.get('nome') as string,
      telefone: formData.get('telefone') as string,
      endereco: formData.get('endereco') as string,
      representante: formData.get('representante') as string,
      lentes: editingLab?.lentes || [],
      criadoEm: editingLab?.criadoEm || new Date().toISOString(),
    };

    try {
      await saveItem('laboratorios', labData);
      toast({ title: 'Sucesso', description: 'Laboratório salvo!' });
      setIsModalOpen(false);
      setEditingLab(null);
      loadLaboratorios();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao salvar.' });
    }
  };

  const handleDeleteLab = async (id: string) => {
    if (!confirm('Deseja realmente remover este laboratório?')) return;
    try {
      await deleteItem('laboratorios', id);
      toast({ title: 'Removido', description: 'Laboratório removido com sucesso.' });
      loadLaboratorios();
    } catch (err) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Falha ao remover.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, labId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim().length > 0);
      
      const novasLentes: LenteLaboratorio[] = [];
      // Assumes CSV format: Nome,ValorBase
      // Header might be present, so skip if first row is not a number
      for (let i = 0; i < lines.length; i++) {
        const columns = lines[i].split(',').map(c => c.trim().replace(/"/g, ''));
        if (columns.length >= 2) {
          const nome = columns[0];
          const valorBase = parseFloat(columns[1].replace(',', '.'));
          if (!isNaN(valorBase)) {
            novasLentes.push({
              id: `lente-${Date.now()}-${i}`,
              nome,
              valorBase,
              multiplicadorCusto: 1,
              multiplicadorVenda: 2, // Default
              precoCusto: valorBase * 1,
              precoVenda: valorBase * 2
            });
          }
        }
      }

      if (novasLentes.length > 0) {
        const lab = laboratorios.find(l => l.id === labId);
        if (lab) {
          const updatedLab = { ...lab, lentes: [...lab.lentes, ...novasLentes] };
          await saveItem('laboratorios', updatedLab);
          toast({ title: 'Lentes Importadas', description: `${novasLentes.length} lentes adicionadas.` });
          loadLaboratorios();
        }
      } else {
        toast({ variant: 'destructive', title: 'Planilha Inválida', description: 'Formato esperado: Nome,ValorBase' });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const updateLenteMultiplier = async (labId: string, lenteId: string, tipo: 'custo' | 'venda', valor: number) => {
    const lab = laboratorios.find(l => l.id === labId);
    if (!lab) return;

    const updatedLentes = lab.lentes.map(lente => {
      if (lente.id === lenteId) {
        const multCusto = tipo === 'custo' ? valor : lente.multiplicadorCusto;
        const multVenda = tipo === 'venda' ? valor : lente.multiplicadorVenda;
        return {
          ...lente,
          multiplicadorCusto: multCusto,
          multiplicadorVenda: multVenda,
          precoCusto: lente.valorBase * multCusto,
          precoVenda: lente.valorBase * multVenda
        };
      }
      return lente;
    });

    const updatedLab = { ...lab, lentes: updatedLentes };
    
    // Optimistic UI update
    setLaboratorios(prev => prev.map(l => l.id === labId ? updatedLab : l));
    await saveItem('laboratorios', updatedLab);
  };

  if (loading) return <div className="text-white p-4">Carregando laboratórios...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Gestão de Laboratórios</h2>
          <p className="text-slate-400 text-sm">Gerencie seus laboratórios de lentes, importe catálogos via planilha (CSV: Nome, Valor) e aplique multiplicadores.</p>
        </div>
        <Button onClick={() => { setEditingLab(null); setIsModalOpen(true); }} className="bg-primary hover:bg-primary/90 text-black font-bold">
          <Plus className="mr-2 h-4 w-4" />
          Novo Laboratório
        </Button>
      </div>

      <div className="bg-slate-900 border-slate-800 p-4 rounded-xl shadow border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
          <input
            type="text"
            value={searchLab}
            onChange={(e) => setSearchLab(e.target.value)}
            placeholder="Pesquisar laboratório ou lente..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {laboratorios.map(originalLab => {
          // If searching, filter labs and their lenses
          if (searchLab) {
            const matchesLab = originalLab.nome.toLowerCase().includes(searchLab.toLowerCase());
            const filteredLentes = originalLab.lentes?.filter(l => l.nome.toLowerCase().includes(searchLab.toLowerCase())) || [];
            
            if (!matchesLab && filteredLentes.length === 0) return null;
            
            var lab = {
              ...originalLab,
              lentes: matchesLab ? originalLab.lentes : filteredLentes
            };
          } else {
            var lab = originalLab;
          }
          
          return (
          <Card key={lab.id} className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row justify-between items-start">
              <div>
                <CardTitle className="text-white text-xl">{lab.nome}</CardTitle>
                <CardDescription>
                  Contato: {lab.telefone || 'N/A'} | Rep: {lab.representante || 'N/A'} | Endereço: {lab.endereco || 'N/A'}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setEditingLab(lab); setIsModalOpen(true); }}>
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteLab(lab.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-sm font-bold text-slate-300">Catálogo de Lentes ({lab.lentes?.length || 0})</h4>
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => handleFileUpload(e, lab.id)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    title="Importar CSV (Nome, Valor)"
                  />
                  <Button variant="outline" size="sm" className="pointer-events-none">
                    <FileUp className="mr-2 h-4 w-4" />
                    Importar Planilha (CSV)
                  </Button>
                </div>
              </div>

              {lab.lentes?.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border border-slate-800">
                  <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs uppercase bg-slate-950 border-b border-slate-800">
                      <tr>
                        <th className="px-4 py-3">Lente</th>
                        <th className="px-4 py-3">Valor Base</th>
                        <th className="px-4 py-3">Mult. Custo</th>
                        <th className="px-4 py-3">Custo Fixo</th>
                        <th className="px-4 py-3">Mult. Venda</th>
                        <th className="px-4 py-3 text-white font-bold">Preço de Venda</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lab.lentes.map((lente) => (
                        <tr key={lente.id} className="border-b border-slate-800 bg-slate-900/50">
                          <td className="px-4 py-3 font-medium text-white">{lente.nome}</td>
                          <td className="px-4 py-3">R$ {lente.valorBase.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <select 
                              value={lente.multiplicadorCusto}
                              onChange={(e) => updateLenteMultiplier(lab.id, lente.id, 'custo', Number(e.target.value))}
                              className="bg-slate-950 border border-slate-800 rounded p-1"
                            >
                              {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(v => <option key={v} value={v}>{v}x</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3">R$ {lente.precoCusto.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <select 
                              value={lente.multiplicadorVenda}
                              onChange={(e) => updateLenteMultiplier(lab.id, lente.id, 'venda', Number(e.target.value))}
                              className="bg-slate-950 border border-slate-800 rounded p-1"
                            >
                              {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(v => <option key={v} value={v}>{v}x</option>)}
                            </select>
                          </td>
                          <td className="px-4 py-3 text-green-400 font-bold">R$ {lente.precoVenda.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-6 border border-dashed border-slate-800 rounded-lg text-slate-500 text-sm">
                  Nenhuma lente cadastrada neste laboratório. Importe um arquivo .csv com as colunas (Nome da Lente, Valor Base).
                </div>
              )}
            </CardContent>
          </Card>
        )})}

        {laboratorios.length === 0 && (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-lg text-slate-500">
            Nenhum laboratório cadastrado.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-slate-900 border-slate-800 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-bold">{editingLab ? 'Editar Laboratório' : 'Novo Laboratório'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveLab} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Nome do Laboratório</label>
                  <input
                    type="text"
                    name="nome"
                    defaultValue={editingLab?.nome || ''}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Telefone</label>
                  <input
                    type="text"
                    name="telefone"
                    defaultValue={editingLab?.telefone || ''}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    defaultValue={editingLab?.endereco || ''}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Nome do Representante</label>
                  <input
                    type="text"
                    name="representante"
                    defaultValue={editingLab?.representante || ''}
                    className="bg-slate-950 border border-slate-800 rounded-lg p-2 text-sm text-white"
                  />
                </div>
                <div className="flex gap-3 pt-4 border-t border-slate-800">
                  <Button type="submit" className="flex-1 bg-primary text-primary-foreground font-bold">Salvar</Button>
                  <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
