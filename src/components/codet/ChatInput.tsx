import { useState, KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  onSend: (msg: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="relative group">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your coding question here... (Shift + Enter for new line)"
        disabled={isLoading}
        rows={1}
        className="w-full resize-none rounded-2xl border border-border/60 bg-card/40 py-4 pl-5 pr-14 font-mono text-sm ring-offset-background transition-all focus:bg-card/60 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 min-h-[58px] max-h-32"
      />
      <Button
        size="icon"
        disabled={!input.trim() || isLoading}
        onClick={handleSend}
        className="absolute bottom-2.5 right-2.5 h-8 w-8 rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
