
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';
import { DashboardConfig, saveDashboard } from '@/services/dashboardService';

interface DashboardSelectorProps {
  dashboards: DashboardConfig[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const DashboardSelector: React.FC<DashboardSelectorProps> = ({ dashboards, selectedId, onSelect }) => {
  const [isNewDashboardDialogOpen, setIsNewDashboardDialogOpen] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');
  
  const selectedDashboard = dashboards.find(d => d.id === selectedId);

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
    onSelect(newId);
  };

  return (
    <div className="flex gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {selectedDashboard ? selectedDashboard.name : 'Sélectionner un tableau de bord'}
            <ChevronDown size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          {dashboards.length > 0 ? (
            dashboards.map((dashboard) => (
              <DropdownMenuItem 
                key={dashboard.id} 
                onClick={() => onSelect(dashboard.id)}
                className={dashboard.id === selectedId ? 'bg-accent/50' : ''}
              >
                {dashboard.name}
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled>Aucun tableau de bord disponible</DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isNewDashboardDialogOpen} onOpenChange={setIsNewDashboardDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">
            <Plus size={16} className="mr-2" />
            Nouveau
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer un nouveau tableau de bord</DialogTitle>
            <DialogDescription>
              Entrez un nom pour votre nouveau tableau de bord.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newDashboardName}
              onChange={(e) => setNewDashboardName(e.target.value)}
              placeholder="Nom du tableau de bord"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsNewDashboardDialogOpen(false)} variant="outline">Annuler</Button>
            <Button onClick={handleCreateNewDashboard}>Créer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardSelector;
