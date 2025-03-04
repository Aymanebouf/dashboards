
# Service pour la génération de réponses IA et insights
import json
import random

def generate_simulated_ai_response(prompt):
    """
    Fonction génératrice de réponse simulée pour l'IA
    """
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

def create_visualizations(prompt):
    """
    Fonction pour créer les visualisations en fonction du prompt
    """
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
    
    return custom_insights

def generate_recommendations(prompt):
    """
    Fonction pour générer des recommandations basées sur le prompt
    """
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
    
    return recommendations
