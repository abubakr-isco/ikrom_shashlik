// Brand marks are not part of Lucide, so they live here as inline SVG.

export function TelegramIcon({ size = 20, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.94 4.3a1.2 1.2 0 0 0-1.62-1.3L2.84 9.73c-1.1.43-1.09 1.98.02 2.39l4.4 1.6 1.7 5.46c.2.66 1.03.87 1.52.38l2.46-2.46 4.43 3.26c.7.52 1.7.13 1.87-.72L21.94 4.3Zm-4.2 3.32-7.53 6.68-.3 3.2-1.22-3.92 8.37-6.4c.37-.28.82.18.68.44Z" />
    </svg>
  );
}

export function InstagramIcon({ size = 20, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
    </svg>
  );
}
