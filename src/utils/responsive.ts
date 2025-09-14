// Responsive design utilities
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
} as const

export const mediaQueries = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.wide})`
} as const

// Responsive spacing utilities
export const getResponsiveSpacing = (base: number, mobile?: number, tablet?: number) => {
  return {
    padding: `${base}rem`,
    [`@media (max-width: ${breakpoints.mobile})`]: {
      padding: `${mobile || base * 0.75}rem`
    },
    [`@media (max-width: ${breakpoints.tablet})`]: {
      padding: `${tablet || base * 0.875}rem`
    }
  }
}

// Responsive grid utilities
export const getResponsiveGrid = (columns: number, mobileColumns = 1, tabletColumns = 2) => {
  return {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: '1rem',
    [`@media (max-width: ${breakpoints.mobile})`]: {
      gridTemplateColumns: `repeat(${mobileColumns}, 1fr)`,
      gap: '0.75rem'
    },
    [`@media (max-width: ${breakpoints.tablet})`]: {
      gridTemplateColumns: `repeat(${tabletColumns}, 1fr)`,
      gap: '0.875rem'
    }
  }
}

// Touch-friendly button styles
export const getTouchButton = (baseSize = 44) => ({
  minHeight: `${baseSize}px`,
  minWidth: `${baseSize}px`,
  padding: '0.75rem 1rem',
  fontSize: '1rem',
  touchAction: 'manipulation' as const,
  userSelect: 'none' as const,
  WebkitTapHighlightColor: 'transparent'
})

// Mobile-optimized card styles
export const getMobileCard = () => ({
  margin: '0.5rem',
  borderRadius: '0.75rem',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  [`@media (max-width: ${breakpoints.mobile})`]: {
    margin: '0.25rem',
    borderRadius: '0.5rem'
  }
})
