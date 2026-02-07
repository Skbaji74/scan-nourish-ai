import Navigation from "@/components/ui/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your Health Assistant. Ask me about ingredients, nutrition, or healthier swaps.",
    },
  ]);
  const [input, setInput] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = "Health Assistant | FoodScanAI";
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const canSend = useMemo(() => input.trim().length > 0, [input]);

  const send = () => {
    if (!canSend) return;
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");

    // Call Supabase Edge Function which uses GEMINI_API_KEY on the server
    (async () => {
      const toSend = [...messages, userMsg].map((mm) => ({ role: mm.role, content: mm.content }));
      try {
        // Use Supabase client's functions.invoke when available
        // @ts-ignore
        if (supabase?.functions?.invoke) {
          // supabase.functions.invoke returns { data, error }
          // We request JSON body from the function
          const { data, error } = await supabase.functions.invoke("food-chat", {
            body: JSON.stringify({ messages: toSend, scanContext: null }),
          });
          if (error) throw error;
          const parsed = typeof data === "string" ? JSON.parse(data) : data;
          const replyText = parsed?.reply || parsed?.error || "No response from function.";
          const reply: Message = { id: crypto.randomUUID(), role: "assistant", content: replyText };
          setMessages((m) => [...m, reply]);
          return;
        }

        // Fallback: try a direct fetch to the Supabase Functions endpoint
        const FALLBACK_URL = "https://vpzoiwizjtfsdekerark.supabase.co/functions/v1/food-chat";
        const res = await fetch(FALLBACK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: toSend, scanContext: null }),
        });
        const json = await res.json();
        const replyText = json?.reply || json?.error || "No response from function.";
        const reply: Message = { id: crypto.randomUUID(), role: "assistant", content: replyText };
        setMessages((m) => [...m, reply]);
      } catch (err: any) {
        const reply: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Error contacting chat function: ${err?.message || String(err)}`,
        };
        setMessages((m) => [...m, reply]);
      }
    })();
  };

  return (
    <div className="min-h-screen bg-gradient-soft">
      <Navigation />
      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold">Health Assistant</h1>
          <p className="text-muted-foreground">Ask anything about your food and nutrition</p>
        </header>

        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-0">
            <div ref={listRef} className="h-[60vh] overflow-y-auto p-6 space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={
                    m.role === "assistant"
                      ? "bg-muted/50 rounded-lg p-3 max-w-[85%]"
                      : "ml-auto bg-primary/10 text-foreground rounded-lg p-3 max-w-[85%]"
                  }
                >
                  {m.content}
                </div>
              ))}
            </div>
            <Separator />
            <div className="p-4 flex gap-2">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send();
                }}
              />
              <Button onClick={send} disabled={!canSend}>
                Send
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Chat;
