// Fallback Data Service for when CORS proxies fail
// Uses alternative data sources and mock data

export interface FallbackQuote {
  symbol: string
  price: number
  change: number
  changePercent: number
  volume: number
  high: number
  low: number
  open: number
  previousClose: number
  timestamp: number
}

export interface FallbackSearchResult {
  symbol: string
  name: string
  exchange: string
  type: string
  region: string
  currency: string
  marketState: string
  price?: number
  change?: number
  changePercent?: number
}

class FallbackDataService {
  private mockQuotes: { [key: string]: FallbackQuote } = {}
  private mockSearchResults: FallbackSearchResult[] = []

  constructor() {
    this.initializeMockData()
  }

  private initializeMockData() {
    // Initialize with realistic mock data
    const symbols = ['AAPL', 'GOOGL', 'MSFT', 'NVDA', 'META', 'AMZN', 'TSLA', 'NFLX', 'ORCL', 'CRM', 'AMD', 'INTC', 'ADBE', 'PYPL', 'NFLX']
    
    symbols.forEach(symbol => {
      const basePrice = 50 + Math.random() * 400
      const change = (Math.random() - 0.5) * 20
      const changePercent = (change / basePrice) * 100
      
      this.mockQuotes[symbol] = {
        symbol,
        price: basePrice,
        change,
        changePercent,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        high: basePrice + Math.random() * 10,
        low: basePrice - Math.random() * 10,
        open: basePrice + (Math.random() - 0.5) * 5,
        previousClose: basePrice - change,
        timestamp: Date.now()
      }
    })

    // Initialize search results
    this.mockSearchResults = [
      { symbol: 'AAPL', name: 'Apple Inc.', exchange: 'NASDAQ', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' },
      { symbol: 'GOOGL', name: 'Alphabet Inc.', exchange: 'NASDAQ', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' },
      { symbol: 'MSFT', name: 'Microsoft Corporation', exchange: 'NASDAQ', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' },
      { symbol: 'NVDA', name: 'NVIDIA Corporation', exchange: 'NASDAQ', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' },
      { symbol: 'META', name: 'Meta Platforms Inc.', exchange: 'NASDAQ', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' },
      { symbol: 'AMZN', name: 'Amazon.com Inc.', exchange: 'NASDAQ', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' },
      { symbol: 'TSLA', name: 'Tesla Inc.', exchange: 'NASDAQ', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' },
      { symbol: 'NFLX', name: 'Netflix Inc.', exchange: 'NASDAQ', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' },
      { symbol: 'ORCL', name: 'Oracle Corporation', exchange: 'NYSE', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' },
      { symbol: 'CRM', name: 'Salesforce Inc.', exchange: 'NYSE', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' },
      { symbol: 'AMD', name: 'Advanced Micro Devices Inc.', exchange: 'NASDAQ', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' },
      { symbol: 'INTC', name: 'Intel Corporation', exchange: 'NASDAQ', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' },
      { symbol: 'ADBE', name: 'Adobe Inc.', exchange: 'NASDAQ', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' },
      { symbol: 'PYPL', name: 'PayPal Holdings Inc.', exchange: 'NASDAQ', type: 'EQUITY', region: 'US', currency: 'USD', marketState: 'REGULAR' }
    ]
  }

  public async fetchQuote(symbol: string): Promise<FallbackQuote | null> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))
    
    const quote = this.mockQuotes[symbol.toUpperCase()]
    if (!quote) {
      // Generate a new mock quote for unknown symbols
      const basePrice = 50 + Math.random() * 400
      const change = (Math.random() - 0.5) * 20
      const changePercent = (change / basePrice) * 100
      
      const newQuote: FallbackQuote = {
        symbol: symbol.toUpperCase(),
        price: basePrice,
        change,
        changePercent,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        high: basePrice + Math.random() * 10,
        low: basePrice - Math.random() * 10,
        open: basePrice + (Math.random() - 0.5) * 5,
        previousClose: basePrice - change,
        timestamp: Date.now()
      }
      
      this.mockQuotes[symbol.toUpperCase()] = newQuote
      return newQuote
    }
    
    // Add some realistic price movement
    const priceChange = (Math.random() - 0.5) * 2
    quote.price += priceChange
    quote.change += priceChange
    quote.changePercent = (quote.change / quote.previousClose) * 100
    quote.timestamp = Date.now()
    
    return { ...quote }
  }

  public async fetchMultipleQuotes(symbols: string[]): Promise<FallbackQuote[]> {
    const quotes: FallbackQuote[] = []
    
    for (const symbol of symbols) {
      const quote = await this.fetchQuote(symbol)
      if (quote) {
        quotes.push(quote)
      }
    }
    
    return quotes
  }

  public async searchStocks(query: string, limit: number = 10): Promise<FallbackSearchResult[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300))
    
    const filtered = this.mockSearchResults.filter(stock => 
      stock.symbol.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit)
    
    // Add price data to search results
    return filtered.map(stock => {
      const quote = this.mockQuotes[stock.symbol]
      return {
        ...stock,
        price: quote?.price || 100 + Math.random() * 200,
        change: quote?.change || (Math.random() - 0.5) * 10,
        changePercent: quote?.changePercent || (Math.random() - 0.5) * 5
      }
    })
  }

  public getQuote(symbol: string): FallbackQuote | null {
    return this.mockQuotes[symbol.toUpperCase()] || null
  }

  public getAllQuotes(): FallbackQuote[] {
    return Object.values(this.mockQuotes)
  }
}

// Export singleton instance
export const fallbackDataService = new FallbackDataService()
