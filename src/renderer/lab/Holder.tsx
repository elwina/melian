import React from 'react';
import type { scaleType } from 'renderer/Scene';

interface propsType {
  scale: scaleType;
}
export default function Holder({ scale }: propsType) {
  const widthCalc = scale.holderWidth * scale.xScale;
  const sty: React.CSSProperties = {
    position: 'fixed',
    left: scale.leftMargin,
    bottom: scale.bottomMargin,
    width: widthCalc,
    height: scale.holderHeight,
    backgroundColor: 'yellow',
  };

  return <div style={sty}>这是一个光具座</div>;
}
