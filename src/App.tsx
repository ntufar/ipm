import { useState } from 'react'
import { PortfolioOverview } from './components/PortfolioOverview'
import { HoldingsList } from './components/HoldingsList'
import { PerformanceChart } from './components/PerformanceChart'
import { AddTransaction } from './components/AddTransaction'
import { samplePortfolio } from './data/sampleData'
import { Portfolio } from './types/index'
import './App.css'

function App() {
  const [portfolio, setPortfolio] = useState<Portfolio>(samplePortfolio)
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'transactions'>('overview')

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 0' }}>
            <div>
              <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', margin: 0 }}>Investment Portfolio Manager</h1>
              <p style={{ color: '#6b7280', margin: '0.25rem 0 0 0' }}>Track and manage your investments</p>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
              Last updated: {portfolio.lastUpdated.toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                padding: '1rem 0.25rem',
                borderBottom: '2px solid',
                fontWeight: '500',
                fontSize: '0.875rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === 'overview' ? '#2563eb' : '#6b7280',
                borderBottomColor: activeTab === 'overview' ? '#3b82f6' : 'transparent'
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('holdings')}
              style={{
                padding: '1rem 0.25rem',
                borderBottom: '2px solid',
                fontWeight: '500',
                fontSize: '0.875rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === 'holdings' ? '#2563eb' : '#6b7280',
                borderBottomColor: activeTab === 'holdings' ? '#3b82f6' : 'transparent'
              }}
            >
              Holdings
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              style={{
                padding: '1rem 0.25rem',
                borderBottom: '2px solid',
                fontWeight: '500',
                fontSize: '0.875rem',
                backgroundColor: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: activeTab === 'transactions' ? '#2563eb' : '#6b7280',
                borderBottomColor: activeTab === 'transactions' ? '#3b82f6' : 'transparent'
              }}
            >
              Transactions
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <PortfolioOverview portfolio={portfolio} />
            <PerformanceChart portfolio={portfolio} />
          </div>
        )}
        
        {activeTab === 'holdings' && (
          <HoldingsList holdings={portfolio.holdings} />
        )}
        
        {activeTab === 'transactions' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <AddTransaction portfolio={portfolio} setPortfolio={setPortfolio} />
            <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem' }}>
              <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>Transaction History</h3>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <p style={{ color: '#6b7280', margin: 0 }}>Transaction history will be displayed here</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
