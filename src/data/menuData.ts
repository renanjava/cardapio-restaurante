export interface MenuItem {
  id: string;
  name: string;
  checked: boolean;
}

export interface MeatOption {
  id: string;
  name: string;
  extraPrice?: number;
  extraForMini?: boolean;
}

export interface DayMenu {
  items: MenuItem[];
  meats: MeatOption[];
  beansOnlyOne?: boolean;
}

export interface MarmitaSize {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const marmitaSizes: MarmitaSize[] = [
  { id: 'mini', name: 'Marmita Mini', price: 15, description: 'Porção individual' },
  { id: 'media', name: 'Marmita Média', price: 20, description: 'Porção para 1-2 pessoas' },
  { id: 'grande', name: 'Marmita Grande', price: 28, description: 'Porção para 2-3 pessoas' },
];

export const weeklyMenu: Record<string, DayMenu> = {
  domingo: {
    items: [],
    meats: [],
  },
  segunda: {
    items: [
      { id: 'arroz', name: 'Arroz', checked: true },
      { id: 'feijao-preto', name: 'Feijão Preto', checked: true },
      { id: 'feijao-carioca', name: 'Feijão Carioca', checked: true },
      { id: 'salada', name: 'Salada Mista', checked: true },
      { id: 'farofa', name: 'Farofa', checked: true },
      { id: 'macarrao', name: 'Macarrão', checked: true },
    ],
    meats: [
      { id: 'frango-grelhado', name: 'Frango Grelhado' },
      { id: 'bife-acebolado', name: 'Bife Acebolado' },
      { id: 'bisteca-boi', name: 'Bisteca de boi', extraPrice: 2, extraForMini: true },
    ],
  },
  terca: {
    items: [
      { id: 'arroz', name: 'Arroz', checked: true },
      { id: 'feijao-preto', name: 'Feijão Preto', checked: true },
      { id: 'feijao-carioca', name: 'Feijão Carioca', checked: true },
      { id: 'salada', name: 'Salada de Alface', checked: true },
      { id: 'pure', name: 'Purê de Batata', checked: true },
      { id: 'legumes', name: 'Legumes Refogados', checked: true },
    ],
    meats: [
      { id: 'strogonoff', name: 'Strogonoff de Frango' },
      { id: 'carne-moida', name: 'Carne Moída' },
      { id: 'bisteca-boi', name: 'Bisteca de boi', extraPrice: 2, extraForMini: true },
    ],
  },
  quarta: {
    items: [
      { id: 'arroz', name: 'Arroz', checked: true },
      { id: 'feijao-preto', name: 'Feijão Preto', checked: true },
      { id: 'feijao-carioca', name: 'Feijão Carioca', checked: true },
      { id: 'salada', name: 'Salada Verde', checked: true },
      { id: 'batata-frita', name: 'Batata Frita', checked: true },
      { id: 'vinagrete', name: 'Vinagrete', checked: true },
    ],
    meats: [
      { id: 'frango-frito', name: 'Frango Frito' },
      { id: 'linguica', name: 'Linguiça Assada' },
      { id: 'bisteca-boi', name: 'Bisteca de boi', extraPrice: 2, extraForMini: true },
    ],
  },
  quinta: {
    items: [
      { id: 'arroz', name: 'Arroz', checked: true },
      { id: 'feijao-preto', name: 'Feijão Preto', checked: true },
      { id: 'feijao-carioca', name: 'Feijão Carioca', checked: true },
      { id: 'salada', name: 'Salada Tropical', checked: true },
      { id: 'maionese', name: 'Maionese', checked: true },
      { id: 'farofa', name: 'Farofa de Bacon', checked: true },
    ],
    meats: [
      { id: 'costelinha', name: 'Costelinha de Porco' },
      { id: 'frango-assado', name: 'Frango Assado' },
      { id: 'bisteca-boi', name: 'Bisteca de boi', extraPrice: 2, extraForMini: true },
    ],
  },
  sexta: {
    items: [
      { id: 'arroz', name: 'Arroz', checked: true },
      { id: 'feijao-preto', name: 'Feijão Preto', checked: true },
      { id: 'feijao-carioca', name: 'Feijão Carioca', checked: true },
      { id: 'salada', name: 'Salada Caesar', checked: true },
      { id: 'batata-rustica', name: 'Batata Rústica', checked: true },
      { id: 'legumes', name: 'Legumes Grelhados', checked: true },
    ],
    meats: [
      { id: 'peixe', name: 'Peixe Grelhado' },
      { id: 'bife-milanesa', name: 'Bife à Milanesa' },
      { id: 'bisteca-boi', name: 'Bisteca de boi', extraPrice: 2, extraForMini: true },
    ],
  },
  sabado: {
    items: [
      { id: 'arroz', name: 'Arroz', checked: true },
      { id: 'feijao-preto', name: 'Feijão Preto', checked: false },
      { id: 'feijao-carioca', name: 'Feijão Carioca', checked: true },
      { id: 'salada', name: 'Salada Completa', checked: true },
      { id: 'farofa', name: 'Farofa Especial', checked: true },
      { id: 'vinagrete', name: 'Vinagrete', checked: true },
    ],
    meats: [
      { id: 'picanha', name: 'Picanha Grelhada' },
      { id: 'frango-assado', name: 'Frango Assado' },
      { id: 'bisteca-boi', name: 'Bisteca de boi', extraPrice: 2, extraForMini: true },
    ],
    beansOnlyOne: true,
  },
};

export const dayNames: Record<number, string> = {
  0: 'domingo',
  1: 'segunda',
  2: 'terca',
  3: 'quarta',
  4: 'quinta',
  5: 'sexta',
  6: 'sabado',
};

export const dayDisplayNames: Record<string, string> = {
  domingo: 'Domingo',
  segunda: 'Segunda-feira',
  terca: 'Terça-feira',
  quarta: 'Quarta-feira',
  quinta: 'Quinta-feira',
  sexta: 'Sexta-feira',
  sabado: 'Sábado',
};

export const restaurantInfo = {
  name: 'Restaurante da Juliana',
  phone: '5544988129535',
  pixKey: '03085367977',
  address: 'Elpídio Monteiro, 21 - Itambé-PR',
  deliveryFeeSaturday: 2.00,
  openingHours: {
    marmitas: 'Segunda a Sábado, 10:30 - 14:00',
    lanches: 'Segunda a Sábado, 10:30 - 18:00',
    sunday: 'Fechado aos domingos',
  },
};
