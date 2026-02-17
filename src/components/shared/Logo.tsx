interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
}

const SIZES = {
  sm: "h-7 w-7",
  md: "h-10 w-10",
  lg: "h-14 w-14",
  xl: "h-20 w-20",
}

export function Logo({ size = "sm" }: LogoProps) {
  return (
    <svg
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${SIZES[size]} inline-block`}
    >
      <defs>
        <linearGradient id="envGrad" x1="20" y1="35" x2="100" y2="105" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fecdd3" />
          <stop offset="100%" stopColor="#f9a8d4" />
        </linearGradient>
        <linearGradient id="flapGrad" x1="60" y1="20" x2="60" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fda4af" />
          <stop offset="100%" stopColor="#f9a8d4" />
        </linearGradient>
        <linearGradient id="heartGrad2" x1="60" y1="2" x2="60" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fb7185" />
          <stop offset="100%" stopColor="#e11d48" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-5%" width="120%" height="130%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.12" />
        </filter>
      </defs>

      {/* Envelope body */}
      <rect
        x="14" y="38" width="92" height="62" rx="8"
        fill="url(#envGrad)"
        filter="url(#shadow)"
      />

      {/* Inner fold lines */}
      <path
        d="M14 100l40-28M106 100l-40-28"
        stroke="#f472b6"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* Flap */}
      <path
        d="M14 44c0-3 1.5-5.5 4-7L60 14l42 23c2.5 1.5 4 4 4 7"
        fill="url(#flapGrad)"
      />
      <path
        d="M14 44c0-3 1.5-5.5 4-7L60 14l42 23c2.5 1.5 4 4 4 7"
        stroke="#f9a8d4"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* White edge on envelope top */}
      <rect x="14" y="38" width="92" height="2.5" rx="1" fill="white" opacity="0.35" />

      {/* Heart — big and bold, overflows above envelope */}
      <path
        d="M60 88C60 88 18 56 12 36c-5-14-1-28 12-32s24 2 26 12l10 18 10-18c2-10 13-16 26-12s17 18 12 32C102 56 60 88 60 88z"
        fill="url(#heartGrad2)"
      />

      {/* Heart shine */}
      <ellipse cx="40" cy="28" rx="9" ry="7" fill="white" opacity="0.25" transform="rotate(-15 40 28)" />
    </svg>
  )
}
