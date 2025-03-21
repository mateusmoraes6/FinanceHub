export type TransactionType = 'income' | 'expense' | 'investment';

export interface Transaction {
  id: string;
  amount: number;
  type: TransactionType;
  category: string;
  description: string;
  date: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
}

export interface BalanceSummary {
  currentBalance: number;
  income: number;
  expenses: number;
  investments: number;
}

export type GoalTimeframe = 'short' | 'medium' | 'long';

export interface FinancialGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  endDate: string;
  timeframe: GoalTimeframe;
  description?: string;
  color?: string;
}

export interface BudgetItem {
  id: string;
  category: string;
  budgetAmount: number;
  spentAmount: number;
  month: string; // formato: MM/YYYY
  year: string;
}

export interface Budget {
  id: string;
  name: string;
  month: string; // formato: MM/YYYY
  year: string;
  totalBudget: number;
  items: BudgetItem[];
}

export type InvestmentType = 'stock' | 'bond' | 'real_estate' | 'crypto' | 'other';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface Investment {
  id: string;
  name: string;
  type: InvestmentType;
  amount: number;
  currentValue: number;
  purchaseDate: string;
  riskLevel: RiskLevel;
  interestRate?: number; // Taxa de juros anual (para renda fixa)
  notes?: string;
}

export interface InvestmentPerformance {
  totalInvested: number;
  currentValue: number;
  absoluteReturn: number;
  percentageReturn: number;
  inflation: number;
  realReturn: number;
}