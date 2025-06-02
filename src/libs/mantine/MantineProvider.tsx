import { MantineProvider as BaseMantineProvider } from '@mantine/core';
import type { ReactNode } from 'react';
import { theme } from './theme.ts';

export function MantineProvider({ children }: { children: ReactNode }) {
  return (
    <BaseMantineProvider defaultColorScheme="auto" theme={theme}>
      {children}
    </BaseMantineProvider>
  );
}