import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Receipt,
  BarChart3,
  Menu,
  LogOut,
  Building2
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Receitas', href: '/receitas', icon: TrendingUp },
  { name: 'Despesas', href: '/despesas', icon: TrendingDown },
  { name: 'Obrigações', href: '/obrigacoes-tributarias', icon: Receipt },
  { name: 'Relatórios', href: '/relatorios', icon: BarChart3 },
];

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { state, dispatch } = useAppContext();
  const { user } = state;
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se é mobile
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
    localStorage.clear();
  };

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  if (isMobile) {
    return (
      <div className="min-h-screen bg-gray-50 pb-16">
        {/* Header Mobile */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64 p-0">
                  <MobileSidebar 
                    isActive={isActive} 
                    onNavigate={() => setSidebarOpen(false)}
                    onLogout={handleLogout}
                  />
                </SheetContent>
              </Sheet>
              
              <div className="flex items-center space-x-2">
                <Building2 className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-gray-900">CompanyCash</span>
              </div>
            </div>

            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </header>

        {/* Conteúdo Principal Mobile */}
        <main className="px-4 py-4">
          {children}
        </main>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="grid grid-cols-5 py-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 text-xs transition-colors",
                    active
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-600 hover:text-blue-600"
                  )}
                >
                  <Icon className="h-5 w-5 mb-1" />
                  <span className="truncate font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    );
  }

  // Layout Desktop (mantém o original)
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar Desktop */}
      <nav className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex items-center space-x-2 p-6 border-b">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="font-bold text-gray-900 text-xl">CompanyCash</span>
        </div>
        
        <div className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  isActive(item.href)
                    ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user?.avatar} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.companyName || 'Administrador'}
              </p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="w-full justify-start"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </nav>

      {/* Conteúdo Desktop */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

const MobileSidebar: React.FC<{
  isActive: (href: string) => boolean;
  onNavigate: () => void;
  onLogout: () => void;
}> = ({ isActive, onNavigate, onLogout }) => {
  const { state } = useAppContext();
  const { user } = state;

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          <span className="font-bold text-gray-900 text-xl">CompanyCash</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors",
                isActive(item.href)
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <Icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 mb-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.companyName || 'Administrador'}
            </p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={onLogout}
          className="w-full justify-start"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};