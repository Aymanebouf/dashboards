
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, SendHorizonal, Loader2, AlertCircle, Filter } from 'lucide-react';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';
import { analyzeWithAI, checkAIConfiguration, AIAnalysisResponse } from '@/services/aiService';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('principal');
  const [userPrompt, setUserPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [aiRemarks, setAiRemarks] = useState<string[]>([]);
  const [customDashboard, setCustomDashboard] = useState<any[]>([]);
  const [isAIConfigured, setIsAIConfigured] = useState<boolean | null>(null);
  const [aiResponse, setAIResponse] = useState<AIAnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  // Nouveaux états pour la configuration du tableau de bord
  const [parameter1, setParameter1] = useState('engins');
  const [parameter2, setParameter2] = useState('temps');
  const [kpiData, setKpiData] = useState<any>(null);

  // Vérifier si l'IA est configurée au chargement
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

  // Effet pour générer les données KPI en fonction des paramètres
  useEffect(() => {
    generateKPIData(parameter1, parameter2);
  }, [parameter1, parameter2]);

  // Fonction pour générer les données KPI en fonction des paramètres sélectionnés
  const generateKPIData = (param1: string, param2: string) => {
    console.log(`Génération des KPI pour: ${param1} et ${param2}`);
    
    // Définitions des valeurs de base pour tous les types de données
    const baseData = {
      totals: {
        engins: 2845,
        produits: 1560,
        heures: 12450
      },
      growth: {
        engins: 12.5,
        produits: 8.3,
        heures: -2.1
      },
      distribution: {
        engins: [
          { name: 'Bulldozer', value: 35 },
          { name: 'Grue', value: 25 },
          { name: 'Excavateur', value: 20 },
          { name: 'Chariot élévateur', value: 15 },
          { name: 'Autre', value: 5 }
        ],
        produits: [
          { name: 'Béton', value: 45 },
          { name: 'Acier', value: 30 },
          { name: 'Bois', value: 15 },
          { name: 'Autre', value: 10 }
        ],
        temps: [
          { name: 'Matin', value: 40 },
          { name: 'Après-midi', value: 45 },
          { name: 'Soir', value: 15 }
        ]
      },
      monthly: {
        engins: [
          { name: 'Jan', value: 45 },
          { name: 'Fév', value: 52 },
          { name: 'Mar', value: 49 },
          { name: 'Avr', value: 63 },
          { name: 'Mai', value: 58 },
          { name: 'Juin', value: 64 }
        ],
        produits: [
          { name: 'Jan', value: 35 },
          { name: 'Fév', value: 42 },
          { name: 'Mar', value: 39 },
          { name: 'Avr', value: 53 },
          { name: 'Mai', value: 48 },
          { name: 'Juin', value: 54 }
        ],
        temps: [
          { name: 'Jan', value: 160 },
          { name: 'Fév', value: 165 },
          { name: 'Mar', value: 170 },
          { name: 'Avr', value: 175 },
          { name: 'Mai', value: 180 },
          { name: 'Juin', value: 185 }
        ]
      },
      status: {
        engins: [
          { name: 'Actif', value: 65 },
          { name: 'En pause', value: 20 },
          { name: 'En maintenance', value: 15 }
        ],
        produits: [
          { name: 'En stock', value: 55 },
          { name: 'En transit', value: 25 },
          { name: 'Épuisé', value: 20 }
        ],
        temps: [
          { name: 'Productif', value: 70 },
          { name: 'Pause', value: 20 },
          { name: 'Inactif', value: 10 }
        ]
      }
    };
    
    // Créer des données spécifiques en fonction des paramètres sélectionnés
    let combinedData: any = {
      kpiCards: [],
      charts: []
    };
    
    // KPI Cards - toujours 4 cartes avec des statistiques pertinentes
    if (param1 === 'engins' && param2 === 'temps') {
      combinedData.kpiCards = [
        { title: 'Heures d\'utilisation', value: '12,450', trend: '+3.2%', description: 'Total des heures d\'utilisation des engins' },
        { title: 'Taux d\'activité', value: '65%', trend: '+5.2%', description: 'Pourcentage du temps où les engins sont actifs' },
        { title: 'Engins en service', value: '1,845', trend: '+12.5%', description: 'Nombre total d\'engins actuellement en service' },
        { title: 'Temps moyen/engin', value: '4.3h', trend: '-2.1%', description: 'Temps moyen d\'utilisation par engin par jour' }
      ];
      
      combinedData.charts = [
        { 
          title: 'Utilisation des engins par période', 
          type: 'bar',
          data: [
            { name: 'Matin', 'Bulldozer': 25, 'Grue': 15, 'Excavateur': 20 },
            { name: 'Après-midi', 'Bulldozer': 30, 'Grue': 20, 'Excavateur': 25 },
            { name: 'Soir', 'Bulldozer': 15, 'Grue': 10, 'Excavateur': 10 }
          ],
          colors: ['#1E88E5', '#42A5F5', '#90CAF9']
        },
        {
          title: 'Répartition du temps par type d\'engin',
          type: 'pie',
          data: [
            { name: 'Bulldozer', value: 42 },
            { name: 'Grue', value: 28 },
            { name: 'Excavateur', value: 30 }
          ],
          colors: ['#4CAF50', '#FFC107', '#F44336']
        }
      ];
    } 
    else if (param1 === 'engins' && param2 === 'produits') {
      combinedData.kpiCards = [
        { title: 'Production totale', value: '1,560t', trend: '+8.3%', description: 'Tonnes de matériaux déplacés par les engins' },
        { title: 'Rendement moyen', value: '0.55t/h', trend: '+5.0%', description: 'Tonnes traitées par heure de fonctionnement' },
        { title: 'Engins actifs', value: '1,845', trend: '+12.5%', description: 'Nombre d\'engins contribuant à la production' },
        { title: 'Efficacité', value: '78%', trend: '+2.3%', description: 'Ratio entre production réelle et capacité théorique' }
      ];
      
      combinedData.charts = [
        { 
          title: 'Production par type d\'engin', 
          type: 'bar',
          data: [
            { name: 'Béton', 'Bulldozer': 120, 'Grue': 200, 'Excavateur': 80 },
            { name: 'Acier', 'Bulldozer': 50, 'Grue': 300, 'Excavateur': 30 },
            { name: 'Bois', 'Bulldozer': 30, 'Grue': 150, 'Excavateur': 20 }
          ],
          colors: ['#1E88E5', '#42A5F5', '#90CAF9']
        },
        {
          title: 'Allocation des engins par produit',
          type: 'pie',
          data: [
            { name: 'Béton', value: 45 },
            { name: 'Acier', value: 35 },
            { name: 'Bois', value: 20 }
          ],
          colors: ['#4CAF50', '#FFC107', '#F44336']
        }
      ];
    }
    else if (param1 === 'produits' && param2 === 'temps') {
      combinedData.kpiCards = [
        { title: 'Production horaire', value: '125kg/h', trend: '+7.3%', description: 'Taux de production moyenne par heure' },
        { title: 'Heures de production', value: '8,750h', trend: '+2.1%', description: 'Temps total dédié à la production' },
        { title: 'Taux de livraison', value: '94%', trend: '+3.5%', description: 'Pourcentage de livraisons dans les délais' },
        { title: 'Temps d\'inactivité', value: '1,230h', trend: '-5.2%', description: 'Heures d\'arrêt de production' }
      ];
      
      combinedData.charts = [
        { 
          title: 'Production par période de la journée', 
          type: 'bar',
          data: [
            { name: 'Béton', 'Matin': 520, 'Après-midi': 630, 'Soir': 210 },
            { name: 'Acier', 'Matin': 320, 'Après-midi': 450, 'Soir': 130 },
            { name: 'Bois', 'Matin': 180, 'Après-midi': 220, 'Soir': 80 }
          ],
          colors: ['#1E88E5', '#42A5F5', '#90CAF9']
        },
        {
          title: 'Répartition du temps de production',
          type: 'pie',
          data: [
            { name: 'Béton', value: 55 },
            { name: 'Acier', value: 30 },
            { name: 'Bois', value: 15 }
          ],
          colors: ['#4CAF50', '#FFC107', '#F44336']
        }
      ];
    }
    else {
      // Configuration par défaut si la combinaison n'est pas spécifiquement définie
      combinedData.kpiCards = [
        { title: 'Total Engins', value: '2,845', trend: '+12.5%', description: 'Nombre total d\'engins' },
        { title: 'Activations', value: '1,257', trend: '+5.2%', description: 'Nombre d\'activations' },
        { title: 'Production', value: '1,560t', trend: '+8.3%', description: 'Tonnes produites' },
        { title: 'Heures totales', value: '12,450h', trend: '+3.2%', description: 'Heures d\'opération' }
      ];
      
      combinedData.charts = [
        { 
          title: 'Performance mensuelle', 
          type: 'line',
          data: baseData.monthly[param1 === 'temps' ? 'engins' : param1],
          colors: ['#1E88E5']
        },
        {
          title: `Répartition par ${param1}`,
          type: 'pie',
          data: baseData.distribution[param1],
          colors: ['#4CAF50', '#FFC107', '#F44336', '#9C27B0', '#673AB7']
        }
      ];
    }
    
    setKpiData(combinedData);
  };

  // Fonction pour traiter la demande de l'utilisateur
  const handlePromptSubmit = async () => {
    if (!userPrompt.trim()) return;
    
    // Vérification de la configuration de l'IA avant l'envoi
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
      
      // Utiliser l'API réelle pour analyser le prompt
      const result = await analyzeWithAI(userPrompt);
      console.log("Réponse de l'API:", result);
      
      // Vérification que les données reçues sont bien formatées
      if (!result || !result.remarks || !result.customInsights) {
        console.error("Format de réponse inattendu:", result);
        throw new Error("Format de réponse inattendu");
      }
      
      // Mise à jour de l'état avec les données reçues
      setAIResponse(result);
      setAiRemarks(Array.isArray(result.remarks) ? result.remarks : []);
      setCustomDashboard(Array.isArray(result.customInsights) ? result.customInsights : []);
      
      toast.success('Tableau de bord personnalisé généré !');
    } catch (error: any) {
      console.error('Erreur lors de l\'analyse:', error);
      
      // Gestion spécifique des erreurs
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
      
      // Réinitialisation des données pour éviter d'afficher des résultats partiels/incorrects
      setAIResponse(null);
      setAiRemarks([]);
      setCustomDashboard([]);
    } finally {
      setIsProcessingPrompt(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
          <div className="flex items-center space-x-2">
            {/* Boutons d'action */}
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
            {/* Sélecteurs de paramètres */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Filter className="mr-2 h-5 w-5 text-gray-500" />
                  Configuration du tableau de bord
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Paramètre 1</label>
                    <Select 
                      value={parameter1} 
                      onValueChange={setParameter1}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un paramètre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engins">Engins</SelectItem>
                        <SelectItem value="produits">Produits</SelectItem>
                        <SelectItem value="temps">Temps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Paramètre 2</label>
                    <Select 
                      value={parameter2} 
                      onValueChange={setParameter2}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un paramètre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="engins">Engins</SelectItem>
                        <SelectItem value="produits">Produits</SelectItem>
                        <SelectItem value="temps">Temps</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPI Cards */}
            {kpiData && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {kpiData.kpiCards.map((card: any, index: number) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">
                        {card.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{card.value}</div>
                      <p className="text-xs text-muted-foreground">
                        {card.trend.startsWith('+') ? (
                          <span className="text-green-500">{card.trend}</span>
                        ) : (
                          <span className="text-red-500">{card.trend}</span>
                        )} par rapport au mois dernier
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {card.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Charts */}
            {kpiData && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kpiData.charts.map((chart: any, index: number) => (
                  <Card key={index}>
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
            <Card>
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
            <Card>
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

          {/* Onglet IA & Prédictions */}
          <TabsContent value="ia-predictions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <Brain className="mr-2 text-purple-500" size={20} />
                  Assistant d'Intelligence Artificielle
                </CardTitle>
              </CardHeader>
              <CardContent>
                {errorMessage && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Erreur</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
                
                <div className="flex gap-4">
                  {/* Zone de saisie à gauche (2/3 de la largeur) */}
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
                    
                    {/* Tableau de bord personnalisé généré */}
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
                  
                  {/* Fenêtre des remarques à droite (1/3 de la largeur) */}
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
              </CardContent>
            </Card>
            
            {/* Autres cartes avec des prédictions IA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Prédictions d'utilisation</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartWidget
                    title=""
                    data={[
                      { name: 'Jan', 'Prévision': 65, 'Réel': 60 },
                      { name: 'Fév', 'Prévision': 70, 'Réel': 68 },
                      { name: 'Mar', 'Prévision': 75, 'Réel': 72 },
                      { name: 'Avr', 'Prévision': 80, 'Réel': null },
                      { name: 'Mai', 'Prévision': 85, 'Réel': null },
                    ]}
                    type="line"
                    colors={['#8884d8', '#82ca9d']}
                    height={200}
                    showControls={false}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Prévision de maintenance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartWidget
                    title=""
                    data={[
                      { name: 'Bulldozer', value: 25 },
                      { name: 'Grue', value: 15 },
                      { name: 'Excavateur', value: 35 },
                      { name: 'Chariot élévateur', value: 25 },
                    ]}
                    type="pie"
                    colors={['#0088FE', '#00C49F', '#FFBB28', '#FF8042']}
                    height={200}
                    showControls={false}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
