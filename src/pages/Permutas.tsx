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
import { Barter } from '@/types';
import { Plus, Edit, Trash2, Gift, Package, Wrench, Calendar, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const barterSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  estimatedValue: z.number().min(0.01, 'Valor estimado deve ser maior que zero'),
  date: z.string().min(1, 'Data é obrigatória'),
  brand: z.string().min(1, 'Marca/empresa é obrigatória'),
  type: z.enum(['produto', 'servico']),
  status: z.enum(['recebido', 'pendente', 'cancelado']).default('recebido'),
  notes: z.string().optional(),
});

type BarterFormData = z.infer<typeof barterSchema>;

export const Permutas: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { barters } = state;
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBarter, setEditingBarter] = useState<Barter | null>(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<BarterFormData>({
    resolver: zodResolver(barterSchema),
    defaultValues: {
      type: 'produto',
      status: 'recebido'
    }
  });

  const onSubmit = (data: BarterFormData) => {
    const barter: Barter = {
      id: editingBarter?.id || Math.random().toString(36).substr(2, 9),
      description: data.description,
      estimatedValue: data.estimatedValue,
      date: new Date(data.date),
      brand: data.brand,
      type: data.type,
      status: data.status,
      notes: data.notes,
    };

    if (editingBarter) {
      dispatch({ type: 'UPDATE_BARTER', payload: barter });
    } else {
      dispatch({ type: 'ADD_BARTER', payload: barter });
    }

    setIsDialogOpen(false);
    setEditingBarter(null);
    reset();
  };

  const handleEdit = (barter: Barter) => {
    setEditingBarter(barter);
    setValue('description', barter.description);
    setValue('estimatedValue', barter.estimatedValue);
    setValue('date', format(barter.date, 'yyyy-MM-dd'));
    setValue('brand', barter.brand);
    setValue('type', barter.type);
    setValue('status', barter.status);
    setValue('notes', barter.notes || '');
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta permuta?')) {
      dispatch({ type: 'DELETE_BARTER', payload: id });
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'recebido': return 'bg-green-100 text-green-800';
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'recebido': return 'Recebido';
      case 'pendente': return 'Pendente';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'produto' ? Package : Wrench;
  };

  // Calcular estatísticas
  const totalValue = barters.reduce((sum, barter) => sum + barter.estimatedValue, 0);
  const receivedValue = barters
    .filter(barter => barter.status === 'recebido')
    .reduce((sum, barter) => sum + barter.estimatedValue, 0);
  const pendingValue = barters
    .filter(barter => barter.status === 'pendente')
    .reduce((sum, barter) => sum + barter.estimatedValue, 0);
  const productCount = barters.filter(barter => barter.type === 'produto').length;
  const serviceCount = barters.filter(barter => barter.type === 'servico').length;

  return (
    <div className="p-6 sm:p-8 space-y-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Permutas</h1>
            <p className="text-gray-600 mt-1">Registre produtos e serviços recebidos como pagamento</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-indigo-600 mt-4 sm:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                Nova Permuta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  {editingBarter ? 'Editar Permuta' : 'Nova Permuta'}
                </DialogTitle>
                <DialogDescription>
                  {editingBarter ? 'Edite as informações da permuta' : 'Registre um produto ou serviço recebido como pagamento'}
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    placeholder="Ex: Smartphone iPhone 14 Pro para review"
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="estimatedValue">Valor Estimado (R$)</Label>
                    <Input
                      id="estimatedValue"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      {...register('estimatedValue', { valueAsNumber: true })}
                    />
                    {errors.estimatedValue && (
                      <p className="text-sm text-red-500">{errors.estimatedValue.message}</p>
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
                  <Label htmlFor="brand">Marca/Empresa</Label>
                  <Input
                    id="brand"
                    placeholder="Ex: Apple, Samsung, Google"
                    {...register('brand')}
                  />
                  {errors.brand && (
                    <p className="text-sm text-red-500">{errors.brand.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select onValueChange={(value) => setValue('type', value as 'produto' | 'servico')}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="produto">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2" />
                            Produto
                          </div>
                        </SelectItem>
                        <SelectItem value="servico">
                          <div className="flex items-center">
                            <Wrench className="h-4 w-4 mr-2" />
                            Serviço
                          </div>
                        </SelectItem>
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
                        <SelectItem value="recebido">Recebido</SelectItem>
                        <SelectItem value="pendente">Pendente</SelectItem>
                        <SelectItem value="cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Observações (opcional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Ex: Produto para review, retornar após 30 dias"
                    {...register('notes')}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingBarter ? 'Atualizar' : 'Adicionar'} Permuta
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingBarter(null);
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
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">
                {formatCurrency(totalValue)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {barters.length} permuta{barters.length !== 1 ? 's' : ''} registrada{barters.length !== 1 ? 's' : ''}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Recebido</CardTitle>
              <Gift className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(receivedValue)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Produtos/serviços já recebidos
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Pendente</CardTitle>
              <Calendar className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {formatCurrency(pendingValue)}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Aguardando recebimento
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos vs Serviços</CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {productCount}/{serviceCount}
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Produtos/Serviços
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de permutas */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Permutas</CardTitle>
            <CardDescription>
              Produtos e serviços recebidos como pagamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            {barters.length === 0 ? (
              <div className="text-center py-12">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma permuta registrada
                </h3>
                <p className="text-gray-600 mb-6">
                  Registre produtos e serviços que você recebe como forma de pagamento para acompanhar o valor total.
                </p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Primeira Permuta
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {barters
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((barter) => {
                    const TypeIcon = getTypeIcon(barter.type);
                    return (
                      <div key={barter.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className="p-2 bg-purple-50 rounded-lg">
                                <TypeIcon className="h-4 w-4 text-purple-600" />
                              </div>
                              <h3 className="font-medium text-gray-900">{barter.description}</h3>
                              
                              <Badge className={getStatusColor(barter.status)}>
                                {getStatusText(barter.status)}
                              </Badge>
                              
                              <Badge variant="outline">
                                {barter.type === 'produto' ? 'Produto' : 'Serviço'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>Marca: {barter.brand}</span>
                              <span>•</span>
                              <span>{format(barter.date, 'dd/MM/yyyy', { locale: ptBR })}</span>
                            </div>
                            
                            {barter.notes && (
                              <p className="text-sm text-gray-600 mt-2 bg-gray-50 rounded p-2">
                                <strong>Observações:</strong> {barter.notes}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <div className="text-lg font-bold text-purple-600">
                                {formatCurrency(barter.estimatedValue)}
                              </div>
                              <div className="text-xs text-gray-500">
                                Valor estimado
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEdit(barter)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDelete(barter.id)}
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

        {/* Dica sobre permutas */}
        <Card className="bg-purple-50 border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-900 flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              Dica sobre Permutas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-purple-800">
            <p>
              Permutas são uma forma comum de monetização para criadores de conteúdo. 
              Registre produtos e serviços recebidos com seus valores de mercado para:
            </p>
            <ul className="list-disc list-inside mt-3 space-y-1">
              <li>Controlar o valor total recebido em permutas</li>
              <li>Declarar corretamente no Imposto de Renda</li>
              <li>Avaliar o ROI de parcerias e colaborações</li>
              <li>Manter histórico de produtos testados/recebidos</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
