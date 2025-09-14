import { Portfolio, Asset, Holding, Transaction } from '../types/index.js';

export const sampleAssets: Asset[] = [
  {
    id: '1',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 175.43,
    currency: 'USD',
    change24h: 2.15,
    changePercent24h: 1.24,
  },
  {
    id: '2',
    symbol: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 142.56,
    currency: 'USD',
    change24h: -1.23,
    changePercent24h: -0.85,
  },
  {
    id: '3',
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 378.85,
    currency: 'USD',
    change24h: 4.32,
    changePercent24h: 1.15,
  },
  {
    id: '4',
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    currentPrice: 248.50,
    currency: 'USD',
    change24h: -5.67,
    changePercent24h: -2.23,
  },
  {
    id: '5',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    currentPrice: 875.28,
    currency: 'USD',
    change24h: 12.45,
    changePercent24h: 1.44,
  },
];

export const sampleHoldings: Holding[] = [
  {
    id: '1',
    asset: sampleAssets[0], // AAPL
    quantity: 50,
    averagePrice: 165.20,
    totalCost: 8260.00,
    currentValue: 8771.50,
    gainLoss: 511.50,
    gainLossPercent: 6.19,
  },
  {
    id: '2',
    asset: sampleAssets[1], // GOOGL
    quantity: 25,
    averagePrice: 138.90,
    totalCost: 3472.50,
    currentValue: 3564.00,
    gainLoss: 91.50,
    gainLossPercent: 2.64,
  },
  {
    id: '3',
    asset: sampleAssets[2], // MSFT
    quantity: 15,
    averagePrice: 365.40,
    totalCost: 5481.00,
    currentValue: 5682.75,
    gainLoss: 201.75,
    gainLossPercent: 3.68,
  },
  {
    id: '4',
    asset: sampleAssets[3], // TSLA
    quantity: 20,
    averagePrice: 275.80,
    totalCost: 5516.00,
    currentValue: 4970.00,
    gainLoss: -546.00,
    gainLossPercent: -9.90,
  },
  {
    id: '5',
    asset: sampleAssets[4], // NVDA
    quantity: 5,
    averagePrice: 820.15,
    totalCost: 4100.75,
    currentValue: 4376.40,
    gainLoss: 275.65,
    gainLossPercent: 6.72,
  },
];

export const sampleTransactions: Transaction[] = [
  {
    id: '1',
    asset: sampleAssets[0], // AAPL
    type: 'buy',
    quantity: 50,
    price: 165.20,
    totalAmount: 8260.00,
    date: new Date('2024-01-15'),
    fees: 9.95,
    notes: 'Initial purchase',
  },
  {
    id: '2',
    asset: sampleAssets[1], // GOOGL
    type: 'buy',
    quantity: 25,
    price: 138.90,
    totalAmount: 3472.50,
    date: new Date('2024-02-10'),
    fees: 9.95,
    notes: 'DCA strategy',
  },
  {
    id: '3',
    asset: sampleAssets[2], // MSFT
    type: 'buy',
    quantity: 15,
    price: 365.40,
    totalAmount: 5481.00,
    date: new Date('2024-02-20'),
    fees: 9.95,
    notes: 'Tech sector allocation',
  },
  {
    id: '4',
    asset: sampleAssets[3], // TSLA
    type: 'buy',
    quantity: 20,
    price: 275.80,
    totalAmount: 5516.00,
    date: new Date('2024-03-05'),
    fees: 9.95,
    notes: 'EV exposure',
  },
  {
    id: '5',
    asset: sampleAssets[4], // NVDA
    type: 'buy',
    quantity: 5,
    price: 820.15,
    totalAmount: 4100.75,
    date: new Date('2024-03-15'),
    fees: 9.95,
    notes: 'AI play',
  },
];

export const samplePortfolio: Portfolio = {
  id: '1',
  name: 'My Investment Portfolio',
  totalValue: 27364.65,
  totalCost: 26830.25,
  totalGainLoss: 534.40,
  totalGainLossPercent: 1.99,
  holdings: sampleHoldings,
  transactions: sampleTransactions,
  lastUpdated: new Date(),
};
