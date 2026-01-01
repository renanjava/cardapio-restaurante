import { MeatOption, restaurantInfo, MarmitaSize } from "@/data/menuData";

export const calculateMeatExtra = (
  sizeId: string | undefined,
  meat: MeatOption | null
): number => {
  if (
    sizeId === "mini" &&
    meat?.extraForMini &&
    meat?.extraPrice
  ) {
    return meat.extraPrice;
  }
  return 0;
};

export const calculateDeliveryFee = (
  deliveryMethod: "balcao" | "entrega" | null,
): number => {
  if (deliveryMethod !== "entrega") return 0;
  
  return restaurantInfo.deliveryFee;
};

export const calculateItemPrice = (
  size: MarmitaSize | null,
  meat: MeatOption | null
): number => {
  if (!size) return 0;
  const extra = calculateMeatExtra(size.id, meat);
  return size.price + extra;
};

export const calculateOrderTotal = (
  itemsTotal: number,
  deliveryFee: number
): number => {
  return itemsTotal + deliveryFee;
};
