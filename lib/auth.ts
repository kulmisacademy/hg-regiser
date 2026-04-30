import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { hasDatabaseUrl, prisma } from "@/lib/prisma";

const cookieName = "hoggaan_admin";

async function sign(value: string) {
  const secret = process.env.SESSION_SECRET ?? "dev-secret";
  const data = new TextEncoder().encode(`${value}.${secret}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(digest).toString("hex");
}

export async function createAdminSession(email: string) {
  const signature = await sign(email);
  const store = await cookies();
  store.set(cookieName, `${email}.${signature}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(cookieName);
}

export async function getAdminEmail() {
  const store = await cookies();
  const raw = store.get(cookieName)?.value;
  if (!raw) return null;

  const separator = raw.lastIndexOf(".");
  const email = raw.slice(0, separator);
  const signature = raw.slice(separator + 1);
  if (!email || !signature) return null;

  return (await sign(email)) === signature ? email : null;
}

export async function requireAdmin() {
  const email = await getAdminEmail();
  if (!email) redirect("/admin/login");
  return email;
}

export async function validateAdmin(email: string, password: string) {
  if (hasDatabaseUrl) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return bcrypt.compare(password, user.password);
    }
  }

  const envEmail = process.env.ADMIN_EMAIL;
  const envPassword = process.env.ADMIN_PASSWORD;
  return Boolean(envEmail && envPassword && email === envEmail && password === envPassword);
}
