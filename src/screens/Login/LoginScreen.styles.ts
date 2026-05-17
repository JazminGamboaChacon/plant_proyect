import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/tokens/types";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    flex: { flex: 1 },
    branchesContainer: {
      ...StyleSheet.absoluteFillObject,
      overflow: "hidden",
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
      gap: theme.spacing.xs,
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
    subtitle: {
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
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
    errorText: {
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.sm,
      color: "#D32F2F",
      textAlign: "center",
    },

    // Inputs
    fieldContainer: {
      gap: theme.spacing.xs,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.primarySoft,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      height: 52,
      paddingHorizontal: theme.spacing.md,
    },
    inputIcon: {
      marginRight: theme.spacing.sm,
    },
    input: {
      flex: 1,
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textPrimary,
    },
    eyeButton: {
      padding: theme.spacing.xs,
    },

    // Forgot password
    forgotContainer: {
      alignSelf: "flex-end",
    },
    forgotText: {
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
    },

    // Sign In button (pill)
    signInButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: 50,
      height: 52,
      alignItems: "center",
      justifyContent: "center",
      marginTop: theme.spacing.xs,
    },
    signInButtonDisabled: {
      opacity: 0.6,
    },
    signInText: {
      fontFamily: "Inter_700Bold",
      fontSize: theme.typography.sizes.md,
      color: "#fff",
    },

    // Footer
    registerRow: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    registerText: {
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },
    registerLink: {
      fontFamily: "Inter_700Bold",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
      textDecorationLine: "underline",
    },
  });
