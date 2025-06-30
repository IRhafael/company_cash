import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAppContext } from '@/contexts/AppContext';
import { User } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Calculator, Briefcase, Receipt } from 'lucide-react';

const authSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  cnpj: z.string().optional(),
  businessType: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

const businessTypes = [
  'Escritório de Contabilidade',
  'Consultoria Tributária',
  'Auditoria',
  'Assessoria Empresarial',
  'Gestão Financeira',
  'Perícia Contábil',
  'Consultoria em Gestão',
  'Outros'
];

export const AuthForm: React.FC = () => {
  const { dispatch } = useAppContext();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema)
  });

  const onSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    
    // Simular delay de autenticação
    setTimeout(() => {
      const user: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: data.name,
        email: data.email,
        companyName: data.companyName,
        cnpj: data.cnpj,
        businessType: data.businessType,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        createdAt: new Date()
      };

      dispatch({ type: 'SET_USER', payload: user });
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickLogin = (userType: 'contabilidade' | 'consultoria' | 'auditoria' | 'gestao') => {
    const userData = {
      contabilidade: {
        name: 'Carlos Silva',
        email: 'carlos@contadorsilva.com.br',
        companyName: 'Contabilidade Silva & Associados',
        cnpj: '12.345.678/0001-90',
        businessType: 'Escritório de Contabilidade'
      },
      consultoria: {
        name: 'Ana Tributária',
        email: 'ana@consultoriatrib.com.br',
        companyName: 'Consultoria Tributária Elite',
        cnpj: '98.765.432/0001-10',
        businessType: 'Consultoria Tributária'
      },
      auditoria: {
        name: 'Roberto Auditor',
        email: 'roberto@auditoriaplus.com.br',
        companyName: 'Auditoria & Perícia Contábil',
        cnpj: '11.222.333/0001-44',
        businessType: 'Auditoria'
      },
      gestao: {
        name: 'Mariana Gestão',
        email: 'mariana@gestaofinanceira.com.br',
        companyName: 'Gestão Financeira Empresarial',
        cnpj: '55.666.777/0001-88',
        businessType: 'Gestão Financeira'
      }
    };

    const data = userData[userType];
    onSubmit(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-emerald-600 to-blue-600 rounded-xl p-3">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CompanyCash</h1>
          <p className="text-gray-600">Sistema de gestão financeira empresarial</p>
        </div>

        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Acesso Rápido</TabsTrigger>
            <TabsTrigger value="form">Criar Perfil</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quick" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Demonstração Rápida</CardTitle>
                <CardDescription>
                  Explore o CompanyCash com perfis empresariais pré-configurados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14"
                  onClick={() => handleQuickLogin('contabilidade')}
                  disabled={isLoading}
                >
                  <Calculator className="h-5 w-5 mr-3 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Escritório de Contabilidade</div>
                    <div className="text-sm text-gray-500">Contabilidade Silva & Associados</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14"
                  onClick={() => handleQuickLogin('consultoria')}
                  disabled={isLoading}
                >
                  <Receipt className="h-5 w-5 mr-3 text-emerald-600" />
                  <div className="text-left">
                    <div className="font-medium">Consultoria Tributária</div>
                    <div className="text-sm text-gray-500">Consultoria Tributária Elite</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14"
                  onClick={() => handleQuickLogin('auditoria')}
                  disabled={isLoading}
                >
                  <Briefcase className="h-5 w-5 mr-3 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">Auditoria & Perícia</div>
                    <div className="text-sm text-gray-500">Auditoria & Perícia Contábil</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14"
                  onClick={() => handleQuickLogin('gestao')}
                  disabled={isLoading}
                >
                  <Building2 className="h-5 w-5 mr-3 text-amber-600" />
                  <div className="text-left">
                    <div className="font-medium">Gestão Financeira</div>
                    <div className="text-sm text-gray-500">Gestão Financeira Empresarial</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="form">
            <Card>
              <CardHeader>
                <CardTitle>Criar Sua Conta</CardTitle>
                <CardDescription>
                  Configure sua conta personalizada no CompanyCash
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      placeholder="Seu nome"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      {...register('email')}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input
                      id="companyName"
                      placeholder="Nome da sua empresa"
                      {...register('companyName')}
                    />
                    {errors.companyName && (
                      <p className="text-sm text-red-500">{errors.companyName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ (opcional)</Label>
                    <Input
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      {...register('cnpj')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Negócio (opcional)</Label>
                    <Select onValueChange={(value) => setValue('businessType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de negócio" />
                      </SelectTrigger>
                      <SelectContent>
                        {businessTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-emerald-600 to-blue-600"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Criando conta...' : 'Começar agora'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
