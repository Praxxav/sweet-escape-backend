import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Hash admin password
  const adminPassword = await bcrypt.hash("admin123", 10);

  // Upsert = create if not exists, otherwise skip
  await prisma.user.upsert({
    where: { email: "admin@sweetshop.com" },
    update: {}, // don't overwrite if already exists
    create: {
      email: "admin@sweetshop.com",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ Admin user seeded: admin@sweetshop.com / admin123");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
