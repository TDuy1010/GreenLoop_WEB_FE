export const CART_UPDATED_EVENT = 'cart:updated';

export const notifyCartUpdated = (count) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent(CART_UPDATED_EVENT, {
      detail: typeof count === 'number' ? count : undefined,
    }),
  );
};

