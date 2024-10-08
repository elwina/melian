import type { ElementType } from "react";
import type {
	MeasureCircleStyleType,
	MeasureSquareStyleType,
} from "../typing/measure.type";
import Circle from "./Circle";
import Square from "./Square";

export type MeasureType = "None" | "Square" | "Circle";

export const mReg: Record<MeasureType, ElementType> = {
	None: () => <></>,
	Square: Square,
	Circle: Circle,
};

export type MeasureStyles = {
	Square: MeasureSquareStyleType;
	Circle: MeasureCircleStyleType;
	[key: string]: Record<string, any>;
};
