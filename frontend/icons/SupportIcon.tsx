import { IIcon } from '@/models/IIcon';

export function SupportIcon(props: IIcon) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29.3334 8.00001C29.3334 6.53334 28.1334 5.33334 26.6667 5.33334H5.33335C3.86669 5.33334 2.66669 6.53334 2.66669 8.00001M29.3334 8.00001V24C29.3334 25.4667 28.1334 26.6667 26.6667 26.6667H5.33335C3.86669 26.6667 2.66669 25.4667 2.66669 24V8.00001M29.3334 8.00001L16 17.3333L2.66669 8.00001"
        stroke={props.color}
        strokeWidth={props.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
