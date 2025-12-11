import { Clock, MapPin, Phone, Truck } from "lucide-react";
import { restaurantInfo } from "@/data/menuData";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-auto hidden md:block">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">
                  J
                </span>
              </div>
              <span className="font-display font-bold text-xl text-foreground">
                {restaurantInfo.name}
              </span>
            </div>
            <p className="text-muted-foreground text-sm">
              Comida caseira feita com carinho e ingredientes frescos todos os
              dias.
            </p>
          </div>

          <div>
            <h4 className="flex items-center gap-2 font-display font-bold text-foreground mb-4">
              <Clock className="w-5 h-5 text-primary" />
              Horários
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <strong>Marmitas:</strong>{" "}
                {restaurantInfo.openingHours.marmitas}
              </li>
              <li>
                <strong>Lanches:</strong> {restaurantInfo.openingHours.lanches}
              </li>
              <li className="text-destructive">
                {restaurantInfo.openingHours.sunday}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="flex items-center gap-2 font-display font-bold text-foreground mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              Contato
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{restaurantInfo.address}</li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <a
                  href={`https://wa.me/${restaurantInfo.phone}`}
                  className="text-fresh-green hover:underline font-semibold"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center gap-2 mt-2">
                <Truck className="w-4 h-4" />
                <span>Taxa de entrega aos sábados: R$ 2,00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {restaurantInfo.name}
          </p>
          <p className="text-xs text-muted-foreground">
            Desenvolvido por{" "}
            <span className="font-medium text-foreground">
              Renan Geraldini Leão
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
