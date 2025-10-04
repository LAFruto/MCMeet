import React from "react";
import { useChatStore } from "../stores/chat-store";
import type { PageContext } from "../types";

/**
 * Convenience hook for chat operations
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
 * Hook to automatically set page context
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
