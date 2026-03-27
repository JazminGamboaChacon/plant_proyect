import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Google from "expo-auth-session/providers/google";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { authGoogleSignIn, type ApiUser } from "../services/api";

const AUTH_USER_KEY = "@auth_user";
const AUTH_TOKEN_KEY = "@auth_token";

type AuthContextType = {
  user: ApiUser | null;
  token: string | null;
  isLoading: boolean;
  isNewUser: boolean;
  signInWithGoogle: () => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  isNewUser: false,
  signInWithGoogle: () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewUser, setIsNewUser] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId:
      "675847252423-qt776dirq78ipi734a7sa1g21ljn78mg.apps.googleusercontent.com",
    // TODO: agregar webClientId cuando lo crees en Google Cloud Console
    // webClientId: "TU_WEB_CLIENT_ID.apps.googleusercontent.com",
  });

  // Hidratar desde AsyncStorage al montar
  useEffect(() => {
    const hydrate = async () => {
      try {
        const [savedUser, savedToken] = await Promise.all([
          AsyncStorage.getItem(AUTH_USER_KEY),
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
        ]);
        if (savedUser && savedToken) {
          setUser(JSON.parse(savedUser));
          setToken(savedToken);
        }
      } catch (error) {
        console.warn("Error loading auth state:", error);
      } finally {
        setIsLoading(false);
      }
    };
    hydrate();
  }, []);

  // Manejar respuesta de Google OAuth
  useEffect(() => {
    if (!response || isAuthenticating) return;

    if (response.type === "success") {
      const idToken = response.params.id_token;
      if (!idToken) {
        console.error("No id_token in Google response");
        return;
      }
      setIsAuthenticating(true);
      authGoogleSignIn(idToken)
        .then(async (data) => {
          setUser(data.user);
          setToken(data.token);
          setIsNewUser(data.is_new_user);
          await Promise.all([
            AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user)),
            AsyncStorage.setItem(AUTH_TOKEN_KEY, data.token),
          ]);
        })
        .catch((error) => {
          console.error("Error authenticating with backend:", error);
        })
        .finally(() => {
          setIsAuthenticating(false);
        });
    }
  }, [response]);

  const signInWithGoogle = useCallback(() => {
    promptAsync().catch((e) => {
      console.error("Error starting Google sign-in:", e);
    });
  }, [promptAsync]);

  const signOut = useCallback(async () => {
    setUser(null);
    setToken(null);
    setIsNewUser(false);
    await Promise.all([
      AsyncStorage.removeItem(AUTH_USER_KEY),
      AsyncStorage.removeItem(AUTH_TOKEN_KEY),
    ]);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, isNewUser, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
