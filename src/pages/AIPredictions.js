
import React, { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import ChartWidget from '@/components/dashboard/widgets/ChartWidget';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressBar } from 'primereact/progressbar';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';

// Fictive data
const trendsData = [
  { name: 'Jan', 'Trend': 50, 'Confidence Upper': 55, 'Confidence Lower': 45 },
  { name: 'Feb', 'Trend': 53, 'Confidence Upper': 58, 'Confidence Lower': 48 },
  { name: 'Mar', 'Trend': 57, 'Confidence Upper': 63, 'Confidence Lower': 51 },
  { name: 'Apr', 'Trend': 62, 'Confidence Upper': 68, 'Confidence Lower': 56 },
  { name: 'May', 'Trend': 68, 'Confidence Upper': 74, 'Confidence Lower': 62 },
  { name: 'Jun', 'Trend': 74, 'Confidence Upper': 81, 'Confidence Lower': 67 },
  { name: 'Jul', 'Trend': 81, 'Confidence Upper': 88, 'Confidence Lower': 74 },
];

// Fictive data for anomalies
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

const AIPredictions = () => {
  const [selectedModel, setSelectedModel] = useState('linear');
  const [timeRange, setTimeRange] = useState('3');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [userPrompt, setUserPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [aiRemarks, setAiRemarks] = useState([]);
  const [customDashboard, setCustomDashboard] = useState([]);
  const [isAIConfigured, setIsAIConfigured] = useState(null);
  const [aiResponse, setAIResponse] = useState(null);
  const toast = React.useRef(null);

  // Check if AI is configured
  useEffect(() => {
    // Simplified for conversion
    setIsAIConfigured(true);
  }, []);

  const handleModelTrain = () => {
    setIsTraining(true);
    setTrainingProgress(0);
    
    // Simulation of model training
    const interval = setInterval(() => {
      setTrainingProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 10);
        if (newProgress >= 100) {
          clearInterval(interval);
          setIsTraining(false);
          toast.current.show({
            severity: 'success',
            summary: 'Succès',
            detail: 'Modèle entraîné avec succès !',
            life: 3000
          });
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const handleFileUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      // Simulate uploading
      toast.current.show({
        severity: 'info',
        summary: 'Information',
        detail: 'Téléchargement du fichier en cours...',
        life: 1500
      });
      
      setTimeout(() => {
        toast.current.show({
          severity: 'success',
          summary: 'Succès',
          detail: 'Fichier téléchargé avec succès !',
          life: 3000
        });
        // Reset the file input
        e.target.value = '';
      }, 1500);
    }
  };

  const generateInsight = async () => {
    if (!isAIConfigured) {
      toast.current.show({
        severity: 'error',
        summary: 'Erreur',
        detail: 'L\'IA n\'est pas configurée. Veuillez configurer une clé API OpenAI.',
        life: 3000
      });
      return;
    }
    
    toast.current.show({
      severity: 'info',
      summary: 'Information',
      detail: 'Génération des insights en cours...',
      life: 3000
    });
    
    // Simulate AI processing
    setTimeout(() => {
      // Fake AI response
      const mockRemarks = [
        "L'utilisation des équipements a augmenté de 15% ce mois-ci.",
        "3 équipements nécessitent une maintenance préventive.",
        "Le taux d'utilisation est optimal pour 80% de la flotte."
      ];
      
      setAiRemarks(mockRemarks);
      setCustomDashboard([
        { title: "Utilisation par équipement", type: "bar" },
        { title: "Prévisions de maintenance", type: "line" }
      ]);
      
      toast.current.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Insights générés avec succès !',
        life: 3000
      });
    }, 2000);
  };

  const handlePromptSubmit = async () => {
    if (!userPrompt.trim()) return;
    
    setIsProcessingPrompt(true);
    toast.current.show({
      severity: 'info',
      summary: 'Information',
      detail: 'Analyse de votre demande en cours...',
      life: 3000
    });

    // Simulate AI processing
    setTimeout(() => {
      // Fake response
      const mockRemarks = [
        "Votre requête a été analysée.",
        "Les données montrent une tendance à la hausse.",
        "Recommandation: optimiser la planification des maintenances."
      ];
      
      setAiRemarks(mockRemarks);
      setIsProcessingPrompt(false);
      
      toast.current.show({
        severity: 'success',
        summary: 'Succès',
        detail: 'Tableau de bord personnalisé généré !',
        life: 3000
      });
    }, 2000);
  };

  return (
    <DashboardLayout title="Prédictions IA">
      <Toast ref={toast} />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Intelligence Artificielle & Prédictions</h1>
          <p className="text-muted-foreground">Utilisez l'IA pour prévoir les tendances et détecter les anomalies.</p>
        </div>
        
        <Button 
          label="Générer des insights" 
          icon="pi pi-cog"
          onClick={generateInsight}
        />
      </div>
      
      {isAIConfigured === false && (
        <Message 
          severity="error" 
          text="L'IA n'est pas configurée. Veuillez configurer une clé API OpenAI." 
          className="w-full mb-4"
        />
      )}
      
      <TabView className="dashboard-tabs">
        <TabPanel header="Prédictions">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="shadow-md">
              <Card.Header>
                <div className="text-lg font-medium">Configuration du modèle</div>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Type de modèle</label>
                    <Dropdown
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.value)}
                      options={[
                        { label: 'Régression linéaire', value: 'linear' },
                        { label: 'Série temporelle', value: 'timeseries' },
                        { label: 'Deep Learning', value: 'deeplearning' }
                      ]}
                      className="w-full p-inputtext-sm"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Horizon de prédiction</label>
                    <Dropdown
                      value={timeRange}
                      onChange={(e) => setTimeRange(e.value)}
                      options={[
                        { label: '1 mois', value: '1' },
                        { label: '3 mois', value: '3' },
                        { label: '6 mois', value: '6' },
                        { label: '12 mois', value: '12' }
                      ]}
                      className="w-full p-inputtext-sm"
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      label="Entraîner le modèle" 
                      icon="pi pi-cog"
                      onClick={handleModelTrain}
                      loading={isTraining}
                      className="w-full"
                    />
                    
                    {isTraining && (
                      <div className="mt-3">
                        <ProgressBar value={trainingProgress} />
                        <p className="text-xs text-center mt-1 text-muted-foreground">
                          Entraînement en cours... {trainingProgress}%
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card.Body>
            </Card>
            
            <Card className="shadow-md">
              <Card.Header>
                <div className="text-lg font-medium">Données</div>
              </Card.Header>
              <Card.Body>
                <div className="space-y-4">
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Source des données</label>
                    <Dropdown
                      value="system"
                      options={[
                        { label: 'Données système', value: 'system' },
                        { label: 'Import CSV', value: 'csv' },
                        { label: 'API externe', value: 'api' }
                      ]}
                      className="w-full p-inputtext-sm"
                    />
                  </div>
                  
                  <div className="flex flex-col">
                    <label className="mb-1 text-sm font-medium">Importer des données</label>
                    <div className="flex">
                      <input
                        type="file"
                        accept=".csv,.xlsx"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="p-button p-component p-button-outlined w-full">
                        <i className="pi pi-upload mr-2"></i>
                        <span>Choisir un fichier</span>
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Formats supportés: CSV, XLSX
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      label="Rafraîchir les données" 
                      icon="pi pi-refresh"
                      outlined
                      className="w-full"
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
          
          <div className="space-y-6">
            <Card className="shadow-md">
              <Card.Header>
                <div className="text-lg font-medium">Prédictions des tendances</div>
              </Card.Header>
              <Card.Body>
                <ChartWidget
                  title=""
                  data={trendsData}
                  type="line"
                  colors={['#3B82F6', '#93C5FD', '#BFDBFE']}
                  height={300}
                />
              </Card.Body>
            </Card>
            
            <Card className="shadow-md">
              <Card.Header>
                <div className="text-lg font-medium">Détection d'anomalies</div>
              </Card.Header>
              <Card.Body>
                <ChartWidget
                  title=""
                  data={anomaliesData}
                  type="composed"
                  colors={['#F87171', '#FCA5A5']}
                  height={300}
                />
              </Card.Body>
            </Card>
          </div>
        </TabPanel>
        
        <TabPanel header="Insights IA">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Card className="shadow-md">
                <Card.Header>
                  <div className="text-lg font-medium">Analyse IA</div>
                </Card.Header>
                <Card.Body>
                  {aiRemarks.length > 0 ? (
                    <div className="space-y-4">
                      {aiRemarks.map((remark, index) => (
                        <div key={index} className="p-3 bg-primary-50 rounded-lg border border-primary-100">
                          <div className="flex items-center">
                            <i className="pi pi-info-circle text-primary mr-2"></i>
                            <p>{remark}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <i className="pi pi-cog text-6xl text-muted-foreground mb-4"></i>
                      <h3 className="text-xl mb-2">Aucune analyse IA</h3>
                      <p className="text-muted-foreground mb-4">
                        Utilisez le bouton "Générer des insights" pour obtenir une analyse IA de vos données.
                      </p>
                      <Button 
                        label="Générer des insights" 
                        icon="pi pi-cog"
                        onClick={generateInsight}
                      />
                    </div>
                  )}
                </Card.Body>
              </Card>
              
              {customDashboard.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {customDashboard.map((widget, index) => (
                    <Card key={index} className="shadow-md">
                      <Card.Header>
                        <div className="text-lg font-medium">{widget.title}</div>
                      </Card.Header>
                      <Card.Body>
                        <div className="h-60 flex items-center justify-center bg-muted rounded-md">
                          <i className={`pi ${widget.type === 'bar' ? 'pi-chart-bar' : 'pi-chart-line'} text-4xl text-muted-foreground`}></i>
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                </div>
              )}
            </div>
            
            <div>
              <Card className="shadow-md sticky top-20">
                <Card.Header>
                  <div className="text-lg font-medium">Poser une question à l'IA</div>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    <InputTextarea
                      value={userPrompt}
                      onChange={(e) => setUserPrompt(e.target.value)}
                      rows={5}
                      placeholder="Ex: Analysez l'utilisation des équipements sur les 3 derniers mois et suggérez des améliorations."
                      className="w-full"
                    />
                    
                    <Button 
                      label="Envoyer" 
                      icon="pi pi-send"
                      onClick={handlePromptSubmit}
                      loading={isProcessingPrompt}
                      className="w-full"
                    />
                    
                    <div>
                      <h4 className="text-sm font-medium mb-2">Exemples de requêtes:</h4>
                      <ul className="text-sm space-y-2">
                        <li className="cursor-pointer hover:text-primary" onClick={() => setUserPrompt("Quels sont les engins les moins utilisés ce mois-ci?")}>
                          - Quels sont les engins les moins utilisés ce mois-ci?
                        </li>
                        <li className="cursor-pointer hover:text-primary" onClick={() => setUserPrompt("Prédire les besoins en maintenance dans les 3 prochains mois.")}>
                          - Prédire les besoins en maintenance dans les 3 prochains mois.
                        </li>
                        <li className="cursor-pointer hover:text-primary" onClick={() => setUserPrompt("Analyser la corrélation entre l'utilisation et les pannes.")}>
                          - Analyser la corrélation entre l'utilisation et les pannes.
                        </li>
                      </ul>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </div>
        </TabPanel>
      </TabView>
    </DashboardLayout>
  );
};

export default AIPredictions;
