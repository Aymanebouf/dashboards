
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ChartWidget from './widgets/ChartWidget';
import KPICardGrid from './widgets/KPICardGrid';
import ChartGrid from './widgets/ChartGrid';
import AIAnalysisSection from './AIAnalysisSection';

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
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader>
            <CardTitle>Performance des sites</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartWidget
              title=""
              data={[
                { name: 'Site A', value: 4000 },
                { name: 'Site B', value: 3000 },
                { name: 'Site C', value: 2000 },
                { name: 'Site D', value: 2780 },
                { name: 'Site E', value: 1890 },
                { name: 'Site F', value: 2390 },
                { name: 'Site G', value: 3490 },
              ]}
              type="bar"
              colors={['#8884d8']}
              height={400}
            />
          </CardContent>
        </Card>
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
