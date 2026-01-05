import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const ADMIN_EMAIL = "andreawuttke";
const ADMIN_PASSWORD = "  ";
const STORAGE_KEY = "cascadia.admin.authenticated";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const readAuthState = () => {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => readAuthState());

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (isAuthenticated) {
        window.localStorage.setItem(STORAGE_KEY, "true");
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore storage errors (e.g., private browsing)
    }
  }, [isAuthenticated]);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated,
      login: (email, password) => {
        const normalizedInput = email.trim().toLowerCase();
        const normalizedAdmin = ADMIN_EMAIL.toLowerCase();
        const matchesEmail =
          normalizedInput === normalizedAdmin ||
          normalizedInput.startsWith(`${normalizedAdmin}@`);
        const valid = matchesEmail && password === ADMIN_PASSWORD;
        if (valid) {
          setIsAuthenticated(true);
        }
        return valid;
      },
      logout: () => setIsAuthenticated(false),
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
