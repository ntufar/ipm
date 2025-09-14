// Yahoo Finance API Service (Free, no API key required)
// Uses CORS proxy to handle cross-origin requests

import { corsProxyService } from './corsProxyService'

export interface YahooQuote {
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

class YahooFinanceService {
  private isConnected = false
  private subscribers: Map<string, Set<(data: any) => void>> = new Map()
  private priceCache: Map<string, YahooQuote> = new Map()

  public async connect(): Promise<void> {
    this.isConnected = true
    console.log('Connected to Yahoo Finance API')
  }

  public disconnect(): void {
    this.isConnected = false
  }

  public async fetchQuote(symbol: string): Promise<YahooQuote | null> {
    try {
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`
      const response = await corsProxyService.fetchWithProxy(yahooUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        console.error(`No data found for symbol: ${symbol}`)
        return null
      }
      
      const result = data.chart.result[0]
      const meta = result.meta
      
      const currentPrice = meta.regularMarketPrice
      const previousClose = meta.previousClose
      const change = currentPrice - previousClose
      const changePercent = (change / previousClose) * 100
      
      return {
        symbol: meta.symbol || symbol,
        price: currentPrice || 0,
        change: change || 0,
        changePercent: changePercent || 0,
        volume: meta.regularMarketVolume || 0,
        high: meta.regularMarketDayHigh || 0,
        low: meta.regularMarketDayLow || 0,
        open: meta.regularMarketOpen || 0,
        previousClose: previousClose || 0,
        timestamp: Date.now()
      }
    } catch (error) {
      console.error(`Error fetching quote for ${symbol}:`, error)
      return null
    }
  }

  public async fetchMultipleQuotes(symbols: string[]): Promise<YahooQuote[]> {
    const quotes: YahooQuote[] = []
    
    // Fetch quotes in parallel (Yahoo Finance allows this)
    const promises = symbols.map(symbol => this.fetchQuote(symbol))
    const results = await Promise.allSettled(promises)
    
    results.forEach((result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        quotes.push(result.value)
      } else {
        console.error(`Failed to fetch quote for ${symbols[index]}:`, result.status === 'rejected' ? result.reason : 'No data')
      }
    })
    
    return quotes
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

  public async refreshQuotes(symbols: string[]): Promise<YahooQuote[]> {
    if (!this.isConnected) return []

    try {
      const quotes = await this.fetchMultipleQuotes(symbols)
      
      quotes.forEach(quote => {
        this.priceCache.set(quote.symbol, quote)
        this.notifySubscribers('quote', quote)
      })
      
      this.notifySubscribers('quotes', quotes)
      return quotes
    } catch (error) {
      console.error('Error refreshing quotes:', error)
      return []
    }
  }

  public getQuote(symbol: string): YahooQuote | null {
    return this.priceCache.get(symbol) || null
  }

  public getAllQuotes(): YahooQuote[] {
    return Array.from(this.priceCache.values())
  }
}

// Export singleton instance
export const yahooFinanceService = new YahooFinanceService()
