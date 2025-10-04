import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkChatRateLimit, createRateLimitHeaders } from "@/lib/rate-limit";

/**
 * Chat API endpoint with rate limiting and authentication
 * POST /api/chat
 */
export async function POST(request: NextRequest) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Check rate limit
    const ip =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const rateLimitResult = await checkChatRateLimit(session?.user?.id, ip);

    // Add rate limit headers
    const responseHeaders = createRateLimitHeaders(rateLimitResult);

    // If rate limit exceeded
    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          message: "Too many requests. Please try again later.",
        },
        {
          status: 429,
          headers: responseHeaders,
        }
      );
    }

    // Require authentication for chat
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", message: "Please sign in to use chat" },
        { status: 401, headers: responseHeaders }
      );
    }

    // Parse request body
    const body = await request.json();
    const { message, context } = body;

    // Validate input
    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid input", message: "Message is required" },
        { status: 400, headers: responseHeaders }
      );
    }

    // TODO: Process chat message with your AI service
    // For now, return a mock response
    const response = {
      message: `Echo: ${message}`,
      context,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, data: response },
      { headers: responseHeaders }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        error: "Internal server error",
        message: "An error occurred processing your request",
      },
      { status: 500 }
    );
  }
}
