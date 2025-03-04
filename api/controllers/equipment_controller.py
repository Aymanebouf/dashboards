
from flask import jsonify
from api.services.equipment_service import get_equipment_list, get_status_distribution, get_zone_distribution

def get_equipment():
    """
    Contrôleur pour obtenir la liste des équipements
    """
    return jsonify(get_equipment_list())

def get_status_distribution_data():
    """
    Contrôleur pour obtenir la répartition par statut
    """
    return jsonify(get_status_distribution())

def get_zone_distribution_data():
    """
    Contrôleur pour obtenir la répartition par zone
    """
    return jsonify(get_zone_distribution())
