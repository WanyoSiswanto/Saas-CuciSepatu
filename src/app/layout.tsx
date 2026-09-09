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
  title: 'SNEAKERCARE LAB — Shoe Laundry & Restoration Management',
  description: 'Sistem operasional dan manajemen kasir (POS), alur Kanban pengerjaan, nota thermal digital WhatsApp, dan pelacakan publik cucian sepatu.',
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
    <html lang="id" className={`${jakarta.variable} ${jetbrains.variable} dark`}>
      <body className="bg-[#0b0d11] text-[#f8f9fa] font-sans antialiased min-h-screen selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
