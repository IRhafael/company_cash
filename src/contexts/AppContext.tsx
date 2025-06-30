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
  | { type: 'ADD_INCOME_SOURCE'; payload: IncomeSource }
  | { type: 'UPDATE_INCOME_SOURCE'; payload: IncomeSource }
  | { type: 'DELETE_INCOME_SOURCE'; payload: string }
  | { type: 'SET_EXPENSE_CATEGORIES'; payload: ExpenseCategory[] }
  | { type: 'ADD_EXPENSE_CATEGORY'; payload: ExpenseCategory }
  | { type: 'UPDATE_EXPENSE_CATEGORY'; payload: ExpenseCategory }
  | { type: 'DELETE_EXPENSE_CATEGORY'; payload: string }
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
        incomeSources: [],
        expenseCategories: [],
        financialSummary: null,
        monthlyData: []
      };
    
    // Income actions
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
    
    // Expense actions
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
    
    // Tax Obligation actions
    case 'SET_TAX_OBLIGATIONS':
      return { ...state, taxObligations: Array.isArray(action.payload) ? action.payload : [] };
    
    case 'ADD_TAX_OBLIGATION':
      return { ...state, taxObligations: [...(Array.isArray(state.taxObligations) ? state.taxObligations : []), action.payload] };
    
    case 'UPDATE_TAX_OBLIGATION':
      return {
        ...state,
        taxObligations: (Array.isArray(state.taxObligations) ? state.taxObligations : []).map(obligation => 
          obligation.id === action.payload.id ? action.payload : obligation
        )
      };
    
    case 'DELETE_TAX_OBLIGATION':
      return {
        ...state,
        taxObligations: (Array.isArray(state.taxObligations) ? state.taxObligations : []).filter(obligation => obligation.id !== action.payload)
      };
    
    // Income Source actions
    case 'SET_INCOME_SOURCES':
      return { ...state, incomeSources: action.payload };
    
    case 'ADD_INCOME_SOURCE':
      return { ...state, incomeSources: [...state.incomeSources, action.payload] };
    
    case 'UPDATE_INCOME_SOURCE':
      return {
        ...state,
        incomeSources: state.incomeSources.map(source => 
          source.id === action.payload.id ? action.payload : source
        )
      };
    
    case 'DELETE_INCOME_SOURCE':
      return {
        ...state,
        incomeSources: state.incomeSources.filter(source => source.id !== action.payload)
      };
    
    // Expense Category actions
    case 'SET_EXPENSE_CATEGORIES':
      return { ...state, expenseCategories: action.payload };
    
    case 'ADD_EXPENSE_CATEGORY':
      return { ...state, expenseCategories: [...state.expenseCategories, action.payload] };
    
    case 'UPDATE_EXPENSE_CATEGORY':
      return {
        ...state,
        expenseCategories: state.expenseCategories.map(category => 
          category.id === action.payload.id ? action.payload : category
        )
      };
    
    case 'DELETE_EXPENSE_CATEGORY':
      return {
        ...state,
        expenseCategories: state.expenseCategories.filter(category => category.id !== action.payload)
      };
    
    // Other actions
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

// Context com métodos para operações CRUD
interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  
  // Auth methods
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => Promise<void>;
  
  // Data loading methods
  loadUserData: () => Promise<void>;
  
  // Income methods
  createIncome: (incomeData: any) => Promise<void>;
  updateIncome: (id: string, incomeData: any) => Promise<void>;
  deleteIncome: (id: string) => Promise<void>;
  
  // Expense methods
  createExpense: (expenseData: any) => Promise<void>;
  updateExpense: (id: string, expenseData: any) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  
  // Income Source methods
  createIncomeSource: (sourceData: any) => Promise<void>;
  updateIncomeSource: (id: string, sourceData: any) => Promise<void>;
  deleteIncomeSource: (id: string) => Promise<void>;
  
  // Expense Category methods
  createExpenseCategory: (categoryData: any) => Promise<void>;
  updateExpenseCategory: (id: string, categoryData: any) => Promise<void>;
  deleteExpenseCategory: (id: string) => Promise<void>;
  
  // Tax Obligation methods
  createTaxObligation: (taxData: any) => Promise<void>;
  updateTaxObligation: (id: string, taxData: any) => Promise<void>;
  deleteTaxObligation: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => null,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  loadUserData: async () => {},
  createIncome: async () => {},
  updateIncome: async () => {},
  deleteIncome: async () => {},
  createExpense: async () => {},
  updateExpense: async () => {},
  deleteExpense: async () => {},
  createIncomeSource: async () => {},
  updateIncomeSource: async () => {},
  deleteIncomeSource: async () => {},
  createExpenseCategory: async () => {},
  updateExpenseCategory: async () => {},
  deleteExpenseCategory: async () => {},
  createTaxObligation: async () => {},
  updateTaxObligation: async () => {},
  deleteTaxObligation: async () => {},
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

  // Auth methods
  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await api.auth.login(email, password);
      dispatch({ type: 'SET_USER', payload: response.user });
      
      // Carregar dados do usuário após login
      await loadUserData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData: any) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      const response = await api.auth.register(userData);
      dispatch({ type: 'SET_USER', payload: response.user });
      
      // Carregar dados do usuário após registro
      await loadUserData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao registrar usuário';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await api.auth.logout();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Fazer logout local mesmo se der erro na API
      dispatch({ type: 'LOGOUT' });
    }
  };

  // Função para carregar dados do usuário autenticado
  const loadUserData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });
      
      // Carregar dados em paralelo
      const [
        incomeSourcesData,
        expenseCategoriesData,
        incomesData,
        expensesData,
        taxObligationsData
      ] = await Promise.all([
        api.incomeSources.getAll(),
        api.expenseCategories.getAll(),
        api.incomes.getAll(),
        api.expenses.getAll(),
        api.taxObligations.getAll()
      ]);

      dispatch({ type: 'SET_INCOME_SOURCES', payload: incomeSourcesData });
      dispatch({ type: 'SET_EXPENSE_CATEGORIES', payload: expenseCategoriesData });
      dispatch({ type: 'SET_INCOMES', payload: incomesData });
      dispatch({ type: 'SET_EXPENSES', payload: expensesData });
      dispatch({ type: 'SET_TAX_OBLIGATIONS', payload: taxObligationsData });
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erro ao carregar dados do usuário';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  // Income CRUD methods
  const createIncome = async (incomeData: any) => {
    try {
      const newIncome = await api.incomes.create(incomeData);
      dispatch({ type: 'ADD_INCOME', payload: newIncome });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar receita';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updateIncome = async (id: string, incomeData: any) => {
    try {
      const updatedIncome = await api.incomes.update(id, incomeData);
      dispatch({ type: 'UPDATE_INCOME', payload: updatedIncome });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar receita';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const deleteIncome = async (id: string) => {
    try {
      await api.incomes.delete(id);
      dispatch({ type: 'DELETE_INCOME', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir receita';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Expense CRUD methods
  const createExpense = async (expenseData: any) => {
    try {
      const newExpense = await api.expenses.create(expenseData);
      dispatch({ type: 'ADD_EXPENSE', payload: newExpense });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar despesa';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updateExpense = async (id: string, expenseData: any) => {
    try {
      const updatedExpense = await api.expenses.update(id, expenseData);
      dispatch({ type: 'UPDATE_EXPENSE', payload: updatedExpense });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar despesa';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await api.expenses.delete(id);
      dispatch({ type: 'DELETE_EXPENSE', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir despesa';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Income Source CRUD methods
  const createIncomeSource = async (sourceData: any) => {
    try {
      const newSource = await api.incomeSources.create(sourceData);
      dispatch({ type: 'ADD_INCOME_SOURCE', payload: newSource });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar fonte de receita';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updateIncomeSource = async (id: string, sourceData: any) => {
    try {
      const updatedSource = await api.incomeSources.update(id, sourceData);
      dispatch({ type: 'UPDATE_INCOME_SOURCE', payload: updatedSource });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar fonte de receita';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const deleteIncomeSource = async (id: string) => {
    try {
      await api.incomeSources.delete(id);
      dispatch({ type: 'DELETE_INCOME_SOURCE', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir fonte de receita';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Expense Category CRUD methods
  const createExpenseCategory = async (categoryData: any) => {
    try {
      const newCategory = await api.expenseCategories.create(categoryData);
      dispatch({ type: 'ADD_EXPENSE_CATEGORY', payload: newCategory });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar categoria de despesa';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updateExpenseCategory = async (id: string, categoryData: any) => {
    try {
      const updatedCategory = await api.expenseCategories.update(id, categoryData);
      dispatch({ type: 'UPDATE_EXPENSE_CATEGORY', payload: updatedCategory });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar categoria de despesa';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const deleteExpenseCategory = async (id: string) => {
    try {
      await api.expenseCategories.delete(id);
      dispatch({ type: 'DELETE_EXPENSE_CATEGORY', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir categoria de despesa';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Tax Obligation CRUD methods
  const createTaxObligation = async (taxData: any) => {
    try {
      const newTaxObligation = await api.taxObligations.create(taxData);
      dispatch({ type: 'ADD_TAX_OBLIGATION', payload: newTaxObligation });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao criar obrigação fiscal';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const updateTaxObligation = async (id: string, taxData: any) => {
    try {
      const updatedTaxObligation = await api.taxObligations.update(id, taxData);
      dispatch({ type: 'UPDATE_TAX_OBLIGATION', payload: updatedTaxObligation });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao atualizar obrigação fiscal';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  const deleteTaxObligation = async (id: string) => {
    try {
      await api.taxObligations.delete(id);
      dispatch({ type: 'DELETE_TAX_OBLIGATION', payload: id });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao excluir obrigação fiscal';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Verificar se há usuário logado na inicialização
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('companyCash_token');
      if (token) {
        try {
          const response = await api.auth.getCurrentUser();
          dispatch({ type: 'SET_USER', payload: response.user });
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

  const contextValue: AppContextType = {
    state,
    dispatch,
    login,
    register,
    logout,
    loadUserData,
    createIncome,
    updateIncome,
    deleteIncome,
    createExpense,
    updateExpense,
    deleteExpense,
    createIncomeSource,
    updateIncomeSource,
    deleteIncomeSource,
    createExpenseCategory,
    updateExpenseCategory,
    deleteExpenseCategory,
    createTaxObligation,
    updateTaxObligation,
    deleteTaxObligation,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};