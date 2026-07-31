"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";

function parseForm(formData: FormData) {
  return {
    title:      (formData.get("title")       as string).trim(),
    slugRaw:    (formData.get("slug")        as string | null)?.trim() ?? "",
    venue:      (formData.get("venue")       as string | null)?.trim() || null,
    city:       (formData.get("city")        as string | null)?.trim() || null,
    country:    (formData.get("country")     as string | null)?.trim() || null,
    description:(formData.get("description") as string | null)?.trim() || null,
    startDate:  (formData.get("startDate")   as string | null)?.trim() || null,
    endDate:    (formData.get("endDate")     as string | null)?.trim() || null,
  };
}

export async function createExhibition(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { title, slugRaw, venue, city, country, description, startDate, endDate } = parseForm(formData);
  const slug = slugRaw || slugify(title);

  await prisma.exhibition.create({
    data: {
      title, slug, venue, city, country, description,
      startDate: startDate ? new Date(startDate) : null,
      endDate:   endDate   ? new Date(endDate)   : null,
    },
  });

  revalidatePath("/exposicoes");
  redirect("/admin/exhibitions");
}

export async function updateExhibition(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { title, slugRaw, venue, city, country, description, startDate, endDate } = parseForm(formData);
  const slug = slugRaw || slugify(title);

  await prisma.exhibition.update({
    where: { id },
    data: {
      title, slug, venue, city, country, description,
      startDate: startDate ? new Date(startDate) : null,
      endDate:   endDate   ? new Date(endDate)   : null,
    },
  });

  revalidatePath("/exposicoes");
  redirect("/admin/exhibitions");
}

export async function deleteExhibition(id: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.exhibition.delete({ where: { id } });

  revalidatePath("/exposicoes");
  redirect("/admin/exhibitions");
}
