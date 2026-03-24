import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Bot, Send, User } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const FAKE_REPLY = "I'm not ready yet, try again later on.";

function HomePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  let nextId = useRef(0);

  const scrollToBottom = () => {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 50);
  };

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: nextId.current++,
      role: "user",
      content: text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    scrollToBottom();

    // Fake AI reply after a short delay
    setTimeout(() => {
      const aiMsg: Message = {
        id: nextId.current++,
        role: "assistant",
        content: FAKE_REPLY,
      };
      setMessages((prev) => [...prev, aiMsg]);
      scrollToBottom();
    }, 600);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Messages area */}
      <ScrollArea className="flex-1 px-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center pt-32">
            <div className="text-center text-muted-foreground">
              <Bot className="mx-auto mb-3 h-10 w-10 opacity-50" />
              <p className="text-lg font-medium">How can I help you?</p>
              <p className="text-sm">Send a message to start a conversation.</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-2xl space-y-4 py-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback
                    className={
                      msg.role === "assistant"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }
                  >
                    {msg.role === "assistant" ? (
                      <Bot className="h-4 w-4" />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </AvatarFallback>
                </Avatar>
                <Card
                  className={`max-w-[75%] px-3 py-2 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </Card>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input area */}
      <div className="border-t px-4 py-3">
        <div className="mx-auto flex max-w-2xl items-center gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="flex-1"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  component: HomePage,
});
