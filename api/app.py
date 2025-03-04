
from flask import Flask, jsonify
from flask_cors import CORS
import random
import os

# Import des configurations
from api.config.openai_config import setup_openai

# Import des routes
from api.routes.equipment_routes import register_equipment_routes
from api.routes.stats_routes import register_stats_routes
from api.routes.ai_routes import register_ai_routes

def create_app():
    """
    Fonction factory pour créer l'application Flask
    """
    app = Flask(__name__)
    CORS(app)
    
    # Fixation de la seed aléatoire pour assurer la cohérence des données
    random.seed(42)
    
    # Configuration de OpenAI
    has_openai = setup_openai()
    print(f"OpenAI configuré: {has_openai}")
    
    # Enregistrement des routes
    register_equipment_routes(app)
    register_stats_routes(app)
    register_ai_routes(app)
    
    # Route pour la page d'accueil qui permet de vérifier que le serveur fonctionne
    @app.route('/', methods=['GET'])
    def home():
        return "Serveur API Flask en cours d'exécution. Accédez à /api/equipment pour voir les données."
    
    return app

# Création de l'application
app = create_app()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
