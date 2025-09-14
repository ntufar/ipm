import { useState, useEffect } from 'react'
import { X, Save, Trash2 } from 'lucide-react'
import type { Holding } from '../types/index.js'
import { getThemeColors, getThemeStyles } from '../utils/theme'

interface EditHoldingModalProps {
  holding: Holding
  isOpen: boolean
  onClose: () => void
  onSave: (updatedHolding: Holding) => void
  onDelete: (holdingId: string) => void
  isDarkMode?: boolean
}

export function EditHoldingModal({ 
  holding, 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  isDarkMode = false 
}: EditHoldingModalProps) {
  const colors = getThemeColors(isDarkMode)
  const themeStyles = getThemeStyles(isDarkMode)
  
  const [formData, setFormData] = useState({
    quantity: holding.quantity,
    purchasePrice: holding.purchasePrice,
    purchaseDate: holding.purchaseDate.toISOString().split('T')[0],
    notes: holding.notes || ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when holding changes
  useEffect(() => {
    if (holding) {
      setFormData({
        quantity: holding.quantity,
        purchasePrice: holding.purchasePrice,
        purchaseDate: holding.purchaseDate.toISOString().split('T')[0],
        notes: holding.notes || ''
      })
      setErrors({})
    }
  }, [holding])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0'
    }
    
    if (formData.purchasePrice <= 0) {
      newErrors.purchasePrice = 'Purchase price must be greater than 0'
    }
    
    if (!formData.purchaseDate) {
      newErrors.purchaseDate = 'Purchase date is required'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const updatedHolding: Holding = {
      ...holding,
      quantity: formData.quantity,
      purchasePrice: formData.purchasePrice,
      purchaseDate: new Date(formData.purchaseDate),
      totalCost: formData.quantity * formData.purchasePrice,
      notes: formData.notes,
      // Recalculate current value and P&L
      currentValue: formData.quantity * holding.asset.currentPrice,
      gainLoss: (formData.quantity * holding.asset.currentPrice) - (formData.quantity * formData.purchasePrice),
      gainLossPercent: ((formData.quantity * holding.asset.currentPrice) - (formData.quantity * formData.purchasePrice)) / (formData.quantity * formData.purchasePrice) * 100
    }

    onSave(updatedHolding)
    onClose()
  }

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${holding.asset.symbol} from your portfolio?`)) {
      onDelete(holding.id)
      onClose()
    }
  }

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
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
        maxHeight: '90vh',
        overflow: 'auto',
        position: 'relative',
        transition: 'all 0.3s ease'
      }}>
        {/* Header */}
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
            Edit Holding - {holding.asset.symbol}
          </h3>
          <button
            onClick={onClose}
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
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Asset Info */}
            <div style={{
              padding: '1rem',
              backgroundColor: colors.surface,
              borderRadius: '0.5rem',
              border: `1px solid ${colors.border}`,
              transition: 'all 0.3s ease'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: colors.textPrimary,
                margin: '0 0 0.5rem 0',
                transition: 'color 0.3s ease'
              }}>
                Asset Information
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: colors.textPrimary,
                    marginBottom: '0.25rem',
                    transition: 'color 0.3s ease'
                  }}>
                    Symbol
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    color: colors.textSecondary,
                    transition: 'color 0.3s ease'
                  }}>
                    {holding.asset.symbol}
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: colors.textPrimary,
                    marginBottom: '0.25rem',
                    transition: 'color 0.3s ease'
                  }}>
                    Current Price
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    color: colors.textSecondary,
                    transition: 'color 0.3s ease'
                  }}>
                    ${holding.asset.currentPrice.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: '0.5rem',
                transition: 'color 0.3s ease'
              }}>
                Quantity *
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', parseFloat(e.target.value) || 0)}
                style={{
                  ...themeStyles.input,
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
                min="0"
                step="0.01"
              />
              {errors.quantity && (
                <div style={{
                  fontSize: '0.75rem',
                  color: colors.error,
                  marginTop: '0.25rem',
                  transition: 'color 0.3s ease'
                }}>
                  {errors.quantity}
                </div>
              )}
            </div>

            {/* Purchase Price */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: '0.5rem',
                transition: 'color 0.3s ease'
              }}>
                Purchase Price *
              </label>
              <input
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                style={{
                  ...themeStyles.input,
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
                min="0"
                step="0.01"
              />
              {errors.purchasePrice && (
                <div style={{
                  fontSize: '0.75rem',
                  color: colors.error,
                  marginTop: '0.25rem',
                  transition: 'color 0.3s ease'
                }}>
                  {errors.purchasePrice}
                </div>
              )}
            </div>

            {/* Purchase Date */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: '0.5rem',
                transition: 'color 0.3s ease'
              }}>
                Purchase Date *
              </label>
              <input
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange('purchaseDate', e.target.value)}
                style={{
                  ...themeStyles.input,
                  width: '100%',
                  transition: 'all 0.3s ease'
                }}
              />
              {errors.purchaseDate && (
                <div style={{
                  fontSize: '0.75rem',
                  color: colors.error,
                  marginTop: '0.25rem',
                  transition: 'color 0.3s ease'
                }}>
                  {errors.purchaseDate}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: '600',
                color: colors.textPrimary,
                marginBottom: '0.5rem',
                transition: 'color 0.3s ease'
              }}>
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                style={{
                  ...themeStyles.input,
                  width: '100%',
                  minHeight: '80px',
                  resize: 'vertical',
                  transition: 'all 0.3s ease'
                }}
                placeholder="Add any notes about this holding..."
              />
            </div>

            {/* Calculated Values */}
            <div style={{
              padding: '1rem',
              backgroundColor: colors.surface,
              borderRadius: '0.5rem',
              border: `1px solid ${colors.border}`,
              transition: 'all 0.3s ease'
            }}>
              <h4 style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: colors.textPrimary,
                margin: '0 0 0.5rem 0',
                transition: 'color 0.3s ease'
              }}>
                Calculated Values
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: colors.textSecondary,
                    marginBottom: '0.25rem',
                    transition: 'color 0.3s ease'
                  }}>
                    Total Cost
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: colors.textPrimary,
                    transition: 'color 0.3s ease'
                  }}>
                    ${(formData.quantity * formData.purchasePrice).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: colors.textSecondary,
                    marginBottom: '0.25rem',
                    transition: 'color 0.3s ease'
                  }}>
                    Current Value
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: colors.textPrimary,
                    transition: 'color 0.3s ease'
                  }}>
                    ${(formData.quantity * holding.asset.currentPrice).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: colors.textSecondary,
                    marginBottom: '0.25rem',
                    transition: 'color 0.3s ease'
                  }}>
                    Gain/Loss
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: (formData.quantity * holding.asset.currentPrice) - (formData.quantity * formData.purchasePrice) >= 0 ? colors.success : colors.error,
                    transition: 'color 0.3s ease'
                  }}>
                    ${((formData.quantity * holding.asset.currentPrice) - (formData.quantity * formData.purchasePrice)).toFixed(2)}
                  </div>
                </div>
                <div>
                  <div style={{
                    fontSize: '0.875rem',
                    color: colors.textSecondary,
                    marginBottom: '0.25rem',
                    transition: 'color 0.3s ease'
                  }}>
                    Return %
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: (formData.quantity * holding.asset.currentPrice) - (formData.quantity * formData.purchasePrice) >= 0 ? colors.success : colors.error,
                    transition: 'color 0.3s ease'
                  }}>
                    {(((formData.quantity * holding.asset.currentPrice) - (formData.quantity * formData.purchasePrice)) / (formData.quantity * formData.purchasePrice) * 100).toFixed(2)}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '2rem',
            paddingTop: '1.5rem',
            borderTop: `1px solid ${colors.border}`,
            transition: 'all 0.3s ease'
          }}>
            <button
              type="button"
              onClick={handleDelete}
              style={{
                ...themeStyles.button.danger,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <Trash2 size={16} />
              Delete
            </button>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                type="button"
                onClick={onClose}
                style={{
                  ...themeStyles.button.secondary,
                  transition: 'all 0.3s ease'
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{
                  ...themeStyles.button.primary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
