export default function BrandLogo({ size = 56 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Brokerage Company of American INC"
    >
      {/* Outer ring */}
      <circle cx="28" cy="28" r="27" stroke="#000000" strokeWidth="2" fill="#ffffff" />
      {/* Inner circle accent */}
      <circle cx="28" cy="28" r="23" stroke="#D4AF37" strokeWidth="1.5" strokeDasharray="3 3" fill="#0d0d0d" />

      {/* Road / highway lines */}
      <rect x="12" y="32" width="32" height="2" rx="1" fill="#D4AF37" opacity="0.6" />
      <rect x="26" y="29" width="2" height="8" rx="1" fill="#D4AF37" opacity="0.8" />

      {/* Truck silhouette */}
      {/* Cab */}
      <rect x="30" y="22" width="10" height="10" rx="1.5" fill="#D4AF37" />
      {/* Trailer */}
      <rect x="16" y="24" width="15" height="8" rx="1" fill="#D4AF37" />
      {/* Windshield */}
      <rect x="36" y="24" width="3" height="4" rx="0.5" fill="#0d0d0d" opacity="0.6" />
      {/* Cab door line */}
      <line x1="32" y1="24" x2="32" y2="32" stroke="#0d0d0d" strokeWidth="0.6" opacity="0.4" />
      {/* Wheels */}
      <circle cx="20" cy="33" r="2.5" fill="#0d0d0d" stroke="#D4AF37" strokeWidth="1.2" />
      <circle cx="34" cy="33" r="2.5" fill="#0d0d0d" stroke="#D4AF37" strokeWidth="1.2" />
      {/* Wheel hubs */}
      <circle cx="20" cy="33" r="0.8" fill="#D4AF37" />
      <circle cx="34" cy="33" r="0.8" fill="#D4AF37" />

      {/* Stars (American flag nod) */}
      <circle cx="20" cy="18" r="1" fill="#D4AF37" />
      <circle cx="28" cy="15" r="1" fill="#D4AF37" />
      <circle cx="36" cy="18" r="1" fill="#D4AF37" />
    </svg>
  );
}
