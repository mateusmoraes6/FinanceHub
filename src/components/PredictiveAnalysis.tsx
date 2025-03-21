import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AlertTriangle, TrendingUp, ArrowDown, PieChart } from 'lucide-react';
import type { Transaction } from '../types/finance';

interface PredictiveAnalysisProps {
  transactions: Transaction[];
}

interface CategoryPrediction {
  category: string;
  actualAmount: number;
  predictedAmount: number;
  trend: 'increase' | 'decrease' | 'stable';
  percentage: number;
}

const PredictiveAnalysis: React.FC<PredictiveAnalysisProps> = ({ transactions }) => {
  // Helper para obter o mês e ano de uma data
  const getMonthYear = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  // Agrupa transações por mês e categoria
  const monthlyExpenses = useMemo(() => {
    const expenseTransactions = transactions.filter(t => t.type === 'expense');
    
    return expenseTransactions.reduce((acc, transaction) => {
      const monthYear = getMonthYear(transaction.date);
      
      if (!acc[monthYear]) {
        acc[monthYear] = {};
      }
      
      if (!acc[monthYear][transaction.category]) {
        acc[monthYear][transaction.category] = 0;
      }
      
      acc[monthYear][transaction.category] += transaction.amount;
      
      return acc;
    }, {} as Record<string, Record<string, number>>);
  }, [transactions]);

  // Calcula previsões baseadas em tendências de gastos
  const predictions = useMemo(() => {
    const months = Object.keys(monthlyExpenses).sort((a, b) => {
      const [monthA, yearA] = a.split('/').map(Number);
      const [monthB, yearB] = b.split('/').map(Number);
      return yearA !== yearB ? yearA - yearB : monthA - monthB;
    });
    
    if (months.length < 2) return [];
    
    // Obtém o mês atual e o anterior para comparação
    const currentMonth = months[months.length - 1];
    const previousMonth = months[months.length - 2];
    
    const currentCategories = Object.keys(monthlyExpenses[currentMonth]);
    
    const predictions: CategoryPrediction[] = currentCategories.map(category => {
      const currentAmount = monthlyExpenses[currentMonth][category] || 0;
      const previousAmount = monthlyExpenses[previousMonth]?.[category] || 0;
      
      let predictedAmount = currentAmount;
      let trend: 'increase' | 'decrease' | 'stable' = 'stable';
      let percentage = 0;
      
      // Calcula tendência e previsão
      if (previousAmount > 0) {
        const change = currentAmount - previousAmount;
        percentage = Math.round((change / previousAmount) * 100);
        
        if (percentage > 5) {
          trend = 'increase';
          // Prevê um aumento continuado
          predictedAmount = currentAmount * 1.1;
        } else if (percentage < -5) {
          trend = 'decrease';
          // Prevê uma redução continuada
          predictedAmount = currentAmount * 0.9;
        }
      }
      
      return {
        category,
        actualAmount: currentAmount,
        predictedAmount,
        trend,
        percentage: Math.abs(percentage)
      };
    });
    
    return predictions.sort((a, b) => b.predictedAmount - a.predictedAmount);
  }, [monthlyExpenses]);

  // Dados para o gráfico de tendências
  const chartData = useMemo(() => {
    const months = Object.keys(monthlyExpenses).sort((a, b) => {
      const [monthA, yearA] = a.split('/').map(Number);
      const [monthB, yearB] = b.split('/').map(Number);
      return yearA !== yearB ? yearA - yearB : monthA - monthB;
    });
    
    // Seleciona os últimos 6 meses no máximo
    const recentMonths = months.slice(-6);
    
    // Cria dados para o gráfico
    return recentMonths.map(month => {
      const monthData: any = { month };
      
      Object.keys(monthlyExpenses[month]).forEach(category => {
        monthData[category] = monthlyExpenses[month][category];
      });
      
      return monthData;
    });
  }, [monthlyExpenses]);

  // Obtém as categorias principais para o gráfico
  const topCategories = useMemo(() => {
    if (predictions.length === 0) return [];
    
    return predictions
      .slice(0, 3)
      .map(p => p.category);
  }, [predictions]);

  // Gera cores para as categorias
  const getCategoryColor = (index: number) => {
    const colors = ['#00E676', '#FF5252', '#7B61FF', '#FFD600', '#00B0FF'];
    return colors[index % colors.length];
  };

  // Verifica se há alertas de gastos
  const expenseAlerts = useMemo(() => {
    return predictions
      .filter(p => p.trend === 'increase' && p.percentage > 20)
      .sort((a, b) => b.percentage - a.percentage);
  }, [predictions]);

  return (
    <div className="card animate-slideIn">
      <div className="card-header">
        <h2 className="text-xl font-semibold text-white-primary mb-1">Análise Preditiva de Gastos</h2>
        <p className="text-gray-light text-sm">Tendências previstas com base nos seus padrões de gastos</p>
      </div>
      <div className="card-body">
        {transactions.length > 2 ? (
          <>
            {expenseAlerts.length > 0 && (
              <div className="bg-bg-tertiary/50 border border-bg-tertiary rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-red-alert/20 rounded-full">
                    <AlertTriangle className="w-5 h-5 text-red-alert" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white-primary mb-1">Alerta de Aumento de Gastos</h3>
                    <p className="text-gray-light text-sm mb-3">
                      Detectamos aumento significativo nas seguintes categorias:
                    </p>
                    <div className="space-y-2">
                      {expenseAlerts.slice(0, 3).map((alert, index) => (
                        <div key={index} className="flex items-center justify-between bg-bg-tertiary p-3 rounded-md">
                          <span className="text-white-primary">{alert.category}</span>
                          <span className="text-red-alert font-medium">+{alert.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="font-medium text-white-primary mb-3">Tendências de Gastos</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: 20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                    <XAxis 
                      dataKey="month" 
                      stroke="#B0B0B0"
                      tick={{ fill: '#B0B0B0' }}
                    />
                    <YAxis
                      stroke="#B0B0B0"
                      tick={{ fill: '#B0B0B0' }}
                      tickFormatter={(value) =>
                        new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                          notation: 'compact',
                        }).format(value)
                      }
                    />
                    <Tooltip 
                      formatter={(value) => 
                        new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL'
                        }).format(Number(value))
                      }
                    />
                    <Legend />
                    {topCategories.map((category, index) => (
                      <Line
                        key={category}
                        type="monotone"
                        dataKey={category}
                        stroke={getCategoryColor(index)}
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2, stroke: getCategoryColor(index), fill: '#121212' }}
                        activeDot={{ r: 6, strokeWidth: 2, stroke: getCategoryColor(index), fill: '#121212' }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-white-primary mb-3">Previsões para o Próximo Mês</h3>
              <div className="space-y-4">
                {predictions.slice(0, 5).map((prediction, index) => (
                  <div key={index} className="bg-bg-tertiary/50 rounded-lg p-4 border border-bg-tertiary">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-white-primary">{prediction.category}</span>
                      <div className="flex items-center space-x-1">
                        {prediction.trend === 'increase' ? (
                          <TrendingUp className="w-4 h-4 text-red-alert" />
                        ) : prediction.trend === 'decrease' ? (
                          <ArrowDown className="w-4 h-4 text-green-primary" />
                        ) : (
                          <PieChart className="w-4 h-4 text-turquoise" />
                        )}
                        <span 
                          className={
                            prediction.trend === 'increase' 
                              ? 'text-red-alert' 
                              : prediction.trend === 'decrease'
                                ? 'text-green-primary'
                                : 'text-turquoise'
                          }
                        >
                          {prediction.trend === 'increase' && '+'}
                          {prediction.trend === 'decrease' && '-'}
                          {prediction.percentage}%
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between text-sm">
                      <div>
                        <span className="text-gray-light">Atual:</span>
                        <span className="numeric-table ml-2 text-white-primary">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(prediction.actualAmount)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-light">Previsto:</span>
                        <span className="numeric-table ml-2 text-white-primary">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL'
                          }).format(prediction.predictedAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center">
            <div className="p-4 rounded-full bg-bg-tertiary mb-4">
              <TrendingUp className="w-12 h-12 text-gray-medium opacity-50" />
            </div>
            <h3 className="text-gray-light font-medium mb-2">Dados insuficientes para análise</h3>
            <p className="text-gray-medium text-sm max-w-md">
              Adicione mais transações para que possamos analisar seus padrões de gastos e fazer previsões
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictiveAnalysis; 