interface LogoProps {
  size?: number
  className?: string
  showText?: boolean
}

export default function Logo({ size = 40, className = '', showText = true }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Circular emblem matching bellaserademo.vercel.app */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Outer dashed circle */}
        <circle
          cx="32"
          cy="32"
          r="29"
          stroke="#D4A847"
          strokeWidth="1.2"
          strokeDasharray="2.8 3.2"
          fill="none"
        />
        {/* Central vertical stem */}
        <line x1="32" y1="13" x2="32" y2="51" stroke="#D4A847" strokeWidth="1.8" strokeLinecap="round" />
        {/* Upper left branch */}
        <path d="M32 20 Q27 16 25 20" stroke="#D4A847" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        {/* Upper right branch */}
        <path d="M32 20 Q37 16 39 20" stroke="#D4A847" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        {/* Middle left branch */}
        <path d="M32 28 Q26 24 23 29" stroke="#D4A847" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        {/* Middle right branch */}
        <path d="M32 28 Q38 24 41 29" stroke="#D4A847" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        {/* Lower left branch */}
        <path d="M32 37 Q27 34 25 38" stroke="#D4A847" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        {/* Lower right branch */}
        <path d="M32 37 Q37 34 39 38" stroke="#D4A847" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      </svg>

      {showText && (
        <span className="font-serif text-xl font-semibold text-brand-text tracking-wide">
          Bella Sera
        </span>
      )}
    </div>
  )
}
