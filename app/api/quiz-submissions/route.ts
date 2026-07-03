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

const tableName = "survey_responses";
const storageNotConfiguredMessage = "Quiz storage is not configured yet.";
const saveFailedMessage = "We couldn't save your response. Please try again.";

export async function GET() {
  const config = getSupabaseConfig();

  if (!config.ok) {
    console.error("[quiz-submissions] diagnostics storage config missing", config.debug);

    return NextResponse.json(
      {
        ok: false,
        status: "storage_not_configured",
        error: storageNotConfiguredMessage,
        debug: config.debug,
      },
      { status: 503 },
    );
  }

  const supabase = createSupabaseClient(config.supabaseUrl, config.supabaseKey);
  const { error } = await supabase.from(tableName).select("*", { count: "exact", head: true });

  if (error) {
    const debugError = {
      ...config.debug,
      tableName,
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    };
    console.error("[quiz-submissions] diagnostics table check failed", debugError);

    return NextResponse.json(
      {
        ok: false,
        status: "table_check_failed",
        error: saveFailedMessage,
        debug: debugError,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    status: "ready",
    debug: {
      ...config.debug,
      tableName,
      columns: requiredFields,
    },
  });
}

export async function POST(request: Request) {
  const submitPath = new URL(request.url).pathname;
  const isDevelopment = process.env.NODE_ENV !== "production";
  const config = getSupabaseConfig();

  if (!config.ok) {
    const configError = {
      ...config.debug,
      submitPath,
    };
    console.error("[quiz-submissions] Supabase config missing", configError);

    return NextResponse.json(
      {
        ok: false,
        status: "storage_not_configured",
        error: storageNotConfiguredMessage,
        ...(isDevelopment ? { debug: configError } : {}),
      },
      { status: 503 },
    );
  }

  const supabase = createSupabaseClient(config.supabaseUrl, config.supabaseKey);

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

    const insertColumns = Object.keys(response);
    console.info("[quiz-submissions] inserting anonymous survey response", {
      submitPath,
      ...config.debug,
      tableName,
      columns: insertColumns,
    });

    const { error } = await supabase.from(tableName).insert(response);

    if (error) {
      const debugError = {
        submitPath,
        ...config.debug,
        tableName,
        columns: insertColumns,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      };
      console.error("[quiz-submissions] Supabase insert failed", debugError);

      return NextResponse.json(
        {
          ok: false,
          error: saveFailedMessage,
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
        error: saveFailedMessage,
        ...(isDevelopment ? { debug: { submitPath, ...debugError } } : {}),
      },
      { status: 500 },
    );
  }
}

function getSupabaseConfig():
  | {
      ok: true;
      supabaseUrl: string;
      supabaseKey: string;
      debug: SupabaseConfigDebug;
    }
  | {
      ok: false;
      debug: SupabaseConfigDebug;
    } {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseKey = serviceRoleKey ?? anonKey;
  const parsedUrl = parseSupabaseUrl(supabaseUrl);
  const debug: SupabaseConfigDebug = {
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasSupabaseAnonKey: Boolean(anonKey),
    hasSupabaseServiceRoleKey: Boolean(serviceRoleKey),
    usingServiceRoleKey: Boolean(serviceRoleKey),
    supabaseUrlOrigin: parsedUrl.origin,
    supabaseUrlPathname: parsedUrl.pathname,
    supabaseUrlIsValid: parsedUrl.valid,
    message: !supabaseUrl || !supabaseKey ? "Supabase environment variables are missing." : undefined,
  };

  if (!supabaseUrl || !supabaseKey || !parsedUrl.valid) {
    return { ok: false, debug };
  }

  return { ok: true, supabaseUrl, supabaseKey, debug };
}

function createSupabaseClient(supabaseUrl: string, supabaseKey: string) {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function parseSupabaseUrl(value: string | undefined) {
  if (!value) {
    return { valid: false, origin: null, pathname: null };
  }

  try {
    const parsed = new URL(value);
    return {
      valid: parsed.protocol === "https:" && parsed.hostname.endsWith(".supabase.co"),
      origin: parsed.origin,
      pathname: parsed.pathname,
    };
  } catch {
    return { valid: false, origin: null, pathname: null };
  }
}

type SupabaseConfigDebug = {
  hasSupabaseUrl: boolean;
  hasSupabaseAnonKey: boolean;
  hasSupabaseServiceRoleKey: boolean;
  usingServiceRoleKey: boolean;
  supabaseUrlOrigin: string | null;
  supabaseUrlPathname: string | null;
  supabaseUrlIsValid: boolean;
  message?: string;
};

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
