import { CSSProperties, useEffect, useRef } from 'react';
import type { screenType } from 'renderer/lab/Scene';

interface propsType {
  screenConf: screenType;
}

export default function LightScreen({ screenConf: sC }: propsType) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      const sw = sC.mmwidth * sC.mm2px * sC.scaleX;
      const sh = sC.mmheight * sC.mm2px * sC.scaleY;
      const imageleft = sC.leftMargin;

      try {
        const imagedata = new ImageData(bitmapArr, sC.mmwidth * sC.mm2px);
        const imagebmp = await createImageBitmap(imagedata);
        // ctx.putImageData(imagedata, imageleft, 0, 0, 0, sw, sh);
        ctx.drawImage(imagebmp, imageleft, 0, sw, sh);
      } catch {
        return;
      }
      ctx.restore();

      ctx.save();
      ctx.globalCompositeOperation = 'destination-in';
      let circleX = sC.leftMargin + sw / 2;
      circleX = circleX + sC.offsetmm * sC.mm2px * sC.scaleX;

      const circleY = (sC.mmheight * sC.mm2px * sC.scaleY) / 2;
      const circleR = sC.seemm * sC.mm2px * sC.scaleX;
      ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.restore();
    })();
  }, [sC]);

  const fullWidth = document.body.clientWidth;
  const canvasHeight = sC.mmheight * sC.mm2px * sC.scaleY;
  const sty: CSSProperties = {
    position: 'fixed',
    bottom: sC.bottomMargin,
    left: 0,
    height: canvasHeight,
    width: fullWidth,
    backgroundColor: 'white',
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
