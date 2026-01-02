import { ArrowLeft, Utensils } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { RESTAURANT_INFO } from '@/config';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { redirectToWhatsApp } from '@/utils/whatsapp-redirect';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  hideLogo?: boolean;
}

export function Header({ showBack, title, hideLogo }: HeaderProps) {
  const { getTotalQuantity } = useCart();
  const location = useLocation();
  const navigate = useNavigate();
  const totalItems = getTotalQuantity();

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent('Oi, gostaria de fazer um pedido');
    const url = `https://wa.me/${RESTAURANT_INFO.phone}?text=${message}`
    redirectToWhatsApp(url);
  };

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
      <div className="container mx-auto px-4 relative flex items-center justify-between h-14 md:h-16">
        <div className="flex items-center min-w-[40px]">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
          )}
        </div>
        
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center">
          <Link to="/" className="flex items-center gap-2">
            {!hideLogo && (
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full gradient-warm flex items-center justify-center shadow-soft ring-2 ring-background shrink-0">
                <Utensils className="w-4 h-4 md:w-6 h-6 text-primary-foreground" />
              </div>
            )}
            <span className="font-display font-bold text-2xl md:text-3xl shimmer-primary whitespace-nowrap">
              {title || RESTAURANT_INFO.name}
            </span>
          </Link>
        </div>

        <div className="flex items-center min-w-[40px] justify-end">
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                location.pathname === "/" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Início
            </Link>
            <Link
              to="/cardapio"
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                location.pathname === "/cardapio" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Cardápio
            </Link>
            <Link
              to="/carrinho"
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                location.pathname === "/carrinho" ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Carrinho
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
