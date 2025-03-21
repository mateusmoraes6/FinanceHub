import React, { useState, useEffect, useMemo } from 'react';
import { Plus, X, DollarSign, BarChart3, Edit, Trash2 } from 'lucide-react';
import type { Budget, BudgetItem, Category, Transaction } from '../types/finance';

interface BudgetPlannerProps {
  transactions: Transaction[];
  categories: Category[];
  onSaveBudget: (budget: Omit<Budget, 'id'>) => void;
  onUpdateBudget: (budget: Budget) => void;
  onDeleteBudget: (id: string) => void;
  budgets: Budget[];
}

const BudgetPlanner: React.FC<BudgetPlannerProps> = ({
  transactions,
  categories,
  onSaveBudget,
  onUpdateBudget,
  onDeleteBudget,
  budgets
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [activeBudgetId, setActiveBudgetId] = useState<string | null>(null);
  
  const currentDate = new Date();
  const currentMonth = `${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
  
  // Estado do formulário de orçamento
  const [budgetForm, setBudgetForm] = useState<{
    name: string;
    month: string;
    year: string;
    totalBudget: number;
    items: Omit<BudgetItem, 'id'>[];
  }>({
    name: `Orçamento de ${new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`,
    month: (currentDate.getMonth() + 1).toString().padStart(2, '0'),
    year: currentDate.getFullYear().toString(),
    totalBudget: 0,
    items: []
  });
  
  // Inicializar o orçamento ativo com o orçamento do mês atual
  useEffect(() => {
    if (budgets.length > 0 && !activeBudgetId) {
      const currentBudget = budgets.find(b => b.month === currentMonth) || budgets[0];
      setActiveBudgetId(currentBudget.id);
    }
  }, [budgets, activeBudgetId, currentMonth]);
  
  // Resetar o formulário quando o modo de edição mudar
  useEffect(() => {
    if (editingBudget) {
      setBudgetForm({
        name: editingBudget.name,
        month: editingBudget.month.split('/')[0],
        year: editingBudget.year,
        totalBudget: editingBudget.totalBudget,
        items: editingBudget.items.map(item => ({
          category: item.category,
          budgetAmount: item.budgetAmount,
          spentAmount: item.spentAmount,
          month: item.month,
          year: item.year
        }))
      });
    } else {
      setBudgetForm({
        name: `Orçamento de ${new Date().toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}`,
        month: (currentDate.getMonth() + 1).toString().padStart(2, '0'),
        year: currentDate.getFullYear().toString(),
        totalBudget: 0,
        items: []
      });
    }
  }, [editingBudget, currentDate]);
  
  // Obter orçamento ativo
  const activeBudget = useMemo(() => {
    return budgets.find(b => b.id === activeBudgetId) || null;
  }, [budgets, activeBudgetId]);
  
  // Calcular gastos reais por categoria para o orçamento ativo
  const actualExpenses = useMemo(() => {
    if (!activeBudget) return {};
    
    const [month, year] = activeBudget.month.split('/');
    
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return (
          t.type === 'expense' &&
          transactionDate.getMonth() + 1 === parseInt(month) &&
          transactionDate.getFullYear() === parseInt(year)
        );
      })
      .reduce((acc, transaction) => {
        if (!acc[transaction.category]) {
          acc[transaction.category] = 0;
        }
        acc[transaction.category] += transaction.amount;
        return acc;
      }, {} as Record<string, number>);
  }, [activeBudget, transactions]);
  
  // Calcular o total de gastos reais
  const totalActualExpenses = useMemo(() => {
    return Object.values(actualExpenses).reduce((sum, amount) => sum + amount, 0);
  }, [actualExpenses]);
  
  // Adicionar um novo item de orçamento
  const addBudgetItem = () => {
    const expenseCategories = categories.filter(c => c.type === 'expense');
    if (expenseCategories.length === 0) return;
    
    const existingCategories = new Set(budgetForm.items.map(item => item.category));
    const availableCategories = expenseCategories.filter(c => !existingCategories.has(c.name));
    
    if (availableCategories.length === 0) return;
    
    setBudgetForm({
      ...budgetForm,
      items: [
        ...budgetForm.items,
        {
          category: availableCategories[0].name,
          budgetAmount: 0,
          spentAmount: 0,
          month: `${budgetForm.month}/${budgetForm.year}`,
          year: budgetForm.year
        }
      ]
    });
  };
  
  // Remover um item de orçamento
  const removeBudgetItem = (index: number) => {
    const newItems = [...budgetForm.items];
    newItems.splice(index, 1);
    setBudgetForm({
      ...budgetForm,
      items: newItems
    });
  };
  
  // Atualizar um item de orçamento
  const updateBudgetItem = (index: number, field: keyof Omit<BudgetItem, 'id'>, value: any) => {
    const newItems = [...budgetForm.items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === 'budgetAmount' ? parseFloat(value) : value
    };
    
    setBudgetForm({
      ...budgetForm,
      items: newItems,
      totalBudget: newItems.reduce((sum, item) => sum + item.budgetAmount, 0)
    });
  };
  
  // Submeter o formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedMonth = `${budgetForm.month}/${budgetForm.year}`;
    
    const budgetData = {
      name: budgetForm.name,
      month: formattedMonth,
      year: budgetForm.year,
      totalBudget: budgetForm.items.reduce((sum, item) => sum + item.budgetAmount, 0),
      items: budgetForm.items.map(item => ({
        ...item,
        month: formattedMonth,
        year: budgetForm.year,
        id: Math.random().toString(36).substr(2, 9)
      }))
    };
    
    if (editingBudget) {
      onUpdateBudget({
        ...budgetData,
        id: editingBudget.id,
        items: budgetData.items.map((item, index) => ({
          ...item,
          id: index < editingBudget.items.length ? editingBudget.items[index].id : item.id
        }))
      });
    } else {
      onSaveBudget(budgetData);
    }
    
    setShowForm(false);
    setEditingBudget(null);
  };
  
  // Editar um orçamento existente
  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setShowForm(true);
  };
  
  // Cancelar edição/criação
  const handleCancel = () => {
    setShowForm(false);
    setEditingBudget(null);
  };
  
  // Formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  // Calcular porcentagem do orçamento gasto
  const calculatePercentage = (budgeted: number, spent: number) => {
    if (budgeted === 0) return 0;
    return Math.min(Math.round((spent / budgeted) * 100), 100);
  };
  
  // Obter cor baseada na porcentagem do orçamento gasto
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-alert';
    if (percentage >= 75) return 'bg-yellow-warning';
    if (percentage >= 50) return 'bg-blue-500';
    return 'bg-green-primary';
  };
  
  return (
    <div className="card animate-slideIn">
      <div className="card-header flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white-primary mb-1">Planejamento de Orçamento</h2>
          <p className="text-gray-light text-sm">Defina e acompanhe seu orçamento mensal</p>
        </div>
        <button
          onClick={() => {
            setEditingBudget(null);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-turquoise text-white-primary rounded-lg flex items-center hover:bg-opacity-90 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {showForm ? (
            'Cancelar'
          ) : (
            <>
              <Plus className="w-5 h-5 mr-1.5" />
              Novo Orçamento
            </>
          )}
        </button>
      </div>

      <div className="card-body">
        {/* Formulário de orçamento */}
        {showForm ? (
          <div className="animate-fadeIn mb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-1">
                  <label className="block text-sm font-medium text-gray-light mb-2">
                    Nome do Orçamento
                  </label>
                  <input
                    type="text"
                    value={budgetForm.name}
                    onChange={(e) => setBudgetForm({ ...budgetForm, name: e.target.value })}
                    className="w-full bg-bg-tertiary border border-bg-tertiary rounded-lg px-4 py-2.5 text-white-primary focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-light mb-2">
                    Mês
                  </label>
                  <select
                    value={budgetForm.month}
                    onChange={(e) => setBudgetForm({ ...budgetForm, month: e.target.value })}
                    className="w-full bg-bg-tertiary border border-bg-tertiary rounded-lg px-4 py-2.5 text-white-primary focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    required
                  >
                    {[...Array(12)].map((_, i) => (
                      <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                        {new Date(0, i).toLocaleString('pt-BR', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-light mb-2">
                    Ano
                  </label>
                  <select
                    value={budgetForm.year}
                    onChange={(e) => setBudgetForm({ ...budgetForm, year: e.target.value })}
                    className="w-full bg-bg-tertiary border border-bg-tertiary rounded-lg px-4 py-2.5 text-white-primary focus:ring-2 focus:ring-turquoise focus:border-transparent"
                    required
                  >
                    {[...Array(5)].map((_, i) => {
                      const year = currentDate.getFullYear() + i - 2;
                      return (
                        <option key={year} value={year.toString()}>
                          {year}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              {/* Itens do orçamento */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-white-primary">Categorias de Orçamento</h3>
                  <button
                    type="button"
                    onClick={addBudgetItem}
                    className="px-3 py-1.5 bg-turquoise/20 text-turquoise rounded-lg text-sm flex items-center hover:bg-turquoise/30 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Adicionar Categoria
                  </button>
                </div>

                {budgetForm.items.length > 0 ? (
                  <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {budgetForm.items.map((item, index) => (
                      <div key={index} className="bg-bg-tertiary/50 rounded-lg p-4 border border-bg-tertiary">
                        <div className="flex justify-between items-center mb-3">
                          <div className="flex-1">
                            <select
                              value={item.category}
                              onChange={(e) => updateBudgetItem(index, 'category', e.target.value)}
                              className="w-full bg-bg-tertiary border border-bg-tertiary rounded-lg px-3 py-1.5 text-white-primary focus:ring-2 focus:ring-turquoise focus:border-transparent"
                              required
                            >
                              {categories
                                .filter(c => c.type === 'expense')
                                .filter(c => c.name === item.category || !budgetForm.items.some(i => i.category === c.name && i !== item))
                                .map(category => (
                                  <option key={category.id} value={category.name}>
                                    {category.name}
                                  </option>
                                ))}
                            </select>
                          </div>
                          <div className="flex items-center">
                            <div className="relative w-40 mx-4">
                              <span className="absolute left-3 top-2 text-gray-light">R$</span>
                              <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={item.budgetAmount}
                                onChange={(e) => updateBudgetItem(index, 'budgetAmount', e.target.value)}
                                className="w-full bg-bg-tertiary border border-bg-tertiary rounded-lg pl-10 pr-3 py-1.5 text-white-primary focus:ring-2 focus:ring-turquoise focus:border-transparent"
                                required
                              />
                            </div>
                            <button
                              type="button"
                              onClick={() => removeBudgetItem(index)}
                              className="p-1.5 rounded-full bg-bg-tertiary text-gray-light hover:text-red-alert transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-bg-tertiary/30 rounded-lg p-6 text-center">
                    <p className="text-gray-light mb-2">Nenhuma categoria adicionada</p>
                    <button
                      type="button"
                      onClick={addBudgetItem}
                      className="px-4 py-2 bg-bg-tertiary text-white-primary rounded-lg text-sm inline-flex items-center hover:bg-bg-tertiary/80 transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-1.5" />
                      Adicionar Categoria
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-bg-tertiary">
                <div>
                  <span className="text-gray-light">Orçamento Total:</span>
                  <span className="numeric-table ml-2 text-white-primary text-lg font-semibold">
                    {formatCurrency(budgetForm.items.reduce((sum, item) => sum + item.budgetAmount, 0))}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-5 py-2.5 bg-bg-tertiary text-white-primary rounded-lg hover:bg-bg-tertiary/80 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-turquoise text-white-primary rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
                  >
                    <DollarSign className="w-5 h-5 mr-2" />
                    {editingBudget ? 'Atualizar Orçamento' : 'Salvar Orçamento'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        ) : budgets.length > 0 ? (
          // Visualização do orçamento
          <div className="animate-fadeIn">
            {/* Seletor de orçamento */}
            {budgets.length > 1 && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 overflow-x-auto py-2">
                  {budgets.map(budget => (
                    <button
                      key={budget.id}
                      onClick={() => setActiveBudgetId(budget.id)}
                      className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                        activeBudgetId === budget.id 
                          ? 'bg-turquoise text-white-primary' 
                          : 'bg-bg-tertiary text-gray-light hover:text-white-primary'
                      }`}
                    >
                      {budget.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeBudget && (
              <>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white-primary">{activeBudget.name}</h3>
                    <p className="text-sm text-gray-light">
                      {new Date(parseInt(activeBudget.year), parseInt(activeBudget.month.split('/')[0]) - 1).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditBudget(activeBudget)}
                      className="p-2 rounded-full bg-bg-tertiary text-gray-light hover:text-turquoise transition-colors"
                      title="Editar orçamento"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Deseja realmente excluir este orçamento?')) {
                          onDeleteBudget(activeBudget.id);
                        }
                      }}
                      className="p-2 rounded-full bg-bg-tertiary text-gray-light hover:text-red-alert transition-colors"
                      title="Excluir orçamento"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Resumo de progresso geral */}
                <div className="bg-bg-tertiary/50 rounded-lg p-4 mb-6 border border-bg-tertiary">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <div>
                      <h4 className="font-medium text-white-primary">Progresso Geral</h4>
                      <p className="text-sm text-gray-light">
                        {formatCurrency(totalActualExpenses)} de {formatCurrency(activeBudget.totalBudget)}
                      </p>
                    </div>
                    <div className="text-lg font-semibold mt-2 sm:mt-0">
                      <span className={totalActualExpenses > activeBudget.totalBudget ? 'text-red-alert' : 'text-turquoise'}>
                        {calculatePercentage(activeBudget.totalBudget, totalActualExpenses)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full h-3 bg-bg-tertiary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        totalActualExpenses > activeBudget.totalBudget 
                          ? 'bg-red-alert' 
                          : 'bg-turquoise'
                      } transition-all duration-500 ease-out`}
                      style={{ width: `${Math.min((totalActualExpenses / activeBudget.totalBudget) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Lista de categorias */}
                <div className="space-y-4">
                  {activeBudget.items.map(item => {
                    const spentAmount = actualExpenses[item.category] || 0;
                    const percentage = calculatePercentage(item.budgetAmount, spentAmount);
                    
                    return (
                      <div key={item.id} className="bg-bg-tertiary/30 rounded-lg p-4 border border-bg-tertiary">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium text-white-primary">{item.category}</span>
                          <span className={spentAmount > item.budgetAmount ? 'text-red-alert' : 'text-white-primary'}>
                            {formatCurrency(spentAmount)} / {formatCurrency(item.budgetAmount)}
                          </span>
                        </div>
                        <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(percentage)} transition-all duration-500 ease-out`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-xs">
                          <span className="text-gray-light">
                            {percentage}% utilizado
                          </span>
                          {spentAmount > item.budgetAmount && (
                            <span className="text-red-alert">
                              {formatCurrency(spentAmount - item.budgetAmount)} acima do orçamento
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        ) : (
          // Estado vazio
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-bg-tertiary mb-4">
              <BarChart3 className="w-12 h-12 text-gray-medium opacity-50" />
            </div>
            <h3 className="text-gray-light font-medium mb-2">Nenhum orçamento definido</h3>
            <p className="text-gray-medium text-sm max-w-md mb-6">
              Crie um orçamento mensal para controlar seus gastos e atingir seus objetivos financeiros
            </p>
            <button
              onClick={() => {
                setEditingBudget(null);
                setShowForm(true);
              }}
              className="px-5 py-2.5 bg-turquoise text-white-primary rounded-lg flex items-center hover:bg-opacity-90 transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeiro Orçamento
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetPlanner; 