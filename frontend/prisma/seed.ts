import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seeding...");

  // Better Auth's signUp endpoint should be used, but for direct seeding:
  // We need to use Better Auth's internal password hashing

  // For now, let's create users that can be accessed via password reset
  // or we can use the Better Auth CLI to create users

  // Create student user
  const student = await prisma.user.upsert({
    where: { email: "student@mcmeet.dev" },
    update: {},
    create: {
      id: "student_001",
      name: "John Student",
      email: "student@mcmeet.dev",
      emailVerified: true,
      role: "student",
    },
  });

  console.log("Created student user: student@mcmeet.dev");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@mcmeet.dev" },
    update: {},
    create: {
      id: "admin_001",
      name: "Admin User",
      email: "admin@mcmeet.dev",
      emailVerified: true,
      role: "admin",
    },
  });

  console.log("Created admin user: admin@mcmeet.dev");

  console.log("\n Seeding completed successfully!");
  console.log(
    "\n To set passwords for these accounts, use the Better Auth API:"
  );
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("\n 1. Start your dev server: pnpm dev");
  console.log(" 2. Visit http://localhost:3000/login");
  console.log(' 3. Click "Forgot Password?" for each account');
  console.log(" 4. Check console logs for reset links (no SMTP needed)");
  console.log("\n Or use the signup flow to create accounts with passwords:");
  console.log(" - Student: student@mcmeet.dev");
  console.log(
    " - Admin: admin@mcmeet.dev (manually set role in DB after signup)"
  );
  console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
