
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
    externalDashboardUrl
  } = useDashboardController();

  // Log the dashboard setup for debugging
  useEffect(() => {
    console.log("Dashboard set up with:", {
      selectedDashboard,
      externalDashboardUrl,
      hasKpiData: !!kpiData
    });
  }, [selectedDashboard, externalDashboardUrl, kpiData]);

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
        />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
