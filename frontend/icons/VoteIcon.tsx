import { IIcon } from '@/models/IIcon';

export function VoteIcon(props: IIcon) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M29.3334 14.7734V16C29.3317 18.8753 28.4007 21.6729 26.6791 23.9758C24.9576 26.2787 22.5377 27.9633 19.7805 28.7786C17.0233 29.5938 14.0764 29.4959 11.3793 28.4995C8.68226 27.503 6.37956 25.6615 4.81463 23.2494C3.24971 20.8374 2.50641 17.9841 2.69559 15.1151C2.88477 12.2461 3.9963 9.51512 5.86439 7.32945C7.73249 5.14378 10.2571 3.62053 13.0616 2.98688C15.8661 2.35324 18.8004 2.64314 21.4267 3.81336M29.3334 5.33336L16 18.68L12 14.68"
        stroke={props.color}
        strokeWidth={props.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
