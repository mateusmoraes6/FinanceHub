import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { Investment, InvestmentType, RiskLevel } from '../types/finance';

interface InvestmentFormProps {
  onAddInvestment: (investment: Omit<Investment, 'id'>) => void;
  onUpdateInvestment: (investment: Investment) => void;
  onCancel: () => void;
  editingInvestment?: Investment;
}

const InvestmentForm: React.FC<InvestmentFormProps> = ({
  onAddInvestment,
  onUpdateInvestment,
  onCancel,
  editingInvestment
}) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<InvestmentType>('bond');
  const [amount, setAmount] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [riskLevel, setRiskLevel] = useState<RiskLevel>('medium');
  const [interestRate, setInterestRate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingInvestment) {
      setName(editingInvestment.name);
      setType(editingInvestment.type);
      setAmount(editingInvestment.amount.toString());
      setCurrentValue(editingInvestment.currentValue.toString());
      setPurchaseDate(editingInvestment.purchaseDate);
      setRiskLevel(editingInvestment.riskLevel);
      setInterestRate(editingInvestment.interestRate?.toString() || '');
      setNotes(editingInvestment.notes || '');
    }
  }, [editingInvestment]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Valor investido deve ser maior que zero';
    }

    if (!currentValue || isNaN(Number(currentValue)) || Number(currentValue) < 0) {
      newErrors.currentValue = 'Valor atual deve ser maior ou igual a zero';
    }

    if (!purchaseDate) {
      newErrors.purchaseDate = 'Data de compra é obrigatória';
    }

    if (interestRate && (isNaN(Number(interestRate)) || Number(interestRate) < 0)) {
      newErrors.interestRate = 'Taxa de juros deve ser maior ou igual a zero';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const investmentData = {
      name,
      type,
      amount: Number(amount),
      currentValue: Number(currentValue),
      purchaseDate,
      riskLevel,
      interestRate: interestRate ? Number(interestRate) : undefined,
      notes: notes || undefined
    };

    if (editingInvestment) {
      onUpdateInvestment({
        ...investmentData,
        id: editingInvestment.id
      });
    } else {
      onAddInvestment(investmentData);
    }
  };

  const investmentTypes: { value: InvestmentType; label: string }[] = [
    { value: 'stock', label: 'Ações' },
    { value: 'bond', label: 'Renda Fixa' },
    { value: 'real_estate', label: 'Imóveis' },
    { value: 'crypto', label: 'Criptomoedas' },
    { value: 'other', label: 'Outros' }
  ];

  const riskLevels: { value: RiskLevel; label: string }[] = [
    { value: 'low', label: 'Baixo Risco' },
    { value: 'medium', label: 'Risco Médio' },
    { value: 'high', label: 'Alto Risco' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white-primary">
          {editingInvestment ? 'Editar Investimento' : 'Novo Investimento'}
        </h3>
        <button
          type="button"
          className="p-1 rounded-full hover:bg-bg-primary transition-colors"
          onClick={onCancel}
        >
          <X className="w-5 h-5 text-white-secondary" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome do Investimento */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-white-secondary mb-1">
            Nome do Investimento
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full bg-bg-primary border ${
              errors.name ? 'border-red-500' : 'border-bg-tertiary'
            } rounded-lg p-2.5 text-white-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/50`}
            placeholder="Ex: Tesouro Direto, Ações PETR4"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.name}
            </p>
          )}
        </div>

        {/* Tipo de Investimento */}
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-white-secondary mb-1">
            Tipo de Investimento
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as InvestmentType)}
            className="w-full bg-bg-primary border border-bg-tertiary rounded-lg p-2.5 text-white-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/50"
          >
            {investmentTypes.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Valor Investido */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-white-secondary mb-1">
            Valor Investido (R$)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.01"
            min="0"
            className={`w-full bg-bg-primary border ${
              errors.amount ? 'border-red-500' : 'border-bg-tertiary'
            } rounded-lg p-2.5 text-white-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/50`}
            placeholder="0,00"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.amount}
            </p>
          )}
        </div>

        {/* Valor Atual */}
        <div>
          <label htmlFor="currentValue" className="block text-sm font-medium text-white-secondary mb-1">
            Valor Atual (R$)
          </label>
          <input
            type="number"
            id="currentValue"
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            step="0.01"
            min="0"
            className={`w-full bg-bg-primary border ${
              errors.currentValue ? 'border-red-500' : 'border-bg-tertiary'
            } rounded-lg p-2.5 text-white-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/50`}
            placeholder="0,00"
          />
          {errors.currentValue && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.currentValue}
            </p>
          )}
        </div>

        {/* Data de Compra */}
        <div>
          <label htmlFor="purchaseDate" className="block text-sm font-medium text-white-secondary mb-1">
            Data de Compra
          </label>
          <input
            type="date"
            id="purchaseDate"
            value={purchaseDate}
            onChange={(e) => setPurchaseDate(e.target.value)}
            className={`w-full bg-bg-primary border ${
              errors.purchaseDate ? 'border-red-500' : 'border-bg-tertiary'
            } rounded-lg p-2.5 text-white-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/50`}
          />
          {errors.purchaseDate && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.purchaseDate}
            </p>
          )}
        </div>

        {/* Nível de Risco */}
        <div>
          <label htmlFor="riskLevel" className="block text-sm font-medium text-white-secondary mb-1">
            Nível de Risco
          </label>
          <select
            id="riskLevel"
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value as RiskLevel)}
            className="w-full bg-bg-primary border border-bg-tertiary rounded-lg p-2.5 text-white-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/50"
          >
            {riskLevels.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Taxa de Juros (opcional) */}
        <div>
          <label htmlFor="interestRate" className="block text-sm font-medium text-white-secondary mb-1">
            Taxa de Juros Anual (%) <span className="text-xs opacity-70">(opcional)</span>
          </label>
          <input
            type="number"
            id="interestRate"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            step="0.01"
            min="0"
            className={`w-full bg-bg-primary border ${
              errors.interestRate ? 'border-red-500' : 'border-bg-tertiary'
            } rounded-lg p-2.5 text-white-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/50`}
            placeholder="0,00"
          />
          {errors.interestRate && (
            <p className="mt-1 text-sm text-red-500 flex items-center">
              <AlertCircle className="w-3 h-3 mr-1" />
              {errors.interestRate}
            </p>
          )}
        </div>

        {/* Notas (opcional) */}
        <div className="md:col-span-2">
          <label htmlFor="notes" className="block text-sm font-medium text-white-secondary mb-1">
            Notas <span className="text-xs opacity-70">(opcional)</span>
          </label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full bg-bg-primary border border-bg-tertiary rounded-lg p-2.5 text-white-primary focus:outline-none focus:ring-2 focus:ring-purple-primary/50"
            placeholder="Informações adicionais sobre o investimento..."
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-bg-secondary text-white-secondary rounded-lg hover:bg-bg-secondary transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-purple-primary text-white-primary rounded-lg hover:bg-opacity-90 transition-colors"
        >
          {editingInvestment ? 'Atualizar' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
};

export default InvestmentForm; 