import { max, parse } from 'mathjs';
import { CSSProperties, useEffect, useRef } from 'react';
import { mutiLight2rgb } from 'renderer/color/light2rgb2';
import { getWaveInstense } from 'renderer/color/lightwave';
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

export default function ScreenBoard({
  styleConfig,
  instrumentConfig,
}: propsType) {
  const sStyle = styleConfig.screen.Board;
  const lightConfig = instrumentConfig.light;
  const screenConfig = instrumentConfig.screen
    .options as ScreenBoardOptionsType;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const totalWidth = sStyle.totalWidthmm * sStyle.mm2px * sStyle.scaleX;
  const totalHeight = sStyle.totalHeightmm * sStyle.mm2px * sStyle.scaleY;

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

      const pxNum = sStyle.totalWidthmm * sStyle.mm2px;
      const data = [...Array(pxNum)]
        .map((_, i) => (-pxNum / 2 + i) / sStyle.mm2px)
        .map((y) => {
          const newinstense = wave.map((l, i) => {
            const instense1 = instense[i];
            let instense2: number = execRef.current.evaluate({
              ...req,
              y: y,
              l: l * 1e-6,
            });
            if (Number.isNaN(instense2)) {
              instense2 = Infinity;
            }
            return instense1 * instense2;
          });
          return mutiLight2rgb(wave, newinstense);
        });

      const bitmapColArr = data;
      const row = sStyle.totalHeightmm * sStyle.mm2px;
      const bitmapArr: Uint8ClampedArray = new Uint8ClampedArray(
        new Array(row).fill(bitmapColArr.flat()).flat()
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
      const picw = sStyle.totalWidthmm * sStyle.mm2px;
      const pich = sStyle.totalHeightmm * sStyle.mm2px;

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

    zIndex: 60,
  };

  return (
    <canvas
      width={totalWidth}
      height={totalHeight}
      ref={canvasRef}
      style={sty}
      id="screen"
    />
  );
}
