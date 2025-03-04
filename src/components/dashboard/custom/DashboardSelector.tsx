
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardConfig } from '@/services/dashboardService';

interface DashboardSelectorProps {
  dashboards: DashboardConfig[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const DashboardSelector: React.FC<DashboardSelectorProps> = ({
  dashboards,
  selectedId,
  onSelect
}) => {
  if (dashboards.length === 0) {
    return null;
  }

  return (
    <Select value={selectedId} onValueChange={onSelect}>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Sélectionner un tableau de bord" />
      </SelectTrigger>
      <SelectContent>
        {dashboards.map((dashboard) => (
          <SelectItem key={dashboard.id} value={dashboard.id}>
            {dashboard.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DashboardSelector;
