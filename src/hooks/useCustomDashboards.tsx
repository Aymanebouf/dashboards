
import { useState, useEffect } from 'react';
import { getDashboards, DashboardConfig } from '@/services/dashboardService';

const useCustomDashboards = () => {
  const [dashboards, setDashboards] = useState<DashboardConfig[]>([]);
  const [selectedDashboardId, setSelectedDashboardId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboards = () => {
      setIsLoading(true);
      try {
        const availableDashboards = getDashboards();
        setDashboards(availableDashboards);
        
        // Sélectionner le premier tableau de bord par défaut
        if (availableDashboards.length > 0 && !selectedDashboardId) {
          setSelectedDashboardId(availableDashboards[0].id);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des tableaux de bord:', error);
        setIsLoading(false);
      }
    };
    
    loadDashboards();
  }, []);

  const refreshDashboards = () => {
    const refreshedDashboards = getDashboards();
    setDashboards(refreshedDashboards);
  };

  return {
    dashboards,
    selectedDashboardId,
    setSelectedDashboardId,
    isLoading,
    refreshDashboards
  };
};

export default useCustomDashboards;
