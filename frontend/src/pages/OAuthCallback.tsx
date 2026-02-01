import { useNavigate } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import axios from "../utils/axiosInstance";
import { useEffect } from "react";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { setUserFromOAuth } = useAuth();

  useEffect(() => {
    const finalizeSignup = async () => {
      try {
        const res = await axios.get("/auth/me");
        if (res.status == 200) {
          setUserFromOAuth(res.data);
          navigate("/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        navigate("/", { replace: true });
      }
    };

    finalizeSignup();
  }, [navigate, setUserFromOAuth]);

  return null;
};

export default OAuthCallback;