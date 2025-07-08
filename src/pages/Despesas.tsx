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
  type: z.enum(['pessoal', 'profissional', 'deductible', 'non_deductible']),
  status: z.enum(['pago', 'pendente', 'vencido']).default('pendente'),
  paymentMethod: z.string().optional(),
  supplier: z.string().optional(),
  invoiceNumber: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
  isRecurring: z.boolean().default(false),
  projectName: z.string().optional(),
  tags: z.string().optional(),
  receiptUrl: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export const Despesas: React.FC = () => {
  const { state, createExpense, updateExpense, deleteExpense } = useAppContext();
  
  // Garantir que os arrays existem antes de usar
  const safeExpenses = Array.isArray(state.expenses) ? state.expenses : [];
  const safeExpenseCategories = Array.isArray(state.expenseCategories) ? state.expenseCategories : [];
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      type: 'profissional',
      status: 'pendente',
      isRecurring: false
    }
  });

  const watchType = watch('type');

  const onSubmit = async (data: ExpenseFormData) => {
    try {
      // Mapear tipos do frontend para o backend
      const typeMapping = {
        'pessoal': 'variavel',
        'profissional': 'fixa',
        'deductible': 'variavel',
        'non_deductible': 'variavel'
      };

      const expenseData = {
        description: data.description,
        amount: data.amount,
        date: data.date,
        categoryId: data.categoryId,
        type: typeMapping[data.type] || 'variavel',
        status: data.status || 'pendente',
        paymentMethod: data.paymentMethod,
        supplier: data.supplier,
        invoiceNumber: data.invoiceNumber,
        dueDate: data.dueDate,
        notes: data.notes || (data.tags ? `Tags: ${data.tags}${data.projectName ? `, Projeto: ${data.projectName}` : ''}${data.receiptUrl ? `, Comprovante: ${data.receiptUrl}` : ''}` : ''),
      };

      console.log('📤 Enviando dados de despesa:', expenseData);

      if (editingExpense) {
        await updateExpense(editingExpense.id, expenseData);
      } else {
        await createExpense(expenseData);
      }

      setIsDialogOpen(false);
      setEditingExpense(null);
      reset();
    } catch (error) {
      console.error('❌ Erro ao salvar despesa:', error);
    }
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setValue('description', expense.description);
    setValue('amount', expense.amount);
    setValue('date', typeof expense.date === 'string' ? expense.date : expense.date.toISOString().split('T')[0]);
    setValue('categoryId', expense.categoryId);
    
    // Mapear tipos do backend para o frontend
    const typeMapping = {
      'fixa': 'profissional',
      'variavel': 'pessoal',
      'investimento': 'profissional'
    };
    setValue('type', typeMapping[expense.type] || 'profissional');
    setValue('status', expense.status || 'pendente');
    setValue('paymentMethod', expense.paymentMethod || '');
    setValue('supplier', expense.supplier || '');
    setValue('invoiceNumber', expense.invoiceNumber || '');
    setValue('dueDate', expense.dueDate ? (typeof expense.dueDate === 'string' ? expense.dueDate : expense.dueDate.toISOString().split('T')[0]) : '');
    setValue('notes', expense.notes || '');
    setValue('isRecurring', expense.isRecurring || false);
    setValue('projectName', expense.projectName || '');
    setValue('tags', expense.tags?.join(', ') || '');
    setValue('receiptUrl', expense.receiptUrl || '');
    setIsDialogOpen(true);
  };

  const handleDelete = async (expense: Expense) => {
    if (window.confirm('Tem certeza que deseja excluir esta despesa?')) {
      try {
        await deleteExpense(expense.id);
      } catch (error) {
        console.error('Erro ao excluir despesa:', error);
      }
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingExpense(null);
    reset();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Calcular estatísticas
  const totalExpenses = safeExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const professionalExpenses = safeExpenses
    .filter(expense => expense.type === 'profissional')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const personalExpenses = safeExpenses
    .filter(expense => expense.type === 'pessoal')
    .reduce((sum, expense) => sum + expense.amount, 0);
  const recurringExpenses = safeExpenses
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
                      {safeExpenseCategories.map((category) => (
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
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Observações adicionais sobre a despesa"
                    {...register('notes')}
                  />
                </div>

                <div className="space-y-2">
                    <Label>Status</Label>
                    <Select onValueChange={(value) => setValue('status', value as 'pago' | 'pendente' | 'vencido')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="pago">Pago</SelectItem>
                        <SelectItem value="vencido">Vencido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="paymentMethod">Método de Pagamento (opcional)</Label>
                    <Select onValueChange={(value) => setValue('paymentMethod', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o método" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PIX">PIX</SelectItem>
                        <SelectItem value="Cartão">Cartão</SelectItem>
                        <SelectItem value="Transferência">Transferência</SelectItem>
                        <SelectItem value="Boleto">Boleto</SelectItem>
                        <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="supplier">Fornecedor (opcional)</Label>
                    <Input
                      id="supplier"
                      placeholder="Ex: Empresa ABC"
                      {...register('supplier')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Número da Nota (opcional)</Label>
                    <Input
                      id="invoiceNumber"
                      placeholder="Ex: NF-001"
                      {...register('invoiceNumber')}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Data de Vencimento (opcional)</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    {...register('dueDate')}
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
                {safeExpenses.length} despesa{safeExpenses.length !== 1 ? 's' : ''} registrada{safeExpenses.length !== 1 ? 's' : ''}
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
            {safeExpenses.length === 0 ? (
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
                {safeExpenses
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((expense) => {
                    // Categoria: buscar pelo id
                    const categoryName = (safeExpenseCategories.find(c => c.id === expense.categoryId)?.name) || 'Categoria não encontrada';
                    const categoryColor = (safeExpenseCategories.find(c => c.id === expense.categoryId)?.color) || '#6b7280';
                    return (
                    <div key={expense.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: categoryColor }}
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
                            <span>{categoryName}</span>
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
                              onClick={() => handleDelete(expense)}
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
