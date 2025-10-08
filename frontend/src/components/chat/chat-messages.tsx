"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/lib/stores/chat-store";
import { User } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { RichMessageRenderer } from "./rich-message-renderer";

export function ChatMessages() {
  const { messages, isLoading } = useChatStore();
  const { theme } = useTheme();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [visibleMessages, setVisibleMessages] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!mounted) return;

    // Show messages with staggered delay
    const newMessageIds = messages.map((m) => m.id);
    newMessageIds.forEach((id, index) => {
      setTimeout(() => {
        setVisibleMessages((prev) => new Set([...prev, id]));
      }, index * 50);
    });
  }, [messages, mounted]);

  return (
    <ScrollArea className="w-full h-full">
      <div className="w-full max-w-3xl mx-auto px-4 md:px-0 py-4 pb-40">
        {messages.map((message, index) => {
          const isUser = message.role === "user";
          const isVisible = mounted && visibleMessages.has(message.id);
          return (
            <div
              key={message.id}
              className={`flex gap-3 mb-6 ${
                isUser ? "flex-row-reverse" : "flex-row"
              } transition-all duration-300 ${
                mounted && isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <Avatar className="h-8 w-8 mt-1 shrink-0">
                <AvatarFallback
                  className={
                    isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                  }
                >
                  {isUser ? (
                    <User className="h-4 w-4" />
                  ) : (
                    <Image
                      src={
                        theme === "dark"
                          ? "/mcmeet_face_light.svg"
                          : "/mcmeet_face_dark.svg"
                      }
                      alt="MCMeet Logo"
                      className="h-4 w-4"
                      width={48}
                      height={48}
                    />
                  )}
                </AvatarFallback>
              </Avatar>

              <div
                className={`flex flex-col ${
                  isUser ? "items-end" : "items-start"
                } max-w-[85%] md:max-w-[75%]`}
              >
                <span className="text-xs text-muted-foreground mb-1 px-1">
                  {isUser ? "You" : "MCMeet Assistant"}
                </span>
                <div
                  className={`rounded-2xl px-4 py-3 ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm border border-border"
                  }`}
                >
                  <RichMessageRenderer
                    message={message.content}
                    isUser={isUser}
                  />
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 mb-6 animate-fade-in">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarFallback className="bg-muted">
                <Image
                  src={
                    theme === "dark"
                      ? "/mcmeet_face_light.svg"
                      : "/mcmeet_face_dark.svg"
                  }
                  alt="MCMeet Logo"
                  className="h-4 w-4"
                  width={48}
                  height={48}
                />
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start">
              <span className="text-xs text-muted-foreground mb-1 px-1">
                MCMeet Assistant
              </span>
              <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 border border-border">
                <div className="flex gap-1">
                  <div
                    className="w-2 h-2 bg-muted-foreground/70 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground/70 rounded-full animate-bounce"
                    style={{ animationDelay: "200ms" }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground/70 rounded-full animate-bounce"
                    style={{ animationDelay: "400ms" }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
