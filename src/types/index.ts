export interface Asset {
  id: string;
  symbol: string;
  name: string;
  currentPrice: number;
  currency: string;
  change24h: number;
  changePercent24h: number;
}

export interface Holding {
  id: string;
  asset: Asset;
  quantity: number;
  averagePrice: number;
  totalCost: number;
  currentValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface Transaction {
  id: string;
  asset: Asset;
  type: 'buy' | 'sell';
  quantity: number;
  price: number;
  totalAmount: number;
  date: Date;
  fees?: number;
  notes?: string;
}

export interface Portfolio {
  id: string;
  name: string;
  totalValue: number;
  totalCost: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdings: Holding[];
  transactions: Transaction[];
  lastUpdated: Date;
}

export interface PerformanceData {
  date: string;
  value: number;
  gainLoss: number;
  gainLossPercent: number;
}
