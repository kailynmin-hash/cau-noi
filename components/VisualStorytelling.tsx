import Image from "next/image";
import { BrainBloom, BotanicalSprig } from "@/components/Botanical";

export function ReflectiveMessage({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`font-accent text-3xl leading-snug text-[#2E5A3E] sm:text-4xl ${className}`}>
      {children}
    </p>
  );
}

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
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,247,1)_0%,rgba(255,253,247,0.9)_26%,rgba(255,253,247,0.42)_48%,rgba(255,253,247,0.08)_72%,rgba(255,253,247,0)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(255,253,247,0.1),transparent_18rem),linear-gradient(180deg,rgba(255,253,247,0.02),rgba(234,247,239,0.18))]" />
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
      <VineLineArt className="absolute left-4 top-16 hidden h-80 w-64 text-[#2E5A3E]/12 md:block" />
      <NeuralLineArt className="absolute bottom-12 left-[22%] h-48 w-56 text-[#A7C6A0]/22" />
      <CommunityLineArt className="absolute right-[9%] top-20 hidden h-52 w-64 text-[#6E5A48]/12 lg:block" />
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

export function VineLineArt({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 180 260" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M31 246C54 188 75 135 65 74C60 45 71 24 96 11" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M65 76C34 62 18 42 18 20C43 19 67 39 72 69C70 72 68 74 65 76Z" fill="currentColor" opacity="0.52" />
      <path d="M71 113C107 102 134 108 150 130C128 151 94 152 69 128C67 122 68 117 71 113Z" fill="currentColor" opacity="0.38" />
      <path d="M55 158C25 151 5 160 0 184C24 198 50 190 62 166C61 162 59 160 55 158Z" fill="currentColor" opacity="0.32" />
      <path d="M48 198C81 194 103 207 112 232C83 247 55 236 44 207C44 203 46 200 48 198Z" fill="currentColor" opacity="0.28" />
    </svg>
  );
}

export function NeuralLineArt({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 190" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <path d="M50 116C28 112 17 96 21 77C25 58 43 52 57 59C65 39 91 35 104 52C121 44 144 54 146 74C165 80 169 101 155 116C142 131 120 128 110 114C98 132 65 134 50 116Z" stroke="currentColor" strokeWidth="4" />
      <path d="M56 115C59 90 75 78 99 82M109 114C113 89 104 72 82 64M73 125C86 109 103 103 126 108M60 60C73 65 80 74 81 90" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
      <circle cx="184" cy="44" r="11" fill="currentColor" opacity="0.22" />
      <circle cx="206" cy="98" r="8" fill="currentColor" opacity="0.2" />
      <circle cx="176" cy="143" r="10" fill="currentColor" opacity="0.18" />
      <path d="M146 78L184 44M153 112L206 98M132 123L176 143" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.36" />
    </svg>
  );
}

export function CommunityLineArt({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 260 210" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
      <circle cx="130" cy="92" r="42" stroke="currentColor" strokeWidth="4" opacity="0.55" />
      <circle cx="130" cy="78" r="15" fill="currentColor" opacity="0.3" />
      <path d="M101 128C108 109 121 101 130 101C139 101 153 109 160 128" stroke="currentColor" strokeWidth="5" strokeLinecap="round" opacity="0.42" />
      <circle cx="61" cy="77" r="18" stroke="currentColor" strokeWidth="4" opacity="0.36" />
      <circle cx="203" cy="79" r="18" stroke="currentColor" strokeWidth="4" opacity="0.36" />
      <circle cx="87" cy="159" r="18" stroke="currentColor" strokeWidth="4" opacity="0.28" />
      <circle cx="174" cy="160" r="18" stroke="currentColor" strokeWidth="4" opacity="0.28" />
      <path d="M78 83L91 86M169 86L185 82M105 125L96 145M153 125L164 145" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.24" />
    </svg>
  );
}
