
import React from 'react';
import { Button } from '@/components/ui/button';
import DashboardSelector from './widgets/DashboardSelector';

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
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
      <div className="flex items-center space-x-3">
        <DashboardSelector 
          selectedDashboard={selectedDashboard} 
          onDashboardChange={onDashboardChange} 
        />
        
        <Button variant="outline" size="sm">
          Exporter
        </Button>
        <Button variant="outline" size="sm">
          Imprimer
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
