import { Plus, Minus, Trash2, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem, useCart } from '@/contexts/CartContext';

interface CartItemCardProps {
  item: CartItem;
  onEdit: (item: CartItem) => void;
}

export function CartItemCard({ item, onEdit }: CartItemCardProps) {
  const { updateQuantity, removeItem, getItemSubtotal } = useCart();
  const subtotal = getItemSubtotal(item);

  return (
    <div className="bg-card rounded-2xl p-4 shadow-soft animate-fade-in">
      <div className="flex gap-3">
        {/* Image placeholder */}
        <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
          <span className="text-3xl">🍱</span>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-bold text-foreground text-base">
              {item.tamanhoMarmita}
            </h3>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                onClick={() => onEdit(item)}
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive/80"
                onClick={() => removeItem(item.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-sm text-primary font-semibold">{item.carne}</p>
          
          {item.adicionarItens.length > 0 && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {item.adicionarItens.join(', ')}
            </p>
          )}
          
          {item.removerItens.length > 0 && (
            <p className="text-xs text-destructive/70 mt-0.5">
              Sem: {item.removerItens.join(', ')}
            </p>
          )}

          <div className="flex items-center justify-between mt-3">
            {/* Quantity */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateQuantity(item.id, -1)}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span className="w-6 text-center font-bold text-foreground">{item.quantidade}</span>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => updateQuantity(item.id, 1)}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="font-bold text-primary">R$ {subtotal},00</p>
              {item.extraCharge > 0 && (
                <p className="text-xs text-muted-foreground">+R$ {item.extraCharge} extra</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
