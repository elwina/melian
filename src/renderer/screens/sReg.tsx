import { ElementType } from 'react';
import type { ScreenFixedCircleStyleType } from 'renderer/typing/screen.type';
import LightScreenFixed from './LightScreenFixed';

export type ScreenType = 'FixedCircle';

export const sReg: Record<ScreenType, ElementType> = {
  FixedCircle: LightScreenFixed,
};

// Record<ScreenType, Record<string, any>>
export type ScreenStyles = {
  FixedCircle: ScreenFixedCircleStyleType;
  [key: string]: Record<string, any>;
};
