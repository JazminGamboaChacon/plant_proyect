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
      marginBottom: theme.spacing.xs,
    },

    // Fields
    fieldContainer: {
      gap: 6,
    },
    label: {
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textPrimary,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      height: 52,
    },
    inputIcon: {
      marginRight: theme.spacing.sm,
    },
    input: {
      flex: 1,
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textPrimary,
      height: "100%",
    },
    eyeButton: {
      padding: 4,
    },

    // Forgot password
    forgotContainer: {
      alignSelf: "flex-end",
      marginTop: -theme.spacing.xs,
    },
    forgotText: {
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.teal,
    },

    // Sign In button
    signInButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      height: 48,
      alignItems: "center",
      justifyContent: "center",
      marginTop: theme.spacing.xs,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    signInText: {
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.md,
      color: "#F6F9F6",
    },

    // Divider
    dividerRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.spacing.sm,
      marginVertical: theme.spacing.xs,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textSecondary,
    },

    // Social buttons
    socialContainer: {
      gap: theme.spacing.sm,
    },
    socialButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.background,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      height: 48,
      gap: theme.spacing.sm,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    socialText: {
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textPrimary,
    },

    // Register
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
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.primary,
    },
  });