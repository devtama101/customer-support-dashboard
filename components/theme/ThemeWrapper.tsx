'use client';

import { ThemeProvider } from './ThemeProvider';
import type { ReactNode } from 'react';

export function ThemeWrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
