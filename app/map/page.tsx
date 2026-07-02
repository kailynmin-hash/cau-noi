"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { PageHero, Section } from "@/components/PageShell";
import { ResourceMap } from "@/components/ResourceMap";

const copy = {
  en: {
    eyebrow: "Interactive Resource Map",
    title: "Map youth mental-health support across CA-45.",
    subtitle: "High-tech filtering for language, insurance, age, and service type.",
    body:
      "Explore counseling centers, school resources, crisis lines, community clinics, and bilingual services in a polished map view. Locations are sample/approximate for the app demo.",
  },
  vi: {
    eyebrow: "Bản đồ nguồn hỗ trợ",
    title: "Xem nguồn hỗ trợ sức khỏe tinh thần cho youth tại CA-45.",
    subtitle: "Lọc theo ngôn ngữ, bảo hiểm, nhóm tuổi, và loại dịch vụ.",
    body:
      "Khám phá trung tâm tư vấn, nguồn hỗ trợ trường học, đường dây khủng hoảng, phòng khám cộng đồng, và dịch vụ song ngữ trong giao diện bản đồ hiện đại. Vị trí là mẫu/gần đúng cho bản demo.",
  },
} as const;

export default function MapPage() {
  const { language } = useLanguage();
  const text = copy[language];

  return (
    <>
      <PageHero eyebrow={text.eyebrow} title={text.title} vietnamese={text.subtitle}>
        <p>{text.body}</p>
      </PageHero>
      <Section>
        <ResourceMap />
      </Section>
    </>
  );
}
