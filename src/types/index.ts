export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  channelName?: string;
  niche?: string;
  createdAt: Date;
}

export interface IncomeSource {
  id: string;
  name: string;
  platform: 'youtube' | 'twitch' | 'hotmart' | 'afiliados' | 'patrocinio' | 'cursos' | 'outros';
  isActive: boolean;
  color: string;
}

export interface Income {
  id: string;
  description: string;
  amount: number;
  date: Date;
  sourceId: string;
  source: IncomeSource;
  type: 'recorrente' | 'unico';
  status: 'confirmado' | 'pendente' | 'cancelado';
  projectName?: string;
  campaignName?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  categoryId: string;
  category: ExpenseCategory;
  type: 'pessoal' | 'profissional';
  isRecurring: boolean;
  tags?: string[];
  receiptUrl?: string;
  projectName?: string;
}

export interface Barter {
  id: string;
  description: string;
  estimatedValue: number;
  date: Date;
  brand: string;
  type: 'produto' | 'servico';
  status: 'recebido' | 'pendente' | 'cancelado';
  notes?: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  topIncomeSource: IncomeSource;
  topExpenseCategory: ExpenseCategory;
  growth: {
    income: number;
    expenses: number;
    profit: number;
  };
}

export interface Period {
  start: Date;
  end: Date;
  label: string;
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  profit: number;
}

export interface ReportMetrics {
  costPerProject: number;
  roiBySource: Record<string, number>;
  personalVsProfessional: {
    personal: number;
    professional: number;
  };
  topProjects: Array<{
    name: string;
    revenue: number;
    cost: number;
    roi: number;
  }>;
}
