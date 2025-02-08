import { Inter } from 'next/font/google';
import { AuthProvider } from '@/lib/hooks/useAuth';
import { CartProvider } from '@/lib/hooks/useCart';
import { ThemeProvider } from '@/lib/hooks/useTheme';
import '@/styles/globals.css';
import '@/styles/themes.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'iYo-bwabaga | Premium Footwear',
  description: 'Your premier destination for luxury footwear. Quality and style combined.',
  keywords: 'shoes, footwear, luxury shoes, fashion, premium footwear',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
