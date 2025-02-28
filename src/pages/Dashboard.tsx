
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, SendHorizonal, Loader2, AlertCircle } from 'lucide-react';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';
import { analyzeWithAI, checkAIConfiguration, AIAnalysisResponse } from '@/services/aiService';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('principal');
  const [userPrompt, setUserPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [aiRemarks, setAiRemarks] = useState<string[]>([]);
  const [customDashboard, setCustomDashboard] = useState<any[]>([]);
  const [isAIConfigured, setIsAIConfigured] = useState<boolean | null>(null);
  const [aiResponse, setAIResponse] = useState<AIAnalysisResponse | null>(null);

  // Vérifier si l'IA est configurée au chargement
  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        const configured = await checkAIConfiguration();
        setIsAIConfigured(configured);
        if (!configured) {
          console.log('L\'IA n\'est pas configurée. Une clé API OpenAI est nécessaire.');
          toast.error('Veuillez configurer la clé API OpenAI pour utiliser les fonctionnalités d\'IA');
        } else {
          console.log('L\'IA est correctement configurée');
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de l'API OpenAI:", error);
        setIsAIConfigured(false);
      }
    };
    
    checkConfiguration();
  }, []);

  // Fonction pour traiter la demande de l'utilisateur
  const handlePromptSubmit = async () => {
    if (!userPrompt.trim()) return;
    if (!isAIConfigured) {
      toast.error('L\'IA n\'est pas configurée. Veuillez configurer une clé API OpenAI.');
      return;
    }

    setIsProcessingPrompt(true);
    toast.info('Analyse de votre demande en cours...');

    try {
      console.log("Envoi de la requête à l'API avec prompt:", userPrompt);
      // Utiliser l'API réelle pour analyser le prompt
      const result = await analyzeWithAI(userPrompt);
      console.log("Réponse de l'API:", result);
      
      setAIResponse(result);
      
      // Mettre à jour les remarques avec les résultats réels
      setAiRemarks(result.remarks);
      
      // Mettre à jour le tableau de bord personnalisé avec les données réelles
      setCustomDashboard(result.customInsights);
      
      toast.success('Tableau de bord personnalisé généré !');
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast.error('Erreur lors de l\'analyse de votre demande');
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Engins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,845</div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Activations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,257</div>
                  <p className="text-xs text-muted-foreground">
                    +5.2% par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    Alertes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">48</div>
                  <p className="text-xs text-muted-foreground">
                    -2.5% par rapport au mois dernier
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Utilisation des engins</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartWidget
                    title=""
                    data={[
                      { name: 'Jan', value: 45 },
                      { name: 'Fév', value: 52 },
                      { name: 'Mar', value: 49 },
                      { name: 'Avr', value: 63 },
                      { name: 'Mai', value: 58 },
                      { name: 'Juin', value: 64 },
                    ]}
                    type="bar"
                    colors={['#1E88E5']}
                    height={300}
                  />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Types d'engins</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartWidget
                    title=""
                    data={[
                      { name: 'Bulldozer', value: 35 },
                      { name: 'Grue', value: 25 },
                      { name: 'Excavateur', value: 20 },
                      { name: 'Chariot élévateur', value: 15 },
                      { name: 'Autre', value: 5 },
                    ]}
                    type="pie"
                    colors={['#1E88E5', '#42A5F5', '#90CAF9', '#BBDEFB', '#E3F2FD']}
                    height={300}
                  />
                </CardContent>
              </Card>
            </div>
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
                <div className="flex gap-4">
                  {/* MODIFICATION: Zone de saisie maintenant à gauche (2/3 de la largeur) */}
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
                    {customDashboard.length > 0 && (
                      <div className="grid grid-cols-2 gap-4 mt-6">
                        {customDashboard.map((chart, index) => (
                          <Card key={index}>
                            <CardContent className="pt-6">
                              <ChartWidget
                                title={chart.title}
                                data={chart.data}
                                type={chart.type}
                                colors={chart.colors}
                                height={240}
                              />
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* MODIFICATION: Fenêtre des remarques maintenant à droite (1/3 de la largeur) */}
                  <div className="w-1/3 bg-muted/20 rounded-lg p-4 space-y-3 h-64 overflow-y-auto border">
                    <h3 className="text-sm font-medium">Remarques de l'IA</h3>
                    {aiRemarks.length > 0 ? (
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
