import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Portfolio } from '../types'
import { generatePerformanceData } from '../utils/calculations'

interface PerformanceChartProps {
  portfolio: Portfolio
}

export function PerformanceChart({ portfolio }: PerformanceChartProps) {
  const performanceData = generatePerformanceData(portfolio, 30)

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm text-gray-600 mb-2">
            {new Date(label).toLocaleDateString()}
          </p>
          <p className="text-lg font-semibold text-gray-900">
            Value: ${data.value.toLocaleString()}
          </p>
          <p className={`text-sm ${data.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {data.gainLoss >= 0 ? '+' : ''}${data.gainLoss.toLocaleString()} ({data.gainLossPercent >= 0 ? '+' : ''}{data.gainLossPercent.toFixed(2)}%)
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Portfolio Performance</h3>
        <p className="text-sm text-gray-500">30-day performance overview</p>
      </div>
      
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                stroke="#6b7280"
                fontSize={12}
              />
              <YAxis 
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                stroke="#6b7280"
                fontSize={12}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
