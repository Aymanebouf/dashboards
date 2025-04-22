
import React, { useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardContent from '@/components/dashboard/DashboardContent';
import { useDashboardController } from '@/controllers/DashboardController';

/**
 * Main Dashboard page component
 */
const Dashboard = () => {
  // Using the controller to handle business logic and state
  const {
    activeTab,
    setActiveTab,
    selectedDashboard,
    isAIConfigured,
    errorMessage,
    dashboardTitle,
    kpiData,
    handleDashboardChange,
    externalDashboardUrl,
    grafanaConfig
  } = useDashboardController();

  // Log the dashboard setup for debugging
  useEffect(() => {
    console.log("Dashboard page loaded with:", {
      selectedDashboard,
      externalDashboardUrl,
      hasKpiData: !!kpiData,
      chartsCount: kpiData?.charts?.length || 0,
      hasGrafanaConfig: !!grafanaConfig
    });
  }, [selectedDashboard, externalDashboardUrl, kpiData, grafanaConfig]);

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
          externalDashboardUrl={externalDashboardUrl}
          grafanaConfig={grafanaConfig}
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
