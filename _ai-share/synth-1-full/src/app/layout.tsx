import './globals.css';
import type { Metadata } from 'next';
import { Fira_Sans, Fira_Code, Playfair_Display } from 'next/font/google';
import ClientLayout from '@/components/layout/client-layout';
import { RealtimeIntegrationsLayout } from '@/components/layout/RealtimeIntegrationsLayout';
import { QueryProvider } from '@/providers/query-provider';
import { UIStateProvider } from '@/providers/ui-state';
import { B2BStateProvider } from '@/providers/b2b-state';
import { AuthProvider } from '@/providers/auth-provider';
import { NotificationsProvider } from '@/providers/notifications-provider';
import { BrandCenterProvider } from '@/providers/brand-center-state';

export const metadata: Metadata = {
  title: 'Syntha',
  description: 'AI-Powered Fashion Marketplace',
  manifest: '/manifest.json',
  appleWebApp: { capable: true, title: 'Syntha' },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

/** Design system: design-system/synth-1-fashion-os/MASTER.md — fonts applied automatically */
const firaSans = Fira_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-body',
});

const firaCode = Fira_Code({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-code',
});

const playfair = Playfair_Display({
  weight: ['600', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-logo',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${firaSans.variable} ${firaCode.variable} ${playfair.variable}`}>
      <body className={firaSans.className}>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scan-line {
            0% { top: 0%; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
          .animate-scan-line {
            position: absolute;
            height: 2px;
            width: 100%;
            background: rgba(99, 102, 241, 0.8);
            box-shadow: 0 0 15px rgba(99, 102, 241, 0.8);
            animation: scan-line 2.5s linear infinite;
            z-index: 30;
          }
          @keyframes pulse-subtle {
            0%, 100% { transform: scale(1.02); box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.2); }
            50% { transform: scale(1.03); box-shadow: 0 0 20px 5px rgba(99, 102, 241, 0.1); }
          }
          .animate-pulse-subtle {
            animation: pulse-subtle 2s infinite ease-in-out;
          }
        ` }} />
        <QueryProvider>
        <AuthProvider>
          <UIStateProvider>
            <B2BStateProvider>
              <BrandCenterProvider>
              <NotificationsProvider>
                <RealtimeIntegrationsLayout>
                  <ClientLayout>{children}</ClientLayout>
                </RealtimeIntegrationsLayout>
              </NotificationsProvider>
              </BrandCenterProvider>
            </B2BStateProvider>
          </UIStateProvider>
        </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
