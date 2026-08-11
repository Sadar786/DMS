import { createContext, useContext, useEffect, useState } from "react";

import { getMe, login as loginService } from "../services/authService";
import { getToken, removeToken, saveToken } from "../utils/storage";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

 async function login(email, password) {
  const response = await loginService({
    email,
    password,
  });

  const { user, token } = response.data;

  saveToken(token);

  setUser(user);

  return user;
}

  function logout() {
    removeToken();

    setUser(null);
  }

  useEffect(() => {
    async function initialize() {
      try {
        const token = getToken();

        if (!token) {
          setLoading(false);
          return;
        }

        const response = await getMe();

        setUser(response.data.user);
      } catch (error) {
        removeToken();
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}