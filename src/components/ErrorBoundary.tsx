import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { getThemeColors } from '../utils/theme'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: ErrorInfo
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorFallback 
        error={this.state.error} 
        onRetry={this.handleRetry}
        onReload={this.handleReload}
      />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error?: Error
  onRetry: () => void
  onReload: () => void
}

function ErrorFallback({ error, onRetry, onReload }: ErrorFallbackProps) {
  const colors = getThemeColors(false) // Default to light mode for error display

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: '1rem',
        padding: '2rem',
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.5rem'
        }}>
          <AlertTriangle size={48} color="#ef4444" />
        </div>
        
        <h1 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: colors.textPrimary,
          marginBottom: '1rem'
        }}>
          Oops! Something went wrong
        </h1>
        
        <p style={{
          color: colors.textSecondary,
          marginBottom: '1.5rem',
          lineHeight: '1.6'
        }}>
          We encountered an unexpected error. This might be a temporary issue.
        </p>

        {process.env.NODE_ENV === 'development' && error && (
          <details style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1.5rem',
            textAlign: 'left'
          }}>
            <summary style={{
              cursor: 'pointer',
              fontWeight: '500',
              color: colors.textPrimary,
              marginBottom: '0.5rem'
            }}>
              Error Details (Development)
            </summary>
            <pre style={{
              fontSize: '0.875rem',
              color: '#ef4444',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={onRetry}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: colors.primary,
              color: '#ffffff',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            <RefreshCw size={20} />
            Try Again
          </button>
          
          <button
            onClick={onReload}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              backgroundColor: 'transparent',
              color: colors.textPrimary,
              border: `1px solid ${colors.border}`,
              borderRadius: '0.5rem',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            <Home size={20} />
            Reload Page
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for functional components to handle errors
export function useErrorHandler() {
  return (error: Error, errorInfo?: any) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo)
    // You could also send to error reporting service here
  }
}
