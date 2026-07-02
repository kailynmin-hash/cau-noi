export type ImpactMetric = "resourcesViewed" | "conversationsPracticed" | "quizzesCompleted";

const impactKey = "cau-noi-impact-metrics";

export type LocalImpactMetrics = Record<ImpactMetric, number>;

const defaults: LocalImpactMetrics = {
  resourcesViewed: 0,
  conversationsPracticed: 0,
  quizzesCompleted: 0,
};

export function readLocalImpact(): LocalImpactMetrics {
  if (typeof window === "undefined") return defaults;
  try {
    const parsed = JSON.parse(window.localStorage.getItem(impactKey) ?? "{}");
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function incrementImpact(metric: ImpactMetric) {
  if (typeof window === "undefined") return;
  const next = readLocalImpact();
  next[metric] += 1;
  window.localStorage.setItem(impactKey, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent("cau-noi-impact-updated"));
}
