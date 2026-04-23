from fastapi import APIRouter

from fastapi import HTTPException

from .models import (
    AchievementModel,
    AchievementWithEarned,
    ApiCollectionResponse,
    GroupModel,
    PlantModel,
    PlantTypeModel,
    PlantUpdateModel,
    UserModel,
    UserProfileResponse,
    UserUpdateModel,
)
from .services import get_collection, get_document, update_document

router = APIRouter()


@router.get("/")
def root() -> dict:
    return {"name": "Plant Project API", "version": "1.0.0", "docs": "/docs"}


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

    achievements = [
        {**a, "earned": a["id"] in earned_ids} for a in all_achievements
    ]

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


@router.get("/api/plant-types", response_model=list[PlantTypeModel])
def read_plant_types() -> list[dict]:
    return get_collection("plantTypes")


@router.put("/api/users/{user_id}", response_model=UserModel)
def update_user(user_id: str, payload: UserUpdateModel) -> dict:
    data = payload.model_dump(exclude_none=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update.")
    return update_document("users", user_id, data)


@router.put("/api/plants/{plant_id}", response_model=PlantModel)
def update_plant(plant_id: str, payload: PlantUpdateModel) -> dict:
    data = payload.model_dump(exclude_none=True)
    if not data:
        raise HTTPException(status_code=400, detail="No fields to update.")
    return update_document("plants", plant_id, data)


@router.get("/api/collections/{collection_name}", response_model=ApiCollectionResponse)
def read_collection(collection_name: str) -> dict:
    items = get_collection(collection_name)
    return {
        "collection": collection_name,
        "count": len(items),
        "items": items,
    }
