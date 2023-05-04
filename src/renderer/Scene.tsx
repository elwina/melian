import React, { useEffect, useRef } from 'react';
import { Input, Radio, RadioChangeEvent, Space, Tooltip } from 'antd';
import { useImmer } from 'use-immer';
import Holder from './lab/Holder';
import Len from './lab/Len';
import 'antd/dist/reset.css';
import { mutiLightInter, singleLightInter } from './formula/interference';
import { light2rgb, mutiLight2rgb } from './formula/light2rgb';
import { D65Specteum } from './formula/spectrum';
import { multiplyArrays, normalization } from './utils/array';
import LightScreen from './lab/LightScreen';
import FourSide, { fourSideProps } from './control/FourSide';
import './Scene.css';

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
  hide: boolean;
  option: any;
}

export interface screenType {
  bitmapArr: Uint8ClampedArray | null;
  mmwidth: number;
  mmheight: number;
  mm2px: number; // 1个mm转换为x像素
  scaleX: number;
  scaleY: number;

  seemm: number; // 目镜视野范围
  offsetmm: number;

  leftMargin: number;
  bottomMargin: number;
}

export interface modeType {
  mode: 0 | 1 | 2; // 0 干涉
}

export interface interConfType {
  light: {
    name: string;
    type: 'D65';
    filter: 'none' | 'red' | 'green';
  };
  d: number;
  wave: number[];
  instense: number[];
}

export default function Scene() {
  const [scale, setScale] = useImmer<scaleType>({
    leftMargin: 50,
    bottomMargin: 150,
    holderHeight: 20,
    holderWidth: 1000,
    xScale: 1,
    hScale: 1,
  });

  const fourSide1: fourSideProps = {
    up: {
      value: scale.bottomMargin,
      step: 5,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setScale((draft) => {
          draft.bottomMargin = fn(scale.bottomMargin);
        });
      },
    },
    left: {
      value: scale.leftMargin,
      step: 5,
      min: 0,
      max: document.body.clientWidth,
      set: (fn) => {
        setScale((draft) => {
          draft.leftMargin = fn(scale.leftMargin);
        });
      },
    },
    side: {
      value: scale.hScale,
      step: 0.1,
      min: 1,
      max: 3,
      set: (fn) => {
        setScale((draft) => {
          draft.hScale = fn(scale.hScale);
        });
      },
    },
    bottom: {
      value: scale.xScale,
      step: 0.1,
      min: 1,
      max: 3,
      set: (fn) => {
        setScale((draft) => {
          draft.xScale = fn(scale.xScale);
        });
      },
    },
  };

  const fourSide3: fourSideProps = {
    side: {
      value: scale.holderHeight,
      step: 5,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setScale((draft) => {
          draft.holderHeight = fn(scale.holderHeight);
        });
      },
    },
    bottom: {
      value: scale.holderWidth,
      step: 5,
      min: 0,
      max: document.body.clientWidth,
      set: (fn) => {
        setScale((draft) => {
          draft.holderWidth = fn(scale.holderWidth);
        });
      },
    },
  };

  // distance 毫米
  const [lens, setLens] = useImmer<lenType[]>([
    {
      id: 0,
      name: '光源',
      distance: 0,
      lenHeight: 50,
      lenWidth: 20,
      hide: false,
      option: {},
    },
    {
      id: 1,
      name: '透镜',
      distance: 100,
      lenHeight: 50,
      lenWidth: 20,
      hide: false,
      option: {},
    },
    {
      id: 2,
      name: '滤光片',
      distance: 100,
      lenHeight: 50,
      lenWidth: 20,
      hide: false,
      option: {
        color: 'red',
      },
    },
    {
      id: 3,
      name: '单缝',
      distance: 200,
      lenHeight: 50,
      lenWidth: 20,
      hide: false,
      option: {},
    },
    {
      id: 4,
      name: '双缝',
      distance: 300,
      lenHeight: 50,
      lenWidth: 20,
      hide: false,
      option: {},
    },
    {
      id: 5,
      name: '光屏',
      distance: 900,
      lenHeight: 50,
      lenWidth: 20,
      hide: false,
      option: {},
    },
  ]);

  const [screen, setScreen] = useImmer<screenType>({
    bitmapArr: null,
    mmwidth: 20,
    mmheight: 20,
    mm2px: 10,
    scaleX: 1,
    scaleY: 1,

    seemm: 10,
    offsetmm: 0,

    leftMargin: 500,
    bottomMargin: 350,
  });

  const fourSide2: fourSideProps = {
    up: {
      value: screen.bottomMargin,
      step: 5,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setScreen((draft) => {
          draft.bottomMargin = fn(screen.bottomMargin);
        });
      },
    },
    left: {
      value: screen.leftMargin,
      step: 5,
      min: 0,
      max: document.body.clientWidth,
      set: (fn) => {
        setScreen((draft) => {
          draft.leftMargin = fn(screen.leftMargin);
        });
      },
    },
    side: {
      value: screen.scaleY,
      step: 0.1,
      min: 1,
      max: 3,
      set: (fn) => {
        setScreen((draft) => {
          draft.scaleY = fn(screen.scaleY);
        });
      },
    },
    bottom: {
      value: screen.scaleX,
      step: 0.1,
      min: 1,
      max: 3,
      set: (fn) => {
        setScreen((draft) => {
          draft.scaleX = fn(screen.scaleX);
        });
      },
    },
  };

  // 确定模式
  const [mode, setMode] = useImmer<modeType>({
    mode: 0,
  });

  const [interConf, setInterConf] = useImmer<interConfType>({
    light: {
      name: '白炽灯',
      type: 'D65',
      filter: 'red',
    },
    d: 0.2,
    wave: [660],
    instense: [1],
  });

  useEffect(() => {
    if (interConf.light.type === 'D65') {
      setLens((draft) => {
        for (let i = 0; i < draft.length; i++) {
          draft[i].hide = false;
        }
      });
    }
  }, [interConf.light.type, setLens]);

  useEffect(() => {
    switch (interConf.light.filter) {
      case 'none':
        setLens((draft) => {
          // 更改滤光片
          draft[2].hide = true;
        });
        break;
      case 'red':
        setLens((draft) => {
          // 更改滤光片
          draft[2].hide = true;
          draft[2].option.color = 'red';
        });
        break;
      case 'green':
        setLens((draft) => {
          // 更改滤光片
          draft[2].hide = true;
          draft[2].option.color = 'green';
        });
        break;
      default:
        break;
    }
  }, [interConf.light.filter, setLens]);

  // 以下为托马斯杨干涉内容
  useEffect(() => {
    if (interConf.light.type === 'D65') {
      switch (interConf.light.filter) {
        case 'none':
          setInterConf((draft) => {
            draft.wave = D65Specteum.wave;
            draft.instense = normalization(D65Specteum.instense);
          });
          break;
        case 'red':
          setInterConf((draft) => {
            draft.wave = [660];
            draft.instense = [1];
          });
          break;
        case 'green':
          setInterConf((draft) => {
            draft.wave = [535];
            draft.instense = [1];
          });
          break;
      }
    }
  }, [interConf.light, setInterConf]);

  useEffect(() => {
    const { d } = interConf;
    const n = 1;
    const r0 = lens[5].distance - lens[4].distance;
    const { wave } = interConf;
    const { instense } = interConf;

    const pxNum = screen.mmwidth * screen.mm2px;
    const pxStart = -screen.mmwidth / 2;

    const data = [...Array(pxNum)]
      .map((e, i) => pxStart + i / screen.mm2px)
      .map((po) => {
        return {
          position: po,
          wave: wave,
          instense: multiplyArrays(
            mutiLightInter(
              d,
              r0,
              wave.map((v) => v * 1e-6),
              n
            )(po),
            instense
          ),
        };
      });

    const bitmapColArr = data.map((v) => {
      return mutiLight2rgb(wave, v.instense);
    });
    const row = screen.mmheight * screen.mm2px;
    const bitmapArr: Uint8ClampedArray = new Uint8ClampedArray(
      new Array(row).fill(bitmapColArr.flat()).flat()
    );

    setScreen((draft) => {
      draft.bitmapArr = bitmapArr;
    });
  }, [
    interConf,
    lens,
    screen.mm2px,
    screen.mmheight,
    screen.mmwidth,
    setScreen,
  ]);

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
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 10,
          left: 20,
          display: 'inline-flex',
        }}
      >
        <FourSide fourSideProps={fourSide1} />
        <FourSide fourSideProps={fourSide3} />
        <FourSide fourSideProps={fourSide2} />
      </div>
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

        <Space.Compact>
          <Input
            addonBefore="leftMargin"
            value={screen.leftMargin}
            onChange={(e) => {
              setScreen((draft) => {
                draft.leftMargin = Number(e.target.value);
              });
            }}
          />
          <Input
            addonBefore="bottomMargin"
            value={screen.bottomMargin}
            onChange={(e) => {
              setScreen((draft) => {
                draft.bottomMargin = Number(e.target.value);
              });
            }}
          />
          <Input
            addonBefore="mm2px"
            value={screen.mm2px}
            onChange={(e) => {
              setScreen((draft) => {
                draft.mm2px = Number(e.target.value);
              });
            }}
          />
          <Input
            addonBefore="offsetmm"
            value={screen.offsetmm}
            onChange={(e) => {
              setScreen((draft) => {
                draft.offsetmm = Number(e.target.value);
              });
            }}
          />
          <Input
            addonBefore="seemm"
            value={screen.seemm}
            onChange={(e) => {
              setScreen((draft) => {
                draft.seemm = Number(e.target.value);
              });
            }}
          />
          <Input
            addonBefore="scaleX"
            value={screen.scaleX}
            onChange={(e) => {
              setScreen((draft) => {
                draft.scaleX = Number(e.target.value);
              });
            }}
          />{' '}
          <Input
            addonBefore="scaleY"
            value={screen.scaleY}
            onChange={(e) => {
              setScreen((draft) => {
                draft.scaleY = Number(e.target.value);
              });
            }}
          />
        </Space.Compact>

        <Radio.Group
          value={interConf.light.filter}
          onChange={(e: RadioChangeEvent) => {
            setInterConf((draft) => {
              draft.light.filter = e.target.value;
            });
          }}
        >
          <Radio.Button value="none">None</Radio.Button>
          <Radio.Button value="red">Red</Radio.Button>
          <Radio.Button value="green">Green</Radio.Button>
        </Radio.Group>
      </div>

      {/* <LineChart width={500} height={300} data={data}>
        <XAxis dataKey="x" padding={{ left: 30, right: 30 }} />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="y" stroke="#82ca9d" dot={false} />
      </LineChart> */}

      {/* <canvas width={500} height={300} ref={canvasRef}></canvas> */}
      <LightScreen screenConf={screen} />

      {RenderLens}
      <Holder scale={scale} />
    </>
  );
}
