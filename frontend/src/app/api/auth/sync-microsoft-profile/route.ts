import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST() {
  const hdrs = await headers();

  const session = await auth.api.getSession({ headers: hdrs });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = (session as any).user.id as string;

    // Load current user to see which fields are empty
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, department: true, phone: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If everything is already populated, no work
    if (user.name && user.department && user.phone) {
      return NextResponse.json({ message: "Profile already complete" });
    }

    // Get Microsoft access token for this user
    const account = await prisma.account.findFirst({
      where: { userId, providerId: "microsoft" },
      select: { accessToken: true, idToken: true },
    });

    let me: any = {};
    if (account?.accessToken) {
      // Try Graph first if we have access token
      const graphResp = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: { Authorization: `Bearer ${account.accessToken}` },
      });

      if (graphResp.ok) {
        me = await graphResp.json();
      }
    }

    // If Graph is unavailable (missing scope/token), fall back to decoding id_token
    if ((!me || Object.keys(me).length === 0) && account?.idToken) {
      try {
        const parts = account.idToken.split(".");
        if (parts.length >= 2) {
          const payload = JSON.parse(
            Buffer.from(parts[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
          );
          // Normalize some common claim names
          me = {
            displayName: payload.name,
            givenName: payload.given_name,
            surname: payload.family_name,
            mail: payload.email || payload.preferred_username,
          };
        }
      } catch (_) {
        // ignore id token parse errors
      }
    }

    // Prepare updates only for empty fields
    const nextData: Record<string, any> = {};
    if (!user.name && (me.displayName || me.givenName || me.surname)) {
      nextData.name = me.displayName || `${me.givenName ?? ""} ${me.surname ?? ""}`.trim();
    }
    if (!user.name && !nextData.name && me?.mail) {
      // some tenants only return mail/UPN; use local-part as a last-resort name
      const local = String(me.mail).split("@")[0];
      if (local) nextData.name = local;
    }
    if (!user.department && me.department) {
      nextData.department = me.department;
    }
    if (!user.phone) {
      const phone = me.mobilePhone || (Array.isArray(me.businessPhones) ? me.businessPhones[0] : undefined);
      if (phone) nextData.phone = phone;
    }
    // If email is missing in DB and we have one from id token/graph, set it
    if (!userEmailPresent(user) && (me?.mail || me?.userPrincipalName)) {
      (nextData as any).email = me.mail || me.userPrincipalName;
    }

    if (Object.keys(nextData).length === 0) {
      return NextResponse.json({ message: "No missing fields to update" });
    }

    const updated = await prisma.user.update({ where: { id: userId }, data: nextData });

    return NextResponse.json({ message: "Profile synced", updated: { name: updated.name, department: updated.department, phone: updated.phone } });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Unexpected error", detail: error?.message ?? String(error) },
      { status: 500 }
    );
  }
}

function userEmailPresent(user: { id: string; name: string | null; department: string | null; phone: string | null } & { [k: string]: any }) {
  return Boolean(user && typeof (user as any).email === "string" && (user as any).email.length > 0);
}


