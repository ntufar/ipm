import { useState } from 'react'
import { Menu, X, BarChart3, PieChart, History, Settings } from 'lucide-react'
import { getTouchButton } from '../utils/responsive'

interface MobileNavigationProps {
  activeTab: 'overview' | 'holdings' | 'transactions' | 'analytics'
  setActiveTab: (tab: 'overview' | 'holdings' | 'transactions' | 'analytics') => void
  colors: any
}

export function MobileNavigation({ activeTab, setActiveTab, colors }: MobileNavigationProps) {
  const [isOpen, setIsOpen] = useState(false)

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'holdings', label: 'Holdings', icon: PieChart },
    { id: 'transactions', label: 'Transactions', icon: History },
    { id: 'analytics', label: 'Analytics', icon: Settings }
  ] as const

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...getTouchButton(48),
          display: 'none',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.surface,
          border: `1px solid ${colors.border}`,
          borderRadius: '0.5rem',
          color: colors.textPrimary,
          cursor: 'pointer',
          position: 'fixed',
          top: '1rem',
          right: '1rem',
          zIndex: 1000,
          boxShadow: colors.shadow
        }}
        className="mobile-menu-button"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'none'
          }}
          className="mobile-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Navigation Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-100%',
          width: '280px',
          height: '100vh',
          backgroundColor: colors.surface,
          borderLeft: `1px solid ${colors.border}`,
          zIndex: 1000,
          transition: 'right 0.3s ease',
          display: 'none',
          flexDirection: 'column',
          padding: '1rem'
        }}
        className="mobile-panel"
      >
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: colors.textPrimary,
            margin: 0
          }}>
            Portfolio Manager
          </h2>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  setIsOpen(false)
                }}
                style={{
                  ...getTouchButton(48),
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 1rem',
                  backgroundColor: activeTab === tab.id ? colors.primary : 'transparent',
                  color: activeTab === tab.id ? '#ffffff' : colors.textPrimary,
                  border: 'none',
                  borderRadius: '0.5rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  width: '100%'
                }}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}
