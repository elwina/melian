import { parse } from "mathjs";
import { type CSSProperties, useEffect, useRef } from "react";
import { mutiLight2rgb } from "../color/light2rgb2";
import { getWaveInstense } from "../color/lightwave";
import { parseRequire } from "../utils/parseRequire";
import type { InstrumentConfig, StyleConfig } from "../typing/config.type";
import type { ScreenFixedCirclePolarOptionsType } from "../typing/screen.type";

interface propsType {
	styleConfig: StyleConfig;
	instrumentConfig: InstrumentConfig;
}

export default function ScreenFixedCirclePolar({
	styleConfig,
	instrumentConfig,
}: propsType) {
	const sStyle = styleConfig.screen.FixedCirclePolar;
	const lightConfig = instrumentConfig.light;
	const screenConfig = instrumentConfig.screen
		.options as ScreenFixedCirclePolarOptionsType;

	const canvasRef = useRef<HTMLCanvasElement>(null);

	const R = screenConfig.seemm * sStyle.mm2px * sStyle.scaleX;
	const pa = 6;

	// let exec = parse("0").compile();

	const execRef = useRef(parse("0").compile());

	useEffect(() => {
		execRef.current = parse(screenConfig.func).compile();
	}, [screenConfig.func]);

	useEffect(() => {
		(async () => {
			// const { bitmapArr } = sC;
			// if (bitmapArr === null) return;

			// 核心生成图片
			const { wave, instense } = getWaveInstense(
				lightConfig.type,
				lightConfig.filter,
			);

			const req = parseRequire(screenConfig.require, instrumentConfig);

			const pxR = screenConfig.mmR * sStyle.mm2px;
			const pxWidth = 2 * pxR + 1;
			const pxHeight = 2 * pxR + 1;
			// 创建二维数组
			const datai = new Array(pxHeight * pxWidth).fill(0);
			// let k = 0;

			let jj: number;
			let iii: number;
			const dataii = datai.map((v, ii) => {
				jj = ii % pxWidth;
				iii = ii / pxWidth;
				return Math.sqrt((jj - pxR) ** 2 + (iii - pxR) ** 2) / sStyle.mm2px;
			});

			const dataiii = dataii.map((v, ii) => {
				const newinstense = wave.map((l, index) => {
					const instense1: number = instense[index];

					let instense2: number = execRef.current.evaluate({
						...req,
						r: v,
						l: l * 1e-6,
					});
					if (Number.isNaN(instense2)) {
						instense2 = Infinity;
					}

					return instense1 * instense2;
				});
				return mutiLight2rgb(wave, newinstense);
			});

			// for (let i = 0; i < pxHeight; i++) {
			//   const itemp = (i - pxR) ** 2;
			//   for (let j = 0; j < pxWidth; j++) {
			//     const newinstense = wave.map((l, index) => {
			//       const instense1: number = instense[index];

			//       const r = Math.sqrt(itemp + (j - pxR) ** 2) / sStyle.mm2px;

			//       const instense2: number = execRef.current.evaluate({
			//         ...req,
			//         r: r,
			//         l: l * 1e-6,
			//       });
			//       return instense1 * instense2;
			//     });
			//     datai[k] = mutiLight2rgb(wave, newinstense);
			//     k++;
			//   }
			// }

			const bitmapArr: Uint8ClampedArray = new Uint8ClampedArray(
				dataiii.flat().flat(),
			);

			if (canvasRef.current == null) return;
			const can: HTMLCanvasElement = canvasRef.current;
			if (can == null) {
				return;
			}
			const ctx = can.getContext("2d");
			if (ctx == null) return;

			// 重置画布
			const cwidth = can.width;
			const cheight = can.height;
			can.width = cwidth;
			can.height = cheight;

			ctx.save();
			ctx.fillStyle = "#757474";
			ctx.fillRect(0, 0, cwidth, cheight);
			ctx.restore();

			ctx.save();
			const picw = pxWidth;
			const pich = pxHeight;

			const sx =
				picw / 2 -
				screenConfig.seemm * sStyle.mm2px +
				screenConfig.offsetxmm * sStyle.mm2px;
			const sy =
				pich / 2 -
				screenConfig.seemm * sStyle.mm2px +
				screenConfig.offsetymm * sStyle.mm2px;
			const swidth = picw - sx;
			const sheight = pich - sy;
			const dx = pa;
			const dy = pa;
			const dwidth = swidth * sStyle.scaleX;
			const dheight = sheight * sStyle.scaleY;

			try {
				const imagedata = new ImageData(bitmapArr, pxWidth);
				const imagebmp = await createImageBitmap(imagedata);

				// const ncanva = document.createElement('canvas');
				// ncanva.width = picw;
				// ncanva.height = pich;
				// const nctx = ncanva.getContext('2d');
				// if (nctx == null) return;
				// nctx.putImageData(imagedata, 0, 0);
				// const base64 = ncanva.toDataURL('image/png');
				// console.log(base64);

				// ctx.putImageData(imagedata, imageleft, 0, 0, 0, sw, sh);
				ctx.drawImage(
					imagebmp,
					sx,
					sy,
					swidth,
					sheight,
					dx,
					dy,
					dwidth,
					dheight,
				);
			} catch {
				return;
			}
			ctx.restore();

			ctx.save();
			ctx.globalCompositeOperation = "destination-in";
			const circleX = R + pa;
			const circleY = R + pa;
			const circleR = R;
			ctx.beginPath();
			ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2, false);
			ctx.closePath();
			ctx.fill();
			ctx.restore();

			// 画十字叉丝
			ctx.save();
			ctx.strokeStyle = "#282828ce";
			ctx.lineWidth = 2;
			ctx.beginPath();
			// 横线
			ctx.moveTo(pa, pa + R);
			ctx.lineTo(pa + R * 2, pa + R);
			// 中心竖线
			ctx.moveTo(pa + R, pa);
			ctx.lineTo(pa + R, pa + 2 * R);
			// 左竖线
			const lineLR = 0.2;
			ctx.moveTo(
				pa + R - lineLR * R,
				pa + R * (1 - Math.sqrt(1 - lineLR ** 2)),
			);
			ctx.lineTo(
				pa + R - lineLR * R,
				pa + 2 * R - R * (1 - Math.sqrt(1 - lineLR ** 2)),
			);
			// 右竖线
			ctx.moveTo(
				pa + R + lineLR * R,
				pa + R * (1 - Math.sqrt(1 - lineLR ** 2)),
			);
			ctx.lineTo(
				pa + R + lineLR * R,
				pa + 2 * R - R * (1 - Math.sqrt(1 - lineLR ** 2)),
			);

			ctx.closePath();
			ctx.stroke();
			ctx.restore();

			// 画边框
			ctx.save();
			ctx.strokeStyle = "#282828";
			ctx.lineWidth = 3;
			ctx.beginPath();
			ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2, false);
			ctx.closePath();
			ctx.stroke();
			ctx.restore();
		})();
	}, [styleConfig, instrumentConfig]);

	const fullWidth = 2 * R + 2 * pa;
	const canvasHeight = 2 * R + 2 * pa;
	const sty: CSSProperties = {
		position: "fixed",
		bottom: sStyle.bottomMargin,
		left: sStyle.leftMargin,
		height: canvasHeight,
		width: fullWidth,

		zIndex: 60,
	};

	return (
		<canvas
			width={fullWidth}
			height={canvasHeight}
			ref={canvasRef}
			style={sty}
			id="screen"
		/>
	);
}
