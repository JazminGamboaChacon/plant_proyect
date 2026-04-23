from pydantic import BaseModel


class FirestoreBaseModel(BaseModel):
    id: str
    createdAt: str


class UserStatsEmbed(BaseModel):
    totalPlants: int
    totalAchievements: int
    daysActive: int


class UserModel(FirestoreBaseModel):
    email: str
    username: str
    fullName: str
    birthday: str
    photoURL: str | None = None
    isPublicProfile: bool
    favoritePlantTypes: list[str]
    stats: UserStatsEmbed


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


class UserUpdateModel(BaseModel):
    username: str | None = None
    fullName: str | None = None
    birthday: str | None = None
    photoURL: str | None = None
    isPublicProfile: bool | None = None
    favoritePlantTypes: list[str] | None = None


class PlantUpdateModel(BaseModel):
    commonName: str | None = None
    scientificName: str | None = None
    photoURL: str | None = None
    type: str | None = None
    groupId: str | None = None
    isFavorite: bool | None = None
    notes: str | None = None


class ApiCollectionResponse(BaseModel):
    collection: str
    count: int
    items: list[dict]
