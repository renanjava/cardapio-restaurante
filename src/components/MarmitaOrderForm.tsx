import { useState } from "react";
import {
  ShoppingCart,
  AlertCircle,
  Ban,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/contexts/CartContext";
import {
  marmitaSizes,
  weeklyMenu,
  MarmitaSize,
  MeatOption,
} from "@/data/menuData";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { WeeklyMenuModal } from "./WeeklyMenuModal";
import { useDay } from "@/contexts/DayContext";
import { CustomToaster } from "./CustomToaster";
import { SizeSelector } from "@/components/order/SizeSelector";
import { MeatSelector } from "@/components/order/MeatSelector";
import { ToppingsSelector } from "@/components/order/ToppingsSelector";
import { calculateMeatExtra } from "@/utils/order-calculations";

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

  const toggleItem = (itemId: string) => {
    if (isSaturday) {
      if (itemId === "feijao-preto" || itemId === "feijao-carioca") {
        const otherId =
          itemId === "feijao-preto" ? "feijao-carioca" : "feijao-preto";
        setCheckedItems((prev) => ({
          ...prev,
          [itemId]: !prev[itemId],
          [otherId]: prev[itemId] ? prev[otherId] : false,
        }));
        return;
      }
    }
    setCheckedItems((prev) => ({ ...prev, [itemId]: !prev[itemId] }));
  };

  const extraCharge = calculateMeatExtra(selectedSize?.id, selectedMeat);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Por favor, selecione o tamanho da marmita");
      return;
    }

    if (!selectedMeat) {
      toast.error("Por favor, escolha a carne antes de continuar");
      return;
    }

    let addedItems = dayMenu.items
      .filter((item) => checkedItems[item.id])
      .map((item) => item.name);

    let removedItems = dayMenu.items
      .filter((item) => !checkedItems[item.id])
      .map((item) => item.name);

    if (isSaturday) {
      const hasFeijaoPreto = checkedItems["feijao-preto"];
      const hasFeijaoCarioca = checkedItems["feijao-carioca"];

      if (hasFeijaoPreto) {
        addedItems = addedItems.filter((item) => item !== "Feijão carioca");
        removedItems = removedItems.filter((item) => item !== "Feijão carioca");
      }

      if (hasFeijaoCarioca) {
        addedItems = addedItems.filter(
          (item) => item !== "Feijão preto com pernil de porco e calabresa"
        );
        removedItems = removedItems.filter(
          (item) => item !== "Feijão preto com pernil de porco e calabresa"
        );
      }
    }

    const cartData = {
      tamanhoMarmita: selectedSize.name,
      preco: selectedSize.price,
      carne: selectedMeat.name,
      adicionarItens: addedItems,
      removerItens: removedItems,
      quantidade: editingItem?.quantidade || 1,
      extraCharge: extraCharge,
    };

    if (editingItem) {
      updateItem(editingItem.id, cartData);
      toast.success("Pedido atualizado!");
      onComplete?.();
    } else {
      addItem(cartData);
      toast.success("Marmita adicionada ao carrinho!");
      navigate("/carrinho");
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
    ? selectedSize.price + extraCharge
    : 0;

  return (
    <>
      <div className="flex-1 overflow-y-auto pb-32 md:pb-8">
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-2xl">
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

            <div className="space-y-2 mb-4">
              {isSaturday && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-primary/10 border border-primary/20 text-sm">
                  <AlertCircle className="w-4 h-4 text-primary shrink-0" />
                  <span>
                    Aos sábados, as entregas custam <strong>R$ 2,00</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="font-display text-lg font-bold mb-3 text-foreground">
              Escolha o Tamanho
            </h3>
            <SizeSelector 
                sizes={marmitaSizes} 
                selectedSize={selectedSize} 
                onSelect={setSelectedSize} 
            />
          </div>

          <div className="mb-6">
            <h3 className="font-display text-lg font-bold mb-3 text-foreground">
              Escolha os Acompanhamentos
            </h3>
            <ToppingsSelector 
                items={dayMenu.items}
                checkedItems={checkedItems}
                onToggle={toggleItem}
            />
          </div>

          <div className="mb-6">
            <h3 className="font-display text-lg font-bold mb-3 text-foreground">
              Escolha a Carne
            </h3>
            <MeatSelector 
                meats={dayMenu.meats}
                selectedMeat={selectedMeat}
                selectedSize={selectedSize}
                onSelect={setSelectedMeat}
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-float z-40">
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
              className="flex-1 max-w-xs"
            >
              <ShoppingCart className="w-5 h-5" />
              {editingItem ? "Atualizar" : "Adicionar"}
            </Button>
          </div>
        </div>
      </div>

      <WeeklyMenuModal
        isOpen={showWeeklyMenu}
        onClose={() => setShowWeeklyMenu(false)}
      />

      <CustomToaster />
    </>
  );
}
