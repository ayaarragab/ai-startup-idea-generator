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
		const res = await axios.get("/auth/me");
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
    if (res.status == 200) {
      toast.success("Signup successful! Redirecting to login...");
      return true;
    } else if (res.status == 409) {
      toast.info("User already exists. Please login.");
      return true;
    } else {
      toast.error(res.data.error);      
      return false;
    }
	} catch (error: any) {    
		toast.error(error.response?.data?.error || "Signup failed");
		setIsAuthenticated(false);
	}
  return false;
  }

  const login = async (email='', password='') => {
    try {
      const res = await axios.post('/auth/login', {
        email, password
      });
      if (res.status == 200) {
        toast.success("Login successful!");
        setUser(res.data);
        setIsAuthenticated(true);
        return true;
      } else {
        toast.error(res.data.error);      
        setIsAuthenticated(false);
        return false;
      }
    } catch (error: any) {    
      toast.error(error.response?.data?.error || "Login failed");
      setIsAuthenticated(false);
    }
    return false;
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
        login,
        logout,
        resetUser,
      }}
	>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
export default AuthContext;
