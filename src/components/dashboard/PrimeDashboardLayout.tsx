
import React, { useState } from 'react';
import PrimeSidebar from './PrimeSidebar';
import PrimeHeader from './PrimeHeader';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
}

const PrimeDashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children,
  title = 'Dashboard'
}) => {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setSidebarExpanded(!sidebarExpanded);
  };

  return (
    <div className="min-h-screen bg-surface">
      <PrimeSidebar expanded={sidebarExpanded} onToggle={toggleSidebar} />
      
      <PrimeHeader 
        sidebarExpanded={sidebarExpanded} 
        onSidebarToggle={toggleSidebar}
        title={title}
      />
      
      <main className={`pt-6 min-h-screen transition-all ${sidebarExpanded ? "ml-17rem" : "ml-4rem"}`}>
        <div className="p-4">
          {children}
        </div>
      </main>
    </div>
  );
};

export default PrimeDashboardLayout;
