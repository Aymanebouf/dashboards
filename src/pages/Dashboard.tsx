
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { checkAIConfiguration } from '@/services/aiService';
import { toast } from 'sonner';
import useDashboardData from '@/hooks/useDashboardData';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('principal');
  const [selectedDashboard, setSelectedDashboard] = useState('duree-presence');
  const [isAIConfigured, setIsAIConfigured] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const { dashboardTitle, kpiData } = useDashboardData(selectedDashboard);

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

  const handleDashboardChange = (dashboardId: string) => {
    setSelectedDashboard(dashboardId);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <DashboardHeader 
          title={dashboardTitle} 
          selectedDashboard={selectedDashboard}
          onDashboardChange={handleDashboardChange}
        />

        <DashboardContent 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          kpiData={kpiData}
          isAIConfigured={isAIConfigured}
          errorMessage={errorMessage}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
