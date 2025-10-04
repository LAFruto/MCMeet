import { apiClient } from "./api-client";
import { API_ENDPOINTS } from "../config/api";
import {
  getResponseForInput,
  CHAT_RESPONSES,
} from "../constants/mock-responses";
import type { Message } from "../types";

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
    context?: { page: string; data?: Record<string, unknown> }
  ): Promise<string> {
    // TODO: Replace with actual API call when backend is ready
    // const response = await apiClient.post<{ reply: string }>(
    //   API_ENDPOINTS.CHAT,
    //   { message: content, context }
    // );
    // return response.data.reply;

    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return getResponseForInput(content);
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
