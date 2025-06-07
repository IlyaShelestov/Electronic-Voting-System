import { IIcon } from '@/models/IIcon';

export function AboutUsIcon(props: IIcon) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.12 12C12.4335 11.1089 13.0522 10.3575 13.8666 9.87883C14.681 9.4002 15.6385 9.22524 16.5696 9.38494C17.5006 9.54464 18.3451 10.0287 18.9535 10.7514C19.5618 11.474 19.8948 12.3887 19.8934 13.3333C19.8934 16 15.8934 17.3333 15.8934 17.3333M16 22.6667H16.0134M29.3334 16C29.3334 23.3638 23.3638 29.3333 16 29.3333C8.63622 29.3333 2.66669 23.3638 2.66669 16C2.66669 8.63619 8.63622 2.66666 16 2.66666C23.3638 2.66666 29.3334 8.63619 29.3334 16Z"
        stroke={props.color}
        strokeWidth={props.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
