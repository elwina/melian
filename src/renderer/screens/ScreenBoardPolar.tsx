import { max, parse } from 'mathjs';
import { CSSProperties, useEffect, useRef } from 'react';
import { mutiLight2rgb } from 'renderer/formula/light2rgb';
import { getWaveInstense } from 'renderer/formula/lightwave';
import { parseRequire } from 'renderer/utils/parseRequire';
import type {
  InstrumentConfig,
  StyleConfig,
} from 'renderer/typing/config.type';
import type { ScreenBoardOptionsType } from 'renderer/typing/screen.type';

interface propsType {
  styleConfig: StyleConfig;
  instrumentConfig: InstrumentConfig;
}

export default function ScreenBoardPolar({
  styleConfig,
  instrumentConfig,
}: propsType) {
  const sStyle = styleConfig.screen.BoardPolar;
  const lightConfig = instrumentConfig.light;
  const screenConfig = instrumentConfig.screen
    .options as ScreenBoardOptionsType;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const totalWidth = (sStyle.totalWidthmm / sStyle.px2mm) * sStyle.scaleX;
  const totalHeight = (sStyle.totalHeightmm / sStyle.px2mm) * sStyle.scaleY;

  const execRef = useRef(parse('0').compile());

  useEffect(() => {
    execRef.current = parse(screenConfig.func).compile();
  }, [screenConfig.func]);

  useEffect(() => {
    (async () => {
      // 核心生成图片
      const { wave, instense } = getWaveInstense(
        lightConfig.type,
        lightConfig.filter
      );

      const req = parseRequire(screenConfig.require, instrumentConfig);

      const pxWidth = Math.floor(sStyle.totalWidthmm / sStyle.px2mm);
      const pxHeight = Math.floor(sStyle.totalHeightmm / sStyle.px2mm);

      const pxRX = Math.floor(pxWidth / 2);
      const pxRY = Math.floor(pxHeight / 2);

      const datai = new Array(pxHeight * pxWidth).fill(0);

      let jjj;
      let iii;
      const dataii = datai.map((v, ii) => {
        jjj = ii % pxWidth;
        iii = ii / pxWidth;
        return Math.sqrt((jjj - pxRX) ** 2 + (iii - pxRY) ** 2) * sStyle.px2mm;
      });

      const data = dataii.map((r) => {
        const newinstense = wave.map((l, index) => {
          const instense1 = instense[index];
          let instense2: number = execRef.current.evaluate({
            ...req,
            r: r,
            l: l * 1e-6,
          });
          if (Number.isNaN(instense2)) {
            instense2 = Infinity;
          }
          return instense1 * instense2;
        });
        return mutiLight2rgb(wave, newinstense);
      });

      const bitmapArr: Uint8ClampedArray = new Uint8ClampedArray(
        data.flat().flat()
      );

      if (canvasRef.current == null) return;
      const can: HTMLCanvasElement = canvasRef.current;
      if (can == null) {
        return;
      }
      const ctx = can.getContext('2d');
      if (ctx == null) return;

      // 重置画布
      const cwidth = can.width;
      const cheight = can.height;
      can.width = cwidth;
      can.height = cheight;

      ctx.save();
      ctx.fillStyle = screenConfig.color;
      ctx.fillRect(0, 0, cwidth, cheight);
      ctx.restore();

      ctx.save();
      const picw = pxWidth;
      const pich = pxHeight;

      const sx = 0;
      const sy = 0;
      const swidth = picw;
      const sheight = pich;
      const dx = 0;
      const dy = 0;
      const dwidth = swidth * sStyle.scaleX;
      const dheight = sheight * sStyle.scaleY;

      try {
        const imagedata = new ImageData(bitmapArr, picw);
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
          dheight
        );
      } catch {
        return;
      }
      ctx.restore();
    })();
  }, [styleConfig, instrumentConfig]);

  const sty: CSSProperties = {
    position: 'fixed',
    bottom: sStyle.bottomMargin,
    left: sStyle.leftMargin,
    height: totalHeight,
    width: totalWidth,
  };

  return (
    <canvas
      width={totalWidth}
      height={totalHeight}
      ref={canvasRef}
      style={sty}
    />
  );
}
