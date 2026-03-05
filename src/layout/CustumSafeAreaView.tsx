import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useProfileTheme } from "./CustumSafeArea.style";

export default function CustumSafeAreaView({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const { styles } = useProfileTheme();
  return <SafeAreaView style={styles.container}>{children}</SafeAreaView>;
}
