
import React, { useState } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Calendar, Download, FileInput, LineChart, Loader2, RefreshCcw, Upload } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';

// Données fictives pour les prédictions
const predictionData = [
  { name: 'Aug', 'Actual': 65, 'Predicted': 68 },
  { name: 'Sep', 'Actual': 59, 'Predicted': 57 },
  { name: 'Oct', 'Actual': 80, 'Predicted': 82 },
  { name: 'Nov', 'Actual': 81, 'Predicted': 78 },
  { name: 'Dec', 'Actual': 56, 'Predicted': 58 },
  { name: 'Jan', 'Predicted': 76 },
  { name: 'Feb', 'Predicted': 84 },
  { name: 'Mar', 'Predicted': 92 },
];

// Données fictives pour les tendances
const trendsData = [
  { name: 'Jan', 'Trend': 50, 'Confidence Upper': 55, 'Confidence Lower': 45 },
  { name: 'Feb', 'Trend': 53, 'Confidence Upper': 58, 'Confidence Lower': 48 },
  { name: 'Mar', 'Trend': 57, 'Confidence Upper': 63, 'Confidence Lower': 51 },
  { name: 'Apr', 'Trend': 62, 'Confidence Upper': 68, 'Confidence Lower': 56 },
  { name: 'May', 'Trend': 68, 'Confidence Upper': 74, 'Confidence Lower': 62 },
  { name: 'Jun', 'Trend': 74, 'Confidence Upper': 81, 'Confidence Lower': 67 },
  { name: 'Jul', 'Trend': 81, 'Confidence Upper': 88, 'Confidence Lower': 74 },
];

// Données fictives pour les anomalies
const anomaliesData = [
  { name: '01/01', 'Value': 35, 'Threshold': 70 },
  { name: '02/01', 'Value': 40, 'Threshold': 70 },
  { name: '03/01', 'Value': 45, 'Threshold': 70 },
  { name: '04/01', 'Value': 50, 'Threshold': 70 },
  { name: '05/01', 'Value': 90, 'Threshold': 70, 'isAnomaly': true },
  { name: '06/01', 'Value': 55, 'Threshold': 70 },
  { name: '07/01', 'Value': 60, 'Threshold': 70 },
  { name: '08/01', 'Value': 95, 'Threshold': 70, 'isAnomaly': true },
  { name: '09/01', 'Value': 65, 'Threshold': 70 },
  { name: '10/01', 'Value': 70, 'Threshold': 70 },
];

// Simuler un appel API pour les prédictions
const fetchPredictions = async () => {
  // Simule un délai d'API
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return predictionData;
};

const AIPredictions = () => {
  const [selectedModel, setSelectedModel] = useState('linear');
  const [timeRange, setTimeRange] = useState('3');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const { data: predictions, isLoading, refetch } = useQuery({
    queryKey: ['predictions', selectedModel, timeRange],
    queryFn: fetchPredictions,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleModelTrain = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simulation de l'entraînement du modèle
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 10);
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast.success('Modèle entraîné avec succès !');
          refetch();
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Simuler le téléchargement
      toast.info('Téléchargement du fichier en cours...');
      
      setTimeout(() => {
        toast.success('Fichier téléchargé avec succès !');
        // Reset le champ de fichier
        e.target.value = '';
      }, 1500);
    }
  };

  const generateInsight = () => {
    toast.info('Génération des insights en cours...');
    
    setTimeout(() => {
      toast.success('Insights générés avec succès !');
      
      // Simuler un rapport d'IA
      toast(
        <div className="space-y-2">
          <h3 className="font-medium">Insights d'IA</h3>
          <p className="text-sm">
            Les données montrent une augmentation constante de l'utilisation des engins sur les 3 prochains mois, avec une prévision de pic en Mars. Maintenir une réserve de tags est recommandé.
          </p>
        </div>
      );
    }, 2000);
  };

  return (
    <DashboardLayout title="Prédictions IA">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Intelligence Artificielle & Prédictions</h1>
          <p className="text-muted-foreground">Utilisez l'IA pour prévoir les tendances et détecter les anomalies.</p>
        </div>
        
        <Button className="flex items-center" onClick={generateInsight}>
          <Brain size={16} className="mr-2" />
          Générer des insights
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Configuration du modèle</CardTitle>
            <CardDescription>Choisissez le type de modèle et les paramètres</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type de modèle</label>
                <Select 
                  value={selectedModel} 
                  onValueChange={setSelectedModel}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un modèle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Régression linéaire</SelectItem>
                    <SelectItem value="forest">Random Forest</SelectItem>
                    <SelectItem value="lstm">LSTM (Deep Learning)</SelectItem>
                    <SelectItem value="xgboost">XGBoost</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Période de prédiction (mois)</label>
                <Select 
                  value={timeRange} 
                  onValueChange={setTimeRange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 mois</SelectItem>
                    <SelectItem value="3">3 mois</SelectItem>
                    <SelectItem value="6">6 mois</SelectItem>
                    <SelectItem value="12">12 mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Ajouter des données</label>
                <div className="flex items-center">
                  <Input 
                    type="file" 
                    className="hidden" 
                    id="data-upload" 
                    onChange={handleFileUpload}
                  />
                  <label 
                    htmlFor="data-upload" 
                    className="cursor-pointer px-4 py-2 bg-muted rounded-lg flex items-center justify-center w-full hover:bg-muted/80 transition-colors"
                  >
                    <Upload size={16} className="mr-2" />
                    <span>Télécharger des données</span>
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              onClick={handleModelTrain}
              disabled={isTraining}
            >
              {isTraining ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Entraînement...
                </>
              ) : (
                <>
                  <Brain size={16} className="mr-2" />
                  Entraîner le modèle
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>État du modèle</CardTitle>
                <CardDescription>Informations sur le modèle actuel</CardDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => refetch()}>
                <RefreshCcw size={16} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isTraining ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progression de l'entraînement</span>
                    <span>{trainingProgress}%</span>
                  </div>
                  <Progress value={trainingProgress} />
                </div>
                <div className="p-4 bg-muted rounded-lg text-sm font-mono h-32 overflow-y-auto">
                  <div>Chargement des données...</div>
                  {trainingProgress > 20 && <div>Prétraitement des données...</div>}
                  {trainingProgress > 40 && <div>Entraînement du modèle ({selectedModel})...</div>}
                  {trainingProgress > 60 && <div>Validation croisée...</div>}
                  {trainingProgress > 80 && <div>Finalisation du modèle...</div>}
                  {trainingProgress === 100 && <div>Entraînement terminé !</div>}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Précision du modèle</div>
                      <div className="text-2xl font-bold mt-1">92.4%</div>
                    </CardContent>
                  </Card>
                  <Card className="bg-muted/50">
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">Dernière mise à jour</div>
                      <div className="text-2xl font-bold mt-1">
                        <Calendar className="h-5 w-5 inline mr-1" />
                        Aujourd'hui
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Métriques du modèle</h3>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 bg-muted/30 rounded">
                      <div className="text-xs text-muted-foreground">MAE</div>
                      <div className="font-medium">3.2</div>
                    </div>
                    <div className="p-2 bg-muted/30 rounded">
                      <div className="text-xs text-muted-foreground">RMSE</div>
                      <div className="font-medium">4.5</div>
                    </div>
                    <div className="p-2 bg-muted/30 rounded">
                      <div className="text-xs text-muted-foreground">R²</div>
                      <div className="font-medium">0.89</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button variant="outline" size="sm" className="text-xs">
                    <Download size={14} className="mr-1" />
                    Rapport complet
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="predictions" className="mb-6">
        <TabsList>
          <TabsTrigger value="predictions">Prédictions</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="anomalies">Détection d'anomalies</TabsTrigger>
        </TabsList>
        
        <TabsContent value="predictions" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <ChartWidget
              title="Prédiction d'utilisation des engins"
              data={isLoading ? [] : predictions || []}
              type="line"
              colors={['#66BB6A', '#1E88E5']}
              height={400}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <ChartWidget
              title="Tendances avec intervalles de confiance"
              data={trendsData}
              type="area"
              colors={['#1E88E5', '#E3F2FD', '#E3F2FD']}
              height={400}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="anomalies" className="mt-4">
          <div className="grid grid-cols-1 gap-6">
            <ChartWidget
              title="Détection d'anomalies dans l'utilisation"
              data={anomaliesData}
              type="line"
              colors={['#1E88E5', '#E91E63']}
              height={400}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {anomaliesData
                .filter(item => item.isAnomaly)
                .map((anomaly, index) => (
                  <Card key={index} className="border-red-200 bg-red-50">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-red-700">Anomalie détectée</CardTitle>
                      <CardDescription className="text-red-600">
                        {anomaly.name} - Valeur: {anomaly.Value}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-red-600">
                        Une utilisation anormalement élevée a été détectée. Cela pourrait indiquer un problème ou une utilisation non autorisée.
                      </p>
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button variant="outline" size="sm" className="text-xs">
                        Voir détails
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default AIPredictions;
