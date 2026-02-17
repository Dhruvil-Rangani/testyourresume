
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { dbService } from '../backend/db';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  incrementUsage: () => Promise<void>;
  upgradePlan: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const GUEST_ID = 'persistent_user_context';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initBackend = async () => {
      await dbService.init();
      const existing = await dbService.getUser(GUEST_ID);
      if (existing) {
        setUser(existing);
      } else {
        const guest: User = { id: GUEST_ID, email: '', name: 'Guest User', plan: 'free', creditsUsed: 0, maxCredits: 5 };
        await dbService.saveUser(guest);
        setUser(guest);
      }
      setIsLoading(false);
    };
    initBackend();
  }, []);

  const login = async (email: string) => {
    const updatedUser: User = { ...user!, email, name: email.split('@')[0], plan: 'free' };
    await dbService.saveUser(updatedUser);
    setUser(updatedUser);
  };

  const logout = () => {
    const guest: User = { id: GUEST_ID, email: '', name: 'Guest User', plan: 'free', creditsUsed: 0, maxCredits: 5 };
    setUser(guest);
  };

  const incrementUsage = async () => {
    if (!user) return;
    const updated = { ...user, creditsUsed: user.creditsUsed + 1 };
    await dbService.saveUser(updated);
    setUser(updated);
  };

  const upgradePlan = async () => {
    if (!user) return;
    const updated = { ...user, plan: 'pro' as const, maxCredits: 999999 };
    await dbService.saveUser(updated);
    setUser(updated);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, incrementUsage, upgradePlan, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('AuthProvider missing');
  return context;
};
