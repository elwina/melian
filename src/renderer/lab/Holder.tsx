import { useEffect, useRef } from 'react';
import { StyleConfig } from 'renderer/typing/config.type';

interface propsType {
  styleConfig: StyleConfig;
}
export default function Holder({ styleConfig }: propsType) {
  const hStyle = styleConfig.holder;
  const heightCalc = hStyle.holderHeight;
  const widthCalc =
    2 * hStyle.leftPadding + hStyle.holderWidthmm * hStyle.xScale;

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
    const totalmm = hStyle.holderWidthmm;
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let i = 0; i <= totalmm; i++) {
      const x = hStyle.leftPadding + i * hStyle.xScale;
      if (i % 10 !== 0) {
        continue;
      }
      const endH = i % 10 ? hStyle.holderHeight : 0.6 * hStyle.holderHeight;
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
        left: hStyle.leftMargin,
        bottom: hStyle.bottomMargin,
        backgroundColor: '#e4e4e4',

        zIndex: 10,
      }}
    />
  );
}
