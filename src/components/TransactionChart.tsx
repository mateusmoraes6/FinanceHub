import React, { useState, useEffect } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { Transaction } from '../types/finance';

interface TransactionChartProps {
  transactions: Transaction[];
}

const processTransactions = (transactions: Transaction[]) => {
  const monthlyData: Record<string, { month: string, income: number, expenses: number }> = {};
  
  // Processar transações para dados mensais
  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!monthlyData[monthYear]) {
      monthlyData[monthYear] = {
        month: monthYear,
        income: 0,
        expenses: 0,
      };
    }
    
    const existingData = monthlyData[monthYear];
    
    switch (transaction.type) {
      case 'income':
        existingData.income += transaction.amount;
        break;
      case 'expense':
        existingData.expenses += transaction.amount;
        break;
    }
  });
  
  // Converter para array e ordenar por data
  return Object.values(monthlyData).map(data => ({
    ...data,
    balance: data.income - data.expenses,
  })).sort((a, b) => {
    const [aMonth, aYear] = a.month.split('/').map(Number);
    const [bMonth, bYear] = b.month.split('/').map(Number);
    
    if (aYear !== bYear) return aYear - bYear;
    return aMonth - bMonth;
  });
};

const TransactionChart: React.FC<TransactionChartProps> = ({ transactions }) => {
  const [chartPeriod, setChartPeriod] = useState<'monthly' | 'all'>('monthly');
  const chartData = processTransactions(transactions);

  // Estilo customizado para tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-secondary p-4 border border-bg-tertiary rounded-lg shadow-lg">
          <p className="text-gray-light mb-2 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-4 mb-1">
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-white-primary text-sm">
                  {entry.name === 'income' ? 'Receitas' : 
                   entry.name === 'expenses' ? 'Despesas' : 'Saldo'}
                </span>
              </div>
              <span className="numeric-table text-white-primary">
                {new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(entry.value)}
              </span>
            </div>
          ))}
        </div>
      );
    }
  
    return null;
  };

  return (
    <div className="bg-bg-secondary rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-white-primary mb-6">Histórico Financeiro</h2>
      
      <div className="flex space-x-4 mb-6">
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            chartPeriod === 'monthly' ? 'bg-purple-primary text-white-primary' : 'bg-bg-tertiary text-white-secondary'
          }`}
          onClick={() => setChartPeriod('monthly')}
        >
          Mensal
        </button>
        <button
          className={`px-4 py-2 rounded-lg transition-colors ${
            chartPeriod === 'all' ? 'bg-purple-primary text-white-primary' : 'bg-bg-tertiary text-white-secondary'
          }`}
          onClick={() => setChartPeriod('all')}
        >
          Todos os Períodos
        </button>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            <defs>
              <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00E676" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#00E676" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FF5252" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#FF5252" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
            <XAxis 
              dataKey="month" 
              tick={{ fill: '#E5E7EB' }}
              axisLine={{ stroke: '#4B5563' }}
            />
            <YAxis 
              tick={{ fill: '#E5E7EB' }}
              axisLine={{ stroke: '#4B5563' }}
              tickFormatter={(value) => `R$ ${value}`}
            />
            <Tooltip 
              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, undefined]}
              labelFormatter={(label) => `Mês: ${label}`}
              contentStyle={{ backgroundColor: '#1F2937', borderColor: '#4B5563', color: '#E5E7EB' }}
            />
            <Legend 
              formatter={(value) => value === 'income' ? 'Receitas' : value === 'expenses' ? 'Despesas' : 'Saldo'}
            />
            <Area 
              type="monotone" 
              dataKey="income" 
              name="Receitas"
              stroke="#00E676" 
              fillOpacity={1} 
              fill="url(#colorIncome)" 
            />
            <Area 
              type="monotone" 
              dataKey="expenses" 
              name="Despesas"
              stroke="#FF5252" 
              fillOpacity={1} 
              fill="url(#colorExpenses)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TransactionChart;