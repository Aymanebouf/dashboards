
# Service pour la gestion des statistiques
from api.models.data import (
    monthly_data, analytical_data, ai_predictions, equipment_presence_data,
    client_ranking_data, equipment_usage_data, stock_analysis_data, client_visit_data
)

def get_monthly_data():
    """
    Récupère les données mensuelles
    """
    return monthly_data

def get_analytical_data():
    """
    Récupère les données analytiques
    """
    return analytical_data

def get_ai_predictions():
    """
    Récupère les prédictions IA
    """
    return ai_predictions

def get_global_stats():
    """
    Récupère des statistiques globales
    """
    return {
        'taggedEngines': {'value': '10/10', 'progress': 100},
        'usedTags': {'value': '10/16', 'progress': 62},
        'enginesOnSite': {'value': '10/10', 'progress': 100},
        'tagsToMaintain': {'value': '0/16', 'progress': 0}
    }

def get_equipment_presence():
    """
    Récupère les données de durée de présence des engins chez les clients
    """
    return equipment_presence_data

def get_client_ranking():
    """
    Récupère les données de classement des clients
    """
    return client_ranking_data

def get_equipment_usage():
    """
    Récupère les données d'utilisation des engins
    """
    return equipment_usage_data

def get_stock_analysis(period='daily'):
    """
    Récupère les données d'analyse des stocks pour une période donnée
    """
    if period in stock_analysis_data:
        return stock_analysis_data[period]
    return stock_analysis_data['daily']

def get_client_visits():
    """
    Récupère les données de fréquence de visite des clients
    """
    return client_visit_data

def get_dashboard_stats(dashboard_type='equipment-presence'):
    """
    Récupère les statistiques d'un tableau de bord spécifique
    """
    stats = {
        'equipment-presence': {
            'stat1': {'title': 'Durée moyenne', 'value': '12.4 jours', 'progress': 62},
            'stat2': {'title': 'Plus longue présence', 'value': '22 jours', 'progress': 88},
            'stat3': {'title': 'Clients actifs', 'value': '5/8', 'progress': 63},
            'stat4': {'title': 'Total jours', 'value': '62', 'progress': 78}
        },
        'client-ranking': {
            'stat1': {'title': 'Client principal', 'value': 'Client A', 'progress': 100},
            'stat2': {'title': 'Durée totale', 'value': '149 jours', 'progress': 85},
            'stat3': {'title': 'Équipements utilisés', 'value': '16/20', 'progress': 80},
            'stat4': {'title': 'Taux occupation', 'value': '78%', 'progress': 78}
        },
        'equipment-usage': {
            'stat1': {'title': 'Distance totale', 'value': '697 km', 'progress': 70},
            'stat2': {'title': 'Plus grande distance', 'value': '280 km', 'progress': 93},
            'stat3': {'title': 'Équipements actifs', 'value': '4/5', 'progress': 80},
            'stat4': {'title': 'Distance moyenne', 'value': '139 km', 'progress': 46}
        },
        'stock-analysis': {
            'stat1': {'title': 'Produits entrants', 'value': '1095', 'progress': 73},
            'stat2': {'title': 'Produits sortants', 'value': '1070', 'progress': 71},
            'stat3': {'title': 'Temps stockage moyen', 'value': '3.2 jours', 'progress': 64},
            'stat4': {'title': 'Taux rotation', 'value': '98%', 'progress': 98}
        },
        'client-visits': {
            'stat1': {'title': 'Visites totales', 'value': '62', 'progress': 62},
            'stat2': {'title': 'Client le plus visité', 'value': 'Client C', 'progress': 88},
            'stat3': {'title': 'Clients non visités', 'value': '0/5', 'progress': 100},
            'stat4': {'title': 'Visites moyennes', 'value': '12.4', 'progress': 52}
        }
    }
    
    if dashboard_type in stats:
        return stats[dashboard_type]
    return stats['equipment-presence']
