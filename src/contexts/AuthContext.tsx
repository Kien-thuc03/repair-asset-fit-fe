"use client";

import { createContext, useState, useContext, ReactNode, useEffect } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Demo users for testing
  const demoUsers = [
    {
      id: "1",
      name: "Quản trị viên",
      email: "admin@iuh.edu.vn",
      username: "admin",
      password: "admin123",
      role: "admin",
      department: "Phòng CNTT"
    },
    {
      id: "2", 
      name: "Kỹ thuật viên",
      email: "tech@iuh.edu.vn",
      username: "tech",
      password: "tech123",
      role: "technician",
      department: "Phòng Kỹ thuật"
    },
    {
      id: "3",
      name: "Người dùng",
      email: "user@iuh.edu.vn",
      username: "user",
      password: "user123",
      role: "user",
      department: "Khoa CNTT"
    }
  ];

  // Check if user is logged in on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("repair_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem("repair_user");
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
        localStorage.setItem("repair_user", JSON.stringify(userWithoutPassword));
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
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
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
