import React, { useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Plus, TrendingUp, Percent, ChevronsUp, AlertCircle, PieChart, BarChart, Clock } from 'lucide-react';
import type { Investment, InvestmentPerformance, RiskLevel, InvestmentType } from '../types/finance';
import InvestmentForm from './InvestmentForm';

// Registrar componentes do Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

interface InvestmentDashboardProps {
  investments: Investment[];
  onAddInvestment: (investment: Omit<Investment, 'id'>) => void;
  onUpdateInvestment: (investment: Investment) => void;
  onDeleteInvestment: (id: string) => void;
}

const InvestmentDashboard: React.FC<InvestmentDashboardProps> = ({
  investments,
  onAddInvestment,
  onUpdateInvestment,
  onDeleteInvestment
}) => {
  const [showForm, setShowForm] = useState(false);
  const [editingInvestment, setEditingInvestment] = useState<Investment | undefined>();
  const [activeTab, setActiveTab] = useState<'overview' | 'list' | 'allocation'>('overview');

  // Calcular performance geral dos investimentos
  const performance: InvestmentPerformance = {
    totalInvested: investments.reduce((sum, inv) => sum + inv.amount, 0),
    currentValue: investments.reduce((sum, inv) => sum + inv.currentValue, 0),
    absoluteReturn: 0,
    percentageReturn: 0,
    inflation: 5.0, // Valor fixo para exemplo
    realReturn: 0
  };

  // Calcular retorno absoluto e percentual
  performance.absoluteReturn = performance.currentValue - performance.totalInvested;
  performance.percentageReturn = performance.totalInvested > 0 
    ? (performance.absoluteReturn / performance.totalInvested) * 100 
    : 0;
  performance.realReturn = performance.percentageReturn - performance.inflation;

  // Preparar dados para o gráfico de alocação por tipo
  const allocationByType = investments.reduce((acc, inv) => {
    acc[inv.type] = (acc[inv.type] || 0) + inv.currentValue;
    return acc;
  }, {} as Record<InvestmentType, number>);

  const typeLabels: Record<InvestmentType, string> = {
    stock: 'Ações',
    bond: 'Renda Fixa',
    real_estate: 'Imóveis',
    crypto: 'Criptomoedas',
    other: 'Outros'
  };

  const typeColors: Record<InvestmentType, string> = {
    stock: '#4361EE',
    bond: '#3A0CA3',
    real_estate: '#7209B7',
    crypto: '#F72585',
    other: '#480CA8'
  };

  const pieChartData = {
    labels: Object.keys(allocationByType).map(type => typeLabels[type as InvestmentType]),
    datasets: [
      {
        data: Object.values(allocationByType),
        backgroundColor: Object.keys(allocationByType).map(type => typeColors[type as InvestmentType]),
        borderColor: '#1F2938',
        borderWidth: 2,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#E5E7EB',
          font: {
            family: 'Inter',
            size: 12,
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const percentage = ((value / performance.currentValue) * 100).toFixed(1);
            return `${context.label}: R$ ${value.toLocaleString('pt-BR')} (${percentage}%)`;
          }
        }
      }
    },
  };

  // Preparar dados para o gráfico de alocação por risco
  const allocationByRisk = investments.reduce((acc, inv) => {
    acc[inv.riskLevel] = (acc[inv.riskLevel] || 0) + inv.currentValue;
    return acc;
  }, {} as Record<RiskLevel, number>);

  const riskLabels: Record<RiskLevel, string> = {
    low: 'Baixo Risco',
    medium: 'Risco Médio',
    high: 'Alto Risco'
  };

  const riskColors: Record<RiskLevel, string> = {
    low: '#00E676',
    medium: '#FFAB00',
    high: '#F44336'
  };

  const barChartData = {
    labels: Object.keys(allocationByRisk).map(risk => riskLabels[risk as RiskLevel]),
    datasets: [
      {
        label: 'Alocação por Risco',
        data: Object.values(allocationByRisk),
        backgroundColor: Object.keys(allocationByRisk).map(risk => riskColors[risk as RiskLevel]),
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#2D3748',
        },
        ticks: {
          color: '#E5E7EB',
          font: {
            family: 'Inter',
          },
          callback: function(value: any) {
            return `R$ ${value.toLocaleString('pt-BR')}`;
          }
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#E5E7EB',
          font: {
            family: 'Inter',
          }
        }
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw;
            const percentage = ((value / performance.currentValue) * 100).toFixed(1);
            return `Valor: R$ ${value.toLocaleString('pt-BR')} (${percentage}%)`;
          }
        }
      }
    },
  };

  // Ordenar investimentos por valor atual (do maior ao menor)
  const sortedInvestments = [...investments].sort((a, b) => b.currentValue - a.currentValue);

  const handleAddInvestmentClick = () => {
    setEditingInvestment(undefined);
    setShowForm(!showForm);
  };

  const handleEditInvestment = (investment: Investment) => {
    setEditingInvestment(investment);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setEditingInvestment(undefined);
    setShowForm(false);
  };

  return (
    <div className="bg-bg-secondary rounded-2xl shadow-lg p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white-primary flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-turquoise" />
          Dashboard de Investimentos
        </h2>
        <button
          className="flex items-center px-4 py-2 bg-purple-primary text-white-primary rounded-lg hover:bg-opacity-90 transition-all duration-300"
          onClick={handleAddInvestmentClick}
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Investimento
        </button>
      </div>

      {/* Navegação por abas */}
      <div className="flex border-b border-bg-tertiary mb-6">
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors duration-300 ${
            activeTab === 'overview' 
              ? 'text-turquoise border-b-2 border-turquoise' 
              : 'text-white-secondary hover:text-white-primary'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Visão Geral
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors duration-300 ${
            activeTab === 'allocation' 
              ? 'text-turquoise border-b-2 border-turquoise' 
              : 'text-white-secondary hover:text-white-primary'
          }`}
          onClick={() => setActiveTab('allocation')}
        >
          Alocação
        </button>
        <button
          className={`px-4 py-2 font-medium text-sm transition-colors duration-300 ${
            activeTab === 'list' 
              ? 'text-turquoise border-b-2 border-turquoise' 
              : 'text-white-secondary hover:text-white-primary'
          }`}
          onClick={() => setActiveTab('list')}
        >
          Investimentos
        </button>
      </div>

      {/* Visão Geral */}
      {activeTab === 'overview' && (
        <>
          {/* Cards de resumo de desempenho */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-bg-tertiary rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white-secondary text-sm">Total Investido</span>
                <TrendingUp className="w-5 h-5 text-turquoise" />
              </div>
              <div className="text-xl font-semibold text-white-primary">
                R$ {performance.totalInvested.toLocaleString('pt-BR')}
              </div>
            </div>
            
            <div className="bg-bg-tertiary rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white-secondary text-sm">Valor Atual</span>
                <PieChart className="w-5 h-5 text-purple-primary" />
              </div>
              <div className="text-xl font-semibold text-white-primary">
                R$ {performance.currentValue.toLocaleString('pt-BR')}
              </div>
            </div>
            
            <div className="bg-bg-tertiary rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white-secondary text-sm">Retorno Total</span>
                <Percent className="w-5 h-5 text-green-bright" />
              </div>
              <div className={`text-xl font-semibold ${performance.percentageReturn >= 0 ? 'text-green-bright' : 'text-red-500'}`}>
                {performance.percentageReturn.toFixed(2)}%
                <span className="text-white-secondary text-sm ml-2">
                  (R$ {performance.absoluteReturn.toLocaleString('pt-BR')})
                </span>
              </div>
            </div>
            
            <div className="bg-bg-tertiary rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white-secondary text-sm">Retorno Real</span>
                <AlertCircle className="w-5 h-5 text-yellow-primary" />
              </div>
              <div className={`text-xl font-semibold ${performance.realReturn >= 0 ? 'text-green-bright' : 'text-red-500'}`}>
                {performance.realReturn.toFixed(2)}%
                <span className="text-white-secondary text-sm ml-2">
                  (Inflação: {performance.inflation.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>

          {/* Top Investimentos */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white-primary mb-4">Top Investimentos</h3>
            <div className="bg-bg-tertiary rounded-xl p-4">
              {sortedInvestments.slice(0, 5).map((investment) => (
                <div key={investment.id} className="flex items-center justify-between py-3 border-b border-bg-secondary last:border-0">
                  <div>
                    <div className="font-medium text-white-primary">{investment.name}</div>
                    <div className="text-sm text-white-secondary">{typeLabels[investment.type]}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-white-primary">
                      R$ {investment.currentValue.toLocaleString('pt-BR')}
                    </div>
                    <div className={`text-sm ${
                      (investment.currentValue - investment.amount) >= 0 
                        ? 'text-green-bright' 
                        : 'text-red-500'
                    }`}>
                      {((investment.currentValue - investment.amount) / investment.amount * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
              ))}
              
              {investments.length === 0 && (
                <div className="py-4 text-center text-white-secondary">
                  Nenhum investimento encontrado. Adicione seu primeiro investimento!
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Alocação */}
      {activeTab === 'allocation' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-bg-tertiary rounded-xl p-4">
            <h3 className="text-lg font-medium text-white-primary mb-4 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-purple-primary" />
              Alocação por Tipo
            </h3>
            <div className="h-80">
              {investments.length > 0 ? (
                <Pie data={pieChartData} options={pieChartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-white-secondary">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-bg-tertiary rounded-xl p-4">
            <h3 className="text-lg font-medium text-white-primary mb-4 flex items-center">
              <BarChart className="w-5 h-5 mr-2 text-yellow-primary" />
              Alocação por Risco
            </h3>
            <div className="h-80">
              {investments.length > 0 ? (
                <Bar data={barChartData} options={barChartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-white-secondary">
                  Nenhum dado disponível
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Lista de Investimentos */}
      {activeTab === 'list' && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-bg-tertiary">
                <th className="text-left py-3 px-4 text-white-secondary font-medium">Nome</th>
                <th className="text-left py-3 px-4 text-white-secondary font-medium">Tipo</th>
                <th className="text-left py-3 px-4 text-white-secondary font-medium">Risco</th>
                <th className="text-right py-3 px-4 text-white-secondary font-medium">Valor Investido</th>
                <th className="text-right py-3 px-4 text-white-secondary font-medium">Valor Atual</th>
                <th className="text-right py-3 px-4 text-white-secondary font-medium">Retorno</th>
                <th className="text-center py-3 px-4 text-white-secondary font-medium">Ações</th>
              </tr>
            </thead>
            <tbody>
              {sortedInvestments.map((investment) => {
                const returnAmount = investment.currentValue - investment.amount;
                const returnPercentage = (returnAmount / investment.amount) * 100;
                
                return (
                  <tr key={investment.id} className="border-b border-bg-tertiary hover:bg-bg-tertiary transition-colors">
                    <td className="py-3 px-4 text-white-primary font-medium">{investment.name}</td>
                    <td className="py-3 px-4 text-white-secondary">{typeLabels[investment.type]}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                        investment.riskLevel === 'low' ? 'bg-green-bright/20 text-green-bright' :
                        investment.riskLevel === 'medium' ? 'bg-yellow-primary/20 text-yellow-primary' :
                        'bg-red-500/20 text-red-500'
                      }`}>
                        {riskLabels[investment.riskLevel]}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-white-secondary">
                      R$ {investment.amount.toLocaleString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-right text-white-primary">
                      R$ {investment.currentValue.toLocaleString('pt-BR')}
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      returnAmount >= 0 ? 'text-green-bright' : 'text-red-500'
                    }`}>
                      {returnPercentage.toFixed(2)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          className="p-1.5 rounded bg-bg-primary hover:bg-purple-primary/20 transition-colors"
                          onClick={() => handleEditInvestment(investment)}
                        >
                          <svg className="w-4 h-4 text-white-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          className="p-1.5 rounded bg-bg-primary hover:bg-red-500/20 transition-colors"
                          onClick={() => onDeleteInvestment(investment.id)}
                        >
                          <svg className="w-4 h-4 text-white-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              
              {investments.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-white-secondary">
                    Nenhum investimento encontrado. Adicione seu primeiro investimento!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Formulário de investimentos */}
      {showForm && (
        <div className="mt-6 bg-bg-tertiary rounded-xl p-6 animate-fadeIn">
          <InvestmentForm 
            onAddInvestment={onAddInvestment}
            onUpdateInvestment={onUpdateInvestment}
            onCancel={handleCancelForm}
            editingInvestment={editingInvestment}
          />
        </div>
      )}
    </div>
  );
};

export default InvestmentDashboard; 