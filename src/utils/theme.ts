// Theme-aware styling utilities

export const getThemeColors = (isDarkMode: boolean) => ({
  // Background colors
  background: isDarkMode ? '#0f172a' : '#f9fafb',
  surface: isDarkMode ? '#1e293b' : '#ffffff',
  surfaceSecondary: isDarkMode ? '#334155' : '#f1f5f9',
  
  // Text colors
  textPrimary: isDarkMode ? '#f8fafc' : '#111827',
  textSecondary: isDarkMode ? '#cbd5e1' : '#6b7280',
  textMuted: isDarkMode ? '#94a3b8' : '#9ca3af',
  
  // Border colors
  border: isDarkMode ? '#475569' : '#e5e7eb',
  borderLight: isDarkMode ? '#334155' : '#f3f4f6',
  
  // Accent colors
  primary: isDarkMode ? '#3b82f6' : '#2563eb',
  primaryHover: isDarkMode ? '#2563eb' : '#1d4ed8',
  success: isDarkMode ? '#10b981' : '#059669',
  error: isDarkMode ? '#ef4444' : '#dc2626',
  warning: isDarkMode ? '#f59e0b' : '#d97706',
  
  // Chart colors
  chartGreen: isDarkMode ? '#10b981' : '#059669',
  chartRed: isDarkMode ? '#ef4444' : '#dc2626',
  chartBlue: isDarkMode ? '#3b82f6' : '#2563eb',
  
  // Shadow
  shadow: isDarkMode ? '0 1px 3px 0 rgba(0, 0, 0, 0.3)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  shadowLg: isDarkMode ? '0 10px 15px -3px rgba(0, 0, 0, 0.3)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
})

export const getThemeStyles = (isDarkMode: boolean) => {
  const colors = getThemeColors(isDarkMode)
  
  return {
    // Common component styles
    card: {
      backgroundColor: colors.surface,
      border: `1px solid ${colors.border}`,
      boxShadow: colors.shadow,
      borderRadius: '0.5rem',
    },
    
    button: {
      primary: {
        backgroundColor: colors.primary,
        color: '#ffffff',
        border: 'none',
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s',
      },
      secondary: {
        backgroundColor: 'transparent',
        color: colors.textPrimary,
        border: `1px solid ${colors.border}`,
        borderRadius: '0.375rem',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        fontSize: '0.875rem',
        fontWeight: '500',
        transition: 'all 0.2s',
      }
    },
    
    input: {
      backgroundColor: colors.surface,
      color: colors.textPrimary,
      border: `1px solid ${colors.border}`,
      borderRadius: '0.375rem',
      padding: '0.5rem 0.75rem',
      fontSize: '0.875rem',
      outline: 'none',
      transition: 'border-color 0.2s',
    },
    
    table: {
      header: {
        backgroundColor: colors.surfaceSecondary,
        color: colors.textSecondary,
        fontWeight: '500',
        fontSize: '0.875rem',
      },
      cell: {
        color: colors.textPrimary,
        fontSize: '0.875rem',
        padding: '0.75rem 1rem',
        borderBottom: `1px solid ${colors.borderLight}`,
      }
    }
  }
}
