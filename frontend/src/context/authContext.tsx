import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import axios from "axios";
import {
  AuthSession,
  clearAuthSession,
  readAuthSession,
  writeAuthSession,
} from "@/lib/authSession";


interface AuthContextType {
  authUser: AuthSession | null;
  isAuthLoading: boolean;
  setAuthUser: React.Dispatch<React.SetStateAction<AuthSession | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }
  return context;
};


interface AuthContextProviderProps {
  children: ReactNode;
}


export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [authUser, setAuthUser] = useState<AuthSession | null>(
    readAuthSession()
  );
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreAuth = async () => {
      try {
        const response = await axios.get<{
          user: { id: string; email: string; name: string };
        }>(`${import.meta.env.VITE_BACKEND_URL}/api/user/auth/me`, {
          withCredentials: true,
        });

        const session: AuthSession = {
          role: "user",
          id: response.data.user.id,
          email: response.data.user.email,
          name: response.data.user.name,
        };

        writeAuthSession(session);

        if (isMounted) {
          setAuthUser(session);
        }
      } catch {
        const existingSession = readAuthSession();

        if (
          existingSession?.role === "admin" ||
          existingSession?.role === "superadmin"
        ) {
          if (isMounted) {
            setAuthUser(existingSession);
          }
        } else {
          clearAuthSession();

          if (isMounted) {
            setAuthUser(null);
          }
        }
      } finally {
        if (isMounted) {
          setIsAuthLoading(false);
        }
      }
    };

    restoreAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, isAuthLoading, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
