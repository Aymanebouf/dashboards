
import React, { useEffect, useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { WidgetConfig } from '@/services/dashboardService';
import { Badge } from '@/components/ui/badge';
import { ChartType } from '@/models/chart';
import { Settings, PieChart, BarChart2, LineChart, Activity } from 'lucide-react';

interface EditWidgetDialogProps {
  widget: WidgetConfig | null;
  open: boolean;
  onClose: () => void;
  onSave: (widget: WidgetConfig) => void;
}

const EditWidgetDialog: React.FC<EditWidgetDialogProps> = ({
  widget,
  open,
  onClose,
  onSave
}) => {
  const [title, setTitle] = useState('');
  const [kpiValue, setKpiValue] = useState('');
  const [kpiTrend, setKpiTrend] = useState('');
  const [kpiDescription, setKpiDescription] = useState('');
  const [chartType, setChartType] = useState<ChartType>('bar');
  const [widgetWidth, setWidgetWidth] = useState(1);
  const [widgetHeight, setWidgetHeight] = useState(1);

  useEffect(() => {
    if (widget) {
      setTitle(widget.title);
      setWidgetWidth(widget.size[0]);
      setWidgetHeight(widget.size[1]);
      
      if (widget.type === 'kpi' && widget.config) {
        setKpiValue(widget.config.value?.toString() || '');
        setKpiTrend(widget.config.trend || '');
        setKpiDescription(widget.config.description || '');
      } else if (widget.type === 'chart' && widget.config) {
        setChartType(widget.config.type || 'bar');
      }
    }
  }, [widget]);

  if (!widget) return null;

  const handleSave = () => {
    if (!widget) return;
    
    const updatedWidget: WidgetConfig = {
      ...widget,
      title,
      size: [widgetWidth, widgetHeight],
      config: widget.type === 'kpi' 
        ? { 
            value: kpiValue, 
            trend: kpiTrend, 
            description: kpiDescription 
          }
        : { 
            ...widget.config,
            type: chartType
          }
    };
    
    onSave(updatedWidget);
  };

  const getChartTypeIcon = (type: ChartType) => {
    switch (type) {
      case 'bar':
        return <BarChart2 className="h-4 w-4 mr-2" />;
      case 'line':
        return <LineChart className="h-4 w-4 mr-2" />;
      case 'area':
        return <Activity className="h-4 w-4 mr-2" />;
      case 'pie':
        return <PieChart className="h-4 w-4 mr-2" />;
      default:
        return <Settings className="h-4 w-4 mr-2" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Settings className="h-5 w-5 mr-2 text-primary" />
            Configuration du widget
            <Badge variant="outline" className="ml-2 bg-background">
              {widget.type === 'kpi' ? 'KPI' : 'Graphique'}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Personnalisez les propriétés de votre widget
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du widget"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="width">Largeur</Label>
              <Select 
                value={widgetWidth.toString()}
                onValueChange={(value) => setWidgetWidth(parseInt(value))}
              >
                <SelectTrigger id="width">
                  <SelectValue placeholder="Largeur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 colonne</SelectItem>
                  <SelectItem value="2">2 colonnes</SelectItem>
                  <SelectItem value="3">3 colonnes</SelectItem>
                  <SelectItem value="4">4 colonnes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height">Hauteur</Label>
              <Select 
                value={widgetHeight.toString()}
                onValueChange={(value) => setWidgetHeight(parseInt(value))}
              >
                <SelectTrigger id="height">
                  <SelectValue placeholder="Hauteur" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 ligne</SelectItem>
                  <SelectItem value="2">2 lignes</SelectItem>
                  <SelectItem value="3">3 lignes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {widget.type === 'kpi' && (
            <div className="space-y-3 pt-2">
              <div className="space-y-2">
                <Label htmlFor="kpi-value">Valeur</Label>
                <Input
                  id="kpi-value"
                  value={kpiValue}
                  onChange={(e) => setKpiValue(e.target.value)}
                  placeholder="ex: 1245"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kpi-trend">Tendance</Label>
                <Input
                  id="kpi-trend"
                  value={kpiTrend}
                  onChange={(e) => setKpiTrend(e.target.value)}
                  placeholder="ex: +12%"
                />
                <p className="text-xs text-muted-foreground">
                  Utilisez + ou - pour indiquer la tendance (ex: +15%, -3.5%)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kpi-description">Description</Label>
                <Input
                  id="kpi-description"
                  value={kpiDescription}
                  onChange={(e) => setKpiDescription(e.target.value)}
                  placeholder="ex: Ventes mensuelles"
                />
              </div>
            </div>
          )}
          
          {widget.type === 'chart' && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="chart-type">Type de graphique</Label>
              <Select 
                value={chartType}
                onValueChange={(value) => setChartType(value as ChartType)}
              >
                <SelectTrigger id="chart-type" className="w-full">
                  <SelectValue placeholder="Type de graphique" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar" className="flex items-center">
                    {getChartTypeIcon('bar')}
                    <span>Graphique à barres</span>
                  </SelectItem>
                  <SelectItem value="line" className="flex items-center">
                    {getChartTypeIcon('line')}
                    <span>Graphique linéaire</span>
                  </SelectItem>
                  <SelectItem value="area" className="flex items-center">
                    {getChartTypeIcon('area')}
                    <span>Graphique de zone</span>
                  </SelectItem>
                  <SelectItem value="pie" className="flex items-center">
                    {getChartTypeIcon('pie')}
                    <span>Graphique circulaire</span>
                  </SelectItem>
                  <SelectItem value="composed" className="flex items-center">
                    {getChartTypeIcon('composed')}
                    <span>Graphique composé</span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
        
        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-sm">
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditWidgetDialog;
