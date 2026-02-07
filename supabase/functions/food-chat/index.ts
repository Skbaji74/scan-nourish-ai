// These remote imports run in the Supabase/Deno runtime. Silence local TS server warnings.
// @ts-ignore
import "https://deno.land/x/xhr@0.1.0/mod.ts";
// @ts-ignore
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Minimal ambient declarations so the repo TypeScript checker doesn't error locally.
declare const Deno: any;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get("AIzaSyCqlBeVLvSu6QE0xl60l5CAEM2m6M6hYz8");
    if (!GEMINI_API_KEY) {
      return new Response(JSON.stringify({ error: "Missing GEMINI_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages = [], scanContext } = await req.json();

    const sysPrompt = `You are Health Assistant, a concise, friendly nutrition expert.
Use the provided scan context to answer user questions about the scanned food.
- Be practical and evidence-based
- If relevant, suggest healthier alternatives
- Consider common allergies/conditions if in the context
- Keep answers clear and brief unless asked for detail`;

    const contextText = `Scan Context:\n` +
      `${scanContext?.summary ? `Summary: ${scanContext.summary}\n` : ""}` +
      `${Array.isArray(scanContext?.highlights) ? `Key Points: ${scanContext.highlights.join(", ")}\n` : ""}` +
      `${Array.isArray(scanContext?.ingredients) ? `Ingredients: ${scanContext.ingredients.join(", ")}\n` : ""}` +
      `${typeof scanContext?.score === "number" ? `Health Score: ${scanContext.score}\n` : ""}`;

    // Map chat messages to Gemini contents format
    const contents = [
      { role: "user", parts: [{ text: sysPrompt + "\n\n" + contextText }] },
      ...messages.map((m: ChatMessage) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
    ];

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + GEMINI_API_KEY,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error("Gemini API error:", err);
      return new Response(JSON.stringify({ error: "Gemini API error", details: err }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();

    const reply = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text).join("") ||
                  data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                  "Sorry, I couldn’t generate a response.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in food-chat function:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
