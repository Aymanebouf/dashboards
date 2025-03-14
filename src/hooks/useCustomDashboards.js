
import { useState, useEffect, useCallback } from 'react';
import { getDashboards } from '@/services/dashboardService';

const useCustomDashboards = () => {
  const [dashboards, setDashboards] = useState([]);
  const [selectedDashboardId, setSelectedDashboardId] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboards on component mount
  useEffect(() => {
    loadDashboards();
  }, []);

  const loadDashboards = useCallback(() => {
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
  }, [selectedDashboardId]);

  const refreshDashboards = useCallback(() => {
    loadDashboards();
  }, [loadDashboards]);

  return {
    dashboards,
    selectedDashboardId,
    setSelectedDashboardId,
    isLoading,
    refreshDashboards
  };
};

export default useCustomDashboards;
