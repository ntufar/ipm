import { useState, useEffect } from 'react'
import { Newspaper, TrendingUp, TrendingDown, Minus, ExternalLink, Clock, RefreshCw } from 'lucide-react'
import { getThemeColors, getThemeStyles } from '../utils/theme'

interface MarketNews {
  id: string
  title: string
  summary: string
  source: string
  publishedAt: string
  url: string
  sentiment: 'positive' | 'negative' | 'neutral'
  symbols: string[]
}

interface MarketNewsProps {
  isDarkMode?: boolean
}

export function MarketNews({ isDarkMode = false }: MarketNewsProps) {
  const colors = getThemeColors(isDarkMode)
  const themeStyles = getThemeStyles(isDarkMode)
  
  const [news, setNews] = useState<MarketNews[]>([])
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load initial news
    loadNews()
  }, [])

  const loadNews = async () => {
    setIsLoading(true)
    try {
      // Generate sample news (since Yahoo Finance doesn't provide news in free API)
      const sampleNews: MarketNews[] = [
        {
          id: 'news-1',
          title: 'Tech Stocks Rally on Strong Earnings',
          summary: 'Major technology companies report better-than-expected quarterly results, driving market optimism.',
          source: 'Financial News',
          publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          url: '#',
          sentiment: 'positive',
          symbols: ['AAPL', 'MSFT', 'GOOGL', 'AMZN']
        },
        {
          id: 'news-2',
          title: 'Federal Reserve Signals Potential Rate Cut',
          summary: 'Central bank hints at possible interest rate reduction in upcoming meetings.',
          source: 'Market Watch',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          url: '#',
          sentiment: 'positive',
          symbols: ['^GSPC', '^IXIC', '^DJI']
        },
        {
          id: 'news-3',
          title: 'Energy Sector Faces Headwinds',
          summary: 'Oil prices decline amid concerns over global demand and supply glut.',
          source: 'Reuters',
          publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
          url: '#',
          sentiment: 'negative',
          symbols: ['XOM', 'CVX', 'COP']
        }
      ]
      
      setNews(sampleNews)
    } catch (error) {
      console.error('Failed to load news:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredNews = news.filter(item => {
    if (filter === 'all') return true
    return item.sentiment === filter
  })

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp size={16} color={colors.success} />
      case 'negative': return <TrendingDown size={16} color={colors.error} />
      default: return <Minus size={16} color={colors.textSecondary} />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return colors.success
      case 'negative': return colors.error
      default: return colors.textSecondary
    }
  }

  const formatTime = (publishedAt: string) => {
    const date = new Date(publishedAt)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return date.toLocaleDateString()
  }

  const filters = [
    { id: 'all', label: 'All News', count: news.length },
    { id: 'positive', label: 'Positive', count: news.filter(n => n.sentiment === 'positive').length },
    { id: 'negative', label: 'Negative', count: news.filter(n => n.sentiment === 'negative').length },
    { id: 'neutral', label: 'Neutral', count: news.filter(n => n.sentiment === 'neutral').length }
  ] as const

  return (
    <div style={{ ...themeStyles.card, transition: 'all 0.3s ease' }}>
      {/* Header */}
      <div style={{ 
        padding: '1.5rem', 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Newspaper size={24} color={colors.primary} />
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: colors.textPrimary, 
              margin: 0,
              transition: 'color 0.3s ease'
            }}>
              Market News
            </h3>
          </div>
          <button
            onClick={loadNews}
            disabled={isLoading}
            style={{
              ...themeStyles.button.secondary,
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isLoading ? 0.6 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
        <p style={{ 
          color: colors.textSecondary, 
          margin: 0,
          fontSize: '0.875rem',
          transition: 'color 0.3s ease'
        }}>
          Financial news and market updates (click Refresh to update)
        </p>
      </div>

      {/* Filters */}
      <div style={{ 
        padding: '1rem 1.5rem', 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {filters.map((filterOption) => (
            <button
              key={filterOption.id}
              onClick={() => setFilter(filterOption.id)}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '0.375rem',
                backgroundColor: filter === filterOption.id ? colors.primary : colors.surface,
                color: filter === filterOption.id ? '#ffffff' : colors.textPrimary,
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              {filterOption.label}
              {filterOption.count > 0 && (
                <span style={{ 
                  backgroundColor: filter === filterOption.id ? 'rgba(255,255,255,0.2)' : colors.border,
                  padding: '0.125rem 0.375rem',
                  borderRadius: '0.75rem',
                  fontSize: '0.75rem'
                }}>
                  {filterOption.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* News List */}
      <div style={{ padding: '1.5rem' }}>
        {isLoading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: colors.textSecondary,
            transition: 'color 0.3s ease'
          }}>
            <div style={{ 
              width: '32px', 
              height: '32px', 
              border: '3px solid #e5e7eb', 
              borderTop: '3px solid #3b82f6', 
              borderRadius: '50%', 
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }} />
            <p style={{ margin: 0, fontSize: '1rem' }}>Loading market news...</p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem 1rem',
            color: colors.textSecondary,
            transition: 'color 0.3s ease'
          }}>
            <Newspaper size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '1rem' }}>
              {filter === 'all' ? 'No news available' : `No ${filter} news available`}
            </p>
            <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem' }}>
              News will appear here as it becomes available
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredNews.map((item) => (
              <div key={item.id} style={{ 
                ...themeStyles.card, 
                padding: '1rem',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onClick={() => window.open(item.url, '_blank')}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {getSentimentIcon(item.sentiment)}
                    <h4 style={{ 
                      fontSize: '1rem', 
                      fontWeight: '600', 
                      color: colors.textPrimary, 
                      margin: 0,
                      transition: 'color 0.3s ease'
                    }}>
                      {item.title}
                    </h4>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={14} color={colors.textSecondary} />
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: colors.textSecondary,
                      transition: 'color 0.3s ease'
                    }}>
                      {formatTime(item.publishedAt)}
                    </span>
                    <ExternalLink size={14} color={colors.textSecondary} />
                  </div>
                </div>
                
                <p style={{ 
                  fontSize: '0.875rem', 
                  color: colors.textSecondary, 
                  margin: '0 0 0.75rem 0',
                  lineHeight: '1.5',
                  transition: 'color 0.3s ease'
                }}>
                  {item.summary}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: colors.textSecondary,
                      transition: 'color 0.3s ease'
                    }}>
                      {item.source}
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: colors.textSecondary,
                      transition: 'color 0.3s ease'
                    }}>
                      •
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: getSentimentColor(item.sentiment),
                      fontWeight: '500',
                      textTransform: 'capitalize',
                      transition: 'color 0.3s ease'
                    }}>
                      {item.sentiment}
                    </span>
                  </div>
                  
                  {item.symbols.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      {item.symbols.slice(0, 3).map((symbol, index) => (
                        <span key={index} style={{ 
                          fontSize: '0.75rem', 
                          color: colors.primary,
                          backgroundColor: colors.surface,
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontWeight: '500',
                          transition: 'all 0.3s ease'
                        }}>
                          {symbol}
                        </span>
                      ))}
                      {item.symbols.length > 3 && (
                        <span style={{ 
                          fontSize: '0.75rem', 
                          color: colors.textSecondary,
                          transition: 'color 0.3s ease'
                        }}>
                          +{item.symbols.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
