import { MeatOption, MarmitaSize } from "@/data/menuData";
import { calculateMeatExtra } from "@/utils/order-calculations";

interface MeatSelectorProps {
  meats: MeatOption[];
  selectedMeat: MeatOption | null;
  selectedSize: MarmitaSize | null;
  onSelect: (meat: MeatOption) => void;
}

export function MeatSelector({ meats, selectedMeat, selectedSize, onSelect }: MeatSelectorProps) {
  return (
    <div className="space-y-2">
      {meats.map((meat) => {
        const extraCharge = calculateMeatExtra(selectedSize?.id, meat);
        const isSelected = selectedMeat?.id === meat.id;

        return (
          <button
            key={meat.id}
            onClick={() => onSelect(meat)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
              isSelected
                ? "border-primary bg-primary/5 shadow-soft"
                : "border-border bg-card hover:border-primary/50"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                isSelected ? "border-primary" : "border-muted-foreground"
              }`}
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-primary" />
              )}
            </div>
            <div className="flex-1">
              <span
                className={`font-semibold ${
                  extraCharge > 0 ? "text-primary" : "text-foreground"
                }`}
              >
                {meat.name}
              </span>
              {extraCharge > 0 && (
                <span className="ml-2 text-sm font-bold text-primary">
                  (+R$ {extraCharge.toFixed(2)})
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
