export type DeliveryMethod = "balcao" | "entrega" | null;
export type PaymentMethod = "cartao" | "pix" | "dinheiro" | null;
export type Address = { street: string; number: string };

export interface OrderValidationDetails {
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  address?: Address;
  needsChange?: boolean | null;
  changeAmount?: string;
  hasItems?: boolean;
  hasSize?: boolean;
  hasMeat?: boolean;
}

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

  if (hasItems !== undefined && !hasItems) return false;
  if (hasSize !== undefined && !hasSize) return false;
  if (hasMeat !== undefined && !hasMeat) return false;

  if (!deliveryMethod || !paymentMethod) return false;

  if (deliveryMethod === "entrega") {
    if (!address?.street?.trim() || !address?.number?.trim()) return false;
  }

  if (paymentMethod === "dinheiro") {
    if (needsChange === null || needsChange === undefined) return false;
    if (needsChange && !changeAmount?.trim()) return false;
  }

  return true;
};
