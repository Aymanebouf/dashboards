import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, SendHorizonal, Loader2, AlertCircle, BarChart, TrendingUp, Timer, Package, Users, Calendar, TruckIcon, Home, Box, Briefcase, BarChart2, Clock } from 'lucide-react';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';
import { analyzeWithAI, checkAIConfiguration, AIAnalysisResponse } from '@/services/aiService';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('principal');
  const [userPrompt, setUserPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [aiRemarks, setAiRemarks] = useState<string[]>([]);
  const [customDashboard, setCustomDashboard] = useState<any[]>([]);
  const [isAIConfigured, setIsAIConfigured] = useState<boolean | null>(null);
  const [aiResponse, setAIResponse] = useState<AIAnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const [selectedDashboard, setSelectedDashboard] = useState('duree-presence');
  const [dashboardTitle, setDashboardTitle] = useState('Durée de présence des engins');
  const [kpiData, setKpiData] = useState<any>(null);

  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        const configured = await checkAIConfiguration();
        setIsAIConfigured(configured);
        if (!configured) {
          console.log('L\'IA n\'est pas configurée. Une clé API OpenAI est nécessaire.');
          toast.error('Veuillez configurer la clé API OpenAI pour utiliser les fonctionnalités d\'IA');
          setErrorMessage('La clé API OpenAI n\'est pas configurée. Veuillez vérifier le fichier api/.env');
        } else {
          console.log('L\'IA est correctement configurée');
          setErrorMessage(null);
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'API OpenAI:", error);
        setIsAIConfigured(false);
        setErrorMessage('Impossible de se connecter à l\'API. Vérifiez que le serveur Flask est en cours d\'exécution.');
      }
    };
    
    checkConfiguration();
  }, []);

  useEffect(() => {
    generateDashboardData(selectedDashboard);
  }, [selectedDashboard]);

  const dashboards = [
    { id: 'duree-presence', label: 'Durée de présence des engins', icon: <Clock className="h-4 w-4" /> },
    { id: 'classement-clients', label: 'Classement des clients', icon: <Users className="h-4 w-4" /> },
    { id: 'utilisation-engins', label: 'Suivi de l\'utilisation des engins', icon: <TruckIcon className="h-4 w-4" /> },
    { id: 'analyse-stocks', label: 'Analyse des stocks et mouvements', icon: <Box className="h-4 w-4" /> },
    { id: 'frequence-visite', label: 'Fréquence de visite chez un client', icon: <Calendar className="h-4 w-4" /> }
  ];

  const generateDashboardData = (dashboardId: string) => {
    console.log(`Génération des données pour le dashboard: ${dashboardId}`);
    
    let dashboardData: any = {
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

  const handlePromptSubmit = async () => {
    if (!userPrompt.trim()) return;
    
    if (!isAIConfigured) {
      toast.error('L\'IA n\'est pas configurée. Veuillez configurer une clé API OpenAI.');
      setErrorMessage('La clé API OpenAI n\'est pas configurée. Veuillez vérifier le fichier api/.env');
      return;
    }

    setIsProcessingPrompt(true);
    setErrorMessage(null);
    toast.info('Analyse de votre demande en cours...');

    try {
      console.log("Envoi de la requête à l'API avec prompt:", userPrompt);
      
      const result = await analyzeWithAI(userPrompt);
      console.log("Réponse de l'API:", result);
      
      if (!result || !result.remarks || !result.customInsights) {
        console.error("Format de réponse inattendu:", result);
        throw new Error("Format de réponse inattendu");
      }
      
      setAIResponse(result);
      setAiRemarks(Array.isArray(result.remarks) ? result.remarks : []);
      setCustomDashboard(Array.isArray(result.customInsights) ? result.customInsights : []);
      
      toast.success('Tableau de bord personnalisé généré !');
    } catch (error: any) {
      console.error('Erreur lors de l\'analyse:', error);
      
      if (error.code === 'ERR_NETWORK') {
        setErrorMessage('Impossible de se connecter au serveur API. Vérifiez que le serveur Flask est en cours d\'exécution.');
        toast.error('Erreur de connexion au serveur API');
      } else if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(`Erreur: ${error.response.data.error}`);
        toast.error(error.response.data.error);
      } else {
        setErrorMessage('Une erreur s\'est produite lors de l\'analyse de votre demande');
        toast.error('Erreur lors de l\'analyse de votre demande');
      }
      
      setAIResponse(null);
      setAiRemarks([]);
      setCustomDashboard([]);
    } finally {
      setIsProcessingPrompt(false);
    }
  };

  const handleDashboardChange = (dashboardId: string) => {
    setSelectedDashboard(dashboardId);
    const dashboard = dashboards.find(d => d.id === dashboardId);
    if (dashboard) {
      toast.success(`Tableau de bord "${dashboard.label}" chargé`);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">{dashboardTitle}</h1>
          <div className="flex items-center space-x-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <BarChart2 className="h-4 w-4" />
                  <span>Tableaux de bord</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px]">
                <DropdownMenuLabel>Sélectionner un tableau de bord</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dashboards.map((dashboard) => (
                  <DropdownMenuItem 
                    key={dashboard.id}
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => handleDashboardChange(dashboard.id)}
                  >
                    {dashboard.icon}
                    <span>{dashboard.label}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm">
              Exporter
            </Button>
            <Button variant="outline" size="sm">
              Imprimer
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="bg-muted/60">
            <TabsTrigger value="principal">Principal</TabsTrigger>
            <TabsTrigger value="analytique">Analytique</TabsTrigger>
            <TabsTrigger value="personnalise">Personnalisé</TabsTrigger>
            <TabsTrigger value="ia-predictions">IA & Prédictions</TabsTrigger>
          </TabsList>

          <TabsContent value="principal" className="space-y-4">
            {kpiData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {kpiData.kpiCards.map((card: any, index: number) => (
                  <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {card.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{card.value}</div>
                      {card.trend && (
                        <p className="text-xs text-muted-foreground">
                          {card.trend.startsWith('+') ? (
                            <span className="text-green-500">{card.trend}</span>
                          ) : (
                            <span className="text-red-500">{card.trend}</span>
                          )} par rapport au mois dernier
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {kpiData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kpiData.charts.map((chart: any, index: number) => (
                  <Card key={index} className="shadow-md hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <CardTitle>{chart.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ChartWidget
                        title=""
                        data={chart.data}
                        type={chart.type}
                        colors={chart.colors}
                        height={300}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytique" className="space-y-4">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Activité des engins</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartWidget
                  title=""
                  data={[
                    { name: 'Jan', 'En activité': 45, 'En pause': 25, 'En maintenance': 15 },
                    { name: 'Fév', 'En activité': 50, 'En pause': 20, 'En maintenance': 12 },
                    { name: 'Mar', 'En activité': 55, 'En pause': 22, 'En maintenance': 10 },
                    { name: 'Avr', 'En activité': 60, 'En pause': 18, 'En maintenance': 8 },
                    { name: 'Mai', 'En activité': 65, 'En pause': 15, 'En maintenance': 7 },
                    { name: 'Juin', 'En activité': 70, 'En pause': 10, 'En maintenance': 6 },
                  ]}
                  type="area"
                  colors={['#4CAF50', '#FFC107', '#F44336']}
                  height={400}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="personnalise" className="space-y-4">
            <Card className="shadow-md hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle>Performance des sites</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartWidget
                  title=""
                  data={[
                    { name: 'Site A', value: 4000 },
                    { name: 'Site B', value: 3000 },
                    { name: 'Site C', value: 2000 },
                    { name: 'Site D', value: 2780 },
                    { name: 'Site E', value: 1890 },
                    { name: 'Site F', value: 2390 },
                    { name: 'Site G', value: 3490 },
                  ]}
                  type="bar"
                  colors={['#8884d8']}
                  height={400}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ia-predictions" className="space-y-4">
            {errorMessage && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Erreur</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex gap-4">
              <div className="w-2/3 space-y-4">
                <div className="flex gap-2">
                  <Textarea 
                    placeholder="Exemple: Je veux voir les engins qui sont en retard l'année précédente"
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    className="min-h-24"
                  />
                </div>
                <Button 
                  className="ml-auto flex items-center" 
                  onClick={handlePromptSubmit}
                  disabled={isProcessingPrompt || !userPrompt.trim() || isAIConfigured === false}
                >
                  {isProcessingPrompt ? (
                    <>
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Analyse en cours...
                    </>
                  ) : (
                    <>
                      <SendHorizonal size={16} className="mr-2" />
                      Générer le tableau de bord
                    </>
                  )}
                </Button>
                
                {customDashboard && customDashboard.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {customDashboard.map((chart, index) => (
                      <Card key={index}>
                        <CardContent className="pt-6">
                          <ChartWidget
                            title={chart.title || ""}
                            data={Array.isArray(chart.data) ? chart.data : []}
                            type={chart.type || "bar"}
                            colors={Array.isArray(chart.colors) ? chart.colors : ["#1E88E5"]}
                            height={240}
                          />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="w-1/3 bg-muted/20 rounded-lg p-4 space-y-3 h-64 overflow-y-auto border">
                <h3 className="text-sm font-medium">Remarques de l'IA</h3>
                {aiRemarks && aiRemarks.length > 0 ? (
                  <div className="space-y-2">
                    {aiRemarks.map((remark, index) => (
                      <div key={index} className="p-2 bg-background border rounded-md text-xs">
                        {remark}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    Les remarques de l'IA apparaîtront ici après votre demande
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
