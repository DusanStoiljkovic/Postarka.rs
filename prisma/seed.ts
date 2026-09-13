import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});
const prisma = new PrismaClient({ adapter });

const postcards = [
  {
    slug: "jesen-kod-kuce",
    title: "Jesen kod kuće",
    titleEn: "Autumn at home",
    description:
      "Toplo popodne u dnevnoj sobi, dok napolju pada prvo jesenje lišće.",
    descriptionEn:
      "A warm afternoon in the living room, while the first autumn leaves fall outside.",
    type: "unikat",
    theme: "Priroda",
    price: 450,
    stock: 1,
    edition: 1,
    status: "stanju",
    image: "/uploads/photos-1789213053903-ghwt.jpeg",
  },
  {
    slug: "osam-koktela",
    title: "Osam koktela",
    titleEn: "Eight cocktails",
    description: "Osam čaša na baršunastom stolu, crtano akvarelom.",
    descriptionEn: "Eight glasses on a velvet table, painted in watercolor.",
    type: "serija",
    theme: "Hrana",
    price: 320,
    stock: 9,
    edition: 25,
    status: "stanju",
    image: "/uploads/photos-1789213046431-nwo7.jpeg",
  },
  {
    slug: "vile-na-livadi",
    title: "Vile na livadi",
    titleEn: "Fairies in the meadow",
    description: "Male vile među visokom travom, u sumrak.",
    descriptionEn: "Small fairies among tall grass, at dusk.",
    type: "unikat",
    theme: "Bajke",
    price: 450,
    stock: 1,
    edition: 1,
    status: "stanju",
    image: "/uploads/photos-1789213052876-xj03.jpeg",
  },
  {
    slug: "osam-kolaca",
    title: "Osam kolača",
    titleEn: "Eight cakes",
    description: "Poslužavnik kolača za rođendansku proslavu.",
    descriptionEn: "A tray of cakes for a birthday celebration.",
    type: "serija",
    theme: "Hrana",
    price: 320,
    stock: 14,
    edition: 20,
    status: "stanju",
    image: "/uploads/photos-1789213046505-f1z0.jpeg",
  },
  {
    slug: "lokvanji",
    title: "Lokvanji",
    titleEn: "Water lilies",
    description:
      "Dve žabe na bari, jedna sa listom umesto kišobrana. Crtano digitalno, štampano kod štampara u Zemunu.",
    descriptionEn:
      "Two frogs on a pond, one holding a leaf like an umbrella. Drawn digitally, printed at a shop in Zemun.",
    type: "serija",
    theme: "Životinje",
    price: 320,
    stock: 18,
    edition: 30,
    status: "stanju",
    image: "/uploads/photos-1789213052897-j124.jpeg",
  },
  {
    slug: "nad-planinama",
    title: "Nad planinama",
    titleEn: "Above the mountains",
    description: "Pogled na venac planina iz balona, rano ujutru.",
    descriptionEn: "A view of a mountain range from a balloon, early in the morning.",
    type: "serija",
    theme: "Priroda",
    price: 320,
    stock: 22,
    edition: 30,
    status: "stanju",
    image: "/uploads/photos-1789213046463-48a7.jpeg",
  },
  {
    slug: "tiho-popodne",
    title: "Tiho popodne",
    titleEn: "Quiet afternoon",
    description: "Mačka na prozoru, sunce po podu, ništa se ne dešava.",
    descriptionEn: "A cat on the windowsill, sun on the floor, nothing happening.",
    type: "serija",
    theme: "Priroda",
    price: 320,
    stock: 7,
    edition: null,
    status: "stanju",
    image: "/uploads/photos-1789213052896-bmg0.jpeg",
  },
  {
    slug: "kuhinjski-sto",
    title: "Kuhinjski sto",
    titleEn: "Kitchen table",
    description: "Jutarnja kafa i novine, kuhinja u polusenci.",
    descriptionEn: "Morning coffee and a newspaper, the kitchen half in shadow.",
    type: "unikat",
    theme: "Priroda",
    price: 450,
    stock: 1,
    edition: 1,
    status: "stanju",
    image: "/uploads/photos-1789213053946-uhuf.jpeg",
  },
  {
    slug: "prvi-sneg",
    title: "Prvi sneg",
    titleEn: "First snow",
    description: "Prve pahulje na krovovima starog dela grada.",
    descriptionEn: "The first snowflakes on the rooftops of the old town.",
    type: "serija",
    theme: "Praznici",
    price: 320,
    stock: 11,
    edition: 30,
    status: "stanju",
    image: "/uploads/photos-1789213046477-sye5.jpeg",
  },
  {
    slug: "balkon",
    title: "Balkon",
    titleEn: "Balcony",
    description: "Saksije i kafa na balkonu u malom stanu.",
    descriptionEn: "Flower pots and coffee on the balcony of a small apartment.",
    type: "serija",
    theme: "Priroda",
    price: 320,
    stock: 25,
    edition: 30,
    status: "stanju",
    image: "/uploads/photos-1789213046485-t6rp.jpeg",
  },
  {
    slug: "nocna-setnja",
    title: "Noćna šetnja",
    titleEn: "Night walk",
    description: "Prazna ulica, jedna upaljena lampa, mesec pun.",
    descriptionEn: "An empty street, one lit lamp, a full moon.",
    type: "serija",
    theme: "Priroda",
    price: 320,
    stock: 16,
    edition: 30,
    status: "stanju",
    image: "/uploads/photos-1789213046467-atsv.jpeg",
  },
  {
    slug: "vetrovito",
    title: "Vetrovito",
    titleEn: "Windy",
    description: "Drveće povijeno na vetru, oblaci u trku.",
    descriptionEn: "Trees bent by the wind, clouds racing by.",
    type: "serija",
    theme: "Priroda",
    price: 320,
    stock: 0,
    edition: 25,
    status: "rasprodato",
    image: "/uploads/photos-1789213053900-rnn0.jpeg",
  },
  {
    slug: "vetar-u-granama",
    title: "Vetar u granama",
    titleEn: "Wind in the branches",
    description: "Krošnje starog parka u jesenjem vetru.",
    descriptionEn: "The treetops of an old park in the autumn wind.",
    type: "serija",
    theme: "Priroda",
    price: 320,
    stock: 20,
    edition: 30,
    status: "stanju",
    image: "/uploads/photos-1789213053938-bqr2.jpeg",
  },
];

const packages = [
  {
    slug: "paket-od-10",
    title: "Postcrossing paket od 10",
    titleEn: "Postcrossing package of 10",
    description: "Deset različitih razglednica, motive biram sama.",
    descriptionEn: "Ten different postcards, I choose the designs myself.",
    price: 2600,
    stock: 999,
    status: "stanju",
    image: "/uploads/photos-1789213052897-j124.jpeg",
  },
  {
    slug: "paket-od-20",
    title: "Postcrossing paket od 20",
    titleEn: "Postcrossing package of 20",
    description: "Dvadeset različitih razglednica, motive biram sama.",
    descriptionEn: "Twenty different postcards, I choose the designs myself.",
    price: 4800,
    stock: 999,
    status: "stanju",
    image: "/uploads/photos-1789213046431-nwo7.jpeg",
  },
];

const blogPosts = [
  {
    slug: "osam-koktela-jedna-greska-u-boji",
    tag: "Iz štampe",
    title: "Osam koktela, jedna greška u boji",
    titleEn: "Eight cocktails, one color mistake",
    excerpt:
      "Prvi otisak je izašao previše hladan. Objašnjavam šta se desilo i zašto je druga verzija bolja.",
    excerptEn:
      "The first print came out too cold. Here's what happened and why the second version is better.",
    content:
      "Prvi otisak je izašao previše hladan. Objašnjavam šta se desilo i zašto je druga verzija bolja.",
    contentEn:
      "The first print came out too cold. Here's what happened and why the second version is better.",
    image: "/uploads/photos-1789213046431-nwo7.jpeg",
    createdAt: new Date("2026-09-04"),
  },
  {
    slug: "kako-spakovati-razglednicu-da-stigne-ravna",
    tag: "Postcrossing",
    title: "Kako spakovati razglednicu da stigne ravna",
    titleEn: "How to pack a postcard so it arrives flat",
    excerpt: "Karton, koverta, i jedan trik sa selotejpom koji ne radi.",
    excerptEn: "Cardstock, an envelope, and one tape trick that doesn't work.",
    content: "Karton, koverta, i jedan trik sa selotejpom koji ne radi.",
    contentEn: "Cardstock, an envelope, and one tape trick that doesn't work.",
    image: "/uploads/photos-1789213046485-t6rp.jpeg",
    createdAt: new Date("2026-08-21"),
  },
  {
    slug: "sest-skica-koje-nikad-nisu-odstampane",
    tag: "Atelje",
    title: "Šest skica koje nikad nisu odštampane",
    titleEn: "Six sketches that never got printed",
    excerpt: "Iz sveske iz 2024. Neke su i dalje kandidati.",
    excerptEn: "From a 2024 notebook. A few are still candidates.",
    content: "Iz sveske iz 2024. Neke su i dalje kandidati.",
    contentEn: "From a 2024 notebook. A few are still candidates.",
    image: "/uploads/photos-1789213053946-uhuf.jpeg",
    createdAt: new Date("2026-08-09"),
  },
  {
    slug: "razglednica-koja-je-putovala-94-dana",
    tag: "Putovanja",
    title: "Razglednica koja je putovala 94 dana",
    titleEn: "The postcard that traveled 94 days",
    excerpt: "Beograd — Tajvan, sa dve pogrešne adrese usput.",
    excerptEn: "Belgrade — Taiwan, with two wrong addresses along the way.",
    content: "Beograd — Tajvan, sa dve pogrešne adrese usput.",
    contentEn: "Belgrade — Taiwan, with two wrong addresses along the way.",
    image: "/uploads/photos-1789213053900-rnn0.jpeg",
    createdAt: new Date("2026-07-30"),
  },
];

const aboutContent = {
  paragraph1:
    "Počela sam sa jednom razglednicom za razmenu preko Postcrossinga. Kad je stiglo pitanje da li mogu još deset, odštampala sam prvu seriju.",
  paragraph1En:
    "I started with a single postcard for a Postcrossing swap. When someone asked if I could make ten more, I printed my first batch.",
  paragraph2:
    "Sve crtam sama, digitalno i akvarelom. Štampam u Zemunu, u serijama do trideset komada. Nekoliko motiva ostane u jednom primerku — te ne štampam ponovo.",
  paragraph2En:
    "I draw everything myself, digitally and in watercolor. I print in Zemun, in batches of up to thirty. A few designs stay one-of-a-kind — I don't reprint those.",
  wholesaleText: "Veleprodaja od 50 komada naviše, cenovnik šaljem na upit.",
  wholesaleTextEn: "Wholesale from 50 pieces up, price list on request.",
};

async function main() {
  for (const p of postcards) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, kind: "postcard" },
    });
  }
  for (const p of packages) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, kind: "package" },
    });
  }
  console.log(`Seeded ${postcards.length} postcards and ${packages.length} packages.`);

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
  }
  console.log(`Seeded ${blogPosts.length} blog posts.`);

  const existingAbout = await prisma.aboutContent.findFirst();
  if (existingAbout) {
    await prisma.aboutContent.update({ where: { id: existingAbout.id }, data: aboutContent });
  } else {
    await prisma.aboutContent.create({ data: aboutContent });
  }
  console.log("Seeded about content.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
