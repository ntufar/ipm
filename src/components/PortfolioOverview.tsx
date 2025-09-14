import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react'
import { Portfolio } from '../types'
import { formatCurrency, formatPercent } from '../utils/calculations'

interface PortfolioOverviewProps {
  portfolio: Portfolio
}

export function PortfolioOverview({ portfolio }: PortfolioOverviewProps) {
  const isPositive = portfolio.totalGainLoss >= 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Total Portfolio Value */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Value</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(portfolio.totalValue)}
            </p>
          </div>
        </div>
      </div>

      {/* Total Cost */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <DollarSign className="h-8 w-8 text-gray-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Cost</p>
            <p className="text-2xl font-semibold text-gray-900">
              {formatCurrency(portfolio.totalCost)}
            </p>
          </div>
        </div>
      </div>

      {/* Total Gain/Loss */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {isPositive ? (
              <TrendingUp className="h-8 w-8 text-green-600" />
            ) : (
              <TrendingDown className="h-8 w-8 text-red-600" />
            )}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Total Gain/Loss</p>
            <p className={`text-2xl font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(portfolio.totalGainLoss)}
            </p>
          </div>
        </div>
      </div>

      {/* Total Gain/Loss Percentage */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Percent className="h-8 w-8 text-purple-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-500">Gain/Loss %</p>
            <p className={`text-2xl font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(portfolio.totalGainLossPercent)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
