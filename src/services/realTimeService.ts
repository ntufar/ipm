import { sampleAssets } from '../data/sampleData'

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

export interface MarketStatus {
  isOpen: boolean
  nextOpen: Date
  nextClose: Date
  timezone: string
}

export interface MarketIndex {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  timestamp: number
}

class RealTimeService {
  private ws: WebSocket | null = null
  private isConnected = false
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()
  private priceCache: Map<string, RealTimeQuote> = new Map()
  private newsCache: MarketNews[] = []
  private marketStatus: MarketStatus | null = null
  private marketIndices: MarketIndex[] = []

  constructor() {
    this.initializeMarketStatus()
    this.initializeMarketIndices()
    this.startNewsUpdates()
  }

  private initializeMarketStatus() {
    const now = new Date()
    const marketOpen = new Date(now)
    marketOpen.setHours(9, 30, 0, 0) // 9:30 AM EST
    const marketClose = new Date(now)
    marketClose.setHours(16, 0, 0, 0) // 4:00 PM EST

    // Check if market is open (Monday-Friday, 9:30 AM - 4:00 PM EST)
    const isWeekday = now.getDay() >= 1 && now.getDay() <= 5
    const isMarketHours = now >= marketOpen && now <= marketClose

    this.marketStatus = {
      isOpen: isWeekday && isMarketHours,
      nextOpen: this.getNextMarketOpen(),
      nextClose: this.getNextMarketClose(),
      timezone: 'EST'
    }
  }

  private getNextMarketOpen(): Date {
    const now = new Date()
    const nextOpen = new Date(now)
    nextOpen.setHours(9, 30, 0, 0)
    
    // If it's after market hours or weekend, set to next weekday
    if (now.getHours() >= 16 || now.getDay() === 0 || now.getDay() === 6) {
      nextOpen.setDate(nextOpen.getDate() + (now.getDay() === 0 ? 1 : now.getDay() === 6 ? 2 : 1))
    }
    
    return nextOpen
  }

  private getNextMarketClose(): Date {
    const now = new Date()
    const nextClose = new Date(now)
    nextClose.setHours(16, 0, 0, 0)
    
    // If it's after market hours or weekend, set to next weekday
    if (now.getHours() >= 16 || now.getDay() === 0 || now.getDay() === 6) {
      nextClose.setDate(nextClose.getDate() + (now.getDay() === 0 ? 1 : now.getDay() === 6 ? 2 : 1))
    }
    
    return nextClose
  }

  private initializeMarketIndices() {
    this.marketIndices = [
      {
        symbol: '^GSPC',
        name: 'S&P 500',
        price: 4500 + (Math.random() - 0.5) * 100,
        change: (Math.random() - 0.5) * 50,
        changePercent: (Math.random() - 0.5) * 2,
        timestamp: Date.now()
      },
      {
        symbol: '^IXIC',
        name: 'NASDAQ',
        price: 14000 + (Math.random() - 0.5) * 200,
        change: (Math.random() - 0.5) * 100,
        changePercent: (Math.random() - 0.5) * 2,
        timestamp: Date.now()
      },
      {
        symbol: '^DJI',
        name: 'Dow Jones',
        price: 35000 + (Math.random() - 0.5) * 1000,
        change: (Math.random() - 0.5) * 200,
        changePercent: (Math.random() - 0.5) * 2,
        timestamp: Date.now()
      }
    ]
  }

  private startNewsUpdates() {
    // Simulate news updates every 30 seconds
    setInterval(() => {
      this.generateMarketNews()
    }, 30000)
  }

  private generateMarketNews(): void {
    const newsTemplates = [
      {
        title: "Tech Stocks Rally on Strong Earnings",
        summary: "Major technology companies report better-than-expected quarterly results, driving market optimism.",
        sentiment: 'positive' as const,
        symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN']
      },
      {
        title: "Federal Reserve Signals Potential Rate Cut",
        summary: "Central bank hints at possible interest rate reduction in upcoming meetings.",
        sentiment: 'positive' as const,
        symbols: ['^GSPC', '^IXIC', '^DJI']
      },
      {
        title: "Energy Sector Faces Headwinds",
        summary: "Oil prices decline amid concerns over global demand and supply glut.",
        sentiment: 'negative' as const,
        symbols: ['XOM', 'CVX', 'COP']
      },
      {
        title: "Healthcare Stocks Show Mixed Results",
        summary: "Pharmaceutical companies report varying performance in latest earnings season.",
        sentiment: 'neutral' as const,
        symbols: ['JNJ', 'PFE', 'UNH']
      },
      {
        title: "Cryptocurrency Market Volatility Continues",
        summary: "Digital assets experience significant price swings as regulatory uncertainty persists.",
        sentiment: 'negative' as const,
        symbols: ['BTC-USD', 'ETH-USD']
      }
    ]

    const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)]
    const news: MarketNews = {
      id: `news-${Date.now()}`,
      title: template.title,
      summary: template.summary,
      source: 'Financial News',
      publishedAt: new Date().toISOString(),
      url: '#',
      sentiment: template.sentiment,
      symbols: template.symbols
    }

    this.newsCache.unshift(news)
    if (this.newsCache.length > 50) {
      this.newsCache = this.newsCache.slice(0, 50)
    }

    this.notifySubscribers('news', news)
  }

  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Simulate WebSocket connection for demo purposes
        // In a real app, you would connect to a WebSocket server
        this.isConnected = true
        
        // Start price updates
        this.startPriceUpdates()
        
        resolve()
      } catch (error) {
        reject(error)
      }
    })
  }

  public disconnect(): void {
    this.isConnected = false
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  private startPriceUpdates(): void {
    if (!this.isConnected) return

    // Update prices every 2 seconds for demo
    setInterval(() => {
      if (!this.isConnected) return

      // Update market indices
      this.marketIndices.forEach(index => {
        const change = (Math.random() - 0.5) * 0.02 // ±1% change
        const newPrice = index.price * (1 + change)
        const priceChange = newPrice - index.price
        const changePercent = (priceChange / index.price) * 100

        index.price = parseFloat(newPrice.toFixed(2))
        index.change = parseFloat(priceChange.toFixed(2))
        index.changePercent = parseFloat(changePercent.toFixed(2))
        index.timestamp = Date.now()
      })

      // Update individual stock prices
      sampleAssets.forEach(asset => {
        const change = (Math.random() - 0.5) * 0.01 // ±0.5% change
        const newPrice = asset.currentPrice * (1 + change)
        const priceChange = newPrice - asset.currentPrice
        const changePercent = (priceChange / asset.currentPrice) * 100

        const quote: RealTimeQuote = {
          symbol: asset.symbol,
          price: parseFloat(newPrice.toFixed(2)),
          change: parseFloat(priceChange.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(2)),
          volume: Math.floor(Math.random() * 1000000) + 100000,
          high: newPrice * (1 + Math.random() * 0.02),
          low: newPrice * (1 - Math.random() * 0.02),
          open: asset.currentPrice,
          previousClose: asset.currentPrice,
          timestamp: Date.now()
        }

        this.priceCache.set(asset.symbol, quote)
        this.notifySubscribers('quote', quote)
      })

      // Notify market indices subscribers
      this.notifySubscribers('indices', this.marketIndices)
    }, 2000)
  }

  public subscribe(event: string, callback: (data: any) => void): () => void {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set())
    }
    this.subscribers.get(event)!.add(callback)

    // Return unsubscribe function
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

  public getQuote(symbol: string): RealTimeQuote | null {
    return this.priceCache.get(symbol) || null
  }

  public getAllQuotes(): RealTimeQuote[] {
    return Array.from(this.priceCache.values())
  }

  public getMarketNews(): MarketNews[] {
    return [...this.newsCache]
  }

  public getMarketStatus(): MarketStatus | null {
    return this.marketStatus
  }

  public getMarketIndices(): MarketIndex[] {
    return [...this.marketIndices]
  }

  public isMarketOpen(): boolean {
    return this.marketStatus?.isOpen || false
  }

  public getNextMarketOpenTime(): Date | null {
    return this.marketStatus?.nextOpen || null
  }

  public getNextMarketCloseTime(): Date | null {
    return this.marketStatus?.nextClose || null
  }
}

// Export singleton instance
export const realTimeService = new RealTimeService()
