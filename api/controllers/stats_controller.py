
from flask import jsonify, request
from api.services.stats_service import (
    get_monthly_data, get_analytical_data, get_ai_predictions,
    get_global_stats, get_equipment_presence, get_client_ranking,
    get_equipment_usage, get_stock_analysis, get_client_visits,
    get_dashboard_stats
)

def get_monthly_data_controller():
    """
    Contrôleur pour obtenir les données mensuelles
    """
    return jsonify(get_monthly_data())

def get_analytical_data_controller():
    """
    Contrôleur pour obtenir les données analytiques
    """
    return jsonify(get_analytical_data())

def get_ai_predictions_controller():
    """
    Contrôleur pour obtenir les prédictions IA
    """
    return jsonify(get_ai_predictions())

def get_stats_controller():
    """
    Contrôleur pour obtenir des statistiques globales
    """
    return jsonify(get_global_stats())

def get_equipment_presence_controller():
    """
    Contrôleur pour obtenir les données de durée de présence des engins
    """
    return jsonify(get_equipment_presence())

def get_client_ranking_controller():
    """
    Contrôleur pour obtenir les données de classement des clients
    """
    return jsonify(get_client_ranking())

def get_equipment_usage_controller():
    """
    Contrôleur pour obtenir les données d'utilisation des engins
    """
    return jsonify(get_equipment_usage())

def get_stock_analysis_controller():
    """
    Contrôleur pour obtenir les données d'analyse des stocks
    """
    period = request.args.get('period', 'daily')
    return jsonify(get_stock_analysis(period))

def get_client_visits_controller():
    """
    Contrôleur pour obtenir les données de fréquence de visite des clients
    """
    return jsonify(get_client_visits())

def get_dashboard_stats_controller():
    """
    Contrôleur pour obtenir les statistiques d'un tableau de bord spécifique
    """
    dashboard_type = request.args.get('type', 'equipment-presence')
    return jsonify(get_dashboard_stats(dashboard_type))
