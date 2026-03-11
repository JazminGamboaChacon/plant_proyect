import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/tokens/types";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.colors.background },
    container: { flex: 1 },
    scroll: { flex: 1 },
    scrollContent: { paddingBottom: theme.spacing.sm },

    profileSection: {
      alignItems: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingBottom: theme.spacing.md,
    },
    avatarWrapper: {
      width: 120,
      height: 120,
      borderRadius: theme.radius.full,
      borderWidth: 4,
      borderColor: theme.colors.surface,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
      marginBottom: theme.spacing.md,
    },
    avatar: { width: "100%", height: "100%" },
    profileName: {
      fontFamily: theme.typography.families.bold,
      fontSize: theme.typography.sizes.xl,
      color: theme.colors.textPrimary,
      marginBottom: 4,
    },
    profileHandle: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.md,
    },
    bioCard: {
      flexDirection: "row",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      gap: theme.spacing.md,
      elevation: 2,
    },
    bioIconBg: {
      width: theme.iconSize.sm,
      height: theme.iconSize.sm,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },
    bioText: {
      flex: 1,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textPrimary,
      lineHeight: 22,
    },

    birthdayRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      marginTop: theme.spacing.sm,
    },
    birthdayText: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },

    statsRow: {
      flexDirection: "row",
      marginHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
      marginBottom: 4,
    },

    favPlantCard: {
      flexDirection: "row",
      marginHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      alignItems: "center",
      gap: theme.spacing.md,
      overflow: "hidden",
      elevation: 2,
    },
    favPlantImg: { width: 80, height: 80, borderRadius: theme.radius.xl },
    favPlantInfo: { flex: 1 },
    favPlantLabel: {
      fontSize: theme.typography.sizes.xs,
      fontFamily: theme.typography.families.medium,
      color: theme.colors.primary,
      letterSpacing: 0.6,
      marginBottom: 4,
    },
    favPlantName: {
      fontSize: theme.typography.sizes.lg,
      fontFamily: theme.typography.families.bold,
      color: theme.colors.textPrimary,
      marginBottom: 2,
    },
    favPlantFamily: {
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      marginBottom: 2,
    },
    favPlantSince: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
      opacity: 0.7,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
      paddingHorizontal: theme.spacing.lg,
      marginBottom: theme.spacing.sm,
    },
    sectionTitle: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.medium,
      color: theme.colors.textSecondary,
      letterSpacing: 0.7,
    },
    categoriesScroll: { marginBottom: 4 },
    categoriesContent: {
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
    },

    badgesRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      paddingHorizontal: theme.spacing.lg,
      gap: theme.spacing.sm,
      marginBottom: theme.spacing.xs,
    },

    completionCard: {
      marginHorizontal: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
    },
    completionTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.spacing.sm,
    },
    completionTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.xs,
    },
    completionTitle: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.medium,
      color: theme.colors.textPrimary,
    },
    completionPct: {
      fontSize: theme.typography.sizes.sm,
      fontFamily: theme.typography.families.bold,
      color: theme.colors.primary,
    },
    progressBg: {
      height: 8,
      backgroundColor: theme.colors.primaryPale,
      borderRadius: theme.radius.full,
      overflow: "hidden",
      marginBottom: theme.spacing.sm,
    },
    progressFill: {
      height: "100%",
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.full,
    },
    completionHint: {
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
    },
  });
