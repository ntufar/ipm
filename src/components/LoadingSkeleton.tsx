import { getThemeColors } from '../utils/theme'

interface SkeletonProps {
  width?: string | number
  height?: string | number
  borderRadius?: string
  isDarkMode?: boolean
  className?: string
}

export function Skeleton({ 
  width = '100%', 
  height = '1rem', 
  borderRadius = '0.25rem',
  isDarkMode = false,
  className = ''
}: SkeletonProps) {
  const colors = getThemeColors(isDarkMode)
  
  return (
    <div
      className={className}
      style={{
        width,
        height,
        backgroundColor: colors.border,
        borderRadius,
        animation: 'pulse 1.5s ease-in-out infinite'
      }}
    />
  )
}

export function CardSkeleton({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const colors = getThemeColors(isDarkMode)
  
  return (
    <div
      style={{
        backgroundColor: colors.surface,
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow
      }}
    >
      <Skeleton width="60%" height="1.5rem" isDarkMode={isDarkMode} />
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <Skeleton width="100%" height="1rem" isDarkMode={isDarkMode} />
        <Skeleton width="80%" height="1rem" isDarkMode={isDarkMode} />
        <Skeleton width="40%" height="1rem" isDarkMode={isDarkMode} />
      </div>
    </div>
  )
}

export function ChartSkeleton({ isDarkMode = false }: { isDarkMode?: boolean }) {
  const colors = getThemeColors(isDarkMode)
  
  return (
    <div
      style={{
        backgroundColor: colors.surface,
        borderRadius: '0.75rem',
        padding: '1.5rem',
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
        height: '300px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem'
      }}
    >
      <Skeleton width="40%" height="1.5rem" isDarkMode={isDarkMode} />
      <div style={{ width: '100%', height: '200px', position: 'relative' }}>
        {/* Simulate chart bars */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${i * 12}%`,
              bottom: '0',
              width: '8%',
              height: `${Math.random() * 80 + 20}%`,
              backgroundColor: colors.border,
              borderRadius: '0.25rem 0.25rem 0 0',
              animation: 'pulse 1.5s ease-in-out infinite',
              animationDelay: `${i * 0.1}s`
            }}
          />
        ))}
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, isDarkMode = false }: { rows?: number; isDarkMode?: boolean }) {
  const colors = getThemeColors(isDarkMode)
  
  return (
    <div
      style={{
        backgroundColor: colors.surface,
        borderRadius: '0.75rem',
        border: `1px solid ${colors.border}`,
        boxShadow: colors.shadow,
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <div style={{ 
        padding: '1rem 1.5rem', 
        borderBottom: `1px solid ${colors.border}`,
        display: 'flex',
        gap: '1rem'
      }}>
        <Skeleton width="20%" height="1rem" isDarkMode={isDarkMode} />
        <Skeleton width="30%" height="1rem" isDarkMode={isDarkMode} />
        <Skeleton width="25%" height="1rem" isDarkMode={isDarkMode} />
        <Skeleton width="25%" height="1rem" isDarkMode={isDarkMode} />
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} style={{ 
          padding: '1rem 1.5rem', 
          borderBottom: i < rows - 1 ? `1px solid ${colors.border}` : 'none',
          display: 'flex',
          gap: '1rem'
        }}>
          <Skeleton width="20%" height="1rem" isDarkMode={isDarkMode} />
          <Skeleton width="30%" height="1rem" isDarkMode={isDarkMode} />
          <Skeleton width="25%" height="1rem" isDarkMode={isDarkMode} />
          <Skeleton width="25%" height="1rem" isDarkMode={isDarkMode} />
        </div>
      ))}
    </div>
  )
}
