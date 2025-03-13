
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
  errorMessage
}) => {
  const { 
    dashboards, 
    selectedDashboardId, 
    setSelectedDashboardId,
    isLoading,
    refreshDashboards
  } = useCustomDashboards();

  // Rafraîchir les dashboards lorsqu'on accède à l'onglet personnalisé
  useEffect(() => {
    if (activeTab === 2) { // personnalise tab index
      refreshDashboards();
    }
  }, [activeTab, refreshDashboards]);

  const handleDeleteDashboard = (id) => {
    refreshDashboards();
    if (dashboards.length > 0) {
      // Sélectionner le premier tableau de bord disponible
      const availableDashboards = getDashboards();
      if (availableDashboards.length > 0) {
        setSelectedDashboardId(availableDashboards[0].id);
      }
    }
  };

  return (
    <TabView activeIndex={activeTab} onTabChange={(e) => setActiveTab(e.index)} className="dashboard-tabs">
      <TabPanel header="Principal">
        {kpiData && (
          <>
            <KPICardGrid cards={kpiData.kpiCards} />
            <ChartGrid charts={kpiData.charts} />
          </>
        )}
      </TabPanel>

      <TabPanel header="Analytique">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <Card.Header>
            <Card.Title>Mouvements des stocks par semaine</Card.Title>
          </Card.Header>
          <Card.Body>
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
          </Card.Body>
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
              <Card.Body className="py-8 text-center">
                <p>Aucun tableau de bord personnalisé disponible.</p>
              </Card.Body>
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
