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
  
  // Configuration Grafana mise à jour avec les nouvelles valeurs
  const grafanaConfig = {
    baseUrl: "http://89.145.161.108:3000",
    dashboardId: "-t6si11Nz",
    apiKey: "glsa_t2jRY1cKy9IsB3nSuA2Mu6Tq5Ubp6WOB_12fa5e39",
    panelId: "1"
  };

  // URL du dashboard Grafana
  const externalDashboardUrl = `${grafanaConfig.baseUrl}/d/${grafanaConfig.dashboardId}?orgId=1&theme=light&kiosk`;

  // Log the dashboard URL for debugging
  useEffect(() => {
    console.log("Dashboard URL configured:", externalDashboardUrl);
    console.log("Grafana configuration:", { 
      baseUrl: grafanaConfig.baseUrl, 
      dashboardId: grafanaConfig.dashboardId,
      hasApiKey: !!grafanaConfig.apiKey
    });
    // Force the dashboard to be "duree-presence" initially
    setSelectedDashboard('duree-presence');
  }, []);

  // Get dashboard data from custom hook
  const { dashboardTitle, kpiData } = useDashboardData(selectedDashboard);

  // Log when the dashboard data is received
  useEffect(() => {
    console.log("Dashboard data updated:", {
      dashboard: selectedDashboard,
      title: dashboardTitle,
      hasCharts: kpiData?.charts?.length > 0,
      chartCount: kpiData?.charts?.length || 0,
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
    externalDashboardUrl,
    grafanaConfig
  };
};
