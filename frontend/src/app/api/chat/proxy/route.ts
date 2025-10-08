import { NextRequest, NextResponse } from "next/server";

const WEBHOOK_URL =
  process.env.WEBHOOK_CHAT_QA_URL ||
  process.env.NEXT_PUBLIC_WEBHOOK_CHAT_QA_URL ||
  "http://localhost:5678/webhook/chat-qa";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const resp = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const rawText = await resp.text();
    let data: any = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      data = { output: rawText };
    }

    // Print full webhook response to the server terminal
    console.log("[chat-proxy] Webhook response:", data);

    const output = data?.output ?? data?.json?.output ?? data?.data?.output;
    if (!resp.ok || typeof output !== "string") {
      return NextResponse.json(
        { error: "Invalid webhook response", detail: data },
        { status: 502 }
      );
    }

    return NextResponse.json({ output });
  } catch (error: any) {
    console.error("[chat-proxy] Error:", error);
    return NextResponse.json(
      { error: "Proxy error", detail: error?.message || String(error) },
      { status: 500 }
    );
  }
}


