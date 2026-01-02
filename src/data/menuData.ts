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
    id: "caculinha",
    name: "Coca-Cola Caçulinha 200ml",
    price: 3.0,
  },
  {
    id: "coca-lata-normal",
    name: "Coca-Cola Lata 350ml",
    price: 6.0,
  },
  {
    id: "coca-lata-zero",
    name: "Coca-Cola Lata Zero 350ml",
    price: 6.0,
  },
  {
    id: "coca-600ml",
    name: "Coca-Cola 600ml",
    price: 8.0,
  },
  {
    id: "coca-1lt",
    name: "Coca-Cola 1L",
    price: 10.0,
  },
  {
    id: "coca-2lt",
    name: "Coca-Cola 2L",
    price: 16.0,
  },
  {
    id: "agua-sem-gas",
    name: "Água Sem Gás 500ml",
    price: 2.5,
  },
  {
    id: "agua-com-gas",
    name: "Água Com Gás 500ml",
    price: 3.0,
  },
  {
    id: "life-pequeno",
    name: "Suco de Laranja Life 300ml",
    price: 7.0,
  },
  {
    id: "life-grande",
    name: "Suco de Laranja Life 900ml",
    price: 17.0,
  },
];

