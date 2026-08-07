"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function updateHomePage(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = {
    mainText:    (formData.get("mainText")    as string | null)?.trim() || null,
    quote:       (formData.get("quote")       as string | null)?.trim() || null,
    marqueeText: (formData.get("marqueeText") as string | null)?.trim() || null,
  };

  await prisma.homePage.upsert({
    where:  { key: "home" },
    update: data,
    create: { key: "home", ...data },
  });

  revalidatePath("/");
  redirect("/admin/pages?saved=home");
}

export async function updateAboutPage(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const data = {
    biography:         (formData.get("biography")         as string | null)?.trim() || null,
    artisticJourney:   (formData.get("artisticJourney")   as string | null)?.trim() || null,
    education:         (formData.get("education")         as string | null)?.trim() || null,
    influences:        (formData.get("influences")        as string | null)?.trim() || null,
    institutionalText: (formData.get("institutionalText") as string | null)?.trim() || null,
    heroSubtitle:      (formData.get("heroSubtitle")      as string | null)?.trim() || null,
    birthplace:        (formData.get("birthplace")        as string | null)?.trim() || null,
    mainTechnique:     (formData.get("mainTechnique")     as string | null)?.trim() || null,
    curatorRole:       (formData.get("curatorRole")       as string | null)?.trim() || null,
  };

  await prisma.aboutPage.upsert({
    where:  { key: "about" },
    update: data,
    create: { key: "about", ...data },
  });

  revalidatePath("/sobre");
  redirect("/admin/pages?saved=about");
}
