import { useState, useRef } from "react";
import {
  MapPin,
  CreditCard,
  Smartphone,
  Banknote,
  Send,
  Plus,
  Minus,
  Info,
  CupSoda,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCart } from "@/contexts/CartContext";
import {
  drinks,
} from "@/data/menuData";
import { RESTAURANT_INFO } from "@/config";
import toast from "react-hot-toast";
import { useDay } from "@/contexts/DayContext";
import { track } from "@/lib/tracking";
import { buildWhatsAppMessage } from "@/utils/whatsapp-builder";
import { redirectToWhatsApp } from "@/utils/whatsapp-redirect";
import { DeliveryMethod, isOrderValid, PaymentMethod } from "@/utils/order-validation";
import { Header } from "@/components/Header";
import { useNavigate } from "react-router-dom";
import { CustomToaster } from "@/components/CustomToaster";
import { ServiceClosed } from "@/components/ServiceClosed";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export interface DrinkOrder {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const Checkout = () => {
  const navigate = useNavigate();
  const { items, getTotal, getItemSubtotal, clearCart } = useCart();
  const { isSaturday, dayKey, isOpen } = useDay();

  if (!isOpen) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header showBack title="Finalizar Pedido" />
        <main className="flex-1 flex flex-col mt-20">
          <ServiceClosed />
        </main>
      </div>
    );
  }

  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [address, setAddress] = useState({ street: "", number: "" });
  const [needsChange, setNeedsChange] = useState<boolean | null>(null);
  const [changeAmount, setChangeAmount] = useState("");
  const [changeError, setChangeError] = useState(false);
  const [selectedDrinks, setSelectedDrinks] = useState<DrinkOrder[]>([]);
  const [isDrinksModalOpen, setIsDrinksModalOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const deliveryFee =
    deliveryMethod === "entrega" ? RESTAURANT_INFO.deliveryFee : 0;

  const subtotal = getTotal();
  const drinksTotal = selectedDrinks.reduce(
    (acc, drink) => acc + drink.price * drink.quantity,
    0
  );
  const total = subtotal + deliveryFee + drinksTotal;

  const handleAddDrink = (drink: (typeof drinks)[0], shouldCloseModal = false) => {
    setSelectedDrinks((prev) => {
      const existing = prev.find((d) => d.id === drink.id);
      if (existing) {
        return prev.map((d) =>
          d.id === drink.id ? { ...d, quantity: d.quantity + 1 } : d
        );
      }
      return [...prev, { ...drink, quantity: 1 }];
    });
    if (shouldCloseModal) {
      setIsDrinksModalOpen(false);
    }
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

  const isFormValid = () => {
    return isOrderValid({
        deliveryMethod,
        paymentMethod,
        address,
        needsChange,
        changeAmount,
        hasItems: items.length > 0 || selectedDrinks.length > 0
    });
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
      bebidas: selectedDrinks.map(d => ({ name: d.name, qty: d.quantity, price: d.price }))
    });

    const orderItems = items.map((item) => {
      let customMessage = "";
      if (isSaturday) {
        const hasFeijaoPreto = item.adicionarItens.includes(
          "Feijão preto com pernil de porco e calabresa"
        );
        const hasFeijaoCarioca = item.adicionarItens.includes("Feijão carioca");
        if (hasFeijaoPreto) {
          customMessage =
            "🫘 Feijão: Feijão preto com pernil de porco e calabresa";
        } else if (hasFeijaoCarioca) {
          customMessage = "🫘 Feijão: Feijão carioca";
        }
      }

      return {
        sizeName: item.tamanhoMarmita,
        meatName: item.carne,
        price: getItemSubtotal(item),
        qty: item.quantidade,
        extraCharge: item.extraCharge,
        removedItems: item.removerItens.map((i) => i.split(" ")[0]),
        customMessage,
      };
    });

    const drinksForMsg = selectedDrinks.map((d) => ({
      name: d.name,
      qty: d.quantity,
      price: d.price * d.quantity,
    }));

    const message = buildWhatsAppMessage({
      dayKey: dayKey,
      deliveryMethod: deliveryMethod!,
      paymentMethod: paymentMethod!,
      address: deliveryMethod === "entrega" ? address : undefined,
      changeAmount: needsChange ? changeAmount : undefined,
      deliveryFee: deliveryFee,
      total: total,
      items: orderItems,
      drinks: drinksForMsg,
    });

    const whatsappUrl = message;

    console.log({checkoutUrl: whatsappUrl});

    redirectToWhatsApp(whatsappUrl);

    toast.success(
      "Você será redirecionado para o WhatsApp com o pedido pronto para enviar!"
    );
    clearCart();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showBack title="Finalizar Pedido" />

      <main className="flex-1 pb-40" ref={scrollContainerRef}>
        <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
          <div>
            <h3 className="flex items-center gap-1.5 font-semibold text-lg mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              Retirada
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDeliveryMethod("balcao")}
                className={`p-4 rounded-xl border-2 transition-all text-base font-medium ${
                  deliveryMethod === "balcao"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/30"
                }`}
              >
                Balcão
              </button>
              <button
                onClick={() => setDeliveryMethod("entrega")}
                className={`p-4 rounded-xl border-2 transition-all text-base font-medium ${
                  deliveryMethod === "entrega"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/30"
                }`}
              >
                Entrega
              </button>
            </div>

            {deliveryMethod === "entrega" && (
              <div className="mt-4 space-y-3 animate-fade-in">
                <div>
                  <Label htmlFor="street" className="text-sm">
                    Nome da rua
                  </Label>
                  <Input
                    id="street"
                    placeholder="Nome da rua..."
                    value={address.street}
                    onChange={(e) =>
                      setAddress({ ...address, street: e.target.value })
                    }
                    className="mt-1.5 h-11 text-base"
                  />
                </div>
                <div>
                  <Label htmlFor="number" className="text-sm">
                    Número
                  </Label>
                  <Input
                    id="number"
                    placeholder="Número..."
                    inputMode="numeric"
                    value={address.number}
                    onChange={(e) =>
                      setAddress({ ...address, number: e.target.value })
                    }
                    className="mt-1.5 h-11 text-base"
                  />
                </div>
                {deliveryFee > 0 && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-900 dark:text-amber-100">
                      Taxa de entrega:{" "}
                      <strong>
                        R$ {deliveryFee.toFixed(2).replace(".", ",")}
                      </strong>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <h3 className="flex items-center gap-1.5 font-semibold text-lg mb-4">
              <CreditCard className="w-5 h-5 text-primary" />
              Pagamento
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod("cartao")}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "cartao"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <CreditCard className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-base">Cartão</span>
              </button>

              <button
                onClick={() => {
                  setPaymentMethod("pix");
                  setTimeout(() => {
                    if (scrollContainerRef.current) {
                      window.scrollTo({
                         top: document.body.scrollHeight,
                         behavior: "smooth"
                      });
                    }
                  }, 100);
                }}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "pix"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-base">Pix</span>
              </button>

              <button
                onClick={() => {
                  setPaymentMethod("dinheiro");
                  setTimeout(() => {
                     if (scrollContainerRef.current) {
                      window.scrollTo({
                         top: document.body.scrollHeight,
                         behavior: "smooth"
                      });
                    }
                  }, 100);
                }}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                  paymentMethod === "dinheiro"
                    ? "border-primary bg-primary/10"
                    : "border-border hover:border-primary/30"
                }`}
              >
                <Banknote className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-base">Dinheiro</span>
              </button>
            </div>

            {paymentMethod === "pix" && (
              <div className="mt-4 p-4 rounded-xl bg-muted animate-fade-in">
                <p className="font-semibold text-sm mb-1.5">Chave Pix:</p>
                <p className="text-primary font-mono text-base break-all select-all">
                  {RESTAURANT_INFO.pixKey}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Envie o comprovante no WhatsApp
                </p>
              </div>
            )}

            {paymentMethod === "dinheiro" && (
              <div className="mt-4 space-y-3 animate-fade-in">
                <p className="font-medium text-sm">Precisa de troco?</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => {
                      setNeedsChange(true);
                      setTimeout(() => {
                         if (scrollContainerRef.current) {
                            window.scrollTo({
                                top: document.body.scrollHeight,
                                behavior: "smooth"
                            });
                        }
                      }, 100);
                    }}
                    className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      needsChange === true
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border"
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => setNeedsChange(false)}
                    className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                      needsChange === false
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border"
                    }`}
                  >
                    Não
                  </button>
                </div>
                {needsChange && (
                  <div className="animate-fade-in">
                    <Label htmlFor="change" className="text-sm">
                      Troco para quanto?
                    </Label>
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
                      className={`mt-1.5 h-11 text-base ${
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

          <div className="pt-2">
            <Dialog open={isDrinksModalOpen} onOpenChange={setIsDrinksModalOpen}>
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white shadow-soft">
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <h3 className="text-xl font-bold mb-1 flex items-center justify-center sm:justify-start gap-2">
                      <CupSoda className="w-6 h-6" />
                      Que tal uma bebida?
                    </h3>
                    <p className="text-orange-50/90 text-sm">
                      Temos sucos, refrigerantes e água geladinha!
                    </p>
                  </div>
                  <DialogTrigger asChild>
                    <Button 
                      variant="secondary" 
                      className="bg-white text-orange-600 hover:bg-orange-50 font-bold px-6 shadow-md active:scale-95 transition-all shrink-0"
                    >
                      Ver Opções
                    </Button>
                  </DialogTrigger>
                </div>
                {/* Decorative background icon */}
                <CupSoda className="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 rotate-12" />
              </div>

              <DialogContent className="max-w-md max-h-[90vh] p-0 flex flex-col">
                <DialogHeader className="p-6 pb-4 border-b bg-background shrink-0">
                  <DialogTitle className="flex items-center gap-2">
                    <CupSoda className="text-primary" />
                    Escolha suas Bebidas
                  </DialogTitle>
                </DialogHeader>
                
                <div className="flex-1 overflow-y-auto p-6 pt-4">
                  <div className="grid gap-2">
                    {drinks.map((drink) => {
                      return (
                        <button
                          key={drink.id}
                          onClick={() => handleAddDrink(drink, true)}
                          className="flex items-center justify-between p-4 rounded-xl border-2 border-border hover:border-primary hover:bg-primary/5 transition-all text-left group"
                        >
                          <div className="flex-1">
                            <p className="font-semibold text-sm group-hover:text-primary transition-colors">
                              {drink.name}
                            </p>
                            <p className="text-primary font-bold text-sm">
                              R$ {drink.price.toFixed(2).replace(".", ",")}
                            </p>
                          </div>
                          <Plus className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {selectedDrinks.length > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-muted/50 border border-muted animate-fade-in">
                <p className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Bebidas Adicionadas:
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedDrinks.map((drink) => (
                    <div 
                      key={drink.id}
                      className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-border shadow-sm text-sm"
                    >
                      <span className="font-bold text-primary">{drink.quantity}x</span>
                      <span className="font-medium text-muted-foreground">{drink.name}</span>
                      <button 
                        onClick={() => handleRemoveDrink(drink.id)}
                        className="ml-1 text-muted-foreground hover:text-red-500 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <CustomToaster />
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-float z-40">
        <div className="container mx-auto max-w-2xl">
          <div className="space-y-2 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Marmitas:</span>
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

            {deliveryMethod === "entrega" && deliveryFee > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Taxa de entrega:</span>
                <span className="font-semibold text-amber-600">
                  R$ {deliveryFee.toFixed(2).replace(".", ",")}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-base font-bold text-foreground">Total:</span>
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
            className="w-full h-12 text-base font-bold"
          >
            <Send className="w-5 h-5 mr-2" />
            Enviar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
