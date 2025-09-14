import type { Transaction } from '../types/index.js'
import { format } from 'date-fns'

interface TransactionHistoryProps {
  transactions: Transaction[]
}

export const TransactionHistory = ({ transactions }: TransactionHistoryProps) => {
  if (transactions.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
        <p style={{ margin: 0 }}>No transactions yet. Add your first transaction above!</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {transactions
          .sort((a, b) => b.date.getTime() - a.date.getTime()) // Sort by date, newest first
          .map((transaction) => (
            <div
              key={transaction.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1rem',
                backgroundColor: '#f9fafb',
                borderRadius: '0.5rem',
                border: '1px solid #e5e7eb'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: transaction.type === 'buy' ? '#dcfce7' : '#fef2f2',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    color: transaction.type === 'buy' ? '#16a34a' : '#dc2626'
                  }}
                >
                  {transaction.type === 'buy' ? '↗' : '↘'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: '500', color: '#111827' }}>
                      {transaction.type === 'buy' ? 'Bought' : 'Sold'}
                    </span>
                    <span style={{ fontWeight: '600', color: '#111827' }}>
                      {transaction.quantity} shares
                    </span>
                    <span style={{ color: '#6b7280' }}>of</span>
                    <span style={{ fontWeight: '600', color: '#111827' }}>
                      {transaction.asset.symbol}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                    {format(transaction.date, 'MMM dd, yyyy HH:mm')}
                    {transaction.notes && ` • ${transaction.notes}`}
                  </div>
                </div>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: '600', color: '#111827' }}>
                  ${transaction.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  @ ${transaction.price.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  {transaction.fees && transaction.fees > 0 && (
                    <span> + ${transaction.fees.toFixed(2)} fees</span>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
