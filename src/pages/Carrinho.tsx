import { useState } from "react";
import { ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartItemCard } from "@/components/CartItemCard";
import { CheckoutModal } from "@/components/CheckoutModal";
import { MarmitaOrderForm } from "@/components/MarmitaOrderForm";
import { Button } from "@/components/ui/button";
import { useCart, CartItem } from "@/contexts/CartContext";

import { CustomToaster } from "@/components/CustomToaster";
import { useDay } from "@/contexts/DayContext";
import { ServiceClosed } from "@/components/ServiceClosed";

const Carrinho = () => {
  const { items, getTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [showCheckout, setShowCheckout] = useState(false);
  const handleEdit = (item: CartItem) => {
    navigate("/cardapio", { state: { editingItem: item } });
  };
  const { isOpen } = useDay();

  const total = getTotal();

  if (!isOpen) {
    return <ServiceClosed />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20 md:pb-0">
      <Header showBack title="Meu Carrinho" />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-4 md:py-6 max-w-2xl">
          {items.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-muted-foreground text-sm">
                {items.reduce((sum, item) => sum + item.quantidade, 0)} item(s)
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive/80"
                onClick={clearCart}
              >
                <Trash2 className="w-4 h-4" />
                Limpar
              </Button>
            </div>
          )}

          {items.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="font-display text-xl font-bold text-foreground mb-2">
                Seu carrinho está vazio
              </h2>
              <p className="text-muted-foreground mb-6 text-sm">
                Adicione marmitas deliciosas!
              </p>
              <Link to="/cardapio?size=mini">
                <Button variant="warm" size="lg">
                  Fazer um pedido
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-6">
                {items.map((item) => (
                  <CartItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-float z-40">
          <div className="container mx-auto max-w-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-primary">R$ {total},00</p>
              </div>
              <Button
                variant="warm"
                size="lg"
                onClick={() => setShowCheckout(true)}
                className="flex-1 max-w-xs"
              >
                Continuar
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />

      <CustomToaster />

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
      />


    </div>
  );
};

export default Carrinho;
