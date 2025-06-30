export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  companyName?: string;
  cnpj?: string;
  role?: 'contador' | 'admin' | 'cliente';
  createdAt: Date;
}

export interface IncomeSource {
  id: string;
  name: string;
  type: 'vendas' | 'servicos' | 'financeiro' | 'operacional' | 'extraordinario' | 'outros';
  isActive: boolean;
  color: string;
  accountCode?: string; // Código do plano de contas
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
  clientName?: string;
  invoiceNumber?: string;
  taxAmount?: number; // Impostos
  netAmount?: number; // Valor líquido
}

export interface ExpenseCategory {
  id: string;
  name: string;
  color: string;
  icon: string;
  isDefault: boolean;
  type: 'operacional' | 'administrativa' | 'tributaria' | 'financeira' | 'investimento';
  accountCode?: string; // Código do plano de contas
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  date: Date;
  categoryId: string;
  category: ExpenseCategory;
  type: 'deductible' | 'non_deductible'; // Dedutível ou não dedutível
  isRecurring: boolean;
  tags?: string[];
  receiptUrl?: string;
  supplierName?: string;
  invoiceNumber?: string;
  dueDate?: Date;
  paymentStatus: 'pago' | 'pendente' | 'vencido';
}

export interface TaxObligation {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  taxType: 'IRPJ' | 'CSLL' | 'PIS' | 'COFINS' | 'ICMS' | 'ISS' | 'INSS' | 'FGTS' | 'outros';
  status: 'pago' | 'pendente' | 'vencido';
  referenceMonth: string; // MM/YYYY
  notes?: string;
  complianceDate?: Date;
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
