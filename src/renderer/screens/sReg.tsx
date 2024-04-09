import { ElementType } from 'react';
import type {
  FastScreenBoardUniStyleType,
  ScreenBoardPolarStyleType,
  ScreenBoardStyleType,
  ScreenFixedCircleStyleType,
} from 'renderer/typing/screen.type';
import ScreenBoard from './ScreenBoard';
import ScreenBoardPolar from './ScreenBoardPolar';
import ScreenFixedCircle from './ScreenFixedCircle';
import ScreenFixedCirclePolar from './ScreenFixedCirclePolar';
import FastScreenBoard from './FastScreenBoard ';
import FastScreenBoardUni from './FastScreenBoardUni';

export type ScreenType =
  | 'FixedCircle'
  | 'FixedCirclePolar'
  | 'Board'
  | 'BoardPolar'
  | 'FastBoard'
  | 'FastBoardUni';

export const sReg: Record<ScreenType, ElementType> = {
  FixedCircle: ScreenFixedCircle,
  FixedCirclePolar: ScreenFixedCirclePolar,
  Board: ScreenBoard,
  BoardPolar: ScreenBoardPolar,
  FastBoard: FastScreenBoard,
  FastBoardUni: FastScreenBoardUni,
};

// Record<ScreenType, Record<string, any>>
export type ScreenStyles = {
  FixedCircle: ScreenFixedCircleStyleType;
  FixedCirclePolar: ScreenFixedCircleStyleType;
  Board: ScreenBoardStyleType;
  BoardPolar: ScreenBoardPolarStyleType;
  FastBoardUni: FastScreenBoardUniStyleType;
  [key: string]: Record<string, any>;
};
