export interface HeroDesignProduct {
  id: string;
  label: string;
  title: string;
  description: string;
  image: string;
  thumbnail: string;
  decorTop: string;
  decorBottom: string;
  sectionSplash: string;
  cardImage: string;
  cardTitle: string;
  cardPrice: string;
  bg: string;
  strong: string;
  soft: string;
  imageRotate: string;
  imageScale: string;
}

export interface DesignCategoryVisual {
  id: string;
  label: string;
  thumb: string;
  catalogImages: string[];
}

export interface FallbackCatalogItem {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  likes: string;
  description: string;
  image: string;
  liked: boolean;
}

export const HERO_DESIGN_PRODUCTS: HeroDesignProduct[] = [
  {
    id: 'milkshake',
    label: 'Milkshakes',
    title: `
      <span class="line"><span class="light">Creamy</span> <span class="dark">Milkshakes</span></span>
    `,
    description: 'Indulge in our rich, creamy milkshakes made with fresh ingredients and topped with delicious flavors. Every sip is pure happiness.',
    image: 'assets/milk.png',
    thumbnail: 'assets/coffee.png',
    decorTop: 'assets/chocolate-splash.png',
    decorBottom: 'assets/chocolate-splash.png',
    sectionSplash: 'assets/chocolate-splash.png',
    cardImage: 'assets/chco item.png',
    cardTitle: 'Chocolate Crumble Sundae',
    cardPrice: 'Rs.680/=',
    bg: '#7b4744',
    strong: '#632826',
    soft: '#7a4645',
    imageRotate: '-29.58deg',
    imageScale: '1.08'
  },
  {
    id: 'sundae',
    label: 'Ice Cream Sundaes',
    title: `
      <span class="line"><span class="light">Delightful Ice Cream</span></span>
      <span class="line"><span class="dark">Sundaes</span></span>
    `,
    description: 'Creamy scoops topped with sweet sauces and delightful treats.',
    image: 'assets/cream.png',
    thumbnail: 'assets/sundae.png',
    decorTop: 'assets/milk-splash.png',
    decorBottom: 'assets/milk-splash.png',
    sectionSplash: 'assets/milk-splash.png',
    cardImage: 'assets/cream item.png',
    cardTitle: 'Chocolate Crumble Sundae',
    cardPrice: 'Rs.680/=',
    bg: '#d3b53b',
    strong: '#ffd00d',
    soft: '#d2bd49',
    imageRotate: '-22deg',
    imageScale: '1.14'
  },
  {
    id: 'bubble-tea',
    label: 'Bubble Tea',
    title: `
      <span class="line"><span class="light">Refreshing</span> <span class="dark">Bubble Tea</span></span>
    `,
    description: 'Discover the perfect blend of refreshing tea, creamy flavors, and chewy boba pearls crafted to make every sip a delightful experience.',
    image: 'assets/falu.png',
    thumbnail: 'assets/bubble-tea.png',
    decorTop: 'assets/strawberry-splash.png',
    decorBottom: 'assets/strawberry-splash.png',
    sectionSplash: 'assets/strawberry-splash.png',
    cardImage: 'assets/faluda item.png',
    cardTitle: 'Chocolate Crumble Sundae',
    cardPrice: 'Rs.680/=',
    bg: '#f56585',
    strong: '#ec3b60',
    soft: '#f8658b',
    imageRotate: '-16deg',
    imageScale: '1.32'
  },
  {
    id: 'coffee',
    label: 'Coffee Milkshakes',
    title: `
      <span class="line"><span class="light">Energizing</span> <span class="dark">Coffee</span></span>
      <span class="line"><span class="light">Milkshakes</span></span>
    `,
    description: 'A perfect blend of rich coffee and creamy milkshake goodness in every sip.',
    image: 'assets/coff.png',
    thumbnail: 'assets/milkshake-choco.png',
    decorTop: 'assets/coffee-splash.png',
    decorBottom: 'assets/coffee-splash.png',
    sectionSplash: 'assets/coffee-splash.png',
    cardImage: 'assets/Coffe.png',
    cardTitle: 'Chocolate Crumble Sundae',
    cardPrice: 'Rs.680/=',
    bg: '#814342',
    strong: '#612522',
    soft: '#76403f',
    imageRotate: '-24deg',
    imageScale: '1.32'
  }
];

export const DESIGN_CATEGORY_VISUALS: DesignCategoryVisual[] = [
  {
    id: 'milkshake',
    label: 'Milkshakes',
    thumb: 'assets/coffee.png',
    catalogImages: ['assets/chco item.png', 'assets/Coffe.png', 'assets/chco item.png', 'assets/Coffe.png']
  },
  {
    id: 'sundae',
    label: 'Ice Cream Sundaes',
    thumb: 'assets/sundae.png',
    catalogImages: ['assets/cream item.png', 'assets/cream item.png', 'assets/cream item.png', 'assets/cream item.png']
  },
  {
    id: 'bubble-tea',
    label: 'Bubble Tea',
    thumb: 'assets/bubble-tea.png',
    catalogImages: ['assets/faluda item.png', 'assets/faluda item.png', 'assets/faluda item.png', 'assets/faluda item.png']
  },
  {
    id: 'coffee',
    label: 'Coffee Milkshakes',
    thumb: 'assets/milkshake-choco.png',
    catalogImages: ['assets/chco item.png', 'assets/chco item.png', 'assets/chco item.png', 'assets/chco item.png']
  }
];

export const FALLBACK_CATALOG_ITEMS: FallbackCatalogItem[] = [
  {
    id: 'milkshake-1',
    categoryId: 'milkshake',
    name: 'Chocolate Crumble Sundae',
    price: 880,
    likes: '91% (64)',
    description: 'Chocolate ice cream, chocolate sauce, butter cream, nuts, and chocolate chips.',
    image: 'assets/chco item.png',
    liked: true
  },
  {
    id: 'milkshake-2',
    categoryId: 'milkshake',
    name: 'Mocha Cream Shake',
    price: 820,
    likes: '89% (52)',
    description: 'A chilled mocha blend with whipped cream, cocoa drizzle, and crunchy bits.',
    image: 'assets/Coffe.png',
    liked: false
  },
  {
    id: 'sundae-1',
    categoryId: 'sundae',
    name: 'Classic Cream Sundae',
    price: 760,
    likes: '87% (46)',
    description: 'Vanilla cream sundae layered with sauce, nuts, and a sweet cherry finish.',
    image: 'assets/cream item.png',
    liked: false
  },
  {
    id: 'bubble-tea-1',
    categoryId: 'bubble-tea',
    name: 'Strawberry Bubble Bliss',
    price: 920,
    likes: '93% (61)',
    description: 'Refreshing strawberry bubble tea with creamy foam and chewy boba pearls.',
    image: 'assets/faluda item.png',
    liked: true
  },
  {
    id: 'coffee-1',
    categoryId: 'coffee',
    name: 'Espresso Sundae Crunch',
    price: 910,
    likes: '89% (50)',
    description: 'Espresso sweetness, crunchy toppings, and chilled cream in one dessert cup.',
    image: 'assets/chco item.png',
    liked: false
  }
];
