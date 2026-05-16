import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Мобильный терминал ОТК',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0',
};

export default function QcTerminalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50 min-h-screen text-slate-900 font-sans selection:bg-accent-primary/20">
      {children}
    </div>
  );
}
