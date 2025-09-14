import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Portfolio, Transaction, Asset } from '../types/index'
import { sampleAssets } from '../data/sampleData'

interface AddTransactionProps {
  portfolio: Portfolio
  setPortfolio: (portfolio: Portfolio) => void
}

export function AddTransaction({ portfolio, setPortfolio }: AddTransactionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    assetId: '',
    type: 'buy' as 'buy' | 'sell',
    quantity: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    fees: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.assetId || !formData.quantity || !formData.price) {
      alert('Please fill in all required fields')
      return
    }

    const asset = sampleAssets.find(a => a.id === formData.assetId)
    if (!asset) return

    const quantity = parseFloat(formData.quantity)
    const price = parseFloat(formData.price)
    const fees = parseFloat(formData.fees) || 0
    const totalAmount = quantity * price

    const newTransaction: Transaction = {
      id: Date.now().toString(),
      asset,
      type: formData.type,
      quantity,
      price,
      totalAmount,
      date: new Date(formData.date),
      fees,
      notes: formData.notes,
    }

    // Update portfolio with new transaction
    const updatedTransactions = [...portfolio.transactions, newTransaction]
    
    // For simplicity, we'll just add the transaction without updating holdings
    // In a real app, you'd recalculate holdings based on transactions
    const updatedPortfolio: Portfolio = {
      ...portfolio,
      transactions: updatedTransactions,
      lastUpdated: new Date(),
    }

    setPortfolio(updatedPortfolio)
    
    // Reset form
    setFormData({
      assetId: '',
      type: 'buy',
      quantity: '',
      price: '',
      date: new Date().toISOString().split('T')[0],
      fees: '',
      notes: '',
    })
    
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem' }}>
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: '1px solid #e5e7eb', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center' 
      }}>
        <div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>Add Transaction</h3>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>Record a new buy or sell transaction</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '0.5rem 1rem',
            border: '1px solid transparent',
            fontSize: '0.875rem',
            fontWeight: '500',
            borderRadius: '0.375rem',
            color: 'white',
            backgroundColor: '#2563eb',
            cursor: 'pointer'
          }}
        >
          <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
          {isOpen ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {isOpen && (
        <div style={{ padding: '1.5rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem' 
            }}>
              <div>
                <label htmlFor="assetId" style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  Asset *
                </label>
                <select
                  id="assetId"
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleInputChange}
                  style={{
                    marginTop: '0.25rem',
                    display: 'block',
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem'
                  }}
                  required
                >
                  <option value="">Select an asset</option>
                  {sampleAssets.map(asset => (
                    <option key={asset.id} value={asset.id}>
                      {asset.symbol} - {asset.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="type" style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  Transaction Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  style={{
                    marginTop: '0.25rem',
                    display: 'block',
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem'
                  }}
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>

              <div>
                <label htmlFor="quantity" style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  Quantity *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  step="0.0001"
                  min="0"
                  style={{
                    marginTop: '0.25rem',
                    display: 'block',
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem'
                  }}
                  required
                />
              </div>

              <div>
                <label htmlFor="price" style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  Price per Share *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  style={{
                    marginTop: '0.25rem',
                    display: 'block',
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem'
                  }}
                  required
                />
              </div>

              <div>
                <label htmlFor="date" style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  style={{
                    marginTop: '0.25rem',
                    display: 'block',
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem'
                  }}
                  required
                />
              </div>

              <div>
                <label htmlFor="fees" style={{ 
                  display: 'block', 
                  fontSize: '0.875rem', 
                  fontWeight: '500', 
                  color: '#374151',
                  marginBottom: '0.25rem'
                }}>
                  Fees
                </label>
                <input
                  type="number"
                  id="fees"
                  name="fees"
                  value={formData.fees}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  style={{
                    marginTop: '0.25rem',
                    display: 'block',
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    fontSize: '0.875rem',
                    padding: '0.5rem 0.75rem'
                  }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" style={{ 
                display: 'block', 
                fontSize: '0.875rem', 
                fontWeight: '500', 
                color: '#374151',
                marginBottom: '0.25rem'
              }}>
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                style={{
                  marginTop: '0.25rem',
                  display: 'block',
                  width: '100%',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                  fontSize: '0.875rem',
                  padding: '0.5rem 0.75rem'
                }}
                placeholder="Optional notes about this transaction"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  border: '1px solid #d1d5db',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: '0.375rem',
                  color: '#374151',
                  backgroundColor: 'white',
                  cursor: 'pointer'
                }}
              >
                <X style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '0.5rem 1rem',
                  border: '1px solid transparent',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  borderRadius: '0.375rem',
                  color: 'white',
                  backgroundColor: '#2563eb',
                  cursor: 'pointer'
                }}
              >
                <Plus style={{ height: '1rem', width: '1rem', marginRight: '0.5rem' }} />
                Add Transaction
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
