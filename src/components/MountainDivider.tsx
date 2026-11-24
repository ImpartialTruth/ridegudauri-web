/** Layered mountain-ridge silhouette used to blend a dark photo section into the next one. */
export default function MountainDivider({ className = "text-snow" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 120"
      preserveAspectRatio="none"
      aria-hidden
      className={`pointer-events-none absolute inset-x-0 bottom-[-1px] h-[60px] w-full sm:h-[100px] ${className}`}
    >
      <path
        fill="currentColor"
        opacity="0.35"
        d="M0 120V70l120-38 90 28 140-52 110 44 95-22 150 50 120-46 135 40 160-58 120 46 100-24 100 38v94z"
      />
      <path
        fill="currentColor"
        d="M0 120V92l140-30 110 22 150-40 130 36 120-18 160 38 130-34 150 28 140-40 110 26 100-12v72z"
      />
    </svg>
  );
}
