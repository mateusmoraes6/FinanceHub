import React, { useState, useEffect } from 'react';
import { X, Plus, Target } from 'lucide-react';
import type { FinancialGoal, Category, GoalTimeframe } from '../types/finance';

interface FinancialGoalFormProps {
  onAddGoal: (newGoal: Omit<FinancialGoal, 'id'>) => void;
  onUpdateGoal: (updatedGoal: FinancialGoal) => void;
  onCancelEdit: () => void;
  categories: Category[];
  editingGoal?: FinancialGoal;
}

const FinancialGoalForm: React.FC<FinancialGoalFormProps> = ({
  onAddGoal,
  onUpdateGoal,
  onCancelEdit,
  categories,
  editingGoal
}) => {
  const [goal, setGoal] = useState<Omit<FinancialGoal, 'id'>>({
    title: '',
    targetAmount: 0,
    currentAmount: 0,
    category: '',
    endDate: new Date().toISOString().split('T')[0],
    timeframe: 'medium' as GoalTimeframe,
    description: '',
    color: '#7B61FF'
  });

  useEffect(() => {
    if (editingGoal) {
      setGoal({
        title: editingGoal.title,
        targetAmount: editingGoal.targetAmount,
        currentAmount: editingGoal.currentAmount,
        category: editingGoal.category,
        endDate: editingGoal.endDate,
        timeframe: editingGoal.timeframe,
        description: editingGoal.description || '',
        color: editingGoal.color || '#7B61FF'
      });
    }
  }, [editingGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingGoal) {
      onUpdateGoal({
        id: editingGoal.id,
        ...goal
      });
    } else {
      onAddGoal(goal);
    }
  };

  return (
    <div className="card">
      <div className="card-header flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-white-primary mb-1">
            {editingGoal ? 'Editar Meta' : 'Nova Meta Financeira'}
          </h2>
          <p className="text-gray-light text-sm">
            {editingGoal 
              ? 'Atualize os detalhes da sua meta financeira' 
              : 'Defina uma nova meta para acompanhar seu progresso financeiro'}
          </p>
        </div>
        <button
          onClick={onCancelEdit}
          className="p-2 rounded-full bg-bg-tertiary text-gray-light hover:text-white-primary transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="card-body">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-light mb-2">
                Título da Meta
              </label>
              <input
                type="text"
                value={goal.title}
                onChange={(e) => setGoal({ ...goal, title: e.target.value })}
                className="w-full bg-bg-tertiary border border-bg-tertiary rounded-lg px-4 py-2.5 text-white-primary focus:ring-2 focus:ring-turquoise focus:border-transparent"
                placeholder="Ex: Comprar um carro"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-light mb-2">
                Categoria
              </label>
              <select
                value={goal.category}
                onChange={(e) => setGoal({ ...goal, category: e.target.value })}
                className="w-full bg-bg-tertiary border border-bg-tertiary rounded-lg px-4 py-2.5 text-white-primary focus:ring-2 focus:ring-turquoise focus:border-transparent"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-light mb-2">
                Valor da Meta
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-light">R$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={goal.targetAmount}
                  onChange={(e) => setGoal({ ...goal, targetAmount: parseFloat(e.target.value) })}
                  className="w-full bg-bg-tertiary border border-bg-tertiary rounded-lg pl-10 pr-4 py-2.5 text-white-primary focus:ring-2 focus:ring-turquoise focus:border-transparent"
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-light mb-2">
                Valor Acumulado
              </label>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-light">R$</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={goal.currentAmount}
                  onChange={(e) => setGoal({ ...goal, currentAmount: parseFloat(e.target.value) })}
                  className="w-full bg-bg-tertiary border border-bg-tertiary rounded-lg pl-10 pr-4 py-2.5 text-white-primary focus:ring-2 focus:ring-turquoise focus:border-transparent"
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-light mb-2">
                Data de Conclusão
              </label>
              <input
                type="date"
                value={goal.endDate}
                onChange={(e) => setGoal({ ...goal, endDate: e.target.value })}
                className="w-full bg-bg-tertiary border border-bg-tertiary rounded-lg px-4 py-2.5 text-white-primary focus:ring-2 focus:ring-turquoise focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-light mb-2">
                Prazo
              </label>
              <select
                value={goal.timeframe}
                onChange={(e) => setGoal({ ...goal, timeframe: e.target.value as GoalTimeframe })}
                className="w-full bg-bg-tertiary border border-bg-tertiary rounded-lg px-4 py-2.5 text-white-primary focus:ring-2 focus:ring-turquoise focus:border-transparent"
                required
              >
                <option value="short">Curto Prazo</option>
                <option value="medium">Médio Prazo</option>
                <option value="long">Longo Prazo</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-light mb-2">
              Descrição (opcional)
            </label>
            <textarea
              value={goal.description}
              onChange={(e) => setGoal({ ...goal, description: e.target.value })}
              className="w-full bg-bg-tertiary border border-bg-tertiary rounded-lg px-4 py-2.5 text-white-primary focus:ring-2 focus:ring-turquoise focus:border-transparent"
              placeholder="Detalhes adicionais sobre sua meta..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-6 py-2.5 bg-bg-tertiary text-white-primary rounded-lg hover:bg-bg-tertiary/80 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-turquoise text-white-primary rounded-lg hover:bg-opacity-90 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center"
            >
              <Target className="w-5 h-5 mr-2" />
              {editingGoal ? 'Atualizar Meta' : 'Criar Meta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinancialGoalForm; 