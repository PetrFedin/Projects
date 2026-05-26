import './globals.css';
import 'yet-another-react-lightbox/styles.css';
import type { Metadata } from 'next';
import { Fira_Sans, Fira_Code, Playfair_Display } from 'next/font/google';
import { RootClientProviders } from '@/components/layout/RootClientProviders';

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
/** next/font требует литералы в `subsets`; выбор dev/prod — через два экземпляра (см. ниже). */
const firaSansLatin = Fira_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
});
const firaSansLatinCyrillic = Fira_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-body',
});
const firaSans =
  process.env.NODE_ENV === 'development' ? firaSansLatin : firaSansLatinCyrillic;

const firaCode = Fira_Code({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-code',
});

const playfairLatin = Playfair_Display({
  weight: ['600', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-logo',
});
const playfairLatinCyrillic = Playfair_Display({
  weight: ['600', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-logo',
});
const playfair =
  process.env.NODE_ENV === 'development' ? playfairLatin : playfairLatinCyrillic;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ru"
      suppressHydrationWarning
      className={`${firaSans.variable} ${firaCode.variable} ${playfair.variable}`}
    >
      <body className={firaSans.className}>
        {/* Dev: ранний reload при ChunkLoadError — клиентский чанк layout может не загрузиться до монтирования ChunkLoadRecovery. */}
        {process.env.NODE_ENV === 'development' ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `
(function(){
  var KEY='syntha-chunk-reload-ts';
  function reasonText(r){
    if(r==null)return'';
    if(typeof r==='string')return r;
    try{if(typeof r.message==='string')return r.message;}catch(x){}
    if(r&&r.name==='ChunkLoadError')return String(r.message||'');
    return '';
  }
  function hot(msg){return String(msg||'').indexOf('ChunkLoad')!==-1||String(msg||'').indexOf('Loading chunk')!==-1;}
  function once(){
    var n=Date.now(),p=0;try{p=Number(sessionStorage.getItem(KEY))||0;}catch(e){}
    if(p&&n-p<4000)return;
    try{sessionStorage.setItem(KEY,String(n));}catch(e){}
    location.reload();
  }
  window.addEventListener('unhandledrejection',function(e){
    var m=reasonText(e.reason);
    if(hot(m)){try{e.preventDefault();}catch(x){}once();}
  });
  window.addEventListener('error',function(e){var t=e.target;if(t&&t.tagName==='SCRIPT'&&t.src&&t.src.indexOf('/_next/static/chunks/')!==-1)once();},true);
})();`,
            }}
          />
        ) : null}
        <style
          dangerouslySetInnerHTML={{
            __html: `
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
        `,
          }}
        />
        <RootClientProviders>{children}</RootClientProviders>
      </body>
    </html>
  );
}
