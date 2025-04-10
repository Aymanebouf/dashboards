
import { useState, useEffect } from 'react';
import { checkAIConfiguration } from '@/services/aiService';
import { toast } from 'sonner';
import useDashboardData from '@/hooks/useDashboardData';

/**
 * Controller for main dashboard functionality
 * Manages dashboard state and data fetching
 */
export const useDashboardController = () => {
  const [activeTab, setActiveTab] = useState('principal');
  const [selectedDashboard, setSelectedDashboard] = useState('duree-presence');
  const [isAIConfigured, setIsAIConfigured] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  
  // External dashboard URL for Grafana integration
  const externalDashboardUrl = "https://c27c-41-250-193-127.ngrok-free.app/d-solo/deih76nv3i03ka/test?orgId=1&from=1744257925511&to=1744279525511&timezone=browser&panelId=1&__feature.dashboardSceneSolo";
  
  // Log the dashboard URL to verify it's correct
  useEffect(() => {
    console.log("Dashboard Controller initialized with URL:", externalDashboardUrl);
    // Force the dashboard to be "duree-presence" initially
    setSelectedDashboard('duree-presence');
  }, []);
  
  // Get dashboard data from custom hook
  const { dashboardTitle, kpiData } = useDashboardData(selectedDashboard);

  useEffect(() => {
    console.log("Dashboard data updated:", {
      dashboard: selectedDashboard,
      title: dashboardTitle,
      hasCharts: kpiData?.charts?.length > 0,
      firstChartTitle: kpiData?.charts?.[0]?.title
    });
  }, [selectedDashboard, dashboardTitle, kpiData]);

  // Check AI configuration on initialization
  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        const configured = await checkAIConfiguration();
        setIsAIConfigured(configured);
        if (!configured) {
          console.log('L\'IA n\'est pas configurée. Une clé API OpenAI est nécessaire.');
          toast.error('Veuillez configurer la clé API OpenAI pour utiliser les fonctionnalités d\'IA');
          setErrorMessage('La clé API OpenAI n\'est pas configurée. Veuillez vérifier le fichier api/.env');
        } else {
          console.log('L\'IA est correctement configurée');
          setErrorMessage(null);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'API OpenAI:", error);
        setIsAIConfigured(false);
        setErrorMessage('Impossible de se connecter à l\'API. Vérifiez que le serveur Flask est en cours d\'exécution.');
      }
    };
    
    checkConfiguration();
  }, []);

  /**
   * Handles dashboard selection change
   */
  const handleDashboardChange = (dashboardId) => {
    setSelectedDashboard(dashboardId);
  };

  return {
    activeTab,
    setActiveTab,
    selectedDashboard,
    setSelectedDashboard,
    isAIConfigured,
    errorMessage,
    dashboardTitle,
    kpiData,
    handleDashboardChange,
    externalDashboardUrl
  };
};
