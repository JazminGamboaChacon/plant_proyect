import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useCallback, useEffect } from "react";
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from "react-native-reanimated";
import Svg, { Circle, Ellipse } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useRouter } from "expo-router";
import Divider from "../../componets/common/Divider";
import Header from "../../componets/common/Header";
import MonsteraLoader from "../../componets/common/MonsteraLoader";
import AchievementBadge from "../../componets/ui/AchievementBadge";
import CategoryButton from "../../componets/ui/CategoryButton";
import ProfileInfoCard from "../../componets/ui/ProfileInfoCard";
import StatCard from "../../componets/ui/StatCard";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { useUserProfile } from "../../hooks/useUserProfile";
import { createStyles } from "./UserProfile.style";

const FLOWER_SIZE = 168;
const AVATAR_SIZE = 120;
const PETALS = [0, 45, 90, 135, 180, 225, 270, 315];
const DOTS = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

function FlowerAvatar({ uri, fallbackColor }: { uri: string | null; fallbackColor: string }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 14000, easing: Easing.linear }),
      -1,
      false,
    );
  }, []);

  const flowerStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={{ width: FLOWER_SIZE, height: FLOWER_SIZE, alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
      <Animated.View style={[StyleSheet.absoluteFill, flowerStyle]}>
        <Svg width={FLOWER_SIZE} height={FLOWER_SIZE} viewBox="0 0 168 168">
          {PETALS.map((angle, i) => (
            <Ellipse
              key={`p${i}`}
              cx="84" cy="18" rx="9" ry="20"
              fill={i % 2 === 0 ? "#FFD166" : "#FFC039"}
              opacity={0.88}
              transform={`rotate(${angle} 84 84)`}
            />
          ))}
          {DOTS.map((angle, i) => (
            <Circle
              key={`d${i}`}
              cx="84" cy="30" r="5"
              fill="#FF9A3C"
              opacity={0.8}
              transform={`rotate(${angle} 84 84)`}
            />
          ))}
        </Svg>
      </Animated.View>
      <View
        style={{
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          borderRadius: AVATAR_SIZE / 2,
          borderWidth: 4,
          borderColor: "#fff",
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.12,
          shadowRadius: 6,
          elevation: 5,
          zIndex: 2,
        }}
      >
        {uri ? (
          <Image source={{ uri }} style={{ width: "100%", height: "100%" }} />
        ) : (
          <View style={{ flex: 1, backgroundColor: fallbackColor, alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="person" size={40} color="#397949" />
          </View>
        )}
      </View>
    </View>
  );
}

export default function UserProfile() {
  const { user: authUser } = useAuth();
  const { data: user, loading, error, refetch } = useUserProfile(authUser?.id ?? "");
  const { theme } = useTheme();
  const styles = createStyles(theme);
  const router = useRouter();

  useFocusEffect(useCallback(() => { refetch(); }, [refetch]));

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: '#08200F' }]}>
        <MonsteraLoader />
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

          {/* Perfil */}
          <View style={styles.profileSection}>
            <FlowerAvatar uri={user.avatarUrl} fallbackColor={theme.colors.primaryLight} />
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
            <View style={{ alignSelf: "stretch", marginTop: theme.spacing.md }}>
              <ProfileInfoCard
                icon="cake-variant"
                label="Cumpleaños"
                value={user.birthday || "Sin definir"}
                accentColor="#E0609A"
              />
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

          <View style={{ height: theme.spacing.md }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
