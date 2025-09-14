import { useState, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, TrendingDown, AlertTriangle, Target, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react'
import type { Portfolio } from '../types/index.js'
import { getThemeColors, getThemeStyles } from '../utils/theme'

interface AdvancedAnalyticsProps {
  portfolio: Portfolio
  isDarkMode?: boolean
}

interface RiskMetrics {
  beta: number
  volatility: number
  sharpeRatio: number
  maxDrawdown: number
  var95: number
  correlation: number
}

interface PerformanceAttribution {
  symbol: string
  name: string
  contribution: number
  contributionPercent: number
  weight: number
  return: number
}

interface CorrelationData {
  symbol1: string
  symbol2: string
  correlation: number
}

export function AdvancedAnalytics({ portfolio, isDarkMode = false }: AdvancedAnalyticsProps) {
  const colors = getThemeColors(isDarkMode)
  const themeStyles = getThemeStyles(isDarkMode)
  const [activeTab, setActiveTab] = useState<'risk' | 'attribution' | 'correlation' | 'sector'>('risk')

  // Calculate risk metrics
  const riskMetrics = useMemo((): RiskMetrics => {
    const holdings = portfolio.holdings
    if (holdings.length === 0) {
      return {
        beta: 0,
        volatility: 0,
        sharpeRatio: 0,
        maxDrawdown: 0,
        var95: 0,
        correlation: 0
      }
    }

    // Calculate portfolio beta (weighted average)
    const totalValue = portfolio.totalValue
    const weightedBeta = holdings.reduce((sum, holding) => {
      const weight = holding.currentValue / totalValue
      const beta = 0.8 + Math.random() * 1.4 // Simulate beta between 0.8-2.2
      return sum + (weight * beta)
    }, 0)

    // Calculate volatility (simplified)
    const volatility = 0.15 + Math.random() * 0.1 // 15-25% volatility

    // Calculate Sharpe ratio (simplified)
    const riskFreeRate = 0.02 // 2% risk-free rate
    const excessReturn = (portfolio.totalGainLossPercent / 100) - riskFreeRate
    const sharpeRatio = volatility > 0 ? excessReturn / volatility : 0

    // Calculate max drawdown (simplified)
    const maxDrawdown = Math.abs(portfolio.totalGainLossPercent) * 0.3 // 30% of total loss

    // Calculate VaR 95% (simplified)
    const var95 = totalValue * volatility * 1.645 // 95% confidence level

    // Calculate average correlation
    const correlation = 0.3 + Math.random() * 0.4 // 30-70% correlation

    return {
      beta: parseFloat(weightedBeta.toFixed(2)),
      volatility: parseFloat((volatility * 100).toFixed(1)),
      sharpeRatio: parseFloat(sharpeRatio.toFixed(2)),
      maxDrawdown: parseFloat(maxDrawdown.toFixed(1)),
      var95: parseFloat(var95.toFixed(0)),
      correlation: parseFloat((correlation * 100).toFixed(1))
    }
  }, [portfolio])

  // Calculate performance attribution
  const performanceAttribution = useMemo((): PerformanceAttribution[] => {
    const holdings = portfolio.holdings
    const totalValue = portfolio.totalValue
    const totalGainLoss = portfolio.totalGainLoss

    return holdings.map(holding => {
      const weight = holding.currentValue / totalValue
      const contribution = holding.gainLoss
      const contributionPercent = totalGainLoss !== 0 ? (contribution / totalGainLoss) * 100 : 0
      const returnPercent = holding.gainLossPercent

      return {
        symbol: holding.asset.symbol,
        name: holding.asset.name,
        contribution: parseFloat(contribution.toFixed(2)),
        contributionPercent: parseFloat(contributionPercent.toFixed(1)),
        weight: parseFloat((weight * 100).toFixed(1)),
        return: parseFloat(returnPercent.toFixed(2))
      }
    }).sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
  }, [portfolio])

  // Calculate correlation matrix
  const correlationData = useMemo((): CorrelationData[] => {
    const holdings = portfolio.holdings
    const correlations: CorrelationData[] = []

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

  // Calculate sector allocation
  const sectorData = useMemo(() => {
    const sectorMap = new Map<string, { value: number; count: number; color: string }>()
    const sectorColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316']
    
    portfolio.holdings.forEach((holding, index) => {
      const sector = (holding.asset as any).sector || 'Technology'
      const value = holding.currentValue
      const color = sectorColors[index % sectorColors.length]
      
      if (sectorMap.has(sector)) {
        const existing = sectorMap.get(sector)!
        sectorMap.set(sector, {
          value: existing.value + value,
          count: existing.count + 1,
          color: existing.color
        })
      } else {
        sectorMap.set(sector, { value, count: 1, color })
      }
    })
    
    return Array.from(sectorMap.entries()).map(([sector, data]) => ({
      name: sector,
      value: parseFloat(data.value.toFixed(2)),
      count: data.count,
      color: data.color
    })).sort((a, b) => b.value - a.value)
  }, [portfolio.holdings])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  const getRiskColor = (value: number, type: 'beta' | 'volatility' | 'sharpe' | 'drawdown') => {
    if (type === 'beta') {
      if (value < 0.8) return colors.success
      if (value < 1.2) return colors.warning
      return colors.error
    }
    if (type === 'volatility') {
      if (value < 15) return colors.success
      if (value < 25) return colors.warning
      return colors.error
    }
    if (type === 'sharpe') {
      if (value > 1) return colors.success
      if (value > 0.5) return colors.warning
      return colors.error
    }
    if (type === 'drawdown') {
      if (value < 10) return colors.success
      if (value < 20) return colors.warning
      return colors.error
    }
    return colors.textPrimary
  }

  const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.5) return colors.error
    if (correlation > 0.2) return colors.warning
    if (correlation > -0.2) return colors.textSecondary
    if (correlation > -0.5) return colors.success
    return colors.primary
  }

  const tabs = [
    { id: 'risk', label: 'Risk Metrics', icon: AlertTriangle },
    { id: 'attribution', label: 'Performance Attribution', icon: Target },
    { id: 'correlation', label: 'Correlation Analysis', icon: BarChart3 },
    { id: 'sector', label: 'Sector Analysis', icon: PieChartIcon }
  ] as const

  return (
    <div style={{ ...themeStyles.card, transition: 'all 0.3s ease' }}>
      {/* Header */}
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Activity size={24} color={colors.primary} />
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: colors.textPrimary, 
            margin: 0,
            transition: 'color 0.3s ease'
          }}>
            Advanced Analytics
          </h3>
        </div>
        <p style={{ 
          color: colors.textSecondary, 
          margin: '0.5rem 0 0 0',
          fontSize: '0.875rem',
          transition: 'color 0.3s ease'
        }}>
          Risk analysis, performance attribution, and correlation insights
        </p>
      </div>

      {/* Tabs */}
      <div style={{ 
        display: 'flex', 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '1rem',
                border: 'none',
                backgroundColor: 'transparent',
                color: activeTab === tab.id ? colors.primary : colors.textSecondary,
                borderBottom: `2px solid ${activeTab === tab.id ? colors.primary : 'transparent'}`,
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

      {/* Content */}
      <div style={{ padding: '1.5rem' }}>
        {activeTab === 'risk' && (
          <div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary, 
              margin: '0 0 1.5rem 0',
              transition: 'color 0.3s ease'
            }}>
              Portfolio Risk Metrics
            </h4>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              <div style={{ ...themeStyles.card, padding: '1.5rem', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <TrendingUp size={16} color={getRiskColor(riskMetrics.beta, 'beta')} />
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.textPrimary,
                    transition: 'color 0.3s ease'
                  }}>
                    Portfolio Beta
                  </span>
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: getRiskColor(riskMetrics.beta, 'beta'),
                  transition: 'color 0.3s ease'
                }}>
                  {riskMetrics.beta}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: colors.textSecondary,
                  transition: 'color 0.3s ease'
                }}>
                  Market sensitivity
                </div>
              </div>

              <div style={{ ...themeStyles.card, padding: '1.5rem', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Activity size={16} color={getRiskColor(riskMetrics.volatility, 'volatility')} />
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.textPrimary,
                    transition: 'color 0.3s ease'
                  }}>
                    Volatility
                  </span>
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: getRiskColor(riskMetrics.volatility, 'volatility'),
                  transition: 'color 0.3s ease'
                }}>
                  {riskMetrics.volatility}%
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: colors.textSecondary,
                  transition: 'color 0.3s ease'
                }}>
                  Annual volatility
                </div>
              </div>

              <div style={{ ...themeStyles.card, padding: '1.5rem', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Target size={16} color={getRiskColor(riskMetrics.sharpeRatio, 'sharpe')} />
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.textPrimary,
                    transition: 'color 0.3s ease'
                  }}>
                    Sharpe Ratio
                  </span>
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: getRiskColor(riskMetrics.sharpeRatio, 'sharpe'),
                  transition: 'color 0.3s ease'
                }}>
                  {riskMetrics.sharpeRatio}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: colors.textSecondary,
                  transition: 'color 0.3s ease'
                }}>
                  Risk-adjusted return
                </div>
              </div>

              <div style={{ ...themeStyles.card, padding: '1.5rem', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <TrendingDown size={16} color={getRiskColor(riskMetrics.maxDrawdown, 'drawdown')} />
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.textPrimary,
                    transition: 'color 0.3s ease'
                  }}>
                    Max Drawdown
                  </span>
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: getRiskColor(riskMetrics.maxDrawdown, 'drawdown'),
                  transition: 'color 0.3s ease'
                }}>
                  {riskMetrics.maxDrawdown}%
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: colors.textSecondary,
                  transition: 'color 0.3s ease'
                }}>
                  Maximum loss
                </div>
              </div>

              <div style={{ ...themeStyles.card, padding: '1.5rem', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <AlertTriangle size={16} color={colors.warning} />
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.textPrimary,
                    transition: 'color 0.3s ease'
                  }}>
                    VaR (95%)
                  </span>
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: colors.warning,
                  transition: 'color 0.3s ease'
                }}>
                  {formatCurrency(riskMetrics.var95)}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: colors.textSecondary,
                  transition: 'color 0.3s ease'
                }}>
                  Value at Risk
                </div>
              </div>

              <div style={{ ...themeStyles.card, padding: '1.5rem', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <BarChart3 size={16} color={colors.primary} />
                  <span style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.textPrimary,
                    transition: 'color 0.3s ease'
                  }}>
                    Avg Correlation
                  </span>
                </div>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold', 
                  color: colors.primary,
                  transition: 'color 0.3s ease'
                }}>
                  {riskMetrics.correlation}%
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: colors.textSecondary,
                  transition: 'color 0.3s ease'
                }}>
                  Holdings correlation
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'attribution' && (
          <div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary, 
              margin: '0 0 1.5rem 0',
              transition: 'color 0.3s ease'
            }}>
              Performance Attribution
            </h4>
            
            <div style={{ height: '400px', marginBottom: '1.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={performanceAttribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.border} />
                  <XAxis 
                    dataKey="symbol" 
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
                      name === 'contribution' ? 'Contribution' : 'Weight',
                      name === 'contribution' ? formatCurrency(value) : `${value}%`
                    ]}
                  />
                  <Bar dataKey="contribution" fill={colors.primary} name="contribution" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem' 
            }}>
              {performanceAttribution.map((item, index) => (
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
                      {item.symbol}
                    </div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: item.contribution >= 0 ? colors.success : colors.error,
                      transition: 'color 0.3s ease'
                    }}>
                      {formatCurrency(item.contribution)}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: colors.textSecondary,
                    marginBottom: '0.25rem',
                    transition: 'color 0.3s ease'
                  }}>
                    {item.name}
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    fontSize: '0.75rem',
                    color: colors.textSecondary,
                    transition: 'color 0.3s ease'
                  }}>
                    <span>Weight: {item.weight}%</span>
                    <span>Return: {formatPercent(item.return)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'correlation' && (
          <div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary, 
              margin: '0 0 1.5rem 0',
              transition: 'color 0.3s ease'
            }}>
              Correlation Matrix
            </h4>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              {correlationData.slice(0, 8).map((correlation, index) => (
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

        {activeTab === 'sector' && (
          <div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary, 
              margin: '0 0 1.5rem 0',
              transition: 'color 0.3s ease'
            }}>
              Sector Allocation Analysis
            </h4>
            
            <div style={{ height: '300px', marginBottom: '1.5rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sectorData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
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

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              {sectorData.map((sector, index) => (
                <div key={index} style={{ 
                  ...themeStyles.card, 
                  padding: '1rem',
                  transition: 'all 0.3s ease'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <div style={{ 
                      width: '12px', 
                      height: '12px', 
                      borderRadius: '50%', 
                      backgroundColor: sector.color 
                    }} />
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.textPrimary,
                      transition: 'color 0.3s ease'
                    }}>
                      {sector.name}
                    </div>
                  </div>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    color: colors.textPrimary,
                    marginBottom: '0.25rem',
                    transition: 'color 0.3s ease'
                  }}>
                    {formatCurrency(sector.value)}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: colors.textSecondary,
                    transition: 'color 0.3s ease'
                  }}>
                    {sector.count} holding{sector.count !== 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
