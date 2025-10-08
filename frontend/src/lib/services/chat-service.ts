import type { Message } from "../types";

/**
 * N8N webhook configuration
 * @constant
 */
const N8N_WEBHOOK_URL =
  process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL ||
  "http://localhost:5678/webhook/chat-agent";

/**
 * Generates a unique session ID for chat continuity
 * Session ID is stored in localStorage and persists across page reloads
 * @returns {string} The session ID
 */
function generateSessionId(): string {
  if (typeof window === "undefined") return "server-session";

  let sessionId = localStorage.getItem("n8n_chat_session_id");

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}`;
    localStorage.setItem("n8n_chat_session_id", sessionId);
  }

  return sessionId;
}

/**
 * Chat service for n8n integration
 * Handles all chat-related operations including sending messages,
 * retrieving chat history, and managing session state
 */
export const chatService = {
  /**
   * Sends a message to the n8n chat agent and returns the AI response
   * @param {string} content - The message content to send
   * @param {Object} [context] - Optional context about the current page and data
   * @param {string} [userId] - Optional user ID for personalized responses and booking
   * @returns {Promise<string>} The AI response text or structured data
   * @throws {Error} When the n8n webhook is unreachable or returns invalid data
   */
  async sendMessage(
    content: string,
    context?: { page: string; data?: Record<string, unknown> },
    userId?: string
  ): Promise<string> {
    try {
      if (process.env.NODE_ENV === "development") {
        console.log("Sending message to N8N webhook:", N8N_WEBHOOK_URL);
        console.log("Message content:", content);
        console.log("Context:", context);
        console.log("User ID:", userId);
      }

      if (!userId) {
        console.warn(
          "WARNING: No userId provided. Booking requests require a logged-in user."
        );
      }

      const sessionId = generateSessionId();

      if (process.env.NODE_ENV === "development") {
        console.log("Session ID:", sessionId);
      }

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sessionId,
          action: "sendMessage",
          chatInput: content,
          message: content,
          context,
          userId,
          studentId: userId,
          timestamp: new Date().toISOString(),
          source: "frontend",
        }),
        mode: "cors",
        credentials: "omit",
      });

      if (process.env.NODE_ENV === "development") {
        console.log("Response status:", response.status);
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();

      if (!responseText || responseText.trim() === "") {
        const errorMessage =
          "N8N workflow returned empty response. Ensure:\n" +
          "1. Workflow is active in N8N (http://localhost:5678)\n" +
          "2. Workflow is imported from frontend/workflow.json\n" +
          "3. 'Respond to Webhook' node is properly configured\n" +
          "Check TROUBLESHOOTING.md for detailed steps.";

        console.error(errorMessage);
        throw new Error(
          "N8N workflow returned empty response - workflow may not be active or properly configured"
        );
      }

      const data = JSON.parse(responseText);

      if (process.env.NODE_ENV === "development") {
        console.log("N8N Response data:", data);
      }

      // Handle structured responses from AI agent
      if (data.type === "structured") {
        return JSON.stringify({
          type: "structured",
          content: data.content,
          components: data.components || [],
          metadata: data.metadata || {},
        });
      }

      // Handle different response formats
      const aiResponse =
        data.output ||
        data.reply ||
        data.response ||
        data.text ||
        JSON.stringify(data);

      if (!aiResponse || aiResponse === "{}") {
        throw new Error("N8N returned data but no recognizable response field");
      }

      return aiResponse;
    } catch (error) {
      console.error("Error calling n8n webhook:", error);

      return "I'm having trouble connecting to the AI service. Please try again in a moment. If the issue persists, contact support.";
    }
  },

  /**
   * Retrieves the chat history for the current session
   * @returns {Promise<Message[]>} Array of message objects
   */
  async getChatHistory(): Promise<Message[]> {
    return [
      {
        id: "1",
        role: "assistant",
        content:
          "Hello! I'm your AI assistant for MCMeet. I can help you schedule meetings with faculty members, check availability, and manage your appointments. What would you like to do today?",
        timestamp: new Date(),
      },
    ];
  },

  /**
   * Clears the chat history and resets the session
   * @returns {Promise<boolean>} True if successfully cleared
   */
  async clearHistory(): Promise<boolean> {
    if (typeof window !== "undefined") {
      localStorage.removeItem("n8n_chat_session_id");
    }
    return true;
  },
};
