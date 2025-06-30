import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstallPrompt: React.FC = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Verificar se já está instalado
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
    const isInStandaloneMode = (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isInStandaloneMode);

    // Listener para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e as BeforeInstallPromptEvent);
      
      // Mostrar prompt personalizado após 30 segundos se não for iOS e não estiver instalado
      if (!isIOSDevice && !isStandalone && !isInStandaloneMode) {
        setTimeout(() => {
          setShowInstallPrompt(true);
        }, 30000);
      }
    };

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallPrompt(false);
      setInstallPromptEvent(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      const { outcome } = await installPromptEvent.userChoice;
      
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        setInstallPromptEvent(null);
      }
    }
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    // Guardar que o usuário dispensou para não mostrar novamente nesta sessão
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Não mostrar se já está instalado ou se foi dispensado nesta sessão
  if (isInstalled || sessionStorage.getItem('pwa-install-dismissed')) {
    return null;
  }

  // Prompt para iOS
  if (isIOS && showInstallPrompt) {
    return (
      <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm border-emerald-200 bg-emerald-50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-900">Instalar App</h3>
              <p className="text-sm text-emerald-700 mt-1">
                Para instalar este app no seu iPhone:
              </p>
              <ol className="text-xs text-emerald-600 mt-2 space-y-1">
                <li>1. Toque no botão de compartilhar (⬆️)</li>
                <li>2. Selecione "Adicionar à Tela de Início"</li>
              </ol>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="text-emerald-600 hover:text-emerald-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Prompt para Android/Desktop
  if (showInstallPrompt && installPromptEvent) {
    return (
      <Card className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm border-emerald-200 bg-emerald-50 shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-emerald-100 p-2">
                <Download className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-semibold text-emerald-900">Instalar App</h3>
                <p className="text-sm text-emerald-700">
                  Acesso rápido no seu dispositivo
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDismiss}
                className="text-emerald-600 hover:text-emerald-800"
              >
                Agora não
              </Button>
              <Button
                size="sm"
                onClick={handleInstallClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                Instalar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default PWAInstallPrompt;
