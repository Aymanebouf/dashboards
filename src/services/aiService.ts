
import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 15000
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    console.error('AI API Error:', error);
    toast.error('Erreur lors de la communication avec l\'API d\'IA. Vérifiez que le serveur est en cours d\'exécution.');
    return Promise.reject(error);
  }
);

export interface AIAnalysisResponse {
  response: string;
  remarks: string[];
  recommendations: string[];
  customInsights: Array<{
    title: string;
    type: string;
    data: any[];
    colors: string[];
  }>;
}

/**
 * Envoie une requête à l'IA pour analyser les données
 */
export const analyzeWithAI = async (prompt: string): Promise<AIAnalysisResponse> => {
  try {
    const response = await api.post<AIAnalysisResponse>('/analyze-with-ai', { prompt });
    return response.data;
  } catch (error) {
    console.error('Error analyzing with AI:', error);
    throw error;
  }
};

/**
 * Vérifie si la configuration de l'IA est disponible sur le serveur
 */
export const checkAIConfiguration = async (): Promise<boolean> => {
  try {
    const response = await api.post<AIAnalysisResponse>('/analyze-with-ai', { 
      prompt: 'Vérification de la configuration de l\'IA' 
    });
    return true;
  } catch (error: any) {
    if (error.response && error.response.data && error.response.data.error === "Clé API OpenAI non configurée") {
      return false;
    }
    // Si l'erreur est d'un autre type, on considère que c'est une autre raison
    return false;
  }
};
