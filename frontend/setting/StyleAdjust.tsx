import { useEffect } from "react";
import type { InstrumentConfig, StyleConfig } from "../typing/config.type";
import { parseRequireArray, parseSet } from "../utils/parseRequire";
import { type Updater, useImmer } from "use-immer";
import FourSide from "./FourSide";

interface propsType {
	styleConfig: StyleConfig;
	instrumentConfig: InstrumentConfig;
	// setInstrumentConfig: Updater<InstrumentConfig>;
	setStyleConfig: Updater<StyleConfig>;
}

const MAX = 1e10;

export default function StyleAdjust({
	styleConfig,
	instrumentConfig,
	setStyleConfig,
}: propsType) {
	const fourSide1 = {
		name: "位置高宽",
		target: [
			"style.holder.bottomMargin",
			"style.holder.leftMargin",
			"style.holder.holderHeight",
			"style.holder.holderWidthmm",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 5,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 5,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 2,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,
				step: 20,
				min: 0,
				max: MAX,
			},
		},
	};
	const fourSide2 = {
		name: "字与间距",
		target: [
			"style.holder.upHeight",
			"style.holder.leftPadding",
			"style.holder.fontSize",
			"style.holder.xScale",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 2,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 2,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 2,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,
				step: 0.1,
				min: 0,
				max: MAX,
			},
		},
	};
	const fourSide3 = {
		name: "拉伸",
		target: [
			"style.holder.baselineHeight",
			"style.holder.lenScaleX",
			"style.holder.lenScaleY",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 2,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 0.2,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 0.2,
				min: 0,
				max: MAX,
			},
		},
	};

	const fourSide4 = {
		name: "观察屏",
		target: [
			"style.screen.FixedCircle.bottomMargin",
			"style.screen.FixedCircle.leftMargin",
			"style.screen.FixedCircle.scaleY",
			"style.screen.FixedCircle.scaleX",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 5,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 5,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 0.1,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,
				step: 0.1,
				min: 0,
				max: MAX,
			},
		},
	};

	const fourSide16 = {
		name: "观察屏2",
		target: ["style.screen.FixedCircle.mm2px"],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 1,
				min: 0,
				max: MAX,
			},
		},
	};

	const fourSide5 = {
		name: "尺位置",
		target: [
			"style.measure.Square.bottomMargin",
			"style.measure.Square.leftMargin",
			"style.measure.Square.dsHeight",
			"style.measure.Square.leftPadding",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 5,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 5,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 2,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,

				step: 4,
				min: 0,
				max: MAX,
			},
		},
	};
	const fourSide6 = {
		name: "尺高宽",
		target: [
			"style.measure.Square.upHeight",
			"style.measure.Square.downHeight",
			"style.measure.Square.fontHeight",
			"style.measure.Square.sfontHeight",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 2,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 2,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 2,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,
				step: 2,
				min: 0,
				max: MAX,
			},
		},
	};

	const fourSide7 = {
		name: "尺字",
		target: [
			"style.measure.Square.fontSize",
			"style.measure.Square.sfontSize",
			"style.measure.Square.lineWidth",
			"style.measure.Square.mm2px",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 2,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 2,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 2,
				min: 2,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,
				step: 0.5,
				min: 0,
				max: MAX,
			},
		},
	};

	const fourSide9 = {
		name: "尺高宽",
		target: [
			"style.measure.Circle.bigHeight",
			"style.measure.Circle.seeSize",
			"style.measure.Circle.hm2px",
			"style.measure.Circle.mm2px",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 2,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 2,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 1,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,
				step: 1,
				min: 0,
				max: MAX,
			},
		},
	};

	const fourSide8 = {
		name: "尺位置",
		target: [
			"style.measure.Circle.bottomMargin",
			"style.measure.Circle.leftMargin",
			"style.measure.Circle.lineWidth",
			"style.measure.Circle.leftPadding",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 5,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 5,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 1,
				min: 1,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,
				step: 1,
				min: 0,
				max: MAX,
			},
		},
	};

	const fourSide10 = {
		name: "尺字",
		target: [
			"style.measure.Circle.mFontSize",
			"style.measure.Circle.hFontSize",
			"style.measure.Circle.mainLine",
			"style.measure.Circle.hLine",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 2,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 2,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 2,
				min: 1,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,
				step: 2,
				min: 1,
				max: MAX,
			},
		},
	};

	const fourSide11 = {
		name: "观察屏",
		target: [
			"style.screen.FixedCirclePolar.bottomMargin",
			"style.screen.FixedCirclePolar.leftMargin",
			"style.screen.FixedCirclePolar.scaleY",
			"style.screen.FixedCirclePolar.scaleX",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 5,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 5,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 0.1,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,
				step: 0.1,
				min: 0,
				max: MAX,
			},
		},
	};

	const fourSide12 = {
		name: "观察屏",
		target: [
			"style.screen.Board.bottomMargin",
			"style.screen.Board.leftMargin",
			"style.screen.Board.scaleY",
			"style.screen.Board.scaleX",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 5,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 5,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 0.1,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,
				step: 0.1,
				min: 0,
				max: MAX,
			},
		},
	};
	const fourSide13 = {
		name: "观察屏2",
		target: [
			"style.screen.Board.mm2px",
			"style.screen.Board.totalHeightmm",
			"style.screen.Board.totalWidthmm",
		],
		options: {
			hmiddle: {
				valueIndex: 0,
				step: 2,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 1,
				step: 5,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 2,
				step: 5,
				min: 0,
				max: MAX,
			},
		},
	};

	const fourSide14 = {
		name: "观察屏",
		target: [
			"style.screen.BoardPolar.bottomMargin",
			"style.screen.BoardPolar.leftMargin",
			"style.screen.BoardPolar.scaleY",
			"style.screen.BoardPolar.scaleX",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 5,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 5,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 0.1,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,
				step: 0.1,
				min: 0,
				max: MAX,
			},
		},
	};
	const fourSide15 = {
		name: "观察屏2",
		target: [
			"style.screen.BoardPolar.px2mm",
			"style.screen.BoardPolar.totalHeightmm",
			"style.screen.BoardPolar.totalWidthmm",
		],
		options: {
			hmiddle: {
				valueIndex: 0,
				step: 1,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 1,
				step: 5,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 2,
				step: 5,
				min: 0,
				max: MAX,
			},
		},
	};

	const fourSide17 = {
		name: "观察屏",
		target: [
			"style.screen.FastBoardUni.bottomMargin",
			"style.screen.FastBoardUni.leftMargin",
			"style.screen.FastBoardUni.scaleY",
			"style.screen.FastBoardUni.scaleX",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 5,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 5,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 0.1,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,
				step: 0.1,
				min: 0,
				max: MAX,
			},
		},
	};
	const fourSide18 = {
		name: "观察屏2",
		target: [
			"style.screen.FastBoardUni.mm2px",
			"style.screen.FastBoardUni.totalHeightmm",
			"style.screen.FastBoardUni.totalWidthmm",
		],
		options: {
			hmiddle: {
				valueIndex: 0,
				step: 1,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 1,
				step: 5,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 2,
				step: 5,
				min: 0,
				max: MAX,
			},
		},
	};

	const fourSide19 = {
		name: "观察屏",
		target: [
			"style.screen.FastBoard.bottomMargin",
			"style.screen.FastBoard.leftMargin",
			"style.screen.FastBoard.scaleY",
			"style.screen.FastBoard.scaleX",
		],
		options: {
			vmiddle: {
				valueIndex: 0,
				step: 5,
				min: 0,
				max: MAX,
			},
			hmiddle: {
				valueIndex: 1,
				step: 5,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 2,
				step: 0.1,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 3,
				step: 0.1,
				min: 0,
				max: MAX,
			},
		},
	};
	const fourSide20 = {
		name: "观察屏2",
		target: [
			"style.screen.FastBoard.mm2px",
			"style.screen.FastBoard.totalHeightmm",
			"style.screen.FastBoard.totalWidthmm",
		],
		options: {
			hmiddle: {
				valueIndex: 0,
				step: 1,
				min: 0,
				max: MAX,
			},
			side: {
				valueIndex: 1,
				step: 5,
				min: 0,
				max: MAX,
			},
			bottom: {
				valueIndex: 2,
				step: 5,
				min: 0,
				max: MAX,
			},
		},
	};

	const [all, setAll] = useImmer([fourSide1, fourSide2, fourSide3]);

	useEffect(() => {
		const re: any[] = [fourSide1, fourSide2, fourSide3];
		if (instrumentConfig.screen.type === "FixedCircle") {
			re.push(fourSide4);
			re.push(fourSide16);
		}
		if (instrumentConfig.screen.type === "FixedCirclePolar") {
			re.push(fourSide11);
		}
		if (instrumentConfig.screen.type === "Board") {
			re.push(fourSide12);
			re.push(fourSide13);
		}
		if (instrumentConfig.screen.type === "BoardPolar") {
			re.push(fourSide14);
			re.push(fourSide15);
		}
		if (instrumentConfig.screen.type === "FastBoardUni") {
			re.push(fourSide17);
			re.push(fourSide18);
		}
		if (instrumentConfig.screen.type === "FastBoard") {
			re.push(fourSide19);
			re.push(fourSide20);
		}
		if (instrumentConfig.measure.type === "Square") {
			re.push(fourSide5);
			re.push(fourSide6);
			re.push(fourSide7);
		}
		if (instrumentConfig.measure.type === "Circle") {
			re.push(fourSide8);
			re.push(fourSide9);
			re.push(fourSide10);
		}
		setAll(re);
	}, [instrumentConfig, setAll]);

	const RenderingSettings = all.map((s, i) => {
		const values = parseRequireArray(s.target, undefined, styleConfig);

		return (
			<div
				key={s.name}
				style={{
					display: "inline-flex",
					flexDirection: "column",
					alignItems: "center",
				}}
				id="style-adjust"
			>
				{styleConfig.global.english ? (
					<div>Adjust {i + 1}</div>
				) : (
					<div>{s.name}</div>
				)}
				<FourSide
					values={values}
					options={s.options}
					onChange={(values: number[]) => {
						const newSetDict = s.target.map((t, i) => [t, values[i]]);
						parseSet(Object.fromEntries(newSetDict), undefined, setStyleConfig);
					}}
				/>
			</div>
		);
	});

	return <>{RenderingSettings}</>;
}
