import { Clock, Phone } from "lucide-react";
import { Button } from "./ui/button";

export const ServiceClosed = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4 text-center animate-fade-in">
      <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mb-8">
        <Clock className="w-12 h-12 text-muted-foreground" />
      </div>

      <h1 className="font-display text-3xl font-bold mb-4">
        Atendimento Encerrado
      </h1>

      <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
        Nosso horário de funcionamento é das <span className="font-semibold text-primary">07:00</span> às <span className="font-semibold text-primary">14:00</span>.
        <br />
        Por favor, retorne durante este período para fazer seu pedido.
      </p>

      <div className="flex gap-4">
        <Button variant="outline" className="gap-2" asChild>
          <a href="tel:+5544988129535">
            <Phone className="w-4 h-4" />
            Fale Conosco
          </a>
        </Button>
      </div>
    </div>
  );
};
