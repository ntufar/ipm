import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Minus, RefreshCw, Zap } from 'lucide-react'
import { yahooFinanceService, type YahooQuote } from '../services/yahooFinanceService'
import { getThemeColors, getThemeStyles } from '../utils/theme'

interface RealTimeQuotesProps {
  symbols: string[]
  isDarkMode?: boolean
}

export function RealTimeQuotes({ symbols, isDarkMode = false }: RealTimeQuotesProps) {
  const colors = getThemeColors(isDarkMode)
  const themeStyles = getThemeStyles(isDarkMode)
  
  const [quotes, setQuotes] = useState<YahooQuote[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Connect to Yahoo Finance service
    yahooFinanceService.connect().then(() => {
      setIsConnected(true)
    }).catch(error => {
      console.error('Failed to connect to Yahoo Finance service:', error)
    })

    // Load initial quotes
    loadQuotes()

    return () => {
      yahooFinanceService.disconnect()
    }
  }, [symbols])

  const loadQuotes = async () => {
    if (!isConnected) return
    
    setIsLoading(true)
    try {
      const quotes = await yahooFinanceService.refreshQuotes(symbols)
      setQuotes(quotes)
    } catch (error) {
      console.error('Failed to load quotes:', error)
    } finally {
      setIsLoading(false)
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

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`
    }
    return value.toString()
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return colors.success
    if (change < 0) return colors.error
    return colors.textSecondary
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp size={14} />
    if (change < 0) return <TrendingDown size={14} />
    return <Minus size={14} />
  }


  return (
    <div style={{ ...themeStyles.card, transition: 'all 0.3s ease' }}>
      {/* Header */}
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Zap size={24} color={colors.primary} />
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: colors.textPrimary, 
              margin: 0,
              transition: 'color 0.3s ease'
            }}>
              Real-Time Quotes
            </h3>
            <div style={{ 
              backgroundColor: isConnected ? colors.success : colors.error, 
              color: '#ffffff', 
              fontSize: '0.75rem', 
              padding: '0.25rem 0.5rem', 
              borderRadius: '0.75rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}>
              <div style={{ 
                width: '6px', 
                height: '6px', 
                borderRadius: '50%', 
                backgroundColor: '#ffffff',
                animation: isConnected ? 'pulse-dot 2s infinite' : 'none'
              }} />
              {isConnected ? 'LIVE' : 'OFFLINE'}
            </div>
          </div>
            <button
              onClick={loadQuotes}
              disabled={isLoading || !isConnected}
              style={{
                ...themeStyles.button.secondary,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: (isLoading || !isConnected) ? 0.6 : 1,
                cursor: (isLoading || !isConnected) ? 'not-allowed' : 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
        </div>
        <p style={{ 
          color: colors.textSecondary, 
          margin: '0.5rem 0 0 0',
          fontSize: '0.875rem',
          transition: 'color 0.3s ease'
        }}>
          Real-time price data from Yahoo Finance (click Refresh to update)
        </p>
      </div>

      {/* Quotes List */}
      <div style={{ padding: '1.5rem' }}>
        {quotes.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: colors.textSecondary,
            transition: 'color 0.3s ease'
          }}>
            <Zap size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '1rem' }}>
              {isLoading ? 'Loading quotes...' : 'No quotes available'}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
              {isLoading ? 'Fetching real-time data from Yahoo Finance...' : 'Click Refresh to load current prices'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {quotes.map((quote) => (
              <div key={quote.symbol} style={{ 
                ...themeStyles.card, 
                padding: '1rem',
                transition: 'all 0.3s ease',
                borderLeft: `4px solid ${getChangeColor(quote.change)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h4 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      color: colors.textPrimary, 
                      margin: '0 0 0.25rem 0',
                      transition: 'color 0.3s ease'
                    }}>
                      {quote.symbol}
                    </h4>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: colors.textSecondary,
                      transition: 'color 0.3s ease'
                    }}>
                      Volume: {formatNumber(quote.volume)}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 'bold', 
                      color: colors.textPrimary,
                      marginBottom: '0.25rem',
                      transition: 'color 0.3s ease'
                    }}>
                      {formatCurrency(quote.price)}
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.25rem',
                      justifyContent: 'flex-end'
                    }}>
                      {getChangeIcon(quote.change)}
                      <span style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600', 
                        color: getChangeColor(quote.change),
                        transition: 'color 0.3s ease'
                      }}>
                        {formatCurrency(quote.change)} ({formatPercent(quote.changePercent)})
                      </span>
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                  gap: '1rem',
                  marginTop: '0.75rem'
                }}>
                  <div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: colors.textSecondary,
                      marginBottom: '0.25rem',
                      transition: 'color 0.3s ease'
                    }}>
                      Open
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: colors.textPrimary,
                      transition: 'color 0.3s ease'
                    }}>
                      {formatCurrency(quote.open)}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: colors.textSecondary,
                      marginBottom: '0.25rem',
                      transition: 'color 0.3s ease'
                    }}>
                      High
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: colors.success,
                      transition: 'color 0.3s ease'
                    }}>
                      {formatCurrency(quote.high)}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: colors.textSecondary,
                      marginBottom: '0.25rem',
                      transition: 'color 0.3s ease'
                    }}>
                      Low
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: colors.error,
                      transition: 'color 0.3s ease'
                    }}>
                      {formatCurrency(quote.low)}
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: colors.textSecondary,
                      marginBottom: '0.25rem',
                      transition: 'color 0.3s ease'
                    }}>
                      Previous Close
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '500', 
                      color: colors.textPrimary,
                      transition: 'color 0.3s ease'
                    }}>
                      {formatCurrency(quote.previousClose)}
                    </div>
                  </div>
                </div>
                
                <div style={{ 
                  marginTop: '0.75rem',
                  fontSize: '0.75rem',
                  color: colors.textSecondary,
                  textAlign: 'right',
                  transition: 'color 0.3s ease'
                }}>
                  Updated: {new Date(quote.timestamp).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
