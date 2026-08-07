"use server";

import { prisma } from "./prisma";

export async function saveImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  let url: string;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Produção: Vercel Blob
    const { put } = await import("@vercel/blob");
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `uploads/${crypto.randomUUID()}.${ext}`;
    const blob = await put(filename, file, {
      access: "public",
      contentType: file.type || "image/jpeg",
    });
    url = blob.url;
  } else {
    // Desenvolvimento: sistema de ficheiros local
    const fs = await import("fs/promises");
    const path = await import("path");
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg";
    const filename = `${crypto.randomUUID()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadDir, { recursive: true });
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    url = `/uploads/${filename}`;
  }

  const media = await prisma.media.create({
    data: {
      url,
      filename: file.name,
      mimeType: file.type || "image/jpeg",
      size: file.size,
      type: "IMAGE",
    },
  });

  return media.id;
}
