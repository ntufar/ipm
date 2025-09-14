import { useState, useEffect } from 'react'
import { TrendingUp, DollarSign, Percent, Calendar, Building2 } from 'lucide-react'
import type { Portfolio } from '../types/index.js'
import { getThemeColors, getThemeStyles } from '../utils/theme'

interface AdditionalDataProps {
  portfolio: Portfolio
  isDarkMode?: boolean
}

interface StockMetrics {
  symbol: string
  name: string
  currentPrice: number
  week52High: number
  week52Low: number
  marketCap: number
  peRatio: number
  dividendYield: number
  beta: number
  volume: number
  avgVolume: number
}

export function AdditionalData({ portfolio, isDarkMode = false }: AdditionalDataProps) {
  const colors = getThemeColors(isDarkMode)
  const themeStyles = getThemeStyles(isDarkMode)
  const [stockMetrics, setStockMetrics] = useState<StockMetrics[]>([])

  // Generate sample additional data for each holding
  useEffect(() => {
    const metrics = portfolio.holdings.map(holding => {
      const currentPrice = holding.asset.currentPrice
      const volatility = 0.2 // 20% volatility
      
      // Generate 52-week high/low based on current price
      const week52High = currentPrice * (1 + Math.random() * volatility)
      const week52Low = currentPrice * (1 - Math.random() * volatility)
      
      // Generate market cap (simulate based on price)
      const marketCap = currentPrice * (Math.random() * 1000000000 + 100000000) // 100M to 1.1B
      
      // Generate P/E ratio
      const peRatio = Math.random() * 50 + 5 // 5 to 55
      
      // Generate dividend yield
      const dividendYield = Math.random() * 5 // 0 to 5%
      
      // Generate beta
      const beta = Math.random() * 2 + 0.5 // 0.5 to 2.5
      
      // Generate volume data
      const volume = Math.floor(Math.random() * 10000000) + 1000000
      const avgVolume = Math.floor(volume * (0.8 + Math.random() * 0.4))
      
      return {
        symbol: holding.asset.symbol,
        name: holding.asset.name,
        currentPrice,
        week52High: parseFloat(week52High.toFixed(2)),
        week52Low: parseFloat(week52Low.toFixed(2)),
        marketCap: parseFloat(marketCap.toFixed(0)),
        peRatio: parseFloat(peRatio.toFixed(2)),
        dividendYield: parseFloat(dividendYield.toFixed(2)),
        beta: parseFloat(beta.toFixed(2)),
        volume,
        avgVolume
      }
    })
    
    setStockMetrics(metrics)
  }, [portfolio.holdings])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const formatLargeNumber = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(1)}K`
    }
    return formatCurrency(value)
  }

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const getPricePosition = (current: number, high: number, low: number) => {
    return ((current - low) / (high - low)) * 100
  }

  const getMetricColor = (value: number, type: 'positive' | 'negative' | 'neutral') => {
    if (type === 'positive') {
      return value > 0 ? colors.success : colors.error
    } else if (type === 'negative') {
      return value < 0 ? colors.success : colors.error
    }
    return colors.textPrimary
  }

  return (
    <div style={{ ...themeStyles.card, transition: 'all 0.3s ease' }}>
      {/* Header */}
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Building2 size={24} color={colors.primary} />
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: colors.textPrimary, 
            margin: 0,
            transition: 'color 0.3s ease'
          }}>
            Additional Stock Data
          </h3>
        </div>
        <p style={{ 
          color: colors.textSecondary, 
          margin: '0.5rem 0 0 0',
          fontSize: '0.875rem',
          transition: 'color 0.3s ease'
        }}>
          52-week high/low, market cap, P/E ratios, dividend yield, and more
        </p>
      </div>

      {/* Stock Metrics Table */}
      <div style={{ overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ 
              backgroundColor: colors.surface,
              borderBottom: `2px solid ${colors.border}`,
              transition: 'all 0.3s ease'
            }}>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'left', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: colors.textPrimary,
                transition: 'color 0.3s ease'
              }}>
                Stock
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'right', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: colors.textPrimary,
                transition: 'color 0.3s ease'
              }}>
                52W High/Low
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'right', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: colors.textPrimary,
                transition: 'color 0.3s ease'
              }}>
                Market Cap
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'right', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: colors.textPrimary,
                transition: 'color 0.3s ease'
              }}>
                P/E Ratio
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'right', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: colors.textPrimary,
                transition: 'color 0.3s ease'
              }}>
                Div. Yield
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'right', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: colors.textPrimary,
                transition: 'color 0.3s ease'
              }}>
                Beta
              </th>
              <th style={{ 
                padding: '1rem', 
                textAlign: 'right', 
                fontSize: '0.875rem', 
                fontWeight: '600', 
                color: colors.textPrimary,
                transition: 'color 0.3s ease'
              }}>
                Volume
              </th>
            </tr>
          </thead>
          <tbody>
            {stockMetrics.map((metric, index) => {
              const pricePosition = getPricePosition(metric.currentPrice, metric.week52High, metric.week52Low)
              
              return (
                <tr 
                  key={metric.symbol}
                  style={{ 
                    borderBottom: `1px solid ${colors.border}`,
                    transition: 'all 0.3s ease',
                    backgroundColor: index % 2 === 0 ? 'transparent' : colors.surface
                  }}
                >
                  <td style={{ padding: '1rem' }}>
                    <div>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600', 
                        color: colors.textPrimary,
                        transition: 'color 0.3s ease'
                      }}>
                        {metric.symbol}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: colors.textSecondary,
                        transition: 'color 0.3s ease'
                      }}>
                        {metric.name}
                      </div>
                    </div>
                  </td>
                  
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600', 
                        color: colors.success,
                        transition: 'color 0.3s ease'
                      }}>
                        {formatCurrency(metric.week52High)}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: colors.textSecondary,
                        transition: 'color 0.3s ease'
                      }}>
                        High
                      </div>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600', 
                        color: colors.error,
                        transition: 'color 0.3s ease'
                      }}>
                        {formatCurrency(metric.week52Low)}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: colors.textSecondary,
                        transition: 'color 0.3s ease'
                      }}>
                        Low
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '4px', 
                        backgroundColor: colors.border,
                        borderRadius: '2px',
                        marginTop: '0.25rem',
                        position: 'relative'
                      }}>
                        <div style={{ 
                          position: 'absolute',
                          left: `${pricePosition}%`,
                          top: '-2px',
                          width: '8px',
                          height: '8px',
                          backgroundColor: colors.primary,
                          borderRadius: '50%',
                          transform: 'translateX(-50%)'
                        }} />
                      </div>
                    </div>
                  </td>
                  
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.textPrimary,
                      transition: 'color 0.3s ease'
                    }}>
                      {formatLargeNumber(metric.marketCap)}
                    </div>
                  </td>
                  
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: getMetricColor(metric.peRatio, 'neutral'),
                      transition: 'color 0.3s ease'
                    }}>
                      {metric.peRatio.toFixed(2)}
                    </div>
                  </td>
                  
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: metric.dividendYield > 0 ? colors.success : colors.textSecondary,
                      transition: 'color 0.3s ease'
                    }}>
                      {formatPercent(metric.dividendYield)}
                    </div>
                  </td>
                  
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: getMetricColor(metric.beta - 1, 'neutral'),
                      transition: 'color 0.3s ease'
                    }}>
                      {metric.beta.toFixed(2)}
                    </div>
                  </td>
                  
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600', 
                        color: colors.textPrimary,
                        transition: 'color 0.3s ease'
                      }}>
                        {metric.volume.toLocaleString()}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: colors.textSecondary,
                        transition: 'color 0.3s ease'
                      }}>
                        Avg: {metric.avgVolume.toLocaleString()}
                      </div>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Cards */}
      <div style={{ 
        padding: '1.5rem', 
        borderTop: `1px solid ${colors.border}`,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          ...themeStyles.card, 
          padding: '1rem',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <TrendingUp size={16} color={colors.success} />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              transition: 'color 0.3s ease'
            }}>
              Highest P/E
            </span>
          </div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: colors.textPrimary,
            transition: 'color 0.3s ease'
          }}>
            {stockMetrics.length > 0 ? Math.max(...stockMetrics.map(m => m.peRatio)).toFixed(2) : 'N/A'}
          </div>
        </div>

        <div style={{ 
          ...themeStyles.card, 
          padding: '1rem',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Percent size={16} color={colors.primary} />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              transition: 'color 0.3s ease'
            }}>
              Highest Yield
            </span>
          </div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: colors.textPrimary,
            transition: 'color 0.3s ease'
          }}>
            {stockMetrics.length > 0 ? Math.max(...stockMetrics.map(m => m.dividendYield)).toFixed(2) + '%' : 'N/A'}
          </div>
        </div>

        <div style={{ 
          ...themeStyles.card, 
          padding: '1rem',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <DollarSign size={16} color={colors.warning} />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              transition: 'color 0.3s ease'
            }}>
              Total Market Cap
            </span>
          </div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: colors.textPrimary,
            transition: 'color 0.3s ease'
          }}>
            {formatLargeNumber(stockMetrics.reduce((sum, m) => sum + m.marketCap, 0))}
          </div>
        </div>

        <div style={{ 
          ...themeStyles.card, 
          padding: '1rem',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Calendar size={16} color={colors.error} />
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              transition: 'color 0.3s ease'
            }}>
              Avg Beta
            </span>
          </div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: 'bold', 
            color: colors.textPrimary,
            transition: 'color 0.3s ease'
          }}>
            {stockMetrics.length > 0 ? (stockMetrics.reduce((sum, m) => sum + m.beta, 0) / stockMetrics.length).toFixed(2) : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  )
}
