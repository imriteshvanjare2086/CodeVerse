import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { User, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export function ChatBubble({ role, content }: ChatBubbleProps) {
  const isAssistant = role === "assistant";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={cn(
        "flex w-full gap-4 mb-6",
        isAssistant ? "justify-start" : "justify-end"
      )}
    >
      {isAssistant && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 shadow-sm">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-5 py-3.5 shadow-sm text-sm leading-relaxed",
          isAssistant
            ? "glass border border-border/50 text-foreground"
            : "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
        )}
      >
        <div className="prose prose-sm prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-black/20 prose-pre:border prose-pre:border-white/10">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
      </div>

      {!isAssistant && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/20 border border-primary/30">
          <User className="h-5 w-5 text-primary" />
        </div>
      )}
    </motion.div>
  );
}
