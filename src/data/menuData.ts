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
    description: "Refeição individual",
  },
  {
    id: "media",
    name: "Marmita Média",
    price: 20,
    description: "Refeição para 1-2 pessoas",
  },
  {
    id: "grande",
    name: "Marmita Grande",
    price: 22,
    description: "Refeição para 2-3 pessoas",
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
        checked: true,
      },
      { id: "chuchu", name: "Chuchu", checked: true },
      { id: "vagem", name: "Vagem", checked: true },
      { id: "cenoura", name: "Cenoura", checked: true },
      { id: "batata-frita", name: "Batata frita", checked: true },
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
        checked: true,
      },
      { id: "farofa", name: "Farofa", checked: true },
      { id: "legumes", name: "Legumes", checked: true },
      { id: "bolinho-arroz", name: "Bolinho de arroz", checked: true },
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
        checked: true,
      },
      { id: "repolho-refogado", name: "Repolho refogado", checked: true },
      { id: "farofa", name: "Farofa", checked: true },
      { id: "mandioca-frita", name: "Mandioca frita", checked: true },
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
      { id: "macarronese", name: "Macarronese", checked: true },
      { id: "pure-batata", name: "Purê de batata", checked: true },
      { id: "farofa-casa", name: "Farofa da casa", checked: true },
      { id: "beterraba", name: "Beterraba", checked: true },
      {
        id: "abobrinha-milanesa",
        name: "Abobrinha à milanesa",
        checked: true,
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
      { id: "feijao-tropeiro", name: "Feijão tropeiro", checked: true },
      { id: "couve", name: "Couve", checked: true },
      { id: "vinagrete", name: "Vinagrete", checked: true },
      { id: "cabotia", name: "Cabotiá", checked: true },
      { id: "batata-doce-frita", name: "Batata-doce frita", checked: true },
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
        id: "feijao-preto",
        name: "Feijão preto com pernil de porco e calabresa",
        checked: false,
      },
      {
        id: "macarrao-molho-vermelho",
        name: "Macarrão molho vermelho",
        checked: true,
      },
      { id: "farofa-couve", name: "Farofa de couve", checked: true },
      { id: "maionese", name: "Maionese", checked: true },
      { id: "ovo-frito", name: "Ovo frito", checked: true },
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

export const drinks = [
  {
    id: "refri-lata",
    name: "Refrigerante Lata",
    price: 6.0,
  },
  {
    id: "refri-600ml",
    name: "Refrigerante 600ml",
    price: 8.0,
  },
  {
    id: "refri-1lt",
    name: "Refrigerante 1L",
    price: 10.0,
  },
  {
    id: "agua-sem-gas",
    name: "Água Sem Gás",
    price: 2.5,
  },
  {
    id: "agua-com-gas",
    name: "Água Com Gás",
    price: 3.0,
  },
  {
    id: "coca-2lt",
    name: "Coca-Cola 2L",
    price: 16.0,
  },
  {
    id: "fanta-sprite",
    name: "Fanta/Sprite 2L",
    price: 13.0,
  },
  {
    id: "life-pequeno",
    name: "Life Pequeno",
    price: 7.0,
  },
  {
    id: "life-grande",
    name: "Life Grande",
    price: 17.0,
  },
  {
    id: "ouro-verde-2lt",
    name: "Ouro Verde 2L",
    price: 10.0,
  },
  {
    id: "caculinha",
    name: "Caçulinha",
    price: 3.0,
  },
];

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
  deliveryFee: 2.0,
  openingHours: {
    marmitas: "Segunda a Sábado, 10:30 - 14:00",
    lanches: "Consultar no WhatsApp",
    sunday: "Fechado aos domingos",
  },
};
