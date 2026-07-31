import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

const EXHIBITIONS = [
  // 2014
  { year: 2014, title: "Exposição Coletiva — Rendufas",              venue: "Centro Cultural e Recreativo de Rendufas", city: "Rendufas",      country: "Portugal" },
  { year: 2014, title: "Entroncarte 2014",                           venue: "Entroncarte",                              city: "Entroncamento", country: "Portugal" },
  // 2015
  { year: 2015, title: "Uma Segunda Pele",                           venue: null,                                       city: "Alcanena",      country: "Portugal" },
  { year: 2015, title: "17, 17, 17",                                 venue: "Hotel dos Cavaleiros",                     city: "Torres Novas",  country: "Portugal" },
  { year: 2015, title: "Exposição — Café O Cabaço",                  venue: "Café O Cabaço",                            city: "Abrantes",      country: "Portugal" },
  { year: 2015, title: "Leiriarte 2015",                             venue: "Leiriarte",                                city: "Leiria",        country: "Portugal" },
  { year: 2015, title: "Exposição — Pastelaria Juma Flor",           venue: "Pastelaria Juma Flor",                     city: "Mira D'Aire",   country: "Portugal" },
  // 2016
  { year: 2016, title: "Exposição — Pastelaria Portugal",            venue: "Pastelaria Portugal",                      city: "Torres Novas",  country: "Portugal" },
  // 2018
  { year: 2018, title: "Entroncarte 2018",                           venue: "Entroncarte",                              city: "Entroncamento", country: "Portugal" },
  // 2022
  { year: 2022, title: "Alcartárt 2022",                             venue: "Alcartárt",                                city: "Alcanena",      country: "Portugal" },
  { year: 2022, title: "Exposição — Montepío de Nossa Senhora",      venue: "Montepío de Nossa Senhora",                city: "Torres Novas",  country: "Portugal" },
  // 2023
  { year: 2023, title: "Bioarte 2023",                               venue: "Bioarte",                                  city: "Cartaxo",       country: "Portugal" },
  { year: 2023, title: "1ª Feira de Arte — Oeiras",                  venue: null,                                       city: "Oeiras",        country: "Portugal" },
  { year: 2023, title: "Renduarte",                                  venue: "Renduarte",                                city: "Rendufas",      country: "Portugal", endYear: 2025 },
  // 2025
  { year: 2025, title: "Exposição Coletiva — Círculo Artur Bual",    venue: "Círculo Artur Bual",                       city: "Odivelas",      country: "Portugal" },
  { year: 2025, title: "Exposição — Centro Cultural de Setúbal",     venue: "Centro Cultural de Setúbal",               city: "Setúbal",       country: "Portugal" },
  { year: 2025, title: "Concurso de Pintura Artiset",                venue: "Casa da Cultura",                          city: "Setúbal",       country: "Portugal" },
  // 2026
  { year: 2026, title: "Exposição Coletiva — Casa de Cultura Artiset", venue: "Casa de Cultura Artiset",               city: "Setúbal",       country: "Portugal" },
  { year: 2026, title: "Coletiva Internacional — Arte com Propósito", venue: null,                                      city: "Bogotá",        country: "Colômbia" },
  { year: 2026, title: "100 Artistas — Centenário Artur Bual",       venue: "Casa das Artes Mário Elias",               city: "Mértola",       country: "Portugal" },
  { year: 2026, title: "Exposição e Concerto Maria Leon",             venue: "Coliseu de Lisboa",                        city: "Lisboa",        country: "Portugal" },
  { year: 2026, title: "Exposição Coletiva — Rendufas 2026",         venue: "Centro Cultural e Recreativo das Rendufas", city: "Rendufas",     country: "Portugal" },
  { year: 2026, title: 'Art Contemporary — Os Cunhas',               venue: "Restaurante Os Cunhas",                    city: "Cacém",         country: "Portugal" },
  { year: 2026, title: "Exposição — Museu Música Mecânica",          venue: "Museu Música Mecânica",                    city: "Pinhal Novo",   country: "Portugal" },
] as Array<{ year: number; title: string; venue: string | null; city: string; country: string; endYear?: number }>;

async function main() {
  // ── Utilizador admin ──────────────────────────────────────────
  const email    = process.env.SEED_ADMIN_EMAIL    ?? "admin@exemplo.pt";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";
  const name     = process.env.SEED_ADMIN_NAME     ?? "Administrador";
  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where:  { email },
    update: {},
    create: { email, name, passwordHash, role: Role.ADMIN },
  });
  console.log(`✓ Admin: ${admin.email}`);

  // ── Contactos ─────────────────────────────────────────────────
  const contact = await prisma.contactInfo.upsert({
    where:  { key: "contact" },
    update: {
      email:   "luiscampos.art@gmail.com",
      phone:   "918 520 491",
      address: "Rua da Escola, n.º 8\n2350-848 Zibreira\nTorres Novas, Portugal",
      hours:   "Por agendamento",
    },
    create: {
      key:     "contact",
      email:   "luiscampos.art@gmail.com",
      phone:   "918 520 491",
      address: "Rua da Escola, n.º 8\n2350-848 Zibreira\nTorres Novas, Portugal",
      hours:   "Por agendamento",
    },
  });
  await prisma.socialLink.deleteMany({ where: { contactId: contact.id } });
  await prisma.socialLink.create({
    data: { platform: "Instagram", url: "https://www.instagram.com/luiscampos.art", order: 0, contactId: contact.id },
  });
  console.log("✓ Contactos");

  // ── Página Sobre ──────────────────────────────────────────────
  await prisma.aboutPage.upsert({
    where:  { key: "about" },
    update: {
      biography: "Nasci na Zibreira (Torres Novas), a 9 de Outubro de 1985. Desde cedo a arte fez parte da minha vida — comecei na pirografia em 2005, explorei o Scroll Saw em 2012 com o Mestre Pedro Santos e, em 2019, abri novos horizontes com o Desenho a Carvão e a Acrílico.\n\nEm 2020 iniciei o curso de Arteterapia, que conclui em 2022, paralelamente à formação em Curadoria. Desde 2014 que participo em exposições coletivas e individuais por todo o país.\n\nNeste momento dedico-me inteiramente à xilogravura — uma arte de subtração, onde cada talho na madeira é uma decisão irreversível e o que sobra é a imagem.",
      artisticJourney: "Curador no Arts Lounge do Hotel dos Cavaleiros em Torres Novas desde 2024. Participei em mais de 26 exposições em Portugal e internacionalmente, incluindo uma coletiva na Colômbia em 2026.",
      education: "Arteterapia (2020–2022) · Curadoria (2022) · Scroll Saw com Mestre Pedro Santos (2012) · Pirografia (2005)",
      influences: "Mestre Pedro Santos — figura central na aprendizagem do Scroll Saw e na consolidação de uma prática artística rigorosa. O mestre Artur Bual e a tradição da gravura europeia são também referências permanentes.",
      institutionalText: "\"Cada talho na madeira é uma decisão irreversível. É onde a arte e o ofício se tornam a mesma coisa.\"",
    },
    create: {
      key:      "about",
      biography: "Nasci na Zibreira (Torres Novas), a 9 de Outubro de 1985. Desde cedo a arte fez parte da minha vida — comecei na pirografia em 2005, explorei o Scroll Saw em 2012 com o Mestre Pedro Santos e, em 2019, abri novos horizontes com o Desenho a Carvão e a Acrílico.\n\nEm 2020 iniciei o curso de Arteterapia, que conclui em 2022, paralelamente à formação em Curadoria. Desde 2014 que participo em exposições coletivas e individuais por todo o país.\n\nNeste momento dedico-me inteiramente à xilogravura — uma arte de subtração, onde cada talho na madeira é uma decisão irreversível e o que sobra é a imagem.",
      artisticJourney: "Curador no Arts Lounge do Hotel dos Cavaleiros em Torres Novas desde 2024. Participei em mais de 26 exposições em Portugal e internacionalmente, incluindo uma coletiva na Colômbia em 2026.",
      education: "Arteterapia (2020–2022) · Curadoria (2022) · Scroll Saw com Mestre Pedro Santos (2012) · Pirografia (2005)",
      influences: "Mestre Pedro Santos — figura central na aprendizagem do Scroll Saw e na consolidação de uma prática artística rigorosa. O mestre Artur Bual e a tradição da gravura europeia são também referências permanentes.",
      institutionalText: "\"Cada talho na madeira é uma decisão irreversível. É onde a arte e o ofício se tornam a mesma coisa.\"",
    },
  });
  console.log("✓ Página Sobre");

  // ── Página Inicial ─────────────────────────────────────────────
  await prisma.homePage.upsert({
    where:  { key: "home" },
    update: { mainText: "Xilogravura é uma arte de subtração.\nO artista remove tudo o que não é a obra —\no que sobra é a imagem." },
    create: { key: "home", mainText: "Xilogravura é uma arte de subtração.\nO artista remove tudo o que não é a obra —\no que sobra é a imagem." },
  });
  console.log("✓ Página Inicial");

  // ── Exposições ─────────────────────────────────────────────────
  let created = 0;
  for (const expo of EXHIBITIONS) {
    const slug      = slugify(`${expo.year}-${expo.title}`);
    const startDate = new Date(`${expo.year}-01-01`);
    const endDate   = expo.endYear ? new Date(`${expo.endYear}-12-31`) : new Date(`${expo.year}-12-31`);

    await prisma.exhibition.upsert({
      where:  { slug },
      update: { title: expo.title, venue: expo.venue, city: expo.city, country: expo.country, startDate, endDate },
      create: { slug,  title: expo.title, venue: expo.venue, city: expo.city, country: expo.country, startDate, endDate },
    });
    created++;
  }
  console.log(`✓ ${created} exposições`);

  console.log("\n🎉 Seed concluído!");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
