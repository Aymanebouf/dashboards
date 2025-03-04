
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart2, Clock, Users, TruckIcon, Box, Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

interface DashboardOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface DashboardSelectorProps {
  selectedDashboard: string;
  onDashboardChange: (dashboardId: string) => void;
}

const DashboardSelector: React.FC<DashboardSelectorProps> = ({
  selectedDashboard,
  onDashboardChange
}) => {
  const dashboards: DashboardOption[] = [
    { id: 'duree-presence', label: 'Durée de présence des engins', icon: <Clock className="h-4 w-4" /> },
    { id: 'classement-clients', label: 'Classement des clients', icon: <Users className="h-4 w-4" /> },
    { id: 'utilisation-engins', label: 'Suivi de l\'utilisation des engins', icon: <TruckIcon className="h-4 w-4" /> },
    { id: 'analyse-stocks', label: 'Analyse des stocks et mouvements', icon: <Box className="h-4 w-4" /> },
    { id: 'frequence-visite', label: 'Fréquence de visite chez un client', icon: <Calendar className="h-4 w-4" /> }
  ];

  const handleDashboardChange = (dashboardId: string) => {
    onDashboardChange(dashboardId);
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      toast.success(`Tableau de bord "${dashboard.label}" chargé`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <BarChart2 className="h-4 w-4" />
          <span>Tableaux de bord</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel>Sélectionner un tableau de bord</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {dashboards.map((dashboard) => (
          <DropdownMenuItem 
            key={dashboard.id}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => handleDashboardChange(dashboard.id)}
          >
            {dashboard.icon}
            <span>{dashboard.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DashboardSelector;
