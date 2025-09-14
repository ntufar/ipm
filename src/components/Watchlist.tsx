import { useState, useEffect, useMemo } from 'react'
import { Plus, Star, StarOff, Search, EyeOff, Loader2 } from 'lucide-react'
import type { Asset } from '../types/index.js'
import { getThemeColors, getThemeStyles } from '../utils/theme'
import { sampleAssets } from '../data/sampleData'
import { stockSearchService, type StockSearchResult } from '../services/stockSearchService'
import { yahooFinanceService } from '../services/yahooFinanceService'

interface WatchlistProps {
  isDarkMode?: boolean
}

interface WatchlistItem {
  id: string
  asset: Asset
  addedDate: Date
  targetPrice?: number
  notes?: string
  isWatched: boolean
}

export function Watchlist({ isDarkMode = false }: WatchlistProps) {
  const colors = getThemeColors(isDarkMode)
  const themeStyles = getThemeStyles(isDarkMode)
  
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchResults, setSearchResults] = useState<StockSearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Load watchlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('portfolio-watchlist')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        const watchlistWithDates = parsed.map((item: any) => ({
          ...item,
          addedDate: new Date(item.addedDate)
        }))
        setWatchlist(watchlistWithDates)
      } catch (error) {
        console.error('Failed to load watchlist:', error)
      }
    }
  }, [])

  // Save watchlist to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio-watchlist', JSON.stringify(watchlist))
  }, [watchlist])

  // Search for stocks when search term changes
  useEffect(() => {
    const searchStocks = async () => {
      if (searchTerm.length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const results = await stockSearchService.searchStocks(searchTerm, 20)
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
    if (!searchTerm) return sampleAssets.slice(0, 10) // Show only first 10 sample assets
    
    return sampleAssets.filter(asset => 
      asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10)
  }, [searchTerm])

  // Filter watchlist based on search term
  const filteredWatchlist = useMemo(() => {
    if (!searchTerm) return watchlist
    return watchlist.filter(item =>
      item.asset.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.asset.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [watchlist, searchTerm])

  const addToWatchlist = (asset: Asset) => {
    const existingItem = watchlist.find(item => item.asset.symbol === asset.symbol)
    if (existingItem) return

    const newItem: WatchlistItem = {
      id: `watch-${Date.now()}`,
      asset,
      addedDate: new Date(),
      isWatched: true
    }

    setWatchlist(prev => [...prev, newItem])
    setShowAddModal(false)
  }

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

      addToWatchlist(newAsset)
      setSearchTerm('')
      setSearchResults([])
    } catch (error) {
      console.error('Error selecting stock:', error)
    }
  }

  const removeFromWatchlist = (id: string) => {
    setWatchlist(prev => prev.filter(item => item.id !== id))
  }

  const toggleWatched = (id: string) => {
    setWatchlist(prev => prev.map(item => 
      item.id === id ? { ...item, isWatched: !item.isWatched } : item
    ))
  }


  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const getPriceChangeColor = (change: number) => {
    return change >= 0 ? colors.success : colors.error
  }

  return (
    <div style={{ ...themeStyles.card, transition: 'all 0.3s ease' }}>
      {/* Header */}
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: colors.textPrimary, 
              margin: 0,
              transition: 'color 0.3s ease'
            }}>
              Watchlist ({watchlist.length})
            </h3>
            <p style={{ 
              color: colors.textSecondary, 
              margin: '0.5rem 0 0 0',
              fontSize: '0.875rem',
              transition: 'color 0.3s ease'
            }}>
              Track stocks you're interested in
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            style={{
              ...themeStyles.button.primary,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s ease'
            }}
          >
            <Plus size={16} />
            Add Stock
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ position: 'relative' }}>
          <Search 
            size={20} 
            style={{ 
              position: 'absolute', 
              left: '0.75rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: colors.textSecondary
            }} 
          />
          {isSearching && (
            <Loader2 
              size={20} 
              style={{ 
                position: 'absolute', 
                right: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: colors.textSecondary,
                animation: 'spin 1s linear infinite'
              }} 
            />
          )}
          <input
            type="text"
            placeholder="Search stocks to add to watchlist..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              ...themeStyles.input,
              width: '100%',
              paddingLeft: '2.5rem',
              paddingRight: isSearching ? '2.5rem' : '0.75rem',
              transition: 'all 0.3s ease'
            }}
          />
          
          {/* Search Results */}
          {(searchResults.length > 0 || filteredSampleAssets.length > 0) && searchTerm && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              backgroundColor: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              zIndex: 50,
              maxHeight: '300px',
              overflowY: 'auto',
              marginTop: '0.25rem'
            }}>
              {/* API Search Results */}
              {searchResults.length > 0 && (
                <>
                  <div style={{ 
                    padding: '0.5rem 0.75rem', 
                    fontSize: '0.75rem', 
                    fontWeight: '600', 
                    color: colors.textSecondary,
                    backgroundColor: colors.surfaceSecondary,
                    borderBottom: `1px solid ${colors.border}`
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
                        borderBottom: `1px solid ${colors.border}`,
                        color: colors.textPrimary,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.surfaceSecondary
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <div style={{ fontWeight: '600', color: colors.textPrimary }}>
                        {result.symbol}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>
                        {result.name} • {result.exchange}
                      </div>
                      {result.price && (
                        <div style={{ fontSize: '0.75rem', color: colors.success }}>
                          ${result.price.toFixed(2)} {result.change && result.changePercent && (
                            <span style={{ color: result.change >= 0 ? colors.success : colors.error }}>
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
                    color: colors.textSecondary,
                    backgroundColor: colors.surfaceSecondary,
                    borderBottom: `1px solid ${colors.border}`
                  }}>
                    Popular Stocks
                  </div>
                  {filteredSampleAssets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => addToWatchlist(asset)}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        textAlign: 'left',
                        border: 'none',
                        backgroundColor: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        borderBottom: `1px solid ${colors.border}`,
                        color: colors.textPrimary,
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.surfaceSecondary
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <div style={{ fontWeight: '600', color: colors.textPrimary }}>
                        {asset.symbol}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: colors.textSecondary }}>
                        {asset.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: colors.success }}>
                        ${asset.currentPrice.toFixed(2)} ({asset.changePercent24h >= 0 ? '+' : ''}{asset.changePercent24h.toFixed(2)}%)
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Watchlist Items */}
      <div style={{ padding: '1.5rem' }}>
        {filteredWatchlist.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: colors.textSecondary,
            transition: 'color 0.3s ease'
          }}>
            <Star size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '1rem' }}>
              {searchTerm ? 'No stocks found matching your search' : 'No stocks in your watchlist yet'}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
              {searchTerm ? 'Try a different search term' : 'Add some stocks to get started'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredWatchlist.map((item) => (
              <div key={item.id} style={{ 
                ...themeStyles.card, 
                padding: '1rem',
                transition: 'all 0.3s ease',
                opacity: item.isWatched ? 1 : 0.6
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h4 style={{ 
                        fontSize: '1rem', 
                        fontWeight: '600', 
                        color: colors.textPrimary, 
                        margin: 0,
                        transition: 'color 0.3s ease'
                      }}>
                        {item.asset.symbol}
                      </h4>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: colors.textSecondary,
                        backgroundColor: colors.surface,
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        transition: 'all 0.3s ease'
                      }}>
                        {item.asset.name}
                      </span>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem' }}>
                      <div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: colors.textSecondary,
                          marginBottom: '0.25rem',
                          transition: 'color 0.3s ease'
                        }}>
                          Current Price
                        </div>
                        <div style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: 'bold', 
                          color: colors.textPrimary,
                          transition: 'color 0.3s ease'
                        }}>
                          {formatCurrency(item.asset.currentPrice)}
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: colors.textSecondary,
                          marginBottom: '0.25rem',
                          transition: 'color 0.3s ease'
                        }}>
                          24h Change
                        </div>
                        <div style={{ 
                          fontSize: '1.25rem', 
                          fontWeight: 'bold', 
                          color: getPriceChangeColor(item.asset.changePercent24h),
                          transition: 'color 0.3s ease'
                        }}>
                          {formatPercent(item.asset.changePercent24h)}
                        </div>
                      </div>
                      
                      {item.targetPrice && (
                        <div>
                          <div style={{ 
                            fontSize: '0.75rem', 
                            color: colors.textSecondary,
                            marginBottom: '0.25rem',
                            transition: 'color 0.3s ease'
                          }}>
                            Target Price
                          </div>
                          <div style={{ 
                            fontSize: '1.25rem', 
                            fontWeight: 'bold', 
                            color: colors.primary,
                            transition: 'color 0.3s ease'
                          }}>
                            {formatCurrency(item.targetPrice)}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {item.notes && (
                      <div style={{ 
                        marginTop: '0.75rem',
                        padding: '0.75rem',
                        backgroundColor: colors.surface,
                        borderRadius: '0.375rem',
                        border: `1px solid ${colors.border}`,
                        transition: 'all 0.3s ease'
                      }}>
                        <div style={{ 
                          fontSize: '0.75rem', 
                          color: colors.textSecondary,
                          marginBottom: '0.25rem',
                          transition: 'color 0.3s ease'
                        }}>
                          Notes
                        </div>
                        <div style={{ 
                          fontSize: '0.875rem', 
                          color: colors.textPrimary,
                          transition: 'color 0.3s ease'
                        }}>
                          {item.notes}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginLeft: '1rem' }}>
                    <button
                      onClick={() => toggleWatched(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: item.isWatched ? colors.warning : colors.textSecondary,
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '0.25rem',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title={item.isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      {item.isWatched ? <Star size={20} /> : <StarOff size={20} />}
                    </button>
                    
                    <button
                      onClick={() => removeFromWatchlist(item.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.error,
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '0.25rem',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                      title="Remove from watchlist"
                    >
                      <EyeOff size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '1rem'
        }}>
          <div style={{
            ...themeStyles.card,
            width: '100%',
            maxWidth: '500px',
            maxHeight: '80vh',
            overflow: 'auto',
            position: 'relative',
            transition: 'all 0.3s ease'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
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
                Add Stock to Watchlist
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: colors.textSecondary,
                  cursor: 'pointer',
                  padding: '0.5rem',
                  borderRadius: '0.25rem',
                  transition: 'all 0.2s ease'
                }}
              >
                ×
              </button>
            </div>
            
            <div style={{ padding: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: colors.textPrimary,
                  marginBottom: '0.5rem',
                  transition: 'color 0.3s ease'
                }}>
                  Search Stocks
                </label>
                <input
                  type="text"
                  placeholder="Type stock symbol or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{
                    ...themeStyles.input,
                    width: '100%',
                    transition: 'all 0.3s ease'
                  }}
                />
              </div>
              
              <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                {filteredSampleAssets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => addToWatchlist(asset)}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem',
                      border: `1px solid ${colors.border}`,
                      borderRadius: '0.375rem',
                      marginBottom: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      backgroundColor: colors.surface
                    }}
                  >
                    <div>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600', 
                        color: colors.textPrimary,
                        transition: 'color 0.3s ease'
                      }}>
                        {asset.symbol}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: colors.textSecondary,
                        transition: 'color 0.3s ease'
                      }}>
                        {asset.name}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ 
                        fontSize: '0.875rem', 
                        fontWeight: '600', 
                        color: colors.textPrimary,
                        transition: 'color 0.3s ease'
                      }}>
                        {formatCurrency(asset.currentPrice)}
                      </div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: getPriceChangeColor(asset.changePercent24h),
                        transition: 'color 0.3s ease'
                      }}>
                        {formatPercent(asset.changePercent24h)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
