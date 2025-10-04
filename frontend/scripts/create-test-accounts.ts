/**
 * Script to create test accounts using Better Auth API
 * This ensures proper password hashing and account setup
 *
 * Run with: npx tsx scripts/create-test-accounts.ts
 */

async function createAccount(email: string, password: string, name: string) {
  try {
    const response = await fetch(
      "http://localhost:3000/api/auth/sign-up/email",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(`Failed to create account for ${email}:`, data);
      return null;
    }

    console.log(`✓ Created account: ${email}`);
    return data;
  } catch (error) {
    console.error(`Error creating account for ${email}:`, error);
    return null;
  }
}

async function main() {
  console.log("Creating test accounts...\n");
  console.log("Make sure your dev server is running (pnpm dev)\n");

  // Wait a bit to ensure message is read
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Create student account
  const student = await createAccount(
    "student@mcmeet.dev",
    "Student123!",
    "John Student"
  );

  // Create admin account
  const admin = await createAccount(
    "admin@mcmeet.dev",
    "Admin123!",
    "Admin User"
  );

  if (student && admin) {
    console.log("\n✓ All accounts created successfully!");
    console.log(
      "\nNOTE: You need to manually update the admin role in the database:"
    );
    console.log("  1. Run: npx prisma studio");
    console.log("  2. Find user: admin@mcmeet.dev");
    console.log("  3. Change 'role' field from 'student' to 'admin'");
    console.log("  4. Save changes");

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("\nTest Accounts:");
    console.log("\nStudent Account:");
    console.log("  Email:    student@mcmeet.dev");
    console.log("  Password: Student123!");
    console.log("\nAdmin Account:");
    console.log("  Email:    admin@mcmeet.dev");
    console.log("  Password: Admin123!");
    console.log("  (Remember to set role='admin' in database)");
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  } else {
    console.error("\nFailed to create some accounts. Check errors above.");
    process.exit(1);
  }
}

main().catch(console.error);
