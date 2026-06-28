"use client";

import { useLanguage } from "@/components/LanguageProvider";
import { ResourceFinder } from "@/components/ResourceFinder";
import { PageHero, Section } from "@/components/PageShell";

const copy = {
  en: {
    eyebrow: "Resource Finder",
    title: "Find CA-45 and Orange County support without giving your identity.",
    subtitle: "Local options organized by language, cost, resource type, and access format.",
    body:
      "Filter sample local options by language, cost, resource type, and in-person or virtual access. This page does not collect names, emails, addresses, or school IDs.",
    intro:
      "Resource information changes. Users should verify hours, eligibility, services, costs, and language access directly with providers before seeking care.",
  },
  vi: {
    eyebrow: "Tìm nguồn hỗ trợ",
    title: "Tìm hỗ trợ tại CA-45 và Orange County mà không cần chia sẻ danh tính.",
    subtitle: "Nguồn hỗ trợ địa phương được sắp xếp theo ngôn ngữ, chi phí, loại dịch vụ, và hình thức tiếp cận.",
    body:
      "Lọc các lựa chọn mẫu tại địa phương theo ngôn ngữ, chi phí, loại nguồn hỗ trợ, và trực tiếp hoặc trực tuyến. Trang này không thu tên, email, địa chỉ, hoặc mã số học sinh.",
    intro:
      "Thông tin dịch vụ có thể thay đổi. Người dùng nên xác minh giờ làm việc, điều kiện, dịch vụ, chi phí, và hỗ trợ ngôn ngữ trực tiếp với nhà cung cấp trước khi tìm sự chăm sóc.",
  },
} as const;

export default function ResourceFinderPage() {
  const { language } = useLanguage();
  const text = copy[language];

  return (
    <>
      <PageHero eyebrow={text.eyebrow} title={text.title} vietnamese={text.subtitle}>
        <p>{text.body}</p>
      </PageHero>
      <Section intro={text.intro}>
        <ResourceFinder />
      </Section>
    </>
  );
}
