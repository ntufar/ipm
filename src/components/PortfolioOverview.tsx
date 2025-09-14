import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'
import type { Portfolio } from '../types/index.js'
import { formatCurrency, formatPercent } from '../utils/calculations'

interface PortfolioOverviewProps {
  portfolio: Portfolio
}

export function PortfolioOverview({ portfolio }: PortfolioOverviewProps) {
  const isPositive = portfolio.totalGainLoss >= 0

  return (
    <div style={{ 
      display: 'grid', 
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
      gap: '1.5rem' 
    }}>
      {/* Total Portfolio Value */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
        padding: '1.5rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flexShrink: 0 }}>
            <DollarSign style={{ height: '2rem', width: '2rem', color: '#2563eb' }} />
          </div>
          <div style={{ marginLeft: '1rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>Total Value</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
              {formatCurrency(portfolio.totalValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Total Cost */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
        padding: '1.5rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flexShrink: 0 }}>
            <DollarSign style={{ height: '2rem', width: '2rem', color: '#6b7280' }} />
          </div>
          <div style={{ marginLeft: '1rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>Total Cost</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', margin: 0 }}>
              {formatCurrency(portfolio.totalCost)}
            </p>
          </div>
        </div>
      </div>

      {/* Total Gain/Loss */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
        padding: '1.5rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flexShrink: 0 }}>
            {isPositive ? (
              <TrendingUp style={{ height: '2rem', width: '2rem', color: '#059669' }} />
            ) : (
              <TrendingDown style={{ height: '2rem', width: '2rem', color: '#dc2626' }} />
            )}
          </div>
          <div style={{ marginLeft: '1rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>Total Gain/Loss</p>
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: isPositive ? '#059669' : '#dc2626', 
              margin: 0 
            }}>
              {formatCurrency(portfolio.totalGainLoss)}
            </p>
          </div>
        </div>
      </div>

      {/* Total Gain/Loss Percentage */}
      <div style={{ 
        backgroundColor: 'white', 
        borderRadius: '0.5rem', 
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', 
        padding: '1.5rem' 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ flexShrink: 0 }}>
            <Percent style={{ height: '2rem', width: '2rem', color: '#7c3aed' }} />
          </div>
          <div style={{ marginLeft: '1rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: '500', color: '#6b7280', margin: 0 }}>Gain/Loss %</p>
            <p style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              color: isPositive ? '#059669' : '#dc2626', 
              margin: 0 
            }}>
              {formatPercent(portfolio.totalGainLossPercent)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
