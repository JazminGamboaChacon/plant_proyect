import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Lora_400Regular_Italic } from "@expo-google-fonts/lora";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { useAuth, AuthProvider } from "../src/context/AuthContext";
import { RegistrationProvider } from "../src/context/RegistrationContext";
import { SyncProvider } from "../src/context/SyncContext";
import { ThemeProvider } from "../src/context/ThemeContext";
import { ToastProvider } from "../src/context/ToastContext";

function AppContent() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inTabs = segments[0] === "(tabs)";
    if (!user && inTabs) {
      router.replace("/");
    }
  }, [user, isLoading, segments]);

  if (isLoading) return null;

  return (
    <SyncProvider userId={user?.id ?? ""}>
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
    </SyncProvider>
  );
}

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
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </RegistrationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
