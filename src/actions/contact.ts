"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function updateContact(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const email   = (formData.get("email")   as string | null)?.trim() || null;
  const phone   = (formData.get("phone")   as string | null)?.trim() || null;
  const address = (formData.get("address") as string | null)?.trim() || null;
  const hours   = (formData.get("hours")   as string | null)?.trim() || null;

  // Recolhe pares plataforma/url dinamicamente
  const socials: { platform: string; url: string; order: number }[] = [];
  let i = 0;
  while (formData.has(`social_platform_${i}`)) {
    const platform = (formData.get(`social_platform_${i}`) as string).trim();
    const url      = (formData.get(`social_url_${i}`)      as string).trim();
    if (platform && url) socials.push({ platform, url, order: i });
    i++;
  }

  const contact = await prisma.contactInfo.upsert({
    where:  { key: "contact" },
    update: { email, phone, address, hours },
    create: { key: "contact", email, phone, address, hours },
  });

  await prisma.socialLink.deleteMany({ where: { contactId: contact.id } });
  if (socials.length > 0) {
    await prisma.socialLink.createMany({
      data: socials.map((s) => ({ ...s, contactId: contact.id })),
    });
  }

  revalidatePath("/contactos");
  redirect("/admin/contacts?saved=1");
}
