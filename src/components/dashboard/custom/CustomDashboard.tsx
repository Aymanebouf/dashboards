
import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, Trash, Plus, BarChart3, LineChart, PieChart, BookOpen } from 'lucide-react';
import DraggableWidget from './DraggableWidget';
import WidgetPicker from './WidgetPicker';
import EditWidgetDialog from './EditWidgetDialog';
import { useCustomDashboardController } from '@/controllers/CustomDashboardController';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CustomDashboardProps {
  dashboardId: string;
  onDeleteDashboard?: (id: string) => void;
}

/**
 * CustomDashboard component for handling editable dashboards
 */
const CustomDashboard: React.FC<CustomDashboardProps> = ({ dashboardId, onDeleteDashboard }) => {
  const [isNewDashboardDialogOpen, setIsNewDashboardDialogOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');

  // Using our controller for dashboard logic
  const {
    dashboard,
    isEditing,
    setIsEditing,
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
  } = useCustomDashboardController(dashboardId, onDeleteDashboard);

  // Handle creating a new dashboard
  const createNewDashboard = () => {
    if (!newDashboardName.trim()) return;
    
    handleCreateNewDashboard(newDashboardName);
    setIsNewDashboardDialogOpen(false);
    setNewDashboardName('');
  };

  if (!dashboard) {
    return (
      <div className="flex items-center justify-center h-64 w-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full bg-primary/20 mb-4 flex items-center justify-center">
            <BarChart3 className="h-6 w-6 text-primary/40" />
          </div>
          <div className="h-4 w-48 bg-muted rounded"></div>
          <p className="mt-4 text-muted-foreground">Chargement du tableau de bord...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dashboard Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6 shadow-sm border border-border/40">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          {isEditing ? (
            <div className="w-full sm:w-auto">
              <label htmlFor="dashboard-title" className="text-sm font-medium text-muted-foreground mb-1 block">
                Nom du tableau de bord
              </label>
              <Input
                id="dashboard-title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="max-w-xs font-medium text-lg"
                placeholder="Nom du tableau de bord"
              />
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {dashboard.name}
              </h2>
              <p className="text-muted-foreground text-sm">
                Dernière modification: {dashboard.lastModified?.toLocaleDateString()}
              </p>
            </div>
          )}
          
          <div className="flex space-x-2 w-full sm:w-auto justify-end">
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={handleToggleEdit}
              className="transition-all duration-300 hover:shadow-md"
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
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleDeleteCurrentDashboard}
                className="transition-all duration-300 hover:shadow-md"
              >
                <Trash className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            )}
          </div>
        </div>
      </div>
      
      {/* Widget Toolbar (Visible in Edit Mode) */}
      {isEditing && (
        <div className="bg-card rounded-xl p-4 shadow-sm border border-border/20 animate-slide-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-medium mb-1">Ajouter des widgets</h3>
              <p className="text-sm text-muted-foreground">
                Sélectionnez les types de widgets à ajouter à votre tableau de bord
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="py-1 px-3 bg-background/50 text-sm">
                {dashboard.widgets.length} Widgets
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <WidgetPicker onAddWidget={handleAddWidget} />
          </div>
        </div>
      )}
      
      {/* Dashboard Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="dashboard" direction="vertical">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={cn(
                "grid grid-cols-1 gap-6 transition-all duration-300",
                "sm:grid-cols-2 md:grid-cols-4"
              )}
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
      
      {/* Empty Dashboard State */}
      {dashboard.widgets.length === 0 && (
        <Card className="bg-background/40 backdrop-blur-sm border-dashed border-2 border-border/50 shadow-sm overflow-hidden">
          <CardHeader>
            <CardTitle className="text-center text-xl font-semibold text-muted-foreground">
              Tableau de bord vide
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center py-12 flex flex-col items-center">
            <div className="mb-6 flex gap-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary/70" />
              </div>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <LineChart className="h-6 w-6 text-secondary/70" />
              </div>
              <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center">
                <PieChart className="h-6 w-6 text-green-500/70" />
              </div>
            </div>
            
            <p className="text-muted-foreground mb-6 max-w-md">
              Personnalisez votre tableau de bord en ajoutant des widgets pour afficher vos données importantes
            </p>
            
            {isEditing ? (
              <WidgetPicker onAddWidget={handleAddWidget} />
            ) : (
              <Button 
                onClick={() => setIsEditing(true)}
                className="gap-2 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <Edit className="h-4 w-4" />
                Commencer l'édition
              </Button>
            )}
          </CardContent>
        </Card>
      )}
      
      {/* Widget Edit Dialog */}
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
