import { ElementType } from 'react';
import type {
  ScreenBoardPolarStyleType,
  ScreenBoardStyleType,
  ScreenFixedCircleStyleType,
} from 'renderer/typing/screen.type';
import ScreenBoard from './ScreenBoard';
import ScreenBoardPolar from './ScreenBoardPolar';
import ScreenFixedCircle from './ScreenFixedCircle';
import ScreenFixedCirclePolar from './ScreenFixedCirclePolar';

export type ScreenType =
  | 'FixedCircle'
  | 'FixedCirclePolar'
  | 'Board'
  | 'BoardPolar';

export const sReg: Record<ScreenType, ElementType> = {
  FixedCircle: ScreenFixedCircle,
  FixedCirclePolar: ScreenFixedCirclePolar,
  Board: ScreenBoard,
  BoardPolar: ScreenBoardPolar,
};

// Record<ScreenType, Record<string, any>>
export type ScreenStyles = {
  FixedCircle: ScreenFixedCircleStyleType;
  FixedCirclePolar: ScreenFixedCircleStyleType;
  Board: ScreenBoardStyleType;
  BoardPolar: ScreenBoardPolarStyleType;
  [key: string]: Record<string, any>;
};
