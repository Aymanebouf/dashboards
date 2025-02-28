
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
    
    // Message d'erreur plus détaillé
    if (error.response && error.response.data && error.response.data.error === "Clé API OpenAI non configurée") {
      toast.error('Clé API OpenAI non configurée. Le mode simulation sera utilisé.');
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Impossible de se connecter au serveur API. Assurez-vous que le serveur Flask est en cours d\'exécution (cd api && python app.py)');
    } else {
      toast.error('Erreur lors de la communication avec l\'API d\'IA.');
    }
    
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
    console.log('Sending analyze request with prompt:', prompt);
    
    // Vérifier la connexion au serveur avant d'envoyer la requête complète
    try {
      await api.get('/');
    } catch (connectionError) {
      console.error('Erreur de connexion au serveur API:', connectionError);
      throw { code: 'ERR_NETWORK', message: 'Impossible de se connecter au serveur API' };
    }
    
    const response = await api.post<AIAnalysisResponse>('/analyze-with-ai', { prompt });
    console.log('Received AI response:', response.data);
    
    // Valider la structure de la réponse
    if (!response.data || typeof response.data !== 'object') {
      console.error('Format de réponse invalide (n\'est pas un objet):', response.data);
      throw new Error('Format de réponse invalide reçu du serveur');
    }
    
    // Garantir que toutes les propriétés nécessaires existent, même vides
    const validatedResponse: AIAnalysisResponse = {
      response: response.data.response || "",
      remarks: Array.isArray(response.data.remarks) ? response.data.remarks : [],
      recommendations: Array.isArray(response.data.recommendations) ? response.data.recommendations : [],
      customInsights: Array.isArray(response.data.customInsights) ? response.data.customInsights : []
    };
    
    return validatedResponse;
  } catch (error) {
    console.error('Error analyzing with AI:', error);
    throw error;
  }
};

/**
 * Vérifie si la configuration de l'IA est disponible sur le serveur
 * Retourne true si l'API est accessible (même en mode simulation)
 */
export const checkAIConfiguration = async (): Promise<boolean> => {
  try {
    console.log('Vérification de la configuration de l\'IA...');
    
    // Vérifier d'abord si le serveur est accessible
    try {
      // Vérifier la route racine du serveur API et non /api
      await api.get('');
    } catch (connectionError: any) {
      console.error('Erreur de connexion au serveur API lors de la vérification:', connectionError);
      
      // Si l'erreur est 404, c'est que le serveur est en cours d'exécution mais la route est incorrecte
      if (connectionError.response && connectionError.response.status === 404) {
        console.log('Le serveur est en cours d\'exécution mais la route est incorrecte, essayons une autre route');
        // Essayer avec la route /analyze-with-ai directement
        try {
          const testResponse = await api.post<AIAnalysisResponse>('/analyze-with-ai', { 
            prompt: 'Vérification de la configuration de l\'IA' 
          });
          console.log('API en mode simulation fonctionne correctement');
          return true;
        } catch (secondError: any) {
          // Si la seconde tentative échoue aussi mais avec un code 500, c'est peut-être un problème de clé API
          if (secondError.response && secondError.response.status === 500) {
            console.log('Serveur en cours d\'exécution mais erreur 500 - probablement en mode simulation');
            return true; // On considère que le serveur est accessible en mode simulation
          }
          throw { code: 'ERR_NETWORK', message: 'Impossible de se connecter au serveur API' };
        }
      }
      
      throw { code: 'ERR_NETWORK', message: 'Impossible de se connecter au serveur API' };
    }
    
    // Essayer d'obtenir une réponse de l'API pour vérifier si l'IA est configurée
    const response = await api.post<AIAnalysisResponse>('/analyze-with-ai', { 
      prompt: 'Vérification de la configuration de l\'IA' 
    });
    
    // Si on obtient une réponse avec les bonnes propriétés, l'API fonctionne
    // même si c'est en mode simulation
    const hasValidResponse = response.data && 
                             response.data.remarks && 
                             Array.isArray(response.data.remarks) &&
                             response.data.customInsights &&
                             Array.isArray(response.data.customInsights);
    
    console.log('Vérification terminée. Résultat:', hasValidResponse);
    return hasValidResponse;
  } catch (error: any) {
    console.error('Erreur lors de la vérification de la configuration de l\'IA:', error);
    
    if (error.response && error.response.data && error.response.data.error === "Clé API OpenAI non configurée") {
      console.log('Clé API OpenAI non configurée, mais le mode simulation est disponible');
      return true; // On peut utiliser le mode simulation
    }
    
    if (error.code === 'ERR_NETWORK') {
      console.log('Erreur réseau - Le serveur API est-il en cours d\'exécution?');
      toast.error('Impossible de se connecter au serveur API. Assurez-vous que le serveur Flask est en cours d\'exécution.');
      return false;
    }
    
    // Si l'erreur est d'un autre type, on considère que c'est une autre raison
    return false;
  }
};
