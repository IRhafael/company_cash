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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Calculator, Briefcase, Receipt, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Schema para registro
const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  companyName: z.string().min(2, 'Nome da empresa é obrigatório'),
  cnpj: z.string().optional(),
  businessType: z.string().optional(),
});

// Schema para login
const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

type RegisterFormData = z.infer<typeof registerSchema>;
type LoginFormData = z.infer<typeof loginSchema>;

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
  const { login, register: registerUser, state } = useAppContext();
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Form para registro
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      businessType: 'Escritório de Contabilidade'
    }
  });

  // Form para login
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema)
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    try {
      setLocalError(null);
      await login(data.email, data.password);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      setLocalError(errorMessage);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    try {
      setLocalError(null);
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        companyName: data.companyName,
        cnpj: data.cnpj,
        businessType: data.businessType || 'Escritório de Contabilidade'
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar conta';
      setLocalError(errorMessage);
    }
  };

  const handleQuickLogin = async (userType: 'contabilidade' | 'consultoria' | 'auditoria' | 'gestao') => {
    const userData = {
      contabilidade: {
        email: 'teste@teste.com', // Usuário que criamos nos testes
        password: '123456'
      },
      consultoria: {
        email: 'ana@consultoriatrib.com.br',
        password: 'demo123'
      },
      auditoria: {
        email: 'roberto@auditoriaplus.com.br',
        password: 'demo123'
      },
      gestao: {
        email: 'mariana@gestaofinanceira.com.br',
        password: 'demo123'
      }
    };

    const credentials = userData[userType];
    
    try {
      setLocalError(null);
      await login(credentials.email, credentials.password);
    } catch (error) {
      // Se o usuário não existir, vamos criar
      if (error instanceof Error && error.message.includes('Credenciais inválidas')) {
        try {
          const newUserData = {
            contabilidade: {
              name: 'Carlos Silva',
              email: 'carlos@contadorsilva.com.br',
              password: 'demo123',
              companyName: 'Contabilidade Silva & Associados',
              cnpj: '12.345.678/0001-90',
              businessType: 'Escritório de Contabilidade'
            },
            consultoria: {
              name: 'Ana Tributária',
              email: 'ana@consultoriatrib.com.br',
              password: 'demo123',
              companyName: 'Consultoria Tributária Elite',
              cnpj: '98.765.432/0001-10',
              businessType: 'Consultoria Tributária'
            },
            auditoria: {
              name: 'Roberto Auditor',
              email: 'roberto@auditoriaplus.com.br',
              password: 'demo123',
              companyName: 'Auditoria & Perícia Contábil',
              cnpj: '11.222.333/0001-44',
              businessType: 'Auditoria'
            },
            gestao: {
              name: 'Mariana Gestão',
              email: 'mariana@gestaofinanceira.com.br',
              password: 'demo123',
              companyName: 'Gestão Financeira Empresarial',
              cnpj: '55.666.777/0001-88',
              businessType: 'Gestão Financeira'
            }
          };
          
          await registerUser(newUserData[userType]);
        } catch (registerError) {
          const errorMessage = registerError instanceof Error ? registerError.message : 'Erro ao criar usuário demo';
          setLocalError(errorMessage);
        }
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
        setLocalError(errorMessage);
      }
    }
  };

  // Se há erro do contexto, usar esse, senão usar o local
  const displayError = state.error || localError;

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

        {/* Exibir erro se houver */}
        {displayError && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{displayError}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="quick">Demo</TabsTrigger>
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>
          
          {/* Tab de Acesso Rápido */}
          <TabsContent value="quick" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Demonstração</CardTitle>
                <CardDescription>
                  Explore o CompanyCash com perfis empresariais de exemplo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14"
                  onClick={() => handleQuickLogin('contabilidade')}
                  disabled={state.isLoading}
                >
                  <Calculator className="h-5 w-5 mr-3 text-blue-600" />
                  <div className="text-left">
                    <div className="font-medium">Usuário de Teste</div>
                    <div className="text-sm text-gray-500">teste@teste.com</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14"
                  onClick={() => handleQuickLogin('consultoria')}
                  disabled={state.isLoading}
                >
                  <Receipt className="h-5 w-5 mr-3 text-emerald-600" />
                  <div className="text-left">
                    <div className="font-medium">Consultoria Tributária</div>
                    <div className="text-sm text-gray-500">ana@consultoriatrib.com.br</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14"
                  onClick={() => handleQuickLogin('auditoria')}
                  disabled={state.isLoading}
                >
                  <Briefcase className="h-5 w-5 mr-3 text-purple-600" />
                  <div className="text-left">
                    <div className="font-medium">Auditoria & Perícia</div>
                    <div className="text-sm text-gray-500">roberto@auditoriaplus.com.br</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14"
                  onClick={() => handleQuickLogin('gestao')}
                  disabled={state.isLoading}
                >
                  <Building2 className="h-5 w-5 mr-3 text-amber-600" />
                  <div className="text-left">
                    <div className="font-medium">Gestão Financeira</div>
                    <div className="text-sm text-gray-500">mariana@gestaofinanceira.com.br</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Login */}
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Fazer Login</CardTitle>
                <CardDescription>
                  Entre com sua conta existente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="seu@email.com"
                      {...loginForm.register('email')}
                    />
                    {loginForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Sua senha"
                        {...loginForm.register('password')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {loginForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{loginForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-emerald-600 to-blue-600"
                    disabled={state.isLoading}
                  >
                    {state.isLoading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Tab de Registro */}
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Criar Conta</CardTitle>
                <CardDescription>
                  Configure sua conta personalizada no CompanyCash
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome completo</Label>
                    <Input
                      id="register-name"
                      placeholder="Seu nome"
                      {...registerForm.register('name')}
                    />
                    {registerForm.formState.errors.name && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      {...registerForm.register('email')}
                    />
                    {registerForm.formState.errors.email && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-password">Senha</Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        {...registerForm.register('password')}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {registerForm.formState.errors.password && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-companyName">Nome da Empresa</Label>
                    <Input
                      id="register-companyName"
                      placeholder="Nome da sua empresa"
                      {...registerForm.register('companyName')}
                    />
                    {registerForm.formState.errors.companyName && (
                      <p className="text-sm text-red-500">{registerForm.formState.errors.companyName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="register-cnpj">CNPJ (opcional)</Label>
                    <Input
                      id="register-cnpj"
                      placeholder="00.000.000/0000-00"
                      {...registerForm.register('cnpj')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Negócio</Label>
                    <Select onValueChange={(value) => registerForm.setValue('businessType', value)}>
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
                    disabled={state.isLoading}
                  >
                    {state.isLoading ? 'Criando conta...' : 'Criar Conta'}
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
