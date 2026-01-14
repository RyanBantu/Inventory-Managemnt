// Forest Green Theme Configuration
// Primary: #152A11 (Dark), #3D6A4B (Medium), #7CB88A (Light)

export const theme = {
  colors: {
    // Primary Forest Green Palette
    primary: {
      900: '#152A11',
      800: '#1E3A18',
      700: '#2D5024',
      600: '#3D6A4B',
      500: '#4A7C59',
      400: '#5E9B6C',
      300: '#7CB88A',
      200: '#A8D4B4',
      100: '#D4EADB',
      50: '#EDF6EF',
    },
    // Neutral Colors
    neutral: {
      900: '#1a1a1a',
      800: '#2d2d2d',
      700: '#404040',
      600: '#525252',
      500: '#6b6b6b',
      400: '#8a8a8a',
      300: '#b0b0b0',
      200: '#d4d4d4',
      100: '#ececec',
      50: '#f7f7f7',
      white: '#ffffff',
    },
    // Semantic Colors
    success: '#2E7D32',
    successLight: '#E8F5E9',
    warning: '#F57C00',
    warningLight: '#FFF3E0',
    error: '#C62828',
    errorLight: '#FFEBEE',
    info: '#1565C0',
    infoLight: '#E3F2FD',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
  },
  borderRadius: {
    sm: '6px',
    md: '10px',
    lg: '14px',
    xl: '18px',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px rgba(21, 42, 17, 0.05)',
    md: '0 4px 6px rgba(21, 42, 17, 0.07)',
    lg: '0 10px 15px rgba(21, 42, 17, 0.1)',
    xl: '0 20px 25px rgba(21, 42, 17, 0.15)',
  },
  fonts: {
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
};

// Common style patterns
export const commonStyles = {
  card: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: theme.borderRadius.lg,
    border: `1px solid ${theme.colors.neutral[200]}`,
    boxShadow: theme.shadows.sm,
  },
  cardHover: {
    boxShadow: theme.shadows.md,
    borderColor: theme.colors.primary[300],
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    border: `1px solid ${theme.colors.neutral[200]}`,
    borderRadius: theme.borderRadius.md,
    fontSize: '15px',
    color: theme.colors.neutral[900],
    backgroundColor: theme.colors.neutral[50],
  },
  inputFocus: {
    borderColor: theme.colors.primary[500],
    boxShadow: `0 0 0 3px ${theme.colors.primary[100]}`,
  },
  button: {
    primary: {
      backgroundColor: theme.colors.primary[600],
      color: theme.colors.neutral.white,
      border: 'none',
      borderRadius: theme.borderRadius.md,
      padding: '14px 24px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    secondary: {
      backgroundColor: theme.colors.neutral.white,
      color: theme.colors.primary[700],
      border: `2px solid ${theme.colors.primary[400]}`,
      borderRadius: theme.borderRadius.md,
      padding: '12px 22px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
    },
    danger: {
      backgroundColor: theme.colors.error,
      color: theme.colors.neutral.white,
      border: 'none',
      borderRadius: theme.borderRadius.md,
      padding: '14px 24px',
      fontSize: '15px',
      fontWeight: '600',
      cursor: 'pointer',
    },
  },
  heading: {
    h1: {
      fontSize: '32px',
      fontWeight: '700',
      color: theme.colors.primary[900],
      letterSpacing: '-0.5px',
    },
    h2: {
      fontSize: '24px',
      fontWeight: '700',
      color: theme.colors.primary[900],
      letterSpacing: '-0.3px',
    },
    h3: {
      fontSize: '18px',
      fontWeight: '600',
      color: theme.colors.neutral[800],
    },
  },
  text: {
    body: {
      fontSize: '15px',
      color: theme.colors.neutral[600],
      lineHeight: '1.6',
    },
    small: {
      fontSize: '13px',
      color: theme.colors.neutral[500],
    },
    label: {
      fontSize: '12px',
      fontWeight: '600',
      color: theme.colors.neutral[500],
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
  },
};

export default theme;
