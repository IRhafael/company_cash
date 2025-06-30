import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useAppContext } from '@/contexts/AppContext';
import { AuthForm } from '@/components/auth/AuthForm';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Receitas } from '@/pages/Receitas';
import { Despesas } from '@/pages/Despesas';
import { Permutas } from '@/pages/Permutas';
import { Relatorios } from '@/pages/Relatorios';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { useSampleData } from '@/hooks/useSampleData';
import { Toaster } from 'sonner';

const AppContent: React.FC = () => {
  const { state } = useAppContext();
  const { isAuthenticated } = state;
  
  // Carregar dados de exemplo quando autenticado
  useSampleData();

  if (!isAuthenticated) {
    return <AuthForm />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/receitas" element={<Receitas />} />
        <Route path="/despesas" element={<Despesas />} />
        <Route path="/permutas" element={<Permutas />} />
        <Route path="/relatorios" element={<Relatorios />} />
      </Routes>
    </Layout>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Router>
          <AppContent />
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#333',
                border: '1px solid #e5e7eb',
              },
            }}
          />
        </Router>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
