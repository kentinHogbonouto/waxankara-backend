import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// picsum.photos/seed/<nom>/800/800 génère une image stable et cohérente sans API key
const img = (name: string, n: number) =>
  `https://picsum.photos/seed/${name}-${n}/800/800`;

async function main() {
  const products = [
    {
      name: 'Wax Traditionnel Kente',
      description: 'Tissu wax traditionnel avec motifs kente authentiques, parfait pour des occasions spéciales.',
      price: 15000,
      images: [img('wax-kente', 1), img('wax-kente', 2)],
      category: 'Wax',
      origin: 'Ghana',
      material: '100% Coton premium',
      care: 'Lavage délicat, repassage à basse température',
      colors: ['Noir', 'Doré', 'Blanc'],
      sizes: ['1m', '2m', '3m', '5m'],
      rating: 4.8,
      ratingCount: 120,
      isNew: true,
      discount: 10,
      stock: 50,
    },
    {
      name: 'Ankara Royal Blue',
      description: 'Tissu ankara premium avec motifs géométriques sur fond bleu royal.',
      price: 18000,
      images: [img('ankara-blue', 1), img('ankara-blue', 2)],
      category: 'Ankara',
      origin: 'Nigeria',
      material: '100% Coton premium',
      care: 'Lavage délicat, repassage à basse température',
      colors: ['Bleu Royal', 'Blanc', 'Doré'],
      sizes: ['1m', '2m', '3m', '5m'],
      rating: 4.9,
      ratingCount: 95,
      isNew: false,
      stock: 75,
    },
    {
      name: 'Wax Floral Sunset',
      description: 'Tissu wax avec motifs floraux aux couleurs du coucher de soleil.',
      price: 12500,
      images: [img('wax-sunset', 1), img('wax-sunset', 2)],
      category: 'Wax',
      origin: "Côte d'Ivoire",
      material: '100% Coton premium',
      care: 'Lavage délicat, repassage à basse température',
      colors: ['Orange', 'Jaune', 'Vert'],
      sizes: ['1m', '2m', '3m', '5m'],
      rating: 4.7,
      ratingCount: 88,
      isNew: true,
      discount: 10,
      stock: 60,
    },
    {
      name: 'Bogolan Authentique',
      description: 'Tissu bogolan traditionnel avec motifs géométriques authentiques du Mali.',
      price: 22500,
      images: [img('bogolan', 1), img('bogolan', 2)],
      category: 'Bogolan',
      origin: 'Mali',
      material: '100% Coton premium',
      care: 'Lavage à la main uniquement',
      colors: ['Terre', 'Noir', 'Beige'],
      sizes: ['1m', '2m', '3m', '5m'],
      rating: 5.0,
      ratingCount: 45,
      isNew: false,
      stock: 30,
    },
    {
      name: 'Ankara Geometric Gold',
      description: "Tissu ankara premium avec des motifs géométriques dorés sur fond noir.",
      price: 20000,
      images: [img('ankara-gold', 1), img('ankara-gold', 2)],
      category: 'Ankara',
      origin: 'Nigeria',
      material: '100% Coton premium',
      care: 'Lavage délicat, repassage à basse température',
      colors: ['Noir', 'Doré', 'Blanc'],
      sizes: ['1m', '2m', '3m', '5m'],
      rating: 4.8,
      ratingCount: 67,
      isNew: true,
      stock: 40,
    },
    {
      name: 'Ankara Modern Fusion',
      description: 'Tissu ankara moderne avec fusion de motifs traditionnels et contemporains.',
      price: 17500,
      images: [img('ankara-fusion', 1), img('ankara-fusion', 2)],
      category: 'Ankara',
      origin: 'Nigeria',
      material: '100% Coton premium',
      care: 'Lavage délicat, repassage à basse température',
      colors: ['Multicolore', 'Blanc', 'Noir'],
      sizes: ['1m', '2m', '3m', '5m'],
      rating: 4.7,
      ratingCount: 52,
      isNew: true,
      stock: 55,
    },
    {
      name: 'Kente Royal Heritage',
      description: 'Tissu kente royal avec motifs héréditaires authentiques du Ghana.',
      price: 28000,
      images: [img('kente-royal', 1), img('kente-royal', 2)],
      category: 'Kente',
      origin: 'Ghana',
      material: '100% Soie et Coton',
      care: 'Nettoyage à sec recommandé',
      colors: ['Multicolore', 'Doré', 'Rouge'],
      sizes: ['1m', '2m', '3m', '5m'],
      rating: 5.0,
      ratingCount: 38,
      isNew: true,
      stock: 25,
    },
    {
      name: 'Wax Tropical Paradise',
      description: 'Tissu wax aux couleurs tropicales avec motifs exotiques.',
      price: 14500,
      images: [img('wax-tropical', 1), img('wax-tropical', 2)],
      category: 'Wax',
      origin: "Côte d'Ivoire",
      material: '100% Coton premium',
      care: 'Lavage délicat, repassage à basse température',
      colors: ['Vert', 'Jaune', 'Orange'],
      sizes: ['1m', '2m', '3m', '5m'],
      rating: 4.6,
      ratingCount: 73,
      isNew: false,
      stock: 65,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
