import type { Portfolio } from '../types/index.js'

const STORAGE_KEY = 'ipm-portfolio-data'

export const savePortfolio = (portfolio: Portfolio): void => {
  try {
    const serialized = JSON.stringify(portfolio, (_, value) => {
      // Convert Date objects to ISO strings for serialization
      if (value instanceof Date) {
        return value.toISOString()
      }
      return value
    })
    localStorage.setItem(STORAGE_KEY, serialized)
  } catch (error) {
    console.error('Failed to save portfolio to localStorage:', error)
  }
}

export const loadPortfolio = (): Portfolio | null => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY)
    if (!serialized) return null
    
    const parsed = JSON.parse(serialized, (_, value) => {
      // Convert ISO strings back to Date objects
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)) {
        return new Date(value)
      }
      return value
    })
    
    return parsed as Portfolio
  } catch (error) {
    console.error('Failed to load portfolio from localStorage:', error)
    return null
  }
}

export const clearPortfolio = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Failed to clear portfolio from localStorage:', error)
  }
}
