
import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import ChartWidget from './widgets/ChartWidget';
import KPICardGrid from './widgets/KPICardGrid';
import ChartGrid from './widgets/ChartGrid';
import AIAnalysisSection from './AIAnalysisSection';
import CustomDashboard from './custom/CustomDashboard';
import DashboardSelector from './widgets/DashboardSelector';
import useCustomDashboards from '@/hooks/useCustomDashboards';
import { getDashboards } from '@/services/dashboardService';

const DashboardContent = ({ 
  activeTab, 
  setActiveTab, 
  kpiData,
  isAIConfigured,
  errorMessage,
  externalDashboardUrl,
  grafanaConfig
}) => {
  const { 
    dashboards, 
    selectedDashboardId, 
    setSelectedDashboardId,
    isLoading,
    refreshDashboards
  } = useCustomDashboards();

  // Log when we receive the props to ensure they're correctly passed
  useEffect(() => {
    console.log("DashboardContent received props:", { 
      externalDashboardUrl, 
      "firstChartTitle": kpiData?.charts?.[0]?.title,
      "chartsCount": kpiData?.charts?.length || 0,
      "hasGrafanaConfig": !!grafanaConfig
    });
  }, [kpiData, externalDashboardUrl, grafanaConfig]);

  useEffect(() => {
    if (activeTab === 2) { // personnalise tab index
      refreshDashboards();
    }
  }, [activeTab, refreshDashboards]);

  const handleDeleteDashboard = (id) => {
    refreshDashboards();
    if (dashboards.length > 0) {
      const availableDashboards = getDashboards();
      if (availableDashboards.length > 0) {
        setSelectedDashboardId(availableDashboards[0].id);
      }
    }
  };

  const getActiveIndex = () => {
    if (activeTab === 'principal') return 0;
    if (activeTab === 'analytique') return 1;
    if (activeTab === 'personnalise') return 2;
    if (activeTab === 'ia') return 3;
    return 0; // Default to principal tab
  };

  const handleTabChange = (e) => {
    const index = e.index;
    let tabName = 'principal';
    
    if (index === 1) tabName = 'analytique';
    else if (index === 2) tabName = 'personnalise';
    else if (index === 3) tabName = 'ia';
    
    setActiveTab(tabName);
  };

  return (
    <TabView activeIndex={getActiveIndex()} onTabChange={handleTabChange} className="dashboard-tabs">
      <TabPanel header="Principal">
        {kpiData && (
          <>
            <KPICardGrid cards={kpiData.kpiCards} />
            {/* Additional debugging for Grafana integration */}
            {externalDashboardUrl && (
              <div className="hidden">Grafana URL (debugging): {externalDashboardUrl}</div>
            )}
            <ChartGrid 
              charts={kpiData.charts} 
              externalDashboardUrl={externalDashboardUrl} 
              grafanaConfig={grafanaConfig}
            />
          </>
        )}
      </TabPanel>

      <TabPanel header="Analytique">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="p-card-header">
            <div className="p-card-title">Mouvements des stocks par semaine</div>
          </div>
          <div className="p-card-body">
            <ChartWidget
              title=""
              data={[
                { name: 'Semaine 1', 'Entrées': 1250, 'Sorties': 1180, 'Stock inactif': 320 },
                { name: 'Semaine 2', 'Entrées': 1350, 'Sorties': 1220, 'Stock inactif': 340 },
                { name: 'Semaine 3', 'Entrées': 1420, 'Sorties': 1350, 'Stock inactif': 310 },
                { name: 'Semaine 4', 'Entrées': 1380, 'Sorties': 1420, 'Stock inactif': 290 },
                { name: 'Semaine 5', 'Entrées': 1520, 'Sorties': 1380, 'Stock inactif': 275 },
                { name: 'Semaine 6', 'Entrées': 1450, 'Sorties': 1480, 'Stock inactif': 250 },
              ]}
              type="area"
              colors={['#4CAF50', '#F44336', '#FF9800']}
              height={400}
            />
          </div>
        </Card>
      </TabPanel>

      <TabPanel header="Personnalisé">
        <div className="flex justify-between items-center mb-4">
          {!isLoading && dashboards.length > 0 && (
            <DashboardSelector
              dashboards={dashboards}
              selectedId={selectedDashboardId}
              onSelect={setSelectedDashboardId}
            />
          )}
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p>Chargement des tableaux de bord...</p>
          </div>
        ) : (
          selectedDashboardId ? (
            <CustomDashboard 
              dashboardId={selectedDashboardId} 
              onDeleteDashboard={handleDeleteDashboard}
            />
          ) : (
            <Card>
              <div className="p-card-body py-8 text-center">
                <p>Aucun tableau de bord personnalisé disponible.</p>
              </div>
            </Card>
          )
        )}
      </TabPanel>

      <TabPanel header="IA & Prédictions">
        <AIAnalysisSection 
          isAIConfigured={isAIConfigured} 
          errorMessage={errorMessage} 
        />
      </TabPanel>
    </TabView>
  );
};

export default DashboardContent;
