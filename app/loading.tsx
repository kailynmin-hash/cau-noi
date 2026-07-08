import { SkeletonCard, SkeletonChart, SkeletonStatGrid } from "@/components/LoadingStates";

export default function Loading() {
  return (
    <div className="bg-white" aria-busy="true" aria-live="polite">
      <section className="border-b border-teal-950/10 bg-[#eef7f1]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-20">
          <div className="skeleton-shimmer h-4 w-36 rounded-md bg-teal-200" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
            <div>
              <div className="skeleton-shimmer h-12 max-w-2xl rounded-lg bg-slate-200" />
              <div className="skeleton-shimmer mt-3 h-6 w-72 max-w-full rounded-md bg-teal-200" />
            </div>
            <div className="grid gap-3">
              <div className="skeleton-shimmer h-4 w-full rounded-md bg-slate-200" />
              <div className="skeleton-shimmer h-4 w-5/6 rounded-md bg-slate-200" />
              <div className="skeleton-shimmer h-4 w-2/3 rounded-md bg-slate-200" />
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <SkeletonStatGrid />
        <div className="grid gap-4 lg:grid-cols-2">
          <SkeletonChart />
          <SkeletonChart />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </section>
      <span className="sr-only">Loading Cầu Nối</span>
    </div>
  );
}
