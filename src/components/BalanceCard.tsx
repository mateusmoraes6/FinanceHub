import React from 'react';
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, Wallet } from 'lucide-react';

interface BalanceCardProps {
  type: 'balance' | 'income' | 'expense' | 'investment';
  amount: number;
  label: string;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ type, amount, label }) => {
  const getCardStyle = () => {
    switch (type) {
      case 'income':
        return {
          bgGradient: 'from-bg-secondary to-bg-secondary/80',
          textColor: 'text-green-primary',
          borderColor: 'border-green-secondary/30',
          icon: <ArrowUpCircle className="w-7 h-7 text-green-primary" />
        };
      case 'expense':
        return {
          bgGradient: 'from-bg-secondary to-bg-secondary/80',
          textColor: 'text-red-alert',
          borderColor: 'border-bg-tertiary',
          icon: <ArrowDownCircle className="w-7 h-7 text-red-alert" />
        };
      case 'investment':
        return {
          bgGradient: 'from-bg-secondary to-bg-secondary/80',
          textColor: 'text-purple-primary',
          borderColor: 'border-bg-tertiary',
          icon: <TrendingUp className="w-7 h-7 text-purple-primary" />
        };
      default:
        return {
          bgGradient: 'from-bg-secondary to-bg-secondary/80',
          textColor: 'text-turquoise',
          borderColor: 'border-bg-tertiary',
          icon: <Wallet className="w-7 h-7 text-turquoise" />
        };
    }
  };

  const style = getCardStyle();

  return (
    <div 
      className={`rounded-xl p-8 border ${style.borderColor} shadow-md bg-gradient-to-br ${style.bgGradient} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slideIn`}
    >
      <div className="flex items-center justify-between mb-5">
        <span className="text-gray-light font-medium tracking-wide">{label}</span>
        <div className="transition-transform duration-300 hover:scale-110 hover:rotate-3">
          {style.icon}
        </div>
      </div>
      <div className={`numeric-large font-semibold ${style.textColor}`}>
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(amount)}
      </div>
    </div>
  );
};

export default BalanceCard;