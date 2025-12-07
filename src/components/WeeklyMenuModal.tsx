import { X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { weeklyMenu, dayDisplayNames } from "@/data/menuData";
import { useDay } from "@/contexts/DayContext";

interface WeeklyMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WeeklyMenuModal({ isOpen, onClose }: WeeklyMenuModalProps) {
  const { dayKey } = useDay();

  if (!isOpen) return null;

  const days = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado"];

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-foreground/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-card rounded-t-3xl md:rounded-3xl w-full max-w-lg max-h-[85vh] overflow-hidden shadow-glow animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-card z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-warm flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground">
              Cardápio da Semana
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 overflow-y-auto max-h-[calc(85vh-80px)]">
          <div className="space-y-4">
            {days.map((day) => {
              const menu = weeklyMenu[day];
              const isToday = day === dayKey;

              return (
                <div
                  key={day}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    isToday
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-display font-bold text-foreground">
                      {dayDisplayNames[day]}
                    </h3>
                    {isToday && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
                        Hoje
                      </span>
                    )}
                  </div>

                  <div className="mb-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                      Acompanhamentos
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {menu.items.map((item) => (
                        <span
                          key={item.id}
                          className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                        >
                          {item.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">
                      Carnes
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {menu.meats.map((meat) => (
                        <span
                          key={meat.id}
                          className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-semibold"
                        >
                          {meat.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  {day === "sabado" && (
                    <p className="mt-2 text-xs text-muted-foreground italic">
                      * Apenas um tipo de feijão disponível
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-4 p-4 rounded-2xl bg-muted/50 border border-border text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Domingo:</strong> Fechado para descanso
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
