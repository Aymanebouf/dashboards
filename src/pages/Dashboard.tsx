
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import StatCard from '@/components/dashboard/widgets/StatCard';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';
import DraggableWidget from '@/components/dashboard/widgets/DraggableWidget';
import { Box, Calendar, Edit, PackagePlus, Plus, Tag } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Sample data for the charts
const monthlyData = [
  { name: 'January', 'Engin Tagged': 65, 'Engin Enter': 28, 'Engin Exit': 20 },
  { name: 'February', 'Engin Tagged': 59, 'Engin Enter': 48, 'Engin Exit': 90 },
  { name: 'March', 'Engin Tagged': 80, 'Engin Enter': 40, 'Engin Exit': 30 },
  { name: 'April', 'Engin Tagged': 81, 'Engin Enter': 19, 'Engin Exit': 40 },
  { name: 'May', 'Engin Tagged': 56, 'Engin Enter': 86, 'Engin Exit': 75 },
  { name: 'June', 'Engin Tagged': 55, 'Engin Enter': 27, 'Engin Exit': 15 },
  { name: 'July', 'Engin Tagged': 40, 'Engin Enter': 90, 'Engin Exit': 48 },
];

// Types des widgets disponibles
type WidgetType = 'stat' | 'chart' | 'table' | 'custom';

// Interface pour un widget
interface Widget {
  id: string;
  type: WidgetType;
  title: string;
  props: any;
  width: 'full' | '1/2' | '1/3' | '1/4';
}

// Génération d'un ID unique
const generateId = () => {
  return `widget-${Math.random().toString(36).substr(2, 9)}`;
};

const Dashboard = () => {
  const [widgets, setWidgets] = useState<Widget[]>([
    {
      id: generateId(),
      type: 'stat',
      title: 'Engins tagués',
      props: {
        icon: <Box size={24} />,
        value: '10/10',
        progress: 100,
        color: 'blue'
      },
      width: '1/4'
    },
    {
      id: generateId(),
      type: 'stat',
      title: 'Tags utilisés',
      props: {
        icon: <Tag size={24} />,
        value: '10/16',
        progress: 62,
        color: 'red'
      },
      width: '1/4'
    },
    {
      id: generateId(),
      type: 'stat',
      title: 'Engins sur site',
      props: {
        icon: <Box size={24} />,
        value: '10/10',
        progress: 100,
        color: 'green'
      },
      width: '1/4'
    },
    {
      id: generateId(),
      type: 'stat',
      title: 'Tags à maintenir',
      props: {
        icon: <Tag size={24} />,
        value: '0/16',
        progress: 0,
        color: 'gray'
      },
      width: '1/4'
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
      width: 'full'
    }
  ]);

  const [activeTab, setActiveTab] = useState('main');
  const [draggedWidgetId, setDraggedWidgetId] = useState<string | null>(null);

  // État pour le formulaire d'ajout de widget
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);
  const [newWidgetType, setNewWidgetType] = useState<WidgetType>('stat');
  const [newWidgetTitle, setNewWidgetTitle] = useState('');
  const [newWidgetWidth, setNewWidgetWidth] = useState<Widget['width']>('1/3');

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    setDraggedWidgetId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    
    if (!draggedWidgetId || draggedWidgetId === targetId) return;
    
    const newWidgets = [...widgets];
    const draggedIndex = newWidgets.findIndex(w => w.id === draggedWidgetId);
    const targetIndex = newWidgets.findIndex(w => w.id === targetId);
    
    const [draggedWidget] = newWidgets.splice(draggedIndex, 1);
    newWidgets.splice(targetIndex, 0, draggedWidget);
    
    setWidgets(newWidgets);
    setDraggedWidgetId(null);
    
    toast.success('Widget repositionné avec succès');
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
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

    setWidgets([...widgets, newWidget]);
    setIsAddWidgetOpen(false);
    setNewWidgetTitle('');
    setNewWidgetType('stat');
    setNewWidgetWidth('1/3');
    
    toast.success('Nouveau widget ajouté');
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
          data: monthlyData,
          type: 'bar',
          colors: ['#1E88E5', '#E91E63', '#66BB6A'],
          height: 300
        };
      case 'table':
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
            <p className="text-muted-foreground">Table Widget (Non implémenté)</p>
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

  return (
    <DashboardLayout title="Tableau de bord">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        
        <div className="flex items-center space-x-2">
          <Dialog open={isAddWidgetOpen} onOpenChange={setIsAddWidgetOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center">
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
          
          <Button variant="outline">
            <Edit size={16} className="mr-2" />
            Mode édition
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
      
      <div className="grid grid-cols-12 gap-6">
        {widgets.map((widget) => (
          <div key={widget.id} className={getWidthClass(widget.width)}>
            <DraggableWidget
              id={widget.id}
              title={widget.title}
              onRemove={handleRemoveWidget}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {renderWidget(widget)}
            </DraggableWidget>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
