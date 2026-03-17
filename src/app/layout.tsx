import type { Metadata } from 'next';

import '../index.css';

import { AppShell } from '../components/AppShell';

export const metadata: Metadata = {
  title: 'tasteshelf',
  description: 'tasteshelf',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
