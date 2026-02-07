import { useEffect, useMemo, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ScanResult {
  score: number;
  ingredients: string[];
  highlights: string[];
  summary?: string;
}

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

interface FoodChatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: ScanResult;
}

const FoodChatModal = ({ open, onOpenChange, result }: FoodChatModalProps) => {
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Seed greeting when modal opens
  useEffect(() => {
    if (open) {
      setMessages((prev) =>
        prev.length
          ? prev
          : [
              {
                id: crypto.randomUUID(),
                role: "assistant",
                content:
                  "I've loaded your scan. I'm Health Assistant — ask me anything about this product.",
              },
            ]
      );
    } else {
      setInput("");
    }
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  const send = async () => {
    if (!canSend) return;
    const text = input.trim();
    setInput("");

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke("food-chat", {
        body: {
          messages: [...messages, userMsg].map(({ role, content }) => ({ role, content })),
          scanContext: result,
        },
      });

      if (error) throw error;

      const replyText = (data as any)?.reply ?? "Sorry, I couldn't get a reply.";
      const botMsg: Message = { id: crypto.randomUUID(), role: "assistant", content: replyText };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error("food-chat error", err);
      toast({ title: "Chat error", description: err?.message ?? "Failed to get reply", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Health Assistant</DialogTitle>
        </DialogHeader>
        <Card className="p-4">
          <ScrollArea className="h-72 pr-2">
            <div className="space-y-4">
              {messages.map((m) => (
                <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={
                      m.role === "user"
                        ? "inline-block bg-primary text-primary-foreground px-3 py-2 rounded-lg"
                        : "inline-block bg-muted px-3 py-2 rounded-lg"
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
          </ScrollArea>
          <div className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask about this food..."
            />
            <Button onClick={send} disabled={!canSend} variant="accent">
              {loading ? "Thinking..." : "Send"}
            </Button>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default FoodChatModal;
