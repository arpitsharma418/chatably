import { createContext, useContext, useEffect, useState } from "react";
import api from "../lib/api.js";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const storedUser = localStorage.getItem("userInfo");
  let parsedUser = null;
  try {
    parsedUser = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    parsedUser = null;
  }
  const navigate = useNavigate();

  const [authUser, setAuthUser] = useState(parsedUser);

  useEffect(() => {
    if (authUser) {
      localStorage.setItem("userInfo", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("userInfo");
    }
  }, [authUser]);

  const handleLogout = async () => {
    try {
      await api.get("/api/logout");
    } catch (error) {
      console.log(error);
    } finally {
      setAuthUser(null);
      localStorage.removeItem("userInfo");
      navigate("/login");
    }
  };

  return (
    <>
      <AuthContext.Provider value={{ authUser, setAuthUser, handleLogout }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}

const useAuth = () => {
  return useContext(AuthContext);
};

export { useAuth, AuthProvider };
