import React from "react";
import { Text, View } from "react-native";
import { useTheme } from "../../context/ThemeContext";
import { createStyles } from "./StatCard.styles";

type Props = {
  icon: React.ReactNode;
  value: string;
  label: string;
  iconBg: string;
};

export default function StatCard({ icon, value, label, iconBg }: Props) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconBg, { backgroundColor: iconBg }]}>
        {icon}
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
