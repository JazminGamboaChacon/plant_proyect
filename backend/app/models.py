from pydantic import BaseModel


class FirestoreBaseModel(BaseModel):
    id: str
    createdAt: str


class UserStatsEmbed(BaseModel):
    totalPlants: int = 0
    totalAchievements: int = 0
    daysActive: int = 0


class UserModel(FirestoreBaseModel):
    email: str
    username: str
    fullName: str
    birthday: str = ""
    photoURL: str | None = None
    isPublicProfile: bool = False
    favoritePlantTypes: list[str] = []
    stats: UserStatsEmbed = UserStatsEmbed()


class GoogleAuthRequest(BaseModel):
    id_token: str


class AuthResponse(BaseModel):
    user: UserModel
    token: str
    is_new_user: bool


class AchievementModel(BaseModel):
    id: str
    key: str
    label: str
    description: str
    icon: str


class UserAchievementModel(BaseModel):
    id: str
    userId: str
    achievementId: str
    unlockedAt: str


class PlantModel(FirestoreBaseModel):
    userId: str
    commonName: str
    scientificName: str
    photoURL: str | None = None
    type: str
    groupId: str
    isFavorite: bool
    notes: str


class GroupModel(FirestoreBaseModel):
    userId: str
    name: str


class PlantTypeModel(BaseModel):
    id: str
    label: str
    icon: str
    lib: str


class AchievementWithEarned(BaseModel):
    id: str
    key: str
    label: str
    description: str
    icon: str
    earned: bool


class UserProfileResponse(BaseModel):
    user: UserModel
    plants: list[PlantModel]
    groups: list[GroupModel]
    plantTypes: list[PlantTypeModel]
    achievements: list[AchievementWithEarned]


class ApiCollectionResponse(BaseModel):
    collection: str
    count: int
    items: list[dict]
