import Image from "next/image"

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl"
}

const HEIGHTS: Record<string, number> = {
  sm: 52,
  md: 80,
  lg: 120,
  xl: 320,
}

export function Logo({ size = "sm" }: LogoProps) {
  const h = HEIGHTS[size]

  return (
    <Image
      src="/icons/logo-icon.png"
      alt="Love101"
      width={0}
      height={0}
      sizes="300px"
      style={{ height: `${h}px`, width: "auto" }}
      className="mix-blend-multiply"
      priority={size === "xl" || size === "lg"}
    />
  )
}
