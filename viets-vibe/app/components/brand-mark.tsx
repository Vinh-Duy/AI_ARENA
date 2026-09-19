import type { SVGProps } from "react";

export function BrandMark({
  size = 32,
  ...props
}: SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M16 1C17.9 10.1 21.9 14.1 31 16C21.9 17.9 17.9 21.9 16 31C14.1 21.9 10.1 17.9 1 16C10.1 14.1 14.1 10.1 16 1Z" />
    </svg>
  );
}
