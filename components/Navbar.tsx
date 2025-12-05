import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavbarProps {
  onOpenAuth: () => void;
  onOpenPricing: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenAuth, onOpenPricing }) => {
  const { user, logout } = useAuth();
  const isGuest = user?.id === 'guest_device';
  const isPro = user?.plan === 'pro';

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass-panel border-b border-stone-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-600 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-teal-500/20">
              A
            </div>
            <span className="font-bold text-xl tracking-tight text-stone-800">
              ATS<span className="text-teal-600">Master</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Credit Counter */}
            {!isPro && (
              <div className="hidden sm:flex items-center px-3 py-1 bg-stone-100 rounded-full border border-stone-200">
                <div className="w-2 h-2 rounded-full bg-orange-400 mr-2 animate-pulse"></div>
                <span className="text-xs font-semibold text-stone-600">
                  {Math.max(0, (user?.maxCredits || 5) - (user?.creditsUsed || 0))} scans left
                </span>
              </div>
            )}

            {isPro && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-sm">
                PRO Member
              </span>
            )}

            {isGuest ? (
              <>
                <button 
                  onClick={onOpenAuth}
                  className="text-stone-600 hover:text-stone-900 text-sm font-semibold transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={onOpenPricing}
                  className="px-4 py-2 rounded-lg bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-all shadow-lg shadow-stone-900/10"
                >
                  Get Unlimited
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-stone-700 hidden md:block">
                  {user?.name}
                </span>
                {!isPro && (
                  <button 
                    onClick={onOpenPricing}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-teal-600 to-emerald-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-teal-500/20 transition-all transform hover:-translate-y-0.5"
                  >
                    Upgrade
                  </button>
                )}
                <button 
                  onClick={logout}
                  className="text-stone-500 hover:text-red-600 text-sm font-medium transition-colors"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;