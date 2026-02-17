
import React, { useState } from 'react';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe: (plan: 'monthly' | 'annual') => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose, onSubscribe }) => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-white">
        <div className="p-8">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-black text-stone-900 tracking-tight">Upgrade to Pro</h3>
            <p className="mt-2 text-stone-500">Unlock unlimited scans and AI resume auto-rewriting.</p>
            
            <div className="mt-8 flex items-center justify-center gap-4 bg-stone-100 p-1 rounded-2xl w-fit mx-auto">
              <button 
                onClick={() => setBillingCycle('monthly')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-md text-teal-600' : 'text-stone-500'}`}
              >Monthly</button>
              <button 
                onClick={() => setBillingCycle('annual')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${billingCycle === 'annual' ? 'bg-white shadow-md text-teal-600' : 'text-stone-500'}`}
              >Annual <span className="text-[10px] ml-1 opacity-70">(Save 20%)</span></button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200">
              <h4 className="font-bold text-stone-900">Basic</h4>
              <div className="text-2xl font-black mt-2">$0</div>
              <ul className="mt-4 space-y-2 text-xs text-stone-500">
                <li>• 5 Scans lifetime</li>
                <li>• Basic score report</li>
              </ul>
              <button onClick={onClose} className="w-full mt-6 py-2 rounded-xl border border-stone-200 font-bold text-sm">Current Plan</button>
            </div>
            
            <div className="p-6 rounded-2xl bg-teal-600 text-white shadow-xl shadow-teal-600/30">
              <h4 className="font-bold">Pro</h4>
              <div className="text-2xl font-black mt-2">{billingCycle === 'monthly' ? '$10/mo' : '$100/yr'}</div>
              <ul className="mt-4 space-y-2 text-xs opacity-90">
                <li>• Unlimited AI Scans</li>
                <li>• AI Resume Auto-Rewrite</li>
                <li>• Smart Document Persistence</li>
              </ul>
              <button 
                onClick={() => onSubscribe(billingCycle)}
                className="w-full mt-6 py-3 rounded-xl bg-white text-teal-600 font-black text-sm hover:scale-[1.02] active:scale-[0.98] transition-all"
              >Upgrade via Stripe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
