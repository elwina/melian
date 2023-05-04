import { Slider } from 'antd';
import { CSSProperties, useState } from 'react';
import {
  VscArrowUp,
  VscArrowDown,
  VscArrowLeft,
  VscArrowRight,
  VscChevronUp,
  VscChevronDown,
  VscChevronLeft,
  VscChevronRight,
  VscGear,
  VscCircleFilled,
} from 'react-icons/vsc';

export interface adjustASide {
  value: number;
  step: number;
  min: number;
  max: number;
  set: (fn: (v: number) => number) => void;
}

export interface fourSideProps {
  up?: adjustASide;
  left?: adjustASide;
  side?: adjustASide;
  bottom?: adjustASide;
}

interface propsType {
  fourSideProps: fourSideProps;
}

export default function FourSide({ fourSideProps: conf }: propsType) {
  const zoom = [0.2, 1, 5, 20];
  const [zoomInd, setZoomInd] = useState<number>(1);
  const nextZoom = () => {
    setZoomInd((i) => (i + 1) % 4);
  };

  const styGrid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,20px)',
    gridTemplateRows: 'repeat(4,20px)',
    zIndex: 10,
  };

  return (
    <div style={styGrid}>
      <div>{zoomInd === 0 && <VscCircleFilled />}</div>
      {conf.up ? (
        <VscArrowUp
          onClick={() => {
            if (conf.up && conf.up.value < conf.up.max) {
              const c = conf.up;
              c.set((v) => v + c.step * zoom[zoomInd]);
            }
          }}
        />
      ) : (
        <div />
      )}
      <div>{zoomInd === 1 && <VscCircleFilled />}</div>
      {conf.side ? (
        <VscChevronUp
          onClick={() => {
            if (conf.side && conf.side.value < conf.side.max) {
              const c = conf.side;
              c.set((v) => v + c.step * zoom[zoomInd]);
            }
          }}
        />
      ) : (
        <div />
      )}
      {conf.left ? (
        <VscArrowLeft
          onClick={() => {
            if (conf.left && conf.left.value > conf.left.min) {
              const c = conf.left;
              c.set((v) => v - c.step * zoom[zoomInd]);
            }
          }}
        />
      ) : (
        <div />
      )}
      <VscGear onClick={nextZoom} />
      {conf.left ? (
        <VscArrowRight
          onClick={() => {
            if (conf.left && conf.left.value < conf.left.max) {
              const c = conf.left;
              c.set((v) => v + c.step * zoom[zoomInd]);
            }
          }}
        />
      ) : (
        <div />
      )}
      <div />
      <div>{zoomInd === 3 && <VscCircleFilled />}</div>
      {conf.up ? (
        <VscArrowDown
          onClick={() => {
            if (conf.up && conf.up.value > conf.up.min) {
              const c = conf.up;
              c.set((v) => v - c.step * zoom[zoomInd]);
            }
          }}
        />
      ) : (
        <div />
      )}
      <div>{zoomInd === 2 && <VscCircleFilled />}</div>
      {conf.side ? (
        <VscChevronDown
          onClick={() => {
            if (conf.side && conf.side.value > conf.side.min) {
              const c = conf.side;
              c.set((v) => v - c.step * zoom[zoomInd]);
            }
          }}
        />
      ) : (
        <div />
      )}
      {conf.bottom ? (
        <VscChevronLeft
          onClick={() => {
            if (conf.bottom && conf.bottom.value > conf.bottom.min) {
              const c = conf.bottom;
              c.set((v) => v - c.step * zoom[zoomInd]);
            }
          }}
        />
      ) : (
        <div />
      )}
      <div />
      {conf.bottom ? (
        <VscChevronRight
          onClick={() => {
            if (conf.bottom && conf.bottom.value < conf.bottom.max) {
              const c = conf.bottom;
              c.set((v) => v + c.step * zoom[zoomInd]);
            }
          }}
        />
      ) : (
        <div />
      )}
      <div />
    </div>
  );
}
