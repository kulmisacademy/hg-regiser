import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateShortSlug() {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  let slug = "";
  for (let index = 0; index < 6; index += 1) {
    slug += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return slug;
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(date));
}
