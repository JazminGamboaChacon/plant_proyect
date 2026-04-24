import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import { Stack } from "expo-router";
import { SyncProvider } from "../src/context/SyncContext";
import { ThemeProvider } from "../src/context/ThemeContext";
import { ToastProvider } from "../src/context/ToastContext";

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
      <ToastProvider>
        <SyncProvider userId="user-1">
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="profile-setup" options={{ headerShown: false }} />
          <Stack.Screen name="preference" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="edit-profile" options={{ headerShown: false }} />
          <Stack.Screen name="edit-plant" options={{ headerShown: false }} />
        </Stack>
        </SyncProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
