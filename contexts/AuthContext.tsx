import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  incrementUsage: () => void;
  upgradePlan: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_FREE_CREDITS = 5;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from LocalStorage to simulate persistence
  useEffect(() => {
    const storedUser = localStorage.getItem('ats_user');
    const storedCredits = localStorage.getItem('ats_device_credits');
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      // Create a "Guest" user session tracked by device if not logged in
      const credits = storedCredits ? parseInt(storedCredits) : 0;
      setUser({
        id: 'guest_device',
        email: '',
        name: 'Guest',
        plan: 'free',
        creditsUsed: credits,
        maxCredits: MAX_FREE_CREDITS
      });
    }
    setIsLoading(false);
  }, []);

  const login = (email: string) => {
    // Simulate API Login
    const newUser: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      email,
      name: email.split('@')[0],
      plan: 'free', // Default to free on new signup
      creditsUsed: 0, // Reset credits on login for demo purposes or fetch from DB
      maxCredits: MAX_FREE_CREDITS
    };
    setUser(newUser);
    localStorage.setItem('ats_user', JSON.stringify(newUser));
  };

  const logout = () => {
    localStorage.removeItem('ats_user');
    // Revert to guest
    const storedCredits = localStorage.getItem('ats_device_credits');
    setUser({
      id: 'guest_device',
      email: '',
      name: 'Guest',
      plan: 'free',
      creditsUsed: storedCredits ? parseInt(storedCredits) : 0,
      maxCredits: MAX_FREE_CREDITS
    });
  };

  const incrementUsage = () => {
    if (!user) return;
    
    // In Pro plan, we don't really limit, but we can track
    const newCredits = user.creditsUsed + 1;
    const updatedUser = { ...user, creditsUsed: newCredits };
    setUser(updatedUser);

    if (user.id === 'guest_device') {
      localStorage.setItem('ats_device_credits', newCredits.toString());
    } else {
      localStorage.setItem('ats_user', JSON.stringify(updatedUser));
    }
  };

  const upgradePlan = () => {
    if (!user) return;
    const upgradedUser: User = { ...user, plan: 'pro', maxCredits: Infinity };
    setUser(upgradedUser);
    localStorage.setItem('ats_user', JSON.stringify(upgradedUser));
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, incrementUsage, upgradePlan, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
