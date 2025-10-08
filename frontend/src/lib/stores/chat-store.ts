import React from "react";
import { create } from "zustand";
import { chatService } from "../services/chat-service";
import type { ChatState, Message, PageContext } from "../types";
import { setStorageItem, STORAGE_KEYS } from "../utils/storage";

/**
 * Get user-specific storage key for chat messages
 */
function getChatStorageKey(userId?: string): string {
  return userId
    ? `${STORAGE_KEYS.CHAT_MESSAGES_PREFIX}${userId}`
    : `${STORAGE_KEYS.CHAT_MESSAGES_PREFIX}guest`;
}

/**
 * Get default welcome message
 */
function getWelcomeMessage(): Message {
  return {
    id: "1",
    role: "assistant",
    content:
      "Hello! I'm your AI assistant for MCMeet, the faculty booking system. I can help you schedule meetings with faculty members, check availability, manage your appointments, and provide information about our academic community. What would you like to do today?",
    timestamp: new Date(),
  };
}

/**
 * Enhanced chat store with user-specific persistence and page context awareness
 */
export const useChatStore = create<ChatState>((set, get) => ({
  // Initialize from localStorage or use defaults
  // Note: This will be updated when user session is available
  messages: [getWelcomeMessage()],
  input: "",
  isLoading: false,
  selectedQuickAction: null,
  currentPage: {
    page: "home",
  },
  userId: undefined, // Will be set by ChatSessionLoader

  /**
   * Add a new message to the chat
   */
  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
      context: get().currentPage,
    };

    set((state) => {
      const updatedMessages = [...state.messages, newMessage];
      // Persist to user-specific localStorage
      // Will use guest key if no user is logged in
      setStorageItem(getChatStorageKey(), updatedMessages);
      return { messages: updatedMessages };
    });
  },

  /**
   * Set input value
   */
  setInput: (input) => set({ input }),

  /**
   * Clear all messages and reset to welcome
   */
  clearMessages: () => {
    const welcomeMessage = getWelcomeMessage();

    set({ messages: [welcomeMessage] });
    setStorageItem(getChatStorageKey(), [welcomeMessage]);
  },

  /**
   * Set loading state
   */
  setIsLoading: (loading) => set({ isLoading: loading }),

  /**
   * Set selected quick action
   */
  setSelectedQuickAction: (action) => set({ selectedQuickAction: action }),

  /**
   * Set current page context for context-aware responses
   */
  setCurrentPage: (page) => set({ currentPage: page }),

  /**
   * Set user ID (called by ChatSessionLoader)
   */
  setUserId: (userId?: string) => set({ userId }),

  /**
   * Send a message and get AI response
   */
  sendMessage: async (content: string) => {
    const { addMessage, setIsLoading, currentPage, userId } = get();

    if (process.env.NODE_ENV === "development") {
      console.log("Chat Store - Sending message with userId:", userId);
      console.log("Chat Store - Full state:", { currentPage, userId });
    }

    // Add user message
    addMessage({ role: "user", content });

    // Clear input
    set({ input: "" });

    // Set loading state
    setIsLoading(true);

    try {
      // Call chat service with userId for booking requests
      const response = await chatService.sendMessage(
        content,
        currentPage,
        userId
      );

      // Add assistant response
      addMessage({
        role: "assistant",
        content: response,
      });
    } catch (error) {
      // Add error message
      addMessage({
        role: "assistant",
        content:
          "I apologize, but I'm experiencing some technical difficulties. Please try again in a moment, or contact our support team if the issue persists.",
      });

      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  },
}));

/**
 * Helper hook to set page context automatically
 */
export function useSetPageContext(
  page: PageContext["page"],
  data?: Record<string, unknown>
) {
  const setCurrentPage = useChatStore((state) => state.setCurrentPage);

  // Set page context on mount
  React.useEffect(() => {
    setCurrentPage({ page, data });
  }, [page, data, setCurrentPage]);
}

// Re-export for convenience
export type { ChatState, Message } from "../types";
