import React, { useState, useEffect, createContext, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { API_CONFIG } from "../constants";


const fetchUserInfo = async (userId) => {
  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}/api/users/${userId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch user info");
    }

    return data.user;
  } catch (error) {
    console.error("Error fetching user info:", error);
    throw error;
  }
};
const AuthContext = createContext();

const useAuth = () => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const validateToken = async (storedToken) => {
    try {
      const decoded = jwtDecode(storedToken);

      if (decoded.exp <= Date.now() / 1000) {
        localStorage.removeItem("token");
        return null;
      }

      return decoded;
    } catch (error) {
      console.error("Error decoding token:", error);
      localStorage.removeItem("token");
      return null;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      setError(null);

      try {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
          setLoading(false);
          return;
        }

        const decoded = await validateToken(storedToken);

        if (!decoded) {
          setLoading(false);
          return;
        }

        const userInfo = await fetchUserInfo(decoded.userId);

        setToken(storedToken);
        setUser(decoded);
        setUserInfo(userInfo);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth initialization error:", error);
        setError(error.message);
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (newToken) => {
    try {
      setLoading(true);
      setError(null);

      localStorage.setItem("token", newToken);

      const decoded = jwtDecode(newToken);
      const userInfo = await fetchUserInfo(decoded.userId);

      setToken(newToken);
      setUser(decoded);
      setUserInfo(userInfo);
      setIsAuthenticated(true);

      return { success: true, user: userInfo };
    } catch (error) {
      console.error("Login error:", error);
      localStorage.removeItem("token");
      setError(error.message);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setUserInfo(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const refreshUserInfo = async () => {
    if (!user?.userId) return;

    try {
      const updatedUserInfo = await fetchUserInfo(user.userId);
      setUserInfo(updatedUserInfo);
      return updatedUserInfo;
    } catch (error) {
      console.error("Error refreshing user info:", error);
      setError(error.message);
    }
  };

  const isTokenValid = () => {
    if (!token || !user) return false;
    return user.exp > Date.now() / 1000;
  };

  const updateUserInfo = async (updates) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/users/${user.userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUserInfo(updatedUser);
        return updatedUser;
      }
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return {
    token,
    user,
    userInfo,
    isAuthenticated,
    loading,
    error,

    login,
    logout,
    refreshUserInfo,
    updateUserInfo,
    isTokenValid,

    userName: userInfo?.name?.split(" ")[0] || "User",
    userEmail: userInfo?.email,
    userId: user?.userId,
    userRole: user?.role || "user",
  };
};

export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return context;
};

export const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { isAuthenticated, loading } = useAuthContext();

    if (loading) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Loading...
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          Please log in to access this page
        </div>
      );
    }

    return <Component {...props} />;
  };
};

export { useAuth };
