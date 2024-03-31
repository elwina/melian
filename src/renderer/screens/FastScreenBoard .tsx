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
import gen1 from '../../../assets/wasm/gen1.wasm';
import { InfFastScreenBoard } from '../proto/gen1.pb';

declare const global: {
  Go: any;
};

interface propsType {
  styleConfig: StyleConfig;
  instrumentConfig: InstrumentConfig;
}

export default function FastScreenBoard({
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

  const go = new global.Go();

  useEffect(() => {
    (async () => {
      const importObject = go.importObject;
      const wasmModule = await WebAssembly.instantiateStreaming(
        fetch(gen1),
        importObject
      );
      go.run(wasmModule.instance);
      const exports: any = wasmModule.instance.exports;
      const memory = exports.memory;
      // const wasmByteMemoryArray = new Uint8Array(memory.buffer);
      const wasmByteMemoryArray = new Uint8Array(memory);

      // 核心生成图片
      const { wave, instense } = getWaveInstense(
        lightConfig.type,
        lightConfig.filter
      );

      const req = parseRequire(screenConfig.require, instrumentConfig);

      const pxNum = sStyle.totalWidthmm * sStyle.mm2px;

      const row = sStyle.totalHeightmm * sStyle.mm2px;

      // 把公式中的替换掉
      let func = screenConfig.func;
      Object.keys(req).forEach((key) => {
        func = func.replace(new RegExp(key, 'g'), req[key]);
      });

      // 生成pb
      const pbInfFastScreenBoard = new InfFastScreenBoard({
        totalWidthmm: sStyle.totalWidthmm,
        mm2px: sStyle.mm2px,
        totalWave: wave.length,
        row: row,
        func: func,
        wave: wave,
        instense: instense,
      });
      console.log(pbInfFastScreenBoard);
      const inbyte = pbInfFastScreenBoard.serializeBinary();
      const inbyteLength = inbyte.length;

      const o = exports.goAdd();
      console.log(o);
      // const tbptr = await exports.getTBufferPointer();
      // eslint-disable-next-line no-undef
      const tbptr = await exports.getTBufferPointer();
      wasmByteMemoryArray.set(inbyte, tbptr);
      // eslint-disable-next-line no-undef
      await setTBufferSize(inbyteLength);

      const grsize = await global.geneFastScreenBoard();

      const grptr = await global.getOBufferPointer();

      const imageDataArray = wasmByteMemoryArray.slice(grptr, grptr + grsize);
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
      } catch (e) {
        console.log(e);
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
