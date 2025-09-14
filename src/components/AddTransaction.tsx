import { useState, useMemo, useEffect } from 'react'
import { Plus, X, Search, Loader2 } from 'lucide-react'
import type { Portfolio, Transaction, Asset, Holding } from '../types/index.js'
import { sampleAssets } from '../data/sampleData'
import { stockSearchService, type StockSearchResult } from '../services/stockSearchService'
import { yahooFinanceService } from '../services/yahooFinanceService'

interface AddTransactionProps {
  portfolio: Portfolio
  setPortfolio: (portfolio: Portfolio) => void
}

export function AddTransaction({ portfolio, setPortfolio }: AddTransactionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null)
  const [formData, setFormData] = useState({
    assetId: '',
    type: 'buy' as 'buy' | 'sell',
    quantity: '',
    price: '',
    date: new Date().toISOString().split('T')[0],
    fees: '',
    notes: '',
  })

  // Search for stocks when search term changes
  useEffect(() => {
    const searchStocks = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const results = await stockSearchService.searchStocks(searchTerm, 10)
        setSearchResults(results)
      } catch (error) {
        console.error('Error searching stocks:', error)
        setSearchResults([])
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(searchStocks, 300) // Debounce search
    return () => clearTimeout(timeoutId)
  }, [searchTerm])

  // Filter sample assets as fallback
  const filteredSampleAssets = useMemo(() => {
    if (!searchTerm) return sampleAssets.slice(0, 5) // Show only first 5 sample assets
    
    return sampleAssets.filter(asset => 
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 5)
  }, [searchTerm])

  const handleStockSelect = async (searchResult: StockSearchResult) => {
    try {
      // Get current price for the selected stock
      const quote = await yahooFinanceService.fetchQuote(searchResult.symbol)
      
      const newAsset: Asset = {
        id: `asset-${Date.now()}`,
        symbol: searchResult.symbol,
        name: searchResult.name,
        currentPrice: quote?.price || 0,
        currency: searchResult.currency || 'USD',
        change24h: quote?.change || 0,
        changePercent24h: quote?.changePercent || 0,
        marketCap: undefined, // Not available in search results
        pe: undefined, // Not available in search results
        dividendYield: undefined, // Not available in search results
        high52Week: undefined, // Not available in search results
        low52Week: undefined, // Not available in search results
      }

      setSelectedAsset(newAsset)
      setFormData(prev => ({
        ...prev,
        assetId: newAsset.id,
        price: newAsset.currentPrice.toString()
      }))
      setSearchTerm(`${searchResult.symbol} - ${searchResult.name}`)
      setSearchResults([])
    } catch (error) {
      console.error('Error selecting stock:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.assetId || !formData.quantity || !formData.price) {
      alert('Please fill in all required fields')
      return
    }

    let asset: Asset
    if (selectedAsset) {
      asset = selectedAsset
    } else {
      const foundAsset = sampleAssets.find(a => a.id === formData.assetId)
      if (!foundAsset) return
      asset = foundAsset
    }

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
    
    // Convert transaction to holdings
    const updatedHoldings = [...portfolio.holdings]
    const existingHoldingIndex = updatedHoldings.findIndex(
      holding => holding.asset.symbol === asset.symbol
    )
    
    if (existingHoldingIndex >= 0) {
      // Update existing holding
      const existingHolding = updatedHoldings[existingHoldingIndex]
      const newQuantity = formData.type === 'buy' 
        ? existingHolding.quantity + quantity
        : existingHolding.quantity - quantity
      
      if (newQuantity <= 0) {
        // Remove holding if quantity becomes zero or negative
        updatedHoldings.splice(existingHoldingIndex, 1)
      } else {
        // Update holding
        const newTotalCost = formData.type === 'buy'
          ? existingHolding.totalCost + totalAmount + fees
          : existingHolding.totalCost - (quantity * existingHolding.averagePrice)
        
        const newAveragePrice = newTotalCost / newQuantity
        const currentValue = newQuantity * asset.currentPrice
        const gainLoss = currentValue - newTotalCost
        const gainLossPercent = (gainLoss / newTotalCost) * 100
        
        updatedHoldings[existingHoldingIndex] = {
          ...existingHolding,
          quantity: newQuantity,
          averagePrice: newAveragePrice,
          totalCost: newTotalCost,
          currentValue,
          gainLoss,
          gainLossPercent
        }
      }
    } else if (formData.type === 'buy') {
      // Add new holding
      const totalCost = totalAmount + fees
      const currentValue = quantity * asset.currentPrice
      const gainLoss = currentValue - totalCost
      const gainLossPercent = (gainLoss / totalCost) * 100
      
      const newHolding: Holding = {
        id: `holding-${Date.now()}`,
        asset,
        quantity,
        averagePrice: price + (fees / quantity),
        purchasePrice: price,
        purchaseDate: new Date(formData.date),
        totalCost,
        currentValue,
        gainLoss,
        gainLossPercent,
        notes: formData.notes
      }
      
      updatedHoldings.push(newHolding)
    }
    
    // Recalculate portfolio totals
    const totalValue = updatedHoldings.reduce((sum, holding) => sum + holding.currentValue, 0)
    const totalCost = updatedHoldings.reduce((sum, holding) => sum + holding.totalCost, 0)
    const totalGainLoss = totalValue - totalCost
    const totalGainLossPercent = (totalCost > 0) ? (totalGainLoss / totalCost) * 100 : 0
    
    const updatedPortfolio: Portfolio = {
      ...portfolio,
      transactions: updatedTransactions,
      holdings: updatedHoldings,
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
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
    setSearchTerm('')
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
                
                {/* Search Input */}
                <div style={{ position: 'relative', width: '100%' }}>
                  <Search size={16} style={{ 
                    position: 'absolute', 
                    left: '0.75rem', 
                    top: '50%', 
                    transform: 'translateY(-50%)', 
                    color: '#6b7280',
                    zIndex: 1
                  }} />
                  <input
                    type="text"
                    placeholder="Search stocks by symbol or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.5rem 0.75rem 0.5rem 2.5rem',
                      border: '1px solid #d1d5db',
                      borderRadius: '0.375rem',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                      position: 'relative',
                      zIndex: 1
                    }}
                  />
                  {isSearching && (
                    <Loader2 size={16} style={{ 
                      position: 'absolute', 
                      right: '0.75rem', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      color: '#6b7280',
                      animation: 'spin 1s linear infinite',
                      zIndex: 1
                    }} />
                  )}
                
                {/* Search Results */}
                {(searchResults.length > 0 || filteredSampleAssets.length > 0) && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.25rem)',
                    left: 0,
                    right: 0,
                    backgroundColor: '#ffffff',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    zIndex: 1000,
                    maxHeight: '300px',
                    overflowY: 'auto',
                    marginTop: '0'
                  }}>
                    {/* API Search Results */}
                    {searchResults.length > 0 && (
                      <>
                        <div style={{ 
                          padding: '0.5rem 0.75rem', 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          color: '#6b7280',
                          backgroundColor: '#f9fafb',
                          borderBottom: '1px solid #e5e7eb'
                        }}>
                          Search Results
                        </div>
                        {searchResults.map((result) => (
                          <button
                            key={result.symbol}
                            type="button"
                            onClick={() => handleStockSelect(result)}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              textAlign: 'left',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              borderBottom: '1px solid #f3f4f6'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f9fafb'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <div style={{ fontWeight: '600', color: '#111827' }}>
                              {result.symbol}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {result.name} • {result.exchange}
                            </div>
                            {result.price && (
                              <div style={{ fontSize: '0.75rem', color: '#059669' }}>
                                ${result.price.toFixed(2)} {result.change && result.changePercent && (
                                  <span style={{ color: result.change >= 0 ? '#059669' : '#dc2626' }}>
                                    ({result.change >= 0 ? '+' : ''}{result.changePercent.toFixed(2)}%)
                                  </span>
                                )}
                              </div>
                            )}
                          </button>
                        ))}
                      </>
                    )}
                    
                    {/* Sample Assets Fallback */}
                    {searchResults.length === 0 && filteredSampleAssets.length > 0 && (
                      <>
                        <div style={{ 
                          padding: '0.5rem 0.75rem', 
                          fontSize: '0.75rem', 
                          fontWeight: '600', 
                          color: '#6b7280',
                          backgroundColor: '#f9fafb',
                          borderBottom: '1px solid #e5e7eb'
                        }}>
                          Popular Stocks
                        </div>
                        {filteredSampleAssets.map((asset) => (
                          <button
                            key={asset.id}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, assetId: asset.id, price: asset.currentPrice.toString() }))
                              setSearchTerm(`${asset.symbol} - ${asset.name}`)
                            }}
                            style={{
                              width: '100%',
                              padding: '0.75rem',
                              textAlign: 'left',
                              border: 'none',
                              backgroundColor: 'transparent',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                              borderBottom: '1px solid #f3f4f6'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#f9fafb'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            <div style={{ fontWeight: '600', color: '#111827' }}>
                              {asset.symbol}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                              {asset.name}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#059669' }}>
                              ${asset.currentPrice.toFixed(2)} ({asset.changePercent24h >= 0 ? '+' : ''}{asset.changePercent24h.toFixed(2)}%)
                            </div>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
                
                {searchResults.length === 0 && filteredSampleAssets.length === 0 && searchTerm && !isSearching && (
                  <p style={{ 
                    fontSize: '0.75rem', 
                    color: '#6b7280', 
                    margin: '0.25rem 0 0 0' 
                  }}>
                    No stocks found matching "{searchTerm}"
                  </p>
                )}
                </div>
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
                onClick={() => {
                  setIsOpen(false)
                  setSearchTerm('')
                }}
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

