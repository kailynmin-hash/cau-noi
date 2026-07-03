import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { type SurveyResponse } from "@/lib/supabase";

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
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const isDevelopment = process.env.NODE_ENV !== "production";

  if (!supabaseUrl || !supabaseKey) {
    const configError = {
      submitPath,
      hasSupabaseUrl: Boolean(supabaseUrl),
      hasSupabaseKey: Boolean(supabaseKey),
      message: "Supabase environment variables are missing.",
    };
    console.error("[quiz-submissions] Supabase config missing", configError);

    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't save your response. Please try again.",
        ...(isDevelopment ? { debug: configError } : {}),
      },
      { status: 500 },
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  try {
    const body = (await request.json()) as Partial<SurveyResponse>;
    const missingFields = requiredFields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");

    if (missingFields.length > 0) {
      if (isDevelopment) {
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
      const debugError = {
        submitPath,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      };
      console.error("[quiz-submissions] Supabase insert failed", debugError);

      return NextResponse.json(
        {
          ok: false,
          error: "We couldn't save your response. Please try again.",
          ...(isDevelopment ? { debug: debugError } : {}),
        },
        { status: 500 },
      );
    }

    if (isDevelopment) {
      console.info("[quiz-submissions] submission saved", { submitPath, status: 200 });
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const debugError = normalizeError(error);
    console.error("[quiz-submissions] request failed", {
      submitPath,
      ...debugError,
    });

    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't save your response. Please try again.",
        ...(isDevelopment ? { debug: { submitPath, ...debugError } } : {}),
      },
      { status: 500 },
    );
  }
}

function normalizeError(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return {
    message: String(error),
  };
}
