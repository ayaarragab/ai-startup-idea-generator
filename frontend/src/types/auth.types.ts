interface User {
  id: number;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (fullName?: string, email?: string, password?: string) => Promise<boolean>;
  login: (email?: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  resetUser: () => void;
  setUserFromOAuth: (user: any) => void;
}
interface AuthProviderProps {
  children: React.ReactNode;
}

export type { User, AuthContextType, AuthProviderProps };