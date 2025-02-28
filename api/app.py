
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import random
import os
import openai
try:
    from dotenv import load_dotenv
    # Charger les variables d'environnement depuis .env
    load_dotenv()
    dotenv_loaded = True
except ImportError:
    dotenv_loaded = False

app = Flask(__name__)
CORS(app)

# Configure OpenAI si la clé API est présente
openai_api_key = os.environ.get('OPENAI_API_KEY')
if openai_api_key:
    openai.api_key = openai_api_key
    print("Clé API OpenAI configurée avec succès!")
else:
    print("ATTENTION: Clé API OpenAI non configurée. Certaines fonctionnalités ne seront pas disponibles.")
    if not dotenv_loaded:
        print("Le module python-dotenv n'a pas pu être chargé. La configuration via .env n'est pas disponible.")

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

# NOUVELLE ROUTE: Analyser les données avec OpenAI
@app.route('/api/analyze-with-ai', methods=['POST'])
def analyze_with_ai():
    if not openai_api_key:
        return jsonify({"error": "Clé API OpenAI non configurée"}), 500

    try:
        data = request.json
        prompt = data.get('prompt', '')
        
        print(f"Prompt reçu: {prompt}")
        
        # Préparer le contexte avec les données pertinentes
        equipment_count = len(equipments)
        active_count = sum(1 for eq in equipments if eq['status'] == 'Actif')
        maintenance_count = sum(1 for eq in equipments if eq['status'] == 'Maintenance')
        
        # Créer un contexte détaillé
        context = f"""
        Contexte des données:
        - Nombre total d'équipements: {equipment_count}
        - Équipements actifs: {active_count}
        - Équipements en maintenance: {maintenance_count}
        
        Données mensuelles d'utilisation des tags:
        {json.dumps(monthly_data, indent=2)}
        
        Données analytiques hebdomadaires:
        {json.dumps(analytical_data, indent=2)}
        
        Prédictions actuelles:
        {json.dumps(ai_predictions, indent=2)}
        """
        
        # Faire la requête à l'API OpenAI
        if openai_api_key:
            try:
                print("Envoi de la requête à OpenAI...")
                response = openai.ChatCompletion.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "Tu es un assistant d'analyse de données spécialisé dans la gestion d'équipements de chantier. Analyse les données fournies et donne des insights utiles, des recommandations et des prédictions."},
                        {"role": "user", "content": f"{context}\n\nRequête de l'utilisateur: {prompt}"}
                    ]
                )
                
                # Extraire et formater la réponse
                ai_response = response.choices[0].message.content
                print(f"Réponse d'OpenAI reçue: {ai_response[:100]}...")
            except Exception as e:
                print(f"Erreur lors de l'appel à OpenAI: {str(e)}")
                # Utiliser une réponse fictive en cas d'erreur
                ai_response = f"Analyse des données pour '{prompt}'. L'utilisation des équipements montre des tendances intéressantes. Je recommande d'optimiser les cycles de maintenance."
        else:
            # Si OpenAI n'est pas configuré, générer une réponse fictive basée sur le prompt
            print("OpenAI non configuré, génération d'une réponse fictive...")
            ai_response = f"Analyse des données pour '{prompt}'. L'utilisation des équipements montre des tendances intéressantes. Je recommande d'optimiser les cycles de maintenance."
        
        # Modification des insights en fonction du prompt
        title1 = "Analyse standard"
        title2 = "Répartition standard"
        data1 = []
        data2 = []
        colors1 = ["#1E88E5", "#E91E63", "#66BB6A"]
        colors2 = ["#4CAF50", "#FFC107", "#F44336"]
        
        # Personnaliser les visualisations en fonction du prompt
        if "utilisation" in prompt.lower() or "usage" in prompt.lower():
            title1 = "Analyse de l'utilisation des équipements"
            data1 = [
                {"name": "Lun", "Bulldozer": 35, "Excavatrice": 28, "Chargeuse": 20},
                {"name": "Mar", "Bulldozer": 32, "Excavatrice": 25, "Chargeuse": 22},
                {"name": "Mer", "Bulldozer": 30, "Excavatrice": 27, "Chargeuse": 24},
                {"name": "Jeu", "Bulldozer": 34, "Excavatrice": 29, "Chargeuse": 26},
                {"name": "Ven", "Bulldozer": 36, "Excavatrice": 31, "Chargeuse": 28},
            ]
        elif "maintenance" in prompt.lower():
            title1 = "Périodes de maintenance par type d'équipement"
            data1 = [
                {"name": "Jan", "Bulldozer": 5, "Excavatrice": 3, "Chargeuse": 2},
                {"name": "Fév", "Bulldozer": 3, "Excavatrice": 4, "Chargeuse": 3},
                {"name": "Mar", "Bulldozer": 2, "Excavatrice": 5, "Chargeuse": 4},
                {"name": "Avr", "Bulldozer": 4, "Excavatrice": 2, "Chargeuse": 5},
                {"name": "Mai", "Bulldozer": 6, "Excavatrice": 3, "Chargeuse": 2},
            ]
        elif "prédiction" in prompt.lower() or "prévoir" in prompt.lower() or "futur" in prompt.lower():
            title1 = "Prévisions d'utilisation des équipements"
            data1 = [
                {"name": "Juin", "Réel": 82, "Prévu": 80},
                {"name": "Juil", "Réel": 85, "Prévu": 83},
                {"name": "Août", "Prévu": 88},
                {"name": "Sept", "Prévu": 92},
                {"name": "Oct", "Prévu": 95},
                {"name": "Nov", "Prévu": 90},
            ]
        elif "zone" in prompt.lower() or "répartition" in prompt.lower():
            title1 = "Répartition des équipements par zone"
            data1 = [
                {"name": "Zone A", "Bulldozer": 3, "Excavatrice": 2, "Chargeuse": 1},
                {"name": "Zone B", "Bulldozer": 2, "Excavatrice": 3, "Chargeuse": 2},
                {"name": "Zone C", "Bulldozer": 1, "Excavatrice": 2, "Chargeuse": 3},
                {"name": "Entrepôt", "Bulldozer": 1, "Excavatrice": 1, "Chargeuse": 0},
            ]
        
        # Personnaliser le second graphique
        if "temps" in prompt.lower() or "durée" in prompt.lower():
            title2 = "Répartition du temps par activité"
            data2 = [
                {"name": "Opérationnel", "value": 65},
                {"name": "En attente", "value": 20},
                {"name": "Maintenance", "value": 15}
            ]
        elif "type" in prompt.lower() or "catégorie" in prompt.lower():
            title2 = "Répartition par type d'équipement"
            data2 = [
                {"name": "Bulldozer", "value": 40},
                {"name": "Excavatrice", "value": 35},
                {"name": "Chargeuse", "value": 25}
            ]
        elif "statut" in prompt.lower() or "état" in prompt.lower():
            title2 = "Répartition par statut"
            data2 = [
                {"name": "Actif", "value": 60},
                {"name": "Maintenance", "value": 25},
                {"name": "Inactif", "value": 15}
            ]
        else:
            title2 = "Répartition du temps par activité"
            data2 = [
                {"name": "Opérationnel", "value": 65},
                {"name": "En attente", "value": 20},
                {"name": "Maintenance", "value": 15}
            ]
        
        # Générer des données analytiques personnalisées basées sur le prompt
        custom_insights = [
            {
                "title": title1,
                "type": "bar" if "prédiction" not in prompt.lower() else "line",
                "data": data1,
                "colors": colors1
            },
            {
                "title": title2,
                "type": "pie",
                "data": data2,
                "colors": colors2
            }
        ]
        
        # Générer des recommandations personnalisées en fonction du prompt
        recommendations = []
        if "maintenance" in prompt.lower():
            recommendations = [
                "Optimisez vos cycles de maintenance pour réduire les temps d'arrêt",
                "Implementez un système de maintenance prédictive pour anticiper les pannes",
                "Formez davantage de techniciens pour réduire les délais de maintenance"
            ]
        elif "utilisation" in prompt.lower() or "usage" in prompt.lower():
            recommendations = [
                "Répartissez mieux l'utilisation entre les différents types d'équipements",
                "Évitez les pics d'utilisation en planifiant mieux les chantiers",
                "Investissez dans des équipements supplémentaires pour les périodes de forte demande"
            ]
        elif "zone" in prompt.lower() or "répartition" in prompt.lower():
            recommendations = [
                "Redistribuez les équipements entre les zones pour équilibrer l'utilisation",
                "Créez des zones tampons pour faciliter la mobilité des équipements",
                "Optimisez les trajets entre les zones pour réduire les temps de déplacement"
            ]
        else:
            recommendations = [
                "Optimisez vos cycles de maintenance pour réduire les temps d'arrêt",
                "Redistribuez les équipements entre les zones pour équilibrer l'utilisation",
                "Augmentez le nombre de tags disponibles pour améliorer le suivi"
            ]
        
        return jsonify({
            "response": ai_response,
            "remarks": ai_response.split('\n'),  # Diviser la réponse en remarques
            "recommendations": recommendations,
            "customInsights": custom_insights
        })
    
    except Exception as e:
        print(f"Erreur dans analyze_with_ai: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Route pour la page d'accueil qui permet de vérifier que le serveur fonctionne
@app.route('/', methods=['GET'])
def home():
    return "Serveur API Flask en cours d'exécution. Accédez à /api/equipment pour voir les données."

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
