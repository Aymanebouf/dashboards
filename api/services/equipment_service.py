
# Service pour la gestion des équipements
from api.models.data import equipments

def get_equipment_list():
    """
    Récupère la liste de tous les équipements
    """
    return equipments

def get_status_distribution():
    """
    Calcule la répartition des équipements par statut
    """
    active = sum(1 for eq in equipments if eq['status'] == 'Actif')
    maintenance = sum(1 for eq in equipments if eq['status'] == 'Maintenance')
    inactive = sum(1 for eq in equipments if eq['status'] == 'Inactif')
    
    total = len(equipments)
    
    data = [
        {'name': 'Actif', 'value': (active / total) * 100},
        {'name': 'Maintenance', 'value': (maintenance / total) * 100},
        {'name': 'Inactif', 'value': (inactive / total) * 100}
    ]
    
    return data

def get_zone_distribution():
    """
    Calcule la répartition des équipements par zone
    """
    zones = {}
    
    for eq in equipments:
        location = eq['location']
        if location in zones:
            zones[location] += 1
        else:
            zones[location] = 1
    
    total = len(equipments)
    data = [{'name': zone, 'value': (count / total) * 100} for zone, count in zones.items()]
    
    return data
