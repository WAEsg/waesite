// The signature WaeWork visual motif: a dotted flight path between two
// pins, evoking the Singapore -> Manila/Jakarta route. Reused across auth,
// onboarding, and marketing surfaces instead of icon grids or stock photos.
export function RouteLine({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 64"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 48C60 48 90 16 160 16C230 16 260 48 308 48"
        stroke="var(--color-passport-sky)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="1 12"
      />
      <circle cx="12" cy="48" r="6" fill="var(--color-voyage-blue)" />
      <circle cx="308" cy="48" r="6" fill="var(--color-voyage-blue)" />
      <path
        d="M160 4L165 14H155L160 4Z"
        fill="var(--color-voyage-blue)"
        transform="rotate(35 160 14)"
      />
    </svg>
  );
}
