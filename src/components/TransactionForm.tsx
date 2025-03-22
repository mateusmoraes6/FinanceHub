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

  // Cores pré-definidas para seleção
  const predefinedColors = [
    '#FF5252', // vermelho
    '#FF7043', // laranja
    '#FFCA28', // amarelo
    '#66BB6A', // verde
    '#26C6DA', // azul claro 
    '#42A5F5', // azul
    '#7B61FF', // roxo (purple-primary)
    '#EC407A', // rosa
    '#AB47BC', // roxo escuro
    '#78909C', // cinza azulado
    '#00D9F5', // turquesa
    '#00E676', // verde brilhante
  ];

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
    <div className="bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-2xl p-4 sm:p-6 border border-bg-tertiary shadow-lg mb-8 transition-all duration-300 hover:shadow-purple-primary/20 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-h3 font-montserrat text-white-primary">
          {editingTransaction ? '✏️ Editar Transação' : '✨ Nova Transação'}
        </h3>
        <div className="h-1 w-20 bg-gradient-to-r from-purple-primary to-turquoise rounded-full"></div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2 transition-colors group-hover:text-turquoise">
              Valor
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">R$</span>
              <input
                type="number"
                value={transaction.amount || ''}
                onChange={(e) => setTransaction({ ...transaction, amount: Number(e.target.value) })}
                className="w-full bg-bg-primary bg-opacity-60 border border-gray-600 rounded-lg pl-10 pr-4 py-2.5 sm:py-3 text-white focus:ring-2 focus:ring-purple-primary focus:border-transparent transition-all duration-300"
                placeholder="0,00"
                step="0.01"
                required
              />
            </div>
          </div>
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2 transition-colors group-hover:text-turquoise">
              Data
            </label>
            <div className="relative">
              <input
                type="date"
                value={transaction.date}
                onChange={(e) => setTransaction({ ...transaction, date: e.target.value })}
                className="w-full bg-bg-primary bg-opacity-60 border border-gray-600 rounded-lg px-4 py-2.5 sm:py-3 text-white focus:ring-2 focus:ring-purple-primary focus:border-transparent transition-all duration-300 pl-10"
                required
              />
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-white" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="mb-4 group">
          <label htmlFor="type" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2 transition-colors group-hover:text-turquoise">
            Tipo de Transação
          </label>
          <div className="flex gap-4 p-1 bg-bg-primary bg-opacity-60 border border-gray-600 rounded-lg">
            <button
              type="button"
              onClick={() => setTransaction({ ...transaction, type: 'income' })}
              className={`flex-1 py-2.5 sm:py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${
                transaction.type === 'income'
                  ? 'bg-green-primary text-bg-primary font-medium shadow-md'
                  : 'text-gray-light hover:bg-bg-tertiary'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              Receita
            </button>
            <button
              type="button"
              onClick={() => setTransaction({ ...transaction, type: 'expense' })}
              className={`flex-1 py-2.5 sm:py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${
                transaction.type === 'expense'
                  ? 'bg-red-alert text-bg-primary font-medium shadow-md'
                  : 'text-gray-light hover:bg-bg-tertiary'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-180" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
              </svg>
              Despesa
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-5">
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2 transition-colors group-hover:text-turquoise">
              Categoria
            </label>
            <div className="flex gap-2">
              <select
                value={transaction.category}
                onChange={(e) => setTransaction({ ...transaction, category: e.target.value })}
                className="flex-1 bg-bg-primary bg-opacity-60 border border-gray-600 rounded-lg px-4 py-2.5 sm:py-3 text-white focus:ring-2 focus:ring-purple-primary focus:border-transparent transition-all duration-300"
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
                className="px-3 py-2.5 sm:py-3 bg-gradient-to-r from-purple-primary to-turquoise text-white rounded-lg hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 flex items-center justify-center"
                title="Adicionar nova categoria"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className="group">
            <label className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2 transition-colors group-hover:text-turquoise">
              Descrição
            </label>
            <input
              type="text"
              value={transaction.description}
              onChange={(e) => setTransaction({ ...transaction, description: e.target.value })}
              className="w-full bg-bg-primary bg-opacity-60 border border-gray-600 rounded-lg px-4 py-2.5 sm:py-3 text-white focus:ring-2 focus:ring-purple-primary focus:border-transparent transition-all duration-300"
              placeholder="Descreva a transação"
            />
          </div>
        </div>

        <div className="pt-4 flex gap-4 flex-col sm:flex-row">
          <button
            type="submit"
            className="sm:w-1/2 bg-gradient-to-r from-purple-primary to-turquoise text-white rounded-lg px-6 py-3 
                     font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-purple-primary/30 
                     active:scale-[0.98] relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-[400ms] ease-out group-hover:w-full"></span>
            <span className="relative flex items-center justify-center gap-2">
              {editingTransaction ? 
                <>✓ Atualizar Transação</> : 
                <>✦ Adicionar Transação</>
              }
            </span>
          </button>
          
          {/* Botão de Cancelar para qualquer situação */}
          <button
            type="button"
            onClick={editingTransaction ? onCancelEdit : () => {
              setTransaction({
                id: '',
                amount: 0,
                type: 'expense',
                category: '',
                description: '',
                date: new Date().toISOString().split('T')[0],
              });
              onCancelEdit?.();
            }}
            className="sm:w-1/2 bg-bg-tertiary text-white rounded-lg px-6 py-3 hover:bg-gray-medium transition-colors
                     flex items-center justify-center gap-2 font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Cancelar
          </button>
        </div>
      </form>

      {showNewCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-bg-secondary to-bg-tertiary rounded-2xl p-4 sm:p-6 w-full max-w-md border border-bg-tertiary shadow-xl">
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-primary/30 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </span>
                Nova Categoria
              </h3>
              <button
                onClick={() => setShowNewCategory(false)}
                className="text-gray-400 hover:text-white transition-colors rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-700/50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="space-y-4 sm:space-y-5">
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2 transition-colors group-hover:text-turquoise">
                  Nome
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  className="w-full bg-bg-primary bg-opacity-60 border border-gray-600 rounded-lg px-4 py-2.5 sm:py-3 text-white focus:ring-2 focus:ring-purple-primary focus:border-transparent transition-all duration-300"
                  required
                  placeholder="Nome da categoria"
                />
              </div>
              <div className="mb-4 group">
                <label htmlFor="newType" className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2 transition-colors group-hover:text-turquoise">
                  Tipo de Categoria
                </label>
                <div className="flex gap-4 p-1 bg-bg-primary bg-opacity-60 border border-gray-600 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, type: 'income' })}
                    className={`flex-1 py-2.5 sm:py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${
                      newCategory.type === 'income'
                        ? 'bg-green-primary text-bg-primary font-medium shadow-md'
                        : 'text-gray-light hover:bg-bg-tertiary'
                    }`}
                  >
                    Receita
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewCategory({ ...newCategory, type: 'expense' })}
                    className={`flex-1 py-2.5 sm:py-3 rounded-md flex items-center justify-center gap-2 transition-all duration-300 ${
                      newCategory.type === 'expense'
                        ? 'bg-red-alert text-bg-primary font-medium shadow-md'
                        : 'text-gray-light hover:bg-bg-tertiary'
                    }`}
                  >
                    Despesa
                  </button>
                </div>
              </div>
              <div className="group">
                <label className="block text-sm font-medium text-gray-300 mb-1.5 sm:mb-2 transition-colors group-hover:text-turquoise">
                  Cor
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewCategory({ ...newCategory, color })}
                      className={`w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center ${
                        newCategory.color === color ? 'ring-2 ring-white ring-offset-2 ring-offset-bg-primary scale-110' : ''
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {newCategory.color === color && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
                <div 
                  className="mt-2 h-8 rounded-lg border border-gray-600 flex items-center justify-center text-sm text-gray-300" 
                  style={{ backgroundColor: newCategory.color }}
                >
                  Cor selecionada
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-primary to-turquoise text-white rounded-lg px-4 py-3 
                        font-medium tracking-wide transition-all duration-300 hover:shadow-lg hover:shadow-purple-primary/30 
                        active:scale-[0.98] relative overflow-hidden group mt-6"
              >
                <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-[400ms] ease-out group-hover:w-full"></span>
                <span className="relative flex items-center justify-center gap-2">
                  ✦ Adicionar Categoria
                </span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionForm;