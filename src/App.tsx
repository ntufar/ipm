import { useState } from 'react'
import { PortfolioOverview } from './components/PortfolioOverview'
import { HoldingsList } from './components/HoldingsList'
import { PerformanceChart } from './components/PerformanceChart'
import { AddTransaction } from './components/AddTransaction'
import { samplePortfolio } from './data/sampleData'
import { Portfolio } from './types'
import './App.css'

function App() {
  const [portfolio, setPortfolio] = useState<Portfolio>(samplePortfolio)
  const [activeTab, setActiveTab] = useState<'overview' | 'holdings' | 'transactions'>('overview')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Investment Portfolio Manager</h1>
              <p className="text-gray-600">Track and manage your investments</p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {portfolio.lastUpdated.toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('holdings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'holdings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Holdings
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'transactions'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Transactions
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <PortfolioOverview portfolio={portfolio} />
            <PerformanceChart portfolio={portfolio} />
          </div>
        )}
        
        {activeTab === 'holdings' && (
          <HoldingsList holdings={portfolio.holdings} />
        )}
        
        {activeTab === 'transactions' && (
          <div className="space-y-8">
            <AddTransaction portfolio={portfolio} setPortfolio={setPortfolio} />
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Transaction History</h3>
              </div>
              <div className="px-6 py-4">
                <p className="text-gray-500">Transaction history will be displayed here</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App
