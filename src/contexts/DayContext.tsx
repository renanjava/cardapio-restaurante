import { createContext, useContext, ReactNode } from "react";
import { DAY_NAMES } from "@/config";

interface DayContextType {
  today: number;
  dayKey: string;
  isSunday: boolean;
  isSaturday: boolean;
  isOpen: boolean;
}

const DayContext = createContext<DayContextType | undefined>(undefined);

interface DayProviderProps {
  children: ReactNode;
}

export function DayProvider({ children }: DayProviderProps) {
  const today = new Date().getDay();
  const now = new Date();
  const currentHour = 7;
  const currentMinute = 0;

  const currentTimeInMinutes = currentHour * 60 + currentMinute;
  const openTimeInMinutes = 7 * 60;
  const closeTimeInMinutes = 14 * 60;

  const isOpen =
    currentTimeInMinutes >= openTimeInMinutes &&
    currentTimeInMinutes < closeTimeInMinutes;

  const dayKey = DAY_NAMES[today];
  const isSunday = today === 0;
  const isSaturday = today === 6;

  return (
    <DayContext.Provider value={{ today, dayKey, isSunday, isSaturday, isOpen }}>
      {children}
    </DayContext.Provider>
  );
}

export function useDay() {
  const context = useContext(DayContext);
  if (context === undefined) {
    throw new Error("useDay must be used within a DayProvider");
  }
  return context;
}
