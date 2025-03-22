import React from 'react';
import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface BalanceCardProps {
  type: 'balance' | 'income' | 'expense';
  amount: number;
  label: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ type, amount, label }) => {
  const getCardIcon = () => {
    switch (type) {
      case 'balance':
        return <Wallet className="w-6 h-6 text-turquoise" />;
      case 'income':
        return <TrendingUp className="w-6 h-6 text-green-bright" />;
      case 'expense':
        return <TrendingDown className="w-6 h-6 text-red-500" />;
      default:
        return <Wallet className="w-6 h-6 text-gray-500" />;
    }
  };

  const getAmountColor = () => {
    switch (type) {
      case 'balance':
        return 'text-turquoise';
      case 'income':
        return 'text-green-bright';
      case 'expense':
        return 'text-red-500';
      default:
        return 'text-white-primary';
    }
  };

  return (
    <div className="bg-bg-secondary rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-4">
        <span className="text-white-secondary text-sm">{label}</span>
        {getCardIcon()}
      </div>
      <div className={`text-2xl font-semibold ${getAmountColor()}`}>
        R$ {amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
};

export default BalanceCard;