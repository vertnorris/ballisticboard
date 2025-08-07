import type { Viewport } from 'next'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [{ media: '(prefers-color-scheme: light)', color: 'hsl(0 0% 100%)' }, { media: '(prefers-color-scheme: dark)', color: 'hsl(20 14.3% 4.1%)' }],
}