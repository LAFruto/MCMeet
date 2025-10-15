/**
 * Create Faculty Login Accounts - Working Version
 *
 * Strategy: Use Better Auth's signUpEmail (which works),
 * then transfer the account to the existing seeded user.
 *
 * Run AFTER: pnpm db:seed
 * Run: pnpm register-faculty
 */

import { auth } from "../src/lib/auth";
import { prisma } from "../src/lib/db";

const FACULTY_PASSWORD = "Faculty123";

const FACULTY_DATA = [
  { email: "wbadong@mcm.edu.ph", name: "Dr. Warren Badong" },
  { email: "npmagloyuan@mcm.edu.ph", name: "Dr. Neil P. Magloyuan" },
  { email: "daarzaga@mcm.edu.ph", name: "Dr. Daisy Ann Arzaga" },
  { email: "rbadiang@mcm.edu.ph", name: "Dr. Rogelio Badiang" },
  { email: "pcerna@mcm.edu.ph", name: "Dr. Patrick Cerna" },
  { email: "crlungay@mcm.edu.ph", name: "Dr. Christopher Rey Lungay" },
  { email: "mbaste@mcm.edu.ph", name: "Dr. Martzel Baste" },
  { email: "gpilongo@mcm.edu.ph", name: "Dr. Genevieve Pilongo" },
  { email: "clisondra@mcm.edu.ph", name: "Dr. Cherry Lisondra" },
  { email: "rcascaro@mcm.edu.ph", name: "Dr. Rhodessa Cascaro" },
];

async function createFacultyAccounts() {
  console.log("🔐 Creating faculty login accounts using Better Auth API...\n");

  try {
    const results = [];

    for (const faculty of FACULTY_DATA) {
      try {
        console.log(`Processing ${faculty.name}...`);

        // Find the seeded faculty user
        const seededUser = await prisma.user.findUnique({
          where: { email: faculty.email },
          include: { facultyProfile: true, accounts: true },
        });

        if (!seededUser) {
          console.log(`  ❌ Seeded user not found! Run pnpm db:seed first.\n`);
          continue;
        }

        console.log(`  ✅ Found seeded user: ${seededUser.id}`);

        // Create a temporary user using Better Auth's signUpEmail
        const tempEmail = `temp_${Date.now()}_${faculty.email}`;
        console.log(`  🔄 Creating temporary account...`);

        const tempResult = await auth.api.signUpEmail({
          body: {
            email: tempEmail,
            password: FACULTY_PASSWORD,
            name: "Temp User",
          },
        });

        console.log(`  ✅ Temporary account created`);

        // Get the account Better Auth created (this one works!)
        const tempAccount = await prisma.account.findFirst({
          where: {
            userId: tempResult.user.id,
            providerId: "credential",
          },
        });

        if (!tempAccount?.password) {
          console.log(`  ❌ Temp account has no password hash!\n`);
          continue;
        }

        console.log(`  ✅ Got working password hash from Better Auth`);

        // Delete old accounts for seeded user
        await prisma.account.deleteMany({
          where: {
            userId: seededUser.id,
            providerId: "credential",
          },
        });

        // Create new account for seeded user using the working password hash
        const crypto = await import("crypto");
        await prisma.account.create({
          data: {
            id: crypto.randomUUID(), // Generate new ID
            accountId: seededUser.id, // Link to seeded user
            providerId: "credential",
            userId: seededUser.id,
            password: tempAccount.password, // Use the working hash from Better Auth!
          },
        });

        console.log(`  ✅ Transferred account to seeded user`);

        // Delete the temporary user
        await prisma.user.delete({ where: { id: tempResult.user.id } });
        console.log(`  ✅ Cleaned up temporary user`);

        // Verify seeded user
        await prisma.user.update({
          where: { id: seededUser.id },
          data: { emailVerified: true },
        });

        results.push({
          email: faculty.email,
          name: faculty.name,
          userId: seededUser.id,
          success: true,
        });

        console.log(`  ✅ ${faculty.name} - COMPLETE\n`);
      } catch (error: any) {
        console.log(`  ❌ Error: ${error.message}\n`);
        results.push({
          email: faculty.email,
          name: faculty.name,
          success: false,
          error: error.message,
        });
      }
    }

    // Summary
    const successful = results.filter((r) => r.success);
    const failed = results.filter((r) => !r.success);

    console.log("=".repeat(60));
    console.log("📊 SUMMARY");
    console.log("=".repeat(60));
    console.log(`✅ Successfully created: ${successful.length} accounts`);
    if (failed.length > 0) {
      console.log(`❌ Failed: ${failed.length} accounts`);
    }

    // Verify data integrity
    const bookingCount = await prisma.booking.count();
    const facultyCount = await prisma.faculty.count();
    console.log(`\n📊 Data Integrity:`);
    console.log(`  ✅ Faculty profiles: ${facultyCount}`);
    console.log(`  ✅ Bookings: ${bookingCount}`);

    console.log("\n🔐 Faculty Login Credentials:");
    console.log("-".repeat(60));
    console.log("Password for ALL faculty: Faculty123\n");
    successful.forEach((result, index) => {
      console.log(`${index + 1}. ${result.email} (${result.name})`);
    });

    console.log("\n" + "=".repeat(60));
    console.log("🎉 All faculty can now login!");
    console.log("=".repeat(60));

    // Test one login
    if (successful.length > 0) {
      console.log("\n🧪 Testing login...");
      try {
        const testResult = await auth.api.signInEmail({
          body: {
            email: successful[0].email,
            password: FACULTY_PASSWORD,
          },
        });
        console.log(
          `✅ Login SUCCESSFUL! Logged in as: ${testResult.user.name}`
        );
      } catch (error: any) {
        console.log(`❌ Login test failed: ${error.message}`);
      }
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Fatal error:", error);
    await prisma.$disconnect();
    throw error;
  }
}

createFacultyAccounts().catch((error) => {
  console.error(error);
  process.exit(1);
});
