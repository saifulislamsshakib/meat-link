import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem("accessToken");

      const savedUser = localStorage.getItem("user");

      if (savedToken && savedUser) {
        const parsedUser = JSON.parse(savedUser);

        setToken(savedToken);
        setUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to restore authentication:", error);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");

      setToken(null);
      setUser(null);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const login = (accessToken, userData) => {
    localStorage.setItem("accessToken", accessToken);

    localStorage.setItem("user", JSON.stringify(userData));

    setToken(accessToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        authLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
