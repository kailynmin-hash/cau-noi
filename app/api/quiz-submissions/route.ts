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
const expectedColumns = requiredFields;

export async function GET() {
  const config = getSupabaseConfig();

  if (!config.ok) {
    console.error("quiz submission error", config.debug);

    return NextResponse.json(
      {
        ok: false,
        routeLoaded: true,
        hasSupabaseUrl: config.debug.hasSupabaseUrl,
        hasSupabaseAnonKey: config.debug.hasSupabaseAnonKey,
        tableName,
        expectedColumns,
        debugError: config.debug.message,
        debugDetails: config.debug,
      },
      { status: 503 },
    );
  }

  const supabase = createSupabaseClient(config.supabaseUrl, config.supabaseKey);
  const { error } = await supabase.from(tableName).select("*", { count: "exact", head: true });

  if (error) {
    const debugError = {
      tableName,
      expectedColumns,
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    };
    console.error("quiz submission error", debugError);

    return NextResponse.json(
      {
        ok: false,
        routeLoaded: true,
        hasSupabaseUrl: config.debug.hasSupabaseUrl,
        hasSupabaseAnonKey: config.debug.hasSupabaseAnonKey,
        tableName,
        expectedColumns,
        debugError: error.message,
        debugDetails: debugError,
      },
      { status: 500 },
    );
  }

  return NextResponse.json({
    ok: true,
    routeLoaded: true,
    hasSupabaseUrl: config.debug.hasSupabaseUrl,
    hasSupabaseAnonKey: config.debug.hasSupabaseAnonKey,
    tableName,
    expectedColumns,
  });
}

export async function POST(request: Request) {
  const submitPath = new URL(request.url).pathname;
  const config = getSupabaseConfig();

  if (!config.ok) {
    const configError = {
      submitPath,
      tableName,
      expectedColumns,
      ...config.debug,
    };
    console.error("quiz submission error", configError);

    return NextResponse.json(
      {
        ok: false,
        status: 503,
        missingFields: [],
        receivedBody: null,
        debugError: config.debug.message,
        debugDetails: configError,
      },
      { status: 503 },
    );
  }

  const supabase = createSupabaseClient(config.supabaseUrl, config.supabaseKey);

  try {
    const body = (await request.json()) as Partial<SurveyResponse>;
    const missingFields = requiredFields.filter((field) => body[field] === undefined || body[field] === null || body[field] === "");

    if (missingFields.length > 0) {
      console.warn("[quiz-submissions] validation failed", { submitPath, missingFields });

      return NextResponse.json(
        {
          ok: false,
          status: 400,
          missingFields,
          receivedBody: body,
          debugError: "Missing required quiz submission fields.",
          debugDetails: {
            submitPath,
            tableName,
            expectedColumns,
            missingFields,
            receivedBody: body,
          },
        },
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
    console.info("quiz submission insert attempt", {
      submitPath,
      tableName,
      columns: insertColumns,
      hasSupabaseUrl: config.debug.hasSupabaseUrl,
      hasSupabaseAnonKey: config.debug.hasSupabaseAnonKey,
    });

    const { error } = await supabase.from(tableName).insert(response);

    if (error) {
      const debugError = {
        submitPath,
        hasSupabaseUrl: config.debug.hasSupabaseUrl,
        hasSupabaseAnonKey: config.debug.hasSupabaseAnonKey,
        tableName,
        columns: insertColumns,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      };
      console.error("quiz submission error", error);
      console.error("quiz submission error details", debugError);

      return NextResponse.json(
        {
          ok: false,
          status: 500,
          missingFields: [],
          receivedBody: response,
          debugError: error.message,
          debugDetails: debugError,
        },
        { status: 500 },
      );
    }

    console.info("quiz submission saved", { submitPath, tableName, columns: insertColumns });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const debugError = normalizeError(error);
    console.error("quiz submission error", error);

    return NextResponse.json(
      {
        ok: false,
        status: 500,
        missingFields: [],
        receivedBody: null,
        debugError: debugError.message,
        debugDetails: {
          submitPath,
          tableName,
          expectedColumns,
          ...debugError,
        },
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
  const parsedUrl = parseSupabaseUrl(supabaseUrl);
  const debug: SupabaseConfigDebug = {
    hasSupabaseUrl: Boolean(supabaseUrl),
    hasSupabaseAnonKey: Boolean(anonKey),
    supabaseUrlOrigin: parsedUrl.origin,
    supabaseUrlPathname: parsedUrl.pathname,
    supabaseUrlIsValid: parsedUrl.valid,
    message: getConfigMessage({
      hasSupabaseUrl: Boolean(supabaseUrl),
      hasSupabaseAnonKey: Boolean(anonKey),
      supabaseUrlIsValid: parsedUrl.valid,
    }),
  };

  if (!supabaseUrl || !anonKey || !parsedUrl.valid) {
    return { ok: false, debug };
  }

  return { ok: true, supabaseUrl, supabaseKey: anonKey, debug };
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
  supabaseUrlOrigin: string | null;
  supabaseUrlPathname: string | null;
  supabaseUrlIsValid: boolean;
  message?: string;
};

function getConfigMessage({
  hasSupabaseUrl,
  hasSupabaseAnonKey,
  supabaseUrlIsValid,
}: {
  hasSupabaseUrl: boolean;
  hasSupabaseAnonKey: boolean;
  supabaseUrlIsValid: boolean;
}) {
  const missing = [
    !hasSupabaseUrl ? "NEXT_PUBLIC_SUPABASE_URL" : null,
    !hasSupabaseAnonKey ? "NEXT_PUBLIC_SUPABASE_ANON_KEY" : null,
  ].filter(Boolean);

  if (missing.length > 0) {
    return `Missing Vercel environment variable(s): ${missing.join(", ")}`;
  }

  if (!supabaseUrlIsValid) {
    return "NEXT_PUBLIC_SUPABASE_URL must be a valid https://*.supabase.co URL with no extra path.";
  }

  return undefined;
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
