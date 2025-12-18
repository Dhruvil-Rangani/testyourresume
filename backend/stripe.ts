
export const createCheckoutSession = async (plan: 'monthly' | 'annual'): Promise<boolean> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const confirmed = window.confirm(
        `[BACKEND STRIPE SIMULATION]\nUpgrading to ${plan.toUpperCase()}...\n\nIn a live app, this would redirect to Stripe Checkout.\nProceed with simulated payment?`
      );
      resolve(confirmed);
    }, 500);
  });
};
