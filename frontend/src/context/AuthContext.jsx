import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Set axios default header whenever token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // inline fetchUser here so eslint doesn't complain about missing dependencies
      (async () => {
        try {
          const res = await axios.get(`${API_URL}/auth/me`);
          setUser(res.data.user);
        } catch (error) {
          console.error("Error fetching user:", error);
          // If token is invalid, clear it locally (avoid calling external logout function)
          if (error.response?.status === 401) {
            localStorage.removeItem("token");
            delete axios.defaults.headers.common["Authorization"];
            setToken(null);
            setUser(null);
          }
        } finally {
          setLoading(false);
        }
      })();
    } else {
      delete axios.defaults.headers.common["Authorization"];
      setLoading(false);
    }
  }, [token]);

  // fetchUser was inlined into the useEffect above to avoid stale/missing dependency warnings

  // Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setUser(user);

      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Login failed. Please try again.",
      };
    }
  };

  // Signup
  const signup = async (userData) => {
    try {
      const res = await axios.post(`${API_URL}/auth/signup`, userData);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setToken(token);
      setUser(user);

      return { success: true };
    } catch (error) {
      console.error("Signup error:", error);
      return {
        success: false,
        message:
          error.response?.data?.message || "Signup failed. Please try again.",
      };
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, signup, logout, loading, token }}
    >
      {children}
    </AuthContext.Provider>
  );
};
