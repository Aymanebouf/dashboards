
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { WidgetConfig, DashboardConfig } from '@/models/dashboard';
import { getDashboard, saveDashboard, deleteDashboard } from '@/services/dashboardService';

/**
 * Custom hook for managing dashboard state and operations
 */
export const useCustomDashboardController = (
  dashboardId: string,
  onDeleteDashboard?: (id: string) => void
) => {
  const [dashboard, setDashboard] = useState<DashboardConfig | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [editingWidget, setEditingWidget] = useState<WidgetConfig | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch dashboard data
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboardData = await getDashboard(dashboardId);
        if (dashboardData) {
          // Ensure the type is compatible by enforcing required fields
          const typedDashboard: DashboardConfig = {
            ...dashboardData,
            id: dashboardData.id,
            name: dashboardData.name,
            lastModified: new Date(dashboardData.lastModified),
            widgets: dashboardData.widgets.map(widget => ({
              ...widget,
              id: widget.id,
              type: widget.type,
              title: widget.title,
              sourceData: widget.sourceData,
              size: widget.size,
              position: widget.position,
              config: widget.config || {} // Ensure config is always defined
            }))
          };
          setDashboard(typedDashboard);
          setNewTitle(typedDashboard.name);
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
        toast.error('Erreur lors du chargement du tableau de bord');
      }
    };

    if (dashboardId) {
      loadDashboard();
    }
  }, [dashboardId]);

  /**
   * Save the current dashboard state
   */
  const saveDashboardState = useCallback(async () => {
    if (!dashboard) return;

    try {
      const updatedDashboard = {
        ...dashboard,
        name: newTitle,
        lastModified: new Date()
      };
      
      await saveDashboard(updatedDashboard);
      
      // Update the local state with a properly typed object
      const typedDashboard: DashboardConfig = {
        ...updatedDashboard,
        widgets: updatedDashboard.widgets.map(widget => ({
          ...widget,
          config: widget.config || {} // Ensure config is always defined
        }))
      };
      
      setDashboard(typedDashboard);
      setIsEditing(false);
      toast.success('Tableau de bord enregistré');
    } catch (error) {
      console.error('Error saving dashboard:', error);
      toast.error('Erreur lors de l\'enregistrement du tableau de bord');
    }
  }, [dashboard, newTitle]);

  /**
   * Toggle edit mode
   */
  const handleToggleEdit = useCallback(() => {
    if (isEditing) {
      saveDashboardState();
    } else {
      setIsEditing(true);
    }
  }, [isEditing, saveDashboardState]);

  /**
   * Handle drag end event from react-beautiful-dnd
   */
  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination || !dashboard) return;
    
    const items = Array.from(dashboard.widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const updatedDashboard: DashboardConfig = {
      ...dashboard,
      widgets: items,
      lastModified: new Date()
    };
    
    setDashboard(updatedDashboard);
  }, [dashboard]);

  /**
   * Add a new widget to the dashboard
   */
  const handleAddWidget = useCallback((widgetType: string) => {
    if (!dashboard) return;
    
    const newWidget: WidgetConfig = {
      id: `widget-${Date.now()}`,
      type: widgetType as 'kpi' | 'chart', 
      title: widgetType === 'kpi' ? 'Nouvel indicateur' : 'Nouveau graphique',
      sourceData: '',
      size: [1, 1],
      position: [0, dashboard.widgets.length],
      config: {}  // Ensure config is defined
    };
    
    const updatedDashboard: DashboardConfig = {
      ...dashboard,
      widgets: [...dashboard.widgets, newWidget],
      lastModified: new Date()
    };
    
    setDashboard(updatedDashboard);
    toast.success('Widget ajouté');
  }, [dashboard]);

  /**
   * Remove a widget from the dashboard
   */
  const handleRemoveWidget = useCallback((widgetId: string) => {
    if (!dashboard) return;
    
    const updatedDashboard: DashboardConfig = {
      ...dashboard,
      widgets: dashboard.widgets.filter(w => w.id !== widgetId),
      lastModified: new Date()
    };
    
    setDashboard(updatedDashboard);
    toast.success('Widget supprimé');
  }, [dashboard]);

  /**
   * Open the edit dialog for a widget
   */
  const handleEditWidget = useCallback((widget: WidgetConfig) => {
    setEditingWidget(widget);
    setIsDialogOpen(true);
  }, []);

  /**
   * Save changes to a widget
   */
  const handleSaveWidget = useCallback((updatedWidget: WidgetConfig) => {
    if (!dashboard) return;
    
    const updatedDashboard: DashboardConfig = {
      ...dashboard,
      widgets: dashboard.widgets.map(w => 
        w.id === updatedWidget.id ? updatedWidget : w
      ),
      lastModified: new Date()
    };
    
    setDashboard(updatedDashboard);
    setIsDialogOpen(false);
    setEditingWidget(null);
    toast.success('Widget mis à jour');
  }, [dashboard]);

  /**
   * Delete the current dashboard
   */
  const handleDeleteCurrentDashboard = useCallback(async () => {
    if (!dashboard) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tableau de bord ?')) {
      try {
        await deleteDashboard(dashboard.id);
        toast.success('Tableau de bord supprimé');
        if (onDeleteDashboard) {
          onDeleteDashboard(dashboard.id);
        }
      } catch (error) {
        console.error('Error deleting dashboard:', error);
        toast.error('Erreur lors de la suppression du tableau de bord');
      }
    }
  }, [dashboard, onDeleteDashboard]);

  /**
   * Create a new dashboard
   */
  const handleCreateNewDashboard = useCallback(async (name: string) => {
    const newDashboard: DashboardConfig = {
      id: `dashboard-${Date.now()}`,
      name,
      lastModified: new Date(),
      widgets: []
    };
    
    try {
      await saveDashboard(newDashboard);
      
      // Update the local state with a properly typed object
      const typedDashboard: DashboardConfig = {
        ...newDashboard,
        widgets: [] // Empty widgets array, all correctly typed
      };
      
      setDashboard(typedDashboard);
      toast.success('Nouveau tableau de bord créé');
    } catch (error) {
      console.error('Error creating dashboard:', error);
      toast.error('Erreur lors de la création du tableau de bord');
    }
  }, []);

  return {
    dashboard,
    isEditing,
    setIsEditing,
    newTitle,
    setNewTitle,
    editingWidget,
    isDialogOpen,
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
