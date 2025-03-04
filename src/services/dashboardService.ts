
interface WidgetConfig {
  id: string;
  type: 'kpi' | 'chart';
  title: string;
  sourceData: string;
  size: [number, number]; // [width, height]
  position: [number, number]; // [x, y]
  config?: any; // Configurations spécifiques au widget
}

interface DashboardConfig {
  id: string;
  name: string;
  widgets: WidgetConfig[];
  lastModified: Date;
}

// Tableau de bord par défaut
const defaultDashboard: DashboardConfig = {
  id: 'default',
  name: 'Tableau de bord personnalisé',
  lastModified: new Date(),
  widgets: [
    {
      id: 'widget-1',
      type: 'kpi',
      title: 'Total Engins',
      sourceData: 'totalEquipments',
      size: [1, 1],
      position: [0, 0],
      config: { value: '2,845', trend: '+12.5%', description: 'Nombre total d\'engins' }
    },
    {
      id: 'widget-2',
      type: 'chart',
      title: 'Performance mensuelle',
      sourceData: 'monthlyPerformance',
      size: [2, 1],
      position: [1, 0],
      config: { 
        type: 'line',
        colors: ['#1E88E5'],
        data: [
          { name: 'Jan', value: 45 },
          { name: 'Fév', value: 52 },
          { name: 'Mar', value: 49 },
          { name: 'Avr', value: 63 },
          { name: 'Mai', value: 58 },
          { name: 'Juin', value: 64 }
        ]
      }
    },
    {
      id: 'widget-3',
      type: 'chart',
      title: 'Répartition par type d\'engin',
      sourceData: 'equipmentDistribution',
      size: [1, 2],
      position: [0, 1],
      config: { 
        type: 'pie',
        colors: ['#4CAF50', '#FFC107', '#F44336', '#9C27B0', '#673AB7'],
        data: [
          { name: 'Bulldozer', value: 35 },
          { name: 'Grue', value: 25 },
          { name: 'Excavateur', value: 20 },
          { name: 'Chariot élévateur', value: 15 },
          { name: 'Autre', value: 5 }
        ]
      }
    }
  ]
};

// Récupère tous les tableaux de bord
export const getDashboards = (): DashboardConfig[] => {
  try {
    const storedDashboards = localStorage.getItem('custom-dashboards');
    if (storedDashboards) {
      const dashboards: DashboardConfig[] = JSON.parse(storedDashboards);
      // Convertir les dates de string à Date
      return dashboards.map(dashboard => ({
        ...dashboard,
        lastModified: new Date(dashboard.lastModified)
      }));
    }
    // S'il n'y a pas de tableaux personnalisés, créer le défaut
    const defaultDashboards = [defaultDashboard];
    localStorage.setItem('custom-dashboards', JSON.stringify(defaultDashboards));
    return defaultDashboards;
  } catch (error) {
    console.error('Erreur lors de la récupération des tableaux de bord:', error);
    return [defaultDashboard];
  }
};

// Récupère un tableau de bord spécifique
export const getDashboard = (id: string): DashboardConfig | null => {
  const dashboards = getDashboards();
  return dashboards.find(dashboard => dashboard.id === id) || null;
};

// Sauvegarde un tableau de bord
export const saveDashboard = (dashboard: DashboardConfig): void => {
  try {
    const dashboards = getDashboards();
    const existingIndex = dashboards.findIndex(d => d.id === dashboard.id);
    
    // Mettre à jour la date de dernière modification
    const updatedDashboard = {
      ...dashboard,
      lastModified: new Date()
    };
    
    if (existingIndex >= 0) {
      dashboards[existingIndex] = updatedDashboard;
    } else {
      dashboards.push(updatedDashboard);
    }
    
    localStorage.setItem('custom-dashboards', JSON.stringify(dashboards));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du tableau de bord:', error);
  }
};

// Supprime un tableau de bord
export const deleteDashboard = (id: string): void => {
  try {
    let dashboards = getDashboards();
    dashboards = dashboards.filter(dashboard => dashboard.id !== id);
    localStorage.setItem('custom-dashboards', JSON.stringify(dashboards));
  } catch (error) {
    console.error('Erreur lors de la suppression du tableau de bord:', error);
  }
};

// Données disponibles pour les widgets
export const getAvailableWidgetData = () => {
  return {
    kpi: [
      { id: 'totalEquipments', title: 'Total Engins', value: '2,845', trend: '+12.5%', description: 'Nombre total d\'engins' },
      { id: 'activations', title: 'Activations', value: '1,257', trend: '+5.2%', description: 'Nombre d\'activations' },
      { id: 'production', title: 'Production', value: '1,560t', trend: '+8.3%', description: 'Tonnes produites' },
      { id: 'totalHours', title: 'Heures totales', value: '12,450h', trend: '+3.2%', description: 'Heures d\'opération' },
      { id: 'averageDuration', title: 'Durée moyenne', value: '18.5 jours', trend: '+5.2%', description: 'Durée moyenne de présence des engins chez un client' },
      { id: 'lateTrucks', title: 'Camions en retard', value: '15', trend: '-12.5%', description: 'Nombre de camions dépassant la durée prévue' },
      { id: 'waitingBottles', title: 'Bouteilles en attente', value: '257', trend: '+8.3%', description: 'Nombre de bouteilles en attente de retour' },
      { id: 'rotationRate', title: 'Taux de rotation', value: '3.7x', trend: '+10.2%', description: 'Taux de rotation mensuel des équipements' }
    ],
    charts: [
      { 
        id: 'monthlyPerformance',
        title: 'Performance mensuelle',
        type: 'line',
        data: [
          { name: 'Jan', value: 45 },
          { name: 'Fév', value: 52 },
          { name: 'Mar', value: 49 },
          { name: 'Avr', value: 63 },
          { name: 'Mai', value: 58 },
          { name: 'Juin', value: 64 }
        ],
        colors: ['#1E88E5']
      },
      {
        id: 'equipmentDistribution',
        title: 'Répartition par type d\'engin',
        type: 'pie',
        data: [
          { name: 'Bulldozer', value: 35 },
          { name: 'Grue', value: 25 },
          { name: 'Excavateur', value: 20 },
          { name: 'Chariot élévateur', value: 15 },
          { name: 'Autre', value: 5 }
        ],
        colors: ['#4CAF50', '#FFC107', '#F44336', '#9C27B0', '#673AB7']
      },
      { 
        id: 'averageDurationByType',
        title: 'Durée moyenne de présence par type d\'engin',
        type: 'bar',
        data: [
          { name: 'Camions', 'Durée (jours)': 18 },
          { name: 'Bouteilles', 'Durée (jours)': 25 },
          { name: 'Équipements', 'Durée (jours)': 12 },
          { name: 'Machines', 'Durée (jours)': 7 }
        ],
        colors: ['#4CAF50']
      },
      {
        id: 'durationEvolution',
        title: 'Évolution de la durée de présence (mois)',
        type: 'line',
        data: [
          { name: 'Jan', 'Camions': 20, 'Bouteilles': 28, 'Équipements': 14 },
          { name: 'Fév', 'Camions': 19, 'Bouteilles': 27, 'Équipements': 13 },
          { name: 'Mar', 'Camions': 18, 'Bouteilles': 26, 'Équipements': 12 },
          { name: 'Avr', 'Camions': 17, 'Bouteilles': 25, 'Équipements': 11 },
          { name: 'Mai', 'Camions': 16, 'Bouteilles': 24, 'Équipements': 10 },
          { name: 'Juin', 'Camions': 15, 'Bouteilles': 23, 'Équipements': 9 }
        ],
        colors: ['#1E88E5', '#FFC107', '#F44336']
      }
    ]
  };
};

export type { WidgetConfig, DashboardConfig };
