import React, { useState } from 'react';
import { LayoutDashboard, PlusCircle } from 'lucide-react';
import BalanceCard from './components/BalanceCard';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import FinancialGoalList from './components/FinancialGoalList';
import PredictiveAnalysis from './components/PredictiveAnalysis';
import BudgetPlanner from './components/BudgetPlanner';
import type { Transaction, Category, FinancialGoal, Budget } from './types/finance';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [transactions, setTransactions] = useState<Transaction[]>([
    {
      id: '1',
      amount: 5000,
      type: 'income',
      category: 'Salário',
      description: 'Salário Mensal',
      date: '2024-03-01'
    }
  ]);

  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Salário', type: 'income', color: '#00E676' },
    { id: '2', name: 'Alimentação', type: 'expense', color: '#FF5252' },
    { id: '3', name: 'Lazer', type: 'expense', color: '#7B61FF' }
  ]);

  const [financialGoals, setFinancialGoals] = useState<FinancialGoal[]>([
    {
      id: '1',
      title: 'Reserva de emergência',
      targetAmount: 20000,
      currentAmount: 5000,
      category: 'Economia',
      endDate: '2024-12-31',
      timeframe: 'medium',
      description: 'Fundo para emergências equivalente a 6 meses de despesas',
      color: '#7B61FF'
    }
  ]);

  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: '1',
      name: 'Orçamento Mensal',
      month: '3/2024',
      year: '2024',
      totalBudget: 3000,
      items: [
        {
          id: '1',
          category: 'Alimentação',
          budgetAmount: 1500,
          spentAmount: 0,
          month: '3/2024',
          year: '2024'
        },
        {
          id: '2',
          category: 'Lazer',
          budgetAmount: 1500,
          spentAmount: 0,
          month: '3/2024',
          year: '2024'
        }
      ]
    }
  ]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transaction = {
      ...newTransaction,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions([transaction, ...transactions]);
    setShowForm(false);
  };

  const handleUpdateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(transactions.map(t => 
      t.id === updatedTransaction.id ? updatedTransaction : t
    ));
    setEditingTransaction(undefined);
    setShowForm(false);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleAddCategory = (newCategory: Omit<Category, 'id'>) => {
    const category = {
      ...newCategory,
      id: Math.random().toString(36).substr(2, 9)
    };
    setCategories([...categories, category]);
  };

  const handleAddGoal = (newGoal: Omit<FinancialGoal, 'id'>) => {
    const goal = {
      ...newGoal,
      id: Math.random().toString(36).substr(2, 9)
    };
    setFinancialGoals([...financialGoals, goal]);
  };

  const handleUpdateGoal = (updatedGoal: FinancialGoal) => {
    setFinancialGoals(financialGoals.map(g => 
      g.id === updatedGoal.id ? updatedGoal : g
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setFinancialGoals(financialGoals.filter(g => g.id !== id));
  };

  const handleSaveBudget = (newBudget: Omit<Budget, 'id'>) => {
    const budget = {
      ...newBudget,
      id: Math.random().toString(36).substr(2, 9)
    };
    setBudgets([...budgets, budget]);
  };

  const handleUpdateBudget = (updatedBudget: Budget) => {
    setBudgets(budgets.map(b => 
      b.id === updatedBudget.id ? updatedBudget : b
    ));
  };

  const handleDeleteBudget = (id: string) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  const summary = transactions.reduce(
    (acc, transaction) => {
      const amount = Math.abs(transaction.amount);
      switch (transaction.type) {
        case 'income':
          acc.income += amount;
          acc.currentBalance += amount;
          break;
        case 'expense':
          acc.expenses += amount;
          acc.currentBalance -= amount;
          break;
      }
      return acc;
    },
    { currentBalance: 0, income: 0, expenses: 0 }
  );

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Header */}
      <header className="bg-bg-secondary border-b border-bg-tertiary shadow-md">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <LayoutDashboard className="w-8 h-8 text-turquoise transition-transform hover:scale-110 duration-300" />
              <span className="ml-3 text-xl font-montserrat font-semibold text-white-primary tracking-wide">
                FNHUB
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                className="flex items-center px-5 py-2.5 bg-purple-primary text-white-primary rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
                onClick={() => {
                  setEditingTransaction(undefined);
                  setShowForm(!showForm);
                }}
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                {showForm ? 'Fechar' : 'Nova Transação'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-10 py-10">
        {/* Balance Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          <BalanceCard
            type="balance"
            amount={summary.currentBalance}
            label="Saldo Atual"
          />
          <BalanceCard
            type="income"
            amount={summary.income}
            label="Receitas"
          />
          <BalanceCard
            type="expense"
            amount={summary.expenses}
            label="Despesas"
          />
        </div>

        {/* Transaction Form */}
        {showForm && (
          <div className="mb-10 animate-fadeIn">
            <TransactionForm
              onAddTransaction={handleAddTransaction}
              categories={categories}
              onAddCategory={handleAddCategory}
              editingTransaction={editingTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onCancelEdit={() => {
                setEditingTransaction(undefined);
                setShowForm(false);
              }}
            />
          </div>
        )}

        {/* Financial Goals */}
        <div className="mb-10">
          <FinancialGoalList 
            goals={financialGoals}
            categories={categories}
            onAddGoal={handleAddGoal}
            onUpdateGoal={handleUpdateGoal}
            onDeleteGoal={handleDeleteGoal}
          />
        </div>

        {/* Predictive Analysis */}
        <div className="mb-10">
          <PredictiveAnalysis transactions={transactions} />
        </div>

        {/* Budget Planner */}
        <div className="mb-10">
          <BudgetPlanner 
            transactions={transactions}
            categories={categories}
            budgets={budgets}
            onSaveBudget={handleSaveBudget}
            onUpdateBudget={handleUpdateBudget}
            onDeleteBudget={handleDeleteBudget}
          />
        </div>

        {/* Transactions */}
        <TransactionList
          transactions={transactions}
          categories={categories}
          onDeleteTransaction={handleDeleteTransaction}
          onEditTransaction={handleEditTransaction}
        />
      </main>
    </div>
  );
}

export default App;