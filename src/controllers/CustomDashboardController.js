
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { WIDGET_TYPES, CHART_TYPES } from '@/models/dashboard';
import { 
  getDashboard as getServiceDashboard, 
  saveDashboard as saveServiceDashboard, 
  deleteDashboard as deleteServiceDashboard
} from '@/services/dashboardService';

/**
 * Convertit un dashboard du format service au format application
 */
const convertToDashboardConfig = (data) => {
  return {
    id: data.id,
    name: data.name,
    lastModified: data.lastModified,
    widgets: data.widgets.map(widget => ({
      ...widget,
      id: widget.id,
      type: widget.type,
      title: widget.title,
      sourceData: widget.sourceData || '',
      size: widget.size,
      position: widget.position,
      config: widget.config || {}
    }))
  };
};

/**
 * Convertit un dashboard du format application au format service
 */
const convertToServiceDashboardConfig = (data) => {
  return {
    id: data.id,
    name: data.name,
    lastModified: data.lastModified,
    widgets: data.widgets.map(widget => {
      // Convertir les types de widget non supportés par le service
      const type = widget.type === WIDGET_TYPES.TABLE ? WIDGET_TYPES.CHART : widget.type;
      
      return {
        ...widget,
        id: widget.id,
        type: type,
        title: widget.title,
        sourceData: widget.sourceData,
        size: widget.size,
        position: widget.position,
        config: widget.config
      };
    })
  };
};

/**
 * Hook pour gérer les tableaux de bord personnalisés
 */
export const useCustomDashboardController = (dashboardId) => {
  const [dashboard, setDashboard] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingWidget, setEditingWidget] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Charger le tableau de bord depuis le service
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const dashboardData = await getServiceDashboard(dashboardId);
        if (dashboardData) {
          const typedDashboard = convertToDashboardConfig(dashboardData);
          setDashboard(typedDashboard);
        } else {
          console.error('Dashboard not found:', dashboardId);
          toast.error('Tableau de bord non trouvé');
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
        toast.error('Erreur lors du chargement du tableau de bord');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (dashboardId) {
      loadDashboard();
    }
  }, [dashboardId]);
  
  // Mise à jour d'un widget
  const updateWidget = useCallback(async (updatedWidget) => {
    if (!dashboard) return;
    
    try {
      // Créer une copie pour ne pas modifier l'état directement
      const updatedWidgets = dashboard.widgets.map(widget => 
        widget.id === updatedWidget.id ? updatedWidget : widget
      );
      
      const updatedDashboard = {
        ...dashboard,
        widgets: updatedWidgets,
        lastModified: new Date()
      };
      
      await saveServiceDashboard(convertToServiceDashboardConfig(updatedDashboard));
      
      // Mettre à jour l'état local
      setDashboard(updatedDashboard);
      toast.success('Widget mis à jour');
    } catch (error) {
      console.error('Error updating widget:', error);
      toast.error('Erreur lors de la mise à jour du widget');
    }
  }, [dashboard]);
  
  // Supprimer un widget
  const deleteWidget = useCallback(async (widgetId) => {
    if (!dashboard) return;
    
    try {
      // Créer une copie pour ne pas modifier l'état directement
      const updatedWidgets = dashboard.widgets.filter(widget => widget.id !== widgetId);
      
      const updatedDashboard = {
        ...dashboard,
        widgets: updatedWidgets,
        lastModified: new Date()
      };
      
      await saveServiceDashboard(convertToServiceDashboardConfig(updatedDashboard));
      
      // Mettre à jour l'état local
      setDashboard(updatedDashboard);
      toast.success('Widget supprimé');
    } catch (error) {
      console.error('Error deleting widget:', error);
      toast.error('Erreur lors de la suppression du widget');
    }
  }, [dashboard]);
  
  // Ajouter un nouveau widget
  const addWidget = useCallback(async (widgetType) => {
    if (!dashboard) return;
    
    try {
      // Créer un nouveau widget avec des valeurs par défaut
      const newWidget = {
        id: `widget-${Date.now()}`,
        type: widgetType,
        title: widgetType === WIDGET_TYPES.KPI ? 'Nouvel indicateur' : 'Nouveau graphique',
        sourceData: '',
        size: [1, 1],
        position: [0, 0],
        config: widgetType === WIDGET_TYPES.KPI 
          ? {
              value: '0',
              trend: '+0%',
              description: 'Description'
            }
          : {
              type: CHART_TYPES.BAR,
              data: [
                { name: 'A', value: 10 },
                { name: 'B', value: 20 },
                { name: 'C', value: 15 }
              ],
              colors: ['#1E88E5', '#42A5F5', '#90CAF9']
            }
      };
      
      // Ajouter le nouveau widget au tableau de bord
      const updatedWidgets = [...dashboard.widgets, newWidget];
      
      const updatedDashboard = {
        ...dashboard,
        widgets: updatedWidgets,
        lastModified: new Date()
      };
      
      await saveServiceDashboard(convertToServiceDashboardConfig(updatedDashboard));
      
      // Mettre à jour l'état local
      setDashboard(updatedDashboard);
      toast.success('Widget ajouté');
      
      // Éditer le nouveau widget
      setEditingWidget(newWidget);
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error('Error adding widget:', error);
      toast.error('Erreur lors de l\'ajout du widget');
    }
  }, [dashboard]);
  
  // Sauvegarde du dashboard
  const saveDashboardChanges = useCallback(async () => {
    if (!dashboard) return;
    
    try {
      await saveServiceDashboard(convertToServiceDashboardConfig(dashboard));
      toast.success('Tableau de bord enregistré');
    } catch (error) {
      console.error('Error saving dashboard:', error);
      toast.error('Erreur lors de l\'enregistrement du tableau de bord');
    }
  }, [dashboard]);
  
  // Supprimer un tableau de bord
  const deleteDashboard = useCallback(async (onDeleteDashboard) => {
    if (!dashboard) return;
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce tableau de bord ?')) {
      try {
        await deleteServiceDashboard(dashboard.id);
        toast.success('Tableau de bord supprimé');
        if (onDeleteDashboard) {
          onDeleteDashboard(dashboard.id);
        }
      } catch (error) {
        console.error('Error deleting dashboard:', error);
        toast.error('Erreur lors de la suppression du tableau de bord');
      }
    }
  }, [dashboard]);
  
  // Créer un nouveau tableau de bord
  const createDashboard = useCallback(async (name) => {
    const newDashboard = {
      id: `dashboard-${Date.now()}`,
      name: name,
      lastModified: new Date(),
      widgets: []
    };
    
    try {
      await saveServiceDashboard(convertToServiceDashboardConfig(newDashboard));
      
      // Mettre à jour l'état local
      setDashboard(newDashboard);
      toast.success('Tableau de bord créé');
      return newDashboard.id;
    } catch (error) {
      console.error('Error creating dashboard:', error);
      toast.error('Erreur lors de la création du tableau de bord');
      return null;
    }
  }, []);
  
  return {
    dashboard,
    isLoading,
    isEditing,
    setIsEditing,
    addWidget,
    updateWidget,
    deleteWidget,
    saveDashboardChanges,
    deleteDashboard,
    createDashboard,
    editingWidget,
    setEditingWidget,
    isEditDialogOpen,
    setIsEditDialogOpen
  };
};
