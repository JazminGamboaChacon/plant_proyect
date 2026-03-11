import React from "react";
import { View } from "react-native";
import { useTheme } from "./../context/ThemeContext";
import { createStyles } from "./ScreenWrapper.styles";

export default function ScreenWrapper({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return <View style={styles.container}>{children}</View>;
}