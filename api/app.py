
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import random

app = Flask(__name__)
CORS(app)

# Données simulées pour les équipements
equipments = [
    {"id": 1, "name": "Bulldozer BX-250", "status": "Actif", "location": "Zone A", "lastUsed": "2023-07-20"},
    {"id": 2, "name": "Excavatrice EX-450", "status": "Maintenance", "location": "Atelier", "lastUsed": "2023-07-15"},
    {"id": 3, "name": "Chargeuse CL-300", "status": "Actif", "location": "Zone B", "lastUsed": "2023-07-21"},
    {"id": 4, "name": "Compacteur CP-100", "status": "Inactif", "location": "Entrepôt", "lastUsed": "2023-07-10"},
    {"id": 5, "name": "Grue GR-750", "status": "Actif", "location": "Zone C", "lastUsed": "2023-07-19"},
]

# Route pour obtenir la liste des équipements
@app.route('/api/equipment', methods=['GET'])
def get_equipment():
    return jsonify(equipments)

# Route pour obtenir les données mensuelles
@app.route('/api/monthly-data', methods=['GET'])
def get_monthly_data():
    months = ['January', 'February', 'March', 'April', 'May', 'June', 'July']
    data = []
    
    for month in months:
        data.append({
            'name': month,
            'Engin Tagged': random.randint(40, 90),
            'Engin Enter': random.randint(20, 90),
            'Engin Exit': random.randint(15, 90)
        })
    
    return jsonify(data)

# Route pour obtenir les données analytiques
@app.route('/api/analytical-data', methods=['GET'])
def get_analytical_data():
    weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    data = []
    
    for week in weeks:
        utilisation = random.randint(60, 85)
        maintenance = random.randint(5, 25)
        idle = random.randint(5, 25)
        
        data.append({
            'name': week,
            'Utilisation': utilisation,
            'Maintenance': maintenance,
            'Idle': idle
        })
    
    return jsonify(data)

# Route pour obtenir les données de prédiction IA
@app.route('/api/ai-predictions', methods=['GET'])
def get_ai_predictions():
    months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
    data = []
    
    for i, month in enumerate(months):
        actual = random.randint(55, 85) if i < 5 else None
        predicted = random.randint(55, 85)
        
        entry = {'name': month, 'Predicted': predicted}
        if actual:
            entry['Actual'] = actual
            
        data.append(entry)
    
    return jsonify(data)

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
