
import { useState, useEffect } from 'react';

interface KPICard {
  title: string;
  value: string;
  trend?: string | null;
  description: string;
}

interface ChartData {
  title: string;
  type: 'bar' | 'line' | 'area' | 'pie' | 'composed';
  data: any[];
  colors: string[];
}

interface DashboardData {
  title: string;
  kpiCards: KPICard[];
  charts: ChartData[];
}

export const useDashboardData = (selectedDashboard: string) => {
  const [dashboardTitle, setDashboardTitle] = useState('');
  const [kpiData, setKpiData] = useState<DashboardData | null>(null);

  useEffect(() => {
    generateDashboardData(selectedDashboard);
  }, [selectedDashboard]);

  const generateDashboardData = (dashboardId: string) => {
    console.log(`Génération des données pour le dashboard: ${dashboardId}`);
    
    let dashboardData: DashboardData = {
      title: '',
      kpiCards: [],
      charts: []
    };
    
    switch(dashboardId) {
      case 'duree-presence':
        dashboardData.title = 'Durée de présence des engins';
        dashboardData.kpiCards = [
          { title: 'Durée moyenne', value: '18.5 jours', trend: '+5.2%', description: 'Durée moyenne de présence des engins chez un client' },
          { title: 'Camions en retard', value: '15', trend: '-12.5%', description: 'Nombre de camions dépassant la durée prévue' },
          { title: 'Bouteilles en attente', value: '257', trend: '+8.3%', description: 'Nombre de bouteilles en attente de retour' },
          { title: 'Taux de rotation', value: '3.7x', trend: '+10.2%', description: 'Taux de rotation mensuel des équipements' }
        ];
        dashboardData.charts = [
          { 
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
        ];
        break;
      
      case 'classement-clients':
        dashboardData.title = 'Classement des clients par temps d\'occupation';
        dashboardData.kpiCards = [
          { title: 'Client principal', value: 'Acme Inc.', trend: null, description: '25% du temps total d\'occupation' },
          { title: 'Durée totale', value: '12,450h', trend: '+7.2%', description: 'Temps cumulé chez tous les clients' },
          { title: 'Nombre de clients', value: '87', trend: '+5.1%', description: 'Total des clients actifs ce mois' },
          { title: 'Taux d\'engagement', value: '84%', trend: '+3.8%', description: 'Pourcentage de clients réguliers' }
        ];
        dashboardData.charts = [
          { 
            title: 'Top 10 des clients par temps d\'occupation', 
            type: 'bar',
            data: [
              { name: 'Acme Inc.', 'Heures': 2380 },
              { name: 'Global Tech', 'Heures': 1950 },
              { name: 'BTP Express', 'Heures': 1720 },
              { name: 'Construct+', 'Heures': 1540 },
              { name: 'TechBuild', 'Heures': 1380 },
              { name: 'EcoBTP', 'Heures': 1240 },
              { name: 'Bâtir Pro', 'Heures': 1100 },
              { name: 'MégaConstruct', 'Heures': 980 },
              { name: 'BuildAll', 'Heures': 890 },
              { name: 'Express TP', 'Heures': 780 }
            ],
            colors: ['#2196F3']
          },
          {
            title: 'Répartition des clients par secteur',
            type: 'pie',
            data: [
              { name: 'BTP', value: 45 },
              { name: 'Industrie', value: 25 },
              { name: 'Logistique', value: 15 },
              { name: 'Services', value: 10 },
              { name: 'Autres', value: 5 }
            ],
            colors: ['#4CAF50', '#FFC107', '#F44336', '#9C27B0', '#795548']
          }
        ];
        break;
      
      case 'utilisation-engins':
        dashboardData.title = 'Suivi de l\'utilisation des engins';
        dashboardData.kpiCards = [
          { title: 'Distance totale', value: '156,240 km', trend: '+12.3%', description: 'Distance totale parcourue par tous les engins' },
          { title: 'Engin le plus utilisé', value: 'Bulldozer XR7', trend: null, description: '12,450 km parcourus' },
          { title: 'Utilisation moyenne', value: '65%', trend: '+5.4%', description: 'Taux d\'utilisation moyen de la flotte' },
          { title: 'Coût kilométrique', value: '0.45€/km', trend: '-2.1%', description: 'Coût moyen par kilomètre parcouru' }
        ];
        dashboardData.charts = [
          { 
            title: 'Distance parcourue par semaine (km)', 
            type: 'line',
            data: [
              { name: 'Semaine 1', 'Distance': 25600 },
              { name: 'Semaine 2', 'Distance': 28400 },
              { name: 'Semaine 3', 'Distance': 30200 },
              { name: 'Semaine 4', 'Distance': 32800 },
              { name: 'Semaine 5', 'Distance': 35600 },
              { name: 'Semaine 6', 'Distance': 32400 }
            ],
            colors: ['#FF5722']
          },
          {
            title: 'Top 5 des engins par distance (km)',
            type: 'bar',
            data: [
              { name: 'Bulldozer XR7', 'Distance': 12450 },
              { name: 'Pelle mécanique M8', 'Distance': 10200 },
              { name: 'Chargeuse L5', 'Distance': 8900 },
              { name: 'Camion benne T9', 'Distance': 7800 },
              { name: 'Niveleuse G3', 'Distance': 6500 }
            ],
            colors: ['#3F51B5']
          }
        ];
        break;
      
      case 'analyse-stocks':
        dashboardData.title = 'Analyse des stocks et mouvements';
        dashboardData.kpiCards = [
          { title: 'Stock total', value: '3,845 unités', trend: '+3.2%', description: 'Nombre total d\'unités en stock' },
          { title: 'Entrées hebdo', value: '524 unités', trend: '+8.5%', description: 'Entrées moyennes par semaine' },
          { title: 'Sorties hebdo', value: '489 unités', trend: '+6.3%', description: 'Sorties moyennes par semaine' },
          { title: 'Temps moyen', value: '14.2 jours', trend: '-5.1%', description: 'Temps moyen en stock avant expédition' }
        ];
        dashboardData.charts = [
          { 
            title: 'Mouvements hebdomadaires des stocks', 
            type: 'bar',
            data: [
              { name: 'Semaine 1', 'Entrées': 510, 'Sorties': 480 },
              { name: 'Semaine 2', 'Entrées': 520, 'Sorties': 490 },
              { name: 'Semaine 3', 'Entrées': 530, 'Sorties': 495 },
              { name: 'Semaine 4', 'Entrées': 540, 'Sorties': 500 }
            ],
            colors: ['#4CAF50', '#F44336']
          },
          {
            title: 'Temps de stockage par catégorie (jours)',
            type: 'area',
            data: [
              { name: 'Jan', 'Équipements': 16, 'Pièces détachées': 12, 'Consommables': 7 },
              { name: 'Fév', 'Équipements': 15.5, 'Pièces détachées': 11.5, 'Consommables': 6.5 },
              { name: 'Mar', 'Équipements': 15, 'Pièces détachées': 11, 'Consommables': 6 },
              { name: 'Avr', 'Équipements': 14.5, 'Pièces détachées': 10.5, 'Consommables': 5.5 },
              { name: 'Mai', 'Équipements': 14, 'Pièces détachées': 10, 'Consommables': 5 }
            ],
            colors: ['#9C27B0', '#FF9800', '#03A9F4']
          }
        ];
        break;
      
      case 'frequence-visite':
        dashboardData.title = 'Fréquence de visite chez les clients';
        dashboardData.kpiCards = [
          { title: 'Visites mensuelles', value: '1,245', trend: '+9.7%', description: 'Nombre total de visites par mois' },
          { title: 'Client le plus visité', value: 'TechBuild', trend: null, description: '45 visites au cours du dernier mois' },
          { title: 'Moyenne par client', value: '14.3', trend: '+4.2%', description: 'Nombre moyen de visites par client' },
          { title: 'Clients inactifs', value: '12', trend: '-15.3%', description: 'Clients sans visite depuis plus de 30 jours' }
        ];
        dashboardData.charts = [
          { 
            title: 'Top 6 des clients les plus visités', 
            type: 'bar',
            data: [
              { name: 'TechBuild', 'Visites': 45 },
              { name: 'Acme Inc.', 'Visites': 38 },
              { name: 'Global Tech', 'Visites': 32 },
              { name: 'BTP Express', 'Visites': 28 },
              { name: 'Construct+', 'Visites': 25 },
              { name: 'EcoBTP', 'Visites': 22 }
            ],
            colors: ['#673AB7']
          },
          {
            title: 'Clients sans visite récente (jours depuis dernière visite)',
            type: 'bar',
            data: [
              { name: 'MiniConst', 'Jours': 45 },
              { name: 'MatBat', 'Jours': 38 },
              { name: 'UrbanDev', 'Jours': 35 },
              { name: 'TopBuild', 'Jours': 32 },
              { name: 'ConceptBTP', 'Jours': 30 }
            ],
            colors: ['#E91E63']
          }
        ];
        break;
        
      default:
        dashboardData.title = 'Tableau de bord général';
        dashboardData.kpiCards = [
          { title: 'Total Engins', value: '2,845', trend: '+12.5%', description: 'Nombre total d\'engins' },
          { title: 'Activations', value: '1,257', trend: '+5.2%', description: 'Nombre d\'activations' },
          { title: 'Production', value: '1,560t', trend: '+8.3%', description: 'Tonnes produites' },
          { title: 'Heures totales', value: '12,450h', trend: '+3.2%', description: 'Heures d\'opération' }
        ];
        dashboardData.charts = [
          { 
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
          }
        ];
    }
    
    setDashboardTitle(dashboardData.title);
    setKpiData(dashboardData);
  };

  return { dashboardTitle, kpiData };
};

export default useDashboardData;
