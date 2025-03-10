
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, PieChart, LineChart, Activity, Award, TrendingUp, PanelTop } from 'lucide-react';
import { WidgetType } from '@/models/dashboard';
import { cn } from '@/lib/utils';

interface WidgetPickerProps {
  onAddWidget: (type: WidgetType) => void;
}

const WidgetPicker: React.FC<WidgetPickerProps> = ({ onAddWidget }) => {
  // Widget type definitions with descriptions and icons
  const widgetTypes = [
    {
      type: 'kpi' as WidgetType,
      label: 'KPI',
      description: 'Indicateur de performance',
      icon: <Award className="h-5 w-5" />,
      colorClass: 'from-blue-500 to-purple-600',
      bgClass: 'bg-blue-500/10',
      hoverClass: 'hover:bg-blue-500/20',
      borderClass: 'border-blue-500/30'
    },
    {
      type: 'chart' as WidgetType,
      label: 'Graphique à barres',
      description: 'Visualisation de données par catégories',
      icon: <BarChart3 className="h-5 w-5" />,
      colorClass: 'from-green-500 to-emerald-600',
      bgClass: 'bg-green-500/10',
      hoverClass: 'hover:bg-green-500/20',
      borderClass: 'border-green-500/30'
    },
    {
      type: 'chart' as WidgetType,
      label: 'Graphique linéaire',
      description: 'Tendance sur une période',
      icon: <LineChart className="h-5 w-5" />,
      colorClass: 'from-purple-500 to-pink-600',
      bgClass: 'bg-purple-500/10',
      hoverClass: 'hover:bg-purple-500/20',
      borderClass: 'border-purple-500/30',
      chartType: 'line'
    },
    {
      type: 'chart' as WidgetType,
      label: 'Graphique circulaire',
      description: 'Distribution en pourcentage',
      icon: <PieChart className="h-5 w-5" />,
      colorClass: 'from-orange-500 to-red-600',
      bgClass: 'bg-orange-500/10',
      hoverClass: 'hover:bg-orange-500/20',
      borderClass: 'border-orange-500/30',
      chartType: 'pie'
    },
    {
      type: 'chart' as WidgetType,
      label: 'Graphique zone',
      description: 'Volume sur une période',
      icon: <Activity className="h-5 w-5" />,
      colorClass: 'from-cyan-500 to-blue-600',
      bgClass: 'bg-cyan-500/10',
      hoverClass: 'hover:bg-cyan-500/20',
      borderClass: 'border-cyan-500/30',
      chartType: 'area'
    },
    {
      type: 'chart' as WidgetType,
      label: 'Graphique composé',
      description: 'Combinaison de styles',
      icon: <PanelTop className="h-5 w-5" />,
      colorClass: 'from-indigo-500 to-violet-600',
      bgClass: 'bg-indigo-500/10',
      hoverClass: 'hover:bg-indigo-500/20',
      borderClass: 'border-indigo-500/30',
      chartType: 'composed'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
      {widgetTypes.map((widget, index) => (
        <div 
          key={index}
          className={cn(
            "rounded-lg border transition-all duration-300",
            "hover:shadow-md cursor-pointer",
            widget.borderClass
          )}
          onClick={() => onAddWidget(widget.type === 'chart' ? 'chart' : widget.type)}
        >
          <div className={cn(
            "flex flex-col items-center p-4 h-full rounded-lg text-center",
            widget.hoverClass,
            "transition-colors duration-300",
            widget.bgClass
          )}>
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-3",
              "bg-gradient-to-br text-white shadow-sm",
              widget.colorClass
            )}>
              {widget.icon}
            </div>
            <h4 className="font-medium text-sm mb-1">{widget.label}</h4>
            <p className="text-xs text-muted-foreground">{widget.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WidgetPicker;
