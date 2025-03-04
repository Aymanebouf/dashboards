
from flask import jsonify, request
import sys
import os
from api.services.ai_service import generate_simulated_ai_response, create_visualizations, generate_recommendations
from api.config.openai_config import setup_openai
import openai

def analyze_with_ai_controller():
    """
    Contrôleur pour analyser les données avec l'IA
    """
    try:
        data = request.json
        prompt = data.get('prompt', '')
        
        print(f"Prompt reçu: {prompt}")
        
        # Vérifier si OpenAI est configuré
        has_openai = setup_openai()
        
        if has_openai:
            try:
                print("Utilisation de l'API OpenAI pour l'analyse")
                
                # Appel à l'API OpenAI
                response = openai.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": "Tu es un assistant spécialisé dans l'analyse de données pour une entreprise de gestion d'équipements. Tu dois analyser les données et générer des visualisations pertinentes."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.7,
                    max_tokens=800
                )
                
                ai_response = response.choices[0].message.content
                
                # Générer des remarques basées sur la réponse de l'IA
                ai_remarks = [
                    ai_response,
                    "Analyse réalisée avec l'API OpenAI",
                    "Explorez les graphiques générés pour visualiser les données"
                ]
                
                # Générer des visualisations personnalisées basées sur le prompt
                custom_insights = create_visualizations(prompt)
                recommendations = generate_recommendations(prompt)
                
            except Exception as e:
                print(f"Erreur lors de l'appel à l'API OpenAI: {str(e)}")
                print("Utilisation du mode simulation comme fallback")
                
                # En cas d'erreur avec OpenAI, utiliser le mode simulation
                ai_remarks = generate_simulated_ai_response(prompt)
                custom_insights = create_visualizations(prompt)
                recommendations = generate_recommendations(prompt)
        else:
            print("Mode simulation activé pour l'analyse IA (OpenAI non configuré)")
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
