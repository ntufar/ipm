import { useState, useEffect } from 'react'
import { Clock, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { yahooFinanceService } from '../services/yahooFinanceService'
import { getThemeColors, getThemeStyles } from '../utils/theme'

interface MarketIndex {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  timestamp: number
}

interface MarketStatusProps {
  isDarkMode?: boolean
}

export function MarketStatus({ isDarkMode = false }: MarketStatusProps) {
  const colors = getThemeColors(isDarkMode)
  const themeStyles = getThemeStyles(isDarkMode)
  
  const [indices, setIndices] = useState<MarketIndex[]>([])
  const [isMarketOpen, setIsMarketOpen] = useState(false)
  const [nextOpen, setNextOpen] = useState<Date | null>(null)
  const [nextClose, setNextClose] = useState<Date | null>(null)
  const [timeUntilOpen, setTimeUntilOpen] = useState<string>('')
  const [timeUntilClose, setTimeUntilClose] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Connect to Yahoo Finance service
    yahooFinanceService.connect().then(() => {
      loadMarketData()
    }).catch(error => {
      console.error('Failed to connect to Yahoo Finance service:', error)
    })

    // Update time remaining every minute
    const timeInterval = setInterval(() => {
      updateTimeRemaining()
    }, 60000)

    // Initial time update
    updateTimeRemaining()

    return () => {
      yahooFinanceService.disconnect()
      clearInterval(timeInterval)
    }
  }, [])

  const loadMarketData = async () => {
    setIsLoading(true)
    try {
      // Load market indices from Yahoo Finance
      const indexSymbols = ['^GSPC', '^IXIC', '^DJI'] // S&P 500, NASDAQ, Dow Jones
      const quotes = await yahooFinanceService.fetchMultipleQuotes(indexSymbols)
      
      const marketIndices: MarketIndex[] = quotes.map(quote => ({
        symbol: quote.symbol,
        name: getIndexName(quote.symbol),
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        timestamp: quote.timestamp
      }))
      
      setIndices(marketIndices)
      
      // Determine market status based on current time
      const now = new Date()
      const marketOpen = new Date(now)
      marketOpen.setHours(9, 30, 0, 0) // 9:30 AM EST
      const marketClose = new Date(now)
      marketClose.setHours(16, 0, 0, 0) // 4:00 PM EST
      
      const isWeekday = now.getDay() >= 1 && now.getDay() <= 5
      const isMarketHours = now >= marketOpen && now <= marketClose
      
      setIsMarketOpen(isWeekday && isMarketHours)
      setNextOpen(getNextMarketOpen())
      setNextClose(getNextMarketClose())
    } catch (error) {
      console.error('Failed to load market data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getIndexName = (symbol: string): string => {
    switch (symbol) {
      case '^GSPC': return 'S&P 500'
      case '^IXIC': return 'NASDAQ'
      case '^DJI': return 'Dow Jones'
      default: return symbol
    }
  }

  const getNextMarketOpen = (): Date => {
    const now = new Date()
    const nextOpen = new Date(now)
    nextOpen.setHours(9, 30, 0, 0)
    
    if (now.getHours() >= 16 || now.getDay() === 0 || now.getDay() === 6) {
      nextOpen.setDate(nextOpen.getDate() + (now.getDay() === 0 ? 1 : now.getDay() === 6 ? 2 : 1))
    }
    
    return nextOpen
  }

  const getNextMarketClose = (): Date => {
    const now = new Date()
    const nextClose = new Date(now)
    nextClose.setHours(16, 0, 0, 0)
    
    if (now.getHours() >= 16 || now.getDay() === 0 || now.getDay() === 6) {
      nextClose.setDate(nextClose.getDate() + (now.getDay() === 0 ? 1 : now.getDay() === 6 ? 2 : 1))
    }
    
    return nextClose
  }

  const updateTimeRemaining = () => {
    const now = new Date()
    
    if (nextOpen) {
      const diff = nextOpen.getTime() - now.getTime()
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeUntilOpen(`${hours}h ${minutes}m`)
      } else {
        setTimeUntilOpen('Market is open')
      }
    }

    if (nextClose) {
      const diff = nextClose.getTime() - now.getTime()
      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeUntilClose(`${hours}h ${minutes}m`)
      } else {
        setTimeUntilClose('Market closed')
      }
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return colors.success
    if (change < 0) return colors.error
    return colors.textSecondary
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={16} />
    if (change < 0) return <TrendingDown size={16} />
    return <Minus size={16} />
  }

  return (
    <div style={{ ...themeStyles.card, transition: 'all 0.3s ease' }}>
      {/* Header */}
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Clock size={24} color={colors.primary} />
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: colors.textPrimary, 
              margin: 0,
              transition: 'color 0.3s ease'
            }}>
              Market Status
            </h3>
            <div style={{ 
              backgroundColor: isMarketOpen ? colors.success : colors.error, 
              color: '#ffffff', 
              fontSize: '0.75rem', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '0.75rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              {isMarketOpen ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
              {isMarketOpen ? 'OPEN' : 'CLOSED'}
            </div>
          </div>
          <button
            onClick={loadMarketData}
            disabled={isLoading}
            style={{
              ...themeStyles.button.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: colors.surface, 
            borderRadius: '0.5rem',
            border: `1px solid ${colors.border}`,
            transition: 'all 0.3s ease'
          }}>
            <div style={{ 
              fontSize: '0.75rem', 
              color: colors.textSecondary, 
              marginBottom: '0.25rem',
              transition: 'color 0.3s ease'
            }}>
              {isMarketOpen ? 'Closes in' : 'Opens in'}
            </div>
            <div style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              transition: 'color 0.3s ease'
            }}>
              {isMarketOpen ? timeUntilClose : timeUntilOpen}
            </div>
          </div>
          
          <div style={{ 
            padding: '0.75rem', 
            backgroundColor: colors.surface, 
            borderRadius: '0.5rem',
            border: `1px solid ${colors.border}`,
            transition: 'all 0.3s ease'
          }}>
            <div style={{ 
              fontSize: '0.75rem', 
              color: colors.textSecondary, 
              marginBottom: '0.25rem',
              transition: 'color 0.3s ease'
            }}>
              Timezone
            </div>
            <div style={{ 
              fontSize: '1.125rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              transition: 'color 0.3s ease'
            }}>
              EST
            </div>
          </div>
        </div>
      </div>

      {/* Market Indices */}
      <div style={{ padding: '1.5rem' }}>
        <h4 style={{ 
          fontSize: '1rem', 
          fontWeight: '600', 
          color: colors.textPrimary, 
          margin: '0 0 1rem 0',
          transition: 'color 0.3s ease'
        }}>
          Market Indices
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {indices.map((index) => (
            <div key={index.symbol} style={{ 
              ...themeStyles.card, 
              padding: '1rem',
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.textPrimary,
                    marginBottom: '0.25rem',
                    transition: 'color 0.3s ease'
                  }}>
                    {index.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: colors.textSecondary,
                    transition: 'color 0.3s ease'
                  }}>
                    {index.symbol}
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: colors.textPrimary,
                    marginBottom: '0.25rem',
                    transition: 'color 0.3s ease'
                  }}>
                    {formatCurrency(index.price)}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.25rem',
                    justifyContent: 'flex-end'
                  }}>
                    {getChangeIcon(index.change)}
                    <span style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: getChangeColor(index.change),
                      transition: 'color 0.3s ease'
                    }}>
                      {formatCurrency(index.change)} ({formatPercent(index.changePercent)})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
