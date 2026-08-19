import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("admin_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await api.get("/auth/me");

        const authenticatedUser = response.data;

        // Admin frontend must only accept admin accounts
        if (authenticatedUser.role !== "admin") {
          localStorage.removeItem("admin_token");
          localStorage.removeItem("admin_user");
          setUser(null);
          return;
        }

        setUser(authenticatedUser);
        localStorage.setItem(
          "admin_user",
          JSON.stringify(authenticatedUser)
        );
      } catch (error) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { access_token, user } = response.data;

    if (user.role !== "admin") {
      throw new Error("This account does not have administrator access.");
    }

    localStorage.setItem("admin_token", access_token);
    localStorage.setItem("admin_user", JSON.stringify(user));

    setUser(user);

    return user;
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}