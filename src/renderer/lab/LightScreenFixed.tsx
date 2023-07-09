import { CSSProperties, useEffect, useRef } from 'react';
import type { screenType } from 'renderer/Scene';

interface propsType {
  screenConf: screenType;
}

export default function LightScreenFixed({ screenConf: sC }: propsType) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const R = sC.seemm * sC.mm2px * sC.scaleX;
  const pa = 6;

  useEffect(() => {
    (async () => {
      const { bitmapArr } = sC;
      if (bitmapArr === null) return;

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
      ctx.fillStyle = '#757474';
      ctx.fillRect(0, 0, cwidth, cheight);
      ctx.restore();

      ctx.save();
      const picw = sC.mmwidth * sC.mm2px;
      const pich = sC.mmheight * sC.mm2px;

      const sx = picw / 2 - sC.seemm * sC.mm2px + sC.offsetmm * sC.mm2px;
      const sy = 0;
      const swidth = picw - sx;
      const sheight = pich;
      const dx = pa;
      const dy = pa;
      const dwidth = swidth * sC.scaleX;
      const dheight = sheight * sC.scaleY;

      try {
        const imagedata = new ImageData(bitmapArr, sC.mmwidth * sC.mm2px);
        const imagebmp = await createImageBitmap(imagedata);

        const ncanva = document.createElement('canvas');
        ncanva.width = picw;
        ncanva.height = pich;
        const nctx = ncanva.getContext('2d');
        if (nctx == null) return;
        nctx.putImageData(imagedata, 0, 0);
        const base64 = ncanva.toDataURL('image/png');
        console.log(base64);

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

      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
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
      ctx.strokeStyle = '#282828ce';
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
        pa + R * (1 - Math.sqrt(1 - lineLR ** 2))
      );
      ctx.lineTo(
        pa + R - lineLR * R,
        pa + 2 * R - R * (1 - Math.sqrt(1 - lineLR ** 2))
      );
      // 右竖线
      ctx.moveTo(
        pa + R + lineLR * R,
        pa + R * (1 - Math.sqrt(1 - lineLR ** 2))
      );
      ctx.lineTo(
        pa + R + lineLR * R,
        pa + 2 * R - R * (1 - Math.sqrt(1 - lineLR ** 2))
      );

      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // 画边框
      ctx.save();
      ctx.strokeStyle = '#282828';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2, false);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    })();
  }, [sC, R]);

  const fullWidth = 2 * R + 2 * pa;
  const canvasHeight = 2 * R + 2 * pa;
  const sty: CSSProperties = {
    position: 'fixed',
    bottom: sC.bottomMargin,
    left: sC.leftMargin,
    height: canvasHeight,
    width: fullWidth,
  };

  return (
    <canvas
      width={fullWidth}
      height={canvasHeight}
      ref={canvasRef}
      style={sty}
    />
  );
}
