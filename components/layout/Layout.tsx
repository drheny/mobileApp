import React from 'react';
import type { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-full">
      <Header />
      <main className="flex-grow px-4 pt-32 overflow-y-auto pb-32">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;