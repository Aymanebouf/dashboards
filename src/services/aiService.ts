
import axios from 'axios';
import { toast } from 'sonner';

// Création d'une instance axios configurée pour le développement local
const api = axios.create({
  baseURL: 'http://localhost:5000/api',  // URL par défaut
  timeout: 30000,  // Timeout augmenté pour les réponses lentes
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Intercepteur pour gérer les erreurs de manière plus conviviale
api.interceptors.response.use(
  response => response,
  error => {
    console.error('AI API Error:', error);
    
    if (error.response && error.response.data && error.response.data.error === "Clé API OpenAI non configurée") {
      toast.info('API en mode simulation (sans clé OpenAI)');
    } else if (error.code === 'ERR_NETWORK') {
      toast.error('Impossible de se connecter au serveur API. Assurez-vous que le serveur Flask est en cours d\'exécution (cd api && python app.py)');
    } else if (error.response && error.response.status === 404) {
      toast.error('Route API non trouvée. Vérifiez la configuration du serveur.');
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
 * Génère une réponse simulée en cas d'échec de connexion à l'API
 */
const generateFallbackResponse = (prompt: string): AIAnalysisResponse => {
  console.log("Génération d'une réponse de secours locale (le serveur API est inaccessible)");
  
  return {
    response: `Analyse des données pour '${prompt}' (mode secours local).`,
    remarks: [
      `Analyse pour: ${prompt}`,
      "Mode secours local activé - le serveur API est inaccessible.",
      "Assurez-vous que le serveur Flask est en cours d'exécution (cd api && python app.py).",
      "Certains équipements nécessitent une maintenance."
    ],
    recommendations: [
      "Vérifiez la connexion au serveur API",
      "Lancez le serveur Flask si ce n'est pas déjà fait",
      "Rafraîchissez la page après avoir démarré le serveur"
    ],
    customInsights: [
      {
        title: "Visualisation de secours",
        type: "bar",
        data: [
          { name: "Lun", value: 30 },
          { name: "Mar", value: 35 },
          { name: "Mer", value: 40 },
          { name: "Jeu", value: 45 },
          { name: "Ven", value: 50 }
        ],
        colors: ["#1E88E5"]
      },
      {
        title: "Répartition par défaut",
        type: "pie",
        data: [
          { name: "Type A", value: 40 },
          { name: "Type B", value: 30 },
          { name: "Type C", value: 20 },
          { name: "Type D", value: 10 }
        ],
        colors: ["#4CAF50", "#FFC107", "#F44336", "#9C27B0"]
      }
    ]
  };
};

/**
 * Tente de se connecter à différentes URL d'API en cas d'échec
 */
const tryAlternativeEndpoints = async (prompt: string): Promise<AIAnalysisResponse> => {
  // Liste des URLs à essayer, dans l'ordre
  const endpoints = [
    'http://localhost:5000/api/analyze-with-ai',
    'http://127.0.0.1:5000/api/analyze-with-ai',
    'http://192.168.10.8:5000/api/analyze-with-ai'  // IP locale détectée dans vos logs
  ];
  
  let lastError = null;
  
  // Essayer chaque endpoint jusqu'à ce qu'un fonctionne
  for (const endpoint of endpoints) {
    try {
      console.log(`Tentative de connexion à ${endpoint}...`);
      
      const response = await axios.post<AIAnalysisResponse>(
        endpoint, 
        { prompt },
        { 
          timeout: 15000,
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log(`Connexion réussie à ${endpoint}`, response.data);
      
      // Valider et normaliser la réponse
      const validatedResponse: AIAnalysisResponse = {
        response: response.data.response || "",
        remarks: Array.isArray(response.data.remarks) ? response.data.remarks : [],
        recommendations: Array.isArray(response.data.recommendations) ? response.data.recommendations : [],
        customInsights: Array.isArray(response.data.customInsights) ? response.data.customInsights : []
      };
      
      // Mettre à jour l'URL de base pour les prochains appels
      api.defaults.baseURL = endpoint.substring(0, endpoint.lastIndexOf('/'));
      console.log(`URL de base API mise à jour: ${api.defaults.baseURL}`);
      
      return validatedResponse;
    } catch (error) {
      console.error(`Échec de connexion à ${endpoint}:`, error);
      lastError = error;
    }
  }
  
  throw lastError;
};

/**
 * Fonction principale pour analyser les données avec l'IA
 */
export const analyzeWithAI = async (prompt: string): Promise<AIAnalysisResponse> => {
  try {
    console.log('Envoi de la requête d\'analyse avec prompt:', prompt);
    
    try {
      // Essayer les endpoints alternatifs
      return await tryAlternativeEndpoints(prompt);
    } catch (connectionError: any) {
      console.error('Échec de toutes les tentatives de connexion:', connectionError);
      
      // Si l'erreur n'est pas liée au réseau, on la propage
      if (connectionError.code !== 'ERR_NETWORK' && connectionError.code !== 'ECONNREFUSED') {
        throw connectionError;
      }
      
      // En cas d'erreur de connexion, générer une réponse de secours locale
      toast.warning('Impossible de se connecter au serveur API. Mode de secours local activé.');
      return generateFallbackResponse(prompt);
    }
  } catch (error) {
    console.error('Erreur lors de l\'analyse avec IA:', error);
    throw error;
  }
};

/**
 * Vérifie si la configuration de l'IA est disponible
 */
export const checkAIConfiguration = async (): Promise<boolean> => {
  try {
    console.log('Vérification de la configuration de l\'IA...');
    
    try {
      // Essayer d'utiliser directement l'endpoint d'analyse
      const result = await analyzeWithAI('Vérification de la configuration de l\'IA');
      console.log('API accessible (en mode simulation ou réel):', result);
      return true;
    } catch (error: any) {
      console.error('Erreur lors de la vérification de la configuration de l\'IA:', error);
      
      // Si nous avons une réponse mais avec une erreur concernant la clé API
      if (error.response && error.response.data && error.response.data.error === "Clé API OpenAI non configurée") {
        console.log('Clé API OpenAI non configurée, mais le mode simulation est disponible');
        return true;
      }
      
      // Si nous avons reçu une réponse du mode de secours local
      if (error.remarks && error.remarks.includes("Mode secours local activé")) {
        console.log('Mode secours local activé - le serveur API est inaccessible');
        return false;
      }
      
      return false;
    }
  } catch (error) {
    console.error('Erreur inattendue lors de la vérification de la configuration:', error);
    return false;
  }
};
