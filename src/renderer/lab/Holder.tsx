import { CSSProperties, useEffect, useRef } from 'react';
import type { holderType } from 'renderer/Scene';

interface propsType {
  holderConf: holderType;
}
export default function Holder({ holderConf: hF }: propsType) {
  const heightCalc = hF.holderHeight;
  const widthCalc = hF.holderWidthmm * hF.xScale;

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
        backgroundColor: 'yellow',
      }}
    />
  );
}
