interface LogoProps {
  size?: number;
}

export const Logo = ({ size = 32 }: LogoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    width={size}
    height={size}
  >
    {/* Card */}
    <rect x="3" y="4" width="14" height="16" rx="2" fill="#1677ff" stroke="#1677ff" />

    {/* Person */}
    <circle cx="10" cy="9" r="2" fill="#ffffff" stroke="#ffffff" />
    <path d="M7 14c0-1.5 6-1.5 6 0" stroke="#ffffff" fill="none" />

    {/* Tab / bookmark */}
    <path d="M17 8h4v10l-2-1-2 1z" fill="#faad14" stroke="#faad14" />
  </svg>
);
