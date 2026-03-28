import { StyleSheet } from "react-native";
import { AppTheme } from "../../theme/tokens/types";

export const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      gap: 6,
    },
    label: {
      fontFamily: theme.typography.families.medium,
      fontSize: theme.typography.sizes.sm,
      color: theme.colors.textPrimary,
    },
    inputWrapper: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      height: 52,
    },
    inputWrapperFocused: {
      borderColor: theme.colors.primary,
    },
    inputWrapperError: {
      borderColor: theme.colors.error,
    },
    inputWrapperDisabled: {
      opacity: 0.5,
    },
    inputWrapperMultiline: {
      height: 120,
      alignItems: "flex-start",
      paddingVertical: theme.spacing.sm,
    },
    inputIcon: {
      marginRight: theme.spacing.sm,
    },
    input: {
      flex: 1,
      fontFamily: theme.typography.families.regular,
      fontSize: theme.typography.sizes.md,
      color: theme.colors.textPrimary,
      height: "100%",
    },
    inputMultiline: {
      textAlignVertical: "top",
    },
    eyeButton: {
      padding: 4,
    },
    errorText: {
      fontFamily: theme.typography.families.regular,
      fontSize: theme.typography.sizes.xs,
      color: theme.colors.error,
      marginTop: 2,
    },
  });
