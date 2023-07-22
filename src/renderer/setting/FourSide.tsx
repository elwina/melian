import { CSSProperties, useState } from 'react';
import {
  VscArrowDown,
  VscArrowRight,
  VscChevronDown,
  VscChevronRight,
  VscGear,
  VscCircleFilled,
  VscArrowLeft,
  VscChevronLeft,
  VscArrowUp,
  VscChevronUp,
} from 'react-icons/vsc';

export interface adjustASide {
  valueIndex: number;
  step: number;
  min: number;
  max: number;
}

export interface propsType {
  values: number[];
  onChange: (values: number[]) => void;
  options: {
    vmiddle?: adjustASide;
    hmiddle?: adjustASide;
    side?: adjustASide;
    bottom?: adjustASide;
  };
}

export default function FourSide({ values, onChange, options }: propsType) {
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

  function change(i: number, v: number) {
    const newValues = [...values];
    newValues[i] = v;
    onChange(newValues);
  }

  return (
    <div style={styGrid}>
      <div>{zoomInd === 0 && <VscCircleFilled />}</div>
      {options.vmiddle ? (
        <VscArrowUp
          onClick={() => {
            if (
              options.vmiddle &&
              values[options.vmiddle.valueIndex] < options.vmiddle.max
            ) {
              const c = options.vmiddle;
              change(
                c.valueIndex,
                values[c.valueIndex] + c.step * zoom[zoomInd]
              );
            }
          }}
        />
      ) : (
        <div />
      )}
      <div>{zoomInd === 1 && <VscCircleFilled />}</div>
      {options.side ? (
        <VscChevronUp
          onClick={() => {
            if (
              options.side &&
              values[options.side.valueIndex] < options.side.max
            ) {
              const c = options.side;
              change(
                c.valueIndex,
                values[c.valueIndex] + c.step * zoom[zoomInd]
              );
            }
          }}
        />
      ) : (
        <div />
      )}
      {options.hmiddle ? (
        <VscArrowLeft
          onClick={() => {
            if (
              options.hmiddle &&
              values[options.hmiddle.valueIndex] > options.hmiddle.min
            ) {
              const c = options.hmiddle;
              change(
                c.valueIndex,
                values[c.valueIndex] - c.step * zoom[zoomInd]
              );
            }
          }}
        />
      ) : (
        <div />
      )}
      <VscGear onClick={nextZoom} />
      {options.hmiddle ? (
        <VscArrowRight
          onClick={() => {
            if (
              options.hmiddle &&
              values[options.hmiddle.valueIndex] < options.hmiddle.max
            ) {
              const c = options.hmiddle;
              change(
                c.valueIndex,
                values[c.valueIndex] + c.step * zoom[zoomInd]
              );
            }
          }}
        />
      ) : (
        <div />
      )}
      <div />
      <div>{zoomInd === 3 && <VscCircleFilled />}</div>
      {options.vmiddle ? (
        <VscArrowDown
          onClick={() => {
            if (
              options.vmiddle &&
              values[options.vmiddle.valueIndex] > options.vmiddle.min
            ) {
              const c = options.vmiddle;
              change(
                c.valueIndex,
                values[c.valueIndex] - c.step * zoom[zoomInd]
              );
            }
          }}
        />
      ) : (
        <div />
      )}
      <div>{zoomInd === 2 && <VscCircleFilled />}</div>
      {options.side ? (
        <VscChevronDown
          onClick={() => {
            if (
              options.side &&
              values[options.side.valueIndex] > options.side.min
            ) {
              const c = options.side;
              change(
                c.valueIndex,
                values[c.valueIndex] - c.step * zoom[zoomInd]
              );
            }
          }}
        />
      ) : (
        <div />
      )}
      {options.bottom ? (
        <VscChevronLeft
          onClick={() => {
            if (
              options.bottom &&
              values[options.bottom.valueIndex] > options.bottom.min
            ) {
              const c = options.bottom;
              change(
                c.valueIndex,
                values[c.valueIndex] - c.step * zoom[zoomInd]
              );
            }
          }}
        />
      ) : (
        <div />
      )}
      <div />
      {options.bottom ? (
        <VscChevronRight
          onClick={() => {
            if (
              options.bottom &&
              values[options.bottom.valueIndex] < options.bottom.max
            ) {
              const c = options.bottom;
              change(
                c.valueIndex,
                values[c.valueIndex] + c.step * zoom[zoomInd]
              );
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
