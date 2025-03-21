import React, { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import type { FinancialGoal, Category } from '../types/finance';
import FinancialGoalCard from './FinancialGoalCard';
import FinancialGoalForm from './FinancialGoalForm';

interface FinancialGoalListProps {
  goals: FinancialGoal[];
  categories: Category[];
  onAddGoal: (newGoal: Omit<FinancialGoal, 'id'>) => void;
  onUpdateGoal: (updatedGoal: FinancialGoal) => void;
  onDeleteGoal: (id: string) => void;
}

const FinancialGoalList: React.FC<FinancialGoalListProps> = ({
  goals,
  categories,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | undefined>();

  const handleEditGoal = (goal: FinancialGoal) => {
    setEditingGoal(goal);
    setShowForm(true);
  };

  const handleCancelEdit = () => {
    setEditingGoal(undefined);
    setShowForm(false);
  };

  // Ordena as metas por progresso (decrescente)
  const sortedGoals = [...goals].sort((a, b) => {
    const progressA = (a.currentAmount / a.targetAmount) * 100;
    const progressB = (b.currentAmount / b.targetAmount) * 100;
    return progressB - progressA;
  });

  return (
    <div className="card animate-slideIn">
      <div className="card-header flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white-primary mb-1">Metas Financeiras</h2>
          <p className="text-gray-light text-sm">Acompanhe o progresso das suas metas</p>
        </div>
        <button
          onClick={() => {
            setEditingGoal(undefined);
            setShowForm(!showForm);
          }}
          className="px-4 py-2 bg-purple-primary text-white-primary rounded-lg flex items-center hover:bg-opacity-90 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5"
        >
          {showForm && !editingGoal ? (
            'Cancelar'
          ) : (
            <>
              <Plus className="w-5 h-5 mr-1.5" />
              Nova Meta
            </>
          )}
        </button>
      </div>

      <div className="card-body">
        {showForm && (
          <div className="mb-8 animate-fadeIn">
            <FinancialGoalForm
              onAddGoal={onAddGoal}
              onUpdateGoal={onUpdateGoal}
              onCancelEdit={handleCancelEdit}
              categories={categories}
              editingGoal={editingGoal}
            />
          </div>
        )}

        {goals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedGoals.map((goal) => (
              <FinancialGoalCard
                key={goal.id}
                goal={goal}
                onEditGoal={handleEditGoal}
                onDeleteGoal={onDeleteGoal}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-bg-tertiary mb-4">
              <Target className="w-12 h-12 text-gray-medium opacity-50" />
            </div>
            <h3 className="text-gray-light font-medium mb-2">Nenhuma meta definida</h3>
            <p className="text-gray-medium text-sm max-w-md mb-6">
              Defina metas financeiras para acompanhar seu progresso rumo aos seus objetivos
            </p>
            <button
              onClick={() => {
                setEditingGoal(undefined);
                setShowForm(true);
              }}
              className="px-5 py-2.5 bg-purple-primary text-white-primary rounded-lg flex items-center hover:bg-opacity-90 transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeira Meta
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialGoalList; 