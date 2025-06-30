import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  User, 
  Income, 
  Expense, 
  TaxObligation, 
  IncomeSource, 
  ExpenseCategory,
  FinancialSummary,
  MonthlyData,
  Barter
} from '@/types';
import api from '@/services/api';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  incomes: Income[];
  expenses: Expense[];
  taxObligations: TaxObligation[];
  incomeSources: IncomeSource[];
  expenseCategories: ExpenseCategory[];
  barters: Barter[];
  financialSummary: FinancialSummary | null;
  monthlyData: MonthlyData[];
  isLoading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_USER'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'SET_INCOMES'; payload: Income[] }
  | { type: 'ADD_INCOME'; payload: Income }
  | { type: 'UPDATE_INCOME'; payload: Income }
  | { type: 'DELETE_INCOME'; payload: string }
  | { type: 'SET_EXPENSES'; payload: Expense[] }
  | { type: 'ADD_EXPENSE'; payload: Expense }
  | { type: 'UPDATE_EXPENSE'; payload: Expense }
  | { type: 'DELETE_EXPENSE'; payload: string }
  | { type: 'SET_TAX_OBLIGATIONS'; payload: TaxObligation[] }
  | { type: 'ADD_TAX_OBLIGATION'; payload: TaxObligation }
  | { type: 'UPDATE_TAX_OBLIGATION'; payload: TaxObligation }
  | { type: 'DELETE_TAX_OBLIGATION'; payload: string }
  | { type: 'SET_INCOME_SOURCES'; payload: IncomeSource[] }
  | { type: 'SET_EXPENSE_CATEGORIES'; payload: ExpenseCategory[] }
  | { type: 'SET_FINANCIAL_SUMMARY'; payload: FinancialSummary }
  | { type: 'SET_MONTHLY_DATA'; payload: MonthlyData[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  incomes: [],
  expenses: [],
  taxObligations: [],
  incomeSources: [],
  expenseCategories: [],
  barters: [],
  financialSummary: null,
  monthlyData: [],
  isLoading: false,
  error: null
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true };
    
    case 'LOGOUT':
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        incomes: [],
        expenses: [],
        taxObligations: [],
        financialSummary: null,
        monthlyData: []
      };
    
    case 'SET_INCOMES':
      return { ...state, incomes: action.payload };
    
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
    
    case 'SET_EXPENSES':
      return { ...state, expenses: action.payload };
    
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
    
    case 'SET_TAX_OBLIGATIONS':
      return { ...state, taxObligations: action.payload };
    
    case 'ADD_TAX_OBLIGATION':
      return { ...state, taxObligations: [...state.taxObligations, action.payload] };
    
    case 'UPDATE_TAX_OBLIGATION':
      return {
        ...state,
        taxObligations: state.taxObligations.map(obligation => 
          obligation.id === action.payload.id ? action.payload : obligation
        )
      };
    
    case 'DELETE_TAX_OBLIGATION':
      return {
        ...state,
        taxObligations: state.taxObligations.filter(obligation => obligation.id !== action.payload)
      };
    
    case 'SET_INCOME_SOURCES':
      return { ...state, incomeSources: action.payload };
    
    case 'SET_EXPENSE_CATEGORIES':
      return { ...state, expenseCategories: action.payload };
    
    case 'SET_FINANCIAL_SUMMARY':
      return { ...state, financialSummary: action.payload };
    
    case 'SET_MONTHLY_DATA':
      return { ...state, monthlyData: action.payload };
    
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  loadUserData: () => Promise<void>;
}>({
  state: initialState,
  dispatch: () => null,
  loadUserData: async () => {}
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

  // Função para carregar dados do usuário autenticado
  const loadUserData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Carregar dados em paralelo
      const [
        incomesData,
        expensesData,
        taxObligationsData,
        incomeSourcesData,
        expenseCategoriesData
      ] = await Promise.all([
        api.incomes.getAll(),
        api.expenses.getAll(),
        api.taxObligations.getAll(),
        api.incomeSources.getAll(),
        api.expenseCategories.getAll()
      ]);

      dispatch({ type: 'SET_INCOMES', payload: incomesData });
      dispatch({ type: 'SET_EXPENSES', payload: expensesData });
      dispatch({ type: 'SET_TAX_OBLIGATIONS', payload: taxObligationsData });
      dispatch({ type: 'SET_INCOME_SOURCES', payload: incomeSourcesData });
      dispatch({ type: 'SET_EXPENSE_CATEGORIES', payload: expenseCategoriesData });
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Erro ao carregar dados do usuário' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Verificar se há usuário logado na inicialização
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('companyCash_token');
      if (token) {
        try {
          const user = await api.auth.getCurrentUser();
          dispatch({ type: 'SET_USER', payload: user });
          await loadUserData();
        } catch (error) {
          console.error('Token inválido:', error);
          localStorage.removeItem('companyCash_token');
          localStorage.removeItem('companyCash_user');
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, loadUserData }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
