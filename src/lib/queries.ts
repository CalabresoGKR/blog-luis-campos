import { prisma } from "./prisma";

// ── Artworks ──────────────────────────────────────────────────

export async function getArtworks(options?: {
  take?: number;
  skip?: number;
  status?: string;
}) {
  return prisma.artwork.findMany({
    where: options?.status ? { status: options.status as never } : undefined,
    take: options?.take,
    skip: options?.skip,
    orderBy: [{ year: "desc" }, { createdAt: "desc" }],
    include: {
      featuredImage: { select: { url: true, alt: true } },
    },
  });
}

export async function getArtworkBySlug(slug: string) {
  return prisma.artwork.findUnique({
    where: { slug },
    include: {
      featuredImage: { select: { url: true, alt: true } },
      images: {
        orderBy: { order: "asc" },
        include: { media: { select: { url: true, alt: true } } },
      },
    },
  });
}

export async function getFeaturedArtworks(take = 6) {
  return prisma.artwork.findMany({
    take,
    orderBy: { createdAt: "desc" },
    include: { featuredImage: { select: { url: true, alt: true } } },
  });
}

export async function getRelatedArtworks(slug: string, take = 4) {
  return prisma.artwork.findMany({
    where: { slug: { not: slug } },
    take,
    orderBy: { createdAt: "desc" },
    include: { featuredImage: { select: { url: true, alt: true } } },
  });
}

// ── Blog ──────────────────────────────────────────────────────

export async function getPosts(options?: { take?: number; skip?: number }) {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    take: options?.take,
    skip: options?.skip,
    orderBy: { publishedAt: "desc" },
    include: {
      featuredImage: { select: { url: true, alt: true } },
      author: { select: { name: true } },
      categories: { select: { name: true, slug: true } },
    },
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug, status: "PUBLISHED" },
    include: {
      featuredImage: { select: { url: true, alt: true } },
      author: { select: { name: true } },
      categories: { select: { name: true, slug: true } },
      tags: { select: { name: true, slug: true } },
      images: {
        orderBy: { order: "asc" },
        include: { media: { select: { url: true, alt: true } } },
      },
    },
  });
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { posts: true } } },
  });
}

// ── Exhibitions ───────────────────────────────────────────────

export async function getExhibitions() {
  return prisma.exhibition.findMany({
    orderBy: { startDate: "desc" },
    include: {
      images: {
        orderBy: { order: "asc" },
        take: 1,
        include: { media: { select: { url: true, alt: true } } },
      },
    },
  });
}

export async function getExhibitionBySlug(slug: string) {
  return prisma.exhibition.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: "asc" },
        include: { media: { select: { url: true, alt: true } } },
      },
    },
  });
}

// ── Singleton pages ───────────────────────────────────────────

export async function getHomePage() {
  return prisma.homePage.findFirst({
    include: { mainImage: { select: { url: true, alt: true } } },
  });
}

export async function getAboutPage() {
  return prisma.aboutPage.findFirst({
    include: { artistPhoto: { select: { url: true, alt: true } } },
  });
}

export async function getContactInfo() {
  return prisma.contactInfo.findFirst({
    include: { socials: { orderBy: { order: "asc" } } },
  });
}

// ── Map ───────────────────────────────────────────────────────

export async function getMapPins() {
  return prisma.mapPin.findMany({
    include: {
      artwork: { select: { title: true, slug: true, year: true } },
      image: { select: { url: true, alt: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
