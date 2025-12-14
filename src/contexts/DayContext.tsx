import { createContext, useContext, ReactNode } from "react";
import { dayNames } from "@/data/menuData";

interface DayContextType {
  today: number;
  dayKey: string;
  isSunday: boolean;
  isSaturday: boolean;
}

const DayContext = createContext<DayContextType | undefined>(undefined);

interface DayProviderProps {
  children: ReactNode;
}

export function DayProvider({ children }: DayProviderProps) {
  const today = new Date().getDay();

  const dayKey = dayNames[today];
  const isSunday = today === 0;
  const isSaturday = today === 6;

  return (
    <DayContext.Provider value={{ today, dayKey, isSunday, isSaturday }}>
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
