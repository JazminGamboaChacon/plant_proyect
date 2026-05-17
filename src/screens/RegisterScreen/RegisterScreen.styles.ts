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
    stepDot: {
      width: 10,
      height: 10,
      borderRadius: theme.radius.full,
      backgroundColor: theme.colors.border,
    },
    stepActive: {
      backgroundColor: theme.colors.primary,
      width: 24,
      borderRadius: theme.radius.full,
    },
    stepLine: {
      width: 24,
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

    // Continue button
    continueButton: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.radius.md,
      height: 48,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing.sm,
      marginTop: theme.spacing.xs,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    continueText: {
      fontFamily: "Inter_500Medium",
      fontSize: theme.typography.sizes.md,
      color: "#F6F9F6",
    },

    // Error text
    errorText: {
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.sm,
      color: "#D32F2F",
      textAlign: "center",
    },

    // Password strength bar
    strengthContainer: {
      gap: 4,
    },
    strengthSegments: {
      flexDirection: "row",
      gap: 4,
    },
    strengthSegment: {
      flex: 1,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.border,
    },
    strengthLabel: {
      fontFamily: "Inter_400Regular",
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.textSecondary,
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