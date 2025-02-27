
import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StatCard from '@/components/dashboard/widgets/StatCard';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';
import DraggableWidget from '@/components/dashboard/widgets/DraggableWidget';
import { Box, Calendar, Edit, FileText, Link2, PackagePlus, Plus, Printer, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  fetchEquipment, 
  fetchMonthlyData, 
  fetchAnalyticalData, 
  fetchAIPredictions, 
  fetchStats, 
  fetchStatusDistribution, 
  fetchZoneDistribution 
} from '@/services/api';

// Types des widgets disponibles
type WidgetType = 'stat' | 'chart' | 'table' | 'custom';

// Interface pour un widget
interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  props: any;
  width: 'full' | '1/2' | '1/3' | '1/4';
  dataSource?: string;
}

// Génération d'un ID unique
const generateId = () => {
  return `widget-${Math.random().toString(36).substr(2, 9)}`;
};

const Dashboard = () => {
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // Récupération des données depuis le backend via React Query
  const { data: equipmentData, isLoading: isLoadingEquipment } = useQuery({
    queryKey: ['equipment'],
    queryFn: fetchEquipment
  });
  
  const { data: monthlyData, isLoading: isLoadingMonthly } = useQuery({
    queryKey: ['monthlyData'],
    queryFn: fetchMonthlyData
  });
  
  const { data: analyticalData, isLoading: isLoadingAnalytical } = useQuery({
    queryKey: ['analyticalData'],
    queryFn: fetchAnalyticalData
  });
  
  const { data: aiPredictionsData, isLoading: isLoadingAIPredictions } = useQuery({
    queryKey: ['aiPredictions'],
    queryFn: fetchAIPredictions
  });
  
  const { data: statsData, isLoading: isLoadingStats } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats
  });
  
  const { data: statusDistributionData, isLoading: isLoadingStatusDistribution } = useQuery({
    queryKey: ['statusDistribution'],
    queryFn: fetchStatusDistribution
  });
  
  const { data: zoneDistributionData, isLoading: isLoadingZoneDistribution } = useQuery({
    queryKey: ['zoneDistribution'],
    queryFn: fetchZoneDistribution
  });

  const [widgets, setWidgets] = useState<Widget[]>([]);
  const [analyticsWidgets, setAnalyticsWidgets] = useState<Widget[]>([]);
  const [customWidgets, setCustomWidgets] = useState<Widget[]>([]);
  const [aiWidgets, setAiWidgets] = useState<Widget[]>([]);

  // Initialisation des widgets avec les données du backend
  useEffect(() => {
    if (statsData && monthlyData) {
      setWidgets([
        {
          id: generateId(),
          type: 'stat',
          title: 'Engins tagués',
          props: {
            icon: <Box size={24} />,
            value: statsData.taggedEngines.value,
            progress: statsData.taggedEngines.progress,
            color: 'blue'
          },
          width: '1/4',
          dataSource: 'stats'
        },
        {
          id: generateId(),
          type: 'stat',
          title: 'Tags utilisés',
          props: {
            icon: <Tag size={24} />,
            value: statsData.usedTags.value,
            progress: statsData.usedTags.progress,
            color: 'red'
          },
          width: '1/4',
          dataSource: 'stats'
        },
        {
          id: generateId(),
          type: 'stat',
          title: 'Engins sur site',
          props: {
            icon: <Box size={24} />,
            value: statsData.enginesOnSite.value,
            progress: statsData.enginesOnSite.progress,
            color: 'green'
          },
          width: '1/4',
          dataSource: 'stats'
        },
        {
          id: generateId(),
          type: 'stat',
          title: 'Tags à maintenir',
          props: {
            icon: <Tag size={24} />,
            value: statsData.tagsToMaintain.value,
            progress: statsData.tagsToMaintain.progress,
            color: 'gray'
          },
          width: '1/4',
          dataSource: 'stats'
        },
        {
          id: generateId(),
          type: 'chart',
          title: 'Activité mensuelle',
          props: {
            data: monthlyData,
            type: 'bar',
            colors: ['#1E88E5', '#E91E63', '#66BB6A'],
            height: 300
          },
          width: 'full',
          dataSource: 'monthlyData'
        }
      ]);
    }
  }, [statsData, monthlyData]);

  // Initialisation des widgets d'analyse
  useEffect(() => {
    if (analyticalData) {
      setAnalyticsWidgets([
        {
          id: generateId(),
          type: 'chart',
          title: 'Analyse d\'utilisation hebdomadaire',
          props: {
            data: analyticalData,
            type: 'bar',
            colors: ['#7056AB', '#F97CE5', '#1E88E5'],
            height: 300
          },
          width: 'full',
          dataSource: 'analyticalData'
        },
        {
          id: generateId(),
          type: 'stat',
          title: 'Taux d\'utilisation',
          props: {
            icon: <Box size={24} />,
            value: '75%',
            progress: 75,
            color: 'purple'
          },
          width: '1/3'
        },
        {
          id: generateId(),
          type: 'stat',
          title: 'Efficacité opérationnelle',
          props: {
            icon: <Calendar size={24} />,
            value: '82%',
            progress: 82,
            color: 'green'
          },
          width: '1/3'
        },
        {
          id: generateId(),
          type: 'stat',
          title: 'Durée moyenne des tâches',
          props: {
            icon: <FileText size={24} />,
            value: '4.2h',
            progress: 70,
            color: 'blue'
          },
          width: '1/3'
        }
      ]);
    }
  }, [analyticalData]);

  // Initialisation des widgets personnalisés
  useEffect(() => {
    if (equipmentData && statusDistributionData && zoneDistributionData) {
      setCustomWidgets([
        {
          id: generateId(),
          type: 'table',
          title: 'Équipements sur site',
          props: {
            data: equipmentData
          },
          width: 'full',
          dataSource: 'equipmentData'
        },
        {
          id: generateId(),
          type: 'chart',
          title: 'Répartition par statut',
          props: {
            data: statusDistributionData,
            type: 'pie',
            colors: ['#66BB6A', '#FFC107', '#E91E63'],
            height: 250
          },
          width: '1/2',
          dataSource: 'statusDistributionData'
        },
        {
          id: generateId(),
          type: 'chart',
          title: 'Répartition par zone',
          props: {
            data: zoneDistributionData,
            type: 'pie',
            colors: ['#1E88E5', '#7056AB', '#66BB6A', '#FFC107', '#E91E63'],
            height: 250
          },
          width: '1/2',
          dataSource: 'zoneDistributionData'
        }
      ]);
    }
  }, [equipmentData, statusDistributionData, zoneDistributionData]);

  // Initialisation des widgets IA
  useEffect(() => {
    if (aiPredictionsData) {
      setAiWidgets([
        {
          id: generateId(),
          type: 'chart',
          title: 'Prédictions d\'utilisation',
          props: {
            data: aiPredictionsData,
            type: 'line',
            colors: ['#66BB6A', '#7056AB'],
            height: 300
          },
          width: 'full',
          dataSource: 'aiPredictionsData'
        },
        {
          id: generateId(),
          type: 'stat',
          title: 'Précision des prédictions',
          props: {
            icon: <Box size={24} />,
            value: '92%',
            progress: 92,
            color: 'purple'
          },
          width: '1/3'
        },
        {
          id: generateId(),
          type: 'stat',
          title: 'Anomalies détectées',
          props: {
            icon: <Tag size={24} />,
            value: '3',
            progress: 30,
            color: 'red'
          },
          width: '1/3'
        },
        {
          id: generateId(),
          type: 'stat',
          title: 'Maintenance prédictive',
          props: {
            icon: <Calendar size={24} />,
            value: '5 jours',
            progress: 80,
            color: 'yellow'
          },
          width: '1/3'
        }
      ]);
    }
  }, [aiPredictionsData]);

  const [activeTab, setActiveTab] = useState('main');
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // État pour le formulaire d'ajout de widget
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [newWidgetType, setNewWidgetType] = useState<WidgetType>('stat');
  const [newWidgetTitle, setNewWidgetTitle] = useState('');
  const [newWidgetWidth, setNewWidgetWidth] = useState<Widget['width']>('1/3');

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    if (!isEditMode) return;
    setDraggedWidgetId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (!isEditMode) return;
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    if (!isEditMode) return;
    e.preventDefault();
    
    if (!draggedWidgetId || draggedWidgetId === targetId) return;
    
    const currentWidgets = getCurrentWidgets();
    const newWidgets = [...currentWidgets];
    const draggedIndex = newWidgets.findIndex(w => w.id === draggedWidgetId);
    const targetIndex = newWidgets.findIndex(w => w.id === targetId);
    
    const [draggedWidget] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, draggedWidget);
    
    updateCurrentWidgets(newWidgets);
    setDraggedWidgetId(null);
    
    toast.success('Widget repositionné avec succès');
  };

  const handleRemoveWidget = (id: string) => {
    if (!isEditMode) return;
    
    const currentWidgets = getCurrentWidgets();
    const updatedWidgets = currentWidgets.filter(widget => widget.id !== id);
    updateCurrentWidgets(updatedWidgets);
    toast.success('Widget supprimé avec succès');
  };

  const handleAddWidget = () => {
    if (!newWidgetTitle.trim()) {
      toast.error('Veuillez entrer un titre pour le widget');
      return;
    }

    const newWidget: Widget = {
      id: generateId(),
      type: newWidgetType,
      title: newWidgetTitle,
      props: getDefaultPropsForType(newWidgetType),
      width: newWidgetWidth
    };

    const currentWidgets = getCurrentWidgets();
    updateCurrentWidgets([...currentWidgets, newWidget]);
    setIsAddWidgetOpen(false);
    setNewWidgetTitle('');
    setNewWidgetType('stat');
    setNewWidgetWidth('1/3');
    
    toast.success('Nouveau widget ajouté');
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    if (!isEditMode) {
      toast.info('Mode édition activé. Vous pouvez maintenant déplacer et supprimer des widgets.');
    } else {
      toast.success('Modifications sauvegardées');
    }
  };

  const getDefaultPropsForType = (type: WidgetType) => {
    switch (type) {
      case 'stat':
        return {
          icon: <Box size={24} />,
          value: '0/0',
          progress: 0,
          color: 'blue'
        };
      case 'chart':
        return {
          data: monthlyData || [],
          type: 'bar',
          colors: ['#1E88E5', '#E91E63', '#66BB6A'],
          height: 300
        };
      case 'table':
        return {
          data: equipmentData || []
        };
      case 'custom':
      default:
        return {};
    }
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.type) {
      case 'stat':
        return (
          <StatCard
            icon={widget.props.icon}
            title={widget.title}
            value={widget.props.value}
            progress={widget.props.progress}
            color={widget.props.color}
          />
        );
      case 'chart':
        return (
          <ChartWidget
            title={widget.title}
            data={widget.props.data}
            type={widget.props.type}
            colors={widget.props.colors}
            height={widget.props.height}
          />
        );
      case 'table':
        return (
          <Card className="h-full p-4">
            <h3 className="text-lg font-medium mb-4">{widget.title}</h3>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Emplacement</TableHead>
                    <TableHead>Dernière utilisation</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {widget.props.data?.map((row: any) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          row.status === 'Actif' ? 'bg-green-100 text-green-800' :
                          row.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {row.status}
                        </span>
                      </TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.lastUsed}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </Card>
        );
      case 'custom':
      default:
        return (
          <Card className="h-full p-4">
            <h3 className="text-lg font-medium mb-4">{widget.title}</h3>
            <p className="text-muted-foreground">Widget personnalisé</p>
          </Card>
        );
    }
  };

  const getWidthClass = (width: Widget['width']) => {
    switch (width) {
      case '1/2':
        return 'col-span-6';
      case '1/3':
        return 'col-span-4';
      case '1/4':
        return 'col-span-3';
      case 'full':
      default:
        return 'col-span-12';
    }
  };

  const getCurrentWidgets = () => {
    switch (activeTab) {
      case 'analytics':
        return analyticsWidgets;
      case 'custom':
        return customWidgets;
      case 'ai':
        return aiWidgets;
      case 'main':
      default:
        return widgets;
    }
  };

  const updateCurrentWidgets = (updatedWidgets: Widget[]) => {
    switch (activeTab) {
      case 'analytics':
        setAnalyticsWidgets(updatedWidgets);
        break;
      case 'custom':
        setCustomWidgets(updatedWidgets);
        break;
      case 'ai':
        setAiWidgets(updatedWidgets);
        break;
      case 'main':
      default:
        setWidgets(updatedWidgets);
        break;
    }
  };

  // Afficher un indicateur de chargement si les données sont en cours de chargement
  if (isLoadingStats || isLoadingMonthly) {
    return (
      <DashboardLayout title="Tableau de bord">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-logitag-primary"></div>
          <p className="ml-4 text-lg">Chargement des données...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Tableau de bord">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="flex items-center space-x-2">
          <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
            <DialogTrigger asChild>
              <Button 
                className="flex items-center" 
                disabled={!isEditMode}
              >
                <Plus size={16} className="mr-2" />
                Ajouter un widget
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ajouter un nouveau widget</DialogTitle>
                <DialogDescription>
                  Personnalisez votre tableau de bord en ajoutant différents types de widgets.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="widget-title" className="text-right">
                    Titre
                  </label>
                  <Input
                    id="widget-title"
                    value={newWidgetTitle}
                    onChange={(e) => setNewWidgetTitle(e.target.value)}
                    className="col-span-3"
                  />
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="widget-type" className="text-right">
                    Type
                  </label>
                  <Select
                    value={newWidgetType}
                    onValueChange={(value) => setNewWidgetType(value as WidgetType)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stat">Statistique</SelectItem>
                      <SelectItem value="chart">Graphique</SelectItem>
                      <SelectItem value="table">Tableau</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="widget-width" className="text-right">
                    Largeur
                  </label>
                  <Select
                    value={newWidgetWidth}
                    onValueChange={(value) => setNewWidgetWidth(value as Widget['width'])}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Sélectionner une largeur" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="full">Pleine largeur</SelectItem>
                      <SelectItem value="1/2">Demi largeur (1/2)</SelectItem>
                      <SelectItem value="1/3">Tiers (1/3)</SelectItem>
                      <SelectItem value="1/4">Quart (1/4)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddWidgetOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={handleAddWidget}>Ajouter</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button 
            variant={isEditMode ? "default" : "outline"} 
            onClick={toggleEditMode}
            className={isEditMode ? "bg-amber-500 hover:bg-amber-600" : ""}
          >
            <Edit size={16} className="mr-2" />
            {isEditMode ? "Terminer l'édition" : "Mode édition"}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="main" value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="main">Principal</TabsTrigger>
          <TabsTrigger value="analytics">Analytique</TabsTrigger>
          <TabsTrigger value="custom">Personnalisé</TabsTrigger>
          <TabsTrigger value="ai" className="relative">
            IA & Prédictions
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-logitag-primary rounded-full animate-pulse"></span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div ref={dashboardRef} className="grid grid-cols-12 gap-6">
        {getCurrentWidgets().map((widget) => (
          <div key={widget.id} className={getWidthClass(widget.width)}>
            <DraggableWidget
              id={widget.id}
              title={widget.title}
              onRemove={handleRemoveWidget}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              isEditMode={isEditMode}
            >
              {renderWidget(widget)}
            </DraggableWidget>
          </div>
        ))}
      </div>
      
      {isEditMode && getCurrentWidgets().length === 0 && (
        <div className="text-center p-12 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-muted-foreground">
            Aucun widget dans cet onglet. Cliquez sur "Ajouter un widget" pour commencer.
          </p>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;
