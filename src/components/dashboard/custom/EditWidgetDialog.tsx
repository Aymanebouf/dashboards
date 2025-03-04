
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { WidgetConfig } from '@/services/dashboardService';

interface EditWidgetDialogProps {
  widget: WidgetConfig | null;
  open: boolean;
  onClose: () => void;
  onSave: (widget: WidgetConfig) => void;
}

const EditWidgetDialog: React.FC<EditWidgetDialogProps> = ({
  widget,
  open,
  onClose,
  onSave
}) => {
  const [editedWidget, setEditedWidget] = useState<WidgetConfig | null>(null);
  
  useEffect(() => {
    if (widget) {
      setEditedWidget({ ...widget });
    }
  }, [widget]);
  
  if (!editedWidget) return null;
  
  const handleSave = () => {
    onSave(editedWidget);
    onClose();
  };
  
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Modifier le widget</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Titre
            </Label>
            <Input
              id="title"
              value={editedWidget.title}
              onChange={(e) => setEditedWidget({ ...editedWidget, title: e.target.value })}
              className="col-span-3"
            />
          </div>
          
          {editedWidget.type === 'chart' && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="chart-type" className="text-right">
                Type de graphique
              </Label>
              <Select
                value={editedWidget.config?.type}
                onValueChange={(value) => 
                  setEditedWidget({ 
                    ...editedWidget, 
                    config: { ...editedWidget.config, type: value } 
                  })
                }
              >
                <SelectTrigger className="col-span-3" id="chart-type">
                  <SelectValue placeholder="Sélectionner un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Barres</SelectItem>
                  <SelectItem value="line">Lignes</SelectItem>
                  <SelectItem value="area">Surface</SelectItem>
                  <SelectItem value="pie">Camembert</SelectItem>
                  <SelectItem value="composed">Composé</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="size" className="text-right">
              Taille
            </Label>
            <div className="col-span-3 flex gap-2">
              <Input
                id="width"
                type="number"
                min="1"
                max="3"
                value={editedWidget.size[0]}
                onChange={(e) => 
                  setEditedWidget({ 
                    ...editedWidget, 
                    size: [parseInt(e.target.value), editedWidget.size[1]] 
                  })
                }
                className="w-1/2"
                placeholder="Largeur"
              />
              <Input
                id="height"
                type="number"
                min="1"
                max="3"
                value={editedWidget.size[1]}
                onChange={(e) => 
                  setEditedWidget({ 
                    ...editedWidget, 
                    size: [editedWidget.size[0], parseInt(e.target.value)] 
                  })
                }
                className="w-1/2"
                placeholder="Hauteur"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="button" onClick={handleSave}>
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditWidgetDialog;
