
import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Edit, Save, Plus, Trash } from 'lucide-react';
import DraggableWidget from './DraggableWidget';
import WidgetPicker from './WidgetPicker';
import EditWidgetDialog from './EditWidgetDialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WidgetConfig, DashboardConfig, getDashboard, saveDashboard, getAvailableWidgetData, deleteDashboard } from '@/services/dashboardService';

interface CustomDashboardProps {
  dashboardId: string;
  onDeleteDashboard?: (id: string) => void;
}

const CustomDashboard: React.FC<CustomDashboardProps> = ({ dashboardId, onDeleteDashboard }) => {
  const [dashboard, setDashboard] = useState<DashboardConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [editingWidget, setEditingWidget] = useState<WidgetConfig | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isNewDashboardDialogOpen, setIsNewDashboardDialogOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');

  useEffect(() => {
    const loadedDashboard = getDashboard(dashboardId);
    if (loadedDashboard) {
      setDashboard(loadedDashboard);
      setNewTitle(loadedDashboard.name);
    }
  }, [dashboardId]);

  const handleDragEnd = (result: DropResult) => {
    if (!dashboard || !result.destination) return;
    
    const items = Array.from(dashboard.widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const newDashboard = {
      ...dashboard,
      widgets: items
    };
    
    setDashboard(newDashboard);
    saveDashboard(newDashboard);
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // Save changes
      if (dashboard) {
        const updatedDashboard = {
          ...dashboard,
          name: newTitle
        };
        saveDashboard(updatedDashboard);
        toast.success('Tableau de bord mis à jour');
      }
    }
    setIsEditing(!isEditing);
  };

  const handleAddWidget = (widgetType: 'kpi' | 'chart', sourceId: string) => {
    if (!dashboard) return;
    
    const availableData = getAvailableWidgetData();
    let widgetData;
    let widgetConfig;
    
    if (widgetType === 'kpi') {
      widgetData = availableData.kpi.find(kpi => kpi.id === sourceId);
      if (!widgetData) return;
      
      widgetConfig = {
        value: widgetData.value,
        trend: widgetData.trend,
        description: widgetData.description
      };
    } else {
      widgetData = availableData.charts.find(chart => chart.id === sourceId);
      if (!widgetData) return;
      
      widgetConfig = {
        type: widgetData.type,
        data: widgetData.data,
        colors: widgetData.colors
      };
    }
    
    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      type: widgetType,
      title: widgetData.title,
      sourceData: sourceId,
      size: widgetType === 'kpi' ? [1, 1] : [2, 2],
      position: [0, dashboard.widgets.length], // Add at the end
      config: widgetConfig
    };
    
    const updatedDashboard = {
      ...dashboard,
      widgets: [...dashboard.widgets, newWidget]
    };
    
    setDashboard(updatedDashboard);
    saveDashboard(updatedDashboard);
    toast.success('Widget ajouté');
  };

  const handleRemoveWidget = (widgetId: string) => {
    if (!dashboard) return;
    
    const updatedDashboard = {
      ...dashboard,
      widgets: dashboard.widgets.filter(widget => widget.id !== widgetId)
    };
    
    setDashboard(updatedDashboard);
    saveDashboard(updatedDashboard);
    toast.success('Widget supprimé');
  };

  const handleEditWidget = (widget: WidgetConfig) => {
    setEditingWidget(widget);
    setIsDialogOpen(true);
  };

  const handleSaveWidget = (updatedWidget: WidgetConfig) => {
    if (!dashboard) return;
    
    const updatedDashboard = {
      ...dashboard,
      widgets: dashboard.widgets.map(widget => 
        widget.id === updatedWidget.id ? updatedWidget : widget
      )
    };
    
    setDashboard(updatedDashboard);
    saveDashboard(updatedDashboard);
    toast.success('Widget mis à jour');
  };

  const handleCreateNewDashboard = () => {
    if (!newDashboardName.trim()) {
      toast.error('Veuillez saisir un nom pour le tableau de bord');
      return;
    }
    
    const newId = `dashboard-${Date.now()}`;
    const newDashboard: DashboardConfig = {
      id: newId,
      name: newDashboardName,
      lastModified: new Date(),
      widgets: []
    };
    
    saveDashboard(newDashboard);
    setIsNewDashboardDialogOpen(false);
    setNewDashboardName('');
    toast.success('Nouveau tableau de bord créé');
    
    // Recharger le dashboard actuel avec le nouveau
    const loadedDashboard = getDashboard(newId);
    if (loadedDashboard) {
      setDashboard(loadedDashboard);
      setNewTitle(loadedDashboard.name);
    }
  };

  const handleDeleteCurrentDashboard = () => {
    if (!dashboard) return;
    
    deleteDashboard(dashboard.id);
    toast.success('Tableau de bord supprimé');
    
    if (onDeleteDashboard) {
      onDeleteDashboard(dashboard.id);
    }
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
        {isEditing ? (
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="max-w-xs"
            placeholder="Nom du tableau de bord"
          />
        ) : (
          <div className="text-xl font-semibold">{dashboard.name}</div>
        )}
        
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
          
          {isEditing && (
            <Button variant="destructive" size="sm" onClick={handleDeleteCurrentDashboard}>
              <Trash className="mr-2 h-4 w-4" />
              Supprimer
            </Button>
          )}
        </div>
      </div>
      
      {isEditing && (
        <div className="mb-4">
          <WidgetPicker onAddWidget={handleAddWidget} />
        </div>
      )}
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard" direction="vertical">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              {dashboard.widgets.map((widget, index) => (
                <div 
                  key={widget.id}
                  className={`col-span-${widget.size[0]} row-span-${widget.size[1]}`}
                >
                  <DraggableWidget
                    widget={widget}
                    index={index}
                    onRemove={handleRemoveWidget}
                    onEdit={handleEditWidget}
                    isEditing={isEditing}
                  />
                </div>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      {dashboard.widgets.length === 0 && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-center">Tableau de bord vide</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Commencez à ajouter des widgets à votre tableau de bord
            </p>
            {isEditing ? (
              <WidgetPicker onAddWidget={handleAddWidget} />
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Commencer l'édition
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      
      <EditWidgetDialog
        widget={editingWidget}
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSaveWidget}
      />
    </div>
  );
};

export default CustomDashboard;
