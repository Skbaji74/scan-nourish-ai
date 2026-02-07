import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface UserProfile {
  allergies?: string[];
  conditions?: string[];
  preferences?: string[];
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("Missing LOVABLE_API_KEY");
      return new Response(JSON.stringify({ error: "Missing LOVABLE_API_KEY" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { imageBase64, userProfile } = await req.json();

    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "No image provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const profile = userProfile as UserProfile || {};
    const profileContext = `
User Health Profile:
- Allergies: ${profile.allergies?.join(", ") || "None specified"}
- Health Conditions: ${profile.conditions?.join(", ") || "None specified"}
- Dietary Preferences: ${profile.preferences?.join(", ") || "None specified"}
`;

    const prompt = `You are a food ingredient analyzer. Analyze this food label image and extract the ingredients list using OCR.

${profileContext}

Based on the ingredients found and the user's health profile, provide:

1. A health score from 0-100 (where 100 is healthiest)
2. A list of all ingredients detected
3. Key highlights about the food (warnings, benefits, concerns based on user's profile)
4. A brief summary of the overall healthiness

IMPORTANT: Respond ONLY with valid JSON in this exact format:
{
  "score": <number 0-100>,
  "ingredients": ["ingredient1", "ingredient2", ...],
  "highlights": ["highlight1", "highlight2", ...],
  "summary": "Brief summary of the food's healthiness"
}

If you cannot read the ingredients clearly, still provide your best analysis with what you can see. If it's not a food label image, return a score of 0 with an appropriate message.`;

    console.log("Sending request to Lovable AI for food analysis...");

    // Use Lovable AI Gateway with vision model
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: { url: imageBase64 }
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Lovable AI error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ error: "AI analysis error", details: errorText }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    console.log("Lovable AI response received");

    const textContent = data?.choices?.[0]?.message?.content;
    
    if (!textContent) {
      console.error("No text content in AI response:", JSON.stringify(data));
      return new Response(JSON.stringify({ 
        error: "No response from AI",
        score: 50,
        ingredients: [],
        highlights: ["Could not analyze the image"],
        summary: "Unable to analyze the food label. Please try with a clearer image."
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Extract JSON from the response (handle markdown code blocks)
    let jsonStr = textContent;
    const jsonMatch = textContent.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    } else {
      // Try to find JSON object directly
      const objectMatch = textContent.match(/\{[\s\S]*\}/);
      if (objectMatch) {
        jsonStr = objectMatch[0];
      }
    }

    try {
      const result = JSON.parse(jsonStr);
      console.log("Successfully parsed analysis result");
      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (parseError) {
      console.error("Failed to parse JSON response:", parseError, "Raw:", textContent);
      // Return a fallback response
      return new Response(JSON.stringify({
        score: 50,
        ingredients: [],
        highlights: ["Analysis completed but response format was unexpected"],
        summary: textContent.substring(0, 200),
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error in analyze-food function:", error);
    return new Response(JSON.stringify({ error: String(error) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
