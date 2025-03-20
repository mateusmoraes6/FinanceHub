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