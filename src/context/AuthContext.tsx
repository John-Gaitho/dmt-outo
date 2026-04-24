import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

import axios from "axios";

/* ----------------------------- */
/* API INSTANCE */
/* ----------------------------- */

export const api = axios.create({
  baseURL: "http://localhost:8000",
});

/* Attach token automatically */
api.interceptors.request.use((config) => {

  const token =
    localStorage.getItem("access_token");

  if (token) {

    config.headers.Authorization =
      `Bearer ${token}`;

  }

  return config;

});

/* ----------------------------- */
/* TYPES */
/* ----------------------------- */

interface AuthUser {

  id: string;

  email: string;

  // ⭐ FIXED — matches backend
  is_admin?: boolean;

}

interface AuthContextType {

  user: AuthUser | null;

  isAdmin: boolean;

  isLoading: boolean;

  signUp: (
    email: string,
    password: string
  ) => Promise<{ error?: any }>;

  signIn: (
    email: string,
    password: string
  ) => Promise<{ error?: any }>;

  signOut: () => void;

  refreshUser: () => Promise<void>;

}

/* ----------------------------- */

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

/* ----------------------------- */
/* PROVIDER */
/* ----------------------------- */

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {

  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [isAdmin, setIsAdmin] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  /* ----------------------------- */
  /* LOAD USER ON APP START */
  /* ----------------------------- */

  useEffect(() => {

    const token =
      localStorage.getItem(
        "access_token"
      );

    if (!token) {

      setIsLoading(false);

      return;

    }

    loadCurrentUser();

  }, []);

  /* ----------------------------- */
  /* LOAD CURRENT USER */
  /* ----------------------------- */

  const loadCurrentUser =
    async () => {

      try {

        const res =
          await api.get(
            "/auth/me"
          );

        const data =
          res.data;

        console.log(
          "USER DATA:",
          data
        );

        setUser(data);

        /* ⭐ REAL FIX HERE */

        const adminStatus =
          data?.is_admin === true;

        setIsAdmin(adminStatus);

        console.log(
          "ADMIN STATUS:",
          adminStatus
        );

      } catch (error) {

        console.error(
          "Auth load failed:",
          error
        );

        localStorage.removeItem(
          "access_token"
        );

        setUser(null);

        setIsAdmin(false);

      } finally {

        setIsLoading(false);

      }

    };

  /* ----------------------------- */
  /* SIGN UP */
  /* ----------------------------- */

  const signUp = async (
    email: string,
    password: string
  ) => {

    try {

      await api.post(
        "/auth/register",
        {
          email,
          password,
        }
      );

      return {};

    } catch (error: any) {

      return {

        error:
          error?.response?.data ||
          "Signup failed",

      };

    }

  };

  /* ----------------------------- */
  /* SIGN IN */
  /* ----------------------------- */

  const signIn = async (
    email: string,
    password: string
  ) => {

    try {

      const res =
        await api.post(
          "/auth/login",
          {
            email,
            password,
          }
        );

      const data =
        res.data;

      /* Save token */

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      /* Load user */

      await loadCurrentUser();

      return {};

    } catch (error: any) {

      return {

        error:
          error?.response?.data ||
          "Login failed",

      };

    }

  };

  /* ----------------------------- */
  /* SIGN OUT */
  /* ----------------------------- */

  const signOut = () => {

    localStorage.removeItem(
      "access_token"
    );

    setUser(null);

    setIsAdmin(false);

  };

  /* ----------------------------- */
  /* REFRESH USER */
  /* ----------------------------- */

  const refreshUser =
    async () => {

      setIsLoading(true);

      await loadCurrentUser();

    };

  /* ----------------------------- */

  return (

    <AuthContext.Provider
      value={{

        user,

        isAdmin,

        isLoading,

        signUp,

        signIn,

        signOut,

        refreshUser,

      }}
    >

      {children}

    </AuthContext.Provider>

  );

};

/* ----------------------------- */
/* HOOK */
/* ----------------------------- */

export const useAuth = () => {

  const context =
    useContext(AuthContext);

  if (!context) {

    throw new Error(
      "useAuth must be used within AuthProvider"
    );

  }

  return context;

};