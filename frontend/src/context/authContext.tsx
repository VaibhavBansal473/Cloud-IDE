import { createContext, useContext, useState, ReactNode } from "react";


interface AuthContextType {
  authUser: any; 
  setAuthUser: React.Dispatch<React.SetStateAction<any>>; 
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
  
  const [authUser, setAuthUser] = useState<any>( 
    JSON.parse(localStorage.getItem("Cloud-IDE") || "null")
  );

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
