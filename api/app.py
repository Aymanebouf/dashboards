
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
import json
from datetime import datetime, timedelta
import random
import os
import sys

app = Flask(__name__)
CORS(app)

# Charger les variables d'environnement depuis .env de manière plus robuste
try:
    from dotenv import load_dotenv
    # Affichage du répertoire courant pour le débogage
    print(f"Répertoire courant: {os.getcwd()}")
    
    # Essayer de charger à partir de différents chemins potentiels
    dotenv_paths = [
        '.env',
        'api/.env',
        '../api/.env',
        os.path.join(os.path.dirname(__file__), '.env')
    ]
    
    dotenv_loaded = False
    for dotenv_path in dotenv_paths:
        if os.path.exists(dotenv_path):
            print(f"Fichier .env trouvé à: {dotenv_path}")
            load_dotenv(dotenv_path=dotenv_path)
            dotenv_loaded = True
            break
    
    if dotenv_loaded:
        print("dotenv chargé avec succès")
    else:
        print("Aucun fichier .env trouvé dans les chemins recherchés")
except ImportError:
    dotenv_loaded = False
    print("Impossible de charger dotenv. Essai d'utiliser la variable d'environnement directement.")

# Vérifier que la clé API est bien chargée
openai_api_key = os.environ.get('OPENAI_API_KEY')
print(f"Tentative de chargement de la clé API: {'Clé trouvée' if openai_api_key else 'Clé non trouvée'}")
print(f"Variables d'environnement disponibles: {list(os.environ.keys())}")

# Configuration de OpenAI si disponible, sinon mode simulation
try:
    if openai_api_key:
        import openai
        openai.api_key = openai_api_key
        print("Clé API OpenAI configurée avec succès!")
        has_openai = True
    else:
        print("AVERTISSEMENT: Clé API OpenAI non configurée. Mode de simulation activé.")
        has_openai = False
except ImportError:
    print("Module OpenAI non installé. Mode de simulation activé.")
    has_openai = False

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

# Fonction génératrice de réponse simulée pour l'IA
def generate_simulated_ai_response(prompt):
    print(f"Génération d'une réponse simulée pour le prompt: {prompt}")
    
    response_text = f"Analyse des données pour '{prompt}'. "
    
    if "tags" in prompt.lower() or "tag" in prompt.lower():
        response_text += "L'analyse des tags montre que certains équipements n'ont pas été correctement suivis. "
    elif "maintenance" in prompt.lower():
        response_text += "Les cycles de maintenance pourraient être optimisés pour réduire les temps d'arrêt. "
    elif "semaine précédente" in prompt.lower() or "semaine dernière" in prompt.lower():
        response_text += "La semaine dernière, nous avons observé une baisse d'activité de 15% par rapport à la normale. "
    else:
        response_text += "L'utilisation des équipements montre des tendances intéressantes. Je recommande d'optimiser les cycles de maintenance. "
    
    remarks = [
        response_text,
        "L'efficacité globale du parc d'équipements est de 78%.",
        "3 équipements nécessitent une maintenance dans les 7 prochains jours.",
        "La zone B montre une activité plus intense que les autres zones."
    ]
    
    return remarks

# NOUVELLE ROUTE: Analyser les données avec OpenAI
@app.route('/api/analyze-with-ai', methods=['POST'])
def analyze_with_ai():
    try:
        data = request.json
        prompt = data.get('prompt', '')
        
        print(f"Prompt reçu: {prompt}")
        
        # Préparer le contexte avec les données pertinentes
        equipment_count = len(equipments)
        active_count = sum(1 for eq in equipments if eq['status'] == 'Actif')
        maintenance_count = sum(1 for eq in equipments if eq['status'] == 'Maintenance')
        
        # Vérifier à nouveau la disponibilité de la clé API
        if not has_openai or True:  # Forcer le mode simulation pour l'instant
            # Mode de simulation - ne nécessite pas OpenAI
            print("Mode simulation activé pour l'analyse IA")
            ai_remarks = generate_simulated_ai_response(prompt)
            
            # Personnaliser les visualisations en fonction du prompt
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
            elif "tag" in prompt.lower():
                title1 = "Statut des tags par semaine"
                data1 = [
                    {"name": "Semaine 1", "Actifs": 42, "Inactifs": 8, "En panne": 2},
                    {"name": "Semaine 2", "Actifs": 40, "Inactifs": 9, "En panne": 3},
                    {"name": "Semaine 3", "Actifs": 38, "Inactifs": 10, "En panne": 4},
                    {"name": "Semaine 4", "Actifs": 41, "Inactifs": 7, "En panne": 4},
                ]
            elif "semaine précédente" in prompt.lower() or "semaine dernière" in prompt.lower():
                title1 = "Activité de la semaine dernière"
                data1 = [
                    {"name": "Lundi", "Activité": 65, "Moyenne mensuelle": 72},
                    {"name": "Mardi", "Activité": 62, "Moyenne mensuelle": 70},
                    {"name": "Mercredi", "Activité": 58, "Moyenne mensuelle": 68},
                    {"name": "Jeudi", "Activité": 55, "Moyenne mensuelle": 67},
                    {"name": "Vendredi", "Activité": 60, "Moyenne mensuelle": 65},
                ]
            else:
                title1 = "Activité des engins par jour"
                data1 = [
                    {"name": "Lundi", "Actifs": 18, "En pause": 7, "En maintenance": 5},
                    {"name": "Mardi", "Actifs": 20, "En pause": 5, "En maintenance": 5},
                    {"name": "Mercredi", "Actifs": 22, "En pause": 4, "En maintenance": 4},
                    {"name": "Jeudi", "Actifs": 21, "En pause": 5, "En maintenance": 4},
                    {"name": "Vendredi", "Actifs": 19, "En pause": 6, "En maintenance": 5},
                ]
            
            # Personnaliser le second graphique
            if "temps" in prompt.lower() or "durée" in prompt.lower():
                title2 = "Répartition du temps par activité"
                data2 = [
                    {"name": "Opérationnel", "value": 65},
                    {"name": "En attente", "value": 20},
                    {"name": "Maintenance", "value": 15}
                ]
            elif "tag" in prompt.lower():
                title2 = "État des tags"
                data2 = [
                    {"name": "Fonctionnels", "value": 82},
                    {"name": "Faible batterie", "value": 12},
                    {"name": "Défectueux", "value": 6}
                ]
            elif "semaine précédente" in prompt.lower() or "semaine dernière" in prompt.lower():
                title2 = "Causes de baisse d'activité"
                data2 = [
                    {"name": "Météo", "value": 45},
                    {"name": "Pannes", "value": 30},
                    {"name": "Personnel", "value": 25}
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
            elif "tag" in prompt.lower():
                recommendations = [
                    "Remplacez les tags montrant des signes de faiblesse de batterie",
                    "Vérifiez régulièrement l'état des tags après des conditions météorologiques difficiles",
                    "Utilisez un système de rotation des tags pour maximiser la durée de vie des batteries"
                ]
            elif "semaine précédente" in prompt.lower() or "semaine dernière" in prompt.lower():
                recommendations = [
                    "Planifiez les travaux extérieurs en fonction des prévisions météorologiques",
                    "Renforcez la maintenance préventive avant les périodes de forte activité",
                    "Mettez en place un système de personnel de réserve pour les jours de forte demande"
                ]
            else:
                recommendations = [
                    "Optimisez vos cycles de maintenance pour réduire les temps d'arrêt",
                    "Redistribuez les équipements entre les zones pour équilibrer l'utilisation",
                    "Augmentez le nombre de tags disponibles pour améliorer le suivi"
                ]
            
            return jsonify({
                "response": " ".join(ai_remarks),
                "remarks": ai_remarks,
                "recommendations": recommendations,
                "customInsights": custom_insights
            })
        
        # Nécessite OpenAI - ce code ne sera exécuté que si la clé est configurée
        try:
            import openai
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
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "Tu es un assistant d'analyse de données spécialisé dans la gestion d'équipements de chantier. Analyse les données fournies et donne des insights utiles, des recommandations et des prédictions."},
                    {"role": "user", "content": f"{context}\n\nRequête de l'utilisateur: {prompt}"}
                ]
            )
            
            # Extraire et formater la réponse
            ai_response = response.choices[0].message.content
            
            # Découper la réponse en paragraphes pour les remarques
            ai_remarks = ai_response.split('\n\n')
            
            # Créer une réponse structurée
            return jsonify({
                "response": ai_response,
                "remarks": ai_remarks[:4],  # Limiter à 4 remarques pour l'affichage
                "recommendations": [
                    "Optimisez vos cycles de maintenance selon les recommandations de l'IA",
                    "Suivez les tendances identifiées pour améliorer l'efficacité",
                    "Implémentez les changements suggérés progressivement"
                ],
                "customInsights": custom_insights  # Utiliser les mêmes visualisations que le mode simulation
            })
            
        except Exception as e:
            print(f"Erreur lors de la génération de la réponse OpenAI: {str(e)}")
            print("Utilisation du mode de secours avec réponse simulée")
            ai_remarks = generate_simulated_ai_response(prompt)
            
            return jsonify({
                "response": " ".join(ai_remarks),
                "remarks": ai_remarks,
                "recommendations": [
                    "Optimisez vos cycles de maintenance pour réduire les temps d'arrêt",
                    "Redistribuez les équipements entre les zones pour équilibrer l'utilisation",
                    "Augmentez le nombre de tags disponibles pour améliorer le suivi"
                ],
                "customInsights": custom_insights
            })
    
    except Exception as e:
        print(f"Erreur dans analyze_with_ai: {str(e)}")
        traceback_str = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        print(f"Traceback: {traceback_str}")
        return jsonify({
            "error": str(e),
            "traceback": traceback_str,
            "remarks": ["Une erreur s'est produite lors de l'analyse"],
            "recommendations": ["Vérifiez la configuration du serveur et réessayez"],
            "customInsights": []
        }), 500

# Route pour la page d'accueil qui permet de vérifier que le serveur fonctionne
@app.route('/', methods=['GET'])
def home():
    return "Serveur API Flask en cours d'exécution. Accédez à /api/equipment pour voir les données."

# Afficher les routes disponibles au démarrage
@app.before_first_request
def before_first_request():
    print("📌 Routes disponibles :")
    for rule in app.url_map.iter_rules():
        print(f"{rule}")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
