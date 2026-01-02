export const ENV = {
  CLERK_PUBLISHABLE_KEY: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
  ENABLE_INTELLIGENT_ORDER: import.meta.env.VITE_ENABLE_INTELLIGENT_ORDER === "true",
  ENABLE_WEEKLY_PLAN: import.meta.env.VITE_ENABLE_WEEKLY_PLAN === "true",
} as const;

export type DayKey =
  | "segunda"
  | "terca"
  | "quarta"
  | "quinta"
  | "sexta"
  | "sabado"
  | "domingo";

export const RESTAURANT_INFO = {
  name: "Restaurante da Juliana",
  phone: "5544988129535",
  pixKey: "03085367977",
  address: "Elpídio Monteiro, 21 - Itambé-PR",
  deliveryFee: 2.0,
  openingHours: {
    openingTime: "07:00",
    closingTime: "14:00",
    marmitas: "Segunda a Sábado",
    lanches: "Consultar no WhatsApp",
    sunday: "Fechado aos domingos",
  },
} as const;

export const DAY_NAMES: Record<number, string> = {
  0: "domingo",
  1: "segunda",
  2: "terca",
  3: "quarta",
  4: "quinta",
  5: "sexta",
  6: "sabado",
};

export const DAY_DISPLAY_NAMES: Record<string, string> = {
  domingo: "Domingo",
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sábado",
};
