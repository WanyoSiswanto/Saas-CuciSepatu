import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'NyoClean — Professional Shoe Laundry & Care Atelier',
  description: 'Sistem operasional dan manajemen kasir (POS), alur Kanban workshop, nota thermal digital WhatsApp, dan pelacakan publik cucian sepatu.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${jakarta.variable} ${jetbrains.variable}`}>
      <body className="bg-[#F8FAFC] text-[#0F172A] font-sans antialiased min-h-screen selection:bg-blue-500/20 selection:text-blue-700">
        {children}
      </body>
    </html>
  );
}
