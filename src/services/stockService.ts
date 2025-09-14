// Stock price service using multiple free APIs
// Primary: Yahoo Finance (via RapidAPI)
// Fallback: Alpha Vantage API
// Demo: Mock data for development

const RAPIDAPI_KEY = 'demo' // Replace with your RapidAPI key
const ALPHA_VANTAGE_KEY = 'demo' // Replace with your Alpha Vantage key

const RAPIDAPI_URL = 'https://yahoo-finance15.p.rapidapi.com/api/v1/markets/stock'
const ALPHA_VANTAGE_URL = 'https://www.alphavantage.co/query'

export interface StockQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  timestamp: Date
}

export const fetchStockPrice = async (symbol: string): Promise<StockQuote | null> => {
  try {
    // Try RapidAPI first (Yahoo Finance)
    if (RAPIDAPI_KEY !== 'demo') {
      const response = await fetch(`${RAPIDAPI_URL}?ticker=${symbol}`, {
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'yahoo-finance15.p.rapidapi.com'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data && data.price) {
          return {
            symbol: symbol.toUpperCase(),
            price: data.price,
            change: data.change || 0,
            changePercent: data.changePercent || 0,
            volume: data.volume || 0,
            timestamp: new Date()
          }
        }
      }
    }
    
    // Fallback to Alpha Vantage
    if (ALPHA_VANTAGE_KEY !== 'demo') {
      const response = await fetch(`${ALPHA_VANTAGE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_KEY}`)
      
      if (response.ok) {
        const data = await response.json()
        
        if (data['Error Message']) {
          console.error('Alpha Vantage Error:', data['Error Message'])
          return getMockStockPrice(symbol)
        }
        
        const quote = data['Global Quote']
        if (quote && quote['01. symbol']) {
          return {
            symbol: quote['01. symbol'],
            price: parseFloat(quote['05. price']),
            change: parseFloat(quote['09. change']),
            changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
            volume: parseInt(quote['06. volume']),
            timestamp: new Date()
          }
        }
      }
    }
    
    // If both APIs fail or are in demo mode, return mock data
    return getMockStockPrice(symbol)
    
  } catch (error) {
    console.error('Error fetching stock price:', error)
    return getMockStockPrice(symbol)
  }
}

// Mock data for demo purposes when API is not available
const getMockStockPrice = (symbol: string): StockQuote => {
  const mockPrices: { [key: string]: { price: number; change: number; changePercent: number } } = {
    // Technology Sector
    'AAPL': { price: 175.43, change: 2.15, changePercent: 1.24 },
    'GOOGL': { price: 142.56, change: -1.23, changePercent: -0.86 },
    'MSFT': { price: 378.85, change: 3.42, changePercent: 0.91 },
    'NVDA': { price: 875.28, change: 12.45, changePercent: 1.44 },
    'META': { price: 485.20, change: 8.75, changePercent: 1.83 },
    'AMZN': { price: 155.23, change: 1.89, changePercent: 1.23 },
    'NFLX': { price: 485.20, change: -2.15, changePercent: -0.44 },
    'ORCL': { price: 125.45, change: 0.85, changePercent: 0.68 },
    'CRM': { price: 245.67, change: 3.21, changePercent: 1.32 },
    'ADBE': { price: 425.80, change: -1.45, changePercent: -0.34 },
    
    // Automotive Sector
    'TSLA': { price: 248.50, change: -5.67, changePercent: -2.23 },
    'F': { price: 12.85, change: 0.15, changePercent: 1.18 },
    'GM': { price: 38.92, change: 0.45, changePercent: 1.17 },
    
    // Financial Sector
    'JPM': { price: 185.67, change: 2.34, changePercent: 1.28 },
    'BAC': { price: 32.45, change: 0.28, changePercent: 0.87 },
    'WFC': { price: 45.23, change: 0.67, changePercent: 1.50 },
    'GS': { price: 425.80, change: 5.23, changePercent: 1.24 },
    
    // Healthcare Sector
    'JNJ': { price: 158.45, change: 0.85, changePercent: 0.54 },
    'PFE': { price: 28.67, change: -0.23, changePercent: -0.80 },
    'UNH': { price: 485.20, change: 3.45, changePercent: 0.72 },
    'ABBV': { price: 165.78, change: 1.23, changePercent: 0.75 },
    
    // Consumer Staples
    'WMT': { price: 165.45, change: 0.85, changePercent: 0.52 },
    'KO': { price: 58.92, change: 0.23, changePercent: 0.39 },
    'PEP': { price: 175.67, change: 0.45, changePercent: 0.26 },
    'PG': { price: 158.34, change: 0.67, changePercent: 0.42 },
    
    // Energy Sector
    'XOM': { price: 115.67, change: 1.23, changePercent: 1.07 },
    'CVX': { price: 165.45, change: 0.85, changePercent: 0.52 },
    'COP': { price: 125.78, change: 0.45, changePercent: 0.36 },
    
    // Industrial Sector
    'BA': { price: 245.67, change: 2.34, changePercent: 0.96 },
    'CAT': { price: 325.45, change: 1.67, changePercent: 0.52 },
    'GE': { price: 165.78, change: 0.85, changePercent: 0.51 },
    
    // Communication Services
    'DIS': { price: 95.67, change: 1.23, changePercent: 1.30 },
    'VZ': { price: 38.45, change: 0.15, changePercent: 0.39 },
    'T': { price: 15.67, change: 0.08, changePercent: 0.51 },
    
    // Real Estate Sector
    'AMT': { price: 195.67, change: 0.85, changePercent: 0.44 },
    'PLD': { price: 125.45, change: 0.67, changePercent: 0.54 },
    
    // Utilities Sector
    'NEE': { price: 75.67, change: 0.23, changePercent: 0.30 },
    'SO': { price: 68.45, change: 0.15, changePercent: 0.22 },
    
    // Materials Sector
    'LIN': { price: 425.80, change: 1.23, changePercent: 0.29 },
    'APD': { price: 285.67, change: 0.85, changePercent: 0.30 },
    
    // Consumer Discretionary
    'HD': { price: 325.45, change: 1.67, changePercent: 0.52 },
    'MCD': { price: 285.67, change: 0.85, changePercent: 0.30 },
    'NKE': { price: 95.67, change: 1.23, changePercent: 1.30 },
    'SBUX': { price: 95.67, change: 0.45, changePercent: 0.47 },
    
    // Semiconductor Sector
    'AMD': { price: 125.45, change: 2.34, changePercent: 1.90 },
    'INTC': { price: 45.67, change: 0.23, changePercent: 0.51 },
    'QCOM': { price: 165.78, change: 1.23, changePercent: 0.75 },
    
    // Biotech Sector
    'GILD': { price: 75.67, change: 0.45, changePercent: 0.60 },
    'AMGN': { price: 285.67, change: 1.23, changePercent: 0.43 },
    'BIIB': { price: 245.67, change: 0.85, changePercent: 0.35 }
  }
  
  const mock = mockPrices[symbol] || { price: 100, change: 0, changePercent: 0 }
  
  return {
    symbol,
    price: mock.price + (Math.random() - 0.5) * 2, // Add some randomness
    change: mock.change + (Math.random() - 0.5) * 0.5,
    changePercent: mock.changePercent + (Math.random() - 0.5) * 0.5,
    volume: Math.floor(Math.random() * 1000000) + 100000,
    timestamp: new Date()
  }
}

export const fetchMultipleStockPrices = async (symbols: string[]): Promise<StockQuote[]> => {
  const promises = symbols.map(symbol => fetchStockPrice(symbol))
  const results = await Promise.all(promises)
  return results.filter((quote): quote is StockQuote => quote !== null)
}
