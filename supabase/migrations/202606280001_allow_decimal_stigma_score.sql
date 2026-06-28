alter table public.survey_responses
  alter column stigma_score type numeric(3, 2)
  using stigma_score::numeric(3, 2);
