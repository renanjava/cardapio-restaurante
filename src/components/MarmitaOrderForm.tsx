import { useState, useEffect } from "react";
import {
  Check,
  ShoppingCart,
  AlertCircle,
  Ban,
  Calendar,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart, CartItem } from "@/contexts/CartContext";
import {
  marmitaSizes,
  weeklyMenu,
  dayNames,
  dayDisplayNames,
  MarmitaSize,
  MeatOption,
} from "@/data/menuData";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { WeeklyMenuModal } from "./WeeklyMenuModal";
import { useDay } from "@/contexts/DayContext";

interface MarmitaOrderFormProps {
  editingItem?: CartItem;
  onComplete?: () => void;
}

export function MarmitaOrderForm({
  editingItem,
  onComplete,
}: MarmitaOrderFormProps) {
  const { addItem, updateItem } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { dayKey, isSunday, isSaturday } = useDay();
  const dayMenu = weeklyMenu[dayKey];

  // Get size from URL params or editing item
  const sizeFromUrl = searchParams.get("size");
  const initialSize = editingItem
    ? marmitaSizes.find((s) => s.name === editingItem.tamanhoMarmita)
    : sizeFromUrl
    ? marmitaSizes.find((s) => s.id === sizeFromUrl)
    : null;

  const [selectedSize, setSelectedSize] = useState<MarmitaSize | null>(
    initialSize || null
  );
  const [selectedMeat, setSelectedMeat] = useState<MeatOption | null>(
    editingItem
      ? dayMenu.meats.find((m) => m.name === editingItem.carne) || null
      : null
  );
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>(
    () => {
      if (editingItem) {
        const checked: Record<string, boolean> = {};
        dayMenu.items.forEach((item) => {
          checked[item.id] = editingItem.adicionarItens.includes(item.name);
        });
        return checked;
      }
      const initial: Record<string, boolean> = {};
      dayMenu.items.forEach((item) => {
        initial[item.id] = item.checked;
      });
      return initial;
    }
  );

  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);
  const [showAddedModal, setShowAddedModal] = useState(false);

  // Handle Saturday bean restriction
  const toggleItem = (itemId: string) => {
    if (isSaturday && dayMenu.beansOnlyOne) {
      if (itemId === "feijao-preto" || itemId === "feijao-carioca") {
        const otherId =
          itemId === "feijao-preto" ? "feijao-carioca" : "feijao-preto";
        setCheckedItems((prev) => ({
          ...prev,
          [itemId]: !prev[itemId],
          [otherId]: prev[itemId] ? prev[otherId] : false, // If turning on this one, turn off the other
        }));
        return;
      }
    }
    setCheckedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const calculateExtraCharge = () => {
    if (!selectedSize || !selectedMeat) return 0;
    if (
      selectedSize.id === "mini" &&
      selectedMeat.extraForMini &&
      selectedMeat.extraPrice
    ) {
      return selectedMeat.extraPrice;
    }
    return 0;
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedMeat) {
      toast.error("Selecione o tamanho e a carne");
      return;
    }

    const addedItems = dayMenu.items
      .filter((item) => checkedItems[item.id])
      .map((item) => item.name);

    const removedItems = dayMenu.items
      .filter((item) => !checkedItems[item.id])
      .map((item) => item.name);

    const cartData = {
      tamanhoMarmita: selectedSize.name,
      preco: selectedSize.price,
      carne: selectedMeat.name,
      adicionarItens: addedItems,
      removerItens: removedItems,
      quantidade: editingItem?.quantidade || 1,
      extraCharge: calculateExtraCharge(),
    };

    if (editingItem) {
      updateItem(editingItem.id, cartData);
      toast.success("Pedido atualizado!");
      onComplete?.();
    } else {
      addItem(cartData);
      setShowAddedModal(true);
    }
  };

  if (isSunday) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center py-12 px-6 bg-card rounded-3xl shadow-soft max-w-sm animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Ban className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">
            Fechado aos Domingos
          </h3>
          <p className="text-muted-foreground">
            Voltamos na segunda-feira com um cardápio delicioso!
          </p>
        </div>
      </div>
    );
  }

  const totalPrice = selectedSize
    ? selectedSize.price + calculateExtraCharge()
    : 0;

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-32 md:pb-8">
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-2xl">
          {/* Header info */}
          <div className="mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowWeeklyMenu(true)}
              className="mb-4 w-full md:w-auto"
            >
              <Calendar className="w-4 h-4" />
              Ver cardápio da semana
            </Button>

            {/* Notices */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 text-sm">
                <Info className="w-4 h-4 text-primary shrink-0" />
                <span>Remova ou selecione os itens e escolha a carne</span>
              </div>
              {isSaturday && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm">
                  <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    Aos sábados, escolha apenas{" "}
                    <strong>um tipo de feijão</strong> e entregas custam{" "}
                    <strong>R$ 2,00</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <h3 className="font-display text-lg font-bold mb-3 text-foreground">
              Escolha o Tamanho
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {marmitaSizes.map((size) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    selectedSize?.id === size.id
                      ? "border-primary bg-primary/5 shadow-soft"
                      : "border-border bg-card hover:border-primary/50"
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

          {/* Menu Items */}
          <div className="mb-6">
            <h3 className="font-display text-lg font-bold mb-3 text-foreground">
              Cardápio de {dayDisplayNames[dayKey]}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {dayMenu.items.map((item) => {
                const isChecked = checkedItems[item.id];

                return (
                  <button
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 text-left ${
                      isChecked
                        ? "border-primary bg-primary/5"
                        : "border-border bg-card opacity-60"
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
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

          {/* Meat Selection */}
          <div className="mb-6">
            <h3 className="font-display text-lg font-bold mb-3 text-foreground">
              Escolha a Carne
            </h3>
            <div className="space-y-2">
              {dayMenu.meats.map((meat) => {
                const showExtra =
                  meat.extraForMini &&
                  meat.extraPrice &&
                  selectedSize?.id === "mini";
                const isSelected = selectedMeat?.id === meat.id;

                return (
                  <button
                    key={meat.id}
                    onClick={() => setSelectedMeat(meat)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                      isSelected
                        ? "border-primary bg-primary/5 shadow-soft"
                        : "border-border bg-card hover:border-primary/50"
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
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div className="fixed bottom-16 md:bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-float z-30">
        <div className="container mx-auto max-w-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-primary">
                R$ {totalPrice},00
              </p>
            </div>
            <Button
              variant="warm"
              size="lg"
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedMeat}
              className="flex-1 max-w-xs"
            >
              <ShoppingCart className="w-5 h-5" />
              {editingItem ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Weekly Menu Modal */}
      <WeeklyMenuModal
        isOpen={showWeeklyMenu}
        onClose={() => setShowWeeklyMenu(false)}
      />

      {/* Added to Cart Modal */}
      {showAddedModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-3xl p-6 max-w-sm w-full shadow-glow animate-scale-in text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
              <Check className="w-8 h-8 text-accent" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              Item adicionado ao carrinho!
            </h2>
            <p className="text-muted-foreground mb-6">
              Deseja ir para o carrinho ou continuar adicionando itens?
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="warm"
                size="lg"
                onClick={() => navigate("/carrinho")}
                className="w-full"
              >
                <ShoppingCart className="w-5 h-5" />
                Ir para o carrinho
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setShowAddedModal(false);
                  navigate("/");
                }}
                className="w-full"
              >
                Continuar adicionando
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
