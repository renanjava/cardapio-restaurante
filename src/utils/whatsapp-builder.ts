import { DAY_DISPLAY_NAMES, RESTAURANT_INFO, DayKey } from "@/config";
import { Address, DeliveryMethod, PaymentMethod } from "./order-validation";
import { DrinkOrder } from "@/pages/Checkout";
import { weeklyMenu } from "@/data/menuData";

interface OrderItem {
  sizeName: string;
  meatName: string;
  price: number;
  qty: number;
  extraCharge: number;
  addedItems?: string[];
  removedItems?: string[];
  customMessage?: string;
}

interface OrderDetails {
  dayKey?: DayKey;
  deliveryMethod: DeliveryMethod;
  address?: Address;
  paymentMethod: PaymentMethod;
  changeAmount?: string;
  items: OrderItem[];
  drinks?: DrinkOrder[];
  deliveryFee: number;
  total: number;
  isIntelligentOrder?: boolean;
}

export const buildWhatsAppMessage = (order: OrderDetails): string => {
  let message = `🍽️ *NOVO PEDIDO - ${RESTAURANT_INFO.name}*\n\n`;

  if (order.isIntelligentOrder) {
    message += `🤖 *PEDIDO INTELIGENTE*\n\n`;
  }
  
  if (order.dayKey) {
    message += `📅 *CARDÁPIO - ${DAY_DISPLAY_NAMES[order.dayKey]}*\n`;
    const dayMenu = weeklyMenu[order.dayKey];
    if (dayMenu && dayMenu.items) {
      const accompaniments = dayMenu.items.map((item) => item.name).join(", ");
      message += `${accompaniments}\n\n`;
    }
  }

  message += `📋 *ITENS DO PEDIDO:*\n\n`;

  order.items.forEach((item) => {
    message += `*${item.sizeName}* - ${item.meatName}\n`;
    message += `   Qtd: ${item.qty} | R$ ${(item.price).toFixed(2).replace('.', ',')}\n`; 
    
    if (item.extraCharge > 0) {
      message += `   ⚠️ Acréscimo: +R$ ${item.extraCharge.toFixed(2).replace('.', ',')}\n`;
    }

    if (item.removedItems && item.removedItems.length > 0) {
       message += `   ✗ Sem: ${item.removedItems.join(", ")}\n`;
    }
    
    if (item.customMessage) {
        message += `   ${item.customMessage}\n`;
    }
    
    message += `\n`;
  });

  if (order.drinks && order.drinks.length > 0) {
    message += `🥤 *BEBIDAS:*\n`;
    order.drinks.forEach((drink) => {
      message += `${drink.name}\n`;
      message += `   Qtd: ${drink.qty} | R$ ${drink.price.toFixed(2).replace('.', ',')}\n`;
    });
    message += `\n`;
  }

  message += `📍 *RETIRADA:*\n`;
  if (order.deliveryMethod === "balcao") {
    message += `Balcão\n`;
  } else {
    message += `Entrega\n`;
    if (order.address) {
      message += `${order.address.street}, ${order.address.number}\n`;
    }
  }
  
  if (order.deliveryFee > 0) {
      message += `Taxa de entrega: R$ ${order.deliveryFee.toFixed(2).replace('.', ',')}\n`;
  }

  message += `\n💳 *PAGAMENTO:*\n`;
  switch (order.paymentMethod) {
    case "cartao":
      message += `Cartão\n`;
      break;
    case "pix":
      message += `Pix\n`;
      message += `Chave: ${RESTAURANT_INFO.pixKey}\n`;
      break;
    case "dinheiro":
      message += `Dinheiro\n`;
      if (order.changeAmount) {
        message += `💵 Troco para: R$ ${order.changeAmount}\n`;
      } else {
        message += `Sem troco\n`;
      }
      break;
  }

  message += `\n💰 *TOTAL: R$ ${order.total.toFixed(2).replace(".", ",")}*`;

  return `https://wa.me/${RESTAURANT_INFO.phone}?text=${encodeURIComponent(
    message
  )}`;
};
