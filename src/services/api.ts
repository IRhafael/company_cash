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

// Base URL do backend - ajuste conforme necessário
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Utility para fazer requests HTTP
async function apiRequest<T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('companyCash_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || 'Erro na requisição');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await apiRequest<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Salvar token no localStorage
    localStorage.setItem('companyCash_token', response.token);
    return response;
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    companyName: string;
    cnpj?: string;
  }): Promise<{ user: User; token: string }> {
    const response = await apiRequest<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    localStorage.setItem('companyCash_token', response.token);
    return response;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('companyCash_token');
    localStorage.removeItem('companyCash_user');
  },

  async getCurrentUser(): Promise<User> {
    return apiRequest<User>('/auth/me');
  },
};

// Income API
export const incomeAPI = {
  async getAll(): Promise<Income[]> {
    return apiRequest<Income[]>('/incomes');
  },

  async create(income: Omit<Income, 'id' | 'createdAt' | 'updatedAt'>): Promise<Income> {
    return apiRequest<Income>('/incomes', {
      method: 'POST',
      body: JSON.stringify(income),
    });
  },

  async update(id: string, income: Partial<Income>): Promise<Income> {
    return apiRequest<Income>(`/incomes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(income),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/incomes/${id}`, {
      method: 'DELETE',
    });
  },
};

// Expense API
export const expenseAPI = {
  async getAll(): Promise<Expense[]> {
    return apiRequest<Expense[]>('/expenses');
  },

  async create(expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Promise<Expense> {
    return apiRequest<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  },

  async update(id: string, expense: Partial<Expense>): Promise<Expense> {
    return apiRequest<Expense>(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Tax Obligation API
export const taxObligationAPI = {
  async getAll(): Promise<TaxObligation[]> {
    return apiRequest<TaxObligation[]>('/tax-obligations');
  },

  async create(taxObligation: Omit<TaxObligation, 'id' | 'createdAt' | 'updatedAt'>): Promise<TaxObligation> {
    return apiRequest<TaxObligation>('/tax-obligations', {
      method: 'POST',
      body: JSON.stringify(taxObligation),
    });
  },

  async update(id: string, taxObligation: Partial<TaxObligation>): Promise<TaxObligation> {
    return apiRequest<TaxObligation>(`/tax-obligations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taxObligation),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/tax-obligations/${id}`, {
      method: 'DELETE',
    });
  },
};

// Income Sources API
export const incomeSourceAPI = {
  async getAll(): Promise<IncomeSource[]> {
    return apiRequest<IncomeSource[]>('/income-sources');
  },

  async create(source: Omit<IncomeSource, 'id'>): Promise<IncomeSource> {
    return apiRequest<IncomeSource>('/income-sources', {
      method: 'POST',
      body: JSON.stringify(source),
    });
  },

  async update(id: string, source: Partial<IncomeSource>): Promise<IncomeSource> {
    return apiRequest<IncomeSource>(`/income-sources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(source),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/income-sources/${id}`, {
      method: 'DELETE',
    });
  },
};

// Expense Categories API
export const expenseCategoryAPI = {
  async getAll(): Promise<ExpenseCategory[]> {
    return apiRequest<ExpenseCategory[]>('/expense-categories');
  },

  async create(category: Omit<ExpenseCategory, 'id'>): Promise<ExpenseCategory> {
    return apiRequest<ExpenseCategory>('/expense-categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  async update(id: string, category: Partial<ExpenseCategory>): Promise<ExpenseCategory> {
    return apiRequest<ExpenseCategory>(`/expense-categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  async delete(id: string): Promise<void> {
    return apiRequest<void>(`/expense-categories/${id}`, {
      method: 'DELETE',
    });
  },
};

// Reports API
export const reportsAPI = {
  async getFinancialSummary(
    startDate?: string, 
    endDate?: string
  ): Promise<FinancialSummary> {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    return apiRequest<FinancialSummary>(
      `/reports/financial-summary?${params.toString()}`
    );
  },

  async getMonthlyData(year?: number): Promise<MonthlyData[]> {
    const params = year ? `?year=${year}` : '';
    return apiRequest<MonthlyData[]>(`/reports/monthly-data${params}`);
  },

  async exportData(
    format: 'pdf' | 'excel',
    type: 'incomes' | 'expenses' | 'summary',
    startDate?: string,
    endDate?: string
  ): Promise<Blob> {
    const params = new URLSearchParams({
      format,
      type,
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    });

    const response = await fetch(
      `${API_BASE_URL}/reports/export?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('companyCash_token')}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Erro ao exportar dados');
    }

    return response.blob();
  },
};

// Health Check
export const healthAPI = {
  async check(): Promise<{ status: 'ok' | 'error'; message?: string }> {
    try {
      return await apiRequest<{ status: 'ok' }>('/health');
    } catch (error) {
      return { 
        status: 'error', 
        message: error instanceof Error ? error.message : 'Erro desconhecido' 
      };
    }
  },
};

// Default export com todas as APIs
export default {
  auth: authAPI,
  incomes: incomeAPI,
  expenses: expenseAPI,
  taxObligations: taxObligationAPI,
  incomeSources: incomeSourceAPI,
  expenseCategories: expenseCategoryAPI,
  reports: reportsAPI,
  health: healthAPI,
};
