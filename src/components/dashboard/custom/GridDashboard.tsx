
import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import ChartWidget from '../widgets/ChartWidget';
import { WidgetConfig, DashboardConfig, getDashboard, saveDashboard } from '@/services/dashboardService';

// Ajouter le WidthProvider qui mesurera la largeur du conteneur
const ResponsiveGridLayout = WidthProvider(Responsive);

interface GridDashboardProps {
  dashboardId: string;
}

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
}

const GridDashboard: React.FC<GridDashboardProps> = ({ dashboardId }) => {
  const [dashboard, setDashboard] = useState<DashboardConfig | null>(null);
  const [layouts, setLayouts] = useState<{ lg: LayoutItem[] }>({ lg: [] });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadedDashboard = getDashboard(dashboardId);
    if (loadedDashboard) {
      setDashboard(loadedDashboard);
      
      // Convertir les widgets en layout pour react-grid-layout
      const lgLayout = loadedDashboard.widgets.map((widget, index) => ({
        i: widget.id,
        x: widget.position[0] || 0,
        y: widget.position[1] || index,
        w: widget.size[0] || 1,
        h: widget.size[1] || 1,
        minW: 1,
        minH: 1
      }));
      
      setLayouts({ lg: lgLayout });
    }
  }, [dashboardId]);

  const handleLayoutChange = (currentLayout: LayoutItem[], allLayouts: any) => {
    if (!dashboard) return;
    
    // Mettre à jour le layout
    setLayouts({ ...allLayouts });
    
    // Mettre à jour les positions et tailles des widgets dans le dashboard
    const updatedWidgets = dashboard.widgets.map(widget => {
      const layoutItem = currentLayout.find(item => item.i === widget.id);
      if (layoutItem) {
        return {
          ...widget,
          position: [layoutItem.x, layoutItem.y],
          size: [layoutItem.w, layoutItem.h]
        };
      }
      return widget;
    });
    
    const updatedDashboard = {
      ...dashboard,
      widgets: updatedWidgets
    };
    
    setDashboard(updatedDashboard);
    
    // Ne pas sauvegarder pendant le drag pour des raisons de performance
    // On sauvegarde uniquement à la fin de l'édition
  };

  const handleToggleEdit = () => {
    if (isEditing && dashboard) {
      // Sauvegarder le dashboard en fin d'édition
      saveDashboard(dashboard);
      toast.success('Tableau de bord mis à jour');
    }
    setIsEditing(!isEditing);
  };

  const renderWidget = (widget: WidgetConfig) => {
    if (widget.type === 'kpi') {
      return (
        <div className="h-full flex flex-col justify-center p-4">
          <h3 className="text-sm font-medium mb-2">{widget.title}</h3>
          <div className="text-2xl font-bold">{widget.config.value}</div>
          {widget.config.trend && (
            <p className="text-xs text-muted-foreground">
              {widget.config.trend.startsWith('+') ? (
                <span className="text-green-500">{widget.config.trend}</span>
              ) : (
                <span className="text-red-500">{widget.config.trend}</span>
              )} par rapport au mois dernier
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {widget.config.description}
          </p>
        </div>
      );
    } else if (widget.type === 'chart') {
      return (
        <div className="h-full p-2">
          <h3 className="text-sm font-medium mb-2">{widget.title}</h3>
          <ChartWidget
            title=""
            data={widget.config.data}
            type={widget.config.type}
            colors={widget.config.colors}
            height={200}
            showControls={false}
          />
        </div>
      );
    }
    return null;
  };

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Chargement du tableau de bord...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{dashboard.name}</h2>
        
        <div className="flex space-x-2">
          <Button
            variant={isEditing ? "default" : "outline"}
            size="sm"
            onClick={handleToggleEdit}
          >
            {isEditing ? (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </>
            )}
          </Button>
        </div>
      </div>
      
      <div className="grid-dashboard-container">
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 4, md: 4, sm: 2, xs: 1, xxs: 1 }}
          rowHeight={100}
          isDraggable={isEditing}
          isResizable={isEditing}
          onLayoutChange={handleLayoutChange}
          margin={[16, 16]}
        >
          {dashboard.widgets.map((widget) => (
            <div key={widget.id} className="grid-item">
              <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-300">
                {renderWidget(widget)}
              </Card>
            </div>
          ))}
        </ResponsiveGridLayout>
      </div>
      
      {dashboard.widgets.length === 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center">Tableau de bord vide</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Commencez à ajouter des widgets à votre tableau de bord
            </p>
            <Button onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Commencer l'édition
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GridDashboard;
