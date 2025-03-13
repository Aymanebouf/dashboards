
import React, { useState, useEffect } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import ChartWidget from './widgets/ChartWidget';
import KPICardGrid from './widgets/KPICardGrid';
import ChartGrid from './widgets/ChartGrid';
import AIAnalysisSection from './AIAnalysisSection';
import CustomDashboard from './custom/CustomDashboard';
import DashboardSelector from './custom/DashboardSelector';
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
    if (activeTab === 'personnalise') {
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
    <TabView activeIndex={activeTab === 'principal' ? 0 : activeTab === 'analytique' ? 1 : activeTab === 'personnalise' ? 2 : 3}
             onTabChange={(e) => {
               const tabNames = ['principal', 'analytique', 'personnalise', 'ia-predictions'];
               setActiveTab(tabNames[e.index]);
             }} 
             className="mb-4">
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
          <div className="p-card-title">Activité des engins</div>
          <div className="p-card-content">
            <ChartWidget
              title=""
              data={[
                { name: 'Jan', 'En activité': 45, 'En pause': 25, 'En maintenance': 15 },
                { name: 'Fév', 'En activité': 50, 'En pause': 20, 'En maintenance': 12 },
                { name: 'Mar', 'En activité': 55, 'En pause': 22, 'En maintenance': 10 },
                { name: 'Avr', 'En activité': 60, 'En pause': 18, 'En maintenance': 8 },
                { name: 'Mai', 'En activité': 65, 'En pause': 15, 'En maintenance': 7 },
                { name: 'Juin', 'En activité': 70, 'En pause': 10, 'En maintenance': 6 },
              ]}
              type="area"
              colors={['#4CAF50', '#FFC107', '#F44336']}
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
              <div className="p-card-content py-8 text-center">
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
