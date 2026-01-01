import { MarmitaSize } from "@/data/menuData";

interface SizeSelectorProps {
  sizes: MarmitaSize[];
  selectedSize: MarmitaSize | null;
  onSelect: (size: MarmitaSize) => void;
}

export function SizeSelector({ sizes, selectedSize, onSelect }: SizeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {sizes.map((size) => (
        <button
          key={size.id}
          onClick={() => onSelect(size)}
          className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
            selectedSize?.id === size.id
              ? "border-primary bg-primary/5 shadow-soft"
              : "border-border bg-card hover:border-primary/50"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="font-bold text-foreground">{size.name}</span>
              <p className="text-sm text-muted-foreground">{size.description}</p>
            </div>
            <span className="text-primary font-bold text-lg">
              R$ {size.price},00
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
