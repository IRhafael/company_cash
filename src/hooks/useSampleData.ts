import { useEffect } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { Income, Expense, Barter } from '@/types';
import { subDays, subWeeks, subMonths } from 'date-fns';

export const useSampleData = () => {
  const { state, dispatch } = useAppContext();
  const { isAuthenticated, incomes, expenses, barters, incomeSources, expenseCategories } = state;

  useEffect(() => {
    // Só adiciona dados de exemplo se o usuário estiver autenticado e não tiver dados
    if (isAuthenticated && incomes.length === 0 && expenses.length === 0 && barters.length === 0) {
      const now = new Date();

      // Dados de exemplo para receitas
      const sampleIncomes: Omit<Income, 'source'>[] = [
        {
          id: '1',
          description: 'Receita YouTube AdSense - Novembro 2024',
          amount: 2500.00,
          date: subDays(now, 15),
          sourceId: '1', // YouTube
          type: 'recorrente',
          status: 'confirmado',
          projectName: 'Canal Principal'
        },
        {
          id: '2', 
          description: 'Curso "React para Iniciantes" - Hotmart',
          amount: 4200.00,
          date: subDays(now, 10),
          sourceId: '3', // Hotmart
          type: 'unico',
          status: 'confirmado',
          projectName: 'Curso React',
          campaignName: 'Black Friday'
        },
        {
          id: '3',
          description: 'Patrocínio TechCorp - Review Notebook',
          amount: 1800.00,
          date: subDays(now, 7),
          sourceId: '5', // Patrocínios
          type: 'unico',
          status: 'confirmado',
          projectName: 'Review TechCorp'
        },
        {
          id: '4',
          description: 'Afiliação Amazon - Equipamentos',
          amount: 850.00,
          date: subDays(now, 3),
          sourceId: '4', // Afiliações
          type: 'recorrente',
          status: 'confirmado'
        },
        {
          id: '5',
          description: 'Live Twitch - Doações e Bits',
          amount: 320.00,
          date: subDays(now, 1),
          sourceId: '2', // Twitch
          type: 'unico',
          status: 'confirmado',
          projectName: 'Stream Semanal'
        },
        // Dados de meses anteriores
        {
          id: '6',
          description: 'YouTube AdSense - Outubro 2024',
          amount: 2100.00,
          date: subMonths(now, 1),
          sourceId: '1',
          type: 'recorrente',
          status: 'confirmado'
        },
        {
          id: '7',
          description: 'Hotmart - Curso JavaScript',
          amount: 3200.00,
          date: subWeeks(now, 6),
          sourceId: '3',
          type: 'unico',
          status: 'confirmado',
          projectName: 'Curso JavaScript'
        }
      ];

      // Dados de exemplo para despesas
      const sampleExpenses: Omit<Expense, 'category'>[] = [
        {
          id: '1',
          description: 'Adobe Creative Suite - Assinatura Mensal',
          amount: 150.00,
          date: subDays(now, 5),
          categoryId: '1', // Software
          type: 'profissional',
          isRecurring: true,
          tags: ['adobe', 'software', 'mensal']
        },
        {
          id: '2',
          description: 'Microfone Blue Yeti USB',
          amount: 890.00,
          date: subDays(now, 12),
          categoryId: '2', // Equipamentos
          type: 'profissional',
          isRecurring: false,
          projectName: 'Upgrade Estúdio',
          tags: ['microfone', 'audio', 'equipamento']
        },
        {
          id: '3',
          description: 'Google Ads - Promoção Curso React',
          amount: 650.00,
          date: subDays(now, 8),
          categoryId: '3', // Marketing
          type: 'profissional',
          isRecurring: false,
          projectName: 'Curso React',
          tags: ['google ads', 'marketing', 'curso']
        },
        {
          id: '4',
          description: 'Udemy - Curso de Motion Graphics',
          amount: 89.90,
          date: subDays(now, 20),
          categoryId: '4', // Educação
          type: 'profissional',
          isRecurring: false,
          tags: ['curso', 'motion graphics', 'capacitação']
        },
        {
          id: '5',
          description: 'Freelancer - Editor de Vídeo',
          amount: 1200.00,
          date: subDays(now, 6),
          categoryId: '5', // Colaboradores
          type: 'profissional',
          isRecurring: false,
          projectName: 'Série JavaScript',
          tags: ['edição', 'freelancer', 'video']
        },
        {
          id: '6',
          description: 'Uber - Deslocamento para evento',
          amount: 45.00,
          date: subDays(now, 2),
          categoryId: '6', // Transporte
          type: 'profissional',
          isRecurring: false,
          projectName: 'DevConf 2024',
          tags: ['transporte', 'evento']
        },
        {
          id: '7',
          description: 'Almoço com colaborador',
          amount: 85.00,
          date: subDays(now, 4),
          categoryId: '7', // Alimentação
          type: 'pessoal',
          isRecurring: false,
          tags: ['almoço', 'networking']
        },
        // Despesas de meses anteriores
        {
          id: '8',
          description: 'Adobe Creative Suite - Outubro',
          amount: 150.00,
          date: subMonths(now, 1),
          categoryId: '1',
          type: 'profissional',
          isRecurring: true
        },
        {
          id: '9',
          description: 'Iluminação LED para gravações',
          amount: 450.00,
          date: subWeeks(now, 8),
          categoryId: '2',
          type: 'profissional',
          isRecurring: false,
          projectName: 'Upgrade Estúdio'
        }
      ];

      // Dados de exemplo para permutas
      const sampleBarters: Barter[] = [
        {
          id: '1',
          description: 'iPhone 15 Pro para review completo',
          estimatedValue: 8500.00,
          date: subDays(now, 14),
          brand: 'Apple',
          type: 'produto',
          status: 'recebido',
          notes: 'Review completo + unboxing. Retornar após 45 dias.'
        },
        {
          id: '2',
          description: 'Consultoria em Marketing Digital - 10h',
          estimatedValue: 2000.00,
          date: subDays(now, 21),
          brand: 'MarketingPro Agency',
          type: 'servico',
          status: 'recebido',
          notes: 'Consultoria para estratégia de crescimento do canal'
        },
        {
          id: '3',
          description: 'Fones de Ouvido Sony WH-1000XM5',
          estimatedValue: 1200.00,
          date: subDays(now, 5),
          brand: 'Sony',
          type: 'produto',
          status: 'pendente',
          notes: 'Chegará na próxima semana para review'
        },
        {
          id: '4',
          description: 'Notebook Gamer Dell G15',
          estimatedValue: 4500.00,
          date: subWeeks(now, 3),
          brand: 'Dell',
          type: 'produto',
          status: 'recebido',
          notes: 'Review gaming + produtividade. Período de teste: 30 dias'
        }
      ];

      // Processar e adicionar as receitas com as fontes corretas
      sampleIncomes.forEach(incomeData => {
        const source = incomeSources.find(s => s.id === incomeData.sourceId);
        if (source) {
          const income: Income = {
            ...incomeData,
            source
          };
          dispatch({ type: 'ADD_INCOME', payload: income });
        }
      });

      // Processar e adicionar as despesas com as categorias corretas
      sampleExpenses.forEach(expenseData => {
        const category = expenseCategories.find(c => c.id === expenseData.categoryId);
        if (category) {
          const expense: Expense = {
            ...expenseData,
            category
          };
          dispatch({ type: 'ADD_EXPENSE', payload: expense });
        }
      });

      // Adicionar as permutas
      sampleBarters.forEach(barter => {
        dispatch({ type: 'ADD_BARTER', payload: barter });
      });
    }
  }, [isAuthenticated, incomes.length, expenses.length, barters.length, incomeSources, expenseCategories, dispatch]);
};
