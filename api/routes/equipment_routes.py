
from api.controllers.equipment_controller import get_equipment, get_status_distribution_data, get_zone_distribution_data

def register_equipment_routes(app):
    """
    Enregistre les routes liées aux équipements
    """
    app.add_url_rule('/api/equipment', 'get_equipment', get_equipment, methods=['GET'])
    app.add_url_rule('/api/status-distribution', 'get_status_distribution', get_status_distribution_data, methods=['GET'])
    app.add_url_rule('/api/zone-distribution', 'get_zone_distribution', get_zone_distribution_data, methods=['GET'])
