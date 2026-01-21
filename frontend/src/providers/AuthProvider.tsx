import { createContext, useState, useEffect, useContext } from "react";
import { AuthContextType, AuthProviderProps } from "../types/auth.types";
import axios from "../utils/axiosInstance";
import { toast } from "react-toastify";


export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState({
	id: -1,
	fullName: "",
	email: "",
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
	const checkAuth = async () => {
	  try {
		const res = await axios.get("/auth/me", { withCredentials: true });
		setUser(res.data);
		setIsAuthenticated(true);
	  } catch (error: any) {
		console.log("No active session:", error.response?.status);
		setUser({
			id: -1,
			fullName: "",
			email: "",
		});
		setIsAuthenticated(false);
	  } finally {
		setLoading(false);
	  }
	};
	checkAuth();
  }, []);
  const resetUser = () => {
    setUser({
      id: -1,
	  fullName: "",
      email: "",
    });
    setIsAuthenticated(false);
  };

  const signup = async (fullName='', email='', password='') => {
	try {
        const res = await axios.post('/auth/signup', {
            email, password, fullName
        });
		setUser(res.data);
		setIsAuthenticated(true);
	} catch (error) {
		toast.error("Signup failed. Please try again.");
		console.error("Signup failed:", error);
		setIsAuthenticated(false);
	}
  }

  const logout = async () => {
    resetUser()
    setIsAuthenticated(false)
    try {
      await axios.post('/auth/logout')
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <AuthContext.Provider
	value={{
        user,
        isAuthenticated,
        loading,
        signup,
        logout,
        resetUser,
      }}
	>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
