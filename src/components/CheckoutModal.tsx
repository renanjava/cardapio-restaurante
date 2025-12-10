import { useEffect, useState, useRef } from "react";
import {
  X,
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  Send,
  Info,
  Plus,
  Minus,
  Wine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import {
  restaurantInfo,
  dayDisplayNames,
  weeklyMenu,
  drinks,
} from "@/data/menuData";
import toast from "react-hot-toast";
import { useDay } from "@/contexts/DayContext";
import { track } from "@/lib/tracking";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type DeliveryMethod = "balcao" | "entrega" | null;
type PaymentMethod = "cartao" | "pix" | "dinheiro" | null;

interface DrinkOrder {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export function CheckoutModal({ isOpen, onClose }: CheckoutModalProps) {
  const { items, getTotal, getItemSubtotal, clearCart } = useCart();
  const { isSaturday, dayKey } = useDay();

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [address, setAddress] = useState({ street: "", number: "" });
  const [needsChange, setNeedsChange] = useState<boolean | null>(null);
  const [changeAmount, setChangeAmount] = useState("");
  const [changeError, setChangeError] = useState(false);
  const [selectedDrinks, setSelectedDrinks] = useState<DrinkOrder[]>([]);
  const [showDrinks, setShowDrinks] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const deliveryFee =
    deliveryMethod === "entrega" && isSaturday
      ? restaurantInfo.deliveryFeeSaturday
      : 0;
  const subtotal = getTotal();
  const drinksTotal = selectedDrinks.reduce(
    (acc, drink) => acc + drink.price * drink.quantity,
    0
  );
  const total = subtotal + deliveryFee + drinksTotal;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleAddDrink = (drink: (typeof drinks)[0]) => {
    setSelectedDrinks((prev) => {
      const existing = prev.find((d) => d.id === drink.id);
      if (existing) {
        return prev.map((d) =>
          d.id === drink.id ? { ...d, quantity: d.quantity + 1 } : d
        );
      }
      return [...prev, { ...drink, quantity: 1 }];
    });
  };

  const handleRemoveDrink = (drinkId: string) => {
    setSelectedDrinks((prev) => {
      const existing = prev.find((d) => d.id === drinkId);
      if (existing && existing.quantity > 1) {
        return prev.map((d) =>
          d.id === drinkId ? { ...d, quantity: d.quantity - 1 } : d
        );
      }
      return prev.filter((d) => d.id !== drinkId);
    });
  };

  const getDrinkQuantity = (drinkId: string) => {
    return selectedDrinks.find((d) => d.id === drinkId)?.quantity || 0;
  };

  const isFormValid = () => {
    if (!deliveryMethod || !paymentMethod) return false;

    if (deliveryMethod === "entrega") {
      if (!address.street.trim() || !address.number.trim()) return false;
    }

    if (paymentMethod === "dinheiro") {
      if (needsChange === null) return false;
      if (needsChange && !changeAmount.trim()) {
        return false;
      }
    }

    return items.length > 0;
  };

  const buildWhatsAppMessage = () => {
    let message = `🍽️ *NOVO PEDIDO - ${restaurantInfo.name}*\n\n`;

    message += `📅 *CARDÁPIO - ${dayDisplayNames[dayKey] || "Hoje"}*\n`;
    const dayMenu = weeklyMenu[dayKey];
    if (dayMenu && dayMenu.items) {
      const accompaniments = dayMenu.items.map((item) => item.name).join(", ");
      message += `${accompaniments}\n\n`;
    }

    message += `📋 *ITENS DO PEDIDO:*\n`;
    items.forEach((item, index) => {
      message += `\n*${item.tamanhoMarmita}* - ${item.carne}\n`;
      message += `   Qtd: ${item.quantidade} | R$ ${getItemSubtotal(
        item
      )},00\n`;
      if (item.extraCharge > 0) {
        message += `   ⚠️ Acréscimo: +R$ ${item.extraCharge},00\n`;
      }
      if (item.removerItens.length > 0) {
        message += `   ✗ Sem: ${item.removerItens.join(", ")}\n`;

        if (isSaturday) {
          const hasFeijaoPreto = item.adicionarItens.includes(
            "Feijão preto com pernil de porco e calabresa"
          );
          const hasFeijaoCarioca =
            item.adicionarItens.includes("Feijão carioca");

          if (hasFeijaoPreto) {
            message += `   🫘 Feijão: Feijão preto com pernil de porco e calabresa\n`;
          } else if (hasFeijaoCarioca) {
            message += `   🫘 Feijão: Feijão carioca\n`;
          }
        }
      }
    });

    if (selectedDrinks.length > 0) {
      message += `\n🥤 *BEBIDAS:*\n`;
      selectedDrinks.forEach((drink) => {
        const drinkTotal = drink.price * drink.quantity;
        message += `${drink.name}\n`;
        message += `   Qtd: ${drink.quantity} | R$ ${drinkTotal
          .toFixed(2)
          .replace(".", ",")}\n`;
      });
    }

    message += `\n📍 *RETIRADA:*\n`;
    if (deliveryMethod === "balcao") {
      message += `Balcão\n`;
    } else {
      message += `Entrega\n`;
      message += `${address.street}, ${address.number}\n`;
      if (isSaturday && deliveryFee > 0) {
        message += `⚠️ Este pedido possui taxa de entrega de R$ ${deliveryFee},00 (sábado)\n`;
      }
    }

    message += `\n💳 *PAGAMENTO:*\n`;
    switch (paymentMethod) {
      case "cartao":
        message += `Cartão\n`;
        break;
      case "pix":
        message += `Pix\n`;
        message += `Chave: ${restaurantInfo.pixKey}\n`;
        break;
      case "dinheiro":
        message += `Dinheiro\n`;
        if (needsChange) {
          message += `💵 Troco para: R$ ${changeAmount}\n`;
        } else {
          message += `Sem troco\n`;
        }
        break;
    }

    message += `\n💰 *TOTAL: R$ ${total.toFixed(2).replace(".", ",")}*`;

    return encodeURIComponent(message);
  };

  const handleSendOrder = () => {
    if (paymentMethod === "dinheiro" && needsChange) {
      const changeValue = Number(changeAmount);
      if (changeValue < total) {
        setChangeError(true);
        toast.error(
          `O valor do troco (R$ ${changeValue
            .toFixed(2)
            .replace(".", ",")}) deve ser maior ou igual que o total (R$ ${total
            .toFixed(2)
            .replace(".", ",")})`
        );
        return;
      }
    }

    track.pedidoCriado({
      items: items,
      total: total,
      pagamento: paymentMethod,
      entrega: deliveryMethod,
      endereco: deliveryMethod === "entrega" ? address : null,
      taxaEntrega: deliveryFee,
      getItemSubtotal: getItemSubtotal,
    });

    const message = buildWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${restaurantInfo.phone}?text=${message}`;
    window.open(whatsappUrl, "_blank");

    toast.success(
      "Você será redirecionado para o WhatsApp com o pedido pronto para enviar!"
    );
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-card rounded-t-3xl md:rounded-3xl w-full max-w-lg flex flex-col shadow-glow animate-slide-up"
        style={{ maxHeight: "95vh" }}
      >
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <h2 className="font-display text-xl font-bold text-foreground">
            Finalizar Pedido
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-6"
        >
          {/* Order Bump - Bebidas */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-2xl p-4 border-2 border-blue-200 dark:border-blue-800">
            <button
              onClick={() => setShowDrinks(!showDrinks)}
              className="w-full flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <Wine className="w-5 h-5 text-blue-600" />
                <h3 className="font-display font-bold text-foreground">
                  Adicionar Bebidas? 🥤
                </h3>
              </div>
              <div
                className={`transition-transform ${
                  showDrinks ? "rotate-180" : ""
                }`}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </button>

            {!showDrinks && selectedDrinks.length > 0 && (
              <div className="mt-2 text-sm text-muted-foreground">
                {selectedDrinks.length}{" "}
                {selectedDrinks.length === 1
                  ? "bebida adicionada"
                  : "bebidas adicionadas"}
              </div>
            )}

            {showDrinks && (
              <div className="mt-4 space-y-2 animate-fade-in">
                <p className="text-sm text-muted-foreground mb-3">
                  Aproveite e adicione bebidas ao seu pedido!
                </p>
                {drinks.map((drink) => {
                  const quantity = getDrinkQuantity(drink.id);
                  return (
                    <div
                      key={drink.id}
                      className="flex items-center justify-between bg-white dark:bg-gray-900 rounded-xl p-3"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{drink.name}</p>
                        <p className="text-primary font-bold">
                          R$ {drink.price.toFixed(2).replace(".", ",")}
                        </p>
                      </div>
                      {quantity === 0 ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAddDrink(drink)}
                          className="h-8"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRemoveDrink(drink.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-bold min-w-[2ch] text-center">
                            {quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleAddDrink(drink)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <h3 className="flex items-center gap-2 font-display font-bold mb-3">
              <MapPin className="w-5 h-5 text-primary" />
              Forma de Retirada
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeliveryMethod("balcao")}
                className={`p-4 rounded-2xl border-2 transition-all text-center ${
                  deliveryMethod === "balcao"
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <span className="font-semibold">Balcão</span>
              </button>
              <button
                onClick={() => setDeliveryMethod("entrega")}
                className={`p-4 rounded-2xl border-2 transition-all text-center ${
                  deliveryMethod === "entrega"
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <span className="font-semibold">Entrega</span>
              </button>
            </div>

            {deliveryMethod === "entrega" && (
              <div className="mt-4 space-y-3 animate-fade-in">
                <div>
                  <Label htmlFor="street">Nome da rua</Label>
                  <Input
                    id="street"
                    placeholder="Rua..."
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    placeholder="Número..."
                    inputMode="numeric"
                    value={address.number}
                    onChange={(e) =>
                      setAddress({ ...address, number: e.target.value })
                    }
                    className="mt-1"
                  />
                </div>
                {isSaturday && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-amber-900 dark:text-amber-100">
                        Taxa de entrega aos sábados
                      </p>
                      <p className="text-amber-800 dark:text-amber-200 mt-1">
                        Será cobrada uma taxa de <strong>R$ 2,00</strong> para
                        entregas realizadas aos sábados.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="flex items-center gap-2 font-display font-bold mb-3">
              <CreditCard className="w-5 h-5 text-primary" />
              Forma de Pagamento
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => setPaymentMethod("cartao")}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  paymentMethod === "cartao"
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">Cartão</span>
              </button>

              <button
                onClick={() => {
                  setPaymentMethod("pix");
                  setTimeout(() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({
                        top: scrollContainerRef.current.scrollHeight,
                        behavior: "smooth",
                      });
                    }
                  }, 100);
                }}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  paymentMethod === "pix"
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">Pix</span>
              </button>

              <button
                onClick={() => {
                  setPaymentMethod("dinheiro");
                  setTimeout(() => {
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({
                        top: scrollContainerRef.current.scrollHeight,
                        behavior: "smooth",
                      });
                    }
                  }, 100);
                }}
                className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                  paymentMethod === "dinheiro"
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <Banknote className="w-5 h-5 text-muted-foreground" />
                <span className="font-semibold">Dinheiro</span>
              </button>
            </div>

            {paymentMethod === "pix" && (
              <div className="mt-4 p-4 rounded-2xl bg-muted animate-fade-in">
                <p className="font-semibold text-foreground mb-1">Chave Pix:</p>
                <p className="text-primary font-mono text-lg">
                  {restaurantInfo.pixKey}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Envie o comprovante junto com o pedido no WhatsApp
                </p>
              </div>
            )}

            {paymentMethod === "dinheiro" && (
              <div className="mt-4 space-y-3 animate-fade-in">
                <p className="font-medium text-foreground">Precisa de troco?</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setNeedsChange(true);
                      setTimeout(() => {
                        if (scrollContainerRef.current) {
                          scrollContainerRef.current.scrollTo({
                            top: scrollContainerRef.current.scrollHeight,
                            behavior: "smooth",
                          });
                        }
                      }, 100);
                    }}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      needsChange === true
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => setNeedsChange(false)}
                    className={`flex-1 p-3 rounded-xl border-2 transition-all ${
                      needsChange === false
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                  >
                    Não
                  </button>
                </div>
                {needsChange && (
                  <div className="animate-fade-in">
                    <Label htmlFor="change">Para quantos reais?</Label>
                    <Input
                      id="change"
                      type="text"
                      inputMode="numeric"
                      placeholder="R$"
                      value={changeAmount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setChangeAmount(value);
                        setChangeError(false);
                      }}
                      className={`mt-1 ${
                        changeError
                          ? "border-red-500 border-2 focus-visible:ring-red-500"
                          : ""
                      }`}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="p-4 pb-6 md:pb-4 border-t border-border bg-muted/30 shrink-0">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span className="font-semibold">R$ {subtotal},00</span>
            </div>

            {selectedDrinks.length > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Bebidas:</span>
                <span className="font-semibold">
                  R$ {drinksTotal.toFixed(2).replace(".", ",")}
                </span>
              </div>
            )}

            {deliveryMethod === "entrega" && isSaturday && deliveryFee > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  Taxa de entrega (sábado):
                </span>
                <span className="font-semibold text-amber-600">
                  R$ {deliveryFee},00
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-lg font-bold text-foreground">Total:</span>
              <span className="text-2xl font-bold text-primary">
                R$ {total.toFixed(2).replace(".", ",")}
              </span>
            </div>
          </div>

          <Button
            variant="whatsapp"
            size="lg"
            onClick={handleSendOrder}
            disabled={!isFormValid()}
            className="w-full"
          >
            <Send className="w-5 h-5" />
            Enviar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
}
