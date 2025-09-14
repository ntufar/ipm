import { useEffect, useCallback } from 'react'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  altKey?: boolean
  shiftKey?: boolean
  metaKey?: boolean
  action: () => void
  description: string
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[]
  enabled?: boolean
}

export function useKeyboardShortcuts({ shortcuts, enabled = true }: UseKeyboardShortcutsProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return

    const pressedKey = event.key.toLowerCase()
    const { ctrlKey, altKey, shiftKey, metaKey } = event

    const matchingShortcut = shortcuts.find(shortcut => {
      const shortcutKey = shortcut.key.toLowerCase()
      return (
        shortcutKey === pressedKey &&
        !!shortcut.ctrlKey === ctrlKey &&
        !!shortcut.altKey === altKey &&
        !!shortcut.shiftKey === shiftKey &&
        !!shortcut.metaKey === metaKey
      )
    })

    if (matchingShortcut) {
      event.preventDefault()
      matchingShortcut.action()
    }
  }, [shortcuts, enabled])

  useEffect(() => {
    if (enabled) {
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown, enabled])
}

// Common keyboard shortcuts for portfolio management
export const createPortfolioShortcuts = (
  setActiveTab: (tab: 'overview' | 'holdings' | 'transactions' | 'analytics') => void,
  onRefresh: () => void,
  onAddTransaction: () => void
): KeyboardShortcut[] => [
  {
    key: '1',
    ctrlKey: true,
    action: () => setActiveTab('overview'),
    description: 'Go to Overview'
  },
  {
    key: '2',
    ctrlKey: true,
    action: () => setActiveTab('holdings'),
    description: 'Go to Holdings'
  },
  {
    key: '3',
    ctrlKey: true,
    action: () => setActiveTab('transactions'),
    description: 'Go to Transactions'
  },
  {
    key: '4',
    ctrlKey: true,
    action: () => setActiveTab('analytics'),
    description: 'Go to Analytics'
  },
  {
    key: 'r',
    ctrlKey: true,
    action: onRefresh,
    description: 'Refresh data'
  },
  {
    key: 'n',
    ctrlKey: true,
    action: onAddTransaction,
    description: 'Add new transaction'
  },
  {
    key: '?',
    action: () => {
      // Show keyboard shortcuts help
      alert(`Keyboard Shortcuts:
Ctrl+1: Overview
Ctrl+2: Holdings  
Ctrl+3: Transactions
Ctrl+4: Analytics
Ctrl+R: Refresh data
Ctrl+N: Add transaction
? : Show this help`)
    },
    description: 'Show keyboard shortcuts'
  }
]

// Hook for showing keyboard shortcuts help
export function useKeyboardHelp() {
  const showHelp = useCallback(() => {
    // This could be replaced with a modal or tooltip
    const shortcuts = [
      'Ctrl+1: Go to Overview',
      'Ctrl+2: Go to Holdings',
      'Ctrl+3: Go to Transactions', 
      'Ctrl+4: Go to Analytics',
      'Ctrl+R: Refresh data',
      'Ctrl+N: Add new transaction',
      '?: Show this help'
    ].join('\n')
    
    alert(`Keyboard Shortcuts:\n\n${shortcuts}`)
  }, [])

  return { showHelp }
}
