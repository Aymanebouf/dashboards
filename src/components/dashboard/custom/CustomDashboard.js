
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { classNames } from 'primereact/utils';

const CustomDashboard = ({ 
  dashboardId, 
  onDeleteDashboard 
}) => {
  const [dashboard, setDashboard] = useState({
    name: 'Tableau de bord personnalisé',
    widgets: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  useEffect(() => {
    // Normally we would load the dashboard data from API here
    setNewTitle(dashboard.name);
  }, [dashboardId, dashboard.name]);
  
  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
    if (!isEditing) {
      setNewTitle(dashboard.name);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        {isEditing ? (
          <InputText
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nom du tableau de bord"
            className="w-full max-w-md"
          />
        ) : (
          <h2 className="text-2xl font-bold">
            {dashboard?.name || 'Tableau de bord personnalisé'}
          </h2>
        )}

        <div className="flex space-x-2">
          <Button
            icon={isEditing ? "pi pi-save" : "pi pi-pencil"}
            label={isEditing ? "Enregistrer" : "Modifier"}
            onClick={handleToggleEdit}
            className={classNames(
              'p-button-sm',
              isEditing ? 'p-button-success' : 'p-button-outlined'
            )}
          />
          
          {isEditing && (
            <Button
              icon="pi pi-trash"
              label="Supprimer"
              className="p-button-danger p-button-sm"
              onClick={() => onDeleteDashboard && onDeleteDashboard(dashboardId)}
            />
          )}
        </div>
      </div>

      <Card className="text-center">
        <div className="p-card-body p-8">
          <h3 className="text-xl mb-4">Aucun widget disponible</h3>
          <p className="text-muted-foreground mb-4">
            Ce tableau de bord est vide. Ajoutez des widgets pour l'enrichir.
          </p>
          {isEditing ? (
            <Button 
              icon="pi pi-plus" 
              label="Ajouter un widget" 
              className="p-button-success"
            />
          ) : (
            <Button 
              icon="pi pi-pencil" 
              label="Commencer l'édition" 
              onClick={handleToggleEdit}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default CustomDashboard;
