import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  User, 
  Income, 
  Expense, 
  Barter, 
  IncomeSource, 
  ExpenseCategory,
  FinancialSummary,
  MonthlyData 
} from '@/types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  incomes: Income[];
  expenses: Expense[];
  barters: Barter[];
  incomeSources: IncomeSource[];
  expenseCategories: ExpenseCategory[];
  financialSummary: FinancialSummary | null;
  monthlyData: MonthlyData[];
  isLoading: boolean;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_INCOME'; payload: Income }
  | { type: 'UPDATE_INCOME'; payload: Income }
  | { type: 'DELETE_INCOME'; payload: string }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'ADD_BARTER'; payload: Barter }
  | { type: 'UPDATE_BARTER'; payload: Barter }
  | { type: 'DELETE_BARTER'; payload: string }
  | { type: 'SET_FINANCIAL_SUMMARY'; payload: FinancialSummary }
  | { type: 'SET_MONTHLY_DATA'; payload: MonthlyData[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_DATA'; payload: { incomes: Income[]; expenses: Expense[]; barters: Barter[] } };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  incomes: [],
  expenses: [],
  barters: [],
  incomeSources: [
    { id: '1', name: 'YouTube AdSense', platform: 'youtube', isActive: true, color: '#FF0000' },
    { id: '2', name: 'Twitch', platform: 'twitch', isActive: true, color: '#9146FF' },
    { id: '3', name: 'Hotmart', platform: 'hotmart', isActive: true, color: '#00D4AA' },
    { id: '4', name: 'Afiliações', platform: 'afiliados', isActive: true, color: '#F59E0B' },
    { id: '5', name: 'Patrocínios', platform: 'patrocinio', isActive: true, color: '#8B5CF6' },
    { id: '6', name: 'Cursos Próprios', platform: 'cursos', isActive: true, color: '#06B6D4' },
    { id: '7', name: 'Outros', platform: 'outros', isActive: true, color: '#6B7280' }
  ],
  expenseCategories: [
    { id: '1', name: 'Software e Assinaturas', color: '#3B82F6', icon: 'Monitor', isDefault: true },
    { id: '2', name: 'Equipamentos', color: '#10B981', icon: 'Camera', isDefault: true },
    { id: '3', name: 'Marketing e Publicidade', color: '#F59E0B', icon: 'Megaphone', isDefault: true },
    { id: '4', name: 'Educação e Cursos', color: '#8B5CF6', icon: 'GraduationCap', isDefault: true },
    { id: '5', name: 'Freelancers e Colaboradores', color: '#EF4444', icon: 'Users', isDefault: true },
    { id: '6', name: 'Transporte e Viagem', color: '#06B6D4', icon: 'Car', isDefault: true },
    { id: '7', name: 'Alimentação', color: '#84CC16', icon: 'UtensilsCrossed', isDefault: false },
    { id: '8', name: 'Outros', color: '#6B7280', icon: 'MoreHorizontal', isDefault: true }
  ],
  financialSummary: null,
  monthlyData: [],
  isLoading: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    
    case 'LOGOUT':
      return { ...state, user: null, isAuthenticated: false };
    
    case 'ADD_INCOME':
      return { ...state, incomes: [...state.incomes, action.payload] };
    
    case 'UPDATE_INCOME':
      return {
        ...state,
        incomes: state.incomes.map(income => 
          income.id === action.payload.id ? action.payload : income
        )
      };
    
    case 'DELETE_INCOME':
      return {
        ...state,
        incomes: state.incomes.filter(income => income.id !== action.payload)
      };
    
    case 'ADD_EXPENSE':
      return { ...state, expenses: [...state.expenses, action.payload] };
    
    case 'UPDATE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.map(expense => 
          expense.id === action.payload.id ? action.payload : expense
        )
      };
    
    case 'DELETE_EXPENSE':
      return {
        ...state,
        expenses: state.expenses.filter(expense => expense.id !== action.payload)
      };
    
    case 'ADD_BARTER':
      return { ...state, barters: [...state.barters, action.payload] };
    
    case 'UPDATE_BARTER':
      return {
        ...state,
        barters: state.barters.map(barter => 
          barter.id === action.payload.id ? action.payload : barter
        )
      };
    
    case 'DELETE_BARTER':
      return {
        ...state,
        barters: state.barters.filter(barter => barter.id !== action.payload)
      };
    
    case 'SET_FINANCIAL_SUMMARY':
      return { ...state, financialSummary: action.payload };
    
    case 'SET_MONTHLY_DATA':
      return { ...state, monthlyData: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'LOAD_DATA':
      return {
        ...state,
        incomes: action.payload.incomes,
        expenses: action.payload.expenses,
        barters: action.payload.barters
      };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => null
});

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext deve ser usado dentro de um AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const userData = localStorage.getItem('creatorCash_user');
    const incomesData = localStorage.getItem('creatorCash_incomes');
    const expensesData = localStorage.getItem('creatorCash_expenses');
    const bartersData = localStorage.getItem('creatorCash_barters');

    if (userData) {
      const user = JSON.parse(userData);
      dispatch({ type: 'SET_USER', payload: user });
    }

    if (incomesData || expensesData || bartersData) {
      const incomes = incomesData ? JSON.parse(incomesData) : [];
      const expenses = expensesData ? JSON.parse(expensesData) : [];
      const barters = bartersData ? JSON.parse(bartersData) : [];
      
      dispatch({ type: 'LOAD_DATA', payload: { incomes, expenses, barters } });
    }
  }, []);

  // Salvar dados no localStorage quando mudarem
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('creatorCash_user', JSON.stringify(state.user));
    }
  }, [state.user]);

  useEffect(() => {
    if (state.incomes.length > 0) {
      localStorage.setItem('creatorCash_incomes', JSON.stringify(state.incomes));
    }
  }, [state.incomes]);

  useEffect(() => {
    if (state.expenses.length > 0) {
      localStorage.setItem('creatorCash_expenses', JSON.stringify(state.expenses));
    }
  }, [state.expenses]);

  useEffect(() => {
    if (state.barters.length > 0) {
      localStorage.setItem('creatorCash_barters', JSON.stringify(state.barters));
    }
  }, [state.barters]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
