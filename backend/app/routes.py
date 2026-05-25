from datetime import datetime, timezone

from fastapi import APIRouter

from fastapi import HTTPException
from .auth import authenticate_user, create_session_token, register_user

from .models import (
    AchievementWithEarned,
    ApiCollectionResponse,
    AuthResponse,
    GroupModel,
    LoginRequest,
    PlantCareModel,
    PlantCreateModel,
    PlantModel,
    PlantTypeModel,
    RegisterRequest,
    PlantUpdateModel,
    UnlockAchievementRequest,
    UserModel,
    UserProfileResponse,
    UserUpdateModel,
)
from .services import create_document, get_collection, get_document, update_document

router = APIRouter()


@router.post("/api/auth/register", response_model=AuthResponse)
def auth_register(body: RegisterRequest) -> dict:
    user, token = register_user(
        body.email,
        body.password,
        body.fullName,
        body.username,
        body.birthday,
        body.favoritePlantTypes,
        photo_base64=body.photoBase64,
        bio=body.bio,
    )
    return {"user": user, "token": token, "is_new_user": True}


@router.post("/api/auth/login", response_model=AuthResponse)
def auth_login(body: LoginRequest) -> dict:
    user, token = authenticate_user(body.email, body.password)
    return {"user": user, "token": token, "is_new_user": False}


@router.get("/health")
def healthcheck() -> dict[str, str]:
    return {"status": "ok"}


@router.get("/api/users/{user_id}", response_model=UserModel)
def read_user(user_id: str) -> dict:
    return get_document("users", user_id)


@router.get("/api/users/{user_id}/profile", response_model=UserProfileResponse)
def read_user_profile(user_id: str) -> dict:
    user = get_document("users", user_id)
    plants = get_collection("plants", filters=[("userId", "==", user_id)])
    groups = get_collection("groups", filters=[("userId", "==", user_id)])
    plant_types = get_collection("plantTypes")

    all_achievements = get_collection("achievements")
    user_achievements = get_collection(
        "userAchievements", filters=[("userId", "==", user_id)]
    )
    earned_ids = {ua["achievementId"] for ua in user_achievements}
    achievements = [{**a, "earned": a["id"] in earned_ids} for a in all_achievements]

    return {
        "user": user,
        "plants": plants,
        "groups": groups,
        "plantTypes": plant_types,
        "achievements": achievements,
    }


@router.get("/api/users/{user_id}/plants", response_model=list[PlantModel])
def read_user_plants(user_id: str) -> list[dict]:
    return get_collection("plants", filters=[("userId", "==", user_id)])


@router.get("/api/plants/{plant_id}", response_model=PlantModel)
def read_plant_detail(plant_id: str) -> dict:
    return get_document("plants", plant_id)


@router.get("/api/users/{user_id}/groups", response_model=list[GroupModel])
def read_user_groups(user_id: str) -> list[dict]:
    return get_collection("groups", filters=[("userId", "==", user_id)])


@router.get(
    "/api/users/{user_id}/achievements",
    response_model=list[AchievementWithEarned],
)
def read_user_achievements(user_id: str) -> list[dict]:
    all_achievements = get_collection("achievements")
    user_achievements = get_collection(
        "userAchievements", filters=[("userId", "==", user_id)]
    )
    earned_ids = {ua["achievementId"] for ua in user_achievements}
    return [{**a, "earned": a["id"] in earned_ids} for a in all_achievements]


@router.post("/api/users/{user_id}/achievements/unlock")
def unlock_achievement(user_id: str, body: UnlockAchievementRequest) -> dict:
    achievements = get_collection("achievements", filters=[("key", "==", body.achievementKey)])
    if not achievements:
        raise HTTPException(status_code=404, detail=f"Logro '{body.achievementKey}' no encontrado.")
    achievement = achievements[0]
    existing = get_collection(
        "userAchievements",
        filters=[("userId", "==", user_id), ("achievementId", "==", achievement["id"])],
    )
    if existing:
        return {"alreadyEarned": True, **achievement}
    create_document("userAchievements", {
        "userId": user_id,
        "achievementId": achievement["id"],
        "unlockedAt": datetime.now(timezone.utc).isoformat(),
    })
    return {"alreadyEarned": False, **achievement}


@router.get("/api/plant-types", response_model=list[PlantTypeModel])
def read_plant_types() -> list[dict]:
    return get_collection("plantTypes")


@router.put("/api/users/{user_id}", response_model=UserModel)
def update_user(user_id: str, payload: UserUpdateModel) -> dict:
    data = payload.model_dump(exclude_none=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update.")
    return update_document("users", user_id, data)


@router.post("/api/plants", response_model=PlantModel, status_code=201)
def create_plant(payload: PlantCreateModel) -> dict:
    return create_document("plants", payload.model_dump())


@router.put("/api/plants/{plant_id}", response_model=PlantModel)
def update_plant(plant_id: str, payload: PlantUpdateModel) -> dict:
    data = payload.model_dump(exclude_none=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update.")
    return update_document("plants", plant_id, data)


@router.patch("/api/plants/{plant_id}/care")
def update_plant_care(plant_id: str, care: PlantCareModel) -> dict:
    data = {"care": care.model_dump(), "updatedAt": datetime.now(timezone.utc).isoformat()}
    return update_document("plants", plant_id, data)


@router.get("/api/collections/{collection_name}", response_model=ApiCollectionResponse)
def read_collection(collection_name: str) -> dict:
    items = get_collection(collection_name)
    return {"collection": collection_name, "count": len(items), "items": items}
