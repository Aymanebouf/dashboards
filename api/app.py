
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)

# Fixation de la seed aléatoire pour assurer la cohérence des données
random.seed(42)

# Données simulées pour les équipements
equipments = [
    {"id": 1, "name": "Bulldozer BX-250", "status": "Actif", "location": "Zone A", "lastUsed": "2023-07-20"},
    {"id": 2, "name": "Excavatrice EX-450", "status": "Maintenance", "location": "Atelier", "lastUsed": "2023-07-15"},
    {"id": 3, "name": "Chargeuse CL-300", "status": "Actif", "location": "Zone B", "lastUsed": "2023-07-21"},
    {"id": 4, "name": "Compacteur CP-100", "status": "Inactif", "location": "Entrepôt", "lastUsed": "2023-07-10"},
    {"id": 5, "name": "Grue GR-750", "status": "Actif", "location": "Zone C", "lastUsed": "2023-07-19"},
]

# Données fixes pour les statistiques mensuelles
monthly_data = [
    {'name': 'January', 'Engin Tagged': 65, 'Engin Enter': 45, 'Engin Exit': 35},
    {'name': 'February', 'Engin Tagged': 72, 'Engin Enter': 53, 'Engin Exit': 42},
    {'name': 'March', 'Engin Tagged': 78, 'Engin Enter': 60, 'Engin Exit': 48},
    {'name': 'April', 'Engin Tagged': 85, 'Engin Enter': 70, 'Engin Exit': 58},
    {'name': 'May', 'Engin Tagged': 90, 'Engin Enter': 75, 'Engin Exit': 65},
    {'name': 'June', 'Engin Tagged': 86, 'Engin Enter': 72, 'Engin Exit': 62},
    {'name': 'July', 'Engin Tagged': 82, 'Engin Enter': 68, 'Engin Exit': 59},
]

# Données fixes pour l'analyse
analytical_data = [
    {'name': 'Week 1', 'Utilisation': 65, 'Maintenance': 15, 'Idle': 20},
    {'name': 'Week 2', 'Utilisation': 72, 'Maintenance': 18, 'Idle': 10},
    {'name': 'Week 3', 'Utilisation': 78, 'Maintenance': 12, 'Idle': 10},
    {'name': 'Week 4', 'Utilisation': 80, 'Maintenance': 10, 'Idle': 10},
]

# Données fixes pour les prédictions IA
ai_predictions = [
    {'name': 'Aug', 'Actual': 65, 'Predicted': 68},
    {'name': 'Sep', 'Actual': 59, 'Predicted': 57},
    {'name': 'Oct', 'Actual': 80, 'Predicted': 82},
    {'name': 'Nov', 'Actual': 81, 'Predicted': 78},
    {'name': 'Dec', 'Actual': 56, 'Predicted': 58},
    {'name': 'Jan', 'Predicted': 76},
    {'name': 'Feb', 'Predicted': 84},
    {'name': 'Mar', 'Predicted': 92},
]

# Route pour obtenir la liste des équipements
@app.route('/api/equipment', methods=['GET'])
def get_equipment():
    return jsonify(equipments)

# Route pour obtenir les données mensuelles
@app.route('/api/monthly-data', methods=['GET'])
def get_monthly_data():
    return jsonify(monthly_data)

# Route pour obtenir les données analytiques
@app.route('/api/analytical-data', methods=['GET'])
def get_analytical_data():
    return jsonify(analytical_data)

# Route pour obtenir les données de prédiction IA
@app.route('/api/ai-predictions', methods=['GET'])
def get_ai_predictions():
    return jsonify(ai_predictions)

# Route pour obtenir des statistiques globales
@app.route('/api/stats', methods=['GET'])
def get_stats():
    return jsonify({
        'taggedEngines': {'value': '10/10', 'progress': 100},
        'usedTags': {'value': '10/16', 'progress': 62},
        'enginesOnSite': {'value': '10/10', 'progress': 100},
        'tagsToMaintain': {'value': '0/16', 'progress': 0}
    })

# Route pour obtenir la répartition par statut
@app.route('/api/status-distribution', methods=['GET'])
def get_status_distribution():
    active = sum(1 for eq in equipments if eq['status'] == 'Actif')
    maintenance = sum(1 for eq in equipments if eq['status'] == 'Maintenance')
    inactive = sum(1 for eq in equipments if eq['status'] == 'Inactif')
    
    total = len(equipments)
    
    data = [
        {'name': 'Actif', 'value': (active / total) * 100},
        {'name': 'Maintenance', 'value': (maintenance / total) * 100},
        {'name': 'Inactif', 'value': (inactive / total) * 100}
    ]
    
    return jsonify(data)

# Route pour obtenir la répartition par zone
@app.route('/api/zone-distribution', methods=['GET'])
def get_zone_distribution():
    zones = {}
    
    for eq in equipments:
        location = eq['location']
        if location in zones:
            zones[location] += 1
        else:
            zones[location] = 1
    
    total = len(equipments)
    data = [{'name': zone, 'value': (count / total) * 100} for zone, count in zones.items()]
    
    return jsonify(data)

# Route pour la page d'accueil qui permet de vérifier que le serveur fonctionne
@app.route('/', methods=['GET'])
def home():
    return "Serveur API Flask en cours d'exécution. Accédez à /api/equipment pour voir les données."

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
