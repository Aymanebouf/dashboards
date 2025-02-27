
import axios from 'axios';
import { toast } from 'sonner';

// Création d'une instance axios avec l'URL de base du backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    toast.error('Erreur de connexion au serveur. Vérifiez que le serveur Python est en cours d\'exécution.');
    return Promise.reject(error);
  }
);

// Fonctions pour récupérer les différentes données
export const fetchEquipment = async () => {
  try {
    const response = await api.get('/equipment');
    return response.data;
  } catch (error) {
    console.error('Error fetching equipment:', error);
    throw error;
  }
};

export const fetchMonthlyData = async () => {
  try {
    const response = await api.get('/monthly-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching monthly data:', error);
    throw error;
  }
};

export const fetchAnalyticalData = async () => {
  try {
    const response = await api.get('/analytical-data');
    return response.data;
  } catch (error) {
    console.error('Error fetching analytical data:', error);
    throw error;
  }
};

export const fetchAIPredictions = async () => {
  try {
    const response = await api.get('/ai-predictions');
    return response.data;
  } catch (error) {
    console.error('Error fetching AI predictions:', error);
    throw error;
  }
};

export const fetchStats = async () => {
  try {
    const response = await api.get('/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

export const fetchStatusDistribution = async () => {
  try {
    const response = await api.get('/status-distribution');
    return response.data;
  } catch (error) {
    console.error('Error fetching status distribution:', error);
    throw error;
  }
};

export const fetchZoneDistribution = async () => {
  try {
    const response = await api.get('/zone-distribution');
    return response.data;
  } catch (error) {
    console.error('Error fetching zone distribution:', error);
    throw error;
  }
};
