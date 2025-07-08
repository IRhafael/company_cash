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
import { TaxObligation } from '@/types';
import { Plus, Edit, Trash2, Calendar, DollarSign, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format, isAfter, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { parseAmount } from '@/lib/currency';

// Atualizar o schema para corresponder aos campos necessários
const taxObligationSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório'),
  description: z.string().optional(),
  amount: z.number().min(0.01, 'Valor deve ser maior que zero'),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória'),
  status: z.enum(['pago', 'pendente', 'vencido']).default('pendente'),
  // Removido o .min() do enum pois não é necessário
  priority: z.enum(['baixa', 'media', 'alta']),
  category: z.string().min(1, 'Categoria é obrigatória'),
  taxType: z.enum(['IRPJ', 'CSLL', 'PIS', 'COFINS', 'ICMS', 'ISS', 'INSS', 'FGTS', 'outros']),
  referenceMonth: z.string().min(1, 'Mês de referência é obrigatório'),
  notes: z.string().optional(),
  complianceDate: z.string().optional(),
});

type TaxObligationFormData = z.infer<typeof taxObligationSchema>;

export const ObrigacoesTributarias: React.FC = () => {
  const { state, createTaxObligation, updateTaxObligation, deleteTaxObligation } = useAppContext();
  
  // Garantir que os arrays existem antes de usar
  const safeTaxObligations = Array.isArray(state.taxObligations) ? state.taxObligations : [];
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingObligation, setEditingObligation] = useState<TaxObligation | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<TaxObligationFormData>({
    resolver: zodResolver(taxObligationSchema),
    defaultValues: {
      status: 'pendente'
    }
  });

  const onSubmit = async (data: TaxObligationFormData) => {
    console.log('🎯 Iniciando submit do formulário');
    
    try {
      // Validar se todos os campos obrigatórios estão preenchidos
      const camposObrigatorios = {
        title: data.title,
        dueDate: data.dueDate,
        amount: data.amount,
        status: data.status,
        priority: data.priority,
        category: data.taxType
      };

      console.log('📋 Campos preenchidos:', camposObrigatorios);

      const camposFaltando = Object.entries(camposObrigatorios)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (camposFaltando.length > 0) {
        console.error('❌ Campos obrigatórios faltando:', camposFaltando);
        throw new Error(`Campos obrigatórios faltando: ${camposFaltando.join(', ')}`);
      }

      // Criar objeto com os dados transformados
      const taxObligation = {
        title: String(data.title).trim(),
        description: data.description ? String(data.description).trim() : undefined,
        dueDate: data.dueDate,
        amount: Number(data.amount),
        status: data.status as 'pendente' | 'pago' | 'atrasado',
        priority: data.priority as 'baixa' | 'media' | 'alta',
        category: data.taxType,
        taxType: data.taxType,
        referenceMonth: String(data.referenceMonth || '').trim(),
        notes: data.notes ? String(data.notes).trim() : undefined,
        complianceDate: data.complianceDate
      };

      console.log('📤 Dados processados:', taxObligation);

      // Chamar a API
      await createTaxObligation(taxObligation);
      console.log('✅ Obrigação tributária criada com sucesso');

      // Limpar formulário e fechar modal
      reset();
      setEditingObligation(null);
      setIsDialogOpen(false);
    } catch (error) {
      console.error('❌ Erro ao salvar obrigação tributária:', error);
      alert(error instanceof Error ? error.message : 'Erro ao salvar obrigação tributária');
    }
  };

  const handleEdit = (obligation: TaxObligation) => {
    setEditingObligation(obligation);
    setValue('description', obligation.description);
    setValue('amount', obligation.amount);
    setValue('dueDate', typeof obligation.dueDate === 'string' ? obligation.dueDate : obligation.dueDate.toISOString().split('T')[0]);
    setValue('taxType', obligation.taxType);
    setValue('status', obligation.status);
    setValue('referenceMonth', obligation.referenceMonth);
    setValue('notes', obligation.notes || '');
    if (obligation.complianceDate) {
      setValue('complianceDate', typeof obligation.complianceDate === 'string' ? obligation.complianceDate : obligation.complianceDate.toISOString().split('T')[0]);
    }
    setIsDialogOpen(true);
  };

  const handleDelete = async (obligation: TaxObligation) => {
    if (window.confirm('Tem certeza que deseja excluir esta obrigação tributária?')) {
      try {
        await deleteTaxObligation(obligation.id);
      } catch (error) {
        console.error('Erro ao excluir obrigação tributária:', error);
      }
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingObligation(null);
    reset();
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusBadge = (obligation: TaxObligation) => {
    if (obligation.status === 'pago') {
      return <Badge variant="default" className="bg-green-100 text-green-800"><CheckCircle2 className="w-3 h-3 mr-1" />Pago</Badge>;
    }
    
    const isOverdue = isAfter(new Date(), obligation.dueDate) && obligation.status === 'pendente';
    if (isOverdue || obligation.status === 'vencido') {
      return <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1" />Vencido</Badge>;
    }
    
    return <Badge variant="secondary"><Calendar className="w-3 h-3 mr-1" />Pendente</Badge>;
  };

  const getTaxTypeColor = (taxType: string) => {
    const colors: Record<string, string> = {
      'IRPJ': 'bg-blue-100 text-blue-800',
      'CSLL': 'bg-purple-100 text-purple-800',
      'PIS': 'bg-green-100 text-green-800',
      'COFINS': 'bg-yellow-100 text-yellow-800',
      'ICMS': 'bg-red-100 text-red-800',
      'ISS': 'bg-indigo-100 text-indigo-800',
      'INSS': 'bg-orange-100 text-orange-800',
      'FGTS': 'bg-pink-100 text-pink-800',
      'outros': 'bg-gray-100 text-gray-800',
    };
    return colors[taxType] || colors['outros'];
  };

  const totalObligations = safeTaxObligations.reduce((sum, obligation) => sum + parseAmount(obligation.amount), 0);
  const pendingObligations = safeTaxObligations.filter(o => o.status === 'pendente').length;
  const overdueObligations = safeTaxObligations.filter(o => 
    isAfter(new Date(), typeof o.dueDate === 'string' ? parseISO(o.dueDate) : o.dueDate) && o.status !== 'pago'
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Obrigações Tributárias</h1>
          <p className="text-muted-foreground">
            Gerencie impostos e obrigações fiscais da empresa
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nova Obrigação
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{editingObligation ? 'Editar' : 'Nova'} Obrigação Tributária</DialogTitle>
              <DialogDescription>
                {editingObligation ? 'Edite os dados da' : 'Adicione uma nova'} obrigação tributária.
              </DialogDescription>
            </DialogHeader>
            
            <form 
              onSubmit={handleSubmit((data) => {
                console.log('📝 Form submitted:', data);
                onSubmit(data);
              })} 
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Ex: IRPJ - 1º Trimestre"
                  />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select onValueChange={(value) => setValue('priority', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Input
                    id="description"
                    {...register('description')}
                    placeholder="Ex: IRPJ - 1º Trimestre"
                  />
                  {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="taxType">Tipo de Imposto</Label>
                  <Select onValueChange={(value) => setValue('taxType', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IRPJ">IRPJ</SelectItem>
                      <SelectItem value="CSLL">CSLL</SelectItem>
                      <SelectItem value="PIS">PIS</SelectItem>
                      <SelectItem value="COFINS">COFINS</SelectItem>
                      <SelectItem value="ICMS">ICMS</SelectItem>
                      <SelectItem value="ISS">ISS</SelectItem>
                      <SelectItem value="INSS">INSS</SelectItem>
                      <SelectItem value="FGTS">FGTS</SelectItem>
                      <SelectItem value="outros">Outros</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.taxType && <p className="text-sm text-destructive">{errors.taxType.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor (R$)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    {...register('amount', { valueAsNumber: true })}
                    placeholder="0,00"
                  />
                  {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="referenceMonth">Mês de Referência</Label>
                  <Input
                    id="referenceMonth"
                    {...register('referenceMonth')}
                    placeholder="MM/YYYY"
                  />
                  {errors.referenceMonth && <p className="text-sm text-destructive">{errors.referenceMonth.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Data de Vencimento</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    {...register('dueDate')}
                  />
                  {errors.dueDate && <p className="text-sm text-destructive">{errors.dueDate.message}</p>}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select onValueChange={(value) => setValue('status', value as any)}>
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="complianceDate">Data de Cumprimento (Opcional)</Label>
                <Input
                  id="complianceDate"
                  type="date"
                  {...register('complianceDate')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Observações</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingObligation ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total em Obrigações</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalObligations)}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingObligations}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{overdueObligations}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Obrigações */}
      <Card>
        <CardHeader>
          <CardTitle>Obrigações Tributárias</CardTitle>
          <CardDescription>
            Lista de todas as obrigações fiscais da empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safeTaxObligations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhuma obrigação tributária cadastrada.</p>
                <p>Clique em "Nova Obrigação" para começar.</p>
              </div>
            ) : (
              safeTaxObligations.map((obligation) => (
                <div key={obligation.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{obligation.description}</h3>
                      <Badge className={getTaxTypeColor(obligation.taxType)}>
                        {obligation.taxType}
                      </Badge>
                      {getStatusBadge(obligation)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {formatCurrency(obligation.amount)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {(() => {
                          let dateObj: Date | null = null;
                          if (obligation.dueDate) {
                            if (typeof obligation.dueDate === 'string') {
                              // Tenta parsear string ISO ou yyyy-MM-dd
                              try {
                                dateObj = parseISO(obligation.dueDate);
                              } catch {
                                dateObj = null;
                              }
                            } else if (obligation.dueDate instanceof Date) {
                              dateObj = obligation.dueDate;
                            }
                          }
                          return dateObj && isValid(dateObj)
                            ? <>Vence em {format(dateObj, 'dd/MM/yyyy', { locale: ptBR })}</>
                            : <span className="text-destructive">Data inválida</span>;
                        })()}
                      </span>
                      <span>Ref: {obligation.referenceMonth}</span>
                    </div>
                    {obligation.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{obligation.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(obligation)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(obligation)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
