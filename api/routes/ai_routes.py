
from api.controllers.ai_controller import analyze_with_ai_controller

def register_ai_routes(app):
    """
    Enregistre les routes liées à l'IA
    """
    app.add_url_rule('/api/analyze-with-ai', 'analyze_with_ai', analyze_with_ai_controller, methods=['POST'])
