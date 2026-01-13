import type { SVGProps } from 'react';

export function GtnLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      width={32}
      height={32}
      {...props}
    >
      <g fill="currentColor">
        <path d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Z" />
        <path d="M112.42 168.42a8 8 0 0 1-8.84-13.64L135.17 128l-31.59-26.78a8 8 0 0 1 8.84-13.64l40.15 34.05a8 8 0 0 1 0 13.64Z" />
        <path d="M80 80h32v16H88v64h24v16H80z" />
      </g>
    </svg>
  );
}
