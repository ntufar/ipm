import { useState, useEffect } from 'react'
import { PortfolioOverview } from './components/PortfolioOverview'
// import { HoldingsList } from './components/HoldingsList'
// import { PerformanceChart } from './components/PerformanceChart'
import { AddTransaction } from './components/AddTransaction'
import { TransactionHistory } from './components/TransactionHistory'
import { PortfolioAnalytics } from './components/PortfolioAnalytics'
import { PortfolioComparison } from './components/PortfolioComparison'
import { AdvancedCharts } from './components/AdvancedCharts'
import { AdditionalData } from './components/AdditionalData'
import { AdvancedAnalytics } from './components/AdvancedAnalytics'
import { Watchlist } from './components/Watchlist'
import { Notifications } from './components/Notifications'
import { MarketNews } from './components/MarketNews'
import { MarketStatus } from './components/MarketStatus'
import { RealTimeQuotes } from './components/RealTimeQuotes'
import { VirtualHoldingsList } from './components/VirtualHoldingsList'
import { MemoizedPerformanceChart } from './components/MemoizedPerformanceChart'
import { ThemeToggle } from './components/ThemeToggle'
// import { MobileNavigation } from './components/MobileNavigation'
// import { ErrorBoundary } from './components/ErrorBoundary'
// import { CardSkeleton, ChartSkeleton } from './components/LoadingSkeleton'
import { ThemeProvider, useTheme } from './contexts/ThemeContext'
import { samplePortfolio } from './data/sampleData'
import type { Portfolio, Holding } from './types/index.js'
import { loadPortfolio, savePortfolio } from './utils/storage'
import { yahooFinanceService } from './services/yahooFinanceService'
import { getThemeColors, getThemeStyles } from './utils/theme'
// import { getResponsiveSpacing, getResponsiveGrid, getTouchButton } from './utils/responsive'
import { useKeyboardShortcuts, createPortfolioShortcuts } from './hooks/useKeyboardShortcuts'
import './App.css'

function AppContent() {
  const { isDarkMode } = useTheme()
  const colors = getThemeColors(isDarkMode)
  const themeStyles = getThemeStyles(isDarkMode)
  
  const [portfolio, setPortfolio] = useState<Portfolio>(samplePortfolio)
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'transactions' | 'analytics' | 'watchlist' | 'market'>('overview')
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  // const [showAddTransaction, setShowAddTransaction] = useState(false)

  // Load portfolio from localStorage on app start
  useEffect(() => {
    const savedPortfolio = loadPortfolio()
    if (savedPortfolio) {
      setPortfolio(savedPortfolio)
      setLastUpdated(savedPortfolio.lastUpdated)
    }
  }, [])

  // Update document title based on active tab
  useEffect(() => {
    const tabTitles = {
      'overview': 'Overview',
      'holdings': 'Holdings',
      'transactions': 'Transactions',
      'analytics': 'Analytics',
      'watchlist': 'Watchlist',
      'market': 'Market Data'
    }
    
    const baseTitle = 'Investment Portfolio Manager'
    const tabTitle = tabTitles[activeTab] || 'Overview'
    document.title = `${tabTitle} | ${baseTitle}`
    
    // Reset to base title when component unmounts
    return () => {
      document.title = baseTitle
    }
  }, [activeTab])

  // Save portfolio to localStorage whenever it changes
  useEffect(() => {
    if (portfolio !== samplePortfolio) {
      savePortfolio(portfolio)
    }
  }, [portfolio])

  // Update stock prices periodically
  useEffect(() => {
    const updateStockPrices = async () => {
      setIsLoading(true)
      try {
        const symbols = portfolio.holdings.map(holding => holding.asset.symbol)
        // Use Yahoo Finance service for real data
        const stockQuotes = await yahooFinanceService.fetchMultipleQuotes(symbols)
        
        // Update portfolio with new prices
        const updatedHoldings = portfolio.holdings.map(holding => {
          const quote = stockQuotes.find(q => q.symbol === holding.asset.symbol)
          if (quote) {
            const updatedAsset = {
              ...holding.asset,
              currentPrice: quote.price,
              change24h: quote.change,
              changePercent24h: quote.changePercent
            }
            
            const currentValue = holding.quantity * quote.price
            const gainLoss = currentValue - holding.totalCost
            const gainLossPercent = (gainLoss / holding.totalCost) * 100
            
            return {
              ...holding,
              asset: updatedAsset,
              currentValue,
              gainLoss,
              gainLossPercent
            }
          }
          return holding
        })
        
        // Recalculate portfolio totals
        const totalValue = updatedHoldings.reduce((sum, holding) => sum + holding.currentValue, 0)
        const totalCost = updatedHoldings.reduce((sum, holding) => sum + holding.totalCost, 0)
        const totalGainLoss = totalValue - totalCost
        const totalGainLossPercent = (totalGainLoss / totalCost) * 100
        
        const updatedPortfolio: Portfolio = {
          ...portfolio,
          holdings: updatedHoldings,
          totalValue,
          totalGainLoss,
          totalGainLossPercent,
          lastUpdated: new Date()
        }
        
        setPortfolio(updatedPortfolio)
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Failed to update stock prices:', error)
      } finally {
        setIsLoading(false)
      }
    }

    // Update prices immediately and then every 5 minutes
    updateStockPrices()
    const interval = setInterval(updateStockPrices, 5 * 60 * 1000)
    
    return () => clearInterval(interval)
  }, [portfolio.holdings.length]) // Only re-run when holdings change

  const handlePortfolioUpdate = (updatedPortfolio: Portfolio) => {
    setPortfolio(updatedPortfolio)
  }

  const handleUpdateHolding = (updatedHolding: Holding) => {
    const updatedHoldings = portfolio.holdings.map(holding => 
      holding.id === updatedHolding.id ? updatedHolding : holding
    )
    
    // Recalculate portfolio totals
    const totalValue = updatedHoldings.reduce((sum, holding) => sum + holding.currentValue, 0)
    const totalCost = updatedHoldings.reduce((sum, holding) => sum + holding.totalCost, 0)
    const totalGainLoss = totalValue - totalCost
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0
    
    const updatedPortfolio: Portfolio = {
      ...portfolio,
      holdings: updatedHoldings,
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      lastUpdated: new Date()
    }
    
    setPortfolio(updatedPortfolio)
  }

  const handleDeleteHolding = (holdingId: string) => {
    const updatedHoldings = portfolio.holdings.filter(holding => holding.id !== holdingId)
    
    // Recalculate portfolio totals
    const totalValue = updatedHoldings.reduce((sum, holding) => sum + holding.currentValue, 0)
    const totalCost = updatedHoldings.reduce((sum, holding) => sum + holding.totalCost, 0)
    const totalGainLoss = totalValue - totalCost
    const totalGainLossPercent = totalCost > 0 ? (totalGainLoss / totalCost) * 100 : 0
    
    const updatedPortfolio: Portfolio = {
      ...portfolio,
      holdings: updatedHoldings,
      totalValue,
      totalCost,
      totalGainLoss,
      totalGainLossPercent,
      lastUpdated: new Date()
    }
    
    setPortfolio(updatedPortfolio)
  }

  // Keyboard shortcuts
  const refreshData = async () => {
    setIsLoading(true)
    try {
      const symbols = portfolio.holdings.map(holding => holding.asset.symbol)
      if (symbols.length > 0) {
        // Use Yahoo Finance service for real data
        const quotes = await yahooFinanceService.fetchMultipleQuotes(symbols)
        const updatedHoldings = portfolio.holdings.map(holding => {
          const quote = quotes.find(q => q.symbol === holding.asset.symbol)
          if (quote) {
            const updatedAsset = {
              ...holding.asset,
              currentPrice: quote.price,
              change24h: quote.change,
              changePercent24h: quote.changePercent,
            }
            const currentValue = holding.quantity * quote.price
            const gainLoss = currentValue - holding.totalCost
            const gainLossPercent = (holding.totalCost > 0) ? (gainLoss / holding.totalCost) * 100 : 0
            return {
              ...holding,
              asset: updatedAsset,
              currentValue,
              gainLoss,
              gainLossPercent,
            }
          }
          return holding
        })
        const totalValue = updatedHoldings.reduce((sum, holding) => sum + holding.currentValue, 0)
        const totalCost = updatedHoldings.reduce((sum, holding) => sum + holding.totalCost, 0)
        const totalGainLoss = totalValue - totalCost
        const totalGainLossPercent = (totalCost > 0) ? (totalGainLoss / totalCost) * 100 : 0
        setPortfolio({
          ...portfolio,
          holdings: updatedHoldings,
          totalValue,
          totalCost,
          totalGainLoss,
          totalGainLossPercent,
          lastUpdated: new Date(),
        })
        setLastUpdated(new Date())
      }
    } catch (error) {
      console.error('Failed to refresh data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const shortcuts = createPortfolioShortcuts(
    setActiveTab,
    refreshData,
    () => console.log('Add transaction shortcut pressed')
  )

  useKeyboardShortcuts({ shortcuts })

  const handleRefreshPrices = async () => {
    const symbols = portfolio.holdings.map(holding => holding.asset.symbol)
    if (symbols.length > 0) {
      setIsLoading(true)
      try {
        // Use Yahoo Finance service for real data
        const quotes = await yahooFinanceService.fetchMultipleQuotes(symbols)
        
        // Update portfolio with new prices
        const updatedHoldings = portfolio.holdings.map(holding => {
          const quote = quotes.find(q => q.symbol === holding.asset.symbol)
          if (quote) {
            const updatedAsset = {
              ...holding.asset,
              currentPrice: quote.price,
              change24h: quote.change,
              changePercent24h: quote.changePercent
            }
            
            const currentValue = holding.quantity * quote.price
            const gainLoss = currentValue - holding.totalCost
            const gainLossPercent = (gainLoss / holding.totalCost) * 100
            
            return {
              ...holding,
              asset: updatedAsset,
              currentValue,
              gainLoss,
              gainLossPercent
            }
          }
          return holding
        })
        
        // Recalculate portfolio totals
        const totalValue = updatedHoldings.reduce((sum, holding) => sum + holding.currentValue, 0)
        const totalCost = updatedHoldings.reduce((sum, holding) => sum + holding.totalCost, 0)
        const totalGainLoss = totalValue - totalCost
        const totalGainLossPercent = (totalGainLoss / totalCost) * 100
        
        const updatedPortfolio: Portfolio = {
          ...portfolio,
          holdings: updatedHoldings,
          totalValue,
          totalGainLoss,
          totalGainLossPercent,
          lastUpdated: new Date()
        }
        
        setPortfolio(updatedPortfolio)
        setLastUpdated(new Date())
      } catch (error) {
        console.error('Failed to refresh prices:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.background, transition: 'background-color 0.3s ease' }}>
      {/* Header */}
      <header style={{ 
        backgroundColor: colors.surface, 
        boxShadow: colors.shadow, 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0' }}>
      <div>
              <h1 style={{ 
                fontSize: '1.875rem', 
                fontWeight: 'bold', 
                color: colors.textPrimary, 
                margin: 0,
                transition: 'color 0.3s ease'
              }}>
                Investment Portfolio Manager
              </h1>
              <p style={{ 
                color: colors.textSecondary, 
                margin: '0.25rem 0 0 0',
                transition: 'color 0.3s ease'
              }}>
                Track and manage your investments
        </p>
      </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <ThemeToggle />
              <button
                onClick={handleRefreshPrices}
                disabled={isLoading}
                style={{
                  ...themeStyles.button.primary,
                  opacity: isLoading ? 0.6 : 1,
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}
              >
                {isLoading ? (
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    border: '2px solid #ffffff40', 
                    borderTop: '2px solid #ffffff', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite' 
                  }} />
                ) : (
                  '↻'
                )}
                Refresh
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: colors.textSecondary }}>
                {isLoading && (
                  <div style={{ 
                    width: '12px', 
                    height: '12px', 
                    border: '2px solid #e5e7eb', 
                    borderTop: '2px solid #3b82f6', 
                    borderRadius: '50%', 
                    animation: 'spin 1s linear infinite' 
                  }} />
                )}
                Last updated: {lastUpdated.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ 
        backgroundColor: colors.surface, 
        borderBottom: `1px solid ${colors.border}`,
        transition: 'all 0.3s ease'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'holdings', label: 'Holdings' },
              { id: 'transactions', label: 'Transactions' },
              { id: 'analytics', label: 'Analytics' },
              { id: 'watchlist', label: 'Watchlist' },
              { id: 'market', label: 'Market' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: '1rem 0.25rem',
                  borderBottom: '2px solid',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  color: activeTab === tab.id ? colors.primary : colors.textSecondary,
                  borderBottomColor: activeTab === tab.id ? colors.primary : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <PortfolioOverview portfolio={portfolio} />
            <MemoizedPerformanceChart portfolio={portfolio} isDarkMode={isDarkMode} />
          </div>
        )}
        
        {activeTab === 'holdings' && (
          <VirtualHoldingsList 
            holdings={portfolio.holdings} 
            isDarkMode={isDarkMode}
            onUpdateHolding={handleUpdateHolding}
            onDeleteHolding={handleDeleteHolding}
          />
        )}
        
        {activeTab === 'transactions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <AddTransaction portfolio={portfolio} setPortfolio={handlePortfolioUpdate} />
            <div style={{ 
              ...themeStyles.card,
              transition: 'all 0.3s ease'
            }}>
              <div style={{ 
                padding: '1.5rem', 
                borderBottom: `1px solid ${colors.border}`,
                transition: 'all 0.3s ease'
              }}>
                <h3 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '500', 
                  color: colors.textPrimary, 
                  margin: 0,
                  transition: 'color 0.3s ease'
                }}>
                  Transaction History
                </h3>
              </div>
              <TransactionHistory transactions={portfolio.transactions} />
            </div>
          </div>
        )}
        
        {activeTab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <AdvancedAnalytics portfolio={portfolio} isDarkMode={isDarkMode} />
            <PortfolioAnalytics portfolio={portfolio} />
            <PortfolioComparison portfolio={portfolio} isDarkMode={isDarkMode} />
            <AdvancedCharts portfolio={portfolio} isDarkMode={isDarkMode} />
            <AdditionalData portfolio={portfolio} isDarkMode={isDarkMode} />
          </div>
        )}
        
        {activeTab === 'watchlist' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <Watchlist isDarkMode={isDarkMode} />
            <Notifications portfolio={portfolio} isDarkMode={isDarkMode} />
          </div>
        )}
        
        {activeTab === 'market' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <MarketStatus isDarkMode={isDarkMode} />
            <RealTimeQuotes 
              symbols={portfolio.holdings.map(h => h.asset.symbol)} 
              isDarkMode={isDarkMode} 
            />
            <MarketNews isDarkMode={isDarkMode} />
          </div>
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App