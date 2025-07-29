import './globals.css';
import { ReactNode } from 'react';
import TopBar from '../components/organisms/TopBar';
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
  title: 'LT Econ Portal',
  description: 'Lithuanian economic insights, dashboards, and stories',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="lt" className="font-sans">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&family=Merriweather:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-background text-foreground font-sans antialiased min-h-screen">
        <AuthProvider>
          <TopBar />
          <main className="pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
