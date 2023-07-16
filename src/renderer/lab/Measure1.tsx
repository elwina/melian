import { CSSProperties, useEffect, useRef } from 'react';
import { InstrumentConfig, StyleConfig } from 'renderer/config.type';
import type { measureType, screenType } from 'renderer/Scene';

interface propsType {
  styleConfig: StyleConfig;
  instrumentConfig: InstrumentConfig;
}

export default function Measure1({ styleConfig,instrumentConfig }: propsType) {
  const mStyle = styleConfig.measure;
  const measureConfig = instrumentConfig.measure;
  const statusConfig = instrumentConfig.status;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const h_w = 0.6;
  const innerWidth = 70 * mStyle.mm2px + 2 * mStyle.leftPadding;
  const canvasHeight =
    mStyle.dsHeight + mStyle.downHeight + 2 * mStyle.upPadding + h_w * innerWidth;
  const outWidth = innerWidth * 1.1;

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

    // 画上刻度背景
    const upBackStartX = 0;
    const upBackStartH = 0;
    const upBackWidth = 70 * mStyle.mm2px + 2 * mStyle.leftPadding;
    const upBackHeight = mStyle.upHeight + mStyle.upPadding;

    // 上刻度背盘
    const upFrontStartX = 0;
    const upFrontStartH = upBackHeight;
    const upFrontWidth = upBackWidth;
    const upFrontHeight = h_w * upBackWidth;
    ctx.save();
    ctx.fillStyle = '#30333a6f';
    ctx.fillRect(upFrontStartX, upFrontStartH, upFrontWidth, upFrontHeight);
    ctx.fillStyle = '#383e4c';
    ctx.strokeRect(upFrontStartX, upFrontStartH, upFrontWidth, upFrontHeight);
    ctx.restore();

    ctx.save();
    ctx.fillStyle = '#9aa5b7';
    ctx.fillRect(upBackStartX, upBackStartH, upBackWidth, upBackHeight);
    ctx.fillStyle = '#e0e6ff';
    ctx.strokeRect(upBackStartX, upBackStartH, upBackWidth, upBackHeight);
    ctx.restore();

    // 画上刻度
    for (let i = 0; i <= 7; i++) {
      const lineStartX = mStyle.leftPadding + i * 10 * mStyle.mm2px;
      const lineStartH = mStyle.fontHeight + mStyle.upPadding;
      const lineEndH = mStyle.upHeight + mStyle.upPadding;

      ctx.save();
      ctx.lineWidth = mStyle.lineWidth;
      ctx.beginPath();
      ctx.moveTo(lineStartX, lineStartH);
      ctx.lineTo(lineStartX, lineEndH);
      ctx.closePath();
      ctx.stroke();

      if (i !== 7)
        for (let j = 1; j <= 9; j++) {
          const lineStartXX = lineStartX + j * mStyle.mm2px;
          let lineStartHH = lineStartH;
          lineStartHH += (lineEndH - lineStartH) * (j === 5 ? 0.2 : 0.5);
          const lineEndHH = lineEndH;
          ctx.beginPath();
          ctx.moveTo(lineStartXX, lineStartHH);
          ctx.lineWidth = mStyle.lineWidth;
          ctx.lineTo(lineStartXX, lineEndHH);
          ctx.closePath();
          ctx.stroke();
        }
      ctx.restore();

      ctx.save();
      ctx.font = `normal ${mStyle.fontSize}px arial`;
      ctx.textBaseline = 'top';
      const str = i.toString();
      const textWidth = ctx.measureText(str).width;
      const textStartX = lineStartX - textWidth / 2;
      const textStartH = mStyle.upPadding;
      ctx.fillText(str, textStartX, textStartH);
      ctx.restore();
    }

    // 画下刻度
    const offsetpx = (measureConfig.initmm + statusConfig.offsetmm) * mStyle.mm2px;
    const a = 49 / 50;
    const slineStartH = mStyle.upPadding + mStyle.dsHeight;
    const slineEndH =
      mStyle.upPadding + mStyle.dsHeight + mStyle.downHeight - mStyle.sfontHeight;

    // 画下块
    const downFrontStartX = offsetpx;
    const downFrontStartH = slineStartH + mStyle.downHeight + mStyle.upPadding;
    const downFrontWidth = 50 * mStyle.mm2px * a + 2 * mStyle.leftPadding;
    const downFrontHeight = h_w * downFrontWidth;
    ctx.save();
    ctx.fillStyle = '#172b5b4a';
    ctx.fillRect(
      downFrontStartX,
      downFrontStartH,
      downFrontWidth,
      downFrontHeight
    );
    ctx.fillStyle = '#383e4c';
    ctx.strokeRect(
      downFrontStartX,
      downFrontStartH,
      downFrontWidth,
      downFrontHeight
    );
    ctx.restore();
    const ctrlRectX = downFrontStartX + downFrontWidth;
    const ctrlHeight = (0.1 * downFrontWidth) / 2;
    const ctrlRectH = downFrontStartH + downFrontHeight / 2 - ctrlHeight / 2;
    const ctrlRectWidth = cwidth - ctrlRectX;
    ctx.save();
    ctx.fillStyle = '#151515ff';
    ctx.fillRect(ctrlRectX, ctrlRectH, ctrlRectWidth, ctrlHeight);
    ctx.fillStyle = '#383e4c';
    ctx.strokeRect(ctrlRectX, ctrlRectH, ctrlRectWidth, ctrlHeight);
    ctx.restore();

    // 画目镜
    ctx.save();
    const circleX = downFrontStartX + 0.5 * downFrontWidth;
    const circleY = downFrontStartH + 0.5 * downFrontHeight;
    const circleR = ((h_w - 0.05) * downFrontWidth) / 2;
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleR, 0, Math.PI * 2, false);
    ctx.fillStyle = '#313536';
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    ctx.save();
    const smallCircleX = downFrontStartX + 0.5 * downFrontWidth;
    const smallCircleY = downFrontStartH + 0.5 * downFrontHeight;
    const smallCircleR = (0.1 * downFrontWidth) / 2;
    ctx.beginPath();
    ctx.arc(smallCircleX, smallCircleY, smallCircleR, 0, Math.PI * 2, false);
    ctx.fillStyle = '#9b9b9b';
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 画下刻度背景
    const downBackStartX = offsetpx;
    const downBackStartH = slineStartH;
    const downBackWidth = 50 * mStyle.mm2px * a + 2 * mStyle.leftPadding;
    const downBackHeight = mStyle.downHeight + mStyle.upPadding;
    ctx.save();
    ctx.fillStyle = '#9aa5b7';
    ctx.fillRect(downBackStartX, downBackStartH, downBackWidth, downBackHeight);
    ctx.fillStyle = '#e0e6ff';
    ctx.strokeRect(
      downBackStartX,
      downBackStartH,
      downBackWidth,
      downBackHeight
    );
    ctx.restore();

    for (let i = 0; i <= 10; i++) {
      const slineStartX = offsetpx + mStyle.leftPadding + i * 5 * mStyle.mm2px * a;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(slineStartX, slineStartH);
      ctx.lineWidth = mStyle.lineWidth;
      ctx.lineTo(slineStartX, slineEndH);
      ctx.closePath();
      ctx.stroke();

      if (i !== 10)
        for (let j = 1; j <= 4; j++) {
          const lineStartXX = slineStartX + j * mStyle.mm2px * a;
          const slineStartHH = slineStartH;
          const slineEndHH = slineEndH - (slineEndH - slineStartH) * 0.5;
          ctx.beginPath();
          ctx.moveTo(lineStartXX, slineStartHH);
          ctx.lineWidth = mStyle.lineWidth;
          ctx.lineTo(lineStartXX, slineEndHH);
          ctx.closePath();
          ctx.stroke();
        }
      ctx.restore();

      ctx.save();
      ctx.font = `normal ${mStyle.sfontSize}px sans-serif`;
      ctx.textBaseline = 'bottom';
      const str = (i % 10).toString();
      const textWidth = ctx.measureText(str).width;
      const textStartX = slineStartX - textWidth / 2;
      const textStartH = mStyle.dsHeight + mStyle.downHeight + mStyle.upPadding;
      ctx.fillText(str, textStartX, textStartH);
      ctx.restore();
    }
  }, [styleConfig,instrumentConfig]);

  const sty: CSSProperties = {
    position: 'fixed',
    bottom: mStyle.bottomMargin,
    left: mStyle.leftMargin,
    height: canvasHeight,
    width: outWidth,
    zIndex: 5,
  };

  return (
    <canvas
      width={outWidth}
      height={canvasHeight}
      ref={canvasRef}
      style={sty}
    />
  );
}
