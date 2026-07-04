import { resources, type Resource } from "@/lib/resources";

export type ChartDatum = {
  name: string;
  value: number;
};

export type CityCoverageDatum = {
  city: string;
  count: number;
  languages: string[];
  categories: ChartDatum[];
};

const ca45FocusCities = [
  "Garden Grove",
  "Westminster",
  "Fountain Valley",
  "Santa Ana",
  "Cypress",
  "Los Alamitos",
  "Stanton",
  "Fullerton",
  "La Mirada",
  "Buena Park",
  "Anaheim",
  "Orange County",
];

export function getResourceInsightData(source: Resource[] = resources) {
  const normalizedCities = new Set(source.flatMap((resource) => splitCities(resource.city)));
  const languages = new Set(source.flatMap((resource) => resource.languages));
  const categories = new Set(source.map((resource) => resource.resourceType));
  const cityCoverage: CityCoverageDatum[] = ca45FocusCities.map((city) => {
    const cityResources = source.filter((resource) => resourceMatchesCity(resource, city));

    return {
      city,
      count: cityResources.length,
      languages: Array.from(new Set(cityResources.flatMap((resource) => resource.languages))).sort((a, b) => a.localeCompare(b)),
      categories: countBy(cityResources, (resource) => resource.resourceType).slice(0, 4),
    };
  });

  return {
    totalResources: source.length,
    citiesCovered: normalizedCities.size,
    languagesSupported: languages.size,
    categoriesAvailable: categories.size,
    resourcesByCategory: countBy(source, (resource) => resource.resourceType),
    resourcesByLanguage: countBy(source.flatMap((resource) => resource.languages), (language) => language),
    resourcesByCity: countBy(source.flatMap((resource) => splitCities(resource.city)), (city) => city),
    resourcesByFormat: countBy(source, (resource) => resource.mode),
    cityCoverage,
    focusCitiesCovered: cityCoverage.filter((item) => item.count > 0).length,
    focusCitiesTotal: ca45FocusCities.length,
  };
}

function countBy<T>(items: T[], getKey: (item: T) => string): ChartDatum[] {
  const counts = items.reduce<Record<string, number>>((acc, item) => {
    const key = getKey(item);
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  return Object.entries(counts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value || a.name.localeCompare(b.name));
}

function resourceMatchesCity(resource: Resource, city: string) {
  const resourceCities = splitCities(resource.city);
  return resourceCities.includes(city) || resource.city.includes(city);
}

function splitCities(city: string) {
  return city
    .split("/")
    .map((part) => part.trim())
    .map((part) => {
      if (part.includes("CA-45")) return "CA-45";
      if (part.includes("Orange County")) return "Orange County";
      if (part.includes("California")) return "California";
      if (part.includes("schools")) return "Orange County";
      return part;
    })
    .filter(Boolean);
}
