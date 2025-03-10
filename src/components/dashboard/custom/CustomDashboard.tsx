
import React, { useState } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save, Trash } from 'lucide-react';
import DraggableWidget from './DraggableWidget';
import WidgetPicker from './WidgetPicker';
import EditWidgetDialog from './EditWidgetDialog';
import { useCustomDashboardController } from '@/controllers/CustomDashboardController';

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
