import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import Divider from "../../componets/common/Divider";
import Header from "../../componets/common/Header";
import TabBar from "../../componets/common/TabBar";
import AchievementBadge from "../../componets/ui/AchievementBadge";
import CategoryButton from "../../componets/ui/CategoryButton";
import StatCard from "../../componets/ui/StatCard";
import { useTheme } from "../../context/ThemeContext";
import { useUserProfile } from "../../hooks/useUserProfile";
import CustumSafeAreaView from "../../layout/CustumSafeAreaView";
import { createStyles } from "./UserProfile.style";

export default function UserProfile() {
  const user = useUserProfile();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <CustumSafeAreaView>
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
                <Ionicons name="leaf" size={16} color={theme.colors.green} />
              </View>
              <Text style={styles.bioText}>{user.bio}</Text>
            </View>
          </View>

          <Divider />

          {/* Cumpleaños */}
          <View style={styles.infoRow}>
            <Ionicons
              name="gift-outline"
              size={16}
              color={theme.colors.textMid}
            />
            <Text style={styles.infoLabel}>Birthday</Text>
            <Text style={styles.infoValue}>{user.birthday}</Text>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            <StatCard
              icon={
                <MaterialCommunityIcons
                  name="fire"
                  size={20}
                  color={theme.colors.textDark}
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
                  size={20}
                  color={theme.colors.textDark}
                />
              }
              value={String(user.friends)}
              label="Friends"
              iconBg={theme.colors.greenLight}
            />
            <StatCard
              icon={
                <MaterialCommunityIcons
                  name="sprout"
                  size={20}
                  color={theme.colors.textDark}
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
              size={14}
              color={theme.colors.textMid}
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
              size={14}
              color={theme.colors.textMid}
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
                  size={16}
                  color={theme.colors.textMid}
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

          {/* Planta del día */}
          <View style={styles.potdCard}>
            <View style={styles.potdIconBg}>
              <MaterialCommunityIcons
                name="flower-tulip-outline"
                size={22}
                color={theme.colors.green}
              />
            </View>
            <View style={styles.potdInfo}>
              <Text style={styles.potdLabel}>PLANT OF THE DAY</Text>
              <Text style={styles.potdName}>{user.plantOfTheDay.name}</Text>
              <Text style={styles.potdDesc}>
                {user.plantOfTheDay.description}
              </Text>
            </View>
          </View>

          <View style={{ height: 16 }} />
        </ScrollView>

        <TabBar />
      </View>
    </CustumSafeAreaView>
  );
}
