import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, Send, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAI } from "@/contexts/AIContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function FloatingAIButton() {
  const { isOpen, setIsOpen, openWithMessage, setOpenWithMessage } = useAI();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Auto-open when there's a message to show
  useEffect(() => {
    if (openWithMessage) {
      setIsOpen(true);
    }
  }, [openWithMessage, setIsOpen]);

  const handleClose = () => {
    setIsOpen(false);
    setOpenWithMessage(undefined);
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "That's a great question! Let me help you with that. Based on your query, I'd recommend starting with a clear problem statement and then breaking it down into smaller tasks.",
        "I understand what you're looking for. Here are some suggestions that might help you move forward with your hackathon project.",
        "Interesting! Let me think about the best approach for this. Would you like me to help you brainstorm some ideas or dive into the technical implementation?",
        "Great thinking! I can definitely assist you with that. Let's work through this step by step to ensure we cover all the important aspects.",
      ];

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button - Draggable */}
      <motion.button
        drag
        dragMomentum={false}
        dragElastic={0}
        dragConstraints={{
          top: -window.innerHeight + 80,
          left: -window.innerWidth + 80,
          right: 0,
          bottom: 0,
        }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => {
          setTimeout(() => setIsDragging(false), 100);
        }}
        onClick={() => {
          if (!isDragging) {
            setIsOpen(true);
          }
        }}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full cursor-grab active:cursor-grabbing",
          "bg-primary text-primary-foreground",
          "flex items-center justify-center",
          "shadow-lg animate-pulse-glow",
          "hover:scale-110 transition-transform touch-none",
          isOpen && "hidden"
        )}
        whileHover={{ scale: 1.1 }}
        whileDrag={{ scale: 1.15, boxShadow: "0 10px 30px rgba(0,0,0,0.3)" }}
      >
        <Sparkles className="w-6 h-6" />
      </motion.button>

      {/* Chat Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm"
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md glass border-l border-border flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                    <Sparkles className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI Co-Pilot</h3>
                    <p className="text-xs text-muted-foreground">Always here to help</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="rounded-full"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* AI Welcome Message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div className="glass rounded-2xl rounded-tl-sm p-4 max-w-[85%]">
                    {openWithMessage ? (
                      <>
                        <p className="text-sm font-medium mb-2">
                          🎉 Project Created!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {openWithMessage}
                        </p>
                        <p className="text-sm mt-3">
                          I can help you with:
                        </p>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• Building your dream team</li>
                          <li>• Researching the problem space</li>
                          <li>• Brainstorming innovative ideas</li>
                          <li>• Creating your PRD</li>
                        </ul>
                        <p className="text-sm mt-2">What would you like to start with?</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm">
                          Hey! 👋 I'm your AI Co-Pilot. I can help you with:
                        </p>
                        <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                          <li>• Finding the perfect hackathon</li>
                          <li>• Building your dream team</li>
                          <li>• Research & ideation</li>
                          <li>• Project planning & execution</li>
                        </ul>
                        <p className="text-sm mt-2">What would you like to work on?</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Conversation Messages */}
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" && "flex-row-reverse"
                    )}
                  >
                    {message.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                        <Sparkles className="w-4 h-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl p-4 max-w-[85%]",
                        message.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "glass rounded-tl-sm"
                      )}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div className="glass rounded-2xl rounded-tl-sm p-4">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border">
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask anything..."
                      className="w-full bg-secondary/50 border border-border rounded-full px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      <Mic className="w-5 h-5" />
                    </button>
                  </div>
                  <Button
                    size="icon"
                    className="rounded-full w-12 h-12"
                    onClick={handleSend}
                    disabled={!input.trim() || isTyping}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                  AI can make mistakes. Verify important information.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
