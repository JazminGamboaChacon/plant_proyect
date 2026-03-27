import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/tokens/types";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      flex: 1,
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
      width: 64,
      height: 64,
      borderRadius: theme.radius.lg,
      backgroundColor: theme.colors.primaryPale,
      alignItems: "center",
      justifyContent: "center",
    },
    appName: {
      fontFamily: "Inter_700Bold",
      fontSize: theme.typography.sizes.xl,
      color: theme.colors.textPrimary,
      letterSpacing: -0.5,
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
    welcomeTitle: {
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
      marginBottom: theme.spacing.sm,
    },

    // Google button
    googleButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      height: 52,
      gap: theme.spacing.sm,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    googleButtonText: {
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textPrimary,
    },
  });
