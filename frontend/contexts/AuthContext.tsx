
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { dbService } from '../../backend/db';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  incrementUsage: () => Promise<void>;
  upgradePlan: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_KEY = 'ats_user_v2';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      await dbService.init();
      const stored = await dbService.getUser(USER_KEY);
      if (stored) {
        setUser(stored);
      } else {
        const guest: User = { id: USER_KEY, email: '', name: 'Guest', plan: 'free', creditsUsed: 0, maxCredits: 5 };
        await dbService.saveUser(guest);
        setUser(guest);
      }
      setIsLoading(false);
    };
    init();
  }, []);

  const login = async (email: string) => {
    const loggedIn: User = { ...user!, email, name: email.split('@')[0] };
    await dbService.saveUser(loggedIn);
    setUser(loggedIn);
  };

  const logout = () => {
    const guest: User = { id: USER_KEY, email: '', name: 'Guest', plan: 'free', creditsUsed: 0, maxCredits: 5 };
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
    const updated = { ...user, plan: 'pro' as const, maxCredits: 99999 };
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
  if (!context) throw new Error('Missing AuthProvider');
  return context;
};
