import { max, parse } from 'mathjs';
import { CSSProperties, MutableRefObject, useEffect, useRef } from 'react';
import { mutiLight2rgb } from 'renderer/color/light2rgb2';
import { getWaveInstense } from 'renderer/color/lightwave';
import { parseRequire } from 'renderer/utils/parseRequire';
import type {
  InstrumentConfig,
  StyleConfig,
} from 'renderer/typing/config.type';
import type {
  FastScreenBoardUniOptionsType,
  ScreenBoardOptionsType,
} from 'renderer/typing/screen.type';

import WASMGEN1 from 'renderer/wasm/gen1';

interface propsType {
  styleConfig: StyleConfig;
  instrumentConfig: InstrumentConfig;
}

export default function FastScreenBoardUni({
  styleConfig,
  instrumentConfig,
}: propsType) {
  const sStyle = styleConfig.screen.FastBoardUni;
  const lightConfig = instrumentConfig.light;
  const screenConfig = instrumentConfig.screen
    .options as FastScreenBoardUniOptionsType;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const totalWidth = sStyle.totalWidthmm * sStyle.mm2px * sStyle.scaleX;
  const totalHeight = sStyle.totalHeightmm * sStyle.mm2px * sStyle.scaleY;

  const wasm1: MutableRefObject<any> = useRef();
  const varsArr: MutableRefObject<string[]> = useRef([]);

  useEffect(() => {
    const fetchwasm = async () => {
      // 处理func变量
      const varsA: string[] = [];

      Object.keys(screenConfig.require).forEach((key) => {
        if (screenConfig.func.indexOf(key) !== -1) {
          varsA.push(key);
        }
      });
      varsArr.current = varsA;

      let varsInputString = varsA.join('/');
      varsInputString = `${varsInputString}/`;

      wasm1.current = await WASMGEN1();
      wasm1.current.ccall(
        'exprFastScreenBoradUni',
        'number',
        ['string', 'string', 'number'],
        [screenConfig.func, varsA ? varsInputString : '', varsA?.length]
      );
    };
    fetchwasm();
  }, [instrumentConfig.name]);

  useEffect(() => {
    (async () => {
      const startTime = new Date();

      // 核心生成图片
      const { wave, instense } = getWaveInstense(
        lightConfig.type,
        lightConfig.filter
      );

      const req = parseRequire(screenConfig.require, instrumentConfig);

      const pxWidth = sStyle.totalWidthmm * sStyle.mm2px;
      const pxHeight = sStyle.totalHeightmm * sStyle.mm2px;

      if (wasm1.current == null) return;
      const arrayLength = 4 * pxWidth * pxHeight;

      const vars = [];
      for (let i = 0; i < varsArr.current.length; i++) {
        vars.push(req[varsArr.current[i]]);
      }
      // console.log(vars);

      // 进入参数
      const waveptr = wasm1.current.ccall('getPointWave', 'number', [], []);
      const instenseptr = wasm1.current.ccall(
        'getPointInstense',
        'number',
        [],
        []
      );
      const varsPtr = wasm1.current.ccall(
        'getPointReceiveVars',
        'number',
        [],
        []
      );
      const heapView1 = new Int32Array(
        wasm1.current.HEAPU8.buffer,
        waveptr,
        wave.length
      );
      heapView1.set(wave);
      const heapView2 = new Float64Array(
        wasm1.current.HEAPU8.buffer,
        instenseptr,
        instense.length
      );
      heapView2.set(instense);
      const heapView3 = new Float64Array(
        wasm1.current.HEAPU8.buffer,
        varsPtr,
        vars.length
      );
      heapView3.set(vars);

      const arrayPointer = wasm1.current.ccall(
        'genFastScreenBoardUni',
        'number',
        ['number', 'number', 'number', 'number'],
        [sStyle.totalWidthmm, sStyle.totalHeightmm, sStyle.mm2px, wave.length]
      );

      const wasmByteMemoryArray = wasm1.current.HEAPU8;
      const imageDataArray = wasmByteMemoryArray.slice(
        arrayPointer,
        arrayPointer + arrayLength
      );

      const bitmapArr = new Uint8ClampedArray(imageDataArray);

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

        const endTime = new Date();
        console.log('Time:', endTime.getTime() - startTime.getTime());
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
