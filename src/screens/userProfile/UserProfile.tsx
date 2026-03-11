import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Divider from "../../componets/common/Divider";
import Header from "../../componets/common/Header";
import AchievementBadge from "../../componets/ui/AchievementBadge";
import CategoryButton from "../../componets/ui/CategoryButton";
import StatCard from "../../componets/ui/StatCard";
import { useTheme } from "../../context/ThemeContext";
import { useUserProfile } from "../../hooks/useUserProfile";
import { createStyles } from "./UserProfile.style";

export default function UserProfile() {
  const user = useUserProfile();
  const { theme } = useTheme();
  const styles = createStyles(theme);

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
            <View style={styles.avatarWrapper}>
              <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
            </View>
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileHandle}>{user.handle}</Text>
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
          <View style={styles.favPlantCard}>
            <Image
              source={{ uri: user.favoritePlant.imageUrl }}
              style={styles.favPlantImg}
            />
            <View style={styles.favPlantInfo}>
              <Text style={styles.favPlantLabel}>FAVORITE PLANT</Text>
              <Text style={styles.favPlantName}>{user.favoritePlant.name}</Text>
              <Text style={styles.favPlantFamily}>
                {user.favoritePlant.family}
              </Text>
              <Text style={styles.favPlantSince}>
                {user.favoritePlant.since}
              </Text>
            </View>
          </View>

          <Divider />

          {/* Categorías */}
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
