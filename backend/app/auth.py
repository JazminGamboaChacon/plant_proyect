from datetime import datetime, timezone

import bcrypt
import jwt
from fastapi import HTTPException

from .config import get_settings
from .firebase import get_firestore_client


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode(), hashed.encode())
    except Exception:
        return False


def create_session_token(user_id: str) -> str:
    settings = get_settings()
    payload = {
        "sub": user_id,
        "iat": datetime.now(timezone.utc),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def _normalize_user(doc_data: dict, doc_id: str) -> dict:
    doc_data["id"] = doc_id
    if hasattr(doc_data.get("createdAt"), "isoformat"):
        doc_data["createdAt"] = doc_data["createdAt"].isoformat()
    doc_data.pop("passwordHash", None)
    return doc_data


def register_user(
    email: str,
    password: str,
    full_name: str,
    username: str,
    birthday: str,
    favorite_plant_types: list[str],
    photo_base64: str | None = None,
) -> tuple[dict, str]:
    db = get_firestore_client()

    existing = db.collection("users").where("email", "==", email).limit(1).stream()
    for _ in existing:
        raise HTTPException(status_code=409, detail="Este email ya está registrado")

    now = datetime.now(timezone.utc).isoformat()
    new_user: dict = {
        "email": email,
        "passwordHash": hash_password(password),
        "fullName": full_name,
        "username": username,
        "birthday": birthday,
        "photoURL": f"data:image/jpeg;base64,{photo_base64}" if photo_base64 else None,
        "isPublicProfile": False,
        "favoritePlantTypes": favorite_plant_types,
        "stats": {"totalPlants": 0, "totalAchievements": 0, "daysActive": 0},
        "createdAt": now,
    }
    doc_ref = db.collection("users").add(new_user)
    new_user = _normalize_user(new_user, doc_ref[1].id)
    token = create_session_token(new_user["id"])
    return new_user, token


def authenticate_user(email: str, password: str) -> tuple[dict, str]:
    db = get_firestore_client()

    docs = db.collection("users").where("email", "==", email).limit(1).stream()
    user_data = None
    doc_id = None
    for doc in docs:
        user_data = doc.to_dict()
        doc_id = doc.id

    if not user_data or not verify_password(password, user_data.get("passwordHash", "")):
        raise HTTPException(status_code=401, detail="Email o contraseña incorrectos")

    user_data = _normalize_user(user_data, doc_id)
    token = create_session_token(user_data["id"])
    return user_data, token
