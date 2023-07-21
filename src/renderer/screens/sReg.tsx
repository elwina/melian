import { ElementType } from 'react';
import type { ScreenFixedCircleStyleType } from 'renderer/typing/screen.type';
import ScreenFixedCircle from './ScreenFixedCircle';
import ScreenFixedCirclePolar from './ScreenFixedCirclePolar';

export type ScreenType = 'FixedCircle' | 'FixedCirclePolar';

export const sReg: Record<ScreenType, ElementType> = {
  FixedCircle: ScreenFixedCircle,
  FixedCirclePolar: ScreenFixedCirclePolar,
};

// Record<ScreenType, Record<string, any>>
export type ScreenStyles = {
  FixedCircle: ScreenFixedCircleStyleType;
  FixedCirclePolar: ScreenFixedCircleStyleType;
  [key: string]: Record<string, any>;
};
