"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Role } from "@prisma/client";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return session.user;
}

export async function createUser(formData: FormData) {
  await requireAdmin();

  const name     = (formData.get("name")     as string).trim();
  const email    = (formData.get("email")    as string).trim().toLowerCase();
  const password = (formData.get("password") as string);
  const role     = (formData.get("role")     as Role) ?? "EDITOR";

  if (!name || !email || !password) redirect("/admin/users/new?error=missing");
  if (password.length < 8)          redirect("/admin/users/new?error=short");

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) redirect("/admin/users/new?error=exists");

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.create({ data: { name, email, passwordHash, role } });

  revalidatePath("/admin/users");
  redirect("/admin/users?created=1");
}

export async function updateUser(id: string, formData: FormData) {
  const me = await requireAdmin();

  const name     = (formData.get("name")  as string).trim();
  const role     = (formData.get("role")  as Role) ?? "EDITOR";
  const password = (formData.get("password") as string | null)?.trim();

  const data: Record<string, unknown> = { name, role };
  if (password && password.length >= 8) {
    data.passwordHash = await bcrypt.hash(password, 12);
  }

  // não permite alterar o próprio role
  if (me.id === id) delete data.role;

  await prisma.user.update({ where: { id }, data });

  revalidatePath("/admin/users");
  redirect("/admin/users?saved=1");
}

export async function deleteUser(id: string) {
  const me = await requireAdmin();
  if (me.id === id) redirect("/admin/users?error=self");

  await prisma.user.delete({ where: { id } });

  revalidatePath("/admin/users");
  redirect("/admin/users");
}
