interface User {
  id: number;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signup: (username?: string, email?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetUser: () => void;
}
interface AuthProviderProps {
  children: React.ReactNode;
}

export type { User, AuthContextType, AuthProviderProps };