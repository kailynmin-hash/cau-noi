import { NextResponse } from "next/server";
import { type SurveyResponse, supabase } from "@/lib/supabase";

const requiredFields: Array<keyof SurveyResponse> = [
  "age_group",
  "language",
  "comfort_talking_home",
  "knows_where_to_get_help",
  "language_barrier",
  "stigma_score",
  "would_use_bilingual_tool",
];

export async function POST(request: Request) {
  const submitPath = new URL(request.url).pathname;

  try {
    const body = (await request.json()) as Partial<SurveyResponse>;
    const missingFields = requiredFields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");

    if (missingFields.length > 0) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[quiz-submissions] validation failed", { submitPath, missingFields });
      }

      return NextResponse.json(
        { ok: false, error: "Please complete every quiz question before submitting." },
        { status: 400 },
      );
    }

    const response: SurveyResponse = {
      age_group: String(body.age_group),
      language: String(body.language),
      comfort_talking_home: Number(body.comfort_talking_home),
      knows_where_to_get_help: Number(body.knows_where_to_get_help),
      language_barrier: Number(body.language_barrier),
      stigma_score: Number(body.stigma_score),
      would_use_bilingual_tool: Number(body.would_use_bilingual_tool),
    };

    const { error } = await supabase.from("survey_responses").insert(response);

    if (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[quiz-submissions] Supabase insert failed", {
          submitPath,
          status: error.code,
          error: error.message,
        });
      }

      return NextResponse.json(
        { ok: false, error: "We couldn't save your response. Please try again." },
        { status: 500 },
      );
    }

    if (process.env.NODE_ENV !== "production") {
      console.info("[quiz-submissions] submission saved", { submitPath, status: 200 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[quiz-submissions] request failed", {
        submitPath,
        error,
      });
    }

    return NextResponse.json(
      { ok: false, error: "We couldn't save your response. Please try again." },
      { status: 500 },
    );
  }
}
