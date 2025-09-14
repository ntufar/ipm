// Stock Search Service using multiple free APIs
// Primary: Yahoo Finance search
// Fallback: Alpha Vantage search

export interface StockSearchResult {
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

class StockSearchService {
  private searchCache: Map<string, StockSearchResult[]> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  public async searchStocks(query: string, limit: number = 20): Promise<StockSearchResult[]> {
    if (!query || query.length < 1) {
      return []
    }

    const cacheKey = `${query.toLowerCase()}_${limit}`
    
    // Check cache first
    if (this.isCacheValid(cacheKey)) {
      return this.searchCache.get(cacheKey) || []
    }

    try {
      // Try Yahoo Finance search first
      const results = await this.searchYahooFinance(query, limit)
      
      // Cache the results
      this.searchCache.set(cacheKey, results)
      this.cacheExpiry.set(cacheKey, Date.now())
      
      return results
    } catch (error) {
      console.error('Error searching stocks:', error)
      return []
    }
  }

  private async searchYahooFinance(query: string, limit: number): Promise<StockSearchResult[]> {
    try {
      // Yahoo Finance search endpoint
      const response = await fetch(
        `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=${limit}&newsCount=0`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.quotes || !Array.isArray(data.quotes)) {
        return []
      }
      
      return data.quotes
        .filter((quote: any) => quote.symbol && quote.longname)
        .map((quote: any) => ({
          symbol: quote.symbol,
          name: quote.longname || quote.shortname || quote.symbol,
          exchange: quote.exchange || 'Unknown',
          type: quote.quoteType || 'EQUITY',
          region: quote.region || 'US',
          currency: quote.currency || 'USD',
          marketState: quote.marketState || 'REGULAR',
          price: quote.regularMarketPrice,
          change: quote.regularMarketChange,
          changePercent: quote.regularMarketChangePercent
        }))
        .slice(0, limit)
    } catch (error) {
      console.error('Yahoo Finance search error:', error)
      throw error
    }
  }

  private isCacheValid(cacheKey: string): boolean {
    const expiry = this.cacheExpiry.get(cacheKey)
    if (!expiry) return false
    
    return Date.now() - expiry < this.CACHE_DURATION
  }

  public async getStockDetails(symbol: string): Promise<StockSearchResult | null> {
    try {
      // Get detailed stock information
      const response = await fetch(
        `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1m&range=1d`
      )
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (!data.chart || !data.chart.result || data.chart.result.length === 0) {
        return null
      }
      
      const result = data.chart.result[0]
      const meta = result.meta
      
      return {
        symbol: meta.symbol || symbol,
        name: meta.longName || meta.shortName || symbol,
        exchange: meta.exchangeName || 'Unknown',
        type: meta.instrumentType || 'EQUITY',
        region: meta.region || 'US',
        currency: meta.currency || 'USD',
        marketState: meta.marketState || 'REGULAR',
        price: meta.regularMarketPrice,
        change: meta.regularMarketChange,
        changePercent: meta.regularMarketChangePercent
      }
    } catch (error) {
      console.error(`Error getting stock details for ${symbol}:`, error)
      return null
    }
  }

  public clearCache(): void {
    this.searchCache.clear()
    this.cacheExpiry.clear()
  }
}

// Export singleton instance
export const stockSearchService = new StockSearchService()
