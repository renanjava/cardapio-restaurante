import { CalendarDays, MapPin, Clock, CreditCard, Package } from "lucide-react";
import { formatDateForDisplay, getDayName } from "@/utils/weekly-plan-dates";
import { marmitaSizes } from "@/data/menuData";

interface PlanDay {
  date: Date;
  size: string;
  meat: string;
  deliveryMethod: string;
  deliveryTime: string;
  dayTotal: number;
}

interface PlanSummaryProps {
  days: PlanDay[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
}

export function PlanSummary({
  days,
  totalAmount,
  discountAmount,
  finalAmount,
}: PlanSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b">
        <CalendarDays className="w-6 h-6 text-primary" />
        <h2 className="text-2xl font-bold">Resumo do Plano Semanal</h2>
      </div>

      <div className="space-y-3">
        {days.map((day, index) => {
          const sizeInfo = marmitaSizes.find((s) => s.id === day.size);

          return (
            <div
              key={index}
              className="p-4 rounded-xl border-2 border-border bg-muted/30 space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">
                      {getDayName(day.date)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateForDisplay(day.date)}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-primary">
                  R$ {day.dayTotal.toFixed(2).replace(".", ",")}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {sizeInfo?.name} - {day.meat}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">{day.deliveryTime}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {day.deliveryMethod === "entrega" ? "Entrega" : "Balcão"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-3 pt-4 border-t-2">
        <div className="flex items-center justify-between text-base">
          <span className="text-muted-foreground">Subtotal (7 dias):</span>
          <span className="font-semibold">
            R$ {totalAmount.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <div className="flex items-center justify-between text-base">
          <span className="text-green-600 font-medium">Desconto Plano Semanal:</span>
          <span className="font-semibold text-green-600">
            - R$ {discountAmount.toFixed(2).replace(".", ",")}
          </span>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <span className="text-lg font-bold text-foreground">Total Final:</span>
          <span className="text-2xl font-bold text-primary">
            R$ {finalAmount.toFixed(2).replace(".", ",")}
          </span>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <p className="text-sm text-muted-foreground">
          💡 <strong>Economize R$ {discountAmount.toFixed(2).replace(".", ",")}</strong> com o Plano Semanal!
          Suas marmitas serão preparadas nos horários escolhidos durante os próximos 7 dias.
        </p>
      </div>
    </div>
  );
}
