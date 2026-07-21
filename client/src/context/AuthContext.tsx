"use client";
import { createContext, useState, useEffect } from "react";

//  Define a User type
export type UserType = {
  id?: string;
  name?: string;
  email?: string;
  userRole?: string;
  image?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  storeName?: string;
  bio?: string;
};

//  Define the context type
type AuthContextType = {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  logout: () => void;
  loading: boolean;
};

//. Create the context
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export default function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUserState] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser) as UserType;
        setUserState(parsedUser);
      }
    } catch (error) {
      console.error("Failed to parse stored user", error);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  // set user on state and localStorage
  const setUser = (user: UserType | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  };

  // logout
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
