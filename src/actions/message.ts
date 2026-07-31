"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type MessageState = { ok: true } | { ok: false; error: string } | null;

export async function sendMessage(
  _prev: MessageState,
  formData: FormData
): Promise<MessageState> {
  const name    = (formData.get("name")    as string | null)?.trim() ?? "";
  const email   = (formData.get("email")   as string | null)?.trim() ?? "";
  const subject = (formData.get("subject") as string | null)?.trim() || null;
  const body    = (formData.get("body")    as string | null)?.trim() ?? "";

  if (!name || !email || !body) {
    return { ok: false, error: "Preenche o nome, email e mensagem." };
  }

  try {
    await prisma.message.create({ data: { name, email, subject, body } });
    return { ok: true };
  } catch {
    return { ok: false, error: "Erro ao enviar mensagem. Tenta novamente." };
  }
}

export async function deleteMessage(id: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.message.delete({ where: { id } });
  revalidatePath("/admin/messages");
}

export async function markAsRead(id: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.message.update({ where: { id }, data: { read: true } });
  revalidatePath("/admin/messages");
}
