
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from '@/components/providers';
import { ThemeProvider } from '@/contexts/theme-context';
import LayoutWrapper from '@/components/layout-wrapper';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Reclu - Plataforma de Evaluación de Talento',
  description: 'Plataforma empresarial de evaluaciones DISC y Fuerzas Motivadoras para análisis de talento y desarrollo organizacional',
  icons: {
    icon: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers session={session}>
          <ThemeProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
// Deploy timestamp: Mon Jan 19 15:12:08 UTC 2026
