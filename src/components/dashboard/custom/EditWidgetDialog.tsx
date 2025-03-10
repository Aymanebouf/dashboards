
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
        return <BarChart2 className="h-4 w-4 mr-2 text-emerald-500" />;
      case 'line':
        return <LineChart className="h-4 w-4 mr-2 text-violet-500" />;
      case 'area':
        return <Activity className="h-4 w-4 mr-2 text-blue-500" />;
      case 'pie':
        return <PieChart className="h-4 w-4 mr-2 text-amber-500" />;
      default:
        return <Settings className="h-4 w-4 mr-2 text-rose-500" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-2 border-slate-200/50 dark:border-slate-700/50 shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-slate-900 dark:text-white">
            <Settings className="h-5 w-5 mr-2 text-indigo-500" />
            Configuration du widget
            <Badge variant="outline" className="ml-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
              {widget.type === 'kpi' ? 'KPI' : 'Graphique'}
            </Badge>
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-slate-400">
            Personnalisez les propriétés de votre widget
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-700 dark:text-slate-300">Titre</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du widget"
              className="border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70 focus-visible:ring-2 focus-visible:ring-indigo-500 dark:focus-visible:ring-indigo-400"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="width" className="text-slate-700 dark:text-slate-300">Largeur</Label>
              <Select 
                value={widgetWidth.toString()}
                onValueChange={(value) => setWidgetWidth(parseInt(value))}
              >
                <SelectTrigger id="width" className="border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70">
                  <SelectValue placeholder="Largeur" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700">
                  <SelectItem value="1">1 colonne</SelectItem>
                  <SelectItem value="2">2 colonnes</SelectItem>
                  <SelectItem value="3">3 colonnes</SelectItem>
                  <SelectItem value="4">4 colonnes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="height" className="text-slate-700 dark:text-slate-300">Hauteur</Label>
              <Select 
                value={widgetHeight.toString()}
                onValueChange={(value) => setWidgetHeight(parseInt(value))}
              >
                <SelectTrigger id="height" className="border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70">
                  <SelectValue placeholder="Hauteur" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700">
                  <SelectItem value="1">1 ligne</SelectItem>
                  <SelectItem value="2">2 lignes</SelectItem>
                  <SelectItem value="3">3 lignes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {widget.type === 'kpi' && (
            <div className="space-y-4 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="space-y-2">
                <Label htmlFor="kpi-value" className="text-slate-700 dark:text-slate-300">Valeur</Label>
                <Input
                  id="kpi-value"
                  value={kpiValue}
                  onChange={(e) => setKpiValue(e.target.value)}
                  placeholder="ex: 1245"
                  className="border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kpi-trend" className="text-slate-700 dark:text-slate-300">Tendance</Label>
                <Input
                  id="kpi-trend"
                  value={kpiTrend}
                  onChange={(e) => setKpiTrend(e.target.value)}
                  placeholder="ex: +12%"
                  className="border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Utilisez + ou - pour indiquer la tendance (ex: +15%, -3.5%)
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="kpi-description" className="text-slate-700 dark:text-slate-300">Description</Label>
                <Input
                  id="kpi-description"
                  value={kpiDescription}
                  onChange={(e) => setKpiDescription(e.target.value)}
                  placeholder="ex: Ventes mensuelles"
                  className="border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70"
                />
              </div>
            </div>
          )}
          
          {widget.type === 'chart' && (
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <Label htmlFor="chart-type" className="text-slate-700 dark:text-slate-300">Type de graphique</Label>
              <Select 
                value={chartType}
                onValueChange={(value) => setChartType(value as ChartType)}
              >
                <SelectTrigger id="chart-type" className="w-full border-slate-300 dark:border-slate-700 bg-white/70 dark:bg-slate-800/70">
                  <SelectValue placeholder="Type de graphique" />
                </SelectTrigger>
                <SelectContent className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700">
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
          <Button variant="outline" onClick={onClose} className="border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800">
            Annuler
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white shadow-md">
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditWidgetDialog;
