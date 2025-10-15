import { NextResponse } from "next/server";

function toMicrosoftCallbackUrl(request: Request) {
  const url = new URL(request.url);
  const target = new URL(`/api/auth/callback/${url.search}`, url.origin);
  return target.toString();
}

export async function GET(request: Request) {
  return NextResponse.redirect(toMicrosoftCallbackUrl(request));
}

export async function POST(request: Request) {
  return NextResponse.redirect(toMicrosoftCallbackUrl(request));
}


