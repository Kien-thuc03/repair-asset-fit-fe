"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { UserRole } from "@/types/repair";
import { demoUsers } from "@/lib/mockData/users";

type User = {
  id: string;
  name: string;
  email: string;
  roles: UserRole[];
  activeRole: UserRole;
  department?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Demo users are imported from @/lib/mockData/users

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("repair_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Set cookie for middleware
        document.cookie = `repair_user=${savedUser}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
      } catch (error) {
        localStorage.removeItem("repair_user");
        document.cookie = "repair_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    }
  }, []);

  async function login(email: string, password: string) {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Check demo users
      const foundUser = demoUsers.find(
        u => (u.email === email || u.username === email.split('@')[0]) && u.password === password
      );

      if (foundUser) {
        const { password: _, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        const userJson = JSON.stringify(userWithoutPassword);
        localStorage.setItem("repair_user", userJson);
        // Set cookie for middleware
        document.cookie = `repair_user=${userJson}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
      } else {
        throw new Error("Invalid credentials");
      }
    } finally {
      setIsLoading(false);
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("repair_user");
    // Remove cookie
    document.cookie = "repair_user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
  
  // Function to switch between roles for users with multiple roles
  function switchRole(role: UserRole) {
    if (user && user.roles.includes(role)) {
      const updatedUser = {
        ...user,
        activeRole: role
      };
      
      setUser(updatedUser);
      const userJson = JSON.stringify(updatedUser);
      localStorage.setItem("repair_user", userJson);
      document.cookie = `repair_user=${userJson}; path=/; max-age=${7 * 24 * 60 * 60}`; // 7 days
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        switchRole,
        isAuthenticated: !!user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
