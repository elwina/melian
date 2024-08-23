import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";
import { inArray } from "../utils/array";
import { useEffect, useState } from "react";
import type { InstrumentConfig, StyleConfig } from "../typing/config.type";
import DragMove from "./DragMove";

interface propsType {
	styleConfig: StyleConfig;
	instrumentConfig: InstrumentConfig;
	onchange: (id: number, distancemm: number) => void;
}

export default function Ctrl({
	styleConfig,
	instrumentConfig,
	onchange,
}: propsType) {
	const hStyle = styleConfig.holder;
	const lensConfig = instrumentConfig.lens;
	const ctrlConfig = instrumentConfig.control;

	const [ch, setch] = useState(document.body.clientHeight);

	useEffect(() => {
		window.addEventListener("resize", () => {
			setch(document.body.clientHeight);
		});
		return () => {
			window.removeEventListener("resize", () => {
				setch(document.body.clientHeight);
			});
		};
	}, []);

	return (
		<div
			style={{
				position: "fixed",

				left: hStyle.leftMargin,
				top: ch - hStyle.bottomMargin,
				width: 2 * hStyle.leftPadding + hStyle.holderWidthmm * hStyle.xScale,

				zIndex: 20,
			}}
			id="ctrl"
		>
			{/* <div style={{ clear: 'both' }} /> */}
			{lensConfig.map((len, i) => {
				return (
					<div
						key={len.id}
						style={{
							position: "absolute",
							left: hStyle.leftPadding + len.distancemm * hStyle.xScale,
							transform: "translateX(-50%)",
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyItems: "center",
						}}
						id={`ctrl-${i}`}
					>
						<div>
							{inArray(i, ctrlConfig.showmm) && len.distancemm === 0
								? `${len.distancemm}mm`
								: ""}
							{inArray(i, ctrlConfig.showmm) && len.distancemm !== 0
								? len.distancemm
								: ""}
						</div>
						{inArray(i, ctrlConfig.move) && (
							<>
								<DragMove
									id={i}
									styleConfig={styleConfig}
									instrumentConfig={instrumentConfig}
									onchange={onchange}
								/>
								<AiFillCaretLeft
									onClick={() => {
										onchange(i, lensConfig[i].distancemm - 1);
									}}
								/>
								<AiFillCaretRight
									onClick={() => {
										onchange(i, lensConfig[i].distancemm + 1);
									}}
								/>
							</>
						)}
					</div>
				);
			})}
		</div>
	);
}
