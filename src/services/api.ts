
import axios from 'axios';

// Création d'une instance axios avec l'URL de base du backend
const api = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Fonctions pour récupérer les différentes données
export const fetchEquipment = async () => {
  const response = await api.get('/equipment');
  return response.data;
};

export const fetchMonthlyData = async () => {
  const response = await api.get('/monthly-data');
  return response.data;
};

export const fetchAnalyticalData = async () => {
  const response = await api.get('/analytical-data');
  return response.data;
};

export const fetchAIPredictions = async () => {
  const response = await api.get('/ai-predictions');
  return response.data;
};

export const fetchStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const fetchStatusDistribution = async () => {
  const response = await api.get('/status-distribution');
  return response.data;
};

export const fetchZoneDistribution = async () => {
  const response = await api.get('/zone-distribution');
  return response.data;
};
