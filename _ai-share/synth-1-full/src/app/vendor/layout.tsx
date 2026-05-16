import React from 'react';
import Link from 'next/link';
import { Factory, FileText, LayoutDashboard, Settings } from 'lucide-react';

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-bg-canvas">
      {/* Sidebar */}
      <aside className="w-64 bg-bg-surface border-r border-border-default flex flex-col">
        <div className="p-4 border-b border-border-default flex items-center gap-2 text-accent-primary">
          <Factory className="w-6 h-6" />
          <span className="font-bold text-lg text-text-primary">Vendor Portal</span>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/vendor" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-text-primary bg-bg-surface2 hover:bg-bg-surface2/80">
            <LayoutDashboard className="w-4 h-4 text-text-muted" />
            Dashboard
          </Link>
          <Link href="/vendor" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-surface2/50">
            <FileText className="w-4 h-4 text-text-muted" />
            Tech Packs
          </Link>
          <Link href="/vendor" className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-surface2/50">
            <Settings className="w-4 h-4 text-text-muted" />
            Settings
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 border-b border-border-default bg-bg-surface flex items-center px-6 justify-between shrink-0">
          <h1 className="font-semibold text-text-primary text-sm">Factory Workspace</h1>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent-soft flex items-center justify-center text-accent-primary text-xs font-bold">
              F1
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
