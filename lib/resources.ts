export type Language = "English" | "Vietnamese" | "Spanish" | "Other";
export type CostType = "Free" | "Sliding Scale" | "Insurance Accepted";
export type AgeGroup = "Youth" | "Family" | "All ages";
export type ResourceType =
  | "988 Suicide & Crisis Lifeline"
  | "Orange County Health Care Agency Behavioral Health Services"
  | "CHOC WellSpaces"
  | "School counselors and school wellness centers"
  | "Teen peer support programs"
  | "Community clinics"
  | "Family support resources"
  | "Vietnamese-language mental-health resources";
export type DeliveryMode = "In-Person" | "Virtual" | "In-Person and Virtual";
export type ServiceType = "Counseling centers" | "School resources" | "Crisis lines" | "Community clinics" | "Bilingual services";
export type LanguageFilter = "All languages" | Language;
export type CostFilter = "All costs" | CostType;
export type AgeGroupFilter = "All age groups" | AgeGroup;
export type ResourceTypeFilter = "All resource types" | ResourceType;
export type ServiceTypeFilter = "All service types" | ServiceType;
export type ModeFilter = "Any format" | DeliveryMode;

export type Resource = {
  name: string;
  resourceType: ResourceType;
  city: string;
  description: string;
  url: string;
  phone: string;
  languages: Language[];
  costTypes: CostType[];
  ageGroups: AgeGroup[];
  mode: DeliveryMode;
  serviceType: ServiceType;
  coordinates: { lat: number; lng: number };
  accessibility: string[];
  tags: string[];
};

export const languageOptions: LanguageFilter[] = ["All languages", "English", "Vietnamese", "Spanish", "Other"];
export const costOptions: CostFilter[] = ["All costs", "Free", "Sliding Scale", "Insurance Accepted"];
export const ageGroupOptions: AgeGroupFilter[] = ["All age groups", "Youth", "Family", "All ages"];
export const resourceTypeOptions: ResourceTypeFilter[] = [
  "All resource types",
  "988 Suicide & Crisis Lifeline",
  "Orange County Health Care Agency Behavioral Health Services",
  "CHOC WellSpaces",
  "School counselors and school wellness centers",
  "Teen peer support programs",
  "Community clinics",
  "Family support resources",
  "Vietnamese-language mental-health resources",
];
export const modeOptions: ModeFilter[] = ["Any format", "In-Person", "Virtual", "In-Person and Virtual"];
export const serviceTypeOptions: ServiceTypeFilter[] = [
  "All service types",
  "Counseling centers",
  "School resources",
  "Crisis lines",
  "Community clinics",
  "Bilingual services",
];

export const resources: Resource[] = [
  {
    name: "988 Suicide & Crisis Lifeline",
    resourceType: "988 Suicide & Crisis Lifeline",
    city: "Nationwide / CA-45",
    description:
      "Immediate crisis support for anyone experiencing suicidal thoughts, emotional distress, or concern for someone else.",
    url: "https://988lifeline.org/",
    phone: "988",
    languages: ["English", "Spanish", "Other"],
    costTypes: ["Free"],
    ageGroups: ["All ages"],
    mode: "Virtual",
    serviceType: "Crisis lines",
    coordinates: { lat: 33.7743, lng: -117.9406 },
    accessibility: ["24/7 call, text, and chat", "Interpreter access may be requested"],
    tags: ["Crisis", "Immediate support", "Confidential"],
  },
  {
    name: "OC Links Behavioral Health Navigation",
    resourceType: "Orange County Health Care Agency Behavioral Health Services",
    city: "Orange County",
    description:
      "County behavioral-health navigation for mental-health and substance-use referrals, including youth and family support.",
    url: "https://www.ochealthinfo.com/services-programs/mental-health-crisis-recovery/navigation-help-resources/oc-links",
    phone: "855-625-4657",
    languages: ["English", "Spanish", "Other"],
    costTypes: ["Free", "Insurance Accepted"],
    ageGroups: ["Youth", "Family", "All ages"],
    mode: "Virtual",
    serviceType: "Crisis lines",
    coordinates: { lat: 33.7502, lng: -117.8703 },
    accessibility: ["County navigation line", "Can connect callers to local programs"],
    tags: ["Orange County", "Referrals", "Behavioral health"],
  },
  {
    name: "CHOC WellSpaces and Youth Wellness Supports",
    resourceType: "CHOC WellSpaces",
    city: "Orange County schools",
    description:
      "Youth-centered wellness spaces and school-linked supports designed to reduce stress and connect students with trusted adults.",
    url: "https://choc.org/population-health/wellspaces/",
    phone: "Contact placeholder",
    languages: ["English", "Spanish", "Other"],
    costTypes: ["Free"],
    ageGroups: ["Youth"],
    mode: "In-Person",
    serviceType: "School resources",
    coordinates: { lat: 33.7899, lng: -117.9977 },
    accessibility: ["School-based setting", "Youth-friendly environment"],
    tags: ["CHOC", "Wellness", "School-based"],
  },
  {
    name: "CA-45 School Counselor or Wellness Center",
    resourceType: "School counselors and school wellness centers",
    city: "Garden Grove, Westminster, Fountain Valley, Cypress, and nearby CA-45 schools",
    description:
      "A starting point for students who want confidential guidance, academic stress support, referrals, or help talking with family.",
    url: "https://ggusd.us/resources/wellness-resources/mental-health-resources",
    phone: "Ask school front office",
    languages: ["English", "Vietnamese", "Spanish", "Other"],
    costTypes: ["Free"],
    ageGroups: ["Youth"],
    mode: "In-Person",
    serviceType: "School resources",
    coordinates: { lat: 33.7739, lng: -117.9414 },
    accessibility: ["On campus", "Ask for interpretation or translation support"],
    tags: ["School counselor", "Wellness center", "Trusted adult"],
  },
  {
    name: "NAMI Orange County Teens & Young Adults",
    resourceType: "Teen peer support programs",
    city: "Orange County",
    description:
      "Teen and young-adult mental-health resources, peer stories, and no-cost support pathways from NAMI Orange County.",
    url: "https://www.namioc.org/teens-young-adults",
    phone: "714-991-6412",
    languages: ["English", "Spanish", "Other"],
    costTypes: ["Free", "Sliding Scale"],
    ageGroups: ["Youth"],
    mode: "In-Person and Virtual",
    serviceType: "Counseling centers",
    coordinates: { lat: 33.7878, lng: -117.8531 },
    accessibility: ["Teen-focused", "Adult-facilitated safety structure"],
    tags: ["Peer support", "Stress", "Belonging"],
  },
  {
    name: "Families Together OC Garden Grove Health Center",
    resourceType: "Community clinics",
    city: "Santa Ana / Garden Grove / Westminster",
    description:
      "Community clinic in Garden Grove offering medical care and mental-health services such as individual counseling.",
    url: "https://familiestogetheroc.org/locations/garden-grove",
    phone: "800-597-7977",
    languages: ["English", "Vietnamese", "Spanish", "Other"],
    costTypes: ["Sliding Scale", "Insurance Accepted"],
    ageGroups: ["Youth", "Family", "All ages"],
    mode: "In-Person and Virtual",
    serviceType: "Community clinics",
    coordinates: { lat: 33.7455, lng: -117.9601 },
    accessibility: ["Sliding-fee options may be available", "Ask about interpretation"],
    tags: ["Clinic", "Counseling referral", "Primary care"],
  },
  {
    name: "NAMI Orange County Family Support Groups",
    resourceType: "Family support resources",
    city: "Orange County",
    description:
      "Peer-led family support groups and education for caregivers and loved ones supporting someone with a mental-health condition.",
    url: "https://www.namioc.org/support-groups",
    phone: "714-544-8488",
    languages: ["English", "Spanish", "Other"],
    costTypes: ["Free", "Sliding Scale"],
    ageGroups: ["Family"],
    mode: "In-Person and Virtual",
    serviceType: "Counseling centers",
    coordinates: { lat: 33.6951, lng: -117.9243 },
    accessibility: ["Caregiver-friendly", "Evening or virtual options may be available"],
    tags: ["Caregivers", "Family education", "Communication"],
  },
  {
    name: "OCAPICA Behavioral Health",
    resourceType: "Vietnamese-language mental-health resources",
    city: "Little Saigon / Westminster / Garden Grove",
    description:
      "Culturally responsive behavioral-health outreach, prevention workshops, screenings, counseling, peer support, referrals, and case management.",
    url: "https://www.ocapica.org/behavioralhealth.html",
    phone: "714-636-6286",
    languages: ["Vietnamese", "English"],
    costTypes: ["Free", "Sliding Scale", "Insurance Accepted"],
    ageGroups: ["Youth", "Family", "All ages"],
    mode: "In-Person and Virtual",
    serviceType: "Bilingual services",
    coordinates: { lat: 33.7592, lng: -117.9897 },
    accessibility: ["Vietnamese language support", "Culturally familiar navigation"],
    tags: ["Vietnamese", "Little Saigon", "Family support"],
  },
];
