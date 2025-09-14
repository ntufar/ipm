import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Portfolio, Transaction, Asset } from '../types'
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
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Add Transaction</h3>
          <p className="text-sm text-gray-500">Record a new buy or sell transaction</p>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isOpen ? 'Cancel' : 'Add Transaction'}
        </button>
      </div>

      {isOpen && (
        <div className="px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="assetId" className="block text-sm font-medium text-gray-700">
                  Asset *
                </label>
                <select
                  id="assetId"
                  name="assetId"
                  value={formData.assetId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
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
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Transaction Type *
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="buy">Buy</option>
                  <option value="sell">Sell</option>
                </select>
              </div>

              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label htmlFor="fees" className="block text-sm font-medium text-gray-700">
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
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={3}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Optional notes about this transaction"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
