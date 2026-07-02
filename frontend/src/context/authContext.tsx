import { createContext, useContext, useState, ReactNode } from "react";
import { AuthSession, readAuthSession } from "@/lib/authSession";


interface AuthContextType {
  authUser: AuthSession | null;
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

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
