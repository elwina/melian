import React, { Fragment } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import type { scaleType } from 'renderer/Scene';
import DragMove from './DragMove';

interface propsType {
  name: string;
  scale: scaleType;
  distance: number;
  lenHeight: number;
  lenWidth: number;
  setDistance: () => (val: number) => void;
}
export default function Len({
  name,
  scale,
  distance,
  lenHeight,
  lenWidth,
  setDistance,
}: propsType) {
  const bottomCalc = scale.bottomMargin + scale.holderHeight;
  const leftCalc = scale.leftMargin + distance * scale.xScale - lenWidth / 2;
  const heightCalc = lenHeight * scale.hScale;

  const sty: React.CSSProperties = {
    position: 'fixed',
    bottom: bottomCalc,
    left: leftCalc,
    height: heightCalc,
    width: lenWidth,
    backgroundColor: 'red',
  };

  return (
    <>
      <div style={sty}>
        <FontAwesomeIcon
          icon={faArrowLeft}
          onClick={() => {
            setDistance()(distance - 5);
          }}
        />
        <FontAwesomeIcon
          icon={faArrowRight}
          onClick={() => {
            setDistance()(distance + 5);
          }}
        />

        <div>
          {name}
          {Math.floor(distance)}
        </div>
      </div>
      <div>
        <DragMove
          scale={scale}
          distance={distance}
          lenWidth={lenWidth}
          setDistance={setDistance}
        />
      </div>
    </>
  );
}
