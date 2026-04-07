import type { SVGProps } from 'react';

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="150"
    height="40"
    viewBox="0 0 150 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    focusable="false"
    aria-hidden
    {...props}
  >
    <text
      x="0"
      y="32"
      fontFamily="var(--font-logo), 'Playfair Display', serif"
      fontWeight="700"
      fontSize="36"
      fill="currentColor"
      letterSpacing="0.02em"
    >
      Syntha
    </text>
  </svg>
);

export default Logo;
