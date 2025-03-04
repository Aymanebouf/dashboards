
import os
import sys

# Configuration de OpenAI
def setup_openai():
    """
    Configure l'environnement OpenAI
    """
    try:
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
                os.path.join(os.path.dirname(__file__), '../../.env')
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
        if openai_api_key:
            import openai
            openai.api_key = openai_api_key
            print("Clé API OpenAI configurée avec succès!")
            return True
        else:
            print("AVERTISSEMENT: Clé API OpenAI non configurée. Mode de simulation activé.")
            return False
    except ImportError:
        print("Module OpenAI non installé. Mode de simulation activé.")
        return False
    except Exception as e:
        print(f"Erreur lors de la configuration d'OpenAI: {str(e)}")
        return False
