import { cn } from "@/lib/utils"

type VedaLogoProps = {
  className?: string
  textClassName?: string
  size?: "sm" | "md"
}

const VIcon = ({ size = 22 }: { size?: number }) => (
  <svg
    width={size}
    height={size * 0.9}
    viewBox="0 0 22 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 2 L11 17 L20 2"
      stroke="white"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 2 L11 10.5 L16 2"
      stroke="white"
      strokeWidth="3.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity={0.55}
    />
  </svg>
)

export function VedaLogo({ className, textClassName, size = "md" }: VedaLogoProps) {
  const isSmall = size === "sm"

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div
        className={cn(
          "flex items-center justify-center rounded-xl bg-[#F97316]",
          isSmall ? "size-8" : "size-10"
        )}
      >
        <VIcon size={isSmall ? 17 : 22} />
      </div>
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