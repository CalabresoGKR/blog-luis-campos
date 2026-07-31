"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { ArtworkStatus } from "@prisma/client";

async function saveImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
  const filename = `${crypto.randomUUID()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");

  await fs.mkdir(uploadDir, { recursive: true });
  await fs.writeFile(path.join(uploadDir, filename), buffer);

  const media = await prisma.media.create({
    data: {
      url: `/uploads/${filename}`,
      filename: file.name,
      mimeType: file.type || "image/jpeg",
      size: file.size,
      type: "IMAGE",
    },
  });

  return media.id;
}

function parseForm(formData: FormData) {
  return {
    title: (formData.get("title") as string).trim(),
    slugRaw: (formData.get("slug") as string | null)?.trim() ?? "",
    year: formData.get("year") ? Number(formData.get("year")) : null,
    technique: (formData.get("technique") as string | null)?.trim() || null,
    dimensions: (formData.get("dimensions") as string | null)?.trim() || null,
    description: (formData.get("description") as string | null)?.trim() || null,
    status: ((formData.get("status") as string) || "AVAILABLE") as ArtworkStatus,
    currentLocation: (formData.get("currentLocation") as string | null)?.trim() || null,
    imageFile: formData.get("image") as File | null,
  };
}

export async function createArtwork(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { title, slugRaw, year, technique, dimensions, description, status, currentLocation, imageFile } =
    parseForm(formData);

  const slug = slugRaw || slugify(title);

  let featuredImageId: string | undefined;
  if (imageFile && imageFile.size > 0) {
    featuredImageId = (await saveImage(imageFile)) ?? undefined;
  }

  await prisma.artwork.create({
    data: { title, slug, year, technique, dimensions, description, status, currentLocation, featuredImageId },
  });

  revalidatePath("/obras");
  revalidatePath("/");
  redirect("/admin/artworks");
}

export async function updateArtwork(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { title, slugRaw, year, technique, dimensions, description, status, currentLocation, imageFile } =
    parseForm(formData);

  const slug = slugRaw || slugify(title);

  let featuredImageId: string | undefined;
  if (imageFile && imageFile.size > 0) {
    featuredImageId = (await saveImage(imageFile)) ?? undefined;
  }

  await prisma.artwork.update({
    where: { id },
    data: {
      title,
      slug,
      year,
      technique,
      dimensions,
      description,
      status,
      currentLocation,
      ...(featuredImageId ? { featuredImageId } : {}),
    },
  });

  revalidatePath("/obras");
  revalidatePath(`/obras/${slug}`);
  revalidatePath("/");
  redirect("/admin/artworks");
}

export async function deleteArtwork(id: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.artwork.delete({ where: { id } });

  revalidatePath("/obras");
  revalidatePath("/");
  redirect("/admin/artworks");
}
