import {
  ShoppingCart,
  Home,
  UtensilsCrossed,
  MessageCircle,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

export function BottomNav() {
  const location = useLocation();
  const { getTotalQuantity } = useCart();
  const totalItems = getTotalQuantity();

  const navItems = [
    { href: "/", icon: Home, label: "Início" },
    { href: "/cardapio", icon: UtensilsCrossed, label: "Cardápio" },
    {
      href: "/carrinho",
      icon: ShoppingCart,
      label: "Carrinho",
      badge: totalItems,
    },
  ];

  return (
    <nav className="bottom-nav md:hidden z-30">
      <div className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all relative ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <div className="relative">
                <item.icon
                  className={`w-6 h-6 ${isActive ? "animate-bounce-in" : ""}`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
