export const BRAND_STATEMENT =
  "Bagpiper es una línea de licores herbales y gines de alta calidad desarrollada en Estados Unidos — Lamoille, Nevada.";

export const navLinks = [
  { label: "Expresiones", href: "#elige" },
  { label: "Herbal", href: "#herbal" },
  { label: "Gin", href: "#gin" },
  { label: "Colección", href: "#expresiones" },
  { label: "Cócteles", href: "#cocteles" },
  { label: "Historia", href: "#historia" },
  { label: "Galería", href: "#mundo" },
  { label: "FAQ", href: "#faq" },
];

export const stats = [
  {
    value: "2018",
    title: "Origen en USA",
    text: "Smith & Johnson & Co. desarrolla la fórmula y el concepto comercial de Bagpiper en Lamoille, Nevada.",
  },
  {
    value: "2024",
    title: "Reactivación",
    text: "Bagpiper retoma operaciones y abre una nueva etapa de expansión internacional.",
  },
];

export const marqueeItems = [
  "Dos Expresiones",
  "Herbal Liqueur",
  "London Dry Gin",
  "Lamoille, Nevada",
  "The Dark Piper",
  "Classic Gin",
  "Black Pink",
  "Smith & Johnson",
  "Vapour Infused",
  "Serve Cold",
];

export const timeline = [
  {
    year: "2018",
    title: "Desarrollo de la marca",
    text: "Smith & Johnson & Co. desarrolla en Lamoille, Nevada, la fórmula y el concepto comercial de Bagpiper: una marca de destilados botánicos construida sobre hierbas, raíces, especias y enebro. La marca se registra y se desarrolla inicialmente para el mercado estadounidense.",
  },
  {
    year: "2019–2023",
    title: "Etapa de transición",
    text: "Los derechos comerciales y las operaciones de Bagpiper pasan por diferentes compañías del sector de bebidas espirituosas. La marca mantiene sus fórmulas e identidad original, aunque sus operaciones comerciales se reducen progresivamente.",
  },
  {
    year: "2024",
    title: "Reactivación",
    text: "Bagpiper retoma operaciones bajo una nueva estructura empresarial, con el objetivo de recuperar la marca y desarrollar nuevamente su presencia comercial. La nueva etapa se concentra en la modernización de la presentación, el fortalecimiento de la distribución y la expansión hacia mercados internacionales.",
  },
  {
    year: "2024 —",
    title: "Dos expresiones",
    text: "Bagpiper se consolida en dos expresiones —Herbal Liqueur y London Dry Gin— y trabaja con importadores y distribuidores de bebidas espirituosas en Latinoamérica, tanto para consumo directo como para coctelería.",
  },
];

export const darkPiperSymbols = [
  {
    name: "El gaitero",
    role: "El origen de la leyenda",
    text: "La figura que conoce las plantas del bosque y da forma a cada receta.",
  },
  {
    name: "La gaita",
    role: "Identidad y nombre",
    text: "El instrumento que nombra a Bagpiper y sostiene su símbolo.",
  },
  {
    name: "El bosque",
    role: "Naturaleza y botánicos",
    text: "El territorio de donde nacen las hierbas del licor y el enebro del gin.",
  },
  {
    name: "Los vegetales",
    role: "Ingredientes de la fórmula",
    text: "Hierbas, raíces, especias, flores, frutos y bayas recolectadas.",
  },
  {
    name: "La figura oscura",
    role: "El secreto de la receta",
    text: "El misterio que protege cada mezcla y define al Dark Piper.",
  },
];

export const botanicals = [
  "Hierbas",
  "Raíces",
  "Especias",
  "Flores",
  "Anís estrellado",
  "Brezo",
  "Enebro",
  "Cítricos",
  "Frutos del bosque",
];

export const regions = [
  { name: "Hierbas & raíces", role: "Licor herbal · cuerpo y profundidad" },
  { name: "Especias & flores", role: "Licor herbal · carácter y matices" },
  { name: "Enebro", role: "Gin · columna London Dry" },
  { name: "Cítricos", role: "Gin Classic · frescura" },
  { name: "Frutos del bosque", role: "Gin Black Pink · dulzor botánico" },
];

export type Expression = {
  id: string;
  family: "herbal" | "gin";
  familyLabel: string;
  tag: string;
  name: string;
  short: string;
  line: string;
  description: string;
  notes: string[];
  abv: string;
  volume: string;
  serve: string;
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  studio?: boolean;
};

export const expressions: Expression[] = [
  {
    id: "herbal",
    family: "herbal",
    familyLabel: "Licor herbal",
    tag: "Expresión Herbal",
    name: "Herbal Liqueur",
    short: "Original Recipe",
    line: "Crafted with selected herbs & botanicals",
    description:
      "La receta original de la casa: un licor herbal de hierbas, raíces, especias y botánicos, oscuro y envolvente. Nueva presentación en botella verde profundo. Se sirve muy frío.",
    notes: ["Hierbas", "Raíces", "Especias", "Botánicos"],
    abv: "35% VOL.",
    volume: "750 ML",
    serve: "Serve Cold",
    image: "/images/bagpiper-herbal-packshot.jpg",
    imageAlt: "Bagpiper Herbal Liqueur, nueva presentación: botella verde oscuro 750 ml, 35% vol., etiqueta Smith & Johnson",
    imageWidth: 800,
    imageHeight: 1200,
    studio: true,
  },
  {
    id: "classic",
    family: "gin",
    familyLabel: "Gin",
    tag: "Expresión Gin",
    name: "London Dry Gin",
    short: "Classic Gin",
    line: "Vapour infused · Distilled from 100% grain spirit",
    description:
      "Un London Dry de perfil seco y limpio, con el enebro al frente y un final cítrico. Infusionado al vapor y destilado a partir de 100% grano. La base perfecta para un gin tonic clásico.",
    notes: ["Enebro", "Cítricos", "Seco", "Vapour Infused"],
    abv: "40% VOL.",
    volume: "750 ML",
    serve: "Gin & Tonic",
    image: "/images/bagpiper-gin-classic-london-dry.jpg",
    imageAlt: "Bagpiper London Dry Gin Classic, botella transparente con copa balón de gin tonic sobre mármol",
    imageWidth: 654,
    imageHeight: 1086,
  },
  {
    id: "black-pink",
    family: "gin",
    familyLabel: "Gin",
    tag: "Expresión Gin",
    name: "London Dry Gin",
    short: "Black Pink",
    line: "Vapour infused · Fruta del bosque",
    description:
      "La versión rosada de la casa: London Dry con frutos del bosque —frambuesa, mora y arándano— sobre la base de enebro. Color vibrante, perfil frutal y seco a la vez.",
    notes: ["Frutos del bosque", "Frambuesa", "Mora", "Enebro"],
    abv: "40% VOL.",
    volume: "750 ML",
    serve: "Pink Tonic",
    image: "/images/bagpiper-gin-black-pink-fruta-del-bosque.jpg",
    imageAlt: "Bagpiper London Dry Gin Black Pink fruta del bosque, botella rosada con copa de frutos rojos",
    imageWidth: 717,
    imageHeight: 1086,
  },
];

export const ginHighlights = [
  { label: "Estilo", value: "London Dry" },
  { label: "Proceso", value: "Vapour Infused" },
  { label: "Base", value: "100% Grano" },
  { label: "Graduación", value: "40% Vol." },
];

export const herbalHighlights = [
  { label: "Categoría", value: "Licor Herbal" },
  { label: "Fórmula", value: "Receta Original" },
  { label: "Base", value: "Hierbas & Raíces" },
  { label: "Graduación", value: "35% Vol." },
];

export type Cocktail = {
  id: string;
  expressionId: string;
  expression: string;
  name: string;
  tagline: string;
  glass: string;
  ingredients: string[];
  steps: string[];
  image: string;
  imageAlt: string;
  imageWidth: number;
  imageHeight: number;
  imagePosition?: string;
};

export const cocktails: Cocktail[] = [
  {
    id: "herbal-orange",
    expressionId: "herbal",
    expression: "Bagpiper Herbal Liqueur",
    name: "Herbal Orange",
    tagline: "El ritual de la casa: frío, herbal y cítrico.",
    glass: "Vaso corto",
    ingredients: ["50 ml de Bagpiper Herbal Liqueur bien frío", "Hielo en cubos", "Piel y rodaja de naranja"],
    steps: [
      "Enfría el vaso corto con hielo.",
      "Sirve el Bagpiper Herbal Liqueur muy frío.",
      "Exprime la piel de naranja sobre el vaso y decora con la rodaja.",
    ],
    image: "/images/bagpiper-herbal-ritual.jpg",
    imageAlt: "Cóctel Herbal Orange: Bagpiper Herbal Liqueur con hielo y naranja en vaso corto",
    imageWidth: 1280,
    imageHeight: 720,
    // Encuadra el vaso: la etiqueta de este fotograma (generado por IA) muestra una graduación incorrecta.
    imagePosition: "18% 50%",
  },
  {
    id: "dark-piper-tonic",
    expressionId: "herbal",
    expression: "Bagpiper Herbal Liqueur",
    name: "Dark Piper Tonic",
    tagline: "Oscuro y burbujeante, con romero y limón.",
    glass: "Vaso bajo",
    ingredients: [
      "45 ml de Bagpiper Herbal Liqueur",
      "120 ml de agua tónica fría",
      "Hielo",
      "Rodaja de limón y una ramita de romero",
    ],
    steps: [
      "Llena el vaso con hielo.",
      "Agrega el Bagpiper Herbal Liqueur y completa con tónica.",
      "Remueve suave y decora con limón y romero.",
    ],
    image: "/images/bagpiper-herbal-tonic.jpg",
    imageAlt: "Cóctel Dark Piper Tonic con Bagpiper Herbal Liqueur, tónica, limón y romero sobre barra nocturna",
    imageWidth: 720,
    imageHeight: 880,
  },
  {
    id: "piper-classic-tonic",
    expressionId: "classic",
    expression: "Bagpiper London Dry Gin Classic",
    name: "Piper Classic Tonic",
    tagline: "El gin tonic de siempre, seco y limpio.",
    glass: "Copa balón",
    ingredients: [
      "50 ml de Bagpiper London Dry Gin Classic",
      "150 ml de tónica premium fría",
      "Hielo abundante",
      "Piel de limón",
    ],
    steps: [
      "Llena la copa balón con hielo y enfríala.",
      "Sirve el gin y completa con la tónica deslizándola por una cuchara.",
      "Perfuma con la piel de limón.",
    ],
    image: "/images/bagpiper-gin-classic-limon.jpg",
    imageAlt: "Gin tonic Piper Classic Tonic con Bagpiper London Dry Gin Classic y piel de limón en copa balón",
    imageWidth: 1023,
    imageHeight: 828,
  },
  {
    id: "black-pink-berry-tonic",
    expressionId: "black-pink",
    expression: "Bagpiper London Dry Gin Black Pink",
    name: "Black Pink Berry Tonic",
    tagline: "Rosado, frutal y fresco, con frutos del bosque.",
    glass: "Copa balón",
    ingredients: [
      "50 ml de Bagpiper London Dry Gin Black Pink",
      "150 ml de tónica fría",
      "Hielo",
      "Frambuesas, moras y arándanos",
    ],
    steps: [
      "Llena la copa balón con hielo.",
      "Agrega los frutos del bosque y el gin.",
      "Completa con tónica y remueve suave.",
    ],
    image: "/images/bagpiper-gin-black-pink-verano.jpg",
    imageAlt: "Gin tonic Black Pink Berry Tonic con Bagpiper London Dry Gin Black Pink y frutos del bosque",
    imageWidth: 1023,
    imageHeight: 797,
  },
];

export const faqs = [
  {
    q: "¿Qué es Bagpiper?",
    a: "Bagpiper es una línea de licores herbales y gines de alta calidad desarrollada en Estados Unidos — Lamoille, Nevada — por Smith & Johnson & Co. Hoy reúne dos expresiones: Herbal Liqueur y London Dry Gin, este último en versiones Classic y Black Pink. Sitio oficial: bagpiper.site.",
  },
  {
    q: "¿Qué expresiones tiene Bagpiper?",
    a: "Dos expresiones: Bagpiper Herbal Liqueur (licor herbal, 35% vol., 750 ml) y Bagpiper London Dry Gin (40% vol., 750 ml), que se presenta en dos versiones: Classic y Black Pink, con frutos del bosque.",
  },
  {
    q: "¿Cómo se toma el licor herbal Bagpiper?",
    a: "Serve cold. Se sirve muy frío, solo o en copa helada, con hielo y piel de naranja, y también en coctelería.",
  },
  {
    q: "¿Cómo se toma el gin Bagpiper?",
    a: "En gin tonic: copa balón con abundante hielo, una medida de gin y tónica fría. El Classic va con piel de limón; el Black Pink con frambuesas, moras y arándanos.",
  },
  {
    q: "¿Qué cócteles se preparan con Bagpiper?",
    a: "Con el licor herbal: Herbal Orange (frío, con hielo y naranja) y Dark Piper Tonic (con tónica, limón y romero). Con el gin: Piper Classic Tonic (London Dry Classic, tónica y piel de limón) y Black Pink Berry Tonic (Black Pink, tónica y frutos del bosque).",
  },
  {
    q: "¿De dónde es Bagpiper?",
    a: "Bagpiper fue desarrollada en Estados Unidos, en Lamoille, Nevada, por Smith & Johnson & Co. Desde 2024 se distribuye en Latinoamérica.",
  },
  {
    q: "¿Dónde se consigue Bagpiper?",
    a: "Desde 2024 Bagpiper trabaja con importadores y distribuidores de bebidas espirituosas en Latinoamérica. La presencia comercial de sus gines y licores herbales se desarrolla de forma progresiva en la región.",
  },
];
