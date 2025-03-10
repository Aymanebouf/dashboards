
import { useState } from 'react';
import { analyzeWithAI, AIAnalysisResponse } from '@/services/aiService';
import { toast } from 'sonner';

/**
 * Controller for AI Analysis functionality
 * Separates business logic from UI components
 */
export const useAIAnalysisController = (isAIConfigured: boolean | null) => {
  const [userPrompt, setUserPrompt] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [aiRemarks, setAiRemarks] = useState<string[]>([]);
  const [customDashboard, setCustomDashboard] = useState<any[]>([]);
  const [aiResponse, setAIResponse] = useState<AIAnalysisResponse | null>(null);

  /**
   * Handles the prompt submission and AI analysis
   */
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

  return {
    userPrompt,
    setUserPrompt,
    isProcessingPrompt,
    aiRemarks,
    customDashboard,
    aiResponse,
    handlePromptSubmit
  };
};
