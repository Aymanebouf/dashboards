
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { WidgetConfig, DashboardConfig } from '@/models/dashboard';
import { 
  getDashboard, 
  saveDashboard, 
  getAvailableWidgetData, 
  deleteDashboard,
  getDashboards
} from '@/services/dashboardService';

/**
 * Controller for custom dashboard functionality
 * Manages dashboard editing, widgets, and state
 */
export const useCustomDashboardController = (dashboardId: string, onDeleteDashboard?: (id: string) => void) => {
  const [dashboard, setDashboard] = useState<DashboardConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [editingWidget, setEditingWidget] = useState<WidgetConfig | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Load dashboard on initialization or ID change
  useEffect(() => {
    const loadedDashboard = getDashboard(dashboardId);
    if (loadedDashboard) {
      setDashboard(loadedDashboard);
      setNewTitle(loadedDashboard.name);
    }
  }, [dashboardId]);

  /**
   * Handles drag and drop of widgets
   */
  const handleDragEnd = (result: any) => {
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

  /**
   * Toggles edit mode and saves changes
   */
  const handleToggleEdit = () => {
    if (isEditing) {
      // Save changes
      if (dashboard) {
        const updatedDashboard = {
          ...dashboard,
          name: newTitle,
          lastModified: new Date()
        };
        saveDashboard(updatedDashboard);
        toast.success('Tableau de bord mis à jour');
      }
    }
    setIsEditing(!isEditing);
  };

  /**
   * Adds a new widget to the dashboard
   */
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
      widgets: [...dashboard.widgets, newWidget],
      lastModified: new Date()
    };
    
    setDashboard(updatedDashboard);
    saveDashboard(updatedDashboard);
    toast.success('Widget ajouté');
  };

  /**
   * Removes a widget from the dashboard
   */
  const handleRemoveWidget = (widgetId: string) => {
    if (!dashboard) return;
    
    const updatedDashboard = {
      ...dashboard,
      widgets: dashboard.widgets.filter(widget => widget.id !== widgetId),
      lastModified: new Date()
    };
    
    setDashboard(updatedDashboard);
    saveDashboard(updatedDashboard);
    toast.success('Widget supprimé');
  };

  /**
   * Opens widget edit dialog
   */
  const handleEditWidget = (widget: WidgetConfig) => {
    setEditingWidget(widget);
    setIsDialogOpen(true);
  };

  /**
   * Saves widget updates
   */
  const handleSaveWidget = (updatedWidget: WidgetConfig) => {
    if (!dashboard) return;
    
    const updatedDashboard = {
      ...dashboard,
      widgets: dashboard.widgets.map(widget => 
        widget.id === updatedWidget.id ? updatedWidget : widget
      ),
      lastModified: new Date()
    };
    
    setDashboard(updatedDashboard);
    saveDashboard(updatedDashboard);
    toast.success('Widget mis à jour');
  };

  /**
   * Deletes the current dashboard
   */
  const handleDeleteCurrentDashboard = () => {
    if (!dashboard) return;
    
    deleteDashboard(dashboard.id);
    toast.success('Tableau de bord supprimé');
    
    if (onDeleteDashboard) {
      onDeleteDashboard(dashboard.id);
    }
  };

  /**
   * Creates a new dashboard with the given name
   */
  const handleCreateNewDashboard = (name: string) => {
    if (!name.trim()) {
      toast.error('Veuillez saisir un nom pour le tableau de bord');
      return;
    }
    
    const newId = `dashboard-${Date.now()}`;
    const newDashboard: DashboardConfig = {
      id: newId,
      name: name,
      lastModified: new Date(),
      widgets: []
    };
    
    saveDashboard(newDashboard);
    toast.success('Nouveau tableau de bord créé');
    
    // Reload the dashboard with the new one
    const loadedDashboard = getDashboard(newId);
    if (loadedDashboard) {
      setDashboard(loadedDashboard);
      setNewTitle(loadedDashboard.name);
    }
    
    return newId;
  };

  return {
    dashboard,
    isEditing,
    newTitle,
    editingWidget,
    isDialogOpen,
    setNewTitle,
    setIsDialogOpen,
    handleDragEnd,
    handleToggleEdit,
    handleAddWidget,
    handleRemoveWidget,
    handleEditWidget,
    handleSaveWidget,
    handleDeleteCurrentDashboard,
    handleCreateNewDashboard
  };
};
