import { TrendingUp, TrendingDown } from 'lucide-react'
import { Holding } from '../types/index'
import { formatCurrency, formatPercent } from '../utils/calculations'

interface HoldingsListProps {
  holdings: Holding[]
}

export function HoldingsList({ holdings }: HoldingsListProps) {
  return (
    <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>Holdings</h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Your current investment positions</p>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ minWidth: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead style={{ backgroundColor: '#f9fafb' }}>
            <tr>
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                color: '#6b7280', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Symbol
              </th>
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                color: '#6b7280', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Name
              </th>
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                color: '#6b7280', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Quantity
              </th>
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                color: '#6b7280', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Avg Price
              </th>
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                color: '#6b7280', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Current Price
              </th>
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                color: '#6b7280', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Current Value
              </th>
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                color: '#6b7280', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #e5e7eb'
              }}>
                Gain/Loss
              </th>
              <th style={{ 
                padding: '0.75rem 1.5rem', 
                textAlign: 'left', 
                fontSize: '0.75rem', 
                fontWeight: '500', 
                color: '#6b7280', 
                textTransform: 'uppercase', 
                letterSpacing: '0.05em',
                borderBottom: '1px solid #e5e7eb'
              }}>
                %
              </th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: 'white' }}>
            {holdings.map((holding) => {
              const isPositive = holding.gainLoss >= 0
              return (
                <tr key={holding.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                      {holding.asset.symbol}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                    <div style={{ fontSize: '0.875rem', color: '#111827' }}>{holding.asset.name}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#111827' }}>
                    {holding.quantity}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#111827' }}>
                    {formatCurrency(holding.averagePrice)}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.875rem', color: '#111827' }}>
                        {formatCurrency(holding.asset.currentPrice)}
                      </span>
                      <span style={{ 
                        marginLeft: '0.5rem', 
                        fontSize: '0.75rem', 
                        color: holding.asset.changePercent24h >= 0 ? '#059669' : '#dc2626'
                      }}>
                        {holding.asset.changePercent24h >= 0 ? '+' : ''}{holding.asset.changePercent24h.toFixed(2)}%
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', fontSize: '0.875rem', color: '#111827' }}>
                    {formatCurrency(holding.currentValue)}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      {isPositive ? (
                        <TrendingUp style={{ height: '1rem', width: '1rem', color: '#059669', marginRight: '0.25rem' }} />
                      ) : (
                        <TrendingDown style={{ height: '1rem', width: '1rem', color: '#dc2626', marginRight: '0.25rem' }} />
                      )}
                      <span style={{ 
                        fontSize: '0.875rem', 
                        color: isPositive ? '#059669' : '#dc2626'
                      }}>
                        {formatCurrency(holding.gainLoss)}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap' }}>
                    <span style={{ 
                      fontSize: '0.875rem', 
                      color: isPositive ? '#059669' : '#dc2626'
                    }}>
                      {formatPercent(holding.gainLossPercent)}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
