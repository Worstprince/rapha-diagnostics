// app/api/doctor/notes/[id]/ai-assist/route.js
//
// Note: if you're on Next.js 15+, `params` is a Promise — already handled below.

import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getCurrentUser } from "@/lib/serverSession";
import getVisitDetails from "@/lib/getVisitDetails";
import {
  NARRATIVE_SYSTEM_INSTRUCTION,
  buildNarrativeUserPrompt,
} from "@/lib/ai/buildNarrativePrompt";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    findings: { type: "STRING" },
    impression: { type: "STRING" },
    recommendation: { type: "STRING" },
  },
  required: ["findings", "impression", "recommendation"],
};

export async function POST(request, { params }) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Re-fetch server-side rather than trusting the client payload, so the
    // AI is always grounded in the actual DB values for this visit.
    const visit = await getVisitDetails(id);
    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    // Only test data goes to the AI — never the patient's name or other
    // identifying info. It isn't needed to draft the narrative, and
    // minimizing what's sent to a third-party AI provider matters for a
    // healthcare system.
    const prompt = buildNarrativeUserPrompt({
      tests: visit.tests,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: NARRATIVE_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const draft = JSON.parse(response.text);

    return NextResponse.json({ success: true, draft });
  } catch (err) {
    console.error("POST /api/doctor/notes/[id]/ai-assist failed:", err);
    return NextResponse.json(
      { error: "Failed to generate narrative draft" },
      { status: 500 }
    );
  }
}