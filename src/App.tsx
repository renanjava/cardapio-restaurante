import { Toaster } from "@/components/ui/toaster";
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

const queryClient = new QueryClient();

inject();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DayProvider>
      <CartProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/cardapio" element={<Cardapio />} />
              <Route path="/carrinho" element={<Carrinho />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </DayProvider>
  </QueryClientProvider>
);

export default App;
