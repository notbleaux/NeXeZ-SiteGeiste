import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NeXeZ SiteGeiste - PixelOffice AI Workspace',
  description: 'Enterprise platform combining WebApp, Browser Extension, and Website with PixelOffice-inspired AI Agent Visualization and Gamified Project Management',
  keywords: ['AI', 'development', 'project management', 'pixel art', 'agents', 'coding', 'onboarding'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
