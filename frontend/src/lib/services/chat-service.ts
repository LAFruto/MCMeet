import { CHAT_RESPONSES } from "../constants/mock-responses";
import type { Message } from "../types";

const WEBHOOK_URL = "/api/chat/proxy";

/**
 * Chat service - handles all chat-related API calls
 * Currently uses mock responses, replace with real API calls
 */
export const chatService = {
  /**
   * Send a message and get AI response
   */
  async sendMessage(
    content: string,
    context?: { page: string; data?: Record<string, unknown> },
    sessionId?: string,
    studentId?: string
  ): Promise<string> {
    try {
      const payload: Record<string, unknown> = {
        sessionId: sessionId || "guest",
        action: "sendMessage",
        chatInput: content,
      };
      if (studentId) {
        (payload as any)["student-id"] = studentId;
      }

      const resp = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await resp.json().catch(async () => {
        try {
          const text = await resp.text();
          return { output: text };
        } catch {
          return {};
        }
      });
      const output = (data as any)?.output ?? (data as any)?.json?.output ?? (data as any)?.data?.output;
      if (!resp.ok || typeof output !== "string") {
        throw new Error("Invalid webhook response");
      }
      return output;
    } catch (e) {
      // Fallback message if webhook fails
      return CHAT_RESPONSES.WELCOME;
    }
  },

  /**
   * Get chat history for current user
   */
  async getChatHistory(): Promise<Message[]> {
    // TODO: Replace with actual API call
    // const response = await apiClient.get<Message[]>(API_ENDPOINTS.CHAT_HISTORY);
    // return response.data;

    // Mock implementation - return welcome message
    return [
      {
        id: "1",
        role: "assistant",
        content: CHAT_RESPONSES.WELCOME,
        timestamp: new Date(),
      },
    ];
  },

  /**
   * Clear chat history
   */
  async clearHistory(): Promise<boolean> {
    // TODO: Replace with actual API call
    // await apiClient.delete(API_ENDPOINTS.CHAT_HISTORY);
    // return true;

    // Mock implementation
    return true;
  },
};
