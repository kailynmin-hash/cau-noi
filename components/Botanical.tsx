export function BotanicalSprig({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M72 204C92 151 106 94 111 18" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <path d="M108 48C130 31 150 26 166 32C160 51 141 65 116 65C111 61 108 55 108 48Z" fill="currentColor" opacity="0.35" />
      <path d="M101 82C124 70 145 71 158 82C148 98 127 106 105 98C101 93 100 87 101 82Z" fill="currentColor" opacity="0.28" />
      <path d="M92 118C116 111 136 117 146 131C133 144 111 147 92 134C89 129 89 123 92 118Z" fill="currentColor" opacity="0.32" />
      <path d="M80 155C103 151 121 160 128 175C113 186 92 185 77 170C75 164 76 159 80 155Z" fill="currentColor" opacity="0.26" />
      <path d="M105 58C83 43 63 40 48 48C56 66 77 78 101 74C105 70 107 64 105 58Z" fill="currentColor" opacity="0.3" />
      <path d="M99 94C75 84 55 88 43 101C55 116 77 121 98 111C101 105 101 99 99 94Z" fill="currentColor" opacity="0.24" />
      <path d="M88 131C64 126 45 134 37 149C52 161 74 160 91 146C93 140 92 135 88 131Z" fill="currentColor" opacity="0.27" />
      <path d="M74 169C51 168 35 180 30 196C47 204 67 198 80 181C80 176 78 172 74 169Z" fill="currentColor" opacity="0.22" />
    </svg>
  );
}

export function BotanicalMark({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M40 8V72M8 40H72M17 17L63 63M63 17L17 63" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity="0.36" />
      <circle cx="40" cy="40" r="14" stroke="currentColor" strokeWidth="3" opacity="0.65" />
      <path d="M41 24C54 16 64 17 70 23C64 32 52 36 41 31V24Z" fill="currentColor" opacity="0.32" />
      <path d="M39 56C26 64 16 63 10 57C16 48 28 44 39 49V56Z" fill="currentColor" opacity="0.26" />
    </svg>
  );
}

export function HeroLandscape({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 760 430"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="heroSky" x1="380" y1="0" x2="380" y2="360" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFFDF7" stopOpacity="0.9" />
          <stop offset="0.55" stopColor="#EAF7EF" stopOpacity="0.82" />
          <stop offset="1" stopColor="#D9F1E6" stopOpacity="0.34" />
        </linearGradient>
        <linearGradient id="heroMountain" x1="175" y1="82" x2="535" y2="330" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A7C6A0" stopOpacity="0.78" />
          <stop offset="1" stopColor="#2E5A3E" stopOpacity="0.36" />
        </linearGradient>
        <linearGradient id="heroGround" x1="78" y1="350" x2="720" y2="430" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F5EDE1" stopOpacity="0.72" />
          <stop offset="1" stopColor="#A7C6A0" stopOpacity="0.52" />
        </linearGradient>
        <filter id="softBlur" x="-20%" y="-20%" width="140%" height="140%" colorInterpolationFilters="sRGB">
          <feGaussianBlur stdDeviation="10" />
        </filter>
      </defs>
      <rect width="760" height="430" rx="34" fill="url(#heroSky)" />
      <circle cx="155" cy="90" r="58" fill="#F5EDE1" opacity="0.62" filter="url(#softBlur)" />
      <path d="M40 296C123 212 174 171 236 181C295 190 329 249 389 237C459 223 498 131 584 116C636 107 687 129 738 170V430H40V296Z" fill="#D9F1E6" opacity="0.68" />
      <path d="M96 300L257 125L350 248L421 177L579 322H96Z" fill="url(#heroMountain)" opacity="0.7" />
      <path d="M260 125L306 186L282 177L254 206L228 184L260 125Z" fill="#FFFDF7" opacity="0.62" />
      <path d="M420 177L466 219L435 212L410 236L389 218L420 177Z" fill="#FFFDF7" opacity="0.44" />
      <path d="M0 350C84 324 178 322 278 344C361 362 449 371 542 350C630 331 699 335 760 356V430H0V350Z" fill="url(#heroGround)" />
      <path d="M573 168C596 146 620 138 641 145C635 173 612 191 581 190C575 184 572 176 573 168Z" fill="#2E5A3E" opacity="0.24" />
      <path d="M552 216C582 200 611 202 630 218C616 240 585 251 556 240C551 232 550 224 552 216Z" fill="#2E5A3E" opacity="0.2" />
      <path d="M529 266C561 257 588 265 603 285C585 304 555 309 530 292C526 283 526 274 529 266Z" fill="#2E5A3E" opacity="0.22" />
      <path d="M578 358C600 292 612 228 620 130" stroke="#2E5A3E" strokeWidth="5" strokeLinecap="round" opacity="0.32" />
      <g opacity="0.96">
        {[
          [276, 286, "#345F48"],
          [328, 279, "#557A64"],
          [382, 284, "#476A56"],
          [436, 277, "#65866B"],
          [493, 286, "#385F4A"],
        ].map(([cx, cy, fill], index) => (
          <g key={index}>
            <circle cx={cx as number} cy={cy as number} r="16" fill={fill as string} />
            <path d={`M${(cx as number) - 13} ${(cy as number) + 62}C${(cx as number) - 7} ${(cy as number) + 26} ${(cx as number) + 8} ${(cy as number) + 26} ${(cx as number) + 15} ${(cy as number) + 62}`} fill={fill as string} />
          </g>
        ))}
        <path d="M235 362C303 337 421 334 544 365" stroke="#2E5A3E" strokeOpacity="0.2" strokeWidth="14" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function BrainBloom({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 220 180"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M72 120C42 118 25 99 29 75C33 51 55 43 73 51C82 30 112 25 129 43C148 35 172 46 175 70C195 77 200 102 184 119C169 137 143 132 133 118C120 139 88 141 72 120Z"
        fill="#EAF7EF"
        stroke="#2E5A3E"
        strokeWidth="5"
      />
      <path d="M72 120C70 90 86 76 111 81M132 118C132 88 121 70 96 62M91 130C102 111 119 105 145 109M75 56C91 60 99 71 99 88M143 45C133 56 130 69 136 84" stroke="#A7C6A0" strokeWidth="5" strokeLinecap="round" />
      <path d="M133 43C142 22 159 13 177 15C179 38 162 55 139 55C135 52 133 48 133 43Z" fill="#A7C6A0" opacity="0.74" />
      <path d="M167 75C187 62 204 61 216 71C207 88 188 96 170 88C166 84 165 79 167 75Z" fill="#A7C6A0" opacity="0.56" />
      <path d="M47 48C30 35 14 33 2 40C9 55 25 64 44 60C48 57 49 52 47 48Z" fill="#D9F1E6" stroke="#A7C6A0" strokeWidth="2" />
      <path d="M111 135V166" stroke="#2E5A3E" strokeWidth="5" strokeLinecap="round" />
      <path d="M88 166H134" stroke="#2E5A3E" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}
