import React, { useState } from 'react';
import { ShoppingBag, Briefcase, Wallet, Pencil, Trash2 } from 'lucide-react';
import type { Transaction, Category } from '../types/finance';
import CategoryBadge from './CategoryBadge';
import TransactionChart from './TransactionChart';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  categories,
  onDeleteTransaction,
  onEditTransaction,
}) => {
  const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return <Wallet className="w-5 h-5 text-green-primary" />;
      case 'expense':
        return <ShoppingBag className="w-5 h-5 text-red-alert" />;
      default:
        return <Wallet className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAmountStyle = (type: Transaction['type']) => {
    switch (type) {
      case 'income':
        return 'text-green-primary';
      case 'expense':
        return 'text-red-alert';
      default:
        return 'text-gray-500';
    }
  };

  const getCategoryForTransaction = (transaction: Transaction) => {
    return categories.find(cat => cat.name === transaction.category);
  };

  const getBadgeColor = (transaction: Transaction): string => {
    switch (transaction.type) {
      case 'income':
        return 'bg-green-bright/20 text-green-bright';
      case 'expense':
        return 'bg-red-500/20 text-red-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getTypeLabel = (type: Transaction['type']): string => {
    switch (type) {
      case 'income':
        return 'Receita';
      case 'expense':
        return 'Despesa';
      default:
        return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-10">
      <div className="card animate-slideIn">
        <div className="card-header">
          <h2 className="text-xl font-semibold text-white-primary mb-1">Transações Recentes</h2>
          <p className="text-gray-light text-sm">Acompanhe suas movimentações financeiras</p>
        </div>
        <div className="card-body">
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction, index) => {
                const category = getCategoryForTransaction(transaction);
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-bg-tertiary rounded-lg border border-bg-tertiary hover:border-gray-medium group transition-all duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-full bg-bg-secondary flex items-center justify-center transition-transform group-hover:scale-110">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="font-medium text-white-primary">{transaction.description || "Sem descrição"}</p>
                          {category && <CategoryBadge category={category} />}
                        </div>
                        <p className="text-sm text-gray-light">{transaction.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex flex-col items-end">
                        <span className={`numeric-table font-semibold ${getAmountStyle(transaction.type)}`}>
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(Math.abs(transaction.amount))}
                        </span>
                        <span className="text-sm text-gray-light">
                          {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button
                          onClick={() => onEditTransaction(transaction)}
                          className="p-1.5 rounded-full bg-bg-secondary text-gray-light hover:text-turquoise hover:bg-bg-secondary/80 transition-colors"
                          aria-label="Editar transação"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteTransaction(transaction.id)}
                          className="p-1.5 rounded-full bg-bg-secondary text-gray-light hover:text-red-alert hover:bg-bg-secondary/80 transition-colors"
                          aria-label="Excluir transação"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-10 flex flex-col items-center justify-center text-center">
              <Wallet className="w-12 h-12 text-gray-medium mb-3 opacity-50" />
              <h3 className="text-gray-light font-medium mb-1">Nenhuma transação encontrada</h3>
              <p className="text-gray-medium text-sm max-w-md">
                Adicione sua primeira transação clicando no botão "Nova Transação"
              </p>
            </div>
          )}
        </div>
      </div>
      
      <TransactionChart transactions={transactions} />
    </div>
  );
};

export default TransactionList;