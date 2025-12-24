export const initiateCheckout = async (plan: 'monthly' | 'annual'): Promise<boolean> => {
  console.log(`Initiating Stripe ${plan} checkout...`);

  return new Promise((resolve) => {
    setTimeout(() => {
      const confirmed = window.confirm(
        `[STRIPE SIMULATION]\nPlan: ${plan.toUpperCase()}\n\nClick OK to simulate a successful payment.\nClick Cancel to simulate a failed/aborted payment.`
      );
      resolve(confirmed);
    }, 1000);
  });
};



