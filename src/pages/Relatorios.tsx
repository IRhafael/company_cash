import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFinancialCalculations } from '@/hooks/useFinancialCalculations';
import { useAppContext } from '@/contexts/AppContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Target,
  DollarSign,
  Percent
} from 'lucide-react';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#06B6D4', '#F97316', '#84CC16'];

export const Relatorios: React.FC = () => {
  const { state } = useAppContext();
  const { financialSummary, monthlyData, reportMetrics } = useFinancialCalculations();
  
  // Garantir que os arrays existem antes de usar
  const safeIncomes = Array.isArray(state.incomes) ? state.incomes : [];
  const safeExpenses = Array.isArray(state.expenses) ? state.expenses : [];
  const safeIncomeSources = Array.isArray(state.incomeSources) ? state.incomeSources : [];
  const safeExpenseCategories = Array.isArray(state.expenseCategories) ? state.expenseCategories : [];
  
  const [selectedPeriod, setSelectedPeriod] = useState('6m');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Função para filtrar dados por período
  const getDataByPeriod = (period: string) => {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case '1m':
        startDate = subMonths(now, 1);
        break;
      case '3m':
        startDate = subMonths(now, 3);
        break;
      case '6m':
        startDate = subMonths(now, 6);
        break;
      case '1y':
        startDate = subMonths(now, 12);
        break;
      default:
        startDate = subMonths(now, 6);
    }

    const filteredIncomes = safeIncomes.filter(income => 
      (typeof income.date === 'string' ? new Date(income.date) : income.date) >= startDate
    );
    
    const filteredExpenses = safeExpenses.filter(expense => 
      (typeof expense.date === 'string' ? new Date(expense.date) : expense.date) >= startDate
    );

    return { filteredIncomes, filteredExpenses };
  };

  const { filteredIncomes, filteredExpenses } = getDataByPeriod(selectedPeriod);

  // Dados para gráfico de receitas por fonte
  const incomeBySource = safeIncomeSources.map(source => {
    const total = filteredIncomes
      .filter(income => income.sourceId === source.id)
      .reduce((sum, income) => sum + income.amount, 0);
    return {
      name: source.name,
      value: total,
      color: source.color
    };
  }).filter(item => item.value > 0);

  // Dados para gráfico de despesas por categoria
  const expenseByCategory = safeExpenseCategories.map(category => {
    const total = filteredExpenses
      .filter(expense => expense.categoryId === category.id)
      .reduce((sum, expense) => sum + expense.amount, 0);
    return {
      name: category.name,
      value: total,
      color: category.color
    };
  }).filter(item => item.value > 0);

  // Evolução temporal mais detalhada
  const getDetailedEvolution = () => {
    const months: any[] = [];
    const currentDate = new Date();
    const periodMonths = selectedPeriod === '1y' ? 12 : selectedPeriod === '6m' ? 6 : 3;
    
    for (let i = periodMonths - 1; i >= 0; i--) {
      const date = subMonths(currentDate, i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      
      const monthIncomes = safeIncomes.filter(income => 
        isWithinInterval(typeof income.date === 'string' ? new Date(income.date) : income.date, { start: monthStart, end: monthEnd })
      );
      
      const monthExpenses = safeExpenses.filter(expense => 
        isWithinInterval(typeof expense.date === 'string' ? new Date(expense.date) : expense.date, { start: monthStart, end: monthEnd })
      );
      
      const income = monthIncomes.reduce((sum, inc) => sum + inc.amount, 0);
      const expenseAmount = monthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
      
      months.push({
        month: format(date, 'MMM/yy', { locale: ptBR }),
        receitas: income,
        despesas: expenseAmount,
        lucro: income - expenseAmount,
        margem: income > 0 ? ((income - expenseAmount) / income) * 100 : 0
      });
    }
    
    return months;
  };

  const detailedEvolution = getDetailedEvolution();

  // ROI por fonte de renda
  const roiData = Object.entries(reportMetrics.roiBySource).map(([source, roi]) => ({
    fonte: source,
    roi: roi,
    color: safeIncomeSources.find(s => s.name === source)?.color || '#6B7280'
  })).sort((a, b) => b.roi - a.roi);

  // Comparação Pessoal vs Profissional
  const personalVsProfessionalData = [
    {
      name: 'Profissional',
      value: reportMetrics.personalVsProfessional.professional,
      color: '#3B82F6'
    },
    {
      name: 'Pessoal',
      value: reportMetrics.personalVsProfessional.personal,
      color: '#EF4444'
    }
  ].filter(item => item.value > 0);

  const handleExportReport = () => {
    const reportData = {
      periodo: selectedPeriod,
      dataGeracao: new Date().toISOString(),
      resumoFinanceiro: financialSummary,
      evolucaoMensal: detailedEvolution,
      receitasPorFonte: incomeBySource,
      despesasPorCategoria: expenseByCategory,
      metricasEspeciais: reportMetrics
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-creator-cash-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!financialSummary) {
    return (
      <div className="p-6 sm:p-8">
        <div className="max-w-7xl mx-auto text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Relatórios indisponíveis
          </h3>
          <p className="text-gray-600">
            Adicione receitas e despesas para visualizar relatórios detalhados.
          </p>
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
            <h1 className="text-3xl font-bold text-gray-900">Relatórios</h1>
            <p className="text-gray-600 mt-1">Análises e métricas para criadores de conteúdo</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1m">1 Mês</SelectItem>
                <SelectItem value="3m">3 Meses</SelectItem>
                <SelectItem value="6m">6 Meses</SelectItem>
                <SelectItem value="1y">1 Ano</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={handleExportReport} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Métricas principais */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(filteredIncomes.reduce((sum, income) => sum + income.amount, 0))}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Período selecionado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custo por Projeto</CardTitle>
              <Target className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(reportMetrics.costPerProject)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Média de custo por projeto
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Margem Média</CardTitle>
              <Percent className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {(detailedEvolution.reduce((sum, month) => sum + month.margem, 0) / detailedEvolution.length || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Margem de lucro média
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Melhor Fonte</CardTitle>
              <Activity className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold text-orange-600 truncate">
                {incomeBySource[0]?.name || 'N/A'}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {incomeBySource[0] ? formatCurrency(incomeBySource[0].value) : 'Sem dados'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para diferentes relatórios */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="sources">Fontes de Renda</TabsTrigger>
            <TabsTrigger value="expenses">Análise de Gastos</TabsTrigger>
            <TabsTrigger value="projects">Projetos</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Evolução Financeira</CardTitle>
                  <CardDescription>Receitas, despesas e lucro ao longo do tempo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={detailedEvolution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Area 
                        type="monotone" 
                        dataKey="receitas" 
                        name="Receitas"
                        stackId="1" 
                        stroke="#10B981" 
                        fill="#10B981" 
                        fillOpacity={0.3}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="despesas" 
                        name="Despesas"
                        stackId="2" 
                        stroke="#EF4444" 
                        fill="#EF4444" 
                        fillOpacity={0.3}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="lucro" 
                        name="Lucro"
                        stroke="#3B82F6" 
                        strokeWidth={3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Margem de Lucro Mensal</CardTitle>
                  <CardDescription>Evolução da margem de lucro em percentual</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={detailedEvolution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis tickFormatter={(value) => `${value.toFixed(0)}%`} />
                      <Tooltip formatter={(value) => `${Number(value).toFixed(1)}%`} />
                      <Line 
                        type="monotone" 
                        dataKey="margem" 
                        name="Margem (%)"
                        stroke="#8B5CF6" 
                        strokeWidth={3}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Fontes de Renda */}
          <TabsContent value="sources" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Distribuição por Fonte</CardTitle>
                  <CardDescription>Participação de cada fonte na receita total</CardDescription>
                </CardHeader>
                <CardContent>
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
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {incomeBySource.map((item, index) => (
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

              <Card>
                <CardHeader>
                  <CardTitle>ROI por Fonte</CardTitle>
                  <CardDescription>Retorno sobre investimento estimado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {roiData.slice(0, 6).map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-900">{item.fonte}</span>
                          <span className={`text-sm font-medium ${item.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {formatPercent(item.roi)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${Math.min(Math.abs(item.roi), 100)}%`, 
                              backgroundColor: item.roi >= 0 ? '#10B981' : '#EF4444'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Análise de Gastos */}
          <TabsContent value="expenses" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Despesas por Categoria</CardTitle>
                  <CardDescription>Onde você mais gasta</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={expenseByCategory}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        interval={0}
                      />
                      <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                      <Bar dataKey="value" name="Valor">
                        {expenseByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pessoal vs Profissional</CardTitle>
                  <CardDescription>Separação de despesas</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={personalVsProfessionalData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {personalVsProfessionalData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-4 mt-4">
                    {personalVsProfessionalData.map((item, index) => {
                      const total = personalVsProfessionalData.reduce((sum, i) => sum + i.value, 0);
                      const percentage = total > 0 ? (item.value / total) * 100 : 0;
                      
                      return (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-4 h-4 rounded-full mr-3" 
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm font-medium">{item.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">{formatCurrency(item.value)}</div>
                            <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projetos */}
          <TabsContent value="projects" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Projetos por ROI</CardTitle>
                <CardDescription>Projetos mais rentáveis</CardDescription>
              </CardHeader>
              <CardContent>
                {reportMetrics.topProjects.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Nenhum projeto com dados suficientes encontrado
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reportMetrics.topProjects.map((project, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">{project.name}</h3>
                          <Badge variant={project.roi >= 50 ? 'default' : project.roi >= 0 ? 'secondary' : 'destructive'}>
                            ROI: {formatPercent(project.roi)}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Receita</p>
                            <p className="font-medium text-green-600">{formatCurrency(project.revenue)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Custo</p>
                            <p className="font-medium text-red-600">{formatCurrency(project.cost)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Lucro</p>
                            <p className={`font-medium ${project.revenue - project.cost >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                              {formatCurrency(project.revenue - project.cost)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
