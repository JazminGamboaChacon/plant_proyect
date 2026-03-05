import { UserProfileData } from "../types-dtos/user.types";

export function useUserProfile(): UserProfileData {
  return {
    name: "Luna Greenfield",
    handle: "@plantmama_luna",
    avatarUrl: "https://www.figma.com/api/mcp/asset/0062bd19-a798-4512-98e8-d1d029ec0d3d",
    bio: "Passionate plant parent with a growing indoor jungle. I believe every room deserves a touch of green. Currently obsessed with rare aroids and propagation!",
    birthday: "March 15",
    streak: 42,
    friends: 128,
    plants: 67,
    favoritePlant: {
      name: "Monstera Deliciosa",
      family: "Araceae family",
      since: "Growing since 2023",
      imageUrl: "https://www.figma.com/api/mcp/asset/b20ead1d-5e25-47eb-b269-8d5b939dbfe5",
    },
    categories: [
      { iconName: "leaf",         name: "Aroids",     count: 12 },
      { iconName: "cactus",       name: "Succulents", count: 15 },
      { iconName: "leaf-maple",   name: "Ferns",      count: 8  },
      { iconName: "flower",       name: "Tropicals",  count: 10 },
      { iconName: "sprout",       name: "Herbs",      count: 6  },
      { iconName: "tree-outline", name: "Cacti",      count: 9  },
      { iconName: "flower-tulip", name: "Orchids",    count: 7  },
    ],
    achievements: [
      { iconName: "flower-outline", label: "First Bloom",    earned: true  },
      { iconName: "water-outline",  label: "Water Wizard",   earned: true  },
      { iconName: "sunny-outline",  label: "Sun Seeker",     earned: true  },
      { iconName: "leaf-outline",   label: "Forest Builder", earned: false },
      { iconName: "star-outline",   label: "Plant Star",     earned: false },
    ],
    profileCompletion: 85,
    plantOfTheDay: {
      name: "Calathea Orbifolia",
      description: "Known for its stunning round leaves with silver stripes",
    },
  };
}