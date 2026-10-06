import { useState, useEffect, useRef } from "react";
import { Plus, MessageSquare, Bot, Clock, Trash2, SendHorizontal, Sparkles } from "lucide-react";
import { aiErrorMessage, streamChat } from "@/services/ai";
import { DashboardLayout } from "@/components/DashboardLayout";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { ChatBubble } from "@/components/codet/ChatBubble";
import { ChatInput } from "@/components/codet/ChatInput";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

export default function CodeT() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<AbortController | null>(null);
  useEffect(() => () => requestRef.current?.abort(), []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem("codecraft_chat_history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) setActiveSessionId(parsed[0].id);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history
  useEffect(() => {
    if (isLoading) return;
    localStorage.setItem("codecraft_chat_history", JSON.stringify(sessions));
  }, [sessions, isLoading]);

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeSession?.messages, isLoading]);

  const startNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      updatedAt: Date.now(),
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
  };

  const deleteSession = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) setActiveSessionId(null);
  };

  const handleSendMessage = async (msg: string) => {
    if (!activeSession) {
      const newId = Date.now().toString();
      const newSession: ChatSession = {
        id: newId,
        title: msg.slice(0, 30) + (msg.length > 30 ? "..." : ""),
        messages: [{ role: "user", content: msg }],
        updatedAt: Date.now(),
      };
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newId);
      processAIResponse(newId, msg, []);
    } else {
      const currentHistory = activeSession.messages.map(m => ({ role: m.role, content: m.content }));
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId
            ? {
                ...s,
                messages: [...s.messages, { role: "user", content: msg }],
                title: s.messages.length === 0 ? msg.slice(0, 30) + (msg.length > 30 ? "..." : "") : s.title,
                updatedAt: Date.now(),
              }
            : s
        )
      );
      processAIResponse(activeSessionId, msg, currentHistory);
    }
  };

  const processAIResponse = async (sessionId: string, userMsg: string, history: Message[]) => {
    setIsLoading(true);
    const controller = new AbortController();
    requestRef.current = controller;
    let aiText = "", inserted = false;
    const updateReply = (text: string) => {
      aiText += text;
      const append = !inserted;
      inserted = true;
      const content = aiText;
      setSessions(prev => prev.map(s => s.id === sessionId ? {
        ...s,
        messages: append ? [...s.messages, { role: "assistant", content }] : [...s.messages.slice(0, -1), { role: "assistant", content }],
      } : s));
    };
    try {
      await streamChat(userMsg, history.slice(-20), updateReply, controller.signal);
    } catch (err) {
      if (controller.signal.aborted) return;
      console.error("AI request failed");
      updateReply(`${aiText ? "\n\n" : ""}Error: ${aiErrorMessage(err)}`);
    } finally {
      requestRef.current = null;
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 h-[calc(100vh-8rem)] flex flex-col">
        <PageHeader 
          title="CodeT AI Assistant" 
          description="Your professional coding companion. Natively integrated for history and speed." 
        />
        
        <div className="flex flex-1 overflow-hidden rounded-3xl border border-border/60 bg-card/40 backdrop-blur-xl shadow-2xl relative">
          
          {/* Top Gradient Accent */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-primary/50 z-20" />

          {/* Left Sidebar (History) */}
          <div className="hidden md:flex w-72 flex-col border-r border-border/60 bg-muted/5 p-4 overflow-hidden">
            <Button 
              onClick={startNewChat}
              className="w-full justify-start gap-2 h-12 bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary border border-primary/20 shadow-none font-semibold rounded-2xl transition-all"
            >
              <Plus className="h-5 w-5" /> New Chat
            </Button>

            <div className="mt-8 flex-1 overflow-y-auto space-y-6">
              <div>
                <div className="flex items-center gap-2 px-2 py-1.5 mb-2 opacity-50">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="text-[10px] font-mono font-bold tracking-widest uppercase">
                    History
                  </span>
                </div>
                
                <div className="space-y-1">
                  {sessions.length === 0 && (
                    <div className="px-3 py-6 text-center">
                      <p className="text-xs text-muted-foreground italic">No chats yet</p>
                    </div>
                  )}
                  {sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => setActiveSessionId(session.id)}
                      className={cn(
                        "w-full text-left flex items-center justify-between gap-3 px-3 py-3 rounded-xl transition-all group relative",
                        activeSessionId === session.id 
                          ? "bg-primary/10 border border-primary/20 text-primary" 
                          : "hover:bg-muted/40 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <MessageSquare className="h-4 w-4 shrink-0" />
                        <span className="text-sm font-mono truncate">
                          {session.title}
                        </span>
                      </div>
                      <button 
                        onClick={(e) => deleteSession(e, session.id)}
                        className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-all p-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-border/40 flex items-center gap-3 px-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-bold leading-none">CodeT Engine</span>
                <span className="text-[10px] text-muted-foreground font-mono mt-1">Model: Gemma 4</span>
              </div>
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col relative bg-background/20 overflow-hidden">
            {/* Messages Scroll Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-8 space-y-2 scroll-smooth"
            >
              {!activeSessionId ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-4">
                  <div className="h-16 w-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-2">
                    <Bot className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-bold">How can I help you today?</h3>
                  <p className="font-mono text-sm text-muted-foreground leading-relaxed">
                    I'm your dedicated coding mentor. Ask me to debug code, explain logic, or brainstorm new project ideas.
                  </p>
                  <Button onClick={startNewChat} variant="outline" className="rounded-xl px-6 gap-2">
                    Start Your First Chat
                  </Button>
                </div>
              ) : activeSession?.messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto">
                  <Sparkles className="h-12 w-12 text-primary/30 mb-4 animate-pulse" />
                  <p className="font-mono text-sm text-muted-foreground italic">
                    The floor is yours. Start typing to begin...
                  </p>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto w-full">
                  <AnimatePresence mode="popLayout">
                    {activeSession?.messages.map((m, i) => (
                      <ChatBubble key={`${activeSession.id}-${i}`} role={m.role} content={m.content} />
                    ))}
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex gap-4 mb-6"
                      >
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
                          <Bot className="h-5 w-5 text-primary animate-pulse" />
                        </div>
                        <div className="glass rounded-2xl px-5 py-4 border border-border/50">
                          <div className="flex gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
                            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Input Overlay at bottom */}
            <div className="p-4 md:p-6 border-t border-border/30 bg-background/40 backdrop-blur-md">
              <div className="max-w-3xl mx-auto">
                <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
                <p className="text-[10px] text-center text-muted-foreground mt-3 font-mono opacity-50">
                  AI responses can be generated. Always double-check code for accuracy.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
