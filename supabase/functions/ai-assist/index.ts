import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { mode, text, job } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    let systemPrompt = "";
    let userPrompt = "";
    let tool: any;

    if (mode === "parse_jd") {
      systemPrompt =
        "You are an expert recruiter assistant. Parse messy copy-pasted job posting text (Chinese or English) into clean structured fields. Be concise. Infer if necessary.";
      userPrompt = `Parse this job posting:\n\n${text}`;
      tool = {
        type: "function",
        function: {
          name: "extract_job",
          description: "Extract structured fields from a job posting",
          parameters: {
            type: "object",
            properties: {
              company: { type: "string", description: "Company name" },
              role: { type: "string", description: "Job title / position" },
              salary: { type: "string", description: "Salary range, e.g. '25-40K·14薪' or 'Negotiable'" },
              location: { type: "string", description: "City / location" },
              requirements: {
                type: "array",
                items: { type: "string" },
                description: "Key requirements / skills (max 6 short bullets)",
              },
              summary: { type: "string", description: "One-sentence summary of the role" },
            },
            required: ["company", "role", "salary", "location", "requirements", "summary"],
            additionalProperties: false,
          },
        },
      };
    } else if (mode === "roadmap") {
      systemPrompt =
        "You are a career coach. Given a job application, produce a tactical step-by-step roadmap from preparation to offer. Each step has a short label and 2-4 actionable checklist items.";
      userPrompt = `Build a roadmap for this application:\nCompany: ${job.company}\nRole: ${job.role}\nRequirements: ${(job.requirements || []).join(", ")}\nSummary: ${job.summary || ""}`;
      tool = {
        type: "function",
        function: {
          name: "build_roadmap",
          description: "Build a stepwise roadmap with checklists",
          parameters: {
            type: "object",
            properties: {
              steps: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string", description: "Short step name, e.g. 'Resume Tailoring'" },
                    description: { type: "string", description: "One-line description" },
                    checklist: {
                      type: "array",
                      items: { type: "string" },
                      description: "2-4 actionable items",
                    },
                  },
                  required: ["title", "description", "checklist"],
                  additionalProperties: false,
                },
              },
            },
            required: ["steps"],
            additionalProperties: false,
          },
        },
      };
    } else {
      return new Response(JSON.stringify({ error: "Invalid mode" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [tool],
        tool_choice: { type: "function", function: { name: tool.function.name } },
      }),
    });

    if (!resp.ok) {
      if (resp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (resp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Top up in Lovable Cloud settings." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await resp.text();
      console.error("AI gateway error:", resp.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await resp.json();
    const call = data.choices?.[0]?.message?.tool_calls?.[0];
    const args = call?.function?.arguments;
    if (!args) throw new Error("No tool call returned");
    const parsed = JSON.parse(args);

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("ai-assist error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
