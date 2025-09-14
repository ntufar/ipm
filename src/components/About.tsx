import { Github, ExternalLink, Code, Zap, Shield, Globe } from 'lucide-react'

interface AboutProps {
  isDarkMode?: boolean
}

export function About({ isDarkMode = false }: AboutProps) {
  const colors = {
    background: isDarkMode ? '#1a1a1a' : '#ffffff',
    cardBackground: isDarkMode ? '#2a2a2a' : '#f8f9fa',
    textPrimary: isDarkMode ? '#ffffff' : '#1a1a1a',
    textSecondary: isDarkMode ? '#a0a0a0' : '#666666',
    border: isDarkMode ? '#404040' : '#e0e0e0',
    primary: '#3b82f6',
    accent: '#10b981'
  }

  const cardStyle = {
    background: colors.cardBackground,
    borderRadius: '12px',
    padding: '2rem',
    border: `1px solid ${colors.border}`,
    transition: 'all 0.3s ease'
  }

  const featureItems = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-Time Data",
      description: "Live stock prices from Yahoo Finance with automatic updates"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "All data stored locally in your browser - no server required"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Open Source",
      description: "Built with React, TypeScript, and modern web technologies"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Coverage",
      description: "Access to thousands of stocks from major exchanges worldwide"
    }
  ]

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem 1rem',
      color: colors.textPrimary,
      transition: 'color 0.3s ease'
    }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '700', 
          marginBottom: '1rem',
          background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Investment Portfolio Manager
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: colors.textSecondary,
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          A modern, feature-rich web application for tracking and managing your investment portfolio. 
          Built with React, TypeScript, and Vite for optimal performance.
        </p>
      </div>

      {/* Features Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        {featureItems.map((feature, index) => (
          <div key={index} style={cardStyle}>
            <div style={{ 
              color: colors.primary, 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              {feature.icon}
              <h3 style={{ 
                fontSize: '1.125rem', 
                fontWeight: '600', 
                margin: 0,
                color: colors.textPrimary
              }}>
                {feature.title}
              </h3>
            </div>
            <p style={{ 
              color: colors.textSecondary, 
              lineHeight: '1.6',
              margin: 0
            }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Key Features */}
      <div style={cardStyle}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          color: colors.textPrimary
        }}>
          Key Features
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1rem'
        }}>
          <div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              marginBottom: '0.5rem'
            }}>
              📊 Portfolio Management
            </h4>
            <ul style={{ 
              color: colors.textSecondary, 
              paddingLeft: '1.25rem',
              margin: 0
            }}>
              <li>Real-time portfolio valuation</li>
              <li>Advanced analytics dashboard</li>
              <li>Performance tracking and charts</li>
              <li>Holdings editing and deletion</li>
            </ul>
          </div>
          <div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              marginBottom: '0.5rem'
            }}>
              💰 Transaction Management
            </h4>
            <ul style={{ 
              color: colors.textSecondary, 
              paddingLeft: '1.25rem',
              margin: 0
            }}>
              <li>Buy/sell transaction tracking</li>
              <li>Real-time stock search</li>
              <li>Transaction history</li>
              <li>Automatic holdings conversion</li>
            </ul>
          </div>
          <div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              marginBottom: '0.5rem'
            }}>
              📋 Watchlist & Alerts
            </h4>
            <ul style={{ 
              color: colors.textSecondary, 
              paddingLeft: '1.25rem',
              margin: 0
            }}>
              <li>Stock watchlist management</li>
              <li>Price alerts and notifications</li>
              <li>Target price tracking</li>
              <li>Portfolio milestone alerts</li>
            </ul>
          </div>
          <div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              marginBottom: '0.5rem'
            }}>
              🎨 User Experience
            </h4>
            <ul style={{ 
              color: colors.textSecondary, 
              paddingLeft: '1.25rem',
              margin: 0
            }}>
              <li>Dark/light theme support</li>
              <li>Mobile-responsive design</li>
              <li>Keyboard shortcuts</li>
              <li>Loading skeletons</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div style={cardStyle}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          color: colors.textPrimary
        }}>
          Technology Stack
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              marginBottom: '0.5rem',
              color: colors.primary
            }}>
              ⚛️
            </div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              margin: '0 0 0.25rem 0'
            }}>
              React 18.2.0
            </h4>
            <p style={{ 
              fontSize: '0.875rem', 
              color: colors.textSecondary,
              margin: 0
            }}>
              Frontend Framework
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              marginBottom: '0.5rem',
              color: colors.primary
            }}>
              🔷
            </div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              margin: '0 0 0.25rem 0'
            }}>
              TypeScript
            </h4>
            <p style={{ 
              fontSize: '0.875rem', 
              color: colors.textSecondary,
              margin: 0
            }}>
              Type Safety
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              marginBottom: '0.5rem',
              color: colors.primary
            }}>
              ⚡
            </div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              margin: '0 0 0.25rem 0'
            }}>
              Vite 7.1.5
            </h4>
            <p style={{ 
              fontSize: '0.875rem', 
              color: colors.textSecondary,
              margin: 0
            }}>
              Build Tool
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ 
              fontSize: '2rem', 
              marginBottom: '0.5rem',
              color: colors.primary
            }}>
              📊
            </div>
            <h4 style={{ 
              fontSize: '1rem', 
              fontWeight: '600', 
              color: colors.textPrimary,
              margin: '0 0 0.25rem 0'
            }}>
              Recharts
            </h4>
            <p style={{ 
              fontSize: '0.875rem', 
              color: colors.textSecondary,
              margin: 0
            }}>
              Data Visualization
            </p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div style={cardStyle}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '1.5rem',
          color: colors.textPrimary
        }}>
          Links & Resources
        </h2>
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '1rem',
          justifyContent: 'center'
        }}>
          <a
            href="https://github.com/ntufar/ipm"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: colors.primary,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.accent
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.primary
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <Github className="w-4 h-4" />
            View on GitHub
          </a>
          <a
            href="https://ipm-tufar.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: colors.accent,
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = colors.primary
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = colors.accent
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <ExternalLink className="w-4 h-4" />
            Live Demo
          </a>
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem',
        padding: '1.5rem',
        borderTop: `1px solid ${colors.border}`
      }}>
        <p style={{ 
          color: colors.textSecondary,
          margin: 0,
          fontSize: '0.875rem'
        }}>
          Built with ❤️ using React, TypeScript, and Vite
        </p>
        <p style={{ 
          color: colors.textSecondary,
          margin: '0.5rem 0 0 0',
          fontSize: '0.75rem'
        }}>
          © 2025{' '}
          <a
            href="https://github.com/ntufar"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: colors.primary,
              textDecoration: 'none',
              fontWeight: '500',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = colors.accent
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = colors.primary
            }}
          >
            Nicolai Tufar
          </a>
          . All rights reserved.
        </p>
      </div>
    </div>
  )
}
