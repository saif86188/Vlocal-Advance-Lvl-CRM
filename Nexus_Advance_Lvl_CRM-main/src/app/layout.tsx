import type { Metadata } from 'next';
import '@/styles/fonts.css';
import '@/styles/globals.css';
import '@/styles/theme.css';
import ThemeRegistry from './registry/theme-registry';

export const metadata: Metadata = {
  title: 'VlocalOS | Client Dashboard',
  description: 'VlocalOS Customer Relationship Operating System',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
