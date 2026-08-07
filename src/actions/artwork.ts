"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { saveImage } from "@/lib/upload";
import type { ArtworkStatus } from "@prisma/client";

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
