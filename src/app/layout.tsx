import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Ballistic Board - Fortnite Tactical Planner',
  description: 'Ferramenta de planejamento tático para Fortnite Ballistic 5v5',
  keywords: ['Fortnite', 'Ballistic', 'Tactical', 'Strategy', 'Planning', '5v5'],
  authors: [{ name: 'Ballistic Board Team' }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} dark`}>
        {children}
      </body>
    </html>
  );
}