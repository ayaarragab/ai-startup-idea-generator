import { createContext } from "react";
import { AuthContextType, AuthProviderProps } from "../types/auth.types";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return (
	<AuthContext.Provider value={undefined}>
	  {children}
	</AuthContext.Provider>
  );
} 