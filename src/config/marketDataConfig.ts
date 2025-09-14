// Market Data Configuration
// Choose your data source and configure API keys here

export type DataSource = 'simulated' | 'alpha-vantage' | 'yahoo-finance' | 'iex-cloud'

export interface MarketDataConfig {
  dataSource: DataSource
  apiKey?: string
  updateInterval: number // in milliseconds
  enableNews: boolean
  enableRealTime: boolean
}

// Default configuration (using simulated data)
export const defaultConfig: MarketDataConfig = {
  dataSource: 'simulated',
  updateInterval: 2000, // 2 seconds for simulated data
  enableNews: true,
  enableRealTime: true
}

// Production configuration examples
export const alphaVantageConfig: MarketDataConfig = {
  dataSource: 'alpha-vantage',
  apiKey: 'YOUR_ALPHA_VANTAGE_API_KEY', // Get free key at https://www.alphavantage.co/support/#api-key
  updateInterval: 60000, // 1 minute (due to rate limits)
  enableNews: true,
  enableRealTime: true
}

export const yahooFinanceConfig: MarketDataConfig = {
  dataSource: 'yahoo-finance',
  updateInterval: 30000, // 30 seconds
  enableNews: false, // Yahoo Finance doesn't provide news in their free API
  enableRealTime: true
}

export const iexCloudConfig: MarketDataConfig = {
  dataSource: 'iex-cloud',
  apiKey: 'YOUR_IEX_CLOUD_API_KEY', // Get key at https://iexcloud.io/
  updateInterval: 10000, // 10 seconds
  enableNews: true,
  enableRealTime: true
}

// Current configuration (change this to switch data sources)
export const currentConfig: MarketDataConfig = {
  dataSource: 'yahoo-finance',
  updateInterval: 0, // No auto-refresh
  enableNews: false, // Yahoo Finance doesn't provide news in their free API
  enableRealTime: false // Manual refresh only
}

// Helper function to get the appropriate service
export function getMarketDataService() {
  switch (currentConfig.dataSource) {
    case 'alpha-vantage':
      return import('../services/realMarketDataService').then(m => m.realMarketDataService)
    case 'yahoo-finance':
      return import('../services/yahooFinanceService').then(m => m.yahooFinanceService)
    case 'iex-cloud':
      return import('../services/iexCloudService').then(m => m.iexCloudService)
    case 'simulated':
    default:
      return import('../services/realTimeService').then(m => m.realTimeService)
  }
}
