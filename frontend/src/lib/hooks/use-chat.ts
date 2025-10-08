import React from "react";
import { useChatStore } from "../stores/chat-store";
import type { PageContext } from "../types";

/**
 * Custom hook for managing chat state and operations
 * Provides convenient access to chat messages, input state, and actions
 *
 * @returns {Object} Chat state and action functions
 * @property {Message[]} messages - Array of chat messages
 * @property {string} input - Current input value
 * @property {boolean} isLoading - Loading state for async operations
 * @property {string | null} selectedQuickAction - Currently selected quick action
 * @property {function} setInput - Sets the input value
 * @property {function} sendMessage - Sends a message to the AI agent
 * @property {function} clearMessages - Clears all messages
 * @property {function} setSelectedQuickAction - Sets the selected quick action
 * @property {function} setCurrentPage - Sets the current page context
 */
export function useChat() {
  const messages = useChatStore((state) => state.messages);
  const input = useChatStore((state) => state.input);
  const isLoading = useChatStore((state) => state.isLoading);
  const selectedQuickAction = useChatStore(
    (state) => state.selectedQuickAction
  );

  const setInput = useChatStore((state) => state.setInput);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const clearMessages = useChatStore((state) => state.clearMessages);
  const setSelectedQuickAction = useChatStore(
    (state) => state.setSelectedQuickAction
  );
  const setCurrentPage = useChatStore((state) => state.setCurrentPage);

  return {
    messages,
    input,
    isLoading,
    selectedQuickAction,
    setInput,
    sendMessage,
    clearMessages,
    setSelectedQuickAction,
    setCurrentPage,
  };
}

/**
 * Custom hook to automatically set page context for contextual AI responses
 * Updates the chat store with current page information when component mounts
 *
 * @param {PageContext["page"]} page - The current page identifier
 * @param {Record<string, unknown>} [data] - Optional page-specific data for context
 */
export function usePageContext(
  page: PageContext["page"],
  data?: Record<string, unknown>
) {
  const setCurrentPage = useChatStore((state) => state.setCurrentPage);

  React.useEffect(() => {
    setCurrentPage({ page, data });
  }, [page, data, setCurrentPage]);
}
