import Image from "next/image";
import { BrainBloom, BotanicalSprig } from "@/components/Botanical";

export function YouthHeroGraphic({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-y-0 right-0 overflow-hidden ${className}`} aria-hidden="true">
      <Image
        src="/visuals/youth-nature-hero.jpg"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 62vw, 100vw"
        className="object-cover object-right"
      />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,247,0.98)_0%,rgba(255,253,247,0.82)_34%,rgba(255,253,247,0.24)_70%,rgba(255,253,247,0.04)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,253,247,0.26),transparent_18rem),linear-gradient(180deg,rgba(255,253,247,0.08),rgba(234,247,239,0.48))]" />
    </div>
  );
}

export function BotanicalCorner({ className = "", side = "right" }: { className?: string; side?: "left" | "right" }) {
  return (
    <div
      className={`pointer-events-none absolute ${side === "right" ? "-right-12" : "-left-12 scale-x-[-1]"} -bottom-10 h-64 w-52 text-[#2E5A3E]/16 ${className}`}
      aria-hidden="true"
    >
      <BotanicalSprig className="h-full w-full" />
    </div>
  );
}

export function SoftGradientOrb({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,253,247,0.92),rgba(245,237,225,0.68)_38%,rgba(167,198,160,0.28)_68%,transparent_72%)] blur-sm ${className}`}
      aria-hidden="true"
    />
  );
}

export function BrainLeafIllustration({ className = "" }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none relative overflow-hidden rounded-lg border border-[#A7C6A0]/30 bg-[#F5EDE1] shadow-sm ${className}`}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_16%,rgba(255,253,247,0.95),transparent_14rem),radial-gradient(circle_at_85%_80%,rgba(217,241,230,0.86),transparent_13rem)]" />
      <BotanicalSprig className="absolute -right-8 bottom-0 h-44 w-36 text-[#2E5A3E]/24" />
      <BrainBloom className="relative z-10 mx-auto h-36 w-48 text-[#2E5A3E] drop-shadow-[0_18px_28px_rgba(46,90,62,0.16)]" />
    </div>
  );
}

export function SectionTextureBackground({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(rgba(46,90,62,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(46,90,62,.09)_1px,transparent_1px)] [background-size:42px_42px]" />
      <SoftGradientOrb className="-left-20 top-10 h-72 w-72" />
      <SoftGradientOrb className="-right-24 bottom-0 h-80 w-80" />
      <BotanicalCorner side="right" className="opacity-80" />
    </div>
  );
}

export function DataGlowAccent({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute right-8 top-8 h-32 w-32 rounded-full border border-[#A7C6A0]/35" />
      <div className="absolute right-16 top-16 h-20 w-20 rounded-full border border-[#F5EDE1]/70" />
      <div className="absolute bottom-8 left-8 h-px w-36 bg-gradient-to-r from-[#2E5A3E]/25 to-transparent" />
      <div className="absolute bottom-14 left-8 h-px w-24 bg-gradient-to-r from-[#A7C6A0]/45 to-transparent" />
      <div className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[#D9F1E6]/30 blur-3xl" />
    </div>
  );
}

export function CompassLeafIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="240" height="180" rx="28" fill="#FFFDF7" />
      <path d="M27 139C54 106 82 90 113 94C144 98 160 120 193 106C209 99 221 87 234 73V180H27V139Z" fill="#EAF7EF" />
      <circle cx="111" cy="82" r="48" fill="#F5EDE1" stroke="#A7C6A0" strokeWidth="4" />
      <path d="M111 45L126 82L111 119L96 82L111 45Z" fill="#2E5A3E" opacity="0.9" />
      <path d="M74 82L111 67L148 82L111 97L74 82Z" fill="#A7C6A0" opacity="0.72" />
      <path d="M170 51C190 35 209 31 224 37C218 55 200 68 176 68C171 64 169 57 170 51Z" fill="#A7C6A0" />
      <path d="M159 88C181 77 200 79 212 91C201 106 181 112 162 102C158 97 157 92 159 88Z" fill="#A7C6A0" opacity="0.68" />
      <path d="M180 128C160 117 141 118 128 129C138 145 158 152 178 143C181 138 182 132 180 128Z" fill="#D9F1E6" stroke="#A7C6A0" strokeWidth="2" />
      <path d="M176 142C186 112 192 82 195 42" stroke="#2E5A3E" strokeWidth="4" strokeLinecap="round" opacity="0.36" />
    </svg>
  );
}
