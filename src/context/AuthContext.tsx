import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginUser, type ApiUser } from "../services/api";

const AUTH_USER_KEY = "@auth_user";
const AUTH_TOKEN_KEY = "@auth_token";

type AuthContextType = {
  user: ApiUser | null;
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInFromRegistration: (user: ApiUser, token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  signIn: async () => {},
  signInFromRegistration: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const persist = useCallback(async (u: ApiUser, t: string) => {
    setUser(u);
    setToken(t);
    await Promise.all([
      AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(u)),
      AsyncStorage.setItem(AUTH_TOKEN_KEY, t),
    ]);
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      const data = await loginUser(email, password);
      await persist(data.user, data.token);
    },
    [persist],
  );

  const signInFromRegistration = useCallback(
    async (u: ApiUser, t: string) => {
      await persist(u, t);
    },
    [persist],
  );

  const signOut = useCallback(async () => {
    setUser(null);
    setToken(null);
    await Promise.all([
      AsyncStorage.removeItem(AUTH_USER_KEY),
      AsyncStorage.removeItem(AUTH_TOKEN_KEY),
    ]);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, signIn, signInFromRegistration, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
