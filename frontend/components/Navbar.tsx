
import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenPricing: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenPricing }) => {
  const { user, logout } = useAuth();
  const isPro = user?.plan === 'pro';

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">A</div>
          <span className="font-bold text-xl tracking-tight text-stone-800">ATS Master</span>
        </div>
        <div className="flex items-center gap-4">
          {!isPro && (
            <div className="hidden sm:block text-xs font-bold text-stone-400 uppercase tracking-widest">
              {Math.max(0, (user?.maxCredits || 5) - (user?.creditsUsed || 0))} Credits Left
            </div>
          )}
          {user?.email ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-teal-600">{isPro ? 'PRO' : user.name}</span>
              <button onClick={logout} className="text-stone-400 hover:text-red-500 text-sm font-bold uppercase transition-colors">Log out</button>
            </div>
          ) : (
            <button onClick={onOpenAuth} className="text-stone-600 hover:text-teal-600 text-sm font-bold uppercase transition-colors">Sign In</button>
          )}
          <button onClick={onOpenPricing} className="px-4 py-2 rounded-lg bg-stone-900 text-white text-xs font-bold uppercase hover:bg-teal-600 transition-all">
            {isPro ? 'Unlimited Access' : 'Go Pro'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
