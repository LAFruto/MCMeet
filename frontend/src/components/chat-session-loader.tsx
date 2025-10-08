"use client";

import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useChatStore } from "@/lib/stores/chat-store";
import {
  getStorageItem,
  setStorageItem,
  STORAGE_KEYS,
} from "@/lib/utils/storage";
import type { Message } from "@/lib/types";

/**
 * Component to load user-specific chat messages
 * This runs on the client and loads the correct chat history based on user session
 */
export function ChatSessionLoader() {
  const { data: session } = useSession();
  const messages = useChatStore((state) => state.messages);
  const setSessionId = useChatStore((state) => state.setSessionId);
  const setStudentId = useChatStore((state) => state.setStudentId);

  useEffect(() => {
    if (!session?.user?.id) return;
    setSessionId(session.user.id);
    setStudentId(session.user.id);

    // Get user-specific storage key
    const userStorageKey = `${STORAGE_KEYS.CHAT_MESSAGES_PREFIX}${session.user.id}`;

    // Try to load user's chat history
    const userMessages = getStorageItem<Message[]>(userStorageKey);

    if (userMessages && userMessages.length > 0) {
      // Load user's existing chat
      useChatStore.setState({ messages: userMessages });
    } else {
      // Save current messages to user's storage
      setStorageItem(userStorageKey, messages);
    }
  }, [session?.user?.id]);

  return null; // This component doesn't render anything
}
