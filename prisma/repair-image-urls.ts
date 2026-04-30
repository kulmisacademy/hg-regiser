import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.course.updateMany({
    where: {
      imageUrl: {
        startsWith: "/uploads/"
      }
    },
    data: {
      imageUrl: "/logo.jpg"
    }
  });

  console.log(`Repaired ${result.count} broken upload image URL(s).`);
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
