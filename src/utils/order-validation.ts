export type DeliveryMethod = "balcao" | "entrega" | null;
export type PaymentMethod = "cartao" | "pix" | "dinheiro" | null;

export interface OrderValidationDetails {
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  address?: { street: string; number: string };
  needsChange?: boolean | null;
  changeAmount?: string;
  hasItems?: boolean;
  hasSize?: boolean;
  hasMeat?: boolean;
}

/**
 * Validates order details for both standard checkout and intelligent orders.
 * 
 * Rules:
 * 1. Delivery and Payment methods are mandatory.
 * 2. If delivery is "entrega", address (street and number) is mandatory.
 * 3. If payment is "dinheiro", needsChange must be specified.
 * 4. If needsChange is true, changeAmount is mandatory.
 * 5. Optional flags (hasItems, hasSize, hasMeat) must be true if provided.
 */
export const isOrderValid = (details: OrderValidationDetails): boolean => {
  const {
    deliveryMethod,
    paymentMethod,
    address,
    needsChange,
    changeAmount,
    hasItems,
    hasSize,
    hasMeat,
  } = details;

  // Basic flags
  if (hasItems !== undefined && !hasItems) return false;
  if (hasSize !== undefined && !hasSize) return false;
  if (hasMeat !== undefined && !hasMeat) return false;

  // Global mandatory fields
  if (!deliveryMethod || !paymentMethod) return false;

  // Delivery specific
  if (deliveryMethod === "entrega") {
    if (!address?.street?.trim() || !address?.number?.trim()) return false;
  }

  // Payment specific
  if (paymentMethod === "dinheiro") {
    if (needsChange === null || needsChange === undefined) return false;
    if (needsChange && !changeAmount?.trim()) return false;
  }

  return true;
};
