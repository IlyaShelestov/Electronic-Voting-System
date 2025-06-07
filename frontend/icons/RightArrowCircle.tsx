import { IIcon } from '@/models/IIcon';

export function RightArrowCircle(props: IIcon) {
  return (
    <svg
      width={props.size}
      height={props.size}
      viewBox="0 0 58 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.5921 38L38.0792 28.5M38.0792 28.5L28.5921 19M38.0792 28.5H19.1051M52.3097 28.5C52.3097 41.6168 41.691 52.25 28.5921 52.25C15.4932 52.25 4.87451 41.6168 4.87451 28.5C4.87451 15.3832 15.4932 4.75 28.5921 4.75C41.691 4.75 52.3097 15.3832 52.3097 28.5Z"
        stroke={props.color}
        strokeWidth={props.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
