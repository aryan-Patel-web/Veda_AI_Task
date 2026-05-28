import Image from "next/image"
import { cn } from "@/lib/utils"

type VedaLogoProps = {
  className?: string
  textClassName?: string
  size?: "sm" | "md"
}

export function VedaLogo({
  className,
  textClassName,
  size = "md",
}: VedaLogoProps) {
  const isSmall = size === "sm"

  const iconSize = isSmall ? 32 : 40

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Image
        src="/veda/logo.png"
        alt="Veda AI Logo"
        width={iconSize}
        height={iconSize}
        priority
        unoptimized
        className="rounded-2xl"
      />

      <span
        className={cn(
          "font-bold tracking-tight text-gray-900",
          isSmall ? "text-lg" : "text-[22px]",
          textClassName
        )}
      >
        VedaAI
      </span>
    </div>
  )
}