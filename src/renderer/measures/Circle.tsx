import { max } from 'mathjs';
import { CSSProperties, useEffect, useRef } from 'react';
import { InstrumentConfig, StyleConfig } from 'renderer/typing/config.type';
import { MeasureCircleOptionsType } from 'renderer/typing/measure.type';
import { mod } from 'renderer/utils/number';

interface propsType {
  styleConfig: StyleConfig;
  instrumentConfig: InstrumentConfig;
}

export default function Circle({ styleConfig, instrumentConfig }: propsType) {
  const mStyle = styleConfig.measure.Circle;
  const measureConfig = instrumentConfig.measure
    .options as MeasureCircleOptionsType;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasHeight = Math.max(mStyle.seeSize, mStyle.bigHeight);

  const mainLength = mStyle.leftPadding * 2 + 20 * mStyle.mm2px;
  const outWidth = mStyle.seeSize + 2 * mainLength;

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

    // 画左边大的观察口
    const seeStartX = 0;
    const seeStartH = (canvasHeight - mStyle.seeSize) / 2;
    const seeWidth = mStyle.seeSize;
    const seeHeight = mStyle.seeSize;

    ctx.save();
    ctx.fillStyle = '#b7b6b4';
    ctx.strokeStyle = '#231f20';
    ctx.fillRect(seeStartX, seeStartH, seeWidth, seeHeight);
    ctx.strokeRect(seeStartX, seeStartH, seeWidth, seeHeight);
    ctx.restore();

    // 画圆孔
    const circleR = 0.4 * mStyle.seeSize;
    const circleX = seeStartX + seeWidth / 2;
    const circleY = seeStartH + seeHeight / 2;
    ctx.save();
    ctx.beginPath();
    ctx.arc(circleX, circleY, circleR, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = '#939598';
    ctx.fill();
    ctx.strokeStyle = '#231f20';
    ctx.stroke();
    ctx.restore();

    // 小一圈的
    const smallCircleR = 0.35 * mStyle.seeSize;
    ctx.save();
    ctx.beginPath();
    ctx.arc(circleX, circleY, smallCircleR, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = '#fed7ac';
    ctx.fill();
    ctx.strokeStyle = '#231f20';
    ctx.stroke();
    ctx.restore();

    // 十字叉丝
    const lineStartX = circleX - smallCircleR;
    const lineStartY = circleY;
    const lineEndX = circleX + smallCircleR;
    const lineEndY = circleY;
    const line2StartX = circleX;
    const line2StartY = circleY - smallCircleR;
    const line2EndX = circleX;
    const line2EndY = circleY + smallCircleR;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(lineStartX, lineStartY);
    ctx.lineTo(lineEndX, lineEndY);
    ctx.moveTo(line2StartX, line2StartY);
    ctx.lineTo(line2EndX, line2EndY);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#231f20';
    ctx.stroke();
    ctx.restore();

    // 主测量尺
    const bigUpPadding = 10;
    const mainStartX = seeWidth;
    const mainStartH = (canvasHeight - mStyle.bigHeight) / 2 + bigUpPadding;
    const mainWidth = mainLength;
    const mainHeight = mStyle.bigHeight - 2 * bigUpPadding;
    ctx.save();
    ctx.fillStyle = '#b7b6b4';
    ctx.fillRect(mainStartX, mainStartH, mainWidth, mainHeight);
    ctx.strokeStyle = '#231f20';
    ctx.strokeRect(mainStartX, mainStartH, mainWidth, mainHeight);
    ctx.restore();

    const charLinePadding = 3;
    const linePadding = 4;
    const smallLine = 0.7;

    // 主刻度横线
    const mainHLineX = mainStartX + linePadding;
    const mainHLineH = mainStartH + mainHeight / 2;
    const mainHLineEndX = mainHLineX + mainWidth - linePadding;
    const mainHLineEndH = mainHLineH;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(mainHLineX, mainHLineH);
    ctx.lineTo(mainHLineEndX, mainHLineEndH);
    ctx.closePath();
    ctx.lineWidth = mStyle.lineWidth;
    ctx.strokeStyle = '#231f20';
    ctx.stroke();
    ctx.restore();

    // 主刻度
    for (let i = 0; i < 5; i++) {
      const mainLineStartX =
        mainStartX + mStyle.leftPadding + i * 5 * mStyle.mm2px;
      const mainLineStartH = mainStartH + mainHeight / 2 + linePadding;
      const mainLineEndX = mainLineStartX;
      const mainLineEndH = mainLineStartH + mStyle.mainLine;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(mainLineStartX, mainLineStartH);
      ctx.lineTo(mainLineEndX, mainLineEndH);
      ctx.closePath();
      ctx.lineWidth = mStyle.lineWidth;
      ctx.strokeStyle = '#231f20';
      ctx.stroke();
      ctx.restore();
      // 字
      ctx.save();
      ctx.font = `${mStyle.mFontSize}px Arial`;
      ctx.textBaseline = 'top';
      const str = `${i * 5}`;
      const strWidth = ctx.measureText(str).width;
      const strStartX = mainLineStartX - strWidth / 2;
      const strStartH = mainLineEndH + charLinePadding;
      ctx.fillText(str, strStartX, strStartH);
      ctx.restore();

      // 主刻度下刻度
      if (i !== 4)
        for (let j = 1; j <= 4; j++) {
          const mainDLineX = mainLineStartX + j * mStyle.mm2px;
          const mainDLineH = mainLineStartH;
          const mainDLineEndX = mainDLineX;
          const mainDLineEndH = mainDLineH + mStyle.mainLine * smallLine;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(mainDLineX, mainDLineH);
          ctx.lineTo(mainDLineEndX, mainDLineEndH);
          ctx.closePath();
          ctx.lineWidth = mStyle.lineWidth;
          ctx.strokeStyle = '#231f20';
          ctx.stroke();
          ctx.restore();
        }

      // 主刻度上刻度
      if (i !== 4)
        for (let j = 0; j <= 4; j++) {
          const mainULineX =
            mainLineStartX + j * mStyle.mm2px + 0.5 * mStyle.mm2px;
          const mainULineH = mainStartH + mainHeight / 2 - linePadding;
          const mainULineEndX = mainULineX;
          const mainULineEndH = mainULineH - mStyle.mainLine * smallLine;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(mainULineX, mainULineH);
          ctx.lineTo(mainULineEndX, mainULineEndH);
          ctx.closePath();
          ctx.lineWidth = mStyle.lineWidth;
          ctx.strokeStyle = '#231f20';
          ctx.stroke();
          ctx.restore();
        }
    }

    const nowmm = measureConfig.offsetmm + measureConfig.initmm;
    // 大头端
    const bigStartX = mainStartX + mStyle.leftPadding + nowmm * mStyle.mm2px;
    const bigStartH = mainStartH - bigUpPadding;
    const bigWidth = mainLength;
    const bigHeight = mStyle.bigHeight;
    ctx.save();
    ctx.fillStyle = '#b7b6b4';
    ctx.fillRect(bigStartX, bigStartH, bigWidth, bigHeight);
    ctx.strokeStyle = '#231f20';
    ctx.strokeRect(bigStartX, bigStartH, bigWidth, bigHeight);
    ctx.restore();

    // 3.6326
    const nowmmLast = nowmm % 1;
    // 0.6326
    const nowmm1000 = Math.round(nowmmLast * 1000);
    // 633
    const nowm1000 = nowmm1000 >= 500 ? nowmm1000 - 500 : nowmm1000;
    // 133
    // 展示范围为200
    // 133 中心 134 135 136 137 138 139 140画线 150大线

    const centerH = mainHLineH;
    // 大头端刻度
    // 下侧
    for (let i = -100; i <= 100; i++) {
      const now = nowm1000 + i;
      if (now % 50 === 0) {
        const bigLineStartX = bigStartX + linePadding;
        const bigLineStartH = centerH + i * 0.1 * mStyle.hm2px;
        const bigLineEndX = bigLineStartX + mStyle.hLine;
        const bigLineEndH = bigLineStartH;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(bigLineStartX, bigLineStartH);
        ctx.lineTo(bigLineEndX, bigLineEndH);
        ctx.closePath();
        ctx.lineWidth = mStyle.lineWidth;
        ctx.strokeStyle = '#231f20';
        ctx.stroke();
        ctx.restore();

        // 写字
        ctx.save();
        ctx.font = `${mStyle.hFontSize}px Arial`;
        ctx.textBaseline = 'middle';
        const str = `${mod(now / 10, 50)}`;
        // const strWidth = ctx.measureText(str).width;
        const strStartX = bigLineEndX + charLinePadding;
        const strStartH = bigLineEndH;
        ctx.fillText(str, strStartX, strStartH);
        ctx.restore();

        continue;
      }
      if (now % 10 === 0) {
        // 小线
        const smallLineStartX = bigStartX + linePadding;
        const smallLineStartH = centerH + i * 0.1 * mStyle.hm2px;
        const smallLineEndX = smallLineStartX + mStyle.hLine * smallLine;
        const smallLineEndH = smallLineStartH;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(smallLineStartX, smallLineStartH);
        ctx.lineTo(smallLineEndX, smallLineEndH);
        ctx.closePath();
        ctx.lineWidth = mStyle.lineWidth;
        ctx.strokeStyle = '#231f20';
        ctx.stroke();
        ctx.restore();

        continue;
      }
    }

    // 右侧的装饰
    const rightStartX = bigStartX + bigWidth / 2;
    const rightStartH = bigStartH;
    const rightWidth = bigWidth / 2;
    const rightHeight = bigHeight;
    ctx.save();
    ctx.fillStyle = '#680000';
    ctx.fillRect(rightStartX, rightStartH, rightWidth, rightHeight);
    ctx.strokeStyle = '#231f20';
    ctx.strokeRect(rightStartX, rightStartH, rightWidth, rightHeight);
    ctx.restore();
  }, [styleConfig, instrumentConfig]);

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
