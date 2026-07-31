"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { PostStatus } from "@prisma/client";

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

// Converte texto simples em parágrafos HTML
function textToHtml(text: string): string {
  return text
    .split(/\n\n+/)
    .filter((p) => p.trim())
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("\n");
}

function parseForm(formData: FormData) {
  const statusRaw = formData.get("status") as string;
  return {
    title:     (formData.get("title") as string).trim(),
    slugRaw:   (formData.get("slug") as string | null)?.trim() ?? "",
    excerpt:   (formData.get("excerpt") as string | null)?.trim() || null,
    content:   textToHtml((formData.get("content") as string | null) ?? ""),
    status:    (statusRaw || "DRAFT") as PostStatus,
    imageFile: formData.get("image") as File | null,
  };
}

export async function createPost(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { title, slugRaw, excerpt, content, status, imageFile } = parseForm(formData);
  const slug = slugRaw || slugify(title);

  let featuredImageId: string | undefined;
  if (imageFile && imageFile.size > 0) {
    featuredImageId = (await saveImage(imageFile)) ?? undefined;
  }

  await prisma.post.create({
    data: {
      title,
      slug,
      excerpt,
      content,
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
      authorId:    session.user.id ?? undefined,
      featuredImageId,
    },
  });

  revalidatePath("/blog");
  redirect("/admin/posts");
}

export async function updatePost(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { title, slugRaw, excerpt, content, status, imageFile } = parseForm(formData);
  const slug = slugRaw || slugify(title);

  const existing = await prisma.post.findUnique({ where: { id }, select: { publishedAt: true, status: true } });

  let featuredImageId: string | undefined;
  if (imageFile && imageFile.size > 0) {
    featuredImageId = (await saveImage(imageFile)) ?? undefined;
  }

  const publishedAt =
    status === "PUBLISHED" && existing?.status !== "PUBLISHED"
      ? new Date()
      : existing?.publishedAt ?? null;

  await prisma.post.update({
    where: { id },
    data: {
      title,
      slug,
      excerpt,
      content,
      status,
      publishedAt,
      ...(featuredImageId ? { featuredImageId } : {}),
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  redirect("/admin/posts");
}

export async function deletePost(id: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.post.delete({ where: { id } });

  revalidatePath("/blog");
  redirect("/admin/posts");
}
