import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import { useToast } from '@/hooks/use-toast';
import PrimeDashboardLayout from '@/components/dashboard/PrimeDashboardLayout';
import PrimeChartWidget from '@/components/dashboard/widgets/PrimeChartWidget';
import PrimeStatCard from '@/components/dashboard/widgets/PrimeStatCard';

type Parameter = 'engines' | 'products' | 'time' | 'location' | 'users';

interface KPI {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: number;
  trendLabel?: string;
  progress?: number;
  color?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';
}

const PrimeDashboardExample = () => {
  const { toast } = useToast();
  const [param1, setParam1] = useState<Parameter>('engines');
  const [param2, setParam2] = useState<Parameter>('time');
  
  const parameterOptions = [
    { label: 'Engins', value: 'engines' },
    { label: 'Produits', value: 'products' },
    { label: 'Temps', value: 'time' },
    { label: 'Localisation', value: 'location' },
    { label: 'Utilisateurs', value: 'users' },
  ];
  
  const onParamChange = () => {
    toast({
      title: 'Paramètres mis à jour',
      description: `Affichage des données pour ${param1} et ${param2}`,
    });
  };
  
  const getChartData = () => {
    // Exemple de données pour les différentes combinaisons de paramètres
    if (param1 === 'engines' && param2 === 'time') {
      return [
        { name: 'Jan', Actifs: 65, Inactifs: 28, Total: 93 },
        { name: 'Fév', Actifs: 59, Inactifs: 30, Total: 89 },
        { name: 'Mar', Actifs: 80, Inactifs: 18, Total: 98 },
        { name: 'Avr', Actifs: 81, Inactifs: 19, Total: 100 },
        { name: 'Mai', Actifs: 76, Inactifs: 25, Total: 101 },
        { name: 'Juin', Actifs: 85, Inactifs: 15, Total: 100 },
      ];
    }
    
    if (param1 === 'products' && param2 === 'time') {
      return [
        { name: 'Jan', Vendus: 120, Retournés: 8, Stock: 450 },
        { name: 'Fév', Vendus: 145, Retournés: 12, Stock: 413 },
        { name: 'Mar', Vendus: 132, Retournés: 5, Stock: 426 },
        { name: 'Avr', Vendus: 165, Retournés: 15, Stock: 396 },
        { name: 'Mai', Vendus: 118, Retournés: 9, Stock: 369 },
        { name: 'Juin', Vendus: 128, Retournés: 7, Stock: 334 },
      ];
    }
    
    if (param1 === 'engines' && param2 === 'location') {
      return [
        { name: 'Paris', Actifs: 45, Inactifs: 15, Total: 60 },
        { name: 'Lyon', Actifs: 35, Inactifs: 10, Total: 45 },
        { name: 'Marseille', Actifs: 25, Inactifs: 8, Total: 33 },
        { name: 'Lille', Actifs: 20, Inactifs: 5, Total: 25 },
        { name: 'Bordeaux', Actifs: 18, Inactifs: 7, Total: 25 },
        { name: 'Strasbourg', Actifs: 15, Inactifs: 5, Total: 20 },
      ];
    }
    
    // Données par défaut
    return [
      { name: 'Catégorie A', Valeur1: 120, Valeur2: 60, Valeur3: 30 },
      { name: 'Catégorie B', Valeur1: 100, Valeur2: 80, Valeur3: 40 },
      { name: 'Catégorie C', Valeur1: 86, Valeur2: 55, Valeur3: 90 },
      { name: 'Catégorie D', Valeur1: 99, Valeur2: 66, Valeur3: 70 },
      { name: 'Catégorie E', Valeur1: 85, Valeur2: 22, Valeur3: 110 },
      { name: 'Catégorie F', Valeur1: 65, Valeur2: 122, Valeur3: 50 },
    ];
  };
  
  const getKPIs = (): KPI[] => {
    if (param1 === 'engines' && param2 === 'time') {
      return [
        {
          title: 'Engins actifs',
          value: '85%',
          icon: <i className="pi pi-check-circle"></i>,
          trend: 12,
          trendLabel: 'vs dernier mois',
          progress: 85,
          color: 'success'
        },
        {
          title: 'Temps moyen d\'activité',
          value: '6.4h',
          icon: <i className="pi pi-clock"></i>,
          trend: 3,
          trendLabel: 'vs dernier mois',
          progress: 64,
          color: 'primary'
        },
        {
          title: 'Engins inactifs',
          value: '15%',
          icon: <i className="pi pi-times-circle"></i>,
          trend: -8,
          trendLabel: 'vs dernier mois',
          progress: 15,
          color: 'warning'
        },
        {
          title: 'Total des engins',
          value: '104',
          icon: <i className="pi pi-box"></i>,
          trend: 4,
          trendLabel: 'vs dernier mois',
          color: 'info'
        }
      ];
    }
    
    if (param1 === 'products' && param2 === 'time') {
      return [
        {
          title: 'Produits vendus',
          value: '128',
          icon: <i className="pi pi-shopping-cart"></i>,
          trend: 8,
          trendLabel: 'ce mois',
          progress: 68,
          color: 'success'
        },
        {
          title: 'Revenu total',
          value: '86,240 €',
          icon: <i className="pi pi-euro"></i>,
          trend: 12,
          trendLabel: 'ce mois',
          progress: 72,
          color: 'primary'
        },
        {
          title: 'Taux de retour',
          value: '5.4%',
          icon: <i className="pi pi-replay"></i>,
          trend: -2.1,
          trendLabel: 'ce mois',
          progress: 94.6,
          color: 'info'
        },
        {
          title: 'Stock disponible',
          value: '334',
          icon: <i className="pi pi-box"></i>,
          trend: -10,
          trendLabel: 'ce mois',
          progress: 58,
          color: 'warning'
        }
      ];
    }
    
    // Valeurs par défaut
    return [
      {
        title: 'KPI 1',
        value: '75%',
        icon: <i className="pi pi-chart-bar"></i>,
        trend: 5,
        progress: 75,
        color: 'primary'
      },
      {
        title: 'KPI 2',
        value: '120',
        icon: <i className="pi pi-bolt"></i>,
        trend: 8,
        progress: 65,
        color: 'success'
      },
      {
        title: 'KPI 3',
        value: '25%',
        icon: <i className="pi pi-exclamation-circle"></i>,
        trend: -10,
        progress: 25,
        color: 'danger'
      },
      {
        title: 'KPI 4',
        value: '5240',
        icon: <i className="pi pi-dollar"></i>,
        trend: 15,
        progress: 80,
        color: 'info'
      }
    ];
  };
  
  const renderKPICards = () => {
    const kpis = getKPIs();
    
    return (
      <div className="grid">
        {kpis.map((kpi, index) => (
          <div key={index} className="col-12 md:col-6 lg:col-3 mb-3">
            <PrimeStatCard
              title={kpi.title}
              value={kpi.value}
              icon={kpi.icon}
              trend={kpi.trend}
              trendLabel={kpi.trendLabel}
              progress={kpi.progress}
              color={kpi.color}
              className="h-full"
            />
          </div>
        ))}
      </div>
    );
  };
  
  const renderCharts = () => {
    const data = getChartData();
    
    return (
      <div className="grid mt-3">
        <div className="col-12 lg:col-8 mb-3">
          <PrimeChartWidget
            title={`Évolution par mois - ${parameterOptions.find(p => p.value === param1)?.label} vs ${parameterOptions.find(p => p.value === param2)?.label}`}
            data={data}
            type="line"
            height={350}
            className="h-full"
          />
        </div>
        <div className="col-12 lg:col-4 mb-3">
          <PrimeChartWidget
            title={`Répartition - ${parameterOptions.find(p => p.value === param1)?.label}`}
            data={data}
            type="pie"
            height={350}
            className="h-full"
          />
        </div>
        <div className="col-12 mb-3">
          <PrimeChartWidget
            title={`Comparaison détaillée - ${parameterOptions.find(p => p.value === param1)?.label} et ${parameterOptions.find(p => p.value === param2)?.label}`}
            data={data}
            type="bar"
            height={300}
            className="h-full"
          />
        </div>
      </div>
    );
  };
  
  return (
    <PrimeDashboardLayout title="Tableau de bord">
      <div className="animate-fade-in">
        <Card className="mb-3">
          <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-3">
            <h2 className="text-2xl font-semibold m-0 mb-3 md:mb-0">Configurez votre tableau de bord</h2>
            <div className="flex flex-column sm:flex-row gap-2">
              <Dropdown
                value={param1}
                options={parameterOptions}
                onChange={(e) => setParam1(e.value)}
                placeholder="Sélectionnez un paramètre"
                className="w-full sm:w-12rem"
              />
              <Dropdown
                value={param2}
                options={parameterOptions.filter(p => p.value !== param1)}
                onChange={(e) => setParam2(e.value)}
                placeholder="Sélectionnez un paramètre"
                className="w-full sm:w-12rem"
              />
              <Button
                label="Appliquer"
                icon="pi pi-filter"
                onClick={onParamChange}
              />
            </div>
          </div>
          <Divider className="my-3" />
          <p className="text-color-secondary m-0">
            Visualisez vos KPIs en fonction des paramètres sélectionnés. Choisissez deux paramètres différents pour générer des analyses pertinentes.
          </p>
        </Card>
        
        {renderKPICards()}
        {renderCharts()}
      </div>
    </PrimeDashboardLayout>
  );
};

export default PrimeDashboardExample;
