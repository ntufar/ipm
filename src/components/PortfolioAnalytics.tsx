import { TrendingUp, TrendingDown, BarChart3, PieChart } from 'lucide-react'
import type { Portfolio, Holding } from '../types/index.js'
import { formatCurrency, formatPercent } from '../utils/calculations'
import { useTheme } from '../contexts/ThemeContext'

interface PortfolioAnalyticsProps {
  portfolio: Portfolio
}

export function PortfolioAnalytics({ portfolio }: PortfolioAnalyticsProps) {
  const { isDarkMode } = useTheme()
  const colors = getThemeColors(isDarkMode)
  
  // Calculate additional analytics
  const totalHoldings = portfolio.holdings.length
  const avgGainLoss = portfolio.holdings.reduce((sum, holding) => sum + holding.gainLossPercent, 0) / totalHoldings
  const bestPerformer = portfolio.holdings.reduce((best, holding) => 
    holding.gainLossPercent > best.gainLossPercent ? holding : best
  )
  const worstPerformer = portfolio.holdings.reduce((worst, holding) => 
    holding.gainLossPercent < worst.gainLossPercent ? holding : worst
  )
  
  // Sector analysis (simplified)
  const sectors = portfolio.holdings.reduce((acc, holding) => {
    const sector = getSector(holding.asset.symbol)
    if (!acc[sector]) {
      acc[sector] = { value: 0, count: 0 }
    }
    acc[sector].value += holding.currentValue
    acc[sector].count += 1
    return acc
  }, {} as Record<string, { value: number; count: number }>)
  
  const sectorAllocation = Object.entries(sectors)
    .map(([sector, data]) => ({
      sector,
      value: data.value,
      percentage: (data.value / portfolio.totalValue) * 100,
      count: data.count
    }))
    .sort((a, b) => b.value - a.value)
  
  // Risk metrics (simplified)
  const volatility = calculateVolatility(portfolio.holdings)
  const sharpeRatio = calculateSharpeRatio(portfolio)
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Key Metrics */}
      <div style={{ ...getThemeStyles(isDarkMode).card, padding: '1.5rem' }}>
        <h3 style={{ 
          fontSize: '1.125rem', 
          fontWeight: '500', 
          color: colors.textPrimary, 
          margin: '0 0 1rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <BarChart3 size={20} />
          Key Metrics
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: colors.surfaceSecondary, borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: colors.textPrimary }}>
              {totalHoldings}
            </div>
            <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>Total Holdings</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: colors.surfaceSecondary, borderRadius: '0.5rem' }}>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: avgGainLoss >= 0 ? colors.chartGreen : colors.chartRed,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.25rem'
            }}>
              {avgGainLoss >= 0 ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
              {formatPercent(avgGainLoss)}
            </div>
            <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>Avg Performance</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: colors.surfaceSecondary, borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.textPrimary }}>
              {volatility.toFixed(1)}%
            </div>
            <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>Volatility</div>
          </div>
          
          <div style={{ textAlign: 'center', padding: '1rem', backgroundColor: colors.surfaceSecondary, borderRadius: '0.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: colors.textPrimary }}>
              {sharpeRatio.toFixed(2)}
            </div>
            <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>Sharpe Ratio</div>
          </div>
        </div>
      </div>
      
      {/* Top Performers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ ...getThemeStyles(isDarkMode).card, padding: '1.5rem' }}>
          <h4 style={{ 
            fontSize: '1rem', 
            fontWeight: '500', 
            color: colors.textPrimary, 
            margin: '0 0 1rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <TrendingUp size={16} color={colors.chartGreen} />
            Best Performer
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '600', color: colors.textPrimary }}>{bestPerformer.asset.symbol}</div>
              <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>{bestPerformer.asset.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontWeight: '600', 
                color: colors.chartGreen,
                fontSize: '1.125rem'
              }}>
                {formatPercent(bestPerformer.gainLossPercent)}
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>
                {formatCurrency(bestPerformer.gainLoss)}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ ...getThemeStyles(isDarkMode).card, padding: '1.5rem' }}>
          <h4 style={{ 
            fontSize: '1rem', 
            fontWeight: '500', 
            color: colors.textPrimary, 
            margin: '0 0 1rem 0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <TrendingDown size={16} color={colors.chartRed} />
            Worst Performer
          </h4>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: '600', color: colors.textPrimary }}>{worstPerformer.asset.symbol}</div>
              <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>{worstPerformer.asset.name}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ 
                fontWeight: '600', 
                color: colors.chartRed,
                fontSize: '1.125rem'
              }}>
                {formatPercent(worstPerformer.gainLossPercent)}
              </div>
              <div style={{ fontSize: '0.875rem', color: colors.textSecondary }}>
                {formatCurrency(worstPerformer.gainLoss)}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sector Allocation */}
      <div style={{ ...getThemeStyles(isDarkMode).card, padding: '1.5rem' }}>
        <h4 style={{ 
          fontSize: '1rem', 
          fontWeight: '500', 
          color: colors.textPrimary, 
          margin: '0 0 1rem 0',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <PieChart size={16} />
          Sector Allocation
        </h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {sectorAllocation.map((sector, index) => (
            <div key={sector.sector} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ 
                width: '12px', 
                height: '12px', 
                borderRadius: '50%', 
                backgroundColor: getSectorColor(index)
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '500', color: colors.textPrimary }}>{sector.sector}</span>
                  <span style={{ color: colors.textSecondary, fontSize: '0.875rem' }}>
                    {formatPercent(sector.percentage)} ({sector.count} stocks)
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '4px', 
                  backgroundColor: colors.surfaceSecondary, 
                  borderRadius: '2px',
                  marginTop: '0.25rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${sector.percentage}%`,
                    height: '100%',
                    backgroundColor: getSectorColor(index),
                    transition: 'width 0.3s ease'
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Helper functions
function getSector(symbol: string): string {
  const sectorMap: Record<string, string> = {
    'AAPL': 'Technology',
    'GOOGL': 'Technology',
    'MSFT': 'Technology',
    'NVDA': 'Technology',
    'TSLA': 'Automotive',
    'AMZN': 'Consumer Discretionary',
    'META': 'Technology',
    'NFLX': 'Communication Services',
    'DIS': 'Communication Services',
    'JPM': 'Financial Services',
    'BAC': 'Financial Services',
    'WMT': 'Consumer Staples',
    'JNJ': 'Healthcare',
    'PFE': 'Healthcare',
    'KO': 'Consumer Staples'
  }
  return sectorMap[symbol] || 'Other'
}

function getSectorColor(index: number): string {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']
  return colors[index % colors.length]
}

function calculateVolatility(holdings: Holding[]): number {
  // Simplified volatility calculation
  const returns = holdings.map(h => h.gainLossPercent)
  const avgReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length
  return Math.sqrt(variance)
}

function calculateSharpeRatio(portfolio: Portfolio): number {
  // Simplified Sharpe ratio (assuming 2% risk-free rate)
  const riskFreeRate = 2.0
  const excessReturn = portfolio.totalGainLossPercent - riskFreeRate
  const volatility = calculateVolatility(portfolio.holdings)
  return volatility > 0 ? excessReturn / volatility : 0
}

// Import theme utilities
import { getThemeColors, getThemeStyles } from '../utils/theme'
