import { Ionicons } from "@expo/vector-icons";
import React from "react";

export type Category = {
  imageUrl: string;
  name: string;
  count: number;
};

export type Achievement = {
  iconName: React.ComponentProps<typeof Ionicons>["name"];
  label: string;
  earned: boolean;
};

export type NavItem = {
  label: string;
  active: boolean;
  iconOutline: React.ComponentProps<typeof Ionicons>["name"];
  iconFilled: React.ComponentProps<typeof Ionicons>["name"];
};

export type FavoritePlant = {
  id: string;
  name: string;
  family: string;
  since: string;
  imageUrl: string;
};

export type PlantSummary = {
  id: string;
  commonName: string;
  scientificName: string;
  type: string;
  isFavorite: boolean;
  photoURL: string | null;
};

export type PlantOfTheDay = {
  name: string;
  description: string;
};

export type UserProfileData = {
  name: string;
  handle: string;
  avatarUrl: string;
  bio: string;
  birthday: string;
  streak: number;
  friends: number;
  plants: number;
  favoritePlant: FavoritePlant | null;
  categories: Category[];
  achievements: Achievement[];
  profileCompletion: number;
  plantOfTheDay: PlantOfTheDay | null;
  plantsList: PlantSummary[];
};
