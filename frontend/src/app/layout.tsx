import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import RealTimeStatus from '@/components/RealTimeStatus';
import WebSocketTest from '@/components/WebSocketTest';
import { ThemeProvider } from '@/contexts/ThemeContext';

const geist = Geist({ subsets: ['latin'] });

export const metadata = {
  title: 'ESahayak - Buyer Lead Management',
  description: 'Professional buyer lead management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={geist.className}>
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              {children}
              <RealTimeStatus />
              <WebSocketTest />
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
