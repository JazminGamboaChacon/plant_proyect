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
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useUserProfile } from "../../hooks/useUserProfile";
import { createStyles } from "./UserProfile.style";

export default function UserProfile() {
  const { user: authUser, signOut } = useAuth();
  const { data: user, loading, error, refetch } = useUserProfile(authUser?.id ?? "");
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
        <View style={[styles.container, { justifyContent: "center", alignItems: "center", gap: 16 }]}>
          <Ionicons name="cloud-offline-outline" size={48} color={theme.colors.textSecondary} />
          <Text style={{ color: theme.colors.textSecondary, textAlign: "center", marginHorizontal: 32 }}>
            {error || "No se pudo cargar el perfil"}
          </Text>
          <TouchableOpacity
            onPress={refetch}
            style={{
              backgroundColor: theme.colors.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: theme.radius.md,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "600" }}>Reintentar</Text>
          </TouchableOpacity>
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
              label="Racha"
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
              label="Amigos"
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
              label="Plantas"
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
                  <Text style={styles.favPlantLabel}>PLANTA FAVORITA</Text>
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
            <Text style={styles.sectionTitle}>CATEGORÍAS DE PLANTAS</Text>
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
            <Text style={styles.sectionTitle}>LOGROS</Text>
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
                <Text style={styles.sectionTitle}>MIS PLANTAS</Text>
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
                <Text style={styles.completionTitle}>Completitud del perfil</Text>
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
              ¡Agrega más información para completar tu perfil!
            </Text>
          </View>

          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              marginHorizontal: theme.spacing.lg,
              marginTop: theme.spacing.md,
              paddingVertical: theme.spacing.md,
              backgroundColor: "#FFF0F0",
              borderWidth: 1,
              borderColor: "#FFCDD2",
              borderRadius: theme.radius.md,
              gap: theme.spacing.xs,
            }}
            onPress={() => signOut()}
          >
            <Ionicons name="log-out-outline" size={18} color="#D32F2F" />
            <Text
              style={{
                fontFamily: theme.typography.families.medium,
                fontSize: theme.typography.sizes.sm,
                color: "#D32F2F",
              }}
            >
              Cerrar sesión
            </Text>
          </TouchableOpacity>

          <View style={{ height: theme.spacing.md }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
