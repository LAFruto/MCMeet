import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ClassValue } from "clsx";

/**
 * Combines multiple class names and merges Tailwind CSS classes intelligently
 * Uses clsx for conditional classes and tailwind-merge to resolve conflicts
 *
 * @param {...ClassValue[]} inputs - Class names, objects, or arrays to combine
 * @returns {string} Merged and deduplicated class name string
 *
 * @example
 * cn("text-red-500", "text-blue-500") // => "text-blue-500"
 * cn("px-4 py-2", { "bg-blue-500": isActive }) // => "px-4 py-2 bg-blue-500"
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
