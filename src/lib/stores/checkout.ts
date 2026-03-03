import { writable } from 'svelte/store';

export interface CheckoutState {
  step: 1 | 2 | 3 | 4;
  paddle_id: string;
  start_date: string;
  end_date: string;
  full_name: string;
  street_address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  payment_method: 'credit-card' | 'paypal' | 'apple-pay';
}

const initialState: CheckoutState = {
  step: 1,
  paddle_id: '',
  start_date: '',
  end_date: '',
  full_name: '',
  street_address: '',
  city: '',
  state: '',
  zip: '',
  phone: '',
  payment_method: 'credit-card'
};

export const checkoutStore = writable<CheckoutState>(initialState);

/**
 * Reset checkout store to initial state
 */
export function resetCheckoutStore() {
  checkoutStore.set(initialState);
}

/**
 * Move to next step
 */
export function nextStep(currentStep: 1 | 2 | 3 | 4) {
  if (currentStep < 4) {
    checkoutStore.update((state) => ({
      ...state,
      step: (currentStep + 1) as 1 | 2 | 3 | 4
    }));
  }
}

/**
 * Move to previous step
 */
export function previousStep(currentStep: 1 | 2 | 3 | 4) {
  if (currentStep > 1) {
    checkoutStore.update((state) => ({
      ...state,
      step: (currentStep - 1) as 1 | 2 | 3 | 4
    }));
  }
}

/**
 * Update checkout state
 */
export function updateCheckoutState(updates: Partial<CheckoutState>) {
  checkoutStore.update((state) => ({
    ...state,
    ...updates
  }));
}
