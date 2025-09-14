import { Holding, Portfolio, PerformanceData } from '../types/index';

export const calculateHoldingValue = (holding: Holding): number => {
  return holding.quantity * holding.asset.currentPrice;
};

export const calculateGainLoss = (holding: Holding): number => {
  return calculateHoldingValue(holding) - holding.totalCost;
};

export const calculateGainLossPercent = (holding: Holding): number => {
  if (holding.totalCost === 0) return 0;
  return (calculateGainLoss(holding) / holding.totalCost) * 100;
};

export const calculatePortfolioValue = (holdings: Holding[]): number => {
  return holdings.reduce((total, holding) => total + calculateHoldingValue(holding), 0);
};

export const calculatePortfolioCost = (holdings: Holding[]): number => {
  return holdings.reduce((total, holding) => total + holding.totalCost, 0);
};

export const calculatePortfolioGainLoss = (portfolio: Portfolio): number => {
  return portfolio.totalValue - portfolio.totalCost;
};

export const calculatePortfolioGainLossPercent = (portfolio: Portfolio): number => {
  if (portfolio.totalCost === 0) return 0;
  return (calculatePortfolioGainLoss(portfolio) / portfolio.totalCost) * 100;
};

export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

export const formatPercent = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const generatePerformanceData = (portfolio: Portfolio, days: number = 30): PerformanceData[] => {
  const data: PerformanceData[] = [];
  const today = new Date();
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Simulate portfolio value changes (in a real app, this would come from historical data)
    const baseValue = portfolio.totalValue;
    const randomChange = (Math.random() - 0.5) * 0.1; // ±5% random change
    const value = baseValue * (1 + randomChange * (i / days));
    const gainLoss = value - portfolio.totalCost;
    const gainLossPercent = portfolio.totalCost > 0 ? (gainLoss / portfolio.totalCost) * 100 : 0;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.round(value * 100) / 100,
      gainLoss: Math.round(gainLoss * 100) / 100,
      gainLossPercent: Math.round(gainLossPercent * 100) / 100,
    });
  }
  
  return data;
};
