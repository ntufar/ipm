import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme()
  
  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        border: 'none',
        backgroundColor: isDarkMode ? '#334155' : '#f1f5f9',
        color: isDarkMode ? '#f8fafc' : '#374151',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: isDarkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = isDarkMode ? '#475569' : '#e2e8f0'
        e.currentTarget.style.transform = 'scale(1.05)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = isDarkMode ? '#334155' : '#f1f5f9'
        e.currentTarget.style.transform = 'scale(1)'
      }}
      title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  )
}
