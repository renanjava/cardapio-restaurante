import { ShoppingCart, Phone, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { RESTAURANT_INFO } from '@/config';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { redirectToWhatsApp } from '@/utils/whatsapp-redirect';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
}

export function Header({ showBack, title }: HeaderProps) {
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
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14 md:h-16">
          <div className="flex items-center gap-3">
            {showBack ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="md:hidden"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            ) : null}
            
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-full gradient-warm flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-base md:text-lg">J</span>
              </div>
              <span className="font-display font-bold text-base md:text-xl text-foreground hidden sm:block">
                {title || RESTAURANT_INFO.name}
              </span>
            </Link>
          </div>

          {title && (
            <span className="font-display font-bold text-base text-foreground sm:hidden absolute left-1/2 -translate-x-1/2">
              {title}
            </span>
          )}

          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Início
            </Link>
            <Link
              to="/cardapio"
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                location.pathname === '/cardapio' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Cardápio
            </Link>
            <Link
              to="/carrinho"
              className={`text-sm font-semibold transition-colors hover:text-primary ${
                location.pathname === '/carrinho' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Carrinho
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleWhatsAppContact}
              className="hidden md:flex text-fresh-green hover:text-fresh-green/80"
            >
              <Phone className="h-5 w-5" />
            </Button>

            <Link to="/carrinho" className="hidden md:block">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
