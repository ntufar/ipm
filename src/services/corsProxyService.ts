// CORS Proxy Service to handle cross-origin requests
// Provides multiple proxy options for reliability

export interface ProxyConfig {
  name: string
  url: string
  requiresEncoding: boolean
}

const PROXY_OPTIONS: ProxyConfig[] = [
  {
    name: 'allorigins',
    url: 'https://api.allorigins.win/raw?url=',
    requiresEncoding: true
  },
  {
    name: 'cors-anywhere',
    url: 'https://cors-anywhere.herokuapp.com/',
    requiresEncoding: false
  },
  {
    name: 'thingproxy',
    url: 'https://thingproxy.freeboard.io/fetch/',
    requiresEncoding: false
  }
]

class CORSProxyService {
  private currentProxyIndex = 0
  private failedProxies = new Set<string>()

  public async fetchWithProxy(targetUrl: string, options?: RequestInit): Promise<Response> {
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
    
    return this.fetchWithProxy(targetUrl, options)
  }

  public reset(): void {
    this.currentProxyIndex = 0
    this.failedProxies.clear()
  }
}

// Export singleton instance
export const corsProxyService = new CORSProxyService()
