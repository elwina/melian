import { ElementType } from 'react';
import { MeasureSquareStyleType } from 'renderer/typing/measure.type';
import Square from './Square';

export type MeasureType = 'Square';

export const mReg: Record<MeasureType, ElementType> = {
  Square: Square,
};

export type MeasureStyles = {
  Square: MeasureSquareStyleType;
  [key: string]: Record<string, any>;
};
