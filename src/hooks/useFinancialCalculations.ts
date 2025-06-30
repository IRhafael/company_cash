import { useMemo } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { FinancialSummary, MonthlyData, ReportMetrics } from '@/types';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const useFinancialCalculations = () => {
  const { state } = useAppContext();
  const { incomes, expenses, barters, incomeSources, expenseCategories } = state;

  const financialSummary = useMemo((): FinancialSummary | null => {
    if (incomes.length === 0 && expenses.length === 0) return null;

    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = totalIncome - totalExpenses;
    const profitMargin = totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0;

    // Agrupar receitas por fonte
    const incomeBySource = incomes.reduce((acc, income) => {
      acc[income.sourceId] = (acc[income.sourceId] || 0) + income.amount;
      return acc;
    }, {} as Record<string, number>);

    const topIncomeSourceId = Object.entries(incomeBySource)
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    const topIncomeSource = incomeSources.find(source => source.id === topIncomeSourceId) || incomeSources[0];

    // Agrupar despesas por categoria
    const expenseByCategory = expenses.reduce((acc, expense) => {
      acc[expense.categoryId] = (acc[expense.categoryId] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);

    const topExpenseCategoryId = Object.entries(expenseByCategory)
      .sort(([,a], [,b]) => b - a)[0]?.[0];
    const topExpenseCategory = expenseCategories.find(cat => cat.id === topExpenseCategoryId) || expenseCategories[0];

    // Calcular crescimento comparando com o mês anterior
    const currentMonth = new Date();
    const lastMonth = subMonths(currentMonth, 1);
    
    const currentMonthIncomes = incomes.filter(income => 
      isWithinInterval(income.date, {
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
      })
    );
    
    const lastMonthIncomes = incomes.filter(income => 
      isWithinInterval(income.date, {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth)
      })
    );

    const currentMonthExpenses = expenses.filter(expense => 
      isWithinInterval(expense.date, {
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth)
      })
    );
    
    const lastMonthExpenses = expenses.filter(expense => 
      isWithinInterval(expense.date, {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth)
      })
    );

    const currentIncomeTotal = currentMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
    const lastIncomeTotal = lastMonthIncomes.reduce((sum, income) => sum + income.amount, 0);
    const currentExpenseTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const lastExpenseTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    const incomeGrowth = lastIncomeTotal > 0 ? ((currentIncomeTotal - lastIncomeTotal) / lastIncomeTotal) * 100 : 0;
    const expenseGrowth = lastExpenseTotal > 0 ? ((currentExpenseTotal - lastExpenseTotal) / lastExpenseTotal) * 100 : 0;
    const profitGrowth = (currentIncomeTotal - currentExpenseTotal) - (lastIncomeTotal - lastExpenseTotal);

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin,
      topIncomeSource,
      topExpenseCategory,
      growth: {
        income: incomeGrowth,
        expenses: expenseGrowth,
        profit: profitGrowth
      }
    };
  }, [incomes, expenses, incomeSources, expenseCategories]);

  const monthlyData = useMemo((): MonthlyData[] => {
    const months: MonthlyData[] = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = subMonths(currentDate, i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthIncomes = incomes.filter(income => 
        isWithinInterval(income.date, { start: monthStart, end: monthEnd })
      );
      
      const monthExpenses = expenses.filter(expense => 
        isWithinInterval(expense.date, { start: monthStart, end: monthEnd })
      );
      
      const income = monthIncomes.reduce((sum, inc) => sum + inc.amount, 0);
      const expenseAmount = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      months.push({
        month: format(date, 'MMM', { locale: ptBR }),
        income,
        expenses: expenseAmount,
        profit: income - expenseAmount
      });
    }
    
    return months;
  }, [incomes, expenses]);

  const reportMetrics = useMemo((): ReportMetrics => {
    // Calcular custo por projeto
    const projectExpenses = expenses.filter(expense => expense.projectName);
    const projectsCount = new Set(projectExpenses.map(expense => expense.projectName)).size;
    const costPerProject = projectsCount > 0 ? 
      projectExpenses.reduce((sum, expense) => sum + expense.amount, 0) / projectsCount : 0;

    // ROI por fonte
    const roiBySource: Record<string, number> = {};
    incomeSources.forEach(source => {
      const sourceIncomes = incomes.filter(income => income.sourceId === source.id);
      const sourceRevenue = sourceIncomes.reduce((sum, income) => sum + income.amount, 0);
      
      // Estimar despesas relacionadas à fonte (aproximação)
      const sourceCosts = expenses.filter(expense => 
        expense.category.name.includes('Marketing') || 
        expense.category.name.includes('Software')
      ).reduce((sum, expense) => sum + expense.amount, 0) / incomeSources.length;
      
      roiBySource[source.name] = sourceCosts > 0 ? ((sourceRevenue - sourceCosts) / sourceCosts) * 100 : 0;
    });

    // Pessoal vs Profissional
    const personalExpenses = expenses.filter(expense => expense.type === 'pessoal')
      .reduce((sum, expense) => sum + expense.amount, 0);
    const professionalExpenses = expenses.filter(expense => expense.type === 'profissional')
      .reduce((sum, expense) => sum + expense.amount, 0);

    // Top projetos
    const projectStats: Record<string, { revenue: number; cost: number }> = {};
    
    incomes.forEach(income => {
      if (income.projectName) {
        if (!projectStats[income.projectName]) {
          projectStats[income.projectName] = { revenue: 0, cost: 0 };
        }
        projectStats[income.projectName].revenue += income.amount;
      }
    });

    expenses.forEach(expense => {
      if (expense.projectName && projectStats[expense.projectName]) {
        projectStats[expense.projectName].cost += expense.amount;
      }
    });

    const topProjects = Object.entries(projectStats)
      .map(([name, stats]) => ({
        name,
        revenue: stats.revenue,
        cost: stats.cost,
        roi: stats.cost > 0 ? ((stats.revenue - stats.cost) / stats.cost) * 100 : 0
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    return {
      costPerProject,
      roiBySource,
      personalVsProfessional: {
        personal: personalExpenses,
        professional: professionalExpenses
      },
      topProjects
    };
  }, [incomes, expenses, incomeSources]);

  return {
    financialSummary,
    monthlyData,
    reportMetrics
  };
};
