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
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.lg,
      gap: theme.spacing.lg,
    },

    // Header
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
    },
    headerTitle: {
      fontFamily: "Inter_700Bold",
      fontSize: theme.typography.sizes.xl,
      color: theme.colors.textPrimary,
      flex: 1,
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

    // Avatar section
    avatarSection: {
      alignItems: "center",
      gap: theme.spacing.sm,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: theme.radius.full,
    },
    avatarPlaceholder: {
      width: 80,
      height: 80,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.primaryLight,
      alignItems: "center",
      justifyContent: "center",
    },

    // Section label
    sectionLabel: {
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textPrimary,
    },

    // Plant grid
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
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.xs,
    },
    plantCardSelected: {
      backgroundColor: theme.colors.primaryPale,
      borderColor: theme.colors.primary,
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

    // Divider
    divider: {
      height: 1,
      backgroundColor: theme.colors.border,
    },

    // Error for plant types
    errorText: {
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.error,
      marginTop: -theme.spacing.sm + 2,
    },

    // Buttons
    buttonsRow: {
      flexDirection: "row",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
    },
    cancelButton: {
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
    cancelText: {
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textPrimary,
    },
    saveButton: {
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
    saveButtonDisabled: {
      opacity: 0.6,
    },
    saveText: {
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.md,
      color: "#F6F9F6",
    },

    // Loading overlay
    loadingCenter: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });
