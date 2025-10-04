"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
}

export function MarkdownRenderer({ content, isUser }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : 'dark:prose-invert'}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: (props) => {
            const { inline, children, className, ...rest } = props as CodeProps;
            const match = /language-(\w+)/.exec(className || "");
            const language = match ? match[1] : "";

            if (inline) {
              return (
                <code
                  className="inline-block rounded-md bg-muted px-1.5 py-0.5 text-sm font-mono border border-border"
                  {...rest}
                >
                  {children}
                </code>
              );
            }

            return (
              <CodeBlock
                language={language}
                code={String(children).replace(/\n$/, "")}
              />
            );
          },
          pre: ({ children }) => <>{children}</>,
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          ul: ({ children }) => <ul className="my-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="my-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li className="ml-4">{children}</li>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-2">
              {children}
            </blockquote>
          ),
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mt-4 mb-2">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-bold mt-3 mb-2">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-bold mt-2 mb-1">{children}</h3>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group my-4 rounded-lg overflow-hidden border border-border">
      <div className="flex items-center justify-between bg-muted px-4 py-2 text-xs">
        <span className="text-muted-foreground font-mono">
          {language || "plaintext"}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language || "plaintext"}
        style={oneDark}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: "0.875rem",
        }}
        codeTagProps={{
          style: {
            fontFamily: "var(--font-mono, 'Courier New', monospace)",
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}


