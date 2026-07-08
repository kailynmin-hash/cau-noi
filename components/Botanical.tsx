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
