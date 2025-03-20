import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import type { Transaction } from '../types/finance';

interface TransactionChartProps {
  transactions: Transaction[];
}

const TransactionChart: React.FC<TransactionChartProps> = ({ transactions }) => {
  const chartData = transactions
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc: any[], transaction) => {
      const date = new Date(transaction.date).toLocaleDateString('pt-BR');
      const existingData = acc.find(item => item.date === date);

      if (existingData) {
        switch (transaction.type) {
          case 'income':
            existingData.income += transaction.amount;
            break;
          case 'expense':
            existingData.expenses += transaction.amount;
            break;
          case 'investment':
            existingData.investments += transaction.amount;
            break;
        }
      } else {
        acc.push({
          date,
          income: transaction.type === 'income' ? transaction.amount : 0,
          expenses: transaction.type === 'expense' ? transaction.amount : 0,
          investments: transaction.type === 'investment' ? transaction.amount : 0,
        });
      }

      return acc;
    }, []);

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
                   entry.name === 'expenses' ? 'Despesas' : 'Investimentos'}
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
    <div className="card animate-slideIn">
      <div className="card-header">
        <h2 className="text-xl font-semibold text-white-primary mb-1">Evolução Financeira</h2>
        <p className="text-gray-light text-sm">Acompanhe o histórico das suas movimentações</p>
      </div>
      <div className="card-body">
        <div className="h-[400px] w-full">
          {transactions.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E676" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#00E676" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF5252" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#FF5252" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorInvestments" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7B61FF" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#7B61FF" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2D2D2D" />
                <XAxis
                  dataKey="date"
                  stroke="#B0B0B0"
                  tick={{ fill: '#B0B0B0' }}
                  tickMargin={10}
                />
                <YAxis
                  stroke="#B0B0B0"
                  tick={{ fill: '#B0B0B0' }}
                  tickMargin={10}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                      notation: 'compact',
                    }).format(value)
                  }
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{ paddingTop: '1rem' }}
                  formatter={(value) => {
                    const labels = {
                      income: 'Receitas',
                      expenses: 'Despesas',
                      investments: 'Investimentos',
                    };
                    return <span className="text-gray-light">{labels[value as keyof typeof labels]}</span>;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  stroke="#00E676"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorIncome)"
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#00E676', fill: '#121212' }}
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#FF5252"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorExpenses)"
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#FF5252', fill: '#121212' }}
                />
                <Area
                  type="monotone"
                  dataKey="investments"
                  stroke="#7B61FF"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorInvestments)"
                  activeDot={{ r: 6, strokeWidth: 2, stroke: '#7B61FF', fill: '#121212' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <svg className="w-16 h-16 text-gray-medium mb-3 opacity-30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 21H4.6C4.03995 21 3.75992 21 3.54601 20.891C3.35785 20.7951 3.20487 20.6422 3.10899 20.454C3 20.2401 3 19.9601 3 19.4V3M21 7L15.5657 12.4343C15.3677 12.6323 15.2687 12.7313 15.1545 12.7684C15.0541 12.8011 14.9459 12.8011 14.8455 12.7684C14.7313 12.7313 14.6323 12.6323 14.4343 12.4343L12.5657 10.5657C12.3677 10.3677 12.2687 10.2687 12.1545 10.2316C12.0541 10.1989 11.9459 10.1989 11.8455 10.2316C11.7313 10.2687 11.6323 10.3677 11.4343 10.5657L7 15M21 7H17M21 7V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <h3 className="text-gray-light font-medium mb-1">Sem dados para mostrar</h3>
              <p className="text-gray-medium text-sm max-w-md">
                Adicione transações para visualizar os gráficos de evolução financeira
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionChart;