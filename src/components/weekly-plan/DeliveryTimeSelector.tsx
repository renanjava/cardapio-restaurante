import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle, Clock } from "lucide-react";
import { isValidDeliveryTime } from "@/utils/weekly-plan-dates";

interface DeliveryTimeSelectorProps {
  value: string;
  onChange: (time: string) => void;
  error?: boolean;
}

export function DeliveryTimeSelector({
  value,
  onChange,
  error,
}: DeliveryTimeSelectorProps) {
  const isValid = value ? isValidDeliveryTime(value) : true;
  const showError = error || (value && !isValid);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Clock className="w-5 h-5 text-primary" />
        <Label htmlFor="delivery-time" className="text-base font-semibold">
          Horário de Entrega/Retirada
        </Label>
      </div>

      <div className="space-y-2">
        <Input
          id="delivery-time"
          type="time"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min="11:00"
          max="14:00"
          className={`h-12 text-base ${
            showError
              ? "border-red-500 border-2 focus-visible:ring-red-500"
              : ""
          }`}
        />

        {showError && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 animate-fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm text-red-900">
              O horário deve estar entre <strong>11:00</strong> e{" "}
              <strong>14:00</strong>
            </p>
          </div>
        )}

        {!showError && value && (
          <p className="text-sm text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            Horário selecionado: <strong>{value}</strong>
          </p>
        )}

        {!value && (
          <p className="text-sm text-muted-foreground">
            Escolha um horário entre 11:00 e 14:00 para receber ou retirar seu
            pedido
          </p>
        )}
      </div>
    </div>
  );
}
