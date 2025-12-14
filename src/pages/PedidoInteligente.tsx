import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Check,
  Save,
  Calendar,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  weeklyMenu,
  dayDisplayNames,
  marmitaSizes,
  restaurantInfo,
  MarmitaSize,
  MeatOption,
} from "@/data/menuData";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type DayKey =
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado"
  | "domingo";
type DeliveryMethod = "balcao" | "entrega";
type PaymentMethod = "cartao" | "pix" | "dinheiro";

interface DayOrder {
  size: MarmitaSize | null;
  meat: MeatOption | null;
  items: Record<string, boolean>;
  delivery: DeliveryMethod | null;
  payment: PaymentMethod | null;
  address?: { street: string; number: string };
  needsChange?: boolean;
  changeAmount?: string;
  whatsappLink?: string;
}

interface IntelligentOrders {
  0: null;
  1: DayOrder | null;
  2: DayOrder | null;
  3: DayOrder | null;
  4: DayOrder | null;
  5: DayOrder | null;
  6: DayOrder | null;
}

const dayKeyToNumber: Record<DayKey, number> = {
  domingo: 0,
  segunda: 1,
  terca: 2,
  quarta: 3,
  quinta: 4,
  sexta: 5,
  sabado: 6,
};

const PedidoInteligente = () => {
  const navigate = useNavigate();
  const [currentDay, setCurrentDay] = useState<DayKey>("segunda");
  const [orders, setOrders] = useState<IntelligentOrders>({
    0: null,
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const days: DayKey[] = [
    "segunda",
    "terca",
    "quarta",
    "quinta",
    "sexta",
    "sabado",
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/intelligent-order");
      const data = await res.json();
      if (data.orders) {
        setOrders(JSON.parse(data.orders));
      }
    } catch (err) {
      console.error("Erro ao carregar pedidos:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentDayOrder = (): DayOrder => {
    const dayNum = dayKeyToNumber[currentDay];
    const existing = orders[dayNum as keyof IntelligentOrders];

    if (existing && existing !== null) {
      return existing as DayOrder;
    }

    const dayMenu = weeklyMenu[currentDay];
    const initialItems: Record<string, boolean> = {};
    dayMenu.items.forEach((item) => {
      initialItems[item.id] = item.checked;
    });

    return {
      size: null,
      meat: null,
      items: initialItems,
      delivery: null,
      payment: null,
    };
  };

  const currentDayOrder = getCurrentDayOrder();
  const dayMenu = weeklyMenu[currentDay];

  const updateCurrentDay = (updates: Partial<DayOrder>) => {
    const dayNum = dayKeyToNumber[currentDay];
    const updated = { ...currentDayOrder, ...updates };

    setOrders((prev) => ({
      ...prev,
      [dayNum]: updated,
    }));
  };

  const toggleItem = (itemId: string) => {
    const isSaturday = currentDay === "sabado";
    const newItems = { ...currentDayOrder.items };

    if (
      isSaturday &&
      (itemId === "feijao-preto" || itemId === "feijao-carioca")
    ) {
      const otherId =
        itemId === "feijao-preto" ? "feijao-carioca" : "feijao-preto";
      newItems[itemId] = !newItems[itemId];
      if (newItems[itemId]) {
        newItems[otherId] = false;
      }
    } else {
      newItems[itemId] = !newItems[itemId];
    }

    updateCurrentDay({ items: newItems });
  };

  const buildWhatsAppLink = (day: DayKey, order: DayOrder): string => {
    if (!order.size || !order.meat || !order.delivery || !order.payment) {
      return "";
    }

    let message = `🍽️ *PEDIDO INTELIGENTE - ${restaurantInfo.name}*\n\n`;
    message += `📅 *DIA: ${dayDisplayNames[day]}*\n\n`;

    const dayMenuData = weeklyMenu[day];
    if (dayMenuData && dayMenuData.items) {
      const accompaniments = dayMenuData.items
        .map((item) => item.name)
        .join(", ");
      message += `${accompaniments}\n\n`;
    }

    message += `📋 *MEU PEDIDO:*\n\n`;
    message += `*${order.size.name}* - ${order.meat.name}\n`;
    message += `Preço: R$ ${order.size.price},00\n`;

    const extraCharge =
      order.size.id === "mini" &&
      order.meat.extraForMini &&
      order.meat.extraPrice
        ? order.meat.extraPrice
        : 0;

    if (extraCharge > 0) {
      message += `⚠️ Acréscimo: +R$ ${extraCharge},00\n`;
    }

    const removedItems = dayMenuData.items
      .filter((item) => !order.items[item.id])
      .map((item) => item.name);

    if (removedItems.length > 0) {
      message += `✗ Sem: ${removedItems.join(", ")}\n`;

      if (day === "sabado") {
        const hasFeijaoPreto = order.items["feijao-preto"];
        const hasFeijaoCarioca = order.items["feijao-carioca"];

        if (hasFeijaoPreto) {
          message += `🫘 Feijão: Feijão preto com pernil de porco e calabresa\n`;
        } else if (hasFeijaoCarioca) {
          message += `🫘 Feijão: Feijão carioca\n`;
        }
      }
    }

    message += `\n📍 *RETIRADA:*\n`;
    if (order.delivery === "balcao") {
      message += `Balcão\n`;
    } else {
      message += `Entrega\n`;
      if (order.address) {
        message += `${order.address.street}, ${order.address.number}\n`;
      }
      if (day === "sabado") {
        message += `⚠️ Taxa de entrega: R$ ${restaurantInfo.deliveryFeeSaturday},00 (sábado)\n`;
      }
    }

    message += `\n💳 *PAGAMENTO:*\n`;
    switch (order.payment) {
      case "cartao":
        message += `Cartão\n`;
        break;
      case "pix":
        message += `Pix\n`;
        message += `Chave: ${restaurantInfo.pixKey}\n`;
        break;
      case "dinheiro":
        message += `Dinheiro\n`;
        if (order.needsChange && order.changeAmount) {
          message += `💵 Troco para: R$ ${order.changeAmount}\n`;
        } else {
          message += `Sem troco\n`;
        }
        break;
    }

    const deliveryFee =
      order.delivery === "entrega" && day === "sabado"
        ? restaurantInfo.deliveryFeeSaturday
        : 0;
    const total = order.size.price + extraCharge + deliveryFee;

    message += `\n💰 *TOTAL: R$ ${total.toFixed(2).replace(".", ",")}*`;

    return `https://wa.me/${restaurantInfo.phone}?text=${encodeURIComponent(
      message
    )}`;
  };

  const isDayComplete = (day: DayKey): boolean => {
    const dayNum = dayKeyToNumber[day];
    const order = orders[dayNum as keyof IntelligentOrders] as DayOrder | null;

    if (!order) return false;
    if (!order.size || !order.meat || !order.delivery || !order.payment)
      return false;

    if (order.delivery === "entrega") {
      if (!order.address?.street || !order.address?.number) return false;
    }

    if (order.payment === "dinheiro") {
      if (order.needsChange === null || order.needsChange === undefined)
        return false;
      if (order.needsChange && !order.changeAmount) return false;
    }

    return true;
  };

  const saveOrders = async () => {
    setSaving(true);
    try {
      const ordersWithLinks: IntelligentOrders = { ...orders };

      // Gerar links do WhatsApp para cada dia
      days.forEach((day) => {
        const dayNum = dayKeyToNumber[day];
        const order = ordersWithLinks[
          dayNum as keyof IntelligentOrders
        ] as DayOrder | null;
        if (order && isDayComplete(day)) {
          order.whatsappLink = buildWhatsAppLink(day, order);
        }
      });

      const res = await fetch("/api/intelligent-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: JSON.stringify(ordersWithLinks) }),
      });

      if (res.ok) {
        toast.success("Pedido inteligente salvo com sucesso!");
        setOrders(ordersWithLinks);
      } else {
        toast.error("Erro ao salvar pedido inteligente");
      }
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar pedido inteligente");
    } finally {
      setSaving(false);
    }
  };

  const openWhatsApp = (day: DayKey) => {
    const dayNum = dayKeyToNumber[day];
    const order = orders[dayNum as keyof IntelligentOrders] as DayOrder | null;

    if (order?.whatsappLink) {
      window.open(order.whatsappLink, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isCurrentDayComplete = isDayComplete(currentDay);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header showBack title="Pedido Inteligente" />

      <main className="flex-1 pb-32">
        <div className="sticky top-16 z-30 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
              {days.map((day) => {
                const isComplete = isDayComplete(day);
                const isCurrent = day === currentDay;

                return (
                  <button
                    key={day}
                    onClick={() => setCurrentDay(day)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-all flex items-center gap-2 ${
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isComplete
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {dayDisplayNames[day].split("-")[0]}
                    {isComplete && <Check className="w-4 h-4" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6 max-w-2xl space-y-6">
          <div>
            <h3 className="font-display text-lg font-bold mb-3 text-foreground">
              Tamanho
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {marmitaSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => updateCurrentDay({ size })}
                  className={`p-4 rounded-2xl border-2 transition-all text-left ${
                    currentDayOrder.size?.id === size.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-foreground">
                        {size.name}
                      </span>
                      <p className="text-sm text-muted-foreground">
                        {size.description}
                      </p>
                    </div>
                    <span className="text-primary font-bold text-lg">
                      R$ {size.price},00
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold mb-3 text-foreground">
              Acompanhamentos
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {dayMenu.items.map((item) => {
                const isChecked = currentDayOrder.items[item.id];
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                      isChecked
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card opacity-60"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                        isChecked
                          ? "bg-primary border-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {isChecked && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isChecked
                          ? "text-foreground"
                          : "text-muted-foreground line-through"
                      }`}
                    >
                      {item.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold mb-3 text-foreground">
              Carne
            </h3>
            <div className="space-y-2">
              {dayMenu.meats.map((meat) => {
                const showExtra =
                  meat.extraForMini &&
                  meat.extraPrice &&
                  currentDayOrder.size?.id === "mini";
                const isSelected = currentDayOrder.meat?.id === meat.id;

                return (
                  <button
                    key={meat.id}
                    onClick={() => updateCurrentDay({ meat })}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all text-left ${
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? "border-primary"
                          : "border-muted-foreground"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      )}
                    </div>
                    <div className="flex-1">
                      <span
                        className={`font-semibold ${
                          showExtra ? "text-primary" : "text-foreground"
                        }`}
                      >
                        {meat.name}
                      </span>
                      {showExtra && (
                        <span className="ml-2 text-sm font-bold text-primary">
                          (+R$ {meat.extraPrice?.toFixed(2)})
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg font-bold mb-3 text-foreground">
              Retirada
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => updateCurrentDay({ delivery: "balcao" })}
                className={`p-4 rounded-xl border-2 transition-all font-medium ${
                  currentDayOrder.delivery === "balcao"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border"
                }`}
              >
                Balcão
              </button>
              <button
                onClick={() => updateCurrentDay({ delivery: "entrega" })}
                className={`p-4 rounded-xl border-2 transition-all font-medium ${
                  currentDayOrder.delivery === "entrega"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border"
                }`}
              >
                Entrega
              </button>
            </div>

            {currentDayOrder.delivery === "entrega" && (
              <div className="mt-3 space-y-2 animate-fade-in">
                <input
                  type="text"
                  placeholder="Nome da rua"
                  value={currentDayOrder.address?.street || ""}
                  onChange={(e) =>
                    updateCurrentDay({
                      address: {
                        street: e.target.value,
                        number: currentDayOrder.address?.number || "",
                      },
                    })
                  }
                  className="w-full p-3 rounded-xl border-2 border-border bg-card text-foreground"
                />
                <input
                  type="text"
                  placeholder="Número"
                  inputMode="numeric"
                  value={currentDayOrder.address?.number || ""}
                  onChange={(e) =>
                    updateCurrentDay({
                      address: {
                        street: currentDayOrder.address?.street || "",
                        number: e.target.value,
                      },
                    })
                  }
                  className="w-full p-3 rounded-xl border-2 border-border bg-card text-foreground"
                />
              </div>
            )}
          </div>

          <div>
            <h3 className="font-display text-lg font-bold mb-3 text-foreground">
              Pagamento
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => updateCurrentDay({ payment: "cartao" })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${
                  currentDayOrder.payment === "cartao"
                    ? "border-primary bg-primary/10"
                    : "border-border"
                }`}
              >
                Cartão
              </button>
              <button
                onClick={() => updateCurrentDay({ payment: "pix" })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${
                  currentDayOrder.payment === "pix"
                    ? "border-primary bg-primary/10"
                    : "border-border"
                }`}
              >
                Pix
              </button>
              <button
                onClick={() => updateCurrentDay({ payment: "dinheiro" })}
                className={`w-full p-4 rounded-xl border-2 transition-all text-left font-medium ${
                  currentDayOrder.payment === "dinheiro"
                    ? "border-primary bg-primary/10"
                    : "border-border"
                }`}
              >
                Dinheiro
              </button>
            </div>

            {currentDayOrder.payment === "dinheiro" && (
              <div className="mt-3 space-y-2 animate-fade-in">
                <p className="font-medium text-sm">Precisa de troco?</p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateCurrentDay({ needsChange: true })}
                    className={`p-3 rounded-xl border-2 transition-all font-medium ${
                      currentDayOrder.needsChange === true
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border"
                    }`}
                  >
                    Sim
                  </button>
                  <button
                    onClick={() => updateCurrentDay({ needsChange: false })}
                    className={`p-3 rounded-xl border-2 transition-all font-medium ${
                      currentDayOrder.needsChange === false
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border"
                    }`}
                  >
                    Não
                  </button>
                </div>
                {currentDayOrder.needsChange && (
                  <input
                    type="text"
                    inputMode="numeric"
                    placeholder="Troco para quanto? (R$)"
                    value={currentDayOrder.changeAmount || ""}
                    onChange={(e) =>
                      updateCurrentDay({
                        changeAmount: e.target.value.replace(/\D/g, ""),
                      })
                    }
                    className="w-full p-3 rounded-xl border-2 border-border bg-card text-foreground"
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-float z-40">
        <div className="container mx-auto max-w-2xl space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Dias configurados:</span>
            <span className="font-bold text-foreground">
              {days.filter((d) => isDayComplete(d)).length}/6
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="lg"
              onClick={saveOrders}
              disabled={saving || days.every((d) => !isDayComplete(d))}
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Salvar Tudo
            </Button>
            <Button
              variant="warm"
              size="lg"
              onClick={() => openWhatsApp(currentDay)}
              disabled={
                !isCurrentDayComplete ||
                !orders[dayKeyToNumber[currentDay] as keyof IntelligentOrders]
              }
            >
              <ExternalLink className="w-5 h-5" />
              Enviar {dayDisplayNames[currentDay].split("-")[0]}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PedidoInteligente;
