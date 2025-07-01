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
  const requestBody = options.body ? JSON.parse(options.body as string) : null;
  
  console.log('📤 Request:', {
    url: `${API_BASE_URL}${endpoint}`,
    method: options.method || 'GET',
    headers: options.headers,
    body: requestBody
  });

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
    const responseData = await response.json().catch(() => ({
      error: 'Erro ao parsear resposta JSON'
    }));

    console.log('📥 Response:', {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseData
    });

    if (!response.ok) {
      console.error('❌ Erro HTTP:', {
        status: response.status,
        statusText: response.statusText,
        data: responseData,
        request: {
          method: options.method,
          endpoint,
          body: requestBody
        }
      });

      throw new Error(
        responseData?.message || 
        responseData?.error || 
        `Erro ${response.status}: ${response.statusText}`
      );
    }

    return responseData as T;
  } catch (error) {
    console.error('💥 Erro completo:', {
      tipo: error instanceof Error ? error.constructor.name : 'Unknown',
      mensagem: error instanceof Error ? error.message : String(error),
      request: {
        endpoint,
        method: options.method,
        body: requestBody
      },
      stack: error instanceof Error ? error.stack : undefined
    });
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
    is_active?: boolean;
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
    taxType: string;
    referenceMonth: string;
    notes?: string;
    complianceDate?: string;
  }): Promise<TaxObligation> {
    console.log('🚀 Iniciando criação de obrigação tributária:', taxObligation);

    // Validação dos campos obrigatórios
    const camposObrigatorios = ['title', 'dueDate', 'status', 'priority', 'category'];
    const camposFaltando = camposObrigatorios.filter(campo => !taxObligation[campo]);
    
    if (camposFaltando.length > 0) {
      const erro = `Campos obrigatórios faltando: ${camposFaltando.join(', ')}`;
      console.error('❌ Erro de validação:', erro);
      throw new Error(erro);
    }

    try {
      console.log('📡 Enviando requisição para a API...');
      
      const response = await apiRequest<TaxObligation>('/tax-obligations', {
        method: 'POST',
        body: JSON.stringify(taxObligation),
      });
      
      console.log('✅ Obrigação tributária criada com sucesso:', response);
      return response;
    } catch (error) {
      console.error('💥 Erro ao criar obrigação tributária:', {
        erro: error instanceof Error ? error.message : String(error),
        dados: taxObligation
      });
      throw error;
    }
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
