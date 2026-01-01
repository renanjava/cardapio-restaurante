import {
  Clock,
  MapPin,
  Truck,
  ChevronRight,
  Sandwich,
  Package,
  Sparkles,
  X,
  Loader2,
  Zap,
  CalendarCheck,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomNav } from "@/components/BottomNav";
import { marmitaSizes, restaurantInfo, dayDisplayNames } from "@/data/menuData";
import { useDay } from "@/contexts/DayContext";
import {
  UserButton,
  SignInButton,
  SignedOut,
  SignedIn,
  useUser,
} from "@/lib/safe-auth";
import { useEffect, useState } from "react";

const Index = () => {
  const { dayKey, isSunday, isOpen } = useDay();
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  const [showModalNotSignedIn, setShowModalNotSignedIn] = useState(false);
  const [showModalExplanation, setShowModalExplanation] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const intelligentOrderEnabled = import.meta.env.VITE_ENABLE_INTELLIGENT_ORDER === "true";

  const [showModalSuccess, setShowModalSuccess] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.state?.intelligentOrderConfigured) {
      setShowModalSuccess(true);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handlePedidoInteligente = async () => {
    if (!intelligentOrderEnabled) return;
    
    if (!isSignedIn) {
      setShowModalNotSignedIn(true);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/intelligent-order?userId=${user?.id}`);
      const data = await response.json();

      if (data.orders && Object.keys(data.orders).length > 0) {
        const currentDayKey = new Date().getDay();
        const whatsappLink = data.orders[currentDayKey];

        if (whatsappLink) {
          window.open(whatsappLink, "_blank");
        } else {
          setShowModalExplanation(true);
        }
      } else {
        setShowModalExplanation(true);
      }
    } catch (error) {
      console.error("Erro ao buscar pedido inteligente:", error);
      setShowModalExplanation(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background pb-20 md:pb-0">
      <Header />

      {showModalNotSignedIn && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg">
                  Pedido Inteligente
                </h3>
              </div>
              <button
                onClick={() => setShowModalNotSignedIn(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                O{" "}
                <strong className="text-foreground">Pedido Inteligente</strong>{" "}
                permite que você configure suas marmitas personalizadas para
                cada dia da semana. Ao clicar no botão, seu pedido será enviado
                automaticamente via WhatsApp!
              </p>

              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Benefícios:</strong>
                </p>
                <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Pedido com apenas 1 clique</li>
                  <li>Configure uma vez, use sempre</li>
                  <li>Economize tempo todos os dias</li>
                </ul>
              </div>

              <p className="text-sm text-muted-foreground">
                Para usar essa funcionalidade, você precisa fazer login.
              </p>

              <div className="flex gap-3">
                <SignInButton mode="modal">
                  <button className="flex-1 inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground shadow-soft transition hover:opacity-90">
                    Fazer Login
                  </button>
                </SignInButton>
                <button
                  onClick={() => {
                    setShowModalNotSignedIn(false);
                    navigate("/cardapio");
                  }}
                  className="flex-1 inline-flex items-center justify-center rounded-xl border border-primary px-4 py-3 font-bold text-primary transition hover:bg-primary/10"
                >
                  Pedido Normal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModalExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground text-lg">
                  Configure seu Pedido Inteligente
                </h3>
              </div>
              <button
                onClick={() => setShowModalExplanation(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Você ainda não configurou seus pedidos automáticos. Configure
                agora para começar a fazer pedidos com apenas 1 clique!
              </p>

              <div className="bg-muted/50 rounded-xl p-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Como funciona:</strong>
                </p>
                <ol className="text-xs text-muted-foreground space-y-1 ml-4 list-decimal">
                  <li>Personalize sua marmita para cada dia</li>
                  <li>Salve suas preferências</li>
                  <li>Faça pedidos automáticos com 1 clique!</li>
                </ol>
              </div>

              <button
                onClick={() => {
                  setShowModalExplanation(false);
                  navigate("/pedido-inteligente");
                }}
                className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground shadow-soft transition hover:opacity-90"
              >
                Continuar para Configuração
              </button>
            </div>
          </div>
        </div>
      )}

      {showModalSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
             <div className="flex flex-col items-center text-center space-y-4">
                 <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-green-600 dark:text-green-400" />
                 </div>
                 
                 <h2 className="font-display text-2xl font-bold text-foreground">
                     Configuração Concluída!
                 </h2>
                 
                 <p className="text-muted-foreground">
                     Seu Pedido Inteligente foi salvo com sucesso.
                 </p>
                 
                 <div className="bg-muted/50 rounded-xl p-4 text-sm">
                     <p className="text-foreground font-medium mb-1">Como usar:</p>
                     <p className="text-muted-foreground">
                         Agora, basta clicar no botão <strong>"Pedido Inteligente"</strong> aqui na tela inicial sempre que quiser fazer seu pedido do dia!
                     </p>
                 </div>
                 
                 <button
                   onClick={() => setShowModalSuccess(false)}
                   className="w-full inline-flex items-center justify-center rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground shadow-soft transition hover:opacity-90 mt-2"
                 >
                   Entendi
                 </button>
             </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="/images/hero-bg.png"
              alt="Imagem de uma marmita com frango a parmegiana"
              className="w-full h-full object-cover object-[center_63%] md:object-center"
            />
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 gradient-hero mix-blend-multiply opacity-70" />
          </div>

          <div className="relative container mx-auto px-4 py-10 md:py-16">
            <div className="max-w-lg animate-fade-in">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 backdrop-blur-sm">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSunday ? "bg-destructive" : "bg-accent"
                    } animate-pulse`}
                  />
                  <span className="text-sm text-primary-foreground/90 font-medium">
                    {isSunday ? "Fechado hoje" : dayDisplayNames[dayKey]}
                  </span>
                </div>

                <div
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-sm border ${
                    isOpen
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-50"
                      : "bg-red-500/20 border-red-500/30 text-red-50"
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full animate-pulse ${
                      isOpen ? "bg-emerald-400" : "bg-red-400"
                    }`}
                  />
                  <span className="text-sm font-medium">
                    {isOpen ? "Aberto agora" : "Fechado"}
                  </span>
                </div>
              </div>

              <h1 className="font-display text-3xl md:text-5xl font-bold text-primary-foreground mb-4 leading-tight">
                Restaurante da Juliana
                <br />
                <span className="text-[hsl(42_95%_55%)]">comida caseira</span>
              </h1>

              <p className="text-primary-foreground/80 mb-6 text-sm md:text-base">
                Marmitas, lanches e combos fresquinhos. Faça seu pedido!
              </p>

              {intelligentOrderEnabled && (
                <SignedIn>
                  <div className="flex items-center gap-3 mb-4 bg-primary-foreground/10 backdrop-blur-sm rounded-xl px-4 py-3">
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-10 h-10",
                        },
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm text-primary-foreground/70">Olá,</p>
                      <p className="font-bold text-primary-foreground">
                        {user?.firstName || user?.username || "Usuário"}
                      </p>
                    </div>
                  </div>
                </SignedIn>
              )}

              {intelligentOrderEnabled && (
                <SignedOut>
                  <SignInButton mode="modal">
                    <button className="inline-flex items-center justify-center rounded-xl border border-primary-foreground/30 px-6 py-3 font-bold text-primary-foreground shadow-soft transition hover:bg-primary-foreground/10 mb-6">
                      Fazer Login
                    </button>
                  </SignInButton>
                </SignedOut>
              )}

              <div className="flex gap-4 text-xs md:text-sm text-primary-foreground/80">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>07:00 - 14:00</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>Itambé-PR</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
              Funcionalidades
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handlePedidoInteligente}
              disabled={isLoading || !intelligentOrderEnabled}
              className={`bg-card rounded-2xl p-4 shadow-soft text-left relative overflow-hidden disabled:opacity-50 ${
                intelligentOrderEnabled ? "card-hover" : "opacity-50 pointer-events-none"
              }`}
            >
              <div className="absolute top-2 right-2">
                {intelligentOrderEnabled ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                    <Zap className="w-3 h-3" />
                    NOVO
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold">
                    EM BREVE
                  </span>
                )}
              </div>
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  intelligentOrderEnabled
                    ? "bg-gradient-to-br from-primary/20 to-primary/5"
                    : "bg-muted"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                ) : (
                  <Sparkles
                    className={`w-6 h-6 ${
                      intelligentOrderEnabled ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                )}
              </div>
              <h3 className="font-display font-bold text-foreground text-sm">
                Pedido Inteligente
              </h3>
              <p className="text-xs text-muted-foreground">
                Configure e peça com 1 clique
              </p>
            </button>

            <div className="bg-card rounded-2xl p-4 shadow-soft opacity-50 relative">
              <div className="absolute top-2 right-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold">
                  EM BREVE
                </span>
              </div>
              <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-3">
                <CalendarCheck className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="font-display font-bold text-foreground text-sm">
                Planos Semanais
              </h3>
              <p className="text-xs text-muted-foreground">
                Economize com pacotes
              </p>
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
                  <strong className="text-foreground">Marmitas:</strong>{" "}
                  {restaurantInfo.openingHours.marmitas}
                </p>
                <p>
                  <strong className="text-foreground">Lanches:</strong>{" "}
                  {restaurantInfo.openingHours.lanches}
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
                  <strong className="text-foreground">Marmitas:</strong> taxa de
                  entrega R$ 2,00
                </p>
              </div>
            </div>

            <div className="bg-card rounded-2xl p-4 shadow-soft md:hidden">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <h3 className="font-display font-bold text-foreground">
                  Endereço
                </h3>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{restaurantInfo.address}</p>
                <p className="text-xs text-destructive font-medium">
                  *Indisponível aos domingos*
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-4 pb-8 md:hidden">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Desenvolvido por{" "}
              <span className="font-medium text-foreground">
                Renan Geraldini Leão
              </span>
            </p>
          </div>
        </section>
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
};

export default Index;
