
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChartWidget from './widgets/ChartWidget';
import KPICardGrid from './widgets/KPICardGrid';
import ChartGrid from './widgets/ChartGrid';
import AIAnalysisSection from './AIAnalysisSection';
import CustomDashboard from './custom/CustomDashboard';
import DashboardSelector from './custom/DashboardSelector';
import useCustomDashboards from '@/hooks/useCustomDashboards';

interface DashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  kpiData: any;
  isAIConfigured: boolean | null;
  errorMessage: string | null;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
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
    isLoading
  } = useCustomDashboards();

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="bg-muted/60">
        <TabsTrigger value="principal">Principal</TabsTrigger>
        <TabsTrigger value="analytique">Analytique</TabsTrigger>
        <TabsTrigger value="personnalise">Personnalisé</TabsTrigger>
        <TabsTrigger value="ia-predictions">IA & Prédictions</TabsTrigger>
      </TabsList>

      <TabsContent value="principal" className="space-y-4">
        {kpiData && (
          <>
            <KPICardGrid cards={kpiData.kpiCards} />
            <ChartGrid charts={kpiData.charts} />
          </>
        )}
      </TabsContent>

      <TabsContent value="analytique" className="space-y-4">
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Activité des engins</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="personnalise" className="space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Tableau de bord personnalisé</h2>
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
            <CustomDashboard dashboardId={selectedDashboardId} />
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p>Aucun tableau de bord personnalisé disponible.</p>
              </CardContent>
            </Card>
          )
        )}
      </TabsContent>

      <TabsContent value="ia-predictions" className="space-y-4">
        <AIAnalysisSection 
          isAIConfigured={isAIConfigured} 
          errorMessage={errorMessage} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardContent;
