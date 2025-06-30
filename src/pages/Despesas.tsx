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
import { Switch } from '@/components/ui/switch';
import { useAppContext } from '@/contexts/AppContext';
import { Expense, ExpenseCategory } from '@/types';
import { Plus, Edit, Trash2, TrendingDown, User, Briefcase, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const expenseSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  date: z.string().min(1, 'Data é obrigatória'),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  type: z.enum(['pessoal', 'profissional']),
  isRecurring: z.boolean().default(false),
  projectName: z.string().optional(),
  tags: z.string().optional(),
  receiptUrl: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export const Despesas: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { expenses, expenseCategories } = state;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      type: 'profissional',
      isRecurring: false
    }
  });

  const watchType = watch('type');

  const onSubmit = (data: ExpenseFormData) => {
    const categoryId = data.categoryId;
    const category = expenseCategories.find(c => c.id === categoryId);
    
    if (!category) return;

    const expense: Expense = {
      id: editingExpense?.id || Math.random().toString(36).substr(2, 9),
      description: data.description,
      amount: data.amount,
      date: new Date(data.date),
      categoryId,
      category,
      type: data.type,
      isRecurring: data.isRecurring,
      projectName: data.projectName,
      tags: data.tags ? data.tags.split(',').map(tag => tag.trim()) : undefined,
      receiptUrl: data.receiptUrl,
    };

    if (editingExpense) {
      dispatch({ type: 'UPDATE_EXPENSE', payload: expense });
    } else {
      dispatch({ type: 'ADD_EXPENSE', payload: expense });
    }

    setIsDialogOpen(false);
    setEditingExpense(null);
    reset();
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setValue('description', expense.description);
    setValue('amount', expense.amount);
    setValue('date', format(expense.date, 'yyyy-MM-dd'));
    setValue('categoryId', expense.categoryId);
    setValue('type', expense.type);
    setValue('isRecurring', expense.isRecurring);
    setValue('projectName', expense.projectName || '');
    setValue('tags', expense.tags?.join(', ') || '');
    setValue('receiptUrl', expense.receiptUrl || '');
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta despesa?')) {
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular estatísticas
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const professionalExpenses = expenses
    .filter(expense => expense.type === 'profissional')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const personalExpenses = expenses
    .filter(expense => expense.type === 'pessoal')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const recurringExpenses = expenses
    .filter(expense => expense.isRecurring)
    .reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Despesas</h1>
            <p className="text-gray-600 mt-1">Controle seus gastos e investimentos</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-red-600 to-red-700 mt-4 sm:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Nova Despesa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingExpense ? 'Editar Despesa' : 'Nova Despesa'}
                </DialogTitle>
                <DialogDescription>
                  {editingExpense ? 'Edite as informações da despesa' : 'Registre uma nova despesa'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Ex: Microfone Blue Yeti para gravações"
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
                  <Label>Categoria</Label>
                  <Select onValueChange={(value) => setValue('categoryId', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {expenseCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: category.color }}
                            />
                            {category.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.categoryId && (
                    <p className="text-sm text-red-500">{errors.categoryId.message}</p>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tipo de Despesa</Label>
                    <Select onValueChange={(value) => setValue('type', value as 'pessoal' | 'profissional')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="profissional">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2" />
                            Profissional
                          </div>
                        </SelectItem>
                        <SelectItem value="pessoal">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Pessoal
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="recurring"
                      onCheckedChange={(checked) => setValue('isRecurring', checked)}
                    />
                    <Label htmlFor="recurring">Despesa recorrente</Label>
                  </div>
                </div>

                {watchType === 'profissional' && (
                  <div className="space-y-2">
                    <Label htmlFor="projectName">Nome do Projeto (opcional)</Label>
                    <Input
                      id="projectName"
                      placeholder="Ex: Série de JavaScript"
                      {...register('projectName')}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (opcional)</Label>
                  <Input
                    id="tags"
                    placeholder="Ex: equipamento, software, marketing"
                    {...register('tags')}
                  />
                  <p className="text-xs text-gray-500">Separe as tags por vírgula</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="receiptUrl">Link do Comprovante (opcional)</Label>
                  <Input
                    id="receiptUrl"
                    type="url"
                    placeholder="https://..."
                    {...register('receiptUrl')}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingExpense ? 'Atualizar' : 'Adicionar'} Despesa
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingExpense(null);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Despesas</CardTitle>
              <DollarSign className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {formatCurrency(totalExpenses)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {expenses.length} despesa{expenses.length !== 1 ? 's' : ''} registrada{expenses.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas Profissionais</CardTitle>
              <Briefcase className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(professionalExpenses)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {((professionalExpenses / totalExpenses) * 100 || 0).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas Pessoais</CardTitle>
              <User className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(personalExpenses)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {((personalExpenses / totalExpenses) * 100 || 0).toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas Recorrentes</CardTitle>
              <TrendingDown className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {formatCurrency(recurringExpenses)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Por mês
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de despesas */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Despesas</CardTitle>
            <CardDescription>
              Todas as suas despesas registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma despesa registrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Comece adicionando sua primeira despesa para acompanhar seus gastos.
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-red-600 to-red-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Primeira Despesa
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {expenses
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((expense) => (
                    <div key={expense.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: expense.category.color }}
                            />
                            <h3 className="font-medium text-gray-900">{expense.description}</h3>
                            
                            <Badge variant={expense.type === 'profissional' ? 'default' : 'secondary'}>
                              {expense.type === 'profissional' ? (
                                <><Briefcase className="h-3 w-3 mr-1" /> Profissional</>
                              ) : (
                                <><User className="h-3 w-3 mr-1" /> Pessoal</>
                              )}
                            </Badge>
                            
                            {expense.isRecurring && (
                              <Badge variant="outline">Recorrente</Badge>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{expense.category.name}</span>
                            <span>•</span>
                            <span>{format(expense.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
                            {expense.projectName && (
                              <>
                                <span>•</span>
                                <span>Projeto: {expense.projectName}</span>
                              </>
                            )}
                          </div>
                          
                          {expense.tags && expense.tags.length > 0 && (
                            <div className="flex items-center space-x-2 mt-2">
                              {expense.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="text-lg font-bold text-red-600">
                              -{formatCurrency(expense.amount)}
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(expense)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(expense.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
