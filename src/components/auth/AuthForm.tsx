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
import { Youtube, Twitch, Monitor, Users } from 'lucide-react';

const authSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  channelName: z.string().optional(),
  niche: z.string().optional(),
});

type AuthFormData = z.infer<typeof authSchema>;

const niches = [
  'Gaming',
  'Tecnologia',
  'Lifestyle',
  'Educação',
  'Entretenimento',
  'Negócios',
  'Saúde e Fitness',
  'Culinária',
  'Viagem',
  'Arte e Design',
  'Música',
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
        channelName: data.channelName,
        niche: data.niche,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name}`,
        createdAt: new Date()
      };

      dispatch({ type: 'SET_USER', payload: user });
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickLogin = (userType: 'youtuber' | 'streamer' | 'course_creator' | 'influencer') => {
    const userData = {
      youtuber: {
        name: 'Lucas Silva',
        email: 'lucas@youtube.com',
        channelName: 'TechCriativo',
        niche: 'Tecnologia'
      },
      streamer: {
        name: 'Ana Costa',
        email: 'ana@twitch.com',
        channelName: 'AnaGames',
        niche: 'Gaming'
      },
      course_creator: {
        name: 'Carlos Eduarda',
        email: 'carlos@hotmart.com',
        channelName: 'Curso de Marketing',
        niche: 'Negócios'
      },
      influencer: {
        name: 'Maria Santos',
        email: 'maria@instagram.com',
        channelName: '@mariasantos',
        niche: 'Lifestyle'
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
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-3">
              <Monitor className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">CreatorCash</h1>
          <p className="text-gray-600">Gestão financeira simplificada para criadores</p>
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
                  Explore o CreatorCash com perfis pré-configurados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14"
                  onClick={() => handleQuickLogin('youtuber')}
                  disabled={isLoading}
                >
                  <Youtube className="h-5 w-5 mr-3 text-red-500" />
                  <div className="text-left">
                    <div className="font-medium">YouTuber Tech</div>
                    <div className="text-sm text-gray-500">Canal de tecnologia</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14"
                  onClick={() => handleQuickLogin('streamer')}
                  disabled={isLoading}
                >
                  <Twitch className="h-5 w-5 mr-3 text-purple-500" />
                  <div className="text-left">
                    <div className="font-medium">Streamer Gaming</div>
                    <div className="text-sm text-gray-500">Stream de games</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14"
                  onClick={() => handleQuickLogin('course_creator')}
                  disabled={isLoading}
                >
                  <Monitor className="h-5 w-5 mr-3 text-green-500" />
                  <div className="text-left">
                    <div className="font-medium">Criador de Cursos</div>
                    <div className="text-sm text-gray-500">Cursos online</div>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14"
                  onClick={() => handleQuickLogin('influencer')}
                  disabled={isLoading}
                >
                  <Users className="h-5 w-5 mr-3 text-pink-500" />
                  <div className="text-left">
                    <div className="font-medium">Influenciadora</div>
                    <div className="text-sm text-gray-500">Conteúdo lifestyle</div>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="form">
            <Card>
              <CardHeader>
                <CardTitle>Criar Seu Perfil</CardTitle>
                <CardDescription>
                  Configure sua conta personalizada no CreatorCash
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
                    <Label htmlFor="channelName">Nome do Canal/Perfil (opcional)</Label>
                    <Input
                      id="channelName"
                      placeholder="@seucanal ou Seu Canal"
                      {...register('channelName')}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Nicho de Conteúdo (opcional)</Label>
                    <Select onValueChange={(value) => setValue('niche', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione seu nicho" />
                      </SelectTrigger>
                      <SelectContent>
                        {niches.map((niche) => (
                          <SelectItem key={niche} value={niche}>
                            {niche}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
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
