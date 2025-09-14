import { useState, useEffect } from 'react'
import { Clock, TrendingUp, TrendingDown, Minus, AlertCircle, CheckCircle } from 'lucide-react'
import { realTimeService, type MarketIndex } from '../services/realTimeService'
import { getThemeColors, getThemeStyles } from '../utils/theme'

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

  useEffect(() => {
    // Load initial data
    setIndices(realTimeService.getMarketIndices())
    setIsMarketOpen(realTimeService.isMarketOpen())
    setNextOpen(realTimeService.getNextMarketOpenTime())
    setNextClose(realTimeService.getNextMarketCloseTime())

    // Subscribe to real-time updates
    const unsubscribeIndices = realTimeService.subscribe('indices', (newIndices: MarketIndex[]) => {
      setIndices(newIndices)
    })

    // Update time remaining every minute
    const timeInterval = setInterval(() => {
      updateTimeRemaining()
    }, 60000)

    // Initial time update
    updateTimeRemaining()

    return () => {
      unsubscribeIndices()
      clearInterval(timeInterval)
    }
  }, [])

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
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
