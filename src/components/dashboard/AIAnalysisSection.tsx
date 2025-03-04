
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Brain, SendHorizonal, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import ChartWidget from './widgets/ChartWidget';
import { AIAnalysisResponse, analyzeWithAI } from '@/services/aiService';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AIAnalysisSectionProps {
  isAIConfigured: boolean | null;
  errorMessage: string | null;
}

const AIAnalysisSection: React.FC<AIAnalysisSectionProps> = ({ 
  isAIConfigured,
  errorMessage
}) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [aiRemarks, setAiRemarks] = useState<string[]>([]);
  const [customDashboard, setCustomDashboard] = useState<any[]>([]);
  const [aiResponse, setAIResponse] = useState<AIAnalysisResponse | null>(null);

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
        toast.error('Erreur de connexion au serveur API');
      } else if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Erreur lors de l\'analyse de votre demande');
      }
      
      setAIResponse(null);
      setAiRemarks([]);
      setCustomDashboard([]);
    } finally {
      setIsProcessingPrompt(false);
    }
  };

  return (
    <>
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
    </>
  );
};

export default AIAnalysisSection;
