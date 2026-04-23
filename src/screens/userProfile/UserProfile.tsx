import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import Divider from "../../componets/common/Divider";
import Header from "../../componets/common/Header";
import AchievementBadge from "../../componets/ui/AchievementBadge";
import CategoryButton from "../../componets/ui/CategoryButton";
import StatCard from "../../componets/ui/StatCard";
import { useTheme } from "../../context/ThemeContext";
import { useUserProfile } from "../../hooks/useUserProfile";
import { createStyles } from "./UserProfile.style";

const USER_ID = "user-1";

export default function UserProfile() {
  const { data: user, loading, error } = useUserProfile(USER_ID);
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
          <Ionicons name="cloud-offline-outline" size={48} color={theme.colors.textSecondary} />
          <Text style={{ color: theme.colors.textSecondary, marginTop: 12 }}>
            {error || "Could not load profile"}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Header />

          {/* Botón editar perfil */}
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "flex-end",
              marginRight: theme.spacing.lg,
              marginBottom: theme.spacing.sm,
              paddingHorizontal: theme.spacing.md,
              paddingVertical: theme.spacing.xs,
              backgroundColor: theme.colors.surface,
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderRadius: theme.radius.md,
              gap: theme.spacing.xs,
            }}
            onPress={() => router.push("/edit-profile" as any)}
          >
            <Feather name="edit-2" size={14} color={theme.colors.primary} />
            <Text
              style={{
                fontFamily: theme.typography.families.medium,
                fontSize: theme.typography.sizes.sm,
                color: theme.colors.primary,
              }}
            >
              Editar Perfil
            </Text>
          </TouchableOpacity>

          {/* Perfil */}
          <View style={styles.profileSection}>
            <View style={styles.avatarWrapper}>
              {user.avatarUrl ? (
                <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, { backgroundColor: theme.colors.primaryLight, justifyContent: "center", alignItems: "center" }]}>
                  <Ionicons name="person" size={theme.iconSize.lg} color={theme.colors.primary} />
                </View>
              )}
            </View>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileHandle}>{user.handle}</Text>
            {user.bio ? (
              <View style={styles.bioCard}>
                <View style={styles.bioIconBg}>
                  <Ionicons
                    name="leaf"
                    size={theme.iconSize.md}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.bioText}>{user.bio}</Text>
              </View>
            ) : null}
            <View style={styles.birthdayRow}>
              <Ionicons
                name="gift-outline"
                size={theme.iconSize.sm}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.birthdayText}>{user.birthday}</Text>
            </View>
          </View>

          <Divider />

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatCard
              icon={
                <MaterialCommunityIcons
                  name="fire"
                  size={theme.iconSize.md}
                  color={theme.colors.textPrimary}
                />
              }
              value={String(user.streak)}
              label="Streak"
              iconBg={theme.colors.peach}
            />
            <StatCard
              icon={
                <Ionicons
                  name="people-outline"
                  size={theme.iconSize.md}
                  color={theme.colors.textPrimary}
                />
              }
              value={String(user.friends)}
              label="Friends"
              iconBg={theme.colors.primaryLight}
            />
            <StatCard
              icon={
                <MaterialCommunityIcons
                  name="sprout"
                  size={theme.iconSize.md}
                  color={theme.colors.textPrimary}
                />
              }
              value={String(user.plants)}
              label="Plants"
              iconBg={theme.colors.teal}
            />
          </View>

          <Divider />

          {/* Planta favorita */}
          {user.favoritePlant ? (
            <>
              <View style={styles.favPlantCard}>
                {user.favoritePlant.imageUrl ? (
                  <Image
                    source={{ uri: user.favoritePlant.imageUrl }}
                    style={styles.favPlantImg}
                  />
                ) : (
                  <View style={[styles.favPlantImg, { backgroundColor: theme.colors.primaryLight, justifyContent: "center", alignItems: "center" }]}>
                    <MaterialCommunityIcons name="flower" size={32} color={theme.colors.primary} />
                  </View>
                )}
                <View style={styles.favPlantInfo}>
                  <Text style={styles.favPlantLabel}>FAVORITE PLANT</Text>
                  <Text style={styles.favPlantName}>
                    {user.favoritePlant.name}
                  </Text>
                  <Text style={styles.favPlantFamily}>
                    {user.favoritePlant.family}
                  </Text>
                  <Text style={styles.favPlantSince}>
                    {user.favoritePlant.since}
                  </Text>
                </View>
              </View>
              <Divider />
            </>
          ) : null}

          {/* Categorias (plantTypes) */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="shape-outline"
              size={theme.iconSize.sm}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.sectionTitle}>PLANT CATEGORIES</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
            style={styles.categoriesScroll}
          >
            {user.categories.map((cat) => (
              <CategoryButton key={cat.name} {...cat} />
            ))}
          </ScrollView>

          <Divider />

          {/* Logros */}
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="trophy-outline"
              size={theme.iconSize.sm}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.sectionTitle}>ACHIEVEMENTS</Text>
          </View>
          <View style={styles.badgesRow}>
            {user.achievements
              .filter((a) => a.earned)
              .map((a) => (
                <AchievementBadge key={a.label} {...a} />
              ))}
          </View>
          <View style={styles.badgesRow}>
            {user.achievements
              .filter((a) => !a.earned)
              .map((a) => (
                <AchievementBadge key={a.label} {...a} />
              ))}
          </View>

          <Divider />

          {/* Mis Plantas */}
          {user.plantsList.length > 0 && (
            <>
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name="sprout"
                  size={theme.iconSize.sm}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.sectionTitle}>MY PLANTS</Text>
              </View>
              <View style={{ paddingHorizontal: theme.spacing.lg, gap: theme.spacing.sm, marginBottom: theme.spacing.xs }}>
                {user.plantsList.map((plant) => (
                  <TouchableOpacity
                    key={plant.id}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      backgroundColor: theme.colors.surface,
                      borderWidth: 1,
                      borderColor: theme.colors.border,
                      borderRadius: theme.radius.lg,
                      padding: theme.spacing.md,
                      gap: theme.spacing.md,
                    }}
                    onPress={() =>
                      router.push({
                        pathname: "/edit-plant" as any,
                        params: { plantId: plant.id },
                      })
                    }
                  >
                    {plant.photoURL ? (
                      <Image
                        source={{ uri: plant.photoURL }}
                        style={{ width: 48, height: 48, borderRadius: theme.radius.md }}
                      />
                    ) : (
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: theme.radius.md,
                          backgroundColor: theme.colors.primaryLight,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <MaterialCommunityIcons
                          name="flower"
                          size={24}
                          color={theme.colors.primary}
                        />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          fontFamily: theme.typography.families.medium,
                          fontSize: theme.typography.sizes.md,
                          color: theme.colors.textPrimary,
                        }}
                      >
                        {plant.commonName}
                      </Text>
                      <Text
                        style={{
                          fontFamily: theme.typography.families.scientific,
                          fontSize: theme.typography.sizes.sm,
                          color: theme.colors.textSecondary,
                          fontStyle: "italic",
                        }}
                      >
                        {plant.scientificName}
                      </Text>
                    </View>
                    {plant.isFavorite && (
                      <Ionicons
                        name="heart"
                        size={16}
                        color={theme.colors.primary}
                      />
                    )}
                    <Feather
                      name="edit-2"
                      size={16}
                      color={theme.colors.textSecondary}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <Divider />
            </>
          )}

          {/* Completitud */}
          <View style={styles.completionCard}>
            <View style={styles.completionTop}>
              <View style={styles.completionTitleRow}>
                <Ionicons
                  name="person-circle-outline"
                  size={theme.iconSize.md}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.completionTitle}>Profile Completion</Text>
              </View>
              <Text style={styles.completionPct}>
                {user.profileCompletion}%
              </Text>
            </View>
            <View style={styles.progressBg}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${user.profileCompletion}%` },
                ]}
              />
            </View>
            <Text style={styles.completionHint}>
              Add more info to complete your profile!
            </Text>
          </View>

          <View style={{ height: theme.spacing.md }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
