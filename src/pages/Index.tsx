import {
  Clock,
  MapPin,
  Phone,
  Truck,
  ChevronRight,
  UtensilsCrossed,
  Sandwich,
  Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import {
  marmitaSizes,
  restaurantInfo,
  dayNames,
  dayDisplayNames,
} from "@/data/menuData";
import { useDay } from "@/contexts/DayContext";

const Index = () => {
  const { dayKey, isSunday } = useDay();

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20 md:pb-0">
      <Header />

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 gradient-hero" />

          <div className="relative container mx-auto px-4 py-10 md:py-16">
            <div className="max-w-lg animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm mb-4">
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSunday ? "bg-destructive" : "bg-accent"
                  } animate-pulse`}
                />
                <span className="text-sm text-primary-foreground/90 font-medium">
                  {isSunday ? "Fechado hoje" : dayDisplayNames[dayKey]}
                </span>
              </div>

              <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
                Comida caseira
                <br />
                <span className="text-[hsl(42_95%_55%)]">feita com amor</span>
              </h1>

              <p className="text-primary-foreground/80 mb-6 text-sm md:text-base">
                Marmitas, lanches e combos fresquinhos. Faça seu pedido e receba
                pelo WhatsApp!
              </p>

              <div className="flex gap-4 text-xs md:text-sm text-primary-foreground/80">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>10:30 - 14:00</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Itambé-PR</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-6 md:py-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
              Marmitas
            </h2>
          </div>

          <div className="space-y-3">
            {marmitaSizes.map((size, index) => (
              <Link
                key={size.id}
                to={isSunday ? "#" : `/cardapio?size=${size.id}`}
                className={`block animate-fade-in ${
                  isSunday ? "pointer-events-none opacity-50" : ""
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="bg-card rounded-2xl p-4 shadow-soft flex items-center gap-4 card-hover">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                    <span className="text-3xl">🍱</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-foreground">
                      {size.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {size.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-primary text-lg">
                      R$ {size.price},00
                    </p>
                    {!isSunday && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto" />
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
              Mais opções
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card rounded-2xl p-4 shadow-soft opacity-50">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                <Sandwich className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-display font-bold text-foreground text-sm">
                Lanches
              </h3>
              <p className="text-xs text-muted-foreground">Em breve</p>
            </div>

            <div className="bg-card rounded-2xl p-4 shadow-soft opacity-50">
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                <Package className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-display font-bold text-foreground text-sm">
                Combos
              </h3>
              <p className="text-xs text-muted-foreground">Em breve</p>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-6">
          <div className="space-y-4">
            <div className="bg-card rounded-2xl p-4 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground">
                  Horários
                </h3>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Marmitas:</strong> Seg a
                  Sáb, 10:30 - 14:00
                </p>
                <p>
                  <strong className="text-foreground">Lanches:</strong> Seg a
                  Sáb, 10:30 - 18:00
                </p>
                <p className="text-xs italic">
                  *Quinta os lanches encerram às 14:00*
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 shadow-soft">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-bold text-foreground">
                  Delivery
                </h3>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">Marmitas:</strong> Sem
                  taxa de entrega
                </p>
                <p className="text-xs text-primary font-medium">
                  *Sábado há taxa de R$ 2,00*
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
