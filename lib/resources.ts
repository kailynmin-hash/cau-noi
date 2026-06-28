export type Language = "English" | "Vietnamese" | "Spanish" | "Other";
export type CostType = "Free" | "Sliding Scale" | "Insurance Accepted";
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
export type LanguageFilter = "All languages" | Language;
export type CostFilter = "All costs" | CostType;
export type ResourceTypeFilter = "All resource types" | ResourceType;
export type ModeFilter = "Any format" | DeliveryMode;

export type Resource = {
  name: string;
  resourceType: ResourceType;
  city: string;
  description: string;
  website: string;
  phone: string;
  languages: Language[];
  costTypes: CostType[];
  mode: DeliveryMode;
  accessibility: string[];
  tags: string[];
};

export const languageOptions: LanguageFilter[] = ["All languages", "English", "Vietnamese", "Spanish", "Other"];
export const costOptions: CostFilter[] = ["All costs", "Free", "Sliding Scale", "Insurance Accepted"];
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

export const resources: Resource[] = [
  {
    name: "988 Suicide & Crisis Lifeline",
    resourceType: "988 Suicide & Crisis Lifeline",
    city: "Nationwide / CA-45",
    description:
      "Immediate crisis support for anyone experiencing suicidal thoughts, emotional distress, or concern for someone else.",
    website: "https://988lifeline.org/",
    phone: "988",
    languages: ["English", "Spanish", "Other"],
    costTypes: ["Free"],
    mode: "Virtual",
    accessibility: ["24/7 call, text, and chat", "Interpreter access may be requested"],
    tags: ["Crisis", "Immediate support", "Confidential"],
  },
  {
    name: "OC Links Behavioral Health Navigation",
    resourceType: "Orange County Health Care Agency Behavioral Health Services",
    city: "Orange County",
    description:
      "County behavioral-health navigation for mental-health and substance-use referrals, including youth and family support.",
    website: "Provider website placeholder",
    phone: "Contact placeholder",
    languages: ["English", "Spanish", "Other"],
    costTypes: ["Free", "Insurance Accepted"],
    mode: "Virtual",
    accessibility: ["County navigation line", "Can connect callers to local programs"],
    tags: ["Orange County", "Referrals", "Behavioral health"],
  },
  {
    name: "CHOC WellSpaces and Youth Wellness Supports",
    resourceType: "CHOC WellSpaces",
    city: "Orange County schools",
    description:
      "Youth-centered wellness spaces and school-linked supports designed to reduce stress and connect students with trusted adults.",
    website: "Provider website placeholder",
    phone: "Contact placeholder",
    languages: ["English", "Spanish", "Other"],
    costTypes: ["Free"],
    mode: "In-Person",
    accessibility: ["School-based setting", "Youth-friendly environment"],
    tags: ["CHOC", "Wellness", "School-based"],
  },
  {
    name: "CA-45 School Counselor or Wellness Center",
    resourceType: "School counselors and school wellness centers",
    city: "Garden Grove, Westminster, Fountain Valley, Cypress, and nearby CA-45 schools",
    description:
      "A starting point for students who want confidential guidance, academic stress support, referrals, or help talking with family.",
    website: "School district website placeholder",
    phone: "Ask school front office",
    languages: ["English", "Vietnamese", "Spanish", "Other"],
    costTypes: ["Free"],
    mode: "In-Person",
    accessibility: ["On campus", "Ask for interpretation or translation support"],
    tags: ["School counselor", "Wellness center", "Trusted adult"],
  },
  {
    name: "Teen Peer Support Circle",
    resourceType: "Teen peer support programs",
    city: "Orange County",
    description:
      "Sample peer-led or peer-supported group for teens to talk about stress, belonging, and coping skills in a supervised setting.",
    website: "Program website placeholder",
    phone: "Contact placeholder",
    languages: ["English", "Spanish", "Other"],
    costTypes: ["Free", "Sliding Scale"],
    mode: "In-Person and Virtual",
    accessibility: ["Teen-focused", "Adult-facilitated safety structure"],
    tags: ["Peer support", "Stress", "Belonging"],
  },
  {
    name: "Orange County Community Clinic Behavioral Health Referral",
    resourceType: "Community clinics",
    city: "Santa Ana / Garden Grove / Westminster",
    description:
      "Sample community clinic entry for low-cost counseling referrals, primary-care screening, and culturally responsive care navigation.",
    website: "Clinic website placeholder",
    phone: "Appointment line placeholder",
    languages: ["English", "Vietnamese", "Spanish", "Other"],
    costTypes: ["Sliding Scale", "Insurance Accepted"],
    mode: "In-Person and Virtual",
    accessibility: ["Sliding-fee options may be available", "Ask about interpretation"],
    tags: ["Clinic", "Counseling referral", "Primary care"],
  },
  {
    name: "Family Mental-Health Education and Support",
    resourceType: "Family support resources",
    city: "Orange County",
    description:
      "Sample family education resource for caregivers who want to understand youth mental health, communication, and support options.",
    website: "Family support website placeholder",
    phone: "Contact placeholder",
    languages: ["English", "Spanish", "Other"],
    costTypes: ["Free", "Sliding Scale"],
    mode: "In-Person and Virtual",
    accessibility: ["Caregiver-friendly", "Evening or virtual options may be available"],
    tags: ["Caregivers", "Family education", "Communication"],
  },
  {
    name: "Vietnamese-Language Mental-Health Navigation",
    resourceType: "Vietnamese-language mental-health resources",
    city: "Little Saigon / Westminster / Garden Grove",
    description:
      "Sample Vietnamese-language navigation card for families seeking culturally familiar referrals, interpretation, and mental-health education.",
    website: "Vietnamese-language resource placeholder",
    phone: "Vietnamese contact placeholder",
    languages: ["Vietnamese", "English"],
    costTypes: ["Free", "Sliding Scale", "Insurance Accepted"],
    mode: "In-Person and Virtual",
    accessibility: ["Vietnamese language support", "Culturally familiar navigation"],
    tags: ["Vietnamese", "Little Saigon", "Family support"],
  },
];
