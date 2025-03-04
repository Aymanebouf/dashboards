
from flask import jsonify, request
import sys
from api.services.ai_service import generate_simulated_ai_response, create_visualizations, generate_recommendations

def analyze_with_ai_controller():
    """
    Contrôleur pour analyser les données avec l'IA
    """
    try:
        data = request.json
        prompt = data.get('prompt', '')
        
        print(f"Prompt reçu: {prompt}")
        
        # Toujours utiliser le mode simulation pour éviter les erreurs de modèle
        print("Mode simulation activé pour l'analyse IA")
        ai_remarks = generate_simulated_ai_response(prompt)
        custom_insights = create_visualizations(prompt)
        recommendations = generate_recommendations(prompt)
        
        # Construire la réponse
        response = {
            "response": " ".join(ai_remarks),
            "remarks": ai_remarks,
            "recommendations": recommendations,
            "customInsights": custom_insights
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Erreur dans analyze_with_ai: {str(e)}")
        traceback_str = str(sys.exc_info()[0]) + " " + str(sys.exc_info()[1])
        print(f"Traceback: {traceback_str}")
        
        # En cas d'erreur, retourner quand même une réponse valide
        return jsonify({
            "error": str(e),
            "traceback": traceback_str,
            "response": "Une erreur s'est produite lors de l'analyse",
            "remarks": ["Une erreur s'est produite lors de l'analyse"],
            "recommendations": ["Vérifiez la configuration du serveur et réessayez"],
            "customInsights": []
        }), 500
