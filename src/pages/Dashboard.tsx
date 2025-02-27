
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, SendHorizonal, Loader2 } from 'lucide-react';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('principal');
  const [userPrompt, setUserPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [aiRemarks, setAiRemarks] = useState<string[]>([]);
  const [customDashboard, setCustomDashboard] = useState<any[]>([]);

  // Fonction pour traiter la demande de l'utilisateur
  const handlePromptSubmit = () => {
    if (!userPrompt.trim()) return;

    setIsProcessingPrompt(true);
    
    // Simulation du traitement de la demande
    setTimeout(() => {
      setIsProcessingPrompt(false);
      
      // Ajouter des remarques d'IA
      const newRemarks = [
        ...aiRemarks,
        `J'ai analysé votre demande : "${userPrompt.substring(0, 30)}..."`,
        "Voici ce que j'ai trouvé :",
        "Les données montrent une tendance à la baisse pour certains engins.",
        "Recommandation: Un entretien plus régulier pourrait améliorer la disponibilité."
      ];
      
      setAiRemarks(newRemarks);
      
      // Générer un tableau de bord personnalisé
      setCustomDashboard([
        {
          title: "Analyse des retards d'engins",
          type: "bar",
          data: [
            { name: 'Jan', 'Nombre d\'engins': 12, 'Retards': 5 },
            { name: 'Fév', 'Nombre d\'engins': 15, 'Retards': 7 },
            { name: 'Mar', 'Nombre d\'engins': 18, 'Retards': 8 },
            { name: 'Avr', 'Nombre d\'engins': 16, 'Retards': 4 },
            { name: 'Mai', 'Nombre d\'engins': 14, 'Retards': 3 },
            { name: 'Juin', 'Nombre d\'engins': 13, 'Retards': 6 },
          ],
          colors: ['#1E88E5', '#E91E63']
        },
        {
          title: "Causes des retards",
          type: "pie",
          data: [
            { name: 'Maintenance', value: 45 },
            { name: 'Disponibilité', value: 30 },
            { name: 'Problèmes techniques', value: 25 }
          ],
          colors: ['#1E88E5', '#66BB6A', '#FFC107']
        }
      ]);
      
      setUserPrompt('');
    }, 2000);
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

          {/* Nouvel onglet pour IA & Prédictions */}
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
                  {/* Fenêtre des remarques de l'IA */}
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
                  
                  {/* Zone de saisie et résultats */}
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
                      disabled={isProcessingPrompt || !userPrompt.trim()}
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
