import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Portfolio } from '../types/index.js'
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
    <div style={{ backgroundColor: 'white', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', borderRadius: '0.5rem' }}>
      <div style={{ padding: '1.5rem', borderBottom: '1px solid #e5e7eb' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', margin: 0 }}>Portfolio Performance</h3>
        <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: '0.25rem 0 0 0' }}>30-day performance overview</p>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <div style={{ height: '20rem' }}>
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
