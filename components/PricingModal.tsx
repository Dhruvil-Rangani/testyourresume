import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
  const { upgradePlan } = useAuth();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleSubscribe = () => {
    setIsProcessing(true);
    // Simulate payment processing delay
    setTimeout(() => {
      upgradePlan();
      setIsProcessing(false);
      onClose();
      alert("Payment Successful! You are now a PRO member.");
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity" onClick={onClose}></div>

      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-2xl border border-stone-100">
          
          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 text-stone-400 hover:text-stone-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-stone-900">Unlock Unlimited Scans</h3>
              <p className="mt-2 text-stone-600">Get the full potential of AI resume optimization.</p>
              
              {/* Toggle */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <span className={`text-sm font-medium ${billingCycle === 'monthly' ? 'text-stone-900' : 'text-stone-500'}`}>Monthly</span>
                <button 
                  onClick={() => setBillingCycle(prev => prev === 'monthly' ? 'annual' : 'monthly')}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${billingCycle === 'annual' ? 'bg-teal-600' : 'bg-stone-200'}`}
                >
                  <span aria-hidden="true" className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${billingCycle === 'annual' ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
                <span className={`text-sm font-medium ${billingCycle === 'annual' ? 'text-stone-900' : 'text-stone-500'}`}>
                  Yearly <span className="text-emerald-600 font-bold text-xs ml-1">(Save $20)</span>
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Free Plan */}
              <div className="rounded-2xl border border-stone-200 p-6 bg-stone-50 opacity-75">
                <h4 className="text-lg font-semibold text-stone-900">Free Starter</h4>
                <p className="mt-4 text-3xl font-bold text-stone-900">$0</p>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-center text-sm text-stone-600">
                    <svg className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    5 AI Scans total
                  </li>
                  <li className="flex items-center text-sm text-stone-600">
                    <svg className="h-5 w-5 text-emerald-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Basic Score Analysis
                  </li>
                </ul>
                <button 
                  onClick={onClose}
                  className="mt-8 block w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-center text-sm font-semibold text-stone-700 shadow-sm hover:bg-stone-50"
                >
                  Continue Free
                </button>
              </div>

              {/* Pro Plan */}
              <div className="relative rounded-2xl border-2 border-teal-600 p-6 bg-white shadow-xl shadow-teal-100">
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                  <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800 ring-1 ring-inset ring-emerald-600/20">
                    MOST POPULAR
                  </span>
                </div>
                <h4 className="text-lg font-semibold text-teal-600">Pro Unlimited</h4>
                <div className="mt-4 flex items-baseline text-stone-900">
                  <span className="text-3xl font-bold tracking-tight">
                    {billingCycle === 'monthly' ? '$10' : '$100'}
                  </span>
                  <span className="ml-1 text-sm font-semibold text-stone-500">
                    /{billingCycle === 'monthly' ? 'mo' : 'yr'}
                  </span>
                </div>
                <ul className="mt-6 space-y-4">
                  <li className="flex items-center text-sm text-stone-700">
                    <svg className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Unlimited AI Scans
                  </li>
                  <li className="flex items-center text-sm text-stone-700">
                    <svg className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Detailed Improvement Plan
                  </li>
                  <li className="flex items-center text-sm text-stone-700">
                    <svg className="h-5 w-5 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Auto-Rewrite Resume (HTML)
                  </li>
                </ul>
                <button 
                  onClick={handleSubscribe}
                  disabled={isProcessing}
                  className="mt-8 block w-full rounded-lg bg-teal-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-teal-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-75"
                >
                  {isProcessing ? 'Processing...' : `Get Pro ${billingCycle === 'annual' ? 'Annual' : 'Monthly'}`}
                </button>
              </div>
            </div>
            
            <p className="mt-6 text-center text-xs text-stone-500">
              Secure payment processing. You can cancel at any time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;