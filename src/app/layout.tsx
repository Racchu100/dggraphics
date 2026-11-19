import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DG graphics — Studio Business Management ERP',
  description: 'Commercial printing studio management, offline walk-in orders, production job cards, billing, expenses, and profit & loss ERP.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased bg-slate-100 text-slate-800">
        {children}
      </body>
    </html>
  );
}
