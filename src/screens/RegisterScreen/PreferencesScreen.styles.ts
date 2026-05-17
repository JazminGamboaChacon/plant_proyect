import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/tokens/types";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      justifyContent: "center",
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.xl,
      gap: theme.spacing.lg,
    },

    // Logo
    logoContainer: {
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    logoBackground: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 3,
      borderColor: theme.colors.primaryLight,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 10,
      elevation: 8,
    },
    appName: {
      fontFamily: "Lora_400Regular_Italic",
      fontSize: theme.typography.sizes.xxl,
      color: theme.colors.textPrimary,
      letterSpacing: 1,
    },
    branchesContainer: {
      ...StyleSheet.absoluteFillObject,
      overflow: "hidden",
    },

    // Steps
    stepsContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
    },
    stepCompleted: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    stepActive: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
    stepLine: {
      width: 32,
      height: 2,
      backgroundColor: theme.colors.border,
      borderRadius: 1,
    },

    // Card
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.radius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: theme.spacing.lg,
      gap: theme.spacing.md,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    title: {
      fontFamily: "Inter_700Bold",
      fontSize: theme.typography.sizes.lg,
      color: theme.colors.textPrimary,
      textAlign: "center",
    },
    subtitle: {
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
      textAlign: "center",
      marginTop: -theme.spacing.sm,
    },

    // Plant types
    sectionContainer: {
      gap: theme.spacing.sm,
    },
    sectionLabel: {
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textPrimary,
    },
    plantGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.spacing.sm,
    },
    plantCard: {
      width: "30%",
      aspectRatio: 1,
      backgroundColor: theme.colors.background,
      borderRadius: theme.radius.md,
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
    },
    plantCardSelected: {
      backgroundColor: theme.colors.primaryPale,
      borderColor: theme.colors.primary,
    },
    plantEmoji: {
      fontSize: 28,
    },
    plantLabel: {
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    plantLabelSelected: {
      fontFamily: "Inter_500Medium",
      color: theme.colors.primary,
    },

    // Divider
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
    },

    // Toggle
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    toggleLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      flex: 1,
    },
    toggleIcon: {
      marginRight: theme.spacing.xs,
    },
    toggleTitle: {
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textPrimary,
    },
    toggleSubtitle: {
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
    },

    // Buttons
    buttonsRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    backButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      height: 48,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      gap: theme.spacing.xs,
    },
    backText: {
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textPrimary,
    },
    createButton: {
      flex: 2,
      alignItems: "center",
      justifyContent: "center",
      height: 48,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.primary,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    createText: {
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.md,
      color: "#F6F9F6",
    },

    // Sign in
    signInRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    signInText: {
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },
    signInLink: {
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
    },
  });