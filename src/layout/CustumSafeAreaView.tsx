import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";

export default function CustumSafeAreaView({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      {children}
    </SafeAreaView>
  );
}
