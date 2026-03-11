import { Text, View } from "react-native";
import { useTheme } from "../../src/context/ThemeContext";

export default function ExploreScreen() {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.colors.background }}>
      <Text style={{ color: theme.colors.textPrimary, fontFamily: theme.typography.families.medium }}>Explore</Text>
    </View>
  );
}
