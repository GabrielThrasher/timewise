import firebase_admin
from firebase_admin import credentials, auth
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FIREBASE_KEY_PATH = os.path.join(BASE_DIR, "creds.secret.json")

# Initialize Firebase Admin SDK
cred = credentials.Certificate(FIREBASE_KEY_PATH)
firebase_admin.initialize_app(cred)

def verify_firebase_token(token: str):
    """
    Verify Firebase ID token received from the frontend.
    Returns user data if valid, raises error otherwise.
    """
    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token  # Returns user details
    except Exception:
        raise ValueError("Invalid Firebase token")
