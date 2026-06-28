import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  vietnamese,
  children,
}: {
  eyebrow: string;
  title: string;
  vietnamese: string;
  children: ReactNode;
}) {
  return (
    <section className="border-b border-teal-950/10 bg-[#eef7f1] shadow-[inset_0_-1px_0_rgba(15,76,72,0.04)]">
      <div className="animate-rise-in mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-teal-800">{eyebrow}</p>
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-normal text-slate-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-lg font-medium text-teal-800">{vietnamese}</p>
          </div>
          <div className="max-w-2xl text-base leading-8 text-slate-700 lg:justify-self-end">{children}</div>
        </div>
      </div>
    </section>
  );
}

export function Section({
  title,
  intro,
  children,
  tone = "white",
}: {
  title?: string;
  intro?: string;
  children: ReactNode;
  tone?: "white" | "mist";
}) {
  return (
    <section className={tone === "mist" ? "bg-[#f3f8f5]" : "bg-white"}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {(title || intro) && (
          <div className="mb-8 max-w-3xl">
            {title && <h2 className="text-2xl font-semibold leading-tight text-slate-950 sm:text-3xl">{title}</h2>}
            {intro && <p className="mt-3 leading-8 text-slate-600">{intro}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
