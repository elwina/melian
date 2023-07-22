import { Button } from 'antd';
import { useRef, useState } from 'react';
import { DraggableCore } from 'react-draggable';
import {
  BiSignal1,
  BiSignal2,
  BiSignal3,
  BiSignal4,
  BiSignal5,
} from 'react-icons/bi';
import svg from '../../../assets/settings/CircleS.svg';
import svg2 from '../../../assets/settings/CircleS2.png';

interface propsType {
  values: number[];
  onChange: (values: number[]) => void;
  options: {
    min: number;
    max: number;
    step: number;
    round: number;
  };
}

export default function CircleSlider({ values, onChange, options }: propsType) {
  const ifDragging = useRef<boolean>(false);
  const value = ((values[0] % options.round) / options.round) * 360;

  const zoom = [0.5, 1, 2, 4, 8];
  const [zoomInd, setZoomInd] = useState<number>(1);
  const zoomIcon = [
    <BiSignal1 />,
    <BiSignal2 />,
    <BiSignal3 />,
    <BiSignal4 />,
    <BiSignal5 />,
  ];

  function change(v: number) {
    const re = Array.from(values).fill(v);
    onChange(re);
  }

  return (
    <>
      <div>
        <img
          src={svg}
          alt="CircleSlider"
          style={{ objectFit: 'contain', transform: `rotate(${value}deg)` }}
          height={80}
          onContextMenu={(e) => {
            e.preventDefault();
          }}
          draggable="false"
        />
      </div>
      <div
        style={{
          display: 'inline-flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div>
          <Button
            onClick={() => {
              setZoomInd((i) => (i + 1) % zoom.length);
            }}
          >
            {zoomIcon[zoomInd]}
          </Button>
        </div>
        <div>
          <DraggableCore
            onStart={() => {
              ifDragging.current = true;
              document.getElementsByTagName('body')[0].style.cursor =
                'e-resize';
            }}
            onStop={() => {
              ifDragging.current = false;
              document.getElementsByTagName('body')[0].style.cursor = 'default';
            }}
            onDrag={(e, data) => {
              const newValue =
                values[0] +
                Math.floor(data.deltaX * zoom[zoomInd]) * options.step;
              if (newValue > options.max) {
                change(options.max);
              } else if (newValue < options.min) {
                change(options.min);
              } else {
                change(newValue);
              }
            }}
          >
            <img
              src={svg2}
              alt="CircleSlider"
              height={20}
              width={80}
              onContextMenu={(e) => {
                e.preventDefault();
              }}
              draggable="false"
              onMouseEnter={() => {
                if (!ifDragging.current) {
                  document.getElementsByTagName('body')[0].style.cursor =
                    'pointer';
                }
              }}
              onMouseLeave={() => {
                if (!ifDragging.current) {
                  document.getElementsByTagName('body')[0].style.cursor =
                    'default';
                }
              }}
            />
          </DraggableCore>
        </div>
      </div>
    </>
  );
}
