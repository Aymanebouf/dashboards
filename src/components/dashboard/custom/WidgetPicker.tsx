
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
      icon: <Award className="h-6 w-6" />,
      colorClass: 'from-indigo-600 to-purple-700',
      bgClass: 'bg-slate-900/5 dark:bg-slate-800/20',
      hoverClass: 'hover:bg-slate-900/10 dark:hover:bg-slate-800/30',
      borderClass: 'border-indigo-500/20 dark:border-indigo-400/30'
    },
    {
      type: 'chart' as WidgetType,
      label: 'Graphique à barres',
      description: 'Visualisation par catégories',
      icon: <BarChart3 className="h-6 w-6" />,
      colorClass: 'from-emerald-600 to-teal-700',
      bgClass: 'bg-slate-900/5 dark:bg-slate-800/20',
      hoverClass: 'hover:bg-slate-900/10 dark:hover:bg-slate-800/30',
      borderClass: 'border-emerald-500/20 dark:border-emerald-400/30'
    },
    {
      type: 'chart' as WidgetType,
      label: 'Graphique linéaire',
      description: 'Tendance sur une période',
      icon: <LineChart className="h-6 w-6" />,
      colorClass: 'from-violet-600 to-fuchsia-700',
      bgClass: 'bg-slate-900/5 dark:bg-slate-800/20',
      hoverClass: 'hover:bg-slate-900/10 dark:hover:bg-slate-800/30',
      borderClass: 'border-violet-500/20 dark:border-violet-400/30',
      chartType: 'line'
    },
    {
      type: 'chart' as WidgetType,
      label: 'Graphique circulaire',
      description: 'Distribution en pourcentage',
      icon: <PieChart className="h-6 w-6" />,
      colorClass: 'from-amber-500 to-orange-700',
      bgClass: 'bg-slate-900/5 dark:bg-slate-800/20',
      hoverClass: 'hover:bg-slate-900/10 dark:hover:bg-slate-800/30',
      borderClass: 'border-amber-500/20 dark:border-amber-400/30',
      chartType: 'pie'
    },
    {
      type: 'chart' as WidgetType,
      label: 'Graphique zone',
      description: 'Volume sur une période',
      icon: <Activity className="h-6 w-6" />,
      colorClass: 'from-sky-600 to-blue-700',
      bgClass: 'bg-slate-900/5 dark:bg-slate-800/20',
      hoverClass: 'hover:bg-slate-900/10 dark:hover:bg-slate-800/30',
      borderClass: 'border-sky-500/20 dark:border-sky-400/30',
      chartType: 'area'
    },
    {
      type: 'chart' as WidgetType,
      label: 'Graphique composé',
      description: 'Combinaison de styles',
      icon: <PanelTop className="h-6 w-6" />,
      colorClass: 'from-rose-600 to-pink-700',
      bgClass: 'bg-slate-900/5 dark:bg-slate-800/20',
      hoverClass: 'hover:bg-slate-900/10 dark:hover:bg-slate-800/30',
      borderClass: 'border-rose-500/20 dark:border-rose-400/30',
      chartType: 'composed'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {widgetTypes.map((widget, index) => (
        <div 
          key={index}
          className={cn(
            "rounded-xl border-2 shadow-lg transition-all duration-300 transform",
            "hover:shadow-xl hover:scale-105 cursor-pointer overflow-hidden backdrop-blur-sm",
            widget.borderClass
          )}
          onClick={() => onAddWidget(widget.type === 'chart' ? 'chart' : widget.type)}
        >
          <div className={cn(
            "flex flex-col items-center p-5 h-full rounded-lg text-center",
            widget.hoverClass,
            "transition-colors duration-300 ease-in-out",
            widget.bgClass
          )}>
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-4",
              "bg-gradient-to-br text-white shadow-lg ring-2 ring-white/10",
              widget.colorClass
            )}>
              {widget.icon}
            </div>
            <h4 className="font-semibold text-base mb-2">{widget.label}</h4>
            <p className="text-sm text-muted-foreground">{widget.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WidgetPicker;
