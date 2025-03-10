import type { Metadata } from 'next';
import './globals.css';
import { GeistSans } from 'geist/font/sans';
import { DARK_TOKENS, LIGHT_TOKENS } from '@/lib/constants';
import { Toaster } from 'sonner';

import { getSession } from '@/lib/auth';
import { AuthProvider } from '@/context/auth/AuthContext';
import { ProgressProvider } from '@/context/progress/ProgressContext';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const theme = 'dark';

  const user = await getSession();
  return (
    <html
      lang="en"
      style={
        theme === 'dark'
          ? (DARK_TOKENS as React.CSSProperties)
          : (LIGHT_TOKENS as React.CSSProperties)
      }
    >
      <body className={GeistSans.className}>
        <AuthProvider initialUser={user}>
          <ProgressProvider>
            {children}
            <Toaster richColors position="top-center" />
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
