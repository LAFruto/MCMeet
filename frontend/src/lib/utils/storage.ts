const STORAGE_KEYS = {
  CHAT_MESSAGES: "mcmeet_chat_messages", // Legacy key
  CHAT_MESSAGES_PREFIX: "mcmeet_chat_messages_", // User-specific prefix
  CHAT_CONTEXT: "mcmeet_chat_context",
  USER_PREFERENCES: "mcmeet_user_preferences",
} as const;

export { STORAGE_KEYS };

/**
 * Safely get item from localStorage with JSON parsing
 */
export function getStorageItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return null;
  }
}

/**
 * Safely set item in localStorage with JSON stringification
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Safely remove item from localStorage
 */
export function removeStorageItem(key: string): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error);
    return false;
  }
}

/**
 * Clear all MCMeet-related items from localStorage
 */
export function clearStorage(): boolean {
  if (typeof window === "undefined") return false;

  try {
    Object.values(STORAGE_KEYS).forEach((key) => {
      window.localStorage.removeItem(key);
    });
    return true;
  } catch (error) {
    console.error("Error clearing localStorage:", error);
    return false;
  }
}
