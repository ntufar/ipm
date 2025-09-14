import { useState, useEffect, useMemo } from 'react'
import { Bell, BellOff, AlertCircle, TrendingUp, Target, DollarSign, X, Check } from 'lucide-react'
import type { Portfolio, Holding } from '../types/index.js'
import { getThemeColors, getThemeStyles } from '../utils/theme'

interface NotificationsProps {
  portfolio: Portfolio
  isDarkMode?: boolean
}

interface Notification {
  id: string
  type: 'price_alert' | 'milestone' | 'news' | 'earnings' | 'rebalance'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  priority: 'low' | 'medium' | 'high'
  data?: any
}

interface PriceAlert {
  id: string
  symbol: string
  name: string
  targetPrice: number
  condition: 'above' | 'below'
  isActive: boolean
  createdDate: Date
}

export function Notifications({ portfolio, isDarkMode = false }: NotificationsProps) {
  const colors = getThemeColors(isDarkMode)
  const themeStyles = getThemeStyles(isDarkMode)
  
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([])
  const [showAddAlert, setShowAddAlert] = useState(false)
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null)
  const [targetPrice, setTargetPrice] = useState('')
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above')
  const [filter, setFilter] = useState<'all' | 'unread' | 'high'>('all')

  // Load notifications and alerts from localStorage
  useEffect(() => {
    const savedNotifications = localStorage.getItem('portfolio-notifications')
    const savedAlerts = localStorage.getItem('portfolio-price-alerts')
    
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        const notificationsWithDates = parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        }))
        setNotifications(notificationsWithDates)
      } catch (error) {
        console.error('Failed to load notifications:', error)
      }
    }
    
    if (savedAlerts) {
      try {
        const parsed = JSON.parse(savedAlerts)
        const alertsWithDates = parsed.map((a: any) => ({
          ...a,
          createdDate: new Date(a.createdDate)
        }))
        setPriceAlerts(alertsWithDates)
      } catch (error) {
        console.error('Failed to load price alerts:', error)
      }
    }
  }, [])

  // Save notifications and alerts to localStorage
  useEffect(() => {
    localStorage.setItem('portfolio-notifications', JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    localStorage.setItem('portfolio-price-alerts', JSON.stringify(priceAlerts))
  }, [priceAlerts])

  // Generate sample notifications based on portfolio performance
  useEffect(() => {
    const generateNotifications = () => {
      const newNotifications: Notification[] = []
      const now = new Date()
      
      // Portfolio milestone notifications
      if (portfolio.totalGainLoss > 0) {
        const milestone = Math.floor(portfolio.totalGainLoss / 1000) * 1000
        if (milestone > 0 && milestone % 1000 === 0) {
          newNotifications.push({
            id: `milestone-${milestone}`,
            type: 'milestone',
            title: 'Portfolio Milestone! 🎉',
            message: `Your portfolio has gained $${milestone.toLocaleString()}!`,
            timestamp: now,
            isRead: false,
            priority: 'high',
            data: { milestone }
          })
        }
      }
      
      // Top performer notification
      const topPerformer = portfolio.holdings.reduce((best, holding) => 
        holding.gainLossPercent > best.gainLossPercent ? holding : best
      )
      if (topPerformer.gainLossPercent > 10) {
        newNotifications.push({
          id: `top-performer-${topPerformer.id}`,
          type: 'news',
          title: 'Top Performer Alert! 📈',
          message: `${topPerformer.asset.symbol} is up ${topPerformer.gainLossPercent.toFixed(1)}% today!`,
          timestamp: now,
          isRead: false,
          priority: 'medium',
          data: { holding: topPerformer }
        })
      }
      
      // Rebalancing suggestion
      if (portfolio.holdings.length > 3) {
        const largestHolding = portfolio.holdings.reduce((largest, holding) => 
          holding.currentValue > largest.currentValue ? holding : largest
        )
        const largestWeight = (largestHolding.currentValue / portfolio.totalValue) * 100
        
        if (largestWeight > 40) {
          newNotifications.push({
            id: `rebalance-${largestHolding.id}`,
            type: 'rebalance',
            title: 'Rebalancing Suggestion ⚖️',
            message: `${largestHolding.asset.symbol} represents ${largestWeight.toFixed(1)}% of your portfolio. Consider rebalancing.`,
            timestamp: now,
            isRead: false,
            priority: 'low',
            data: { holding: largestHolding, weight: largestWeight }
          })
        }
      }
      
      setNotifications(prev => [...newNotifications, ...prev])
    }

    // Generate notifications every 30 seconds (for demo purposes)
    const interval = setInterval(generateNotifications, 30000)
    return () => clearInterval(interval)
  }, [portfolio])

  // Check price alerts
  useEffect(() => {
    const checkPriceAlerts = () => {
      const triggeredAlerts: Notification[] = []
      
      priceAlerts.forEach(alert => {
        if (!alert.isActive) return
        
        const holding = portfolio.holdings.find(h => h.asset.symbol === alert.symbol)
        if (!holding) return
        
        const currentPrice = holding.asset.currentPrice
        const shouldTrigger = alert.condition === 'above' 
          ? currentPrice >= alert.targetPrice 
          : currentPrice <= alert.targetPrice
        
        if (shouldTrigger) {
          triggeredAlerts.push({
            id: `alert-${alert.id}-${Date.now()}`,
            type: 'price_alert',
            title: `Price Alert: ${alert.symbol}`,
            message: `${alert.symbol} is now ${alert.condition} $${alert.targetPrice.toFixed(2)} (Current: $${currentPrice.toFixed(2)})`,
            timestamp: new Date(),
            isRead: false,
            priority: 'high',
            data: { alert, currentPrice }
          })
        }
      })
      
      if (triggeredAlerts.length > 0) {
        setNotifications(prev => [...triggeredAlerts, ...prev])
      }
    }

    const interval = setInterval(checkPriceAlerts, 10000) // Check every 10 seconds
    return () => clearInterval(interval)
  }, [priceAlerts, portfolio.holdings])

  const addPriceAlert = () => {
    if (!selectedHolding || !targetPrice) return
    
    const newAlert: PriceAlert = {
      id: `alert-${Date.now()}`,
      symbol: selectedHolding.asset.symbol,
      name: selectedHolding.asset.name,
      targetPrice: parseFloat(targetPrice),
      condition: alertCondition,
      isActive: true,
      createdDate: new Date()
    }
    
    setPriceAlerts(prev => [...prev, newAlert])
    setShowAddAlert(false)
    setSelectedHolding(null)
    setTargetPrice('')
    setAlertCondition('above')
  }

  const toggleAlert = (alertId: string) => {
    setPriceAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ))
  }

  const deleteAlert = (alertId: string) => {
    setPriceAlerts(prev => prev.filter(alert => alert.id !== alertId))
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === notificationId ? { ...notification, isRead: true } : notification
    ))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })))
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId))
  }

  const filteredNotifications = useMemo(() => {
    let filtered = notifications
    
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.isRead)
    } else if (filter === 'high') {
      filtered = filtered.filter(n => n.priority === 'high')
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }, [notifications, filter])

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return colors.error
      case 'medium': return colors.warning
      case 'low': return colors.success
      default: return colors.textSecondary
    }
  }

  const getPriorityIcon = (type: string) => {
    switch (type) {
      case 'price_alert': return Bell
      case 'milestone': return Target
      case 'news': return TrendingUp
      case 'earnings': return DollarSign
      case 'rebalance': return AlertCircle
      default: return Bell
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(value)
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  const unreadCount = notifications.filter(n => !n.isRead).length

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
              Notifications {unreadCount > 0 && (
                <span style={{ 
                  backgroundColor: colors.error, 
                  color: '#ffffff', 
                  fontSize: '0.75rem', 
                  padding: '0.25rem 0.5rem', 
                  borderRadius: '0.75rem',
                  marginLeft: '0.5rem'
                }}>
                  {unreadCount}
                </span>
              )}
            </h3>
            <p style={{ 
              color: colors.textSecondary, 
              margin: '0.5rem 0 0 0',
              fontSize: '0.875rem',
              transition: 'color 0.3s ease'
            }}>
              Price alerts, milestones, and portfolio insights
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => setShowAddAlert(true)}
              style={{
                ...themeStyles.button.primary,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <Bell size={16} />
              Add Alert
            </button>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  ...themeStyles.button.secondary,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
              >
                <Check size={16} />
                Mark All Read
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        padding: '1rem 1.5rem', 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'unread', label: 'Unread' },
            { id: 'high', label: 'High Priority' }
          ].map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id as any)}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                backgroundColor: filter === filterOption.id ? colors.primary : colors.surface,
                color: filter === filterOption.id ? '#ffffff' : colors.textPrimary,
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div style={{ padding: '1.5rem' }}>
        {filteredNotifications.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: colors.textSecondary,
            transition: 'color 0.3s ease'
          }}>
            <Bell size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '1rem' }}>
              {filter === 'all' ? 'No notifications yet' : 
               filter === 'unread' ? 'No unread notifications' : 
               'No high priority notifications'}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
              {filter === 'all' ? 'Notifications will appear here as your portfolio changes' : 
               'All caught up!'}
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredNotifications.map((notification) => {
              const Icon = getPriorityIcon(notification.type)
              return (
                <div key={notification.id} style={{ 
                  ...themeStyles.card, 
                  padding: '1rem',
                  borderLeft: `4px solid ${getPriorityColor(notification.priority)}`,
                  transition: 'all 0.3s ease',
                  opacity: notification.isRead ? 0.7 : 1
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Icon size={16} color={getPriorityColor(notification.priority)} />
                        <h4 style={{ 
                          fontSize: '0.875rem', 
                          fontWeight: '600', 
                          color: colors.textPrimary, 
                          margin: 0,
                          transition: 'color 0.3s ease'
                        }}>
                          {notification.title}
                        </h4>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: colors.textSecondary,
                          transition: 'color 0.3s ease'
                        }}>
                          {formatTime(notification.timestamp)}
                        </span>
                      </div>
                      <p style={{ 
                        fontSize: '0.875rem', 
                        color: colors.textSecondary, 
                        margin: 0,
                        transition: 'color 0.3s ease'
                      }}>
                        {notification.message}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', marginLeft: '1rem' }}>
                      {!notification.isRead && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: colors.success,
                            cursor: 'pointer',
                            padding: '0.25rem',
                            borderRadius: '0.25rem',
                            transition: 'all 0.2s ease'
                          }}
                          title="Mark as read"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: colors.error,
                          cursor: 'pointer',
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          transition: 'all 0.2s ease'
                        }}
                        title="Delete notification"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Price Alerts Section */}
      <div style={{ 
        padding: '1.5rem', 
        borderTop: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <h4 style={{ 
          fontSize: '1rem', 
          fontWeight: '600', 
          color: colors.textPrimary, 
          margin: '0 0 1rem 0',
          transition: 'color 0.3s ease'
        }}>
          Price Alerts ({priceAlerts.length})
        </h4>
        
        {priceAlerts.length === 0 ? (
          <p style={{ 
            color: colors.textSecondary, 
            fontSize: '0.875rem',
            margin: 0,
            transition: 'color 0.3s ease'
          }}>
            No price alerts set. Add alerts to get notified when stocks hit your target prices.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {priceAlerts.map((alert) => (
              <div key={alert.id} style={{ 
                ...themeStyles.card, 
                padding: '0.75rem',
                transition: 'all 0.3s ease',
                opacity: alert.isActive ? 1 : 0.6
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ 
                      fontSize: '0.875rem', 
                      fontWeight: '600', 
                      color: colors.textPrimary,
                      transition: 'color 0.3s ease'
                    }}>
                      {alert.symbol} - {alert.name}
                    </div>
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: colors.textSecondary,
                      transition: 'color 0.3s ease'
                    }}>
                      Alert when price goes {alert.condition} {formatCurrency(alert.targetPrice)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => toggleAlert(alert.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: alert.isActive ? colors.warning : colors.textSecondary,
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '0.25rem',
                        transition: 'all 0.2s ease'
                      }}
                      title={alert.isActive ? 'Disable alert' : 'Enable alert'}
                    >
                      {alert.isActive ? <Bell size={16} /> : <BellOff size={16} />}
                    </button>
                    <button
                      onClick={() => deleteAlert(alert.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: colors.error,
                        cursor: 'pointer',
                        padding: '0.25rem',
                        borderRadius: '0.25rem',
                        transition: 'all 0.2s ease'
                      }}
                      title="Delete alert"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Alert Modal */}
      {showAddAlert && (
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
            maxWidth: '400px',
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
                Add Price Alert
              </h3>
              <button
                onClick={() => setShowAddAlert(false)}
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
                  Select Stock
                </label>
                <select
                  value={selectedHolding?.id || ''}
                  onChange={(e) => {
                    const holding = portfolio.holdings.find(h => h.id === e.target.value)
                    setSelectedHolding(holding || null)
                  }}
                  style={{
                    ...themeStyles.input,
                    width: '100%',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <option value="">Choose a stock...</option>
                  {portfolio.holdings.map(holding => (
                    <option key={holding.id} value={holding.id}>
                      {holding.asset.symbol} - {holding.asset.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: colors.textPrimary,
                  marginBottom: '0.5rem',
                  transition: 'color 0.3s ease'
                }}>
                  Target Price
                </label>
                <input
                  type="number"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Enter target price..."
                  style={{
                    ...themeStyles.input,
                    width: '100%',
                    transition: 'all 0.3s ease'
                  }}
                  step="0.01"
                  min="0.01"
                />
              </div>
              
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: colors.textPrimary,
                  marginBottom: '0.5rem',
                  transition: 'color 0.3s ease'
                }}>
                  Alert When Price Goes
                </label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setAlertCondition('above')}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: `1px solid ${alertCondition === 'above' ? colors.primary : colors.border}`,
                      borderRadius: '0.375rem',
                      backgroundColor: alertCondition === 'above' ? colors.primary : 'transparent',
                      color: alertCondition === 'above' ? '#ffffff' : colors.textPrimary,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Above Target
                  </button>
                  <button
                    onClick={() => setAlertCondition('below')}
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: `1px solid ${alertCondition === 'below' ? colors.primary : colors.border}`,
                      borderRadius: '0.375rem',
                      backgroundColor: alertCondition === 'below' ? colors.primary : 'transparent',
                      color: alertCondition === 'below' ? '#ffffff' : colors.textPrimary,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Below Target
                  </button>
                </div>
              </div>
              
              <button
                onClick={addPriceAlert}
                disabled={!selectedHolding || !targetPrice}
                style={{
                  ...themeStyles.button.primary,
                  width: '100%',
                  opacity: (!selectedHolding || !targetPrice) ? 0.6 : 1,
                  cursor: (!selectedHolding || !targetPrice) ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                Add Price Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
