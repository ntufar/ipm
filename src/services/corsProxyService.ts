// CORS Proxy Service to handle cross-origin requests
// Provides multiple proxy options for reliability

export interface ProxyConfig {
  name: string
  url: string
  requiresEncoding: boolean
}

const PROXY_OPTIONS: ProxyConfig[] = [
  {
    name: 'corsproxy',
    url: 'https://corsproxy.io/?',
    requiresEncoding: true
  },
  {
    name: 'proxycors',
    url: 'https://proxy.cors.sh/',
    requiresEncoding: false
  },
  {
    name: 'thingproxy',
    url: 'https://thingproxy.freeboard.io/fetch/',
    requiresEncoding: false
  },
  {
    name: 'allorigins',
    url: 'https://api.allorigins.win/raw?url=',
    requiresEncoding: true
  }
]

class CORSProxyService {
  private currentProxyIndex = 0
  private failedProxies = new Set<string>()
  private lastRequestTime = 0
  private readonly RATE_LIMIT_DELAY = 1000 // 1 second between requests

  public async fetchWithProxy(targetUrl: string, options?: RequestInit): Promise<Response> {
    // Rate limiting
    const now = Date.now()
    const timeSinceLastRequest = now - this.lastRequestTime
    
    if (timeSinceLastRequest < this.RATE_LIMIT_DELAY) {
      await new Promise(resolve => setTimeout(resolve, this.RATE_LIMIT_DELAY - timeSinceLastRequest))
    }
    
    this.lastRequestTime = Date.now()
    const proxy = this.getCurrentProxy()
    
    try {
      const proxyUrl = proxy.requiresEncoding 
        ? `${proxy.url}${encodeURIComponent(targetUrl)}`
        : `${proxy.url}${targetUrl}`
      
      const response = await fetch(proxyUrl, {
        ...options,
        headers: {
          ...options?.headers,
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (compatible; PortfolioManager/1.0)'
        }
      })
      
      if (!response.ok) {
        if (response.status === 429) {
          console.warn(`Proxy ${proxy.name} rate limited (429), trying next proxy`)
          this.failedProxies.add(proxy.name)
          return this.tryNextProxy(targetUrl, options)
        }
        if (response.status === 403) {
          console.warn(`Proxy ${proxy.name} forbidden (403), trying next proxy`)
          this.failedProxies.add(proxy.name)
          return this.tryNextProxy(targetUrl, options)
        }
        throw new Error(`Proxy ${proxy.name} failed with status: ${response.status}`)
      }
      
      return response
    } catch (error) {
      console.error(`Proxy ${proxy.name} failed:`, error)
      this.failedProxies.add(proxy.name)
      return this.tryNextProxy(targetUrl, options)
    }
  }

  private getCurrentProxy(): ProxyConfig {
    const availableProxies = PROXY_OPTIONS.filter(p => !this.failedProxies.has(p.name))
    
    if (availableProxies.length === 0) {
      // Reset failed proxies if all have failed
      this.failedProxies.clear()
      return PROXY_OPTIONS[0]
    }
    
    return availableProxies[this.currentProxyIndex % availableProxies.length]
  }

  private async tryNextProxy(targetUrl: string, options?: RequestInit): Promise<Response> {
    this.currentProxyIndex++
    
    if (this.currentProxyIndex >= PROXY_OPTIONS.length) {
      this.currentProxyIndex = 0
    }
    
    // If all proxies have failed, wait a bit and reset
    if (this.failedProxies.size >= PROXY_OPTIONS.length) {
      console.warn('All proxies failed, waiting 5 seconds before retry...')
      await new Promise(resolve => setTimeout(resolve, 5000))
      this.failedProxies.clear()
    }
    
    return this.fetchWithProxy(targetUrl, options)
  }

  public reset(): void {
    this.currentProxyIndex = 0
    this.failedProxies.clear()
  }
}

// Export singleton instance
export const corsProxyService = new CORSProxyService()
