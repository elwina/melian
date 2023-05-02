import React, { Fragment, useEffect, useRef } from 'react';
import { Input, Space, Tooltip } from 'antd';
import { useImmer } from 'use-immer';
import Holder from './lab/Holder';
import Len from './lab/Len';
import 'antd/dist/reset.css';
import { singleLight } from './formula/interference';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import { light2rgb } from './formula/light2rgb';

export interface scaleType {
  leftMargin: number;
  bottomMargin: number;
  holderHeight: number;
  holderWidth: number;
  xScale: number;
  hScale: number;
}

export interface lenType {
  id: number;
  name: string;
  distance: number;
  lenHeight: number;
  lenWidth: number;
}

export default function Scene() {
  const [scale, setScale] = useImmer<scaleType>({
    leftMargin: 0,
    bottomMargin: 100,
    holderHeight: 20,
    holderWidth: 1000,
    xScale: 1,
    hScale: 1,
  });

  const [lens, setLens] = useImmer<lenType[]>([
    {
      id: 0,
      name: '光源',
      distance: 0,
      lenHeight: 50,
      lenWidth: 20,
    },
    {
      id: 1,
      name: '透镜',
      distance: 10,
      lenHeight: 50,
      lenWidth: 20,
    },
    {
      id: 2,
      name: '单缝',
      distance: 20,
      lenHeight: 50,
      lenWidth: 20,
    },
    {
      id: 3,
      name: '双缝',
      distance: 30,
      lenHeight: 50,
      lenWidth: 20,
    },
    {
      id: 4,
      name: '光屏',
      distance: 90,
      lenHeight: 50,
      lenWidth: 20,
    },
  ]);

  // 所有单位均为毫米
  const r0 = (lens[4].distance - lens[3].distance) * 10;
  const la = 660e-6;
  const n = 1;
  const d = 0.2;
  // 一共分辨100个
  const data = [...Array(100)]
    .map((e, i) => -10 + i / 5)
    .map((v) => {
      return {
        x: v,
        y: singleLight(d, r0, la, n)(v),
      };
    });
  const mainRGB = light2rgb(la * 1e6);
  const bitmapColArr = data.map((v) => {
    return mainRGB.map((r) => r * v.y);
  });
  const row = 20;
  const bitmapArr: Uint8ClampedArray = new Uint8ClampedArray(
    new Array(row).fill(bitmapColArr.flat()).flat()
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current == null) return;
    const can: HTMLCanvasElement = canvasRef.current;
    if (can == null) {
      return;
    }
    const ctx = can.getContext('2d');
    if (ctx == null) return;
    const imagedata = new ImageData(bitmapArr, 100);
    ctx.putImageData(imagedata, 0, 0);
    console.log(imagedata);
  }, [bitmapArr]);

  const RenderLens = lens.map((len) => {
    return (
      <Len
        key={len.id}
        name={len.name}
        scale={scale}
        distance={len.distance}
        lenHeight={len.lenHeight}
        lenWidth={len.lenWidth}
        setDistance={() => {
          return (val: number) => {
            setLens((draft) => {
              draft[len.id].distance = val;
            });
          };
        }}
      />
    );
  });

  return (
    <div>
      <Space.Compact>
        <Input
          addonBefore="leftMargin"
          value={scale.leftMargin}
          onChange={(e) => {
            setScale((draft) => {
              draft.leftMargin = Number(e.target.value);
            });
          }}
        />
        <Input
          addonBefore="bottomMargin"
          value={scale.bottomMargin}
          onChange={(e) => {
            setScale((draft) => {
              draft.bottomMargin = Number(e.target.value);
            });
          }}
        />
        <Input
          addonBefore="holderHeight"
          value={scale.holderHeight}
          onChange={(e) => {
            setScale((draft) => {
              draft.holderHeight = Number(e.target.value);
            });
          }}
        />
        <Input
          addonBefore="holderWidth"
          value={scale.holderWidth}
          onChange={(e) => {
            setScale((draft) => {
              draft.holderWidth = Number(e.target.value);
            });
          }}
        />
        <Input
          addonBefore="xScale"
          value={scale.xScale}
          onChange={(e) => {
            setScale((draft) => {
              draft.xScale = Number(e.target.value);
            });
          }}
        />
        <Input
          addonBefore="hScale"
          value={scale.hScale}
          onChange={(e) => {
            setScale((draft) => {
              draft.hScale = Number(e.target.value);
            });
          }}
        />
      </Space.Compact>

      <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="x" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="y" stroke="#82ca9d" dot={false} />
      </LineChart>

      <canvas width={500} height={300} ref={canvasRef}></canvas>

      {RenderLens}
      <Holder scale={scale} />
    </div>
  );
}
