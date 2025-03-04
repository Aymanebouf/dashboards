
import React from 'react';
import { Button } from '@/components/ui/button';
import DashboardSelector from './widgets/DashboardSelector';
import { Download, Printer } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  selectedDashboard: string;
  onDashboardChange: (dashboardId: string) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ 
  title, 
  selectedDashboard, 
  onDashboardChange 
}) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border/40">
      <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-logitag-primary to-logitag-secondary bg-clip-text text-transparent">{title}</h1>
      <div className="flex flex-wrap items-center gap-3">
        <DashboardSelector 
          selectedDashboard={selectedDashboard} 
          onDashboardChange={onDashboardChange} 
        />
        
        <Button variant="outline" size="sm" className="gap-2 text-logitag-primary hover:text-white hover:bg-logitag-primary transition-colors">
          <Download size={16} />
          <span className="hidden sm:inline">Exporter</span>
        </Button>
        <Button variant="outline" size="sm" className="gap-2 text-logitag-primary hover:text-white hover:bg-logitag-primary transition-colors">
          <Printer size={16} />
          <span className="hidden sm:inline">Imprimer</span>
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
