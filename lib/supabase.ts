import { createClient } from "@supabase/supabase-js";

export type SurveyResponse = {
  age_group: string;
  language: string;
  comfort_talking_home: number;
  knows_where_to_get_help: number;
  language_barrier: number;
  /** Decimal average on a 1-5 Likert scale. Database column: numeric(3,2). */
  stigma_score: number;
  would_use_bilingual_tool: number;
};

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);
