import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, TrendingDown, Activity, PieChart as PieChartIcon } from 'lucide-react'
import type { Portfolio } from '../types/index.js'
import { getThemeColors, getThemeStyles } from '../utils/theme'

interface AdvancedChartsProps {
  portfolio: Portfolio
  isDarkMode?: boolean
}

interface CorrelationData {
  symbol1: string
  symbol2: string
  correlation: number
}

interface CandlestickData {
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export function AdvancedCharts({ portfolio, isDarkMode = false }: AdvancedChartsProps) {
  const colors = getThemeColors(isDarkMode)
  const themeStyles = getThemeStyles(isDarkMode)
  const [activeChart, setActiveChart] = useState<'candlestick' | 'correlation' | 'sector' | 'performance'>('candlestick')

  // Generate sample candlestick data
  const candlestickData: CandlestickData[] = useMemo(() => {
    const data = []
    const basePrice = 100
    let currentPrice = basePrice
    
    for (let i = 0; i < 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      
      const open = currentPrice
      const volatility = 0.02
      const change = (Math.random() - 0.5) * volatility * currentPrice
      const close = Math.max(0.01, open + change)
      const high = Math.max(open, close) + Math.random() * volatility * currentPrice
      const low = Math.min(open, close) - Math.random() * volatility * currentPrice
      const volume = Math.floor(Math.random() * 1000000) + 100000
      
      data.push({
        date: date.toISOString().split('T')[0],
        open: parseFloat(open.toFixed(2)),
        high: parseFloat(high.toFixed(2)),
        low: parseFloat(low.toFixed(2)),
        close: parseFloat(close.toFixed(2)),
        volume
      })
      
      currentPrice = close
    }
    
    return data
  }, [])

  // Calculate correlation matrix
  const correlationData: CorrelationData[] = useMemo(() => {
    const holdings = portfolio.holdings
    const correlations = []
    
    for (let i = 0; i < holdings.length; i++) {
      for (let j = i + 1; j < holdings.length; j++) {
        const holding1 = holdings[i]
        const holding2 = holdings[j]
        
        // Simulate correlation based on sector similarity
        const sector1 = (holding1.asset as any).sector || 'Technology'
        const sector2 = (holding2.asset as any).sector || 'Technology'
        const isSameSector = sector1 === sector2
        
        const correlation = isSameSector 
          ? 0.6 + Math.random() * 0.3  // Higher correlation for same sector
          : -0.2 + Math.random() * 0.4  // Lower correlation for different sectors
        
        correlations.push({
          symbol1: holding1.asset.symbol,
          symbol2: holding2.asset.symbol,
          correlation: parseFloat(correlation.toFixed(3))
        })
      }
    }
    
    return correlations.sort((a, b) => Math.abs(b.correlation) - Math.abs(a.correlation))
  }, [portfolio.holdings])

  // Sector allocation data
  const sectorData = useMemo(() => {
    const sectorMap = new Map<string, { value: number; count: number }>()
    
    portfolio.holdings.forEach(holding => {
      const sector = (holding.asset as any).sector || 'Other'
      const value = holding.currentValue
      
      if (sectorMap.has(sector)) {
        const existing = sectorMap.get(sector)!
        sectorMap.set(sector, {
          value: existing.value + value,
          count: existing.count + 1
        })
      } else {
        sectorMap.set(sector, { value, count: 1 })
      }
    })
    
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']
    
    return Array.from(sectorMap.entries()).map(([sector, data], index) => ({
      name: sector,
      value: parseFloat(data.value.toFixed(2)),
      count: data.count,
      color: colors[index % colors.length]
    })).sort((a, b) => b.value - a.value)
  }, [portfolio.holdings])

  // Performance over time data
  const performanceData = useMemo(() => {
    const data = []
    const baseValue = portfolio.totalCost
    let currentValue = baseValue
    
    for (let i = 0; i < 12; i++) {
      const date = new Date()
      date.setMonth(date.getMonth() - (11 - i))
      
      const change = (Math.random() - 0.5) * 0.1 * currentValue
      currentValue = Math.max(0.01, currentValue + change)
      
      data.push({
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        value: parseFloat(currentValue.toFixed(2)),
        return: parseFloat(((currentValue - baseValue) / baseValue * 100).toFixed(2))
      })
    }
    
    return data
  }, [portfolio.totalCost])

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

  const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.5) return colors.error
    if (correlation > 0.2) return colors.warning
    if (correlation > -0.2) return colors.textSecondary
    if (correlation > -0.5) return colors.success
    return colors.primary
  }

  const chartTabs = [
    { id: 'candlestick', label: 'Candlestick', icon: Activity },
    { id: 'correlation', label: 'Correlation', icon: TrendingUp },
    { id: 'sector', label: 'Sector Allocation', icon: PieChartIcon },
    { id: 'performance', label: 'Performance', icon: TrendingDown }
  ] as const

  return (
    <div style={{ ...themeStyles.card, transition: 'all 0.3s ease' }}>
      {/* Header */}
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: '600', 
          color: colors.textPrimary, 
          margin: 0,
          transition: 'color 0.3s ease'
        }}>
          Advanced Charts & Analytics
        </h3>
        <p style={{ 
          color: colors.textSecondary, 
          margin: '0.5rem 0 0 0',
          fontSize: '0.875rem',
          transition: 'color 0.3s ease'
        }}>
          Detailed visualizations and correlation analysis
        </p>
      </div>

      {/* Chart Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        {chartTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveChart(tab.id)}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeChart === tab.id ? colors.primary : colors.textSecondary,
                borderBottom: `2px solid ${activeChart === tab.id ? colors.primary : 'transparent'}`,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Chart Content */}
      <div style={{ padding: '1.5rem' }}>
        {activeChart === 'candlestick' && (
          <div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary, 
              margin: '0 0 1rem 0',
              transition: 'color 0.3s ease'
            }}>
              Portfolio Performance (Candlestick View)
            </h4>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={candlestickData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis 
                    dataKey="date" 
                    stroke={colors.textSecondary}
                    fontSize={12}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
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
                      name === 'high' ? 'High' : name === 'low' ? 'Low' : name === 'open' ? 'Open' : 'Close',
                      formatCurrency(value)
                    ]}
                  />
                  <Bar dataKey="high" fill={colors.success} name="high" />
                  <Bar dataKey="low" fill={colors.error} name="low" />
                  <Bar dataKey="open" fill={colors.primary} name="open" />
                  <Bar dataKey="close" fill={colors.warning} name="close" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeChart === 'correlation' && (
          <div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary, 
              margin: '0 0 1rem 0',
              transition: 'color 0.3s ease'
            }}>
              Asset Correlation Matrix
            </h4>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              {correlationData.slice(0, 6).map((correlation, index) => (
                <div key={index} style={{ 
                  ...themeStyles.card, 
                  padding: '1rem',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.textPrimary,
                      transition: 'color 0.3s ease'
                    }}>
                      {correlation.symbol1} ↔ {correlation.symbol2}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: getCorrelationColor(correlation.correlation),
                      transition: 'color 0.3s ease'
                    }}>
                      {correlation.correlation.toFixed(3)}
                    </div>
                  </div>
                  <div style={{ 
                    width: '100%', 
                    height: '4px', 
                    backgroundColor: colors.border,
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{ 
                      width: `${Math.abs(correlation.correlation) * 100}%`,
                      height: '100%',
                      backgroundColor: getCorrelationColor(correlation.correlation),
                      transition: 'all 0.3s ease'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeChart === 'sector' && (
          <div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary, 
              margin: '0 0 1rem 0',
              transition: 'color 0.3s ease'
            }}>
              Sector Allocation
            </h4>
            <div style={{ height: '300px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sectorData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: colors.surface,
                      border: `1px solid ${colors.border}`,
                      borderRadius: '0.5rem',
                      color: colors.textPrimary
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Value']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeChart === 'performance' && (
          <div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary, 
              margin: '0 0 1rem 0',
              transition: 'color 0.3s ease'
            }}>
              Portfolio Performance Over Time
            </h4>
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
                      name === 'value' ? 'Portfolio Value' : 'Return',
                      name === 'value' ? formatCurrency(value) : formatPercent(value)
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={colors.primary} 
                    strokeWidth={2}
                    dot={{ fill: colors.primary, strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
