from datetime import datetime, timezone

import jwt
from fastapi import HTTPException
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token

from .config import get_settings
from .firebase import get_firestore_client


def verify_google_token(token: str) -> dict:
    settings = get_settings()
    try:
        payload = google_id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.google_client_id,
        )
        return payload
    except ValueError as e:
        raise HTTPException(status_code=401, detail=f"Token de Google invalido: {e}")


def get_or_create_user(google_payload: dict) -> tuple[dict, bool]:
    db = get_firestore_client()
    email = google_payload["email"]

    existing = db.collection("users").where("email", "==", email).limit(1).stream()
    for doc in existing:
        user_data = doc.to_dict()
        user_data["id"] = doc.id
        if hasattr(user_data.get("createdAt"), "isoformat"):
            user_data["createdAt"] = user_data["createdAt"].isoformat()
        return user_data, False

    now = datetime.now(timezone.utc).isoformat()
    username = email.split("@")[0]
    new_user = {
        "email": email,
        "fullName": google_payload.get("name", ""),
        "username": username,
        "birthday": "",
        "photoURL": google_payload.get("picture"),
        "isPublicProfile": False,
        "favoritePlantTypes": [],
        "stats": {"totalPlants": 0, "totalAchievements": 0, "daysActive": 0},
        "createdAt": now,
    }
    doc_ref = db.collection("users").add(new_user)
    new_user["id"] = doc_ref[1].id
    return new_user, True


def create_session_token(user_id: str) -> str:
    settings = get_settings()
    payload = {
        "sub": user_id,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")
