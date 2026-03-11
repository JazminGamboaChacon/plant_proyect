import { UserProfileData } from "../types-dtos/user.types";

export function useUserProfile(): UserProfileData {
  return {
    name: "Jazmín Gamboa",
    handle: "@plantlover",
    avatarUrl:
      "https://www.figma.com/api/mcp/asset/0062bd19-a798-4512-98e8-d1d029ec0d3d",
    bio: "Passionate plant parent with a growing indoor jungle. I believe every room deserves a touch of green. Currently obsessed with rare aroids and propagation!",
    birthday: "March 15",
    streak: 42,
    friends: 128,
    plants: 67,
    favoritePlant: {
      name: "Monstera Deliciosa",
      family: "Araceae family",
      since: "Growing since 2023",
      imageUrl:
        "https://www.figma.com/api/mcp/asset/b20ead1d-5e25-47eb-b269-8d5b939dbfe5",
    },
    categories: [
      {
        imageUrl:
          "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=200&h=200&fit=crop",
        name: "Aroids",
        count: 12,
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1509423350716-97f9360b4e09?w=200&h=200&fit=crop",
        name: "Succulents",
        count: 15,
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1597305877032-0668b3c6413a?w=200&h=200&fit=crop",
        name: "Ferns",
        count: 8,
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=200&h=200&fit=crop",
        name: "Tropicals",
        count: 10,
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=200&h=200&fit=crop",
        name: "Herbs",
        count: 6,
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=200&h=200&fit=crop",
        name: "Cacti",
        count: 9,
      },
      {
        imageUrl:
          "https://images.unsplash.com/photo-1566408669374-5a6d5dca1ef5?w=200&h=200&fit=crop",
        name: "Orchids",
        count: 7,
      },
    ],
    achievements: [
      { iconName: "flower-outline", label: "First Bloom", earned: true },
      { iconName: "water-outline", label: "Water Wizard", earned: true },
      { iconName: "sunny-outline", label: "Sun Seeker", earned: true },
      { iconName: "leaf-outline", label: "Forest Builder", earned: false },
      { iconName: "star-outline", label: "Plant Star", earned: false },
    ],
    profileCompletion: 85,
    plantOfTheDay: {
      name: "Calathea Orbifolia",
      description: "Known for its stunning round leaves with silver stripes",
    },
  };
}
