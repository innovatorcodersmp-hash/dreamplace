import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_PLACES = [
  {
    title: "Amalfi Coast & Positano",
    country: "Italy",
    category: "Beach",
    targetYear: 2025,
    budget: 250000,
    status: "PLANNING",
    isFavorite: true,
    imageUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    notes: "Clifftop pastel villages, limoncello tasting, boat tour around Capri and Sirenusas.",
  },
  {
    title: "Kyoto Arashiyama & Fushimi Inari",
    country: "Japan",
    category: "Historic",
    targetYear: 2025,
    budget: 180000,
    status: "VISITED",
    isFavorite: true,
    imageUrl: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    notes: "Walk through thousands of vermilion torii gates and serene bamboo grove during morning sunrise.",
  },
  {
    title: "Banff National Park & Lake Louise",
    country: "Canada",
    category: "Mountains",
    targetYear: 2026,
    budget: 320000,
    status: "WISHLIST",
    isFavorite: false,
    imageUrl: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&w=800&q=80",
    notes: "Turquoise glacial lakes surrounded by snow-capped peaks in the Canadian Rockies.",
  },
  {
    title: "Santorini Oia Sunset",
    country: "Greece",
    category: "Beach",
    targetYear: 2025,
    budget: 220000,
    status: "VISITED",
    isFavorite: true,
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=800&q=80",
    notes: "Caldera view cliff walk, whitewashed Aegean architecture with blue domes.",
  },
  {
    title: "Reykjavik & Golden Circle",
    country: "Iceland",
    category: "Road Trip",
    targetYear: 2026,
    budget: 280000,
    status: "WISHLIST",
    isFavorite: false,
    imageUrl: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80",
    notes: "Ring road camper road trip, chasing Northern Lights, black sand beaches, and geothermal lagoons.",
  },
  {
    title: "Cappadocia Hot Air Balloons",
    country: "Turkey",
    category: "Hidden Gem",
    targetYear: 2025,
    budget: 160000,
    status: "PLANNING",
    isFavorite: true,
    imageUrl: "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=800&q=80",
    notes: "Sunrise hot air balloon flight over fairy chimneys and ancient cave dwellings.",
  },
];

async function main() {
  console.log("Seeding dream places...");
  
  const count = await prisma.place.count();
  if (count === 0) {
    for (const place of SEED_PLACES) {
      await prisma.place.create({
        data: place,
      });
    }
    console.log(`Successfully seeded ${SEED_PLACES.length} dream places.`);
  } else {
    console.log(`Database already contains ${count} places. Skipping seed.`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
