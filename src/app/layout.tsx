import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { InstagramProvider } from '@/context/InstagramContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Video Upload App with Instagram Integration',
  description: 'Upload videos to AWS S3 and manage Instagram content',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <InstagramProvider>
          {children}
        </InstagramProvider>
      </body>
    </html>
  );
}
