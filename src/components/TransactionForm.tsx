import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import type { TransactionType, Category, Transaction } from '../types/finance';

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    amount: number;
    type: TransactionType;
    category: string;
    description: string;
    date: string;
  }) => void;
  categories: Category[];
  onAddCategory: (category: { name: string; type: TransactionType; color: string }) => void;
  editingTransaction?: Transaction;
  onUpdateTransaction?: (transaction: Transaction) => void;
  onCancelEdit?: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({
  onAddTransaction,
  categories,
  onAddCategory,
  editingTransaction,
  onUpdateTransaction,
  onCancelEdit,
}) => {
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', type: 'expense' as TransactionType, color: '#4CAF50' });
  const [transaction, setTransaction] = useState({
    id: '',
    amount: 0,
    type: 'expense' as TransactionType,
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (editingTransaction) {
      setTransaction(editingTransaction);
    }
  }, [editingTransaction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transaction.amount && transaction.category && transaction.date) {
      if (editingTransaction && onUpdateTransaction) {
        onUpdateTransaction(transaction);
        onCancelEdit?.();
      } else {
        onAddTransaction(transaction);
      }
      setTransaction({
        id: '',
        amount: 0,
        type: 'expense',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.name) {
      onAddCategory(newCategory);
      setShowNewCategory(false);
      setNewCategory({ name: '', type: 'expense', color: '#4CAF50' });
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Valor
            </label>
            <input
              type="number"
              value={transaction.amount || ''}
              onChange={(e) => setTransaction({ ...transaction, amount: Number(e.target.value) })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Digite o valor"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Data
            </label>
            <input
              type="date"
              value={transaction.date}
              onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="type" className="block text-sm font-medium text-white-secondary mb-1">
            Tipo de Transação
          </label>
          <select
            id="type"
            value={transaction.type}
            onChange={(e) => setTransaction({ ...transaction, type: e.target.value as TransactionType })}
            className="w-full bg-bg-primary border border-bg-tertiary rounded-lg p-2.5 text-white-primary"
          >
            <option value="income">Receita</option>
            <option value="expense">Despesa</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Categoria
            </label>
            <div className="flex gap-2">
              <select
                value={transaction.category}
                onChange={(e) => setTransaction({ ...transaction, category: e.target.value })}
                className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories
                  .filter((cat) => cat.type === transaction.type)
                  .map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewCategory(true)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Descrição
          </label>
          <input
            type="text"
            value={transaction.description}
            onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Adicione uma descrição"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
          >
            {editingTransaction ? 'Atualizar Transação' : 'Adicionar Transação'}
          </button>
          {editingTransaction && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-gray-600 text-white rounded-lg px-4 py-2 hover:bg-gray-700 transition-colors"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {showNewCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-white">Nova Categoria</h3>
              <button
                onClick={() => setShowNewCategory(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newType" className="block text-sm font-medium text-white-secondary mb-1">
                  Tipo de Categoria
                </label>
                <select
                  id="newType"
                  value={newCategory.type}
                  onChange={(e) => setNewCategory({ ...newCategory, type: e.target.value as TransactionType })}
                  className="w-full bg-bg-primary border border-bg-tertiary rounded-lg p-2.5 text-white-primary"
                >
                  <option value="income">Receita</option>
                  <option value="expense">Despesa</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Cor
                </label>
                <input
                  type="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-full h-10 bg-gray-700 border border-gray-600 rounded-lg p-1"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-colors"
              >
                Adicionar Categoria
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionForm;