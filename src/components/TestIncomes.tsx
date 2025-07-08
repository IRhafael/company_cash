import React, { useEffect, useState } from 'react';
import { incomeAPI, incomeSourceAPI } from '@/services/api';

export const TestIncomes: React.FC = () => {
  const [incomes, setIncomes] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Carregando dados...');
        
        // Testar fontes de receita
        const sourcesData = await incomeSourceAPI.getAll();
        console.log('📊 Fontes carregadas:', sourcesData);
        setSources(sourcesData);
        
        // Testar receitas
        const incomesData = await incomeAPI.getAll();
        console.log('💰 Receitas carregadas:', incomesData);
        setIncomes(incomesData);
        
      } catch (err) {
        console.error('❌ Erro ao carregar dados:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="p-4">🔄 Carregando...</div>;
  if (error) return <div className="p-4 text-red-600">❌ Erro: {error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🧪 Teste de Dados</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">📊 Fontes de Receita ({sources.length})</h3>
          <div className="space-y-2">
            {sources.map((source: any) => (
              <div key={source.id} className="p-3 bg-gray-100 rounded">
                <div className="font-medium">{source.name}</div>
                <div className="text-sm text-gray-600">
                  Tipo: {source.type} | Cor: {source.color}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">💰 Receitas ({incomes.length})</h3>
          <div className="space-y-2">
            {incomes.map((income: any) => (
              <div key={income.id} className="p-3 bg-green-50 rounded">
                <div className="font-medium">{income.description}</div>
                <div className="text-sm text-gray-600">
                  R$ {Number(income.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | {income.date}
                </div>
                <div className="text-xs text-gray-500">
                  Fonte: {income.source_name} | Cliente: {income.client_name || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
