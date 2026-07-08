"use client";

import type { ReactNode } from "react";
import { Loader2 } from "lucide-react";

function SkeletonLine({ className = "" }: { className?: string }) {
  return <span className={`skeleton-shimmer block rounded-md bg-slate-200/80 ${className}`} />;
}

export function PageTransitionWrapper({ children }: { children: ReactNode }) {
  return <div className="page-transition min-h-full">{children}</div>;
}

export function LoadingSpinner({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-2" role="status" aria-live="polite">
      <Loader2 className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}

export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <article className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`} aria-hidden="true">
      <SkeletonLine className="h-3 w-28" />
      <SkeletonLine className="mt-4 h-6 w-3/4" />
      <div className="mt-5 grid gap-2">
        <SkeletonLine className="h-3 w-full" />
        <SkeletonLine className="h-3 w-11/12" />
        <SkeletonLine className="h-3 w-2/3" />
      </div>
    </article>
  );
}

export function SkeletonStatCard() {
  return (
    <article className="rounded-lg border border-teal-100 bg-white p-5 shadow-sm" aria-hidden="true">
      <div className="flex items-start justify-between gap-3">
        <div className="w-full">
          <SkeletonLine className="h-4 w-28" />
          <SkeletonLine className="mt-4 h-9 w-20" />
        </div>
        <span className="skeleton-shimmer size-10 rounded-lg bg-teal-100" />
      </div>
      <SkeletonLine className="mt-4 h-3 w-4/5" />
    </article>
  );
}

export function SkeletonChart({ className = "" }: { className?: string }) {
  return (
    <article className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`} aria-hidden="true">
      <SkeletonLine className="h-5 w-48" />
      <SkeletonLine className="mt-3 h-3 w-2/3" />
      <div className="mt-6 grid h-56 items-end gap-3 rounded-lg border border-slate-100 bg-[#f6faf7] p-4">
        <div className="flex h-full items-end gap-3">
          {[44, 72, 54, 88, 62, 78].map((height, index) => (
            <span key={index} className="skeleton-shimmer flex-1 rounded-t-md bg-teal-100" style={{ height: `${height}%` }} />
          ))}
        </div>
      </div>
    </article>
  );
}

export function SkeletonResourceCard() {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" aria-hidden="true">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="w-full">
          <SkeletonLine className="h-3 w-36" />
          <SkeletonLine className="mt-3 h-4 w-48" />
          <SkeletonLine className="mt-3 h-6 w-3/4" />
        </div>
        <span className="skeleton-shimmer h-7 w-20 rounded-md bg-slate-200" />
      </div>
      <div className="grid gap-2">
        <SkeletonLine className="h-3 w-full" />
        <SkeletonLine className="h-3 w-11/12" />
        <SkeletonLine className="h-3 w-2/3" />
      </div>
      <div className="mt-5 grid gap-3">
        <SkeletonLine className="h-4 w-5/6" />
        <SkeletonLine className="h-4 w-3/4" />
        <SkeletonLine className="h-4 w-4/5" />
      </div>
      <div className="mt-5 flex gap-2">
        <SkeletonLine className="h-10 w-32" />
        <SkeletonLine className="h-10 w-24" />
      </div>
    </article>
  );
}

export function SkeletonMap() {
  return (
    <div className="grid h-[540px] min-h-[560px] w-full place-items-center rounded-lg border border-white/10 bg-teal-950/80 p-6 text-center text-teal-50 lg:h-[650px] lg:min-h-[650px]" role="status" aria-live="polite">
      <div className="w-full max-w-md">
        <div className="mx-auto mb-5 size-14 rounded-full border border-teal-200/30 bg-teal-100/10 p-3">
          <Loader2 className="mx-auto size-7 animate-spin text-teal-100 motion-reduce:animate-none" aria-hidden="true" />
        </div>
        <SkeletonLine className="mx-auto h-5 w-48 bg-teal-100/30" />
        <SkeletonLine className="mx-auto mt-3 h-3 w-72 max-w-full bg-teal-100/20" />
        <div className="mt-7 grid grid-cols-3 gap-3">
          <SkeletonLine className="h-16 bg-teal-100/15" />
          <SkeletonLine className="h-16 bg-teal-100/20" />
          <SkeletonLine className="h-16 bg-teal-100/15" />
        </div>
      </div>
      <span className="sr-only">Loading map</span>
    </div>
  );
}

export function SkeletonStatGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="status" aria-live="polite">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonStatCard key={index} />
      ))}
      <span className="sr-only">Loading statistics</span>
    </div>
  );
}

export function SkeletonResourceGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid min-w-0 gap-4 md:grid-cols-2" role="status" aria-live="polite">
      {Array.from({ length: count }).map((_, index) => (
        <SkeletonResourceCard key={index} />
      ))}
      <span className="sr-only">Loading resources</span>
    </div>
  );
}
