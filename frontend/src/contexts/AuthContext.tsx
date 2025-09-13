'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserType } from '@/lib/zod-schemas';

interface AuthContextType {
  user: UserType | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for authentication
const DEMO_USERS: UserType[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    email: 'admin@esahayak.com',
    name: 'Admin User',
    isAdmin: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    email: 'agent@esahayak.com',
    name: 'Sales Agent',
    isAdmin: false,
    createdAt: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('esahayak_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem('esahayak_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo authentication - accept any password for demo users
    const demoUser = DEMO_USERS.find(u => u.email === email);
    
    if (demoUser && password.length >= 3) {
      setUser(demoUser);
      localStorage.setItem('esahayak_user', JSON.stringify(demoUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('esahayak_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
