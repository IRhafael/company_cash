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

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

    // Se não autorizado, limpar token e redirecionar
    if (response.status === 401) {
      localStorage.removeItem('companyCash_token');
      localStorage.removeItem('companyCash_user');
      window.location.href = '/';
      throw new Error('Sessão expirada. Faça login novamente.');
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro na requisição' }));
      throw new Error(errorData.error || `Erro ${response.status}: ${response.statusText}`);
    }

    // Verificar se a resposta tem conteúdo
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    } else {
      return {} as T; // Para DELETE requests que não retornam conteúdo
    }
  } catch (error) {
    console.error(`Erro na API ${endpoint}:`, error);
    throw error;
  }
}

// Auth API
export const authAPI = {
  async login(email: string, password: string): Promise<{ user: User; token: string; message: string }> {
    const response = await apiRequest<{ user: User; token: string; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    // Salvar token e usuário no localStorage
    localStorage.setItem('companyCash_token', response.token);
    localStorage.setItem('companyCash_user', JSON.stringify(response.user));
    return response;
  },

  async register(userData: {
    name: string;
    email: string;
    password: string;
    companyName: string;
    businessType: string;
    cnpj?: string;
  }): Promise<{ user: User; token: string; message: string }> {
    const response = await apiRequest<{ user: User; token: string; message: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    
    // Salvar token e usuário no localStorage
    localStorage.setItem('companyCash_token', response.token);
    localStorage.setItem('companyCash_user', JSON.stringify(response.user));
    return response;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('companyCash_token');
    localStorage.removeItem('companyCash_user');
  },

  async getCurrentUser(): Promise<{ user: User }> {
    return apiRequest<{ user: User }>('/auth/me');
  },
};

// Income Sources API
export const incomeSourceAPI = {
  async getAll(): Promise<IncomeSource[]> {
    return apiRequest<IncomeSource[]>('/income-sources');
  },

  async create(source: {
    name: string;
    type: string;
    color: string;
    accountCode?: string;
  }): Promise<IncomeSource> {
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

// Income API
export const incomeAPI = {
  async getAll(): Promise<Income[]> {
    return apiRequest<Income[]>('/incomes');
  },

  async create(income: {
    description: string;
    amount: number;
    date: string;
    sourceId: string;
    type: 'recorrente' | 'unico';
    status: 'confirmado' | 'pendente' | 'cancelado';
    projectName?: string;
    campaignName?: string;
  }): Promise<Income> {
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

// Expense Categories API
export const expenseCategoryAPI = {
  async getAll(): Promise<ExpenseCategory[]> {
    return apiRequest<ExpenseCategory[]>('/expense-categories');
  },

  async create(category: {
    name: string;
    color: string;
    accountCode?: string;
  }): Promise<ExpenseCategory> {
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

// Expense API
export const expenseAPI = {
  async getAll(): Promise<Expense[]> {
    return apiRequest<Expense[]>('/expenses');
  },

  async create(expense: {
    description: string;
    amount: number;
    date: string;
    categoryId: string;
    type: 'fixo' | 'variavel' | 'eventual';
    paymentStatus: 'pago' | 'pendente' | 'vencido';
    projectName?: string;
  }): Promise<Expense> {
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

  async create(taxObligation: {
    title: string;
    description?: string;
    dueDate: string;
    amount?: number;
    status: 'pendente' | 'pago' | 'atrasado';
    priority: 'baixa' | 'media' | 'alta';
    category: string;
  }): Promise<TaxObligation> {
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

// Reports API (Placeholder - implementar quando backend estiver pronto)
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
      return await apiRequest<{ status: 'ok'; timestamp: string }>('/health');
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
