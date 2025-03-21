import React from 'react';
import { Target, Clock, ArrowRight } from 'lucide-react';
import type { FinancialGoal } from '../types/finance';

interface FinancialGoalCardProps {
  goal: FinancialGoal;
  onEditGoal: (goal: FinancialGoal) => void;
  onDeleteGoal: (id: string) => void;
}

const FinancialGoalCard: React.FC<FinancialGoalCardProps> = ({ goal, onEditGoal, onDeleteGoal }) => {
  const progress = Math.min(Math.round((goal.currentAmount / goal.targetAmount) * 100), 100);
  
  const getTimeframeLabel = (timeframe: string): string => {
    switch (timeframe) {
      case 'short': return 'Curto Prazo';
      case 'medium': return 'Médio Prazo';
      case 'long': return 'Longo Prazo';
      default: return '';
    }
  };

  const getDaysRemaining = (): number => {
    const today = new Date();
    const endDate = new Date(goal.endDate);
    const diffTime = endDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const daysRemaining = getDaysRemaining();
  
  const getStatusColor = (): string => {
    if (progress >= 90) return 'bg-green-primary';
    if (progress >= 60) return 'bg-turquoise';
    if (progress >= 30) return 'bg-yellow-warning';
    return 'bg-red-alert';
  };

  const getTimeframeIcon = (): JSX.Element => {
    return <Clock className="w-5 h-5 text-gray-light" />;
  };

  return (
    <div className="rounded-xl p-6 border border-bg-tertiary bg-bg-secondary shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-slideIn">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-full bg-bg-tertiary">
            <Target className="w-5 h-5 text-turquoise" />
          </div>
          <div>
            <h3 className="font-semibold text-white-primary">{goal.title}</h3>
            <span className="text-sm text-gray-light">{goal.category}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEditGoal(goal)}
            className="p-1.5 rounded-full bg-bg-tertiary text-gray-light hover:text-turquoise transition-colors"
            aria-label="Editar meta"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </button>
          <button
            onClick={() => onDeleteGoal(goal.id)}
            className="p-1.5 rounded-full bg-bg-tertiary text-gray-light hover:text-red-alert transition-colors"
            aria-label="Excluir meta"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18"/>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              <line x1="10" x2="10" y1="11" y2="17"/>
              <line x1="14" x2="14" y1="11" y2="17"/>
            </svg>
          </button>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-light mb-1">
          <span>Progresso</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-bg-tertiary rounded-full overflow-hidden">
          <div
            className={`h-full ${getStatusColor()} transition-all duration-500 ease-out`}
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-light mb-1">Meta</p>
          <p className="numeric-table font-medium text-white-primary">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(goal.targetAmount)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-light mb-1">Acumulado</p>
          <p className="numeric-table font-medium text-white-primary">
            {new Intl.NumberFormat('pt-BR', {
              style: 'currency',
              currency: 'BRL'
            }).format(goal.currentAmount)}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-bg-tertiary pt-4">
        <div className="flex items-center space-x-2">
          {getTimeframeIcon()}
          <span className="text-sm text-gray-light">
            {getTimeframeLabel(goal.timeframe)}
          </span>
        </div>
        <div className="text-sm">
          <span className={`${daysRemaining <= 30 ? 'text-red-alert' : 'text-gray-light'}`}>
            {daysRemaining} dias restantes
          </span>
        </div>
      </div>
    </div>
  );
};

export default FinancialGoalCard; 