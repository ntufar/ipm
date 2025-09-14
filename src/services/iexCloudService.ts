// IEX Cloud API Service (Professional, paid)
// Get your API key at: https://iexcloud.io/

const IEX_CLOUD_API_KEY = 'YOUR_API_KEY_HERE' // Replace with your actual API key
const IEX_CLOUD_BASE_URL = 'https://cloud.iexapis.com/stable'

export interface IEXQuote {
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

class IEXCloudService {
  private apiKey: string
  private baseUrl: string
  private isConnected = false
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()
  private priceCache: Map<string, IEXQuote> = new Map()
  private updateInterval: NodeJS.Timeout | null = null

  constructor(apiKey: string = IEX_CLOUD_API_KEY) {
    this.apiKey = apiKey
    this.baseUrl = IEX_CLOUD_BASE_URL
  }

  public async connect(): Promise<void> {
    if (!this.apiKey || this.apiKey === 'YOUR_API_KEY_HERE') {
      throw new Error('Please set your IEX Cloud API key in iexCloudService.ts')
    }
    
    this.isConnected = true
    console.log('Connected to IEX Cloud API')
  }

  public disconnect(): void {
    this.isConnected = false
    if (this.updateInterval) {
      clearInterval(this.updateInterval)
      this.updateInterval = null
    }
  }

  public async fetchQuote(symbol: string): Promise<IEXQuote | null> {
    try {
      const response = await fetch(
        `${this.baseUrl}/stock/${symbol}/quote?token=${this.apiKey}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        console.error(`Error fetching quote for ${symbol}:`, data.error)
        return null
      }
      
      return {
        symbol: data.symbol,
        price: data.latestPrice,
        change: data.change,
        changePercent: data.changePercent * 100,
        volume: data.latestVolume,
        high: data.high,
        low: data.low,
        open: data.open,
        previousClose: data.previousClose,
        timestamp: Date.now()
      }
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error)
      return null
    }
  }

  public async fetchMultipleQuotes(symbols: string[]): Promise<IEXQuote[]> {
    try {
      const symbolsString = symbols.join(',')
      const response = await fetch(
        `${this.baseUrl}/stock/market/batch?symbols=${symbolsString}&types=quote&token=${this.apiKey}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const quotes: IEXQuote[] = []
      
      Object.values(data).forEach((stock: any) => {
        if (stock.quote) {
          const quote = stock.quote
          quotes.push({
            symbol: quote.symbol,
            price: quote.latestPrice,
            change: quote.change,
            changePercent: quote.changePercent * 100,
            volume: quote.latestVolume,
            high: quote.high,
            low: quote.low,
            open: quote.open,
            previousClose: quote.previousClose,
            timestamp: Date.now()
          })
        }
      })
      
      return quotes
    } catch (error) {
      console.error('Error fetching multiple quotes:', error)
      return []
    }
  }

  public async fetchMarketNews(): Promise<any[]> {
    try {
      const response = await fetch(
        `${this.baseUrl}/stock/market/news/last/50?token=${this.apiKey}`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      return data || []
    } catch (error) {
      console.error('Error fetching market news:', error)
      return []
    }
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
    }, 10000) // Update every 10 seconds (IEX Cloud allows higher frequency)
  }

  public getQuote(symbol: string): IEXQuote | null {
    return this.priceCache.get(symbol) || null
  }

  public getAllQuotes(): IEXQuote[] {
    return Array.from(this.priceCache.values())
  }
}

// Export singleton instance
export const iexCloudService = new IEXCloudService()
