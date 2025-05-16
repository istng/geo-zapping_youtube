import { createTheme, rem } from '@mantine/core';
import type { MantineThemeOverride } from '@mantine/core';

export const theme: MantineThemeOverride = createTheme({
  primaryColor: 'blue',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  fontFamilyMonospace: 'Monaco, Courier, monospace',
  headings: {
    fontFamily: 'Greycliff CF, sans-serif',
    fontWeight: '700',
  },
  defaultRadius: 'md',
  white: '#fff',
  black: '#1a1b1e',

  
  shadows: {
    md: '0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  },
  
  spacing: {
    xs: rem(4),
    sm: rem(8),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },

  components: {
    Button: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
      styles: {
        root: {
          fontWeight: 600,
        },
      },
    },
    TextInput: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
    },
    PasswordInput: {
      defaultProps: {
        size: 'md',
        radius: 'md',
      },
    },
    Paper: {
      defaultProps: {
        p: 'md',
        radius: 'md',
      },
      styles: {
        root: {
          backgroundColor: '#fff',
        },
      },
    },
    Container: {
      defaultProps: {
        size: 'md',
      },
    },
  },
}); 