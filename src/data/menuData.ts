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
  {
    id: "mini",
    name: "Marmita Mini",
    price: 16,
    description: "Porção individual",
  },
  {
    id: "media",
    name: "Marmita Média",
    price: 20,
    description: "Porção para 1-2 pessoas",
  },
  {
    id: "grande",
    name: "Marmita Grande",
    price: 22,
    description: "Porção para 2-3 pessoas",
  },
];

export const weeklyMenu: Record<string, DayMenu> = {
  domingo: {
    items: [],
    meats: [],
  },
  segunda: {
    items: [
      { id: "arroz-branco", name: "Arroz branco", checked: true },
      { id: "feijao-carioca", name: "Feijão carioca", checked: true },
      {
        id: "macarrao-alho-oleo",
        name: "Macarrão alho e óleo",
        checked: false,
      },
      { id: "chuchu", name: "Chuchu", checked: false },
      { id: "vagem", name: "Vagem", checked: false },
      { id: "cenoura", name: "Cenoura", checked: false },
      { id: "batata-frita", name: "Batata frita", checked: false },
    ],
    meats: [
      { id: "frango-parmegiana", name: "Frango parmegiana" },
      { id: "frango-milanesa", name: "Frango à milanesa" },
      { id: "frango-grelhado", name: "Frango grelhado" },
      { id: "bife", name: "Bife" },
      {
        id: "bisteca-boi",
        name: "Bisteca de boi",
        extraPrice: 2,
        extraForMini: true,
      },
      { id: "bistequinha-porco", name: "Bistequinha de Porco" },
    ],
  },
  terca: {
    items: [
      { id: "arroz-branco", name: "Arroz branco", checked: true },
      { id: "feijao-carioca", name: "Feijão carioca", checked: true },
      {
        id: "macarrao-molho-vermelho",
        name: "Macarrão molho vermelho",
        checked: false,
      },
      { id: "farofa", name: "Farofa", checked: false },
      { id: "legumes", name: "Legumes", checked: false },
      { id: "bolinho-arroz", name: "Bolinho de arroz", checked: false },
    ],
    meats: [
      { id: "frango-milanesa", name: "Frango à milanesa" },
      { id: "frango-grelhado", name: "Frango grelhado" },
      { id: "carne-panela", name: "Carne de panela" },
      { id: "bife", name: "Bife" },
      {
        id: "bisteca-boi",
        name: "Bisteca de boi",
        extraPrice: 2,
        extraForMini: true,
      },
      { id: "bistequinha-porco", name: "Bistequinha de porco" },
    ],
  },
  quarta: {
    items: [
      { id: "arroz-branco", name: "Arroz branco", checked: true },
      { id: "feijao-carioca", name: "Feijão carioca", checked: true },
      {
        id: "macarrao-molho-branco",
        name: "Macarrão molho branco",
        checked: false,
      },
      { id: "repolho-refogado", name: "Repolho refogado", checked: false },
      { id: "farofa", name: "Farofa", checked: false },
      { id: "mandioca-frita", name: "Mandioca frita", checked: false },
    ],
    meats: [
      { id: "porco-tacho", name: "Porco no tacho" },
      { id: "frango-milanesa", name: "Frango à milanesa" },
      { id: "frango-grelhado", name: "Frango grelhado" },
      { id: "bife", name: "Bife" },
      {
        id: "bisteca-boi",
        name: "Bisteca de boi",
        extraPrice: 2,
        extraForMini: true,
      },
    ],
  },
  quinta: {
    items: [
      { id: "arroz-branco", name: "Arroz branco", checked: true },
      { id: "feijao-carioca", name: "Feijão carioca", checked: true },
      { id: "macarronese", name: "Macarronese", checked: false },
      { id: "pure-batata", name: "Purê de batata", checked: false },
      { id: "farofa-casa", name: "Farofa da casa", checked: false },
      { id: "beterraba", name: "Beterraba", checked: false },
      {
        id: "abobrinha-milanesa",
        name: "Abobrinha à milanesa",
        checked: false,
      },
    ],
    meats: [
      { id: "frango-milanesa", name: "Frango à milanesa" },
      { id: "frango-grelhado", name: "Frango grelhado" },
      { id: "carne-panela", name: "Carne de panela" },
      { id: "bife", name: "Bife" },
      {
        id: "bisteca-boi",
        name: "Bisteca de boi",
        extraPrice: 2,
        extraForMini: true,
      },
      { id: "bistequinha-porco", name: "Bistequinha de porco" },
    ],
  },
  sexta: {
    items: [
      { id: "arroz-branco", name: "Arroz branco", checked: true },
      { id: "feijao-carioca", name: "Feijão carioca", checked: true },
      { id: "feijao-tropeiro", name: "Feijão tropeiro", checked: false },
      { id: "couve", name: "Couve", checked: false },
      { id: "vinagrete", name: "Vinagrete", checked: false },
      { id: "cabotia", name: "Cabotiá", checked: false },
      { id: "batata-doce-frita", name: "Batata-doce frita", checked: false },
    ],
    meats: [
      { id: "frango-milanesa", name: "Frango à milanesa" },
      { id: "frango-grelhado", name: "Frango grelhado" },
      { id: "carne-panela", name: "Carne de panela" },
      { id: "bife", name: "Bife" },
      {
        id: "bisteca-boi",
        name: "Bisteca de boi",
        extraPrice: 2,
        extraForMini: true,
      },
      { id: "bistequinha-porco", name: "Bistequinha de porco" },
    ],
  },
  sabado: {
    items: [
      { id: "arroz-branco", name: "Arroz branco", checked: true },
      { id: "feijao-carioca", name: "Feijão carioca", checked: true },
      {
        id: "feijao-preto-pernil",
        name: "Feijão preto com pernil de porco e calabresa",
        checked: false,
      },
      {
        id: "macarrao-molho-vermelho",
        name: "Macarrão molho vermelho",
        checked: false,
      },
      { id: "farofa-couve", name: "Farofa de couve", checked: false },
      { id: "maionese", name: "Maionese", checked: false },
      { id: "ovo-frito", name: "Ovo frito", checked: false },
    ],
    meats: [
      { id: "frango-milanesa", name: "Frango à milanesa" },
      { id: "frango-grelhado", name: "Frango grelhado" },
      { id: "carne-panela", name: "Carne de panela" },
      { id: "bife", name: "Bife" },
      {
        id: "bisteca-boi",
        name: "Bisteca de boi",
        extraPrice: 2,
        extraForMini: true,
      },
      { id: "bistequinha-porco", name: "Bistequinha de porco" },
    ],
  },
};

export const dayNames: Record<number, string> = {
  0: "domingo",
  1: "segunda",
  2: "terca",
  3: "quarta",
  4: "quinta",
  5: "sexta",
  6: "sabado",
};

export const dayDisplayNames: Record<string, string> = {
  domingo: "Domingo",
  segunda: "Segunda-feira",
  terca: "Terça-feira",
  quarta: "Quarta-feira",
  quinta: "Quinta-feira",
  sexta: "Sexta-feira",
  sabado: "Sábado",
};

export const restaurantInfo = {
  name: "Restaurante da Juliana",
  phone: "5544988129535",
  pixKey: "03085367977",
  address: "Elpídio Monteiro, 21 - Itambé-PR",
  deliveryFeeSaturday: 2.0,
  openingHours: {
    marmitas: "Segunda a Sábado, 10:30 - 14:00",
    lanches: "Segunda a Sábado, 10:30 - 18:00",
    sunday: "Fechado aos domingos",
  },
};
