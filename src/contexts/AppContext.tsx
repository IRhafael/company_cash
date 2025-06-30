import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  User, 
  Income, 
  Expense, 
  TaxObligation, 
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
  taxObligations: TaxObligation[];
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
  | { type: 'ADD_TAX_OBLIGATION'; payload: TaxObligation }
  | { type: 'UPDATE_TAX_OBLIGATION'; payload: TaxObligation }
  | { type: 'DELETE_TAX_OBLIGATION'; payload: string }
  | { type: 'SET_FINANCIAL_SUMMARY'; payload: FinancialSummary }
  | { type: 'SET_MONTHLY_DATA'; payload: MonthlyData[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_DATA'; payload: { incomes: Income[]; expenses: Expense[]; taxObligations: TaxObligation[] } };

const initialState: AppState = {
  user: null,
  isAuthenticated: false,
  incomes: [],
  expenses: [],
  taxObligations: [],
  incomeSources: [
    { id: '1', name: 'Vendas de Produtos', type: 'vendas', isActive: true, color: '#10B981', accountCode: '3.1.1' },
    { id: '2', name: 'Prestação de Serviços', type: 'servicos', isActive: true, color: '#3B82F6', accountCode: '3.1.2' },
    { id: '3', name: 'Receitas Financeiras', type: 'financeiro', isActive: true, color: '#F59E0B', accountCode: '3.2.1' },
    { id: '4', name: 'Outras Receitas Operacionais', type: 'operacional', isActive: true, color: '#8B5CF6', accountCode: '3.1.9' },
    { id: '5', name: 'Receitas Extraordinárias', type: 'extraordinario', isActive: true, color: '#EF4444', accountCode: '3.3.1' },
    { id: '6', name: 'Outros', type: 'outros', isActive: true, color: '#6B7280', accountCode: '3.9.9' }
  ],
  expenseCategories: [
    { id: '1', name: 'Salários e Encargos', color: '#3B82F6', icon: 'Users', isDefault: true, type: 'operacional', accountCode: '4.1.1' },
    { id: '2', name: 'Aluguel e Condomínio', color: '#10B981', icon: 'Building', isDefault: true, type: 'operacional', accountCode: '4.1.2' },
    { id: '3', name: 'Serviços de Terceiros', color: '#F59E0B', icon: 'Handshake', isDefault: true, type: 'operacional', accountCode: '4.1.3' },
    { id: '4', name: 'Material de Escritório', color: '#8B5CF6', icon: 'FileText', isDefault: true, type: 'administrativa', accountCode: '4.2.1' },
    { id: '5', name: 'Despesas Tributárias', color: '#EF4444', icon: 'Receipt', isDefault: true, type: 'tributaria', accountCode: '4.3.1' },
    { id: '6', name: 'Despesas Financeiras', color: '#06B6D4', icon: 'CreditCard', isDefault: true, type: 'financeira', accountCode: '4.4.1' },
    { id: '7', name: 'Investimentos', color: '#84CC16', icon: 'TrendingUp', isDefault: false, type: 'investimento', accountCode: '4.5.1' },
    { id: '8', name: 'Outros', color: '#6B7280', icon: 'MoreHorizontal', isDefault: true, type: 'operacional', accountCode: '4.9.9' }
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
        taxObligations: action.payload.taxObligations
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
    const userData = localStorage.getItem('companyCash_user');
    const incomesData = localStorage.getItem('companyCash_incomes');
    const expensesData = localStorage.getItem('companyCash_expenses');
    const taxObligationsData = localStorage.getItem('companyCash_taxObligations');

    if (userData) {
      const user = JSON.parse(userData);
      dispatch({ type: 'SET_USER', payload: user });
    }

    if (incomesData || expensesData || taxObligationsData) {
      const incomes = incomesData ? JSON.parse(incomesData) : [];
      const expenses = expensesData ? JSON.parse(expensesData) : [];
      const taxObligations = taxObligationsData ? JSON.parse(taxObligationsData) : [];
      
      dispatch({ type: 'LOAD_DATA', payload: { incomes, expenses, taxObligations } });
    }
  }, []);

  // Salvar dados no localStorage quando mudarem
  useEffect(() => {
    if (state.user) {
      localStorage.setItem('companyCash_user', JSON.stringify(state.user));
    }
  }, [state.user]);

  useEffect(() => {
    if (state.incomes.length > 0) {
      localStorage.setItem('companyCash_incomes', JSON.stringify(state.incomes));
    }
  }, [state.incomes]);

  useEffect(() => {
    if (state.expenses.length > 0) {
      localStorage.setItem('companyCash_expenses', JSON.stringify(state.expenses));
    }
  }, [state.expenses]);

  useEffect(() => {
    if (state.taxObligations.length > 0) {
      localStorage.setItem('companyCash_taxObligations', JSON.stringify(state.taxObligations));
    }
  }, [state.taxObligations]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
