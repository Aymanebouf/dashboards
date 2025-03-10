
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown, FolderPlus, LayoutDashboard } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { DashboardConfig, saveDashboard } from '@/services/dashboardService';
import { cn } from '@/lib/utils';

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
          <Button variant="outline" className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border-border/40 shadow-sm">
            <LayoutDashboard size={16} className="text-primary" />
            <span className="font-medium truncate max-w-[150px]">
              {selectedDashboard ? selectedDashboard.name : 'Sélectionner un tableau de bord'}
            </span>
            <ChevronDown size={14} className="text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 bg-background/95 backdrop-blur-sm border-border/40 shadow-lg rounded-lg p-1">
          {dashboards.length > 0 ? (
            dashboards.map((dashboard) => (
              <DropdownMenuItem 
                key={dashboard.id} 
                onClick={() => onSelect(dashboard.id)}
                className={cn(
                  "flex items-center gap-2 rounded-md py-2 px-3 cursor-pointer transition-colors",
                  dashboard.id === selectedId 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "hover:bg-accent"
                )}
              >
                <LayoutDashboard size={16} className={dashboard.id === selectedId ? "text-primary" : "text-muted-foreground"} />
                <span className="truncate">{dashboard.name}</span>
              </DropdownMenuItem>
            ))
          ) : (
            <DropdownMenuItem disabled className="text-muted-foreground italic">
              Aucun tableau de bord disponible
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isNewDashboardDialogOpen} onOpenChange={setIsNewDashboardDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="bg-background/80 backdrop-blur-sm border-border/40 shadow-sm">
            <FolderPlus size={16} className="mr-2 text-primary" />
            Nouveau
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md bg-background/95 backdrop-blur-md border-border/40 shadow-lg rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Créer un nouveau tableau de bord</DialogTitle>
            <DialogDescription>
              Entrez un nom pour votre nouveau tableau de bord personnalisé.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newDashboardName}
              onChange={(e) => setNewDashboardName(e.target.value)}
              placeholder="Nom du tableau de bord"
              className="bg-background/50 border-border/40"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button onClick={() => setIsNewDashboardDialogOpen(false)} variant="outline" className="border-border/40">
              Annuler
            </Button>
            <Button onClick={handleCreateNewDashboard} className="bg-primary hover:bg-primary/90">
              Créer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DashboardSelector;
