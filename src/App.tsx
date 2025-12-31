import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import Index from "./pages/Index";
import Cardapio from "./pages/Cardapio";
import Carrinho from "./pages/Carrinho";
import NotFound from "./pages/NotFound";
import { DayProvider } from "./contexts/DayContext";
import { inject } from "@vercel/analytics";
import { ClerkProvider } from "@/lib/safe-auth";
import { ptBR } from "@clerk/localizations";
import { injectSpeedInsights } from "@vercel/speed-insights";
import PedidoInteligente from "./pages/PedidoInteligente";

const queryClient = new QueryClient();

inject();
injectSpeedInsights();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ClerkProvider localization={ptBR}>
      <DayProvider>
        <CartProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/cardapio" element={<Cardapio />} />
                <Route path="/carrinho" element={<Carrinho />} />
                <Route
                  path="/pedido-inteligente"
                  element={<PedidoInteligente />}
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </DayProvider>
    </ClerkProvider>
  </QueryClientProvider>
);

export default App;
