import { IIcon } from '@/models/IIcon';

export function ProfileIcon(props: IIcon) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M26.6666 28V25.3333C26.6666 23.9188 26.1047 22.5623 25.1045 21.5621C24.1044 20.5619 22.7478 20 21.3333 20H10.6666C9.25216 20 7.8956 20.5619 6.89541 21.5621C5.89522 22.5623 5.33331 23.9188 5.33331 25.3333V28M21.3333 9.33333C21.3333 12.2789 18.9455 14.6667 16 14.6667C13.0545 14.6667 10.6666 12.2789 10.6666 9.33333C10.6666 6.38781 13.0545 4 16 4C18.9455 4 21.3333 6.38781 21.3333 9.33333Z"
        stroke={props.color}
        strokeWidth={props.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
