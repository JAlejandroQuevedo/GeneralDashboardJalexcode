import type { IconProps } from "../../types";
import { BaseIcon } from "./BaseIcon";

export const StickerIcon = (props: IconProps) => {
  return (
    <BaseIcon viewBox="0 0 600 600" {...props}>
      <path d="M566.667 283.333V150C566.667 85.5668 514.433 33.3333 450 33.3333H150C85.5668 33.3333 33.3333 85.5668 33.3333 150V450C33.3333 514.433 85.5668 566.667 150 566.667H316.667C344.281 566.667 366.667 544.281 366.667 516.667V450C366.667 385.567 418.9 333.333 483.333 333.333H516.667C544.281 333.333 566.667 310.948 566.667 283.333ZM564.221 351.775C550.735 361.163 534.344 366.667 516.667 366.667H483.333C437.31 366.667 400 403.976 400 450V516.667C400 530.743 396.51 544.004 390.348 555.632C481.634 527.518 550.622 448.535 564.221 351.775ZM150 0H450C532.843 0 600 67.1573 600 150V316.667C600 473.147 473.147 600 316.667 600H150C67.1573 600 0 532.843 0 450V150C0 67.1573 67.1573 0 150 0Z" />
    </BaseIcon>
  );
};

export const PlayIcon = (props: IconProps) => {
  return (
    <BaseIcon viewBox="0 0 24 24" {...props}>
      <path d="M8 5v14l11-7z" />
    </BaseIcon>
  );
};

export const PuauseIcon = (props: IconProps) => {
  return (
    <BaseIcon viewBox="0 0 24 24" {...props}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </BaseIcon>
  );
};
