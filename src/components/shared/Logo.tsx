import { Mail, Heart } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
}

const SIZES = {
  sm: { mail: "h-5 w-5", heart: "h-2 w-2", offset: "-top-0.5 -right-0.5" },
  md: { mail: "h-6 w-6", heart: "h-2.5 w-2.5", offset: "-top-0.5 -right-0.5" },
  lg: { mail: "h-10 w-10", heart: "h-4 w-4", offset: "-top-1 -right-1" },
}

export function Logo({ size = "sm" }: LogoProps) {
  const s = SIZES[size]

  return (
    <span className="relative inline-flex">
      <Mail className={`${s.mail} text-rose-500`} />
      <Heart
        className={`absolute ${s.offset} ${s.heart} text-rose-500`}
        fill="currentColor"
      />
    </span>
  )
}
