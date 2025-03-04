
# Données simulées pour l'application
import random
from datetime import datetime, timedelta

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

# Données pour la durée de présence des engins chez les clients
equipment_presence_data = [
    {"client": "Client A", "equipment": "Bulldozer BX-250", "duration": 15, "unit": "jours"},
    {"client": "Client B", "equipment": "Excavatrice EX-450", "duration": 8, "unit": "jours"},
    {"client": "Client C", "equipment": "Chargeuse CL-300", "duration": 22, "unit": "jours"},
    {"client": "Client A", "equipment": "Compacteur CP-100", "duration": 5, "unit": "jours"},
    {"client": "Client D", "equipment": "Grue GR-750", "duration": 12, "unit": "jours"},
]

# Données pour le classement des clients par temps d'utilisation
client_ranking_data = [
    {"rank": 1, "client": "Client A", "totalDuration": 42, "unit": "jours", "equipmentCount": 5},
    {"rank": 2, "client": "Client C", "totalDuration": 36, "unit": "jours", "equipmentCount": 3},
    {"rank": 3, "client": "Client B", "totalDuration": 28, "unit": "jours", "equipmentCount": 4},
    {"rank": 4, "client": "Client D", "totalDuration": 25, "unit": "jours", "equipmentCount": 2},
    {"rank": 5, "client": "Client E", "totalDuration": 18, "unit": "jours", "equipmentCount": 2},
]

# Données pour l'utilisation des engins (distances parcourues)
equipment_usage_data = [
    {"equipment": "Bulldozer BX-250", "day": 12, "week": 68, "month": 280, "unit": "km"},
    {"equipment": "Excavatrice EX-450", "day": 5, "week": 32, "month": 145, "unit": "km"},
    {"equipment": "Chargeuse CL-300", "day": 8, "week": 45, "month": 190, "unit": "km"},
    {"equipment": "Compacteur CP-100", "day": 3, "week": 18, "month": 82, "unit": "km"},
    {"equipment": "Grue GR-750", "day": 0, "week": 0, "month": 0, "unit": "km"},
]

# Données pour l'analyse des stocks et mouvements
stock_analysis_data = {
    "daily": [
        {"date": "2023-07-15", "incoming": 12, "outgoing": 8, "avgStorageTime": 3.5},
        {"date": "2023-07-16", "incoming": 8, "outgoing": 10, "avgStorageTime": 3.2},
        {"date": "2023-07-17", "incoming": 15, "outgoing": 12, "avgStorageTime": 2.8},
        {"date": "2023-07-18", "incoming": 10, "outgoing": 9, "avgStorageTime": 3.0},
        {"date": "2023-07-19", "incoming": 14, "outgoing": 11, "avgStorageTime": 3.3},
        {"date": "2023-07-20", "incoming": 9, "outgoing": 13, "avgStorageTime": 2.9},
        {"date": "2023-07-21", "incoming": 11, "outgoing": 10, "avgStorageTime": 3.1},
    ],
    "weekly": [
        {"week": "Semaine 27", "incoming": 62, "outgoing": 58, "avgStorageTime": 3.2},
        {"week": "Semaine 28", "incoming": 70, "outgoing": 65, "avgStorageTime": 3.0},
        {"week": "Semaine 29", "incoming": 55, "outgoing": 60, "avgStorageTime": 3.3},
        {"week": "Semaine 30", "incoming": 68, "outgoing": 63, "avgStorageTime": 2.9},
    ],
    "monthly": [
        {"month": "Avril", "incoming": 250, "outgoing": 245, "avgStorageTime": 3.5},
        {"month": "Mai", "incoming": 285, "outgoing": 275, "avgStorageTime": 3.2},
        {"month": "Juin", "incoming": 270, "outgoing": 280, "avgStorageTime": 3.0},
        {"month": "Juillet", "incoming": 290, "outgoing": 270, "avgStorageTime": 3.3},
    ]
}

# Données pour la fréquence de visite chez les clients
client_visit_data = [
    {"client": "Client A", "visitCount": 15, "lastVisit": "2023-07-18", "daysElapsed": 3},
    {"client": "Client B", "visitCount": 8, "lastVisit": "2023-07-10", "daysElapsed": 11},
    {"client": "Client C", "visitCount": 22, "lastVisit": "2023-07-21", "daysElapsed": 0},
    {"client": "Client D", "visitCount": 5, "lastVisit": "2023-06-30", "daysElapsed": 21},
    {"client": "Client E", "visitCount": 12, "lastVisit": "2023-07-15", "daysElapsed": 6},
]
