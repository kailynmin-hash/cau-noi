export type CommunityContextSource = {
  title: string;
  body: string;
  sourceName: string;
  sourceUrl: string;
};

export const communityContextSources: CommunityContextSource[] = [
  {
    title: "County behavioral-health navigation",
    body: "OC Links is used as a public context source for countywide behavioral-health navigation and referral pathways.",
    sourceName: "Orange County Health Care Agency OC Links",
    sourceUrl: "https://www.ochealthinfo.com/OCLINKS",
  },
  {
    title: "Youth crisis support",
    body: "988 and California Youth Crisis Line are used as public context sources for crisis and youth support pathways.",
    sourceName: "988 Suicide & Crisis Lifeline",
    sourceUrl: "https://988lifeline.org/",
  },
  {
    title: "School wellness context",
    body: "School district wellness pages are used as public context sources for school-based support availability.",
    sourceName: "Orange County Department of Education",
    sourceUrl: "https://ocde.us/",
  },
];
