import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useFinancialCalculations } from '@/hooks/useFinancialCalculations';
import { useAppContext } from '@/contexts/AppContext';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Percent,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Eye
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Link } from 'react-router-dom';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4'];

export const Dashboard: React.FC = () => {
  const { state } = useAppContext();
  const { financialSummary, monthlyData } = useFinancialCalculations();
  const { incomes, expenses, incomeSources, expenseCategories } = state;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Dados para o gráfico de receitas por fonte
  const incomeBySource = incomeSources.map(source => {
    const total = incomes
      .filter(income => income.sourceId === source.id)
      .reduce((sum, income) => sum + income.amount, 0);
    return {
      name: source.name,
      value: total,
      color: source.color
    };
  }).filter(item => item.value > 0);

  // Dados para o gráfico de despesas por categoria
  const expenseByCategory = expenseCategories.map(category => {
    const total = expenses
      .filter(expense => expense.categoryId === category.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return {
      name: category.name,
      value: total,
      color: category.color
    };
  }).filter(item => item.value > 0);

  // Atividades recentes
  const recentActivities = [
    ...incomes.slice(-3).map(income => ({
      id: income.id,
      type: 'income' as const,
      description: income.description,
      amount: income.amount,
      date: income.date,
      source: income.source.name
    })),
    ...expenses.slice(-3).map(expense => ({
      id: expense.id,
      type: 'expense' as const,
      description: expense.description,
      amount: expense.amount,
      date: expense.date,
      category: expense.category.name
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  if (!financialSummary) {
    return (
      <div className="p-6 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-6 w-24 h-24 mx-auto mb-6">
              <DollarSign className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Bem-vindo ao CreatorCash!
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Comece registrando suas primeiras receitas e despesas para ver suas métricas financeiras.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Link to="/receitas">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Receita
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/despesas">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Despesa
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">Visão geral da sua saúde financeira</p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <Button variant="outline" asChild>
              <Link to="/relatorios">
                <Eye className="h-4 w-4 mr-2" />
                Ver Relatórios
              </Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Link to="/receitas">
                <Plus className="h-4 w-4 mr-2" />
                Nova Receita
              </Link>
            </Button>
          </div>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(financialSummary.totalIncome)}
              </div>
              <div className="flex items-center text-xs text-gray-600 mt-2">
                {financialSummary.growth.income >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                )}
                {formatPercent(financialSummary.growth.income)} vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas Totais</CardTitle>
              <TrendingDown className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(financialSummary.totalExpenses)}
              </div>
              <div className="flex items-center text-xs text-gray-600 mt-2">
                {financialSummary.growth.expenses >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1 text-red-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1 text-green-500" />
                )}
                {formatPercent(financialSummary.growth.expenses)} vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Lucro Líquido</CardTitle>
              <DollarSign className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${financialSummary.netProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(financialSummary.netProfit)}
              </div>
              <div className="flex items-center text-xs text-gray-600 mt-2">
                {financialSummary.growth.profit >= 0 ? (
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 mr-1 text-red-500" />
                )}
                {formatCurrency(financialSummary.growth.profit)} vs mês anterior
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margem de Lucro</CardTitle>
              <Percent className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${financialSummary.profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {financialSummary.profitMargin.toFixed(1)}%
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Meta: acima de 20%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Gráfico de evolução mensal */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução Mensal</CardTitle>
              <CardDescription>Receitas, despesas e lucro dos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="income" name="Receita" fill="#10B981" />
                  <Bar dataKey="expenses" name="Despesas" fill="#EF4444" />
                  <Bar dataKey="profit" name="Lucro" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Gráfico de receitas por fonte */}
          <Card>
            <CardHeader>
              <CardTitle>Receitas por Fonte</CardTitle>
              <CardDescription>Distribuição das suas fontes de renda</CardDescription>
            </CardHeader>
            <CardContent>
              {incomeBySource.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={incomeBySource}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {incomeBySource.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  Nenhuma receita registrada ainda
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {incomeBySource.slice(0, 6).map((item, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="truncate">{item.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Seção inferior */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Atividades recentes */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Atividades Recentes</CardTitle>
              <CardDescription>Suas últimas transações</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          activity.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {activity.type === 'income' ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingDown className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            {'source' in activity ? activity.source : activity.category} • {' '}
                            {new Date(activity.date).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                      <div className={`font-medium ${
                        activity.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {activity.type === 'income' ? '+' : '-'}{formatCurrency(activity.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma atividade registrada ainda
                </div>
              )}
            </CardContent>
          </Card>

          {/* Resumo de fontes principais */}
          <Card>
            <CardHeader>
              <CardTitle>Top Fontes de Renda</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incomeBySource.slice(0, 5).map((source, index) => {
                  const percentage = financialSummary.totalIncome > 0 
                    ? (source.value / financialSummary.totalIncome) * 100 
                    : 0;
                  
                  return (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{source.name}</span>
                        <span className="text-sm text-gray-600">{percentage.toFixed(1)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${percentage}%`, 
                            backgroundColor: source.color 
                          }}
                        />
                      </div>
                      <div className="text-xs text-gray-600">
                        {formatCurrency(source.value)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
