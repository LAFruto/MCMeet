"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import { useChatStore } from "@/lib/stores/chat-store";
import { Send, Mic, StopCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function ChatComposer({ fixed = true }: ChatComposerProps) {
  const { input, setInput, sendMessage, isLoading } = useChatStore();
  const [draft, setDraft] = useState(input);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isUserTyping = useRef(false);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [draft]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || isLoading) return;
    sendMessage(draft.trim());
    setDraft("");
  };

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      isUserTyping.current = true;
      setDraft(e.target.value);
      setTimeout(() => {
        isUserTyping.current = false;
      }, 100);
    },
    []
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (!isUserTyping.current && input !== draft) {
      setDraft(input);
      requestAnimationFrame(() => {
        const textarea = textareaRef.current;
        if (textarea) {
          textarea.focus();
          textarea.setSelectionRange(input.length, input.length);
        }
      });
    }
  }, [input, draft]);

  return (
    <ComposerWrapper fixed={fixed}>
      <form onSubmit={handleSubmit} className="relative">
        <div
          className={`relative rounded-2xl bg-background overflow-hidden transition-shadow duration-200 ${
            draft.trim()
              ? "shadow-[0_0_0_2px_hsl(var(--primary))]"
              : "shadow-[0_0_0_1px_hsl(var(--border))]"
          }`}
        >
          <Textarea
            ref={textareaRef}
            value={draft}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything about scheduling, faculty, or events..."
            className="w-full resize-none rounded-2xl  pr-24 py-3.5 px-4 text-base focus-visible:ring-0 focus-visible:ring-offset-0 max-h-32 min-h-[52px]"
            rows={1}
            spellCheck={false}
            disabled={isLoading}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex shrink-0 h-9 w-9 text-muted-foreground hover:bg-muted/60 hover:text-foreground transition-all"
              aria-label="Voice input"
            >
              <Mic className="h-4 w-4" />
            </Button>

            <Button
              type="submit"
              size="icon"
              disabled={!draft.trim() || isLoading}
              className="shrink-0 h-9 w-9 transition-all hover:scale-105"
            >
              {isLoading ? (
                <StopCircle className="h-4 w-4" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </ComposerWrapper>
  );
}

function ComposerWrapper({ children, fixed }: ComposerWrapperProps) {
  if (fixed) {
    return (
      <div className="fixed bottom-0 inset-x-0 border-t border-border bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 lg:left-20 z-10">
        <div className="max-w-3xl mx-auto px-3 py-4 md:px-4 md:py-6">
          {children}
        </div>
      </div>
    );
  }

  return <div className="w-full max-w-3xl mx-auto px-4">{children}</div>;
}

interface ChatComposerProps {
  fixed?: boolean;
}

interface ComposerWrapperProps {
  children: React.ReactNode;
  fixed: boolean;
}
