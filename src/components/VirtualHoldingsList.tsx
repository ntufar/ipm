import { useState, useMemo, useCallback } from 'react'
import { ChevronUp, ChevronDown, Edit2, Trash2 } from 'lucide-react'
import type { Holding } from '../types/index.js'
import { getThemeColors, getThemeStyles } from '../utils/theme'
import { EditHoldingModal } from './EditHoldingModal'

interface VirtualHoldingsListProps {
  holdings: Holding[]
  isDarkMode?: boolean
  itemHeight?: number
  containerHeight?: number
  onUpdateHolding?: (updatedHolding: Holding) => void
  onDeleteHolding?: (holdingId: string) => void
}

export function VirtualHoldingsList({ 
  holdings, 
  isDarkMode = false, 
  itemHeight = 80,
  containerHeight = 400,
  onUpdateHolding,
  onDeleteHolding
}: VirtualHoldingsListProps) {
  console.log('VirtualHoldingsList received holdings:', holdings.map(h => ({ id: h.id, symbol: h.asset.symbol })))
  
  const colors = getThemeColors(isDarkMode)
  const themeStyles = getThemeStyles(isDarkMode)
  const [scrollTop, setScrollTop] = useState(0)
  const [sortField, setSortField] = useState<keyof Holding>('currentValue')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [editingHolding, setEditingHolding] = useState<Holding | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Sort holdings
  const sortedHoldings = useMemo(() => {
    return [...holdings].sort((a, b) => {
      let aValue: any = a[sortField]
      let bValue: any = b[sortField]
      
      if (sortField === 'asset') {
        aValue = a.asset.name
        bValue = b.asset.name
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      return 0
    })
  }, [holdings, sortField, sortDirection])

  // Calculate visible range
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      sortedHoldings.length
    )
    return { startIndex, endIndex }
  }, [scrollTop, itemHeight, containerHeight, sortedHoldings.length])

  // Get visible items
  const visibleItems = useMemo(() => {
    return sortedHoldings.slice(visibleRange.startIndex, visibleRange.endIndex)
  }, [sortedHoldings, visibleRange])

  // Handle scroll
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // Handle sort
  const handleSort = useCallback((field: keyof Holding) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }, [sortField, sortDirection])

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

  const getSortIcon = (field: keyof Holding) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />
  }

  const handleEditHolding = useCallback((holding: Holding) => {
    setEditingHolding(holding)
    setIsEditModalOpen(true)
  }, [])

  const handleDeleteHolding = useCallback((holdingId: string) => {
    if (onDeleteHolding) {
      onDeleteHolding(holdingId)
    }
  }, [onDeleteHolding])

  const handleSaveHolding = useCallback((updatedHolding: Holding) => {
    if (onUpdateHolding) {
      onUpdateHolding(updatedHolding)
    }
    setIsEditModalOpen(false)
    setEditingHolding(null)
  }, [onUpdateHolding])

  const handleCloseModal = useCallback(() => {
    setIsEditModalOpen(false)
    setEditingHolding(null)
  }, [])

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
          Holdings ({holdings.length})
        </h3>
        <p style={{ 
          color: colors.textSecondary, 
          margin: '0.5rem 0 0 0',
          fontSize: '0.875rem',
          transition: 'color 0.3s ease'
        }}>
          Virtual scrolling for optimal performance
        </p>
      </div>

      {/* Table Header */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
        gap: '1rem',
        padding: '1rem 1.5rem',
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <button
          onClick={() => handleSort('asset')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: colors.textPrimary,
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'left',
            transition: 'color 0.3s ease'
          }}
        >
          Asset
          {getSortIcon('asset')}
        </button>
        <button
          onClick={() => handleSort('quantity')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: colors.textPrimary,
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'right',
            transition: 'color 0.3s ease'
          }}
        >
          Quantity
          {getSortIcon('quantity')}
        </button>
        <button
          onClick={() => handleSort('currentValue')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: colors.textPrimary,
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'right',
            transition: 'color 0.3s ease'
          }}
        >
          Value
          {getSortIcon('currentValue')}
        </button>
        <button
          onClick={() => handleSort('gainLoss')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: colors.textPrimary,
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'right',
            transition: 'color 0.3s ease'
          }}
        >
          P&L
          {getSortIcon('gainLoss')}
        </button>
        <button
          onClick={() => handleSort('gainLossPercent')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'none',
            border: 'none',
            color: colors.textPrimary,
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            textAlign: 'right',
            transition: 'color 0.3s ease'
          }}
        >
          Return %
          {getSortIcon('gainLossPercent')}
        </button>
        <div style={{
          fontSize: '0.875rem',
          fontWeight: '600',
          color: colors.textPrimary,
          textAlign: 'center',
          transition: 'color 0.3s ease'
        }}>
          Actions
        </div>
      </div>

      {/* Virtual Scrolling Container */}
      <div
        style={{
          height: containerHeight,
          overflow: 'auto',
          position: 'relative'
        }}
        onScroll={handleScroll}
      >
        {/* Total height spacer */}
        <div style={{ height: sortedHoldings.length * itemHeight, position: 'relative' }}>
          {/* Visible items */}
          {visibleItems.map((holding, index) => {
            const actualIndex = visibleRange.startIndex + index
            return (
              <div
                key={`${holding.asset.symbol}-${actualIndex}`}
                style={{
                  position: 'absolute',
                  top: actualIndex * itemHeight,
                  left: 0,
                  right: 0,
                  height: itemHeight,
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 80px',
                  gap: '1rem',
                  alignItems: 'center',
                  padding: '0 1.5rem',
                  borderBottom: `1px solid ${colors.border}`,
                  backgroundColor: actualIndex % 2 === 0 ? 'transparent' : colors.surface,
                  transition: 'all 0.3s ease'
                }}
              >
                {/* Asset */}
                <div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.textPrimary,
                    transition: 'color 0.3s ease'
                  }}>
                    {holding.asset.symbol}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: colors.textSecondary,
                    transition: 'color 0.3s ease'
                  }}>
                    {holding.asset.name}
                  </div>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: colors.textSecondary,
                    transition: 'color 0.3s ease'
                  }}>
                    {formatCurrency(holding.asset.currentPrice)}
                  </div>
                </div>

                {/* Quantity */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.textPrimary,
                    transition: 'color 0.3s ease'
                  }}>
                    {holding.quantity.toLocaleString()}
                  </div>
                </div>

                {/* Current Value */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: colors.textPrimary,
                    transition: 'color 0.3s ease'
                  }}>
                    {formatCurrency(holding.currentValue)}
                  </div>
                </div>

                {/* P&L */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: holding.gainLoss >= 0 ? colors.success : colors.error,
                    transition: 'color 0.3s ease'
                  }}>
                    {formatCurrency(holding.gainLoss)}
                  </div>
                </div>

                {/* Return % */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '600', 
                    color: holding.gainLossPercent >= 0 ? colors.success : colors.error,
                    transition: 'color 0.3s ease'
                  }}>
                    {formatPercent(holding.gainLossPercent)}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <button
                    onClick={() => handleEditHolding(holding)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: colors.primary,
                      cursor: 'pointer',
                      padding: '0.25rem',
                      borderRadius: '0.25rem',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title="Edit holding"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteHolding(holding.id)}
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
                    title="Delete holding"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        padding: '1rem 1.5rem', 
        borderTop: `1px solid ${colors.border}`,
        backgroundColor: colors.surface,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          fontSize: '0.875rem',
          color: colors.textSecondary,
          transition: 'color 0.3s ease'
        }}>
          <span>
            Showing {visibleRange.startIndex + 1}-{Math.min(visibleRange.endIndex, sortedHoldings.length)} of {sortedHoldings.length} holdings
          </span>
          <span>
            Total Value: {formatCurrency(holdings.reduce((sum, h) => sum + h.currentValue, 0))}
          </span>
        </div>
      </div>

      {/* Edit Modal */}
      {editingHolding && (
        <EditHoldingModal
          holding={editingHolding}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveHolding}
          onDelete={handleDeleteHolding}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  )
}
