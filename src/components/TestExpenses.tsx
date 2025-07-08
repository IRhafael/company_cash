import React, { useEffect, useState } from 'react';
import { expenseAPI, expenseCategoryAPI } from '@/services/api';

export const TestExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Carregando dados de despesas...');
        
        // Testar categorias de despesas
        const categoriesData = await expenseCategoryAPI.getAll();
        console.log('📊 Categorias carregadas:', categoriesData);
        setCategories(categoriesData);
        
        // Testar despesas
        const expensesData = await expenseAPI.getAll();
        console.log('💸 Despesas carregadas:', expensesData);
        setExpenses(expensesData);
        
      } catch (err) {
        console.error('❌ Erro ao carregar dados de despesas:', err);
        setError(err instanceof Error ? err.message : 'Erro desconhecido');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="p-4">🔄 Carregando despesas...</div>;
  if (error) return <div className="p-4 text-red-600">❌ Erro: {error}</div>;

  return (
    <div className="p-6 mt-6 border-t">
      <h2 className="text-2xl font-bold mb-4">🧪 Teste de Despesas</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">📊 Categorias de Despesas ({categories.length})</h3>
          <div className="space-y-2">
            {categories.map((category: any) => (
              <div key={category.id} className="p-3 bg-red-50 rounded">
                <div className="font-medium">{category.name}</div>
                <div className="text-sm text-gray-600">
                  Descrição: {category.description} | Cor: {category.color}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">💸 Despesas ({expenses.length})</h3>
          <div className="space-y-2">
            {expenses.map((expense: any) => (
              <div key={expense.id} className="p-3 bg-red-100 rounded">
                <div className="font-medium">{expense.description}</div>
                <div className="text-sm text-gray-600">
                  R$ {Number(expense.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} | {expense.date}
                </div>
                <div className="text-xs text-gray-500">
                  Categoria: {expense.category_id} | Status: {expense.status} | Tipo: {expense.type}
                </div>
                <div className="text-xs text-gray-500">
                  Fornecedor: {expense.supplier || 'N/A'} | Método: {expense.payment_method || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
