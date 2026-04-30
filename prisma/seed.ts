import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const defaultFields = [
  { label: "Full Name", name: "fullName", type: "text", required: true },
  { label: "Phone Number", name: "phone", type: "phone", required: true },
  { label: "District", name: "district", type: "dropdown", required: true, options: ["Hodan", "Wadajir", "Daynile"] },
  { label: "Notes", name: "notes", type: "textarea", required: false }
];

async function main() {
  const email = process.env.ADMIN_EMAIL ?? "admin@hoggaan.academy";
  const password = process.env.ADMIN_PASSWORD ?? "change-me";

  await prisma.user.upsert({
    where: { email },
    update: {
      password: await bcrypt.hash(password, 10)
    },
    create: {
      email,
      password: await bcrypt.hash(password, 10)
    }
  });

  const course = await prisma.course.upsert({
    where: { id: "hoggaan-web-dev" },
    update: {},
    create: {
      id: "hoggaan-web-dev",
      title: "Web Development",
      slug: "webdev01",
      description: "Learn HTML, CSS, JavaScript, React, and deployment through practical projects.",
      imageUrl: "/logo.jpg"
    }
  });

  await prisma.form.upsert({
    where: { courseId: course.id },
    update: {},
    create: {
      courseId: course.id,
      schemaJson: { fields: defaultFields }
    }
  });
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
