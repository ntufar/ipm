import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react'
import type { Portfolio } from '../types/index.js'
import { getThemeColors, getThemeStyles } from '../utils/theme'

interface MarketIndex {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  color: string
}

interface PortfolioComparisonProps {
  portfolio: Portfolio
  isDarkMode?: boolean
}

export function PortfolioComparison({ portfolio, isDarkMode = false }: PortfolioComparisonProps) {
  const colors = getThemeColors(isDarkMode)
  const themeStyles = getThemeStyles(isDarkMode)
  const [marketIndices] = useState<MarketIndex[]>([
    {
      symbol: 'SPY',
      name: 'S&P 500',
      price: 4500.00,
      change: 25.50,
      changePercent: 0.57,
      color: '#3b82f6'
    },
    {
      symbol: 'QQQ',
      name: 'NASDAQ',
      price: 3800.00,
      change: -15.25,
      changePercent: -0.40,
      color: '#10b981'
    },
    {
      symbol: 'DIA',
      name: 'Dow Jones',
      price: 35000.00,
      change: 125.75,
      changePercent: 0.36,
      color: '#f59e0b'
    }
  ])

  const [portfolioPerformance, setPortfolioPerformance] = useState({
    day: 0,
    week: 0,
    month: 0,
    year: 0
  })

  // Calculate portfolio performance (simplified)
  useEffect(() => {
    const totalGainLoss = portfolio.totalGainLoss
    const totalCost = portfolio.totalCost
    const performance = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0
    
    setPortfolioPerformance({
      day: performance * 0.1, // Simulate daily performance
      week: performance * 0.3,
      month: performance * 0.7,
      year: performance
    })
  }, [portfolio])

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ ...themeStyles.card, transition: 'all 0.3s ease' }}>
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: `1px solid ${colors.border}`,
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BarChart3 size={24} color={colors.primary} />
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: colors.textPrimary, 
              margin: 0,
              transition: 'color 0.3s ease'
            }}>
              Portfolio vs Market Indices
            </h3>
          </div>
          <p style={{ 
            color: colors.textSecondary, 
            margin: '0.5rem 0 0 0',
            fontSize: '0.875rem',
            transition: 'color 0.3s ease'
          }}>
            Compare your portfolio performance against major market indices
          </p>
        </div>
      </div>

      {/* Performance Comparison Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {/* Portfolio Performance */}
        <div style={{ ...themeStyles.card, transition: 'all 0.3s ease' }}>
          <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <PieChart size={20} color={colors.primary} />
              <h4 style={{ 
                fontSize: '1rem', 
                fontWeight: '600', 
                color: colors.textPrimary, 
                margin: 0,
                transition: 'color 0.3s ease'
              }}>
                Your Portfolio
              </h4>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold', 
                color: colors.textPrimary,
                transition: 'color 0.3s ease'
              }}>
                {formatCurrency(portfolio.totalValue)}
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                color: colors.textSecondary,
                transition: 'color 0.3s ease'
              }}>
                Total Value
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  color: portfolio.totalGainLoss >= 0 ? colors.success : colors.error,
                  transition: 'color 0.3s ease'
                }}>
                  {formatCurrency(portfolio.totalGainLoss)}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: colors.textSecondary,
                  transition: 'color 0.3s ease'
                }}>
                  Total P&L
                </div>
              </div>
              <div>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: '600', 
                  color: portfolio.totalGainLossPercent >= 0 ? colors.success : colors.error,
                  transition: 'color 0.3s ease'
                }}>
                  {formatPercent(portfolio.totalGainLossPercent)}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: colors.textSecondary,
                  transition: 'color 0.3s ease'
                }}>
                  Total Return
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Market Indices */}
        {marketIndices.map((index) => (
          <div key={index.symbol} style={{ ...themeStyles.card, transition: 'all 0.3s ease' }}>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%', 
                  backgroundColor: index.color 
                }} />
                <h4 style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: colors.textPrimary, 
                  margin: 0,
                  transition: 'color 0.3s ease'
                }}>
                  {index.name}
                </h4>
                <span style={{ 
                  fontSize: '0.75rem', 
                  color: colors.textSecondary,
                  backgroundColor: colors.surface,
                  padding: '0.25rem 0.5rem',
                  borderRadius: '0.25rem',
                  transition: 'all 0.3s ease'
                }}>
                  {index.symbol}
                </span>
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: colors.textPrimary,
                  transition: 'color 0.3s ease'
                }}>
                  {formatCurrency(index.price)}
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: colors.textSecondary,
                  transition: 'color 0.3s ease'
                }}>
                  Current Price
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {index.change >= 0 ? (
                  <TrendingUp size={16} color={colors.success} />
                ) : (
                  <TrendingDown size={16} color={colors.error} />
                )}
                <div style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600', 
                  color: index.change >= 0 ? colors.success : colors.error,
                  transition: 'color 0.3s ease'
                }}>
                  {formatCurrency(index.change)} ({formatPercent(index.changePercent)})
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Comparison Chart */}
      <div style={{ ...themeStyles.card, transition: 'all 0.3s ease' }}>
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: `1px solid ${colors.border}`,
          transition: 'all 0.3s ease'
        }}>
          <h4 style={{ 
            fontSize: '1.125rem', 
            fontWeight: '600', 
            color: colors.textPrimary, 
            margin: 0,
            transition: 'color 0.3s ease'
          }}>
            Performance Comparison
          </h4>
          <p style={{ 
            color: colors.textSecondary, 
            margin: '0.5rem 0 0 0',
            fontSize: '0.875rem',
            transition: 'color 0.3s ease'
          }}>
            How your portfolio compares to market indices over time
          </p>
        </div>
        
        <div style={{ padding: '1.5rem' }}>
          <div style={{ 
            height: '200px', 
            display: 'flex', 
            alignItems: 'end', 
            gap: '1rem',
            padding: '1rem 0'
          }}>
            {/* Portfolio Bar */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ 
                width: '100%', 
                height: `${Math.max(20, Math.abs(portfolioPerformance.year) * 2)}px`,
                backgroundColor: portfolioPerformance.year >= 0 ? colors.success : colors.error,
                borderRadius: '0.25rem 0.25rem 0 0',
                marginBottom: '0.5rem',
                transition: 'all 0.3s ease'
              }} />
              <div style={{ 
                fontSize: '0.75rem', 
                fontWeight: '600', 
                color: colors.textPrimary,
                transition: 'color 0.3s ease'
              }}>
                Portfolio
              </div>
              <div style={{ 
                fontSize: '0.75rem', 
                color: colors.textSecondary,
                transition: 'color 0.3s ease'
              }}>
                {formatPercent(portfolioPerformance.year)}
              </div>
            </div>

            {/* Market Indices Bars */}
            {marketIndices.map((index) => (
              <div key={index.symbol} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: '100%', 
                  height: `${Math.max(20, Math.abs(index.changePercent) * 2)}px`,
                  backgroundColor: index.color,
                  borderRadius: '0.25rem 0.25rem 0 0',
                  marginBottom: '0.5rem',
                  transition: 'all 0.3s ease'
                }} />
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontWeight: '600', 
                  color: colors.textPrimary,
                  transition: 'color 0.3s ease'
                }}>
                  {index.symbol}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: colors.textSecondary,
                  transition: 'color 0.3s ease'
                }}>
                  {formatPercent(index.changePercent)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
