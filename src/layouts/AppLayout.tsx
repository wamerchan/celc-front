import React from 'react';
import { Sidebar } from '../shared/components/layout/Sidebar';
import { Header } from '../shared/components/layout/Header';
import { useUIStore } from '../store/useUIStore';

interface AppLayoutProps {
  children: React.ReactNode;
}

function AppLayout({ children }: AppLayoutProps) {
  const { sidebarOpen, toggleSidebar } = useUIStore();

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] transition-colors duration-300">
      <Sidebar />

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-20 bg-slate-950/60 backdrop-blur-sm animate-fade-in"
          onClick={() => toggleSidebar(false)}
        />
      )}

      {/* Main */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-6 lg:p-8 animate-slide-up">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;