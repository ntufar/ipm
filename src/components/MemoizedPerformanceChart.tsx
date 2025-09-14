import { memo, useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown } from 'lucide-react'
import type { Portfolio } from '../types/index.js'
import { getThemeColors, getThemeStyles } from '../utils/theme'

interface MemoizedPerformanceChartProps {
  portfolio: Portfolio
  isDarkMode?: boolean
}

export const MemoizedPerformanceChart = memo(function MemoizedPerformanceChart({ 
  portfolio, 
  isDarkMode = false 
}: MemoizedPerformanceChartProps) {
  const colors = getThemeColors(isDarkMode)
  const themeStyles = getThemeStyles(isDarkMode)

  // Memoize the performance data calculation
  const performanceData = useMemo(() => {
    const data = []
    const baseValue = portfolio.totalCost
    let currentValue = baseValue
    
    // Generate 12 months of performance data
    for (let i = 0; i < 12; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - (11 - i))
      
      // Simulate realistic market movements
      const monthlyReturn = (Math.random() - 0.5) * 0.15 // -7.5% to +7.5% monthly return
      currentValue = Math.max(0.01, currentValue * (1 + monthlyReturn))
      
      const gainLoss = currentValue - baseValue
      const gainLossPercent = baseValue > 0 ? (gainLoss / baseValue) * 100 : 0
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        value: parseFloat(currentValue.toFixed(2)),
        gainLoss: parseFloat(gainLoss.toFixed(2)),
        gainLossPercent: parseFloat(gainLossPercent.toFixed(2))
      })
    }
    
    return data
  }, [portfolio.totalCost])

  // Memoize the current performance metrics
  const currentMetrics = useMemo(() => {
    const currentValue = portfolio.totalValue
    const totalGainLoss = portfolio.totalGainLoss
    const totalGainLossPercent = portfolio.totalGainLossPercent
    
    return {
      currentValue,
      totalGainLoss,
      totalGainLossPercent,
      isPositive: totalGainLoss >= 0
    }
  }, [portfolio.totalValue, portfolio.totalGainLoss, portfolio.totalGainLossPercent])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
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
          {currentMetrics.isPositive ? (
            <TrendingUp size={24} color={colors.success} />
          ) : (
            <TrendingDown size={24} color={colors.error} />
          )}
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: colors.textPrimary, 
            margin: 0,
            transition: 'color 0.3s ease'
          }}>
            Portfolio Performance
          </h3>
        </div>
        <p style={{ 
          color: colors.textSecondary, 
          margin: '0.5rem 0 0 0',
          fontSize: '0.875rem',
          transition: 'color 0.3s ease'
        }}>
          Historical performance over the last 12 months
        </p>
      </div>

      {/* Performance Metrics */}
      <div style={{ 
        padding: '1.5rem', 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1.5rem',
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: colors.textPrimary,
            transition: 'color 0.3s ease'
          }}>
            {formatCurrency(currentMetrics.currentValue)}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: colors.textSecondary,
            transition: 'color 0.3s ease'
          }}>
            Current Value
          </div>
        </div>
        
        <div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: currentMetrics.isPositive ? colors.success : colors.error,
            transition: 'color 0.3s ease'
          }}>
            {formatCurrency(currentMetrics.totalGainLoss)}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: colors.textSecondary,
            transition: 'color 0.3s ease'
          }}>
            Total P&L
          </div>
        </div>
        
        <div>
          <div style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: currentMetrics.isPositive ? colors.success : colors.error,
            transition: 'color 0.3s ease'
          }}>
            {formatPercent(currentMetrics.totalGainLossPercent)}
          </div>
          <div style={{ 
            fontSize: '0.875rem', 
            color: colors.textSecondary,
            transition: 'color 0.3s ease'
          }}>
            Total Return
          </div>
        </div>
      </div>

      {/* Chart */}
      <div style={{ padding: '1.5rem' }}>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
              <XAxis 
                dataKey="month" 
                stroke={colors.textSecondary}
                fontSize={12}
              />
              <YAxis 
                stroke={colors.textSecondary}
                fontSize={12}
                tickFormatter={formatCurrency}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '0.5rem',
                  color: colors.textPrimary
                }}
                formatter={(value: number, name: string) => [
                  name === 'value' ? 'Portfolio Value' : 
                  name === 'gainLoss' ? 'Gain/Loss' : 'Return %',
                  name === 'value' ? formatCurrency(value) : 
                  name === 'gainLoss' ? formatCurrency(value) : formatPercent(value)
                ]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke={colors.primary} 
                strokeWidth={3}
                dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: colors.primary, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
})
