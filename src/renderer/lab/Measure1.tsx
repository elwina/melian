import { CSSProperties, useEffect, useRef } from 'react';
import type { measureType, screenType } from 'renderer/Scene';

interface propsType {
  measureConfType: measureType;
}

export default function Measure1({ measureConfType: mC }: propsType) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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

    // ctx.save();
    // ctx.fillStyle = '#ffffff';
    // ctx.fillRect(0, 0, cwidth, cheight);
    // ctx.restore();

    ctx.save();
    // 画上刻度
    for (let i = 0; i <= 7; i++) {
      const lineStartX = mC.leftPadding + i * 10 * mC.mm2px;
      ctx.beginPath();
      ctx.moveTo(lineStartX, mC.fontSize);
      ctx.lineWidth = mC.lineWidth;
      ctx.lineTo(lineStartX, mC.upHeight);
      ctx.stroke();

      if (i !== 7)
        for (let j = 1; j <= 9; j++) {
          const lineStartXX = lineStartX + j * mC.mm2px;
          let lineStartHH = mC.fontSize;
          lineStartHH += (mC.upHeight - lineStartHH) * (j === 5 ? 0.2 : 0.5);
          ctx.beginPath();
          ctx.moveTo(lineStartXX, lineStartHH);
          ctx.lineWidth = mC.lineWidth;
          ctx.lineTo(lineStartXX, mC.upHeight);
          ctx.stroke();
        }

      ctx.font = `normal ${mC.fontSize}px serif`;
      ctx.textBaseline = 'top';
      const str = i.toString();
      const textWidth = ctx.measureText(str).width;
      ctx.strokeText(str, lineStartX - textWidth / 2, 0);
    }
    ctx.restore();

    ctx.save();
    // 画下刻度
    const offsetpx = mC.offsetmm * mC.mm2px;

    const slineStartHD = mC.dsHeight + mC.downHeight - mC.sfontHeight;
    for (let i = 0; i <= 10; i++) {
      const slineStartX = offsetpx + mC.leftPadding + i * 5 * mC.mm2px;
      ctx.beginPath();
      ctx.moveTo(slineStartX, mC.dsHeight);
      ctx.lineWidth = mC.lineWidth;
      ctx.lineTo(slineStartX, slineStartHD);
      ctx.stroke();

      if (i !== 10)
        for (let j = 1; j <= 4; j++) {
          const lineStartXX = slineStartX + j * mC.mm2px;
          const slineStartHDD =
            slineStartHD - (slineStartHD - mC.dsHeight) * 0.5;
          ctx.beginPath();
          ctx.moveTo(lineStartXX, mC.dsHeight);
          ctx.lineWidth = mC.lineWidth;
          ctx.lineTo(lineStartXX, slineStartHDD);
          ctx.stroke();
        }

      ctx.font = `normal ${mC.sfontSize}px serif`;
      ctx.textBaseline = 'top';
      const str = (i % 10).toString();
      const textWidth = ctx.measureText(str).width;
      ctx.strokeText(str, slineStartX - textWidth / 2, slineStartHD);
    }
  }, [mC]);

  const maxWidth = 120 * mC.mm2px + mC.leftPadding;
  const canvasHeight = mC.dsHeight + mC.downHeight;
  const sty: CSSProperties = {
    position: 'fixed',
    bottom: mC.bottomMargin,
    left: mC.leftMargin,
    height: canvasHeight,
    width: maxWidth,
    backgroundColor: '#e56d6d',
    zIndex: 5,
  };

  return (
    <canvas
      width={maxWidth}
      height={canvasHeight}
      ref={canvasRef}
      style={sty}
    />
  );
}
