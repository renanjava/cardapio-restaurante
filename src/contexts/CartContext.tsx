import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useDay } from "./DayContext";

export interface CartItem {
  id: string;
  tamanhoMarmita: string;
  preco: number;
  carne: string;
  adicionarItens: string[];
  removerItens: string[];
  quantidade: number;
  extraCharge: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  updateItem: (id: string, item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalQuantity: () => number;
  getItemSubtotal: (item: CartItem) => number;
}

interface CartStorage {
  dayKey: string;
  items: CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "pedidos";

export function CartProvider({ children }: { children: ReactNode }) {
  const { dayKey } = useDay();
  const [items, setItems] = useState<CartItem[]>([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && dayKey && !initialized) {
      const saved = localStorage.getItem(CART_STORAGE_KEY);

      if (saved) {
        try {
          const cartStorage: CartStorage = JSON.parse(saved);

          if (cartStorage.dayKey !== dayKey) {
            setItems([]);
            localStorage.setItem(
              CART_STORAGE_KEY,
              JSON.stringify({
                dayKey,
                items: [],
              })
            );
          } else {
            setItems(cartStorage.items || []);
          }
        } catch (error) {
          console.error("Erro ao carregar carrinho:", error);
          setItems([]);
        }
      }

      setInitialized(true);
    }
  }, [dayKey, initialized]);

  useEffect(() => {
    if (initialized && dayKey) {
      const cartStorage: CartStorage = {
        dayKey,
        items,
      };
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartStorage));
    }
  }, [items, dayKey, initialized]);

  const addItem = (item: Omit<CartItem, "id">) => {
    const newItem: CartItem = {
      ...item,
      id: Date.now().toString(),
    };
    setItems((prev) => [...prev, newItem]);
  };

  const updateItem = (id: string, updates: Omit<CartItem, "id">) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...updates, id } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setItems(
      (prev) =>
        prev
          .map((item) => {
            if (item.id === id) {
              const newQty = item.quantidade + delta;
              if (newQty <= 0) return null;
              return { ...item, quantidade: newQty };
            }
            return item;
          })
          .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getItemSubtotal = (item: CartItem) => {
    return (item.preco + item.extraCharge) * item.quantidade;
  };

  const getTotal = () => {
    return items.reduce((total, item) => total + getItemSubtotal(item), 0);
  };

  const getTotalQuantity = () => {
    return items.reduce((sum, item) => sum + item.quantidade, 0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getTotalQuantity,
        getItemSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
