// Real Market Data Service using Alpha Vantage API
// Get your free API key at: https://www.alphavantage.co/support/#api-key

const ALPHA_VANTAGE_API_KEY = 'YOUR_API_KEY_HERE' // Replace with your actual API key
const ALPHA_VANTAGE_BASE_URL = 'https://www.alphavantage.co/query'

export interface RealTimeQuote {
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

export interface MarketNews {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  url: string
  sentiment: 'positive' | 'negative' | 'neutral'
  symbols: string[]
}

class RealMarketDataService {
  private apiKey: string
  private baseUrl: string
  private isConnected = false
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()
  private priceCache: Map<string, RealTimeQuote> = new Map()
  private updateInterval: NodeJS.Timeout | null = null

  constructor(apiKey: string = ALPHA_VANTAGE_API_KEY) {
    this.apiKey = apiKey
    this.baseUrl = ALPHA_VANTAGE_BASE_URL
  }

  public async connect(): Promise<void> {
    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') {
      throw new Error('Please set your Alpha Vantage API key in realMarketDataService.ts')
    }
    
    this.isConnected = true
    console.log('Connected to Alpha Vantage API')
  }

  public disconnect(): void {
    this.isConnected = false
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  public async fetchRealTimeQuote(symbol: string): Promise<RealTimeQuote | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${this.apiKey}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data['Error Message']) {
        console.error(`Error fetching quote for ${symbol}:`, data['Error Message'])
        return null
      }
      
      if (data['Note']) {
        console.warn(`API limit reached for ${symbol}:`, data['Note'])
        return null
      }
      
      const quote = data['Global Quote']
      if (!quote) {
        console.error(`No quote data for ${symbol}`)
        return null
      }
      
      const realTimeQuote: RealTimeQuote = {
        symbol: quote['01. symbol'],
        price: parseFloat(quote['05. price']),
        change: parseFloat(quote['09. change']),
        changePercent: parseFloat(quote['10. change percent'].replace('%', '')),
        volume: parseInt(quote['06. volume']),
        high: parseFloat(quote['03. high']),
        low: parseFloat(quote['04. low']),
        open: parseFloat(quote['02. open']),
        previousClose: parseFloat(quote['08. previous close']),
        timestamp: Date.now()
      }
      
      return realTimeQuote
    } catch (error) {
      console.error(`Error fetching real-time quote for ${symbol}:`, error)
      return null
    }
  }

  public async fetchMultipleQuotes(symbols: string[]): Promise<RealTimeQuote[]> {
    const quotes: RealTimeQuote[] = []
    
    // Alpha Vantage has rate limits, so we'll fetch them one by one with delays
    for (const symbol of symbols) {
      try {
        const quote = await this.fetchRealTimeQuote(symbol)
        if (quote) {
          quotes.push(quote)
        }
        
        // Add delay to respect rate limits (5 calls per minute for free tier)
        await new Promise(resolve => setTimeout(resolve, 12000)) // 12 seconds between calls
      } catch (error) {
        console.error(`Failed to fetch quote for ${symbol}:`, error)
      }
    }
    
    return quotes
  }

  public async fetchMarketNews(): Promise<MarketNews[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}?function=NEWS_SENTIMENT&apikey=${this.apiKey}&limit=50`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data['Error Message']) {
        console.error('Error fetching news:', data['Error Message'])
        return []
      }
      
      if (data['Note']) {
        console.warn('API limit reached for news:', data['Note'])
        return []
      }
      
      const newsItems = data.feed || []
      
      return newsItems.map((item: any, index: number) => ({
        id: `news-${index}`,
        title: item.title,
        summary: item.summary,
        source: item.source,
        publishedAt: item.time_published,
        url: item.url,
        sentiment: this.determineSentiment(item.overall_sentiment_score),
        symbols: item.ticker_sentiment?.map((t: any) => t.ticker) || []
      }))
    } catch (error) {
      console.error('Error fetching market news:', error)
      return []
    }
  }

  private determineSentiment(score: number): 'positive' | 'negative' | 'neutral' {
    if (score > 0.1) return 'positive'
    if (score < -0.1) return 'negative'
    return 'neutral'
  }

  public subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set())
    }
    this.subscribers.get(event)!.add(callback)

    return () => {
      const subscribers = this.subscribers.get(event)
      if (subscribers) {
        subscribers.delete(callback)
        if (subscribers.size === 0) {
          this.subscribers.delete(event)
        }
      }
    }
  }

  private notifySubscribers(event: string, data: any): void {
    const subscribers = this.subscribers.get(event)
    if (subscribers) {
      subscribers.forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error('Error in subscriber callback:', error)
        }
      })
    }
  }

  public startRealTimeUpdates(symbols: string[]): void {
    if (!this.isConnected) return

    this.updateInterval = setInterval(async () => {
      try {
        const quotes = await this.fetchMultipleQuotes(symbols)
        
        quotes.forEach(quote => {
          this.priceCache.set(quote.symbol, quote)
          this.notifySubscribers('quote', quote)
        })
        
        this.notifySubscribers('quotes', quotes)
      } catch (error) {
        console.error('Error in real-time updates:', error)
      }
    }, 60000) // Update every minute (due to API rate limits)
  }

  public getQuote(symbol: string): RealTimeQuote | null {
    return this.priceCache.get(symbol) || null
  }

  public getAllQuotes(): RealTimeQuote[] {
    return Array.from(this.priceCache.values())
  }
}

// Export singleton instance
export const realMarketDataService = new RealMarketDataService()
