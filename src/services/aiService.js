
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

/**
 * Génère une réponse simulée en cas d'échec de connexion à l'API
 */
const generateFallbackResponse = (prompt) => {
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
const tryAlternativeEndpoints = async (prompt) => {
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
      
      const response = await axios.post(
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
      return {
        response: response.data.response || "",
        remarks: Array.isArray(response.data.remarks) ? response.data.remarks : [],
        recommendations: Array.isArray(response.data.recommendations) ? response.data.recommendations : [],
        customInsights: Array.isArray(response.data.customInsights) ? response.data.customInsights : []
      };
    } catch (error) {
      lastError = error;
      console.error(`Échec de connexion à ${endpoint}:`, error.message);
    }
  }
  
  // Si tous les endpoints échouent, retourner une réponse de secours
  console.error('Tous les endpoints ont échoué. Dernière erreur:', lastError);
  return generateFallbackResponse(prompt);
};

/**
 * Vérifie si l'API d'IA est configurée et disponible
 */
export const checkAIConfigured = async () => {
  try {
    const response = await api.get('/check-ai-config');
    return { configured: true, message: null };
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error === "Clé API OpenAI non configurée") {
      return { 
        configured: false, 
        message: "La clé API OpenAI n'est pas configurée. Les fonctionnalités d'IA ne sont pas disponibles." 
      };
    } else if (error.code === 'ERR_NETWORK') {
      return { 
        configured: null, 
        message: "Impossible de se connecter au serveur API. Assurez-vous que le serveur Flask est en cours d'exécution (cd api && python app.py)." 
      };
    }
    return { 
      configured: null, 
      message: "Erreur lors de la vérification de la configuration de l'API d'IA." 
    };
  }
};

/**
 * Analyse une requête avec l'IA
 */
export const analyzeWithAI = async (prompt) => {
  try {
    const response = await api.post('/analyze-with-ai', { prompt });
    console.log('AI response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error in analyzeWithAI:', error);
    
    // En cas d'erreur réseau ou de service indisponible, essayer les endpoints alternatifs
    if (error.code === 'ERR_NETWORK' || (error.response && error.response.status >= 500)) {
      return tryAlternativeEndpoints(prompt);
    }
    
    // Générer une réponse de secours en dernier recours
    return generateFallbackResponse(prompt);
  }
};
