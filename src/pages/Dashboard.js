
import React from 'react';
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
    handleDashboardChange
  } = useDashboardController();

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
