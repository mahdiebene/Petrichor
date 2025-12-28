export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  origin: string;
  category: string;
  age?: string;
  weight?: string;
  dimensions?: string;
  description: string;
  story: string;
  featured?: boolean;
}

export const products: Product[] = [
  {
    id: "obsidian-mirror-001",
    name: "Obsidian Mirror of Teotihuacán",
    price: 4500,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800",
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800",
      "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800",
    ],
    origin: "Mexico, Central America",
    category: "Volcanic Glass",
    age: "2,000 years old",
    weight: "2.3 kg",
    dimensions: "18cm × 15cm × 4cm",
    description: "A polished obsidian mirror of exceptional quality, believed to have been used by Aztec priests for divination and spiritual ceremonies.",
    story: "This mirror was discovered in the ancient city of Teotihuacán, where it lay buried for two millennia. The Aztecs believed obsidian mirrors were portals to other realms, used by shamans to communicate with the spirit world. The volcanic glass formed during an eruption over 300,000 years ago, then was shaped by master craftsmen into this sacred object. When you hold it, you're connecting with both the fire of Earth's core and the spirituality of ancient civilizations.",
    featured: true,
  },
  {
    id: "amethyst-cathedral-001",
    name: "Brazilian Amethyst Cathedral",
    price: 12800,
    image: "https://images.unsplash.com/photo-1551122089-4e3e72477432?w=800",
    images: [
      "https://images.unsplash.com/photo-1551122089-4e3e72477432?w=800",
      "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?w=800",
    ],
    origin: "Rio Grande do Sul, Brazil",
    category: "Crystal",
    age: "130 million years",
    weight: "45 kg",
    dimensions: "65cm × 35cm × 28cm",
    description: "A stunning amethyst geode with deep purple crystals that formed in volcanic basalt over 130 million years ago.",
    story: "Born in the Cretaceous period when dinosaurs roamed the Earth, this cathedral-shaped geode began its journey as a gas bubble in flowing lava. Over millions of years, silica-rich waters seeped in, depositing layer upon layer of quartz crystals. The iron impurities gave them their royal purple hue. Brazilian miners discovered this specimen in the red earth of Rio Grande do Sul, where it had waited patiently for 130 million years to be revealed.",
    featured: true,
  },
  {
    id: "rose-quartz-heart-001",
    name: "Madagascar Rose Quartz Heart",
    price: 3200,
    image: "https://images.unsplash.com/photo-1603344797033-f0f4f587ab60?w=800",
    images: [
      "https://images.unsplash.com/photo-1603344797033-f0f4f587ab60?w=800",
    ],
    origin: "Madagascar",
    category: "Crystal",
    weight: "1.8 kg",
    dimensions: "12cm × 12cm × 8cm",
    description: "A perfectly carved heart of translucent rose quartz with exceptional clarity and soft pink coloration.",
    story: "Rose quartz has been a symbol of love since 600 BC. This specimen comes from the ancient rocks of Madagascar, an island that split from India 88 million years ago. The gentle pink color comes from trace amounts of titanium and manganese. In ancient Rome, rose quartz was exchanged as a gift of love. This piece carries that same energy—millions of years of Earth's love story, carved into a form that speaks to the heart.",
    featured: true,
  },
  {
    id: "meteorite-campo-001",
    name: "Campo del Cielo Meteorite",
    price: 8900,
    image: "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?w=800",
    images: [
      "https://images.unsplash.com/photo-1614642264762-d0a3b8bf3700?w=800",
    ],
    origin: "Argentina",
    category: "Meteorite",
    age: "4.5 billion years",
    weight: "3.7 kg",
    dimensions: "15cm × 12cm × 10cm",
    description: "An iron meteorite from the Campo del Cielo crater field, older than our planet itself.",
    story: "This iron-nickel meteorite fell to Earth approximately 4,000 years ago, but its journey began 4.5 billion years ago in the asteroid belt between Mars and Jupiter. When it landed in what is now Argentina, indigenous peoples called the site 'Campo del Cielo'—Field of the Sky. They believed these stones were gifts from the gods. Holding this meteorite, you touch something older than Earth itself, a piece of the cosmic neighborhood from which our solar system was born.",
    featured: true,
  },
  {
    id: "fossil-trilobite-001",
    name: "Moroccan Trilobite Fossil",
    price: 2800,
    image: "https://images.unsplash.com/photo-1609081524474-a4daa83e5d4c?w=800",
    images: [
      "https://images.unsplash.com/photo-1609081524474-a4daa83e5d4c?w=800",
    ],
    origin: "Atlas Mountains, Morocco",
    category: "Fossil",
    age: "450 million years",
    weight: "0.8 kg",
    dimensions: "18cm × 12cm × 5cm",
    description: "A beautifully preserved trilobite from the Ordovician period, when these creatures ruled the ancient seas.",
    story: "This trilobite swam in shallow seas 450 million years ago, long before the first dinosaurs appeared. These remarkable creatures had compound eyes with calcite lenses—the first complex eyes in the fossil record. When this individual died, it sank to the ocean floor and was preserved in fine sediment. The Atlas Mountains rose, the seas retreated, and now this ancient mariner has emerged from the stone, a window into a world we can scarcely imagine.",
    featured: false,
  },
  {
    id: "labradorite-slab-001",
    name: "Finnish Labradorite Slab",
    price: 1850,
    image: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800",
    images: [
      "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?w=800",
    ],
    origin: "Ylämaa, Finland",
    category: "Crystal",
    weight: "2.1 kg",
    dimensions: "25cm × 18cm × 2cm",
    description: "A polished labradorite slab displaying spectacular blue and gold labradorescence.",
    story: "The Inuit believed labradorite fell from the frozen fire of the Aurora Borealis. This specimen from Finland displays the magical optical phenomenon called labradorescence—flashes of peacock blue, gold, and green that dance across the surface as light plays upon its internal structure. Each flash is caused by light refracting through microscopic layers within the crystal, a billion years of geological history creating a light show that rivals the northern lights themselves.",
    featured: false,
  },
  {
    id: "citrine-point-001",
    name: "Congo Citrine Point",
    price: 2100,
    image: "https://images.unsplash.com/photo-1612687658285-4ad1ed7a99fd?w=800",
    images: [
      "https://images.unsplash.com/photo-1612687658285-4ad1ed7a99fd?w=800",
    ],
    origin: "Democratic Republic of Congo",
    category: "Crystal",
    weight: "1.2 kg",
    dimensions: "22cm × 8cm × 7cm",
    description: "A natural citrine crystal point with warm golden-orange coloration and exceptional clarity.",
    story: "Natural citrine is among the rarest forms of quartz, getting its golden color from trace amounts of iron heated by nearby magma. This specimen grew slowly in a geothermal pocket beneath the Congo basin. The warmth you feel when gazing at its honey-gold depths is not imagined—citrine has been called the 'merchant's stone' for centuries, believed to carry the energy of the sun and attract abundance.",
    featured: false,
  },
  {
    id: "ammolite-specimen-001",
    name: "Alberta Ammolite Shell",
    price: 6500,
    image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800",
    images: [
      "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800",
    ],
    origin: "Alberta, Canada",
    category: "Fossil",
    age: "71 million years",
    weight: "0.6 kg",
    dimensions: "15cm × 12cm × 3cm",
    description: "A rare ammolite fossil displaying the full spectrum of iridescent colors, formed from an ancient ammonite shell.",
    story: "When the inland Bearpaw Sea covered Alberta 71 million years ago, ammonites thrived in its warm waters. This specimen died and sank to the seafloor, where unique geological conditions preserved its shell and transformed it into ammolite—one of the rarest gemstones on Earth. The iridescent colors you see are not pigments but interference patterns from aragonite layers, each displaying the full rainbow spectrum. It's a 71-million-year-old light show, preserved in stone.",
    featured: false,
  },
];

export const getProductById = (id: string): Product | undefined => {
  return products.find((p) => p.id === id);
};

export const getFeaturedProducts = (): Product[] => {
  return products.filter((p) => p.featured);
};

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((p) => p.category.toLowerCase() === category.toLowerCase());
};
