import { MenuItem } from "@/data/menuData";
import { Check } from "lucide-react";

interface ToppingsSelectorProps {
  items: MenuItem[];
  checkedItems: Record<string, boolean>;
  onToggle: (itemId: string) => void;
}

export function ToppingsSelector({ items, checkedItems, onToggle }: ToppingsSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => {
        const isChecked = checkedItems[item.id];

        return (
          <button
            key={item.id}
            onClick={() => onToggle(item.id)}
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
  );
}
