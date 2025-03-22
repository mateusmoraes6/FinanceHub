export type TransactionType = 'income' | 'expense';

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