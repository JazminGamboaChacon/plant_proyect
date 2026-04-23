import os
from functools import lru_cache

import firebase_admin
from firebase_admin import credentials, firestore

from .config import get_settings


@lru_cache(maxsize=1)
def get_firestore_client() -> firestore.Client:
    settings = get_settings()

    if not firebase_admin._apps:
        render_path = "/etc/secrets/serviceAccountKey.json"
        if os.path.exists(render_path):
            credential_path = render_path
        elif settings.firebase_service_account_path.exists():
            credential_path = str(settings.firebase_service_account_path)
        else:
            raise FileNotFoundError(
                "No se encontro credenciales de Firebase. "
                "Configura Secret Files en Render o FIREBASE_SERVICE_ACCOUNT_PATH localmente."
            )
        credential = credentials.Certificate(credential_path)
        firebase_admin.initialize_app(credential)

    return firestore.client()
