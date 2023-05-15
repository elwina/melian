import { CSSProperties, useEffect, useRef } from 'react';
import type { holderType } from 'renderer/Scene';

interface propsType {
  holderConf: holderType;
}
export default function Holder({ holderConf: hF }: propsType) {
  const heightCalc = hF.holderHeight;
  const widthCalc = 2 * hF.leftPadding + hF.holderWidthmm * hF.xScale;

  const canvaRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvaRef.current === null) {
      return;
    }
    const ctx = canvaRef.current.getContext('2d');
    if (ctx === null || ctx === undefined) {
      return;
    }

    const cwidth = canvaRef.current.width;
    const cheight = canvaRef.current.height;
    canvaRef.current.width = cwidth;
    canvaRef.current.height = cheight;

    // 画背景
    ctx.save();
    ctx.fillStyle = '#dddada';
    ctx.fillRect(0, 0, cwidth, cheight);
    ctx.restore();

    // 画刻度
    const totalmm = hF.holderWidthmm;
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= totalmm; i++) {
      const x = hF.leftPadding + i * hF.xScale;
      if (i % 10 !== 0) {
        continue;
      }
      const endH = i % 10 ? hF.holderHeight : 0.6 * hF.holderHeight;
      ctx.moveTo(x, 0);
      ctx.lineTo(x, endH);
    }
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
  });

  return (
    <canvas
      ref={canvaRef}
      height={heightCalc}
      width={widthCalc}
      style={{
        position: 'fixed',
        left: hF.leftMargin,
        bottom: hF.bottomMargin,
        backgroundColor: '#e4e4e4',
      }}
    />
  );
}
