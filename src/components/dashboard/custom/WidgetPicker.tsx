
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { getAvailableWidgetData } from '@/services/dashboardService';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface WidgetPickerProps {
  onAddWidget: (widgetType: 'kpi' | 'chart', sourceId: string) => void;
}

const WidgetPicker: React.FC<WidgetPickerProps> = ({ onAddWidget }) => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'kpi' | 'chart'>('kpi');
  
  const availableData = getAvailableWidgetData();
  
  const handleAddWidget = (widgetType: 'kpi' | 'chart', sourceId: string) => {
    onAddWidget(widgetType, sourceId);
    setOpen(false);
    toast.success(`Widget ajouté au tableau de bord`);
  };

  const getTrendVariant = (trend: string) => {
    if (trend.startsWith('+')) return 'success';
    if (trend.startsWith('-')) return 'destructive';
    return 'outline';
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Plus size={16} />
          <span>Ajouter un widget</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un widget</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'kpi' | 'chart')} className="mt-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="kpi">Indicateurs clés</TabsTrigger>
            <TabsTrigger value="chart">Graphiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="kpi" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableData.kpi.map((kpi) => (
                <Card key={kpi.id} className="cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => handleAddWidget('kpi', kpi.id)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex justify-between">
                      {kpi.title}
                      <Badge variant={getTrendVariant(kpi.trend)} className="ml-2">{kpi.trend}</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{kpi.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{kpi.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="chart" className="mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableData.charts.map((chart) => (
                <Card key={chart.id} className="cursor-pointer hover:bg-accent/20 transition-colors" onClick={() => handleAddWidget('chart', chart.id)}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">{chart.title}</CardTitle>
                    <CardDescription className="text-xs">Type: {chart.type}</CardDescription>
                  </CardHeader>
                  <CardContent className="h-28 overflow-hidden">
                    {/* Aperçu du graphique ici */}
                    <div className="w-full h-full bg-accent/10 rounded-md flex items-center justify-center text-muted-foreground">
                      {chart.type === 'pie' ? 'Graphique en secteurs' : 
                       chart.type === 'bar' ? 'Graphique en barres' : 
                       chart.type === 'line' ? 'Graphique en lignes' : 
                       'Aperçu graphique'}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default WidgetPicker;
