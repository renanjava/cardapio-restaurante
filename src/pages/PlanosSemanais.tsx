import { useState, useEffect, useRef } from "react";
import {
  AlertCircle,
  Save,
  Loader2,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  marmitaSizes,
  weeklyMenu,
  MarmitaSize,
  MeatOption,
} from "@/data/menuData";
import { DayKey } from "@/config";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { CustomToaster } from "@/components/CustomToaster";
import { useUser } from "@/lib/safe-auth";
import { SizeSelector } from "@/components/order/SizeSelector";
import { MeatSelector } from "@/components/order/MeatSelector";
import { ToppingsSelector } from "@/components/order/ToppingsSelector";
import { DeliveryTimeSelector } from "@/components/weekly-plan/DeliveryTimeSelector";
import { PlanSummary } from "@/components/weekly-plan/PlanSummary";
import { calculateDeliveryFee, calculateMeatExtra } from "@/utils/order-calculations";
import { buildWhatsAppMessage } from "@/utils/whatsapp-builder";
import { Address, DeliveryMethod, PaymentMethod } from "@/utils/order-validation";
import { useDay } from "@/contexts/DayContext";
import { ServiceClosed } from "@/components/ServiceClosed";
import {
  calculatePlanDates,
  isValidDeliveryTime,
  formatDateForDB,
  getDayName,
  formatDateForDisplay,
} from "@/utils/weekly-plan-dates";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface WeeklyPlanDay {
  date: Date;
  dayOfWeek: number;
  size: MarmitaSize | null;
  meat: MeatOption | null;
  items: Record<string, boolean>;
  delivery: DeliveryMethod;
  deliveryTime: string;
  payment: PaymentMethod;
  address?: Address;
  needsChange?: boolean;
  changeAmount?: string;
  whatsappLink?: string;
  dayTotal: number;
}

const PlanosSemanais = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { isOpen } = useDay();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);
  const [planDates] = useState<Date[]>(calculatePlanDates());
  const [days, setDays] = useState<WeeklyPlanDay[]>(() => {
    return planDates.map((date) => ({
      date,
      dayOfWeek: date.getDay(),
      size: null,
      meat: null,
      items: {},
      delivery: null,
      deliveryTime: "",
      payment: null,
      dayTotal: 0,
    }));
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const currentDay = days[currentDayIndex];
  const isLastDay = currentDayIndex === days.length - 1;
  const isFirstDay = currentDayIndex === 0;

  const dayKeyMap: Record<number, DayKey> = {
    0: "domingo",
    1: "segunda",
    2: "terca",
    3: "quarta",
    4: "quinta",
    5: "sexta",
    6: "sabado",
  };
  const currentDayKey = dayKeyMap[currentDay.dayOfWeek];
  const dayMenu = weeklyMenu[currentDayKey];

  useEffect(() => {
    if (Object.keys(currentDay.items).length === 0) {
      const initialItems: Record<string, boolean> = {};
      dayMenu.items.forEach((item) => {
        initialItems[item.id] = item.checked;
      });
      updateCurrentDay({ items: initialItems });
    }
  }, [currentDayIndex]);

  if (!isOpen) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header showBack title="Planos Semanais" />
        <main className="flex-1 flex flex-col mt-20">
          <ServiceClosed />
        </main>
      </div>
    );
  }

  const updateCurrentDay = (updates: Partial<WeeklyPlanDay>) => {
    setDays((prev) => {
      const updated = [...prev];
      updated[currentDayIndex] = { ...updated[currentDayIndex], ...updates };
      return updated;
    });
  };

  const toggleItem = (itemId: string) => {
    const isSaturday = currentDay.dayOfWeek === 6;
    const newItems = { ...currentDay.items };

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

  const scrollToBottom = () => {
    setTimeout(() => {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }, 100);
  };

  const calculateDayTotal = (day: WeeklyPlanDay): number => {
    if (!day.size || !day.meat) return 0;
    
    const extraCharge = calculateMeatExtra(day.size.id, day.meat);
    const deliveryFee = calculateDeliveryFee(day.delivery);
    return day.size.price + extraCharge + deliveryFee;
  };

  const isDayComplete = (day: WeeklyPlanDay): boolean => {
    return !!(
      day.size &&
      day.meat &&
      day.delivery &&
      day.deliveryTime &&
      isValidDeliveryTime(day.deliveryTime) &&
      day.payment &&
      (day.delivery === "balcao" || (day.address?.street && day.address?.number)) &&
      (day.payment !== "dinheiro" || day.needsChange === false || (day.needsChange && day.changeAmount))
    );
  };

  const isCurrentDayComplete = isDayComplete(currentDay);
  const allDaysComplete = days.every((d) => isDayComplete(d));

  const goToNextDay = () => {
    if (!isCurrentDayComplete) {
      toast.error("Complete todos os campos antes de avançar!");
      return;
    }

    const dayTotal = calculateDayTotal(currentDay);
    updateCurrentDay({ dayTotal });

    toast.success(`Dia ${currentDayIndex + 1} configurado!`);

    if (!isLastDay) {
      const nextIndex = currentDayIndex + 1;
      const nextDay = days[nextIndex];

      if (!nextDay.size && !nextDay.meat) {
        const nextDayKey = dayKeyMap[nextDay.dayOfWeek];
        const nextDayMenu = weeklyMenu[nextDayKey];
        const baseItems: Record<string, boolean> = {};
        nextDayMenu.items.forEach((item) => {
          baseItems[item.id] = item.checked;
        });

        const isMeatAvailable = currentDay.meat && nextDayMenu.meats.some((m) => m.id === currentDay.meat?.id);

        setDays((prev) => {
          const updated = [...prev];
          updated[nextIndex] = {
            ...updated[nextIndex],
            size: currentDay.size,
            meat: isMeatAvailable ? currentDay.meat : null,
            delivery: currentDay.delivery,
            deliveryTime: currentDay.deliveryTime,
            payment: currentDay.payment,
            address: currentDay.address,
            needsChange: currentDay.needsChange,
            changeAmount: currentDay.changeAmount,
            items: baseItems,
          };
          return updated;
        });
      }

      setCurrentDayIndex(nextIndex);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowSummary(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToPreviousDay = () => {
    if (showSummary) {
      setShowSummary(false);
      return;
    }
    
    if (!isFirstDay) {
      setCurrentDayIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const savePlan = async () => {
    if (!allDaysComplete) {
      toast.error("Configure todos os 7 dias antes de salvar!");
      return;
    }

    setSaving(true);

    try {
      const totalAmount = days.reduce((sum, day) => sum + calculateDayTotal(day), 0);
      const discountAmount = 5.0;
      const finalAmount = totalAmount - discountAmount;

      const daysWithLinks = days.map((day) => {
        const dayKey = dayKeyMap[day.dayOfWeek];
        const dayMenuForLink = weeklyMenu[dayKey];
        
        const addedItems = dayMenuForLink.items
          .filter((item) => day.items[item.id])
          .map((item) => item.name);

        const removedItems = dayMenuForLink.items
          .filter((item) => !day.items[item.id])
          .map((item) => item.name.split(" ")[0]);

        let finalAdded = [...addedItems];
        let finalRemoved = [...removedItems];
        let customMessage = "";

        if (day.dayOfWeek === 6) {
          const hasFeijaoPreto = day.items["feijao-preto"];
          const hasFeijaoCarioca = day.items["feijao-carioca"];

          if (hasFeijaoPreto) {
            finalAdded = finalAdded.filter((i) => i !== "Feijão carioca");
            finalRemoved = finalRemoved.filter((i) => i !== "Feijão");
            customMessage = "🫘 Feijão: Feijão preto";
          } else if (hasFeijaoCarioca) {
            finalAdded = finalAdded.filter((i) => i !== "Feijão preto com pernil de porco e calabresa");
            finalRemoved = finalRemoved.filter((i) => i !== "Feijão");
            customMessage = "🫘 Feijão: Feijão carioca";
          }
        }

        const extraCharge = calculateMeatExtra(day.size!.id, day.meat!);
        const deliveryFee = calculateDeliveryFee(day.delivery);
        const total = day.size!.price + extraCharge + deliveryFee;

        const whatsappLink = buildWhatsAppMessage({
          dayKey: dayKey,
          deliveryMethod: day.delivery!,
          address: day.address,
          paymentMethod: day.payment!,
          changeAmount: day.changeAmount,
          deliveryFee: deliveryFee,
          total: total,
          isWeeklyPlan: true,
          planDayDate: formatDateForDisplay(day.date),
          planDeliveryTime: day.deliveryTime,
          items: [{
            sizeName: day.size!.name,
            meatName: day.meat!.name,
            price: day.size!.price,
            qty: 1,
            extraCharge: extraCharge,
            addedItems: finalAdded,
            removedItems: finalRemoved,
            customMessage: customMessage,
          }],
        });

        return {
          ...day,
          whatsappLink,
          dayTotal: total,
        };
      });

      const planData = {
        userId: user?.id,
        planStartDate: formatDateForDB(planDates[0]),
        planEndDate: formatDateForDB(planDates[6]),
        totalAmount,
        discountAmount,
        finalAmount,
        days: daysWithLinks.map((day) => ({
          dayDate: formatDateForDB(day.date),
          dayOfWeek: day.dayOfWeek,
          size: day.size!.id,
          meat: day.meat!.id,
          items: day.items,
          deliveryMethod: day.delivery!,
          deliveryTime: day.deliveryTime,
          paymentMethod: day.payment!,
          address: day.address,
          needsChange: day.needsChange,
          changeAmount: day.changeAmount,
          whatsappLink: day.whatsappLink,
          dayTotal: day.dayTotal,
        })),
      };

      const res = await fetch("/api/weekly-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData),
      });

      if (!res.ok) {
        throw new Error("Erro ao salvar plano");
      }

      toast.success("Plano Semanal salvo com sucesso!");
      navigate("/", { state: { weeklyPlanConfigured: true } });
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar Plano Semanal");
    } finally {
      setSaving(false);
    }
  };

  if (showSummary) {
    return (
      <div className="min-h-screen flex flex-col bg-background pb-32">
        <Header showBack title="Planos Semanais" />
        <CustomToaster />

        <main className="flex-1 mt-20 px-4 py-6">
          <div className="container mx-auto max-w-3xl">
            <PlanSummary
              days={days.map((day) => ({
                date: day.date,
                size: day.size!.id,
                meat: day.meat!.name,
                deliveryMethod: day.delivery!,
                deliveryTime: day.deliveryTime,
                dayTotal: calculateDayTotal(day),
              }))}
              totalAmount={days.reduce((sum, day) => sum + calculateDayTotal(day), 0)}
              discountAmount={5.0}
              finalAmount={days.reduce((sum, day) => sum + calculateDayTotal(day), 0) - 5.0}
            />
          </div>
        </main>

        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-float z-40">
          <div className="container mx-auto max-w-3xl flex gap-3">
            <Button
              variant="outline"
              onClick={goToPreviousDay}
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Voltar
            </Button>
            <Button
              variant="whatsapp"
              onClick={savePlan}
              disabled={saving || !allDaysComplete}
              className="flex-1"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-2" />
                  Confirmar Plano
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-32">
      <Header showBack title="Planos Semanais" />
      <CustomToaster />

      <main className="flex-1 mt-20 px-4 py-6" ref={scrollContainerRef}>
        <div className="container mx-auto max-w-3xl space-y-6">
          <div className="flex items-center justify-between p-4 rounded-xl bg-primary/5 border border-primary/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Configurando</p>
                <p className="font-bold text-foreground">
                  Dia {currentDayIndex + 1} de 7
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{getDayName(currentDay.date)}</p>
              <p className="font-semibold text-primary">
                {formatDateForDisplay(currentDay.date)}
              </p>
            </div>
          </div>

          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentDayIndex + 1) / 7) * 100}%` }}
            />
          </div>

          <SizeSelector
            sizes={marmitaSizes}
            selectedSize={currentDay.size}
            onSelect={(size) => updateCurrentDay({ size })}
          />

          {currentDay.size && (
            <MeatSelector
              selectedMeat={currentDay.meat}
              meats={dayMenu.meats}
              onSelect={(meat) => updateCurrentDay({ meat })}
              selectedSize={currentDay.size}
            />
          )}

          {currentDay.size && currentDay.meat && (
            <ToppingsSelector
              items={dayMenu.items}
              checkedItems={currentDay.items}
              onToggle={toggleItem}
            />
          )}

          {currentDay.size && currentDay.meat && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Método de Entrega</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateCurrentDay({ delivery: "balcao" })}
                  className={`p-4 rounded-xl border-2 transition-all text-base font-medium ${
                    currentDay.delivery === "balcao"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  Balcão
                </button>
                <button
                  onClick={() => {
                    updateCurrentDay({ delivery: "entrega" });
                    scrollToBottom();
                  }}
                  className={`p-4 rounded-xl border-2 transition-all text-base font-medium ${
                    currentDay.delivery === "entrega"
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  Entrega
                </button>
              </div>

              {currentDay.delivery === "entrega" && (
                <div className="mt-4 space-y-3 animate-fade-in">
                  <div>
                    <Label htmlFor="street" className="text-sm">
                      Nome da rua
                    </Label>
                    <Input
                      id="street"
                      placeholder="Nome da rua..."
                      value={currentDay.address?.street || ""}
                      onChange={(e) =>
                        updateCurrentDay({
                          address: { ...currentDay.address, street: e.target.value, number: currentDay.address?.number || "" },
                        })
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
                      value={currentDay.address?.number || ""}
                      onChange={(e) =>
                        updateCurrentDay({
                          address: { ...currentDay.address, street: currentDay.address?.street || "", number: e.target.value },
                        })
                      }
                      className="mt-1.5 h-11 text-base"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {currentDay.delivery && (
            <DeliveryTimeSelector
              value={currentDay.deliveryTime}
              onChange={(time) => updateCurrentDay({ deliveryTime: time })}
              error={currentDay.deliveryTime !== "" && !isValidDeliveryTime(currentDay.deliveryTime)}
            />
          )}

          {currentDay.delivery && currentDay.deliveryTime && isValidDeliveryTime(currentDay.deliveryTime) && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">Forma de Pagamento</Label>
              <div className="space-y-3">
                <button
                  onClick={() => updateCurrentDay({ payment: "cartao" })}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    currentDay.payment === "cartao"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <span className="font-medium text-base">Cartão</span>
                </button>

                <button
                  onClick={() => {
                    updateCurrentDay({ payment: "pix" });
                    scrollToBottom();
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    currentDay.payment === "pix"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <span className="font-medium text-base">Pix</span>
                </button>

                <button
                  onClick={() => {
                    updateCurrentDay({ payment: "dinheiro" });
                    scrollToBottom();
                  }}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    currentDay.payment === "dinheiro"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <span className="font-medium text-base">Dinheiro</span>
                </button>
              </div>

              {currentDay.payment === "dinheiro" && (
                <div className="mt-4 space-y-3 animate-fade-in">
                  <p className="font-medium text-sm">Precisa de troco?</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        updateCurrentDay({ needsChange: true });
                        scrollToBottom();
                      }}
                      className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        currentDay.needsChange === true
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border"
                      }`}
                    >
                      Sim
                    </button>
                    <button
                      onClick={() => updateCurrentDay({ needsChange: false })}
                      className={`p-3 rounded-xl border-2 transition-all text-sm font-medium ${
                        currentDay.needsChange === false
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border"
                      }`}
                    >
                      Não
                    </button>
                  </div>
                  {currentDay.needsChange && (
                    <div className="animate-fade-in">
                      <Label htmlFor="change" className="text-sm">
                        Troco para quanto?
                      </Label>
                      <Input
                        id="change"
                        type="text"
                        inputMode="numeric"
                        placeholder="R$"
                        value={currentDay.changeAmount || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          updateCurrentDay({ changeAmount: value });
                        }}
                        className="mt-1.5 h-11 text-base"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-float z-40">
        <div className="container mx-auto max-w-3xl flex gap-3">
          {!isFirstDay && (
            <Button
              variant="outline"
              onClick={goToPreviousDay}
              className="flex-1"
            >
              <ChevronLeft className="w-5 h-5 mr-2" />
              Anterior
            </Button>
          )}
          <Button
            variant="warm"
            onClick={goToNextDay}
            disabled={!isCurrentDayComplete}
            className="flex-1"
          >
            {isLastDay ? (
              <>
                Ver Resumo
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            ) : (
              <>
                Próximo Dia
                <ChevronRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PlanosSemanais;
