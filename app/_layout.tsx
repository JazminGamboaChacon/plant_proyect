import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { RegistrationProvider } from "../src/context/RegistrationContext";
import { ThemeProvider } from "../src/context/ThemeContext";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
    Lora_400Regular_Italic,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider>
      <AuthProvider>
        <RegistrationProvider>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="register" options={{ headerShown: false }} />
            <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
            <Stack.Screen name="preference" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
            <Stack.Screen name="edit-plant" options={{ headerShown: false }} />
            <Stack.Screen name="plant-detail" options={{ headerShown: false }} />
          </Stack>
        </RegistrationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
