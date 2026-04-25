import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kalkulator WACC vs. Oszczędności',
  description:
    'Model porównania wcześniejszego zakupu: koszt kapitału (WACC) vs. potencjalne oszczędności cenowe.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body>{children}</body>
    </html>
  );
}
