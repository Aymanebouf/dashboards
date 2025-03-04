
from api.controllers.stats_controller import (
    get_monthly_data_controller, get_analytical_data_controller, get_ai_predictions_controller,
    get_stats_controller, get_equipment_presence_controller, get_client_ranking_controller,
    get_equipment_usage_controller, get_stock_analysis_controller, get_client_visits_controller,
    get_dashboard_stats_controller
)

def register_stats_routes(app):
    """
    Enregistre les routes liées aux statistiques
    """
    app.add_url_rule('/api/monthly-data', 'get_monthly_data', get_monthly_data_controller, methods=['GET'])
    app.add_url_rule('/api/analytical-data', 'get_analytical_data', get_analytical_data_controller, methods=['GET'])
    app.add_url_rule('/api/ai-predictions', 'get_ai_predictions', get_ai_predictions_controller, methods=['GET'])
    app.add_url_rule('/api/stats', 'get_stats', get_stats_controller, methods=['GET'])
    app.add_url_rule('/api/equipment-presence', 'get_equipment_presence', get_equipment_presence_controller, methods=['GET'])
    app.add_url_rule('/api/client-ranking', 'get_client_ranking', get_client_ranking_controller, methods=['GET'])
    app.add_url_rule('/api/equipment-usage', 'get_equipment_usage', get_equipment_usage_controller, methods=['GET'])
    app.add_url_rule('/api/stock-analysis', 'get_stock_analysis', get_stock_analysis_controller, methods=['GET'])
    app.add_url_rule('/api/client-visits', 'get_client_visits', get_client_visits_controller, methods=['GET'])
    app.add_url_rule('/api/dashboard-stats', 'get_dashboard_stats', get_dashboard_stats_controller, methods=['GET'])
