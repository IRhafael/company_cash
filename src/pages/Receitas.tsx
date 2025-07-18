import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useAppContext } from '@/contexts/AppContext';
import { Income, IncomeSource } from '@/types';
import { Plus, Edit, Trash2, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import api from '@/services/api';
import { parseAmount, formatCurrency } from '@/lib/currency';

const incomeSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  date: z.string().min(1, 'Data é obrigatória'),
  sourceName: z.string().min(1, 'Fonte de renda é obrigatória'),
  type: z.enum(['recorrente', 'unico']),
  status: z.enum(['confirmado', 'pendente', 'cancelado']).default('confirmado'),
  projectName: z.string().optional(),
  campaignName: z.string().optional(),
});

type IncomeFormData = z.infer<typeof incomeSchema>;

export const Receitas: React.FC = () => {
  const { state, createIncome, updateIncome, deleteIncome } = useAppContext();
  
  // Garantir que os arrays existem antes de usar
  const safeIncomes = Array.isArray(state.incomes) ? state.incomes : [];
  const safeIncomeSources = Array.isArray(state.incomeSources) ? state.incomeSources : [];
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<Income | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<IncomeFormData>({
    resolver: zodResolver(incomeSchema),
    defaultValues: {
      type: 'unico',
      status: 'confirmado'
    }
  });

  const onSubmit = async (data: IncomeFormData) => {
    try {
      // 1. Procurar fonte de renda pelo nome (case-insensitive)
      let source = safeIncomeSources.find(
        (s) => s.name.trim().toLowerCase() === data.sourceName.trim().toLowerCase()
      );
      // 2. Se não existir, criar uma nova fonte
      if (!source) {
        // Definir tipo e cor padrão
        source = await api.incomeSources.create({
          name: data.sourceName.trim(),
          type: 'servicos', // ou outro tipo padrão
          color: '#3B82F6', // cor padrão
        });
      }
      // 3. Montar dados para o backend
      const incomeData = {
        description: data.description,
        amount: data.amount,
        date: data.date,
        sourceId: source.id,
        type: data.type,
        status: data.status,
        projectName: data.projectName,
        campaignName: data.campaignName,
      };
      if (editingIncome) {
        await updateIncome(editingIncome.id, incomeData);
      } else {
        await createIncome(incomeData);
      }
      setIsDialogOpen(false);
      setEditingIncome(null);
      reset();
    } catch (error) {
      console.error('Erro ao salvar receita:', error);
      // Aqui você pode adicionar um toast de erro se quiser
    }
  };

  const handleEdit = (income: Income) => {
    setEditingIncome(income);
    setValue('description', income.description);
    setValue('amount', income.amount);
    setValue('date', typeof income.date === 'string' ? income.date : income.date.toISOString().split('T')[0]);
    setValue('sourceName', income.source?.name || '');
    setValue('type', income.type);
    setValue('status', income.status);
    setValue('projectName', income.projectName || '');
    setValue('campaignName', income.campaignName || '');
    setIsDialogOpen(true);
  };

  const handleDelete = async (income: Income) => {
    if (window.confirm('Tem certeza que deseja excluir esta receita?')) {
      try {
        await deleteIncome(income.id);
      } catch (error) {
        console.error('Erro ao excluir receita:', error);
      }
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingIncome(null);
    reset();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado': return 'Confirmado';
      case 'pendente': return 'Pendente';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  // Calcular estatísticas usando parseAmount
  const totalIncome = safeIncomes.reduce((sum, income) => sum + parseAmount(income.amount), 0);
  const confirmedIncome = safeIncomes
    .filter(income => income.status === 'confirmado')
    .reduce((sum, income) => sum + parseAmount(income.amount), 0);
  const pendingIncome = safeIncomes
    .filter(income => income.status === 'pendente')
    .reduce((sum, income) => sum + parseAmount(income.amount), 0);

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Receitas</h1>
            <p className="text-gray-600 mt-1">Gerencie suas fontes de renda</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 mt-4 sm:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Nova Receita
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingIncome ? 'Editar Receita' : 'Nova Receita'}
                </DialogTitle>
                <DialogDescription>
                  {editingIncome ? 'Edite as informações da receita' : 'Adicione uma nova fonte de renda'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Ex: Honorários de Consultoria - Junho 2024"
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Valor (R$)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      {...register('amount', { valueAsNumber: true })}
                    />
                    {errors.amount && (
                      <p className="text-sm text-red-500">{errors.amount.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      {...register('date')}
                    />
                    {errors.date && (
                      <p className="text-sm text-red-500">{errors.date.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sourceName">Fonte de Renda</Label>
                  <Input
                    id="sourceName"
                    placeholder="Ex: Honorários Contábeis, Consultoria, etc."
                    {...register('sourceName')}
                  />
                  {errors.sourceName && (
                    <p className="text-sm text-red-500">{errors.sourceName.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select onValueChange={(value) => setValue('type', value as 'recorrente' | 'unico')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unico">Único</SelectItem>
                        <SelectItem value="recorrente">Recorrente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Status</Label>
                    <Select onValueChange={(value) => setValue('status', value as any)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="confirmado">Confirmado</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectName">Nome do Projeto (opcional)</Label>
                  <Input
                    id="projectName"
                    placeholder="Ex: Consultoria Empresarial Cliente XYZ"
                    {...register('projectName')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="campaignName">Nome da Campanha (opcional)</Label>
                  <Input
                    id="campaignName"
                    placeholder="Ex: Promoção Abertura de Empresas"
                    {...register('campaignName')}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingIncome ? 'Atualizar' : 'Adicionar'} Receita
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingIncome(null);
                      reset();
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Receitas</CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalIncome)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {safeIncomes.length} receita{safeIncomes.length !== 1 ? 's' : ''} registrada{safeIncomes.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas Confirmadas</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(confirmedIncome)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Valor já confirmado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas Pendentes</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(pendingIncome)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Aguardando confirmação
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de receitas */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Receitas</CardTitle>
            <CardDescription>
              Todas as suas receitas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {safeIncomes.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma receita registrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Comece adicionando sua primeira receita para acompanhar seus ganhos.
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeira Receita
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {safeIncomes
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((income) => {
                    // Fonte de renda: buscar pelo id da fonte
                    const sourceName = (safeIncomeSources.find(s => s.id === income.sourceId)?.name) || 'Fonte não encontrada';
                    const sourceColor = (safeIncomeSources.find(s => s.id === income.sourceId)?.color) || '#6b7280';
                    return (
                    <div key={income.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: sourceColor }}
                            />
                            <h3 className="font-medium text-gray-900">{income.description}</h3>
                            <Badge className={getStatusColor(income.status)}>
                              {getStatusText(income.status)}
                            </Badge>
                            {income.type === 'recorrente' && (
                              <Badge variant="outline">Recorrente</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{sourceName}</span>
                            <span>•</span>
                            <span>{format(income.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
                            {income.projectName && (
                              <>
                                <span>•</span>
                                <span>Projeto: {income.projectName}</span>
                              </>
                            )}
                            {income.campaignName && (
                              <>
                                <span>•</span>
                                <span>Campanha: {income.campaignName}</span>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">
                              {formatCurrency(income.amount)}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(income)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(income)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
