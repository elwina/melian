import React, { useEffect, useRef, useState } from 'react';
import {
  Button,
  Input,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Slider,
  Space,
  Tooltip,
  Typography,
  message,
} from 'antd';
import { BsFillBoxFill } from 'react-icons/bs';
import {
  CaretLeftFilled,
  CaretRightFilled,
  DownloadOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import {
  VscChromeMaximize,
  VscChromeMinimize,
  VscChromeRestore,
  VscChromeClose,
} from 'react-icons/vsc';
import { AiFillCaretLeft, AiFillCaretRight } from 'react-icons/ai';
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
import styles from './Scene.module.css';
import Measure1 from './lab/Measure1';
import LightScreenFixed from './lab/LightScreenFixed';
import Ctrl from './lab/Ctrl';
import CustomButton from './control/CustomButton';

export interface holderType {
  leftMargin: number;
  bottomMargin: number;
  holderHeight: number;
  holderWidthmm: number;
  leftPadding: number;
  xScale: number;
  upHeight: number;
  fontSize: number;
  baselineHeight: number;
  lenScaleX: number;
  lenScaleY: number;
}

export interface lenType {
  id: number;
  uname: string;
  name: string;
  distancemm: number;
  lenHeight: number;
  lenWidth: number;
  hide: boolean;
  option: Record<string, unknown>;
}

export interface ctrlType {
  showmm: number[];
  move: number[];
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

export interface measureType {
  type: 1;
  offsetmm: number;
  initmm: number;

  mm2px: number;

  upHeight: number;
  downHeight: number;
  dsHeight: number;
  fontHeight: number;
  sfontHeight: number;

  fontSize: number;
  sfontSize: number;
  lineWidth: number;
  leftPadding: number;
  upPadding: number;

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
    filter: 'none' | 'red' | 'green' | 'custom';
    custom: number;
  };
  d: number;
  wave: number[];
  instense: number[];
}

export interface confType {
  holder: holderType;
  lens: lenType[];
  ctrl: ctrlType;
  screen: screenType;
  measure: measureType;
  mode: modeType;
  interConf: interConfType;
}

export enum sideControlEnum {
  HOLDER,
  SCREEN,
  MEASURE,
}

export default function Scene() {
  const { ipcRenderer } = window.electron;

  const [holder, setHolder] = useImmer<holderType>({
    leftMargin: 50, // 1
    bottomMargin: 185, // 1
    holderHeight: 28, // 1
    holderWidthmm: 1000, // 1
    leftPadding: 10, // 2
    xScale: 1.1, // 2
    upHeight: 246, // 2
    fontSize: 18, // 2
    baselineHeight: 116, // 7
    lenScaleX: 2, // 7
    lenScaleY: 2.6, // 7
  });

  const fourSide1: fourSideProps = {
    up: {
      value: holder.bottomMargin,
      step: 5,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setHolder((draft) => {
          draft.bottomMargin = fn(holder.bottomMargin);
        });
      },
    },
    left: {
      value: holder.leftMargin,
      step: 5,
      min: 0,
      max: document.body.clientWidth,
      set: (fn) => {
        setHolder((draft) => {
          draft.leftMargin = fn(holder.leftMargin);
        });
      },
    },
    side: {
      value: holder.holderHeight,
      step: 2,
      min: 0,
      max: document.body.clientWidth,
      set: (fn) => {
        setHolder((draft) => {
          draft.holderHeight = fn(holder.holderHeight);
        });
      },
    },
    bottom: {
      value: holder.holderWidthmm,
      step: 20,
      min: 0,
      max: document.body.clientWidth,
      set: (fn) => {
        setHolder((draft) => {
          draft.holderWidthmm = fn(holder.holderWidthmm);
        });
      },
    },
  };
  const fourSide2: fourSideProps = {
    up: {
      value: holder.upHeight,
      step: 2,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setHolder((draft) => {
          draft.upHeight = fn(holder.upHeight);
        });
      },
    },
    left: {
      value: holder.leftPadding,
      step: 2,
      min: 0,
      max: document.body.clientWidth,
      set: (fn) => {
        setHolder((draft) => {
          draft.leftPadding = fn(holder.leftPadding);
        });
      },
    },
    side: {
      value: holder.fontSize,
      step: 2,
      min: 0,
      max: document.body.clientWidth,
      set: (fn) => {
        setHolder((draft) => {
          draft.fontSize = fn(holder.fontSize);
        });
      },
    },
    bottom: {
      value: holder.xScale,
      step: 0.1,
      min: 0,
      max: 100,
      set: (fn) => {
        setHolder((draft) => {
          draft.xScale = fn(holder.xScale);
        });
      },
    },
  };
  const fourSide7: fourSideProps = {
    up: {
      value: holder.baselineHeight,
      step: 2,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setHolder((draft) => {
          draft.baselineHeight = fn(holder.baselineHeight);
        });
      },
    },
    bottom: {
      value: holder.lenScaleX,
      step: 0.2,
      min: 0,
      max: 100,
      set: (fn) => {
        setHolder((draft) => {
          draft.lenScaleX = fn(holder.lenScaleX);
        });
      },
    },
    side: {
      value: holder.lenScaleY,
      step: 0.2,
      min: 0,
      max: 100,
      set: (fn) => {
        setHolder((draft) => {
          draft.lenScaleY = fn(holder.lenScaleY);
        });
      },
    },
  };

  // distance 毫米
  const [lens, setLens] = useImmer<lenType[]>([
    {
      id: 0,
      uname: 'light01',
      name: '光源',
      distancemm: 0,
      lenHeight: 50,
      lenWidth: 20,
      hide: false,
      option: {},
    },
    {
      id: 1,
      uname: 'convex_lens01',
      name: '透镜',
      distancemm: 100,
      lenHeight: 50,
      lenWidth: 20,
      hide: false,
      option: {},
    },
    {
      id: 2,
      uname: 'filter01',
      name: '滤光片',
      distancemm: 150,
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
      uname: 'single_slit01',

      distancemm: 200,
      lenHeight: 50,
      lenWidth: 20,
      hide: false,
      option: {},
    },
    {
      id: 4,
      uname: 'double_slit01',
      name: '双缝',
      distancemm: 300,
      lenHeight: 50,
      lenWidth: 20,
      hide: false,
      option: {},
    },
    {
      id: 5,
      name: '测量头',
      uname: 'measure_head01',
      distancemm: 900,
      lenHeight: 50,
      lenWidth: 20,
      hide: false,
      option: {},
    },
  ]);

  const [ctrl, setCtrl] = useImmer<ctrlType>({
    showmm: lens.map((item) => item.id),
    move: [3, 4, 5],
  });

  const [screen, setScreen] = useImmer<screenType>({
    bitmapArr: null,
    mmwidth: 20,
    mmheight: 20,
    mm2px: 10,
    scaleX: 1,
    scaleY: 1,

    seemm: 10,
    offsetmm: 0,

    leftMargin: 205,
    bottomMargin: 515,
  });

  const fourSide3: fourSideProps = {
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

  const [measure, setMeasure] = useImmer<measureType>({
    type: 1,
    offsetmm: 0,
    initmm: 10,

    mm2px: 5.5, // 6

    upHeight: 42, // 5
    downHeight: 44, // 5
    dsHeight: 39, // 4
    fontHeight: 20, // 5
    sfontHeight: 20, // 5

    fontSize: 20, // 6
    sfontSize: 16, // 6
    lineWidth: 2, // 6
    leftPadding: 12, // 4
    upPadding: 5,

    leftMargin: 660, // 4
    bottomMargin: 415, // 4
  });

  const fourSide4: fourSideProps = {
    up: {
      value: measure.bottomMargin,
      step: 5,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setMeasure((draft) => {
          draft.bottomMargin = fn(measure.bottomMargin);
        });
      },
    },
    left: {
      value: measure.leftMargin,
      step: 5,
      min: 0,
      max: document.body.clientWidth,
      set: (fn) => {
        setMeasure((draft) => {
          draft.leftMargin = fn(measure.leftMargin);
        });
      },
    },
    side: {
      value: measure.dsHeight,
      step: 2,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setMeasure((draft) => {
          draft.dsHeight = fn(measure.dsHeight);
        });
      },
    },
    bottom: {
      value: measure.leftPadding,
      step: 4,
      min: 0,
      max: document.body.clientWidth,
      set: (fn) => {
        setMeasure((draft) => {
          draft.leftPadding = fn(measure.leftPadding);
        });
      },
    },
  };
  const fourSide5: fourSideProps = {
    up: {
      value: measure.upHeight,
      step: 2,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setMeasure((draft) => {
          draft.upHeight = fn(measure.upHeight);
        });
      },
    },
    left: {
      value: measure.downHeight,
      step: 2,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setMeasure((draft) => {
          draft.downHeight = fn(measure.downHeight);
        });
      },
    },
    side: {
      value: measure.fontHeight,
      step: 2,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setMeasure((draft) => {
          draft.fontHeight = fn(measure.fontHeight);
        });
      },
    },
    bottom: {
      value: measure.sfontHeight,
      step: 2,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setMeasure((draft) => {
          draft.sfontHeight = fn(measure.sfontHeight);
        });
      },
    },
  };

  const fourSide6: fourSideProps = {
    up: {
      value: measure.fontSize,
      step: 2,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setMeasure((draft) => {
          draft.fontSize = fn(measure.fontSize);
        });
      },
    },
    left: {
      value: measure.sfontSize,
      step: 2,
      min: 0,
      max: document.body.clientHeight,
      set: (fn) => {
        setMeasure((draft) => {
          draft.sfontSize = fn(measure.sfontSize);
        });
      },
    },
    side: {
      value: measure.lineWidth,
      step: 2,
      min: 2,
      max: 100,
      set: (fn) => {
        setMeasure((draft) => {
          draft.lineWidth = fn(measure.lineWidth);
        });
      },
    },
    bottom: {
      value: measure.mm2px,
      step: 0.5,
      min: 0,
      max: document.body.clientWidth,
      set: (fn) => {
        setMeasure((draft) => {
          draft.mm2px = fn(measure.mm2px);
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
      custom: 660,
    },
    d: 0.2,
    wave: [660],
    instense: [1],
  });

  const [customD, setCustomD] = useState<number>(0.2);

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
      case 'custom':
        setLens((draft) => {
          // 更改滤光片
          draft[2].hide = false;
          draft[2].option.color = 'custom';
          draft[2].option.lambda = interConf.light.custom;
        });
        break;
    }
  }, [interConf.light.custom, interConf.light.filter, setLens]);

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
        case 'custom':
          setInterConf((draft) => {
            draft.wave = [interConf.light.custom];
            draft.instense = [1];
          });
          break;
      }
    }
  }, [interConf.light, setInterConf]);

  useEffect(() => {
    const { d } = interConf;
    const n = 1;
    const r0 = lens[5].distancemm - lens[4].distancemm;
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

  const moveLeft = () => {
    const now = screen.offsetmm;
    const target = now - 0.1;
    setScreen((draft) => {
      draft.offsetmm = target;
    });
    setMeasure((draft) => {
      draft.offsetmm = target;
    });
  };
  const moveRight = () => {
    const now = screen.offsetmm;
    const target = now + 0.1;
    setScreen((draft) => {
      draft.offsetmm = target;
    });
    setMeasure((draft) => {
      draft.offsetmm = target;
    });
  };

  const [dpath, setDpath] = useState('');
  const download = async () => {
    const config: confType = {
      holder,
      lens,
      ctrl,
      screen: {
        ...screen,
        bitmapArr: null,
      },
      interConf,
      measure,
      mode,
      // scale,
    };
    const path = await ipcRenderer.invoke('saveConf', [dpath, config]);
    if (path !== '') {
      setDpath(path);
    }
  };
  const load = async () => {
    const { status, config } = await ipcRenderer.invoke('loadConf', [dpath]);
    if (!status) {
      // 加载失败
      console.error('加载失败');
    } else {
      // 加载成功
      setHolder(config.holder);
      setLens(config.lens);
      setCtrl(config.ctrl);
      setScreen(config.screen);
      setInterConf(config.interConf);
      setMeasure(config.measure);
      setMode(config.mode);
    }
  };

  useEffect(() => {
    ipcRenderer.on('exportConfig', async () => {
      await download();
    });
    ipcRenderer.on('importConfig', async () => {
      await load();
    });
  }, []);

  // 左下角控制区

  const [sideControl, setSideControl] = useState<sideControlEnum>(
    sideControlEnum.HOLDER
  );

  return (
    <>
      <div
        style={{
          position: 'fixed',
          bottom: 10,
          left: 0,
          width: '100%',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-around',
        }}
      >
        <Radio.Group
          onChange={(e) => {
            setSideControl(e.target.value);
          }}
          value={sideControl}
        >
          <Space.Compact direction="vertical">
            <Radio value={sideControlEnum.HOLDER}>光具台</Radio>
            <Radio value={sideControlEnum.SCREEN}>视线</Radio>
            <Radio value={sideControlEnum.MEASURE}>测量头</Radio>
          </Space.Compact>
        </Radio.Group>
        {sideControl === sideControlEnum.HOLDER && (
          <>
            <FourSide fourSideProps={fourSide1} />
            <FourSide fourSideProps={fourSide2} />
            <FourSide fourSideProps={fourSide7} />
          </>
        )}
        {sideControl === sideControlEnum.SCREEN && (
          <FourSide fourSideProps={fourSide3} />
        )}
        {sideControl === sideControlEnum.MEASURE && (
          <>
            <FourSide fourSideProps={fourSide4} />
            <FourSide fourSideProps={fourSide5} />
            <FourSide fourSideProps={fourSide6} />
          </>
        )}
        <div>
          <div style={{ textAlign: 'center', paddingBottom: 10, fontSize: 15 }}>
            双缝间距
          </div>
          <CustomButton
            value={interConf.d}
            min={0.02}
            max={0.3}
            step={0.01}
            options={[0.2, 0.25]}
            unit="mm"
            toFixedPoint={2}
            onChange={(v) => {
              setInterConf((draft) => {
                draft.d = v;
              });
            }}
          />
        </div>
        <div>
          <div style={{ textAlign: 'center', paddingBottom: 10, fontSize: 15 }}>
            滤光片
          </div>
          <Space.Compact>
            <Radio.Group
              value={interConf.light.filter}
              onChange={(e: RadioChangeEvent) => {
                setInterConf((draft) => {
                  draft.light.filter = e.target.value;
                });
              }}
            >
              <Radio.Button value="none">无</Radio.Button>
              <Radio.Button value="red">红</Radio.Button>
              <Radio.Button value="green">绿</Radio.Button>
              <Radio.Button value="custom">自定义</Radio.Button>
              <Slider
                min={420}
                max={720}
                step={0.1}
                value={interConf.light.custom}
                disabled={interConf.light.filter !== 'custom'}
                onChange={(v) => {
                  setInterConf((draft) => {
                    draft.light.custom = v;
                  });
                }}
              />
            </Radio.Group>
          </Space.Compact>
        </div>
        <div>
          <Space.Compact>
            <Button icon={<DownloadOutlined />} onClick={download} />
            <Button icon={<UploadOutlined />} onClick={load} />
          </Space.Compact>
          <br />
          <Space.Compact>
            <Button
              icon={<VscChromeMaximize />}
              onClick={() => {
                ipcRenderer.maximize();
              }}
            />{' '}
            <Button
              icon={<VscChromeRestore />}
              onClick={() => {
                ipcRenderer.unmaximize();
              }}
            />{' '}
            <Button
              icon={<VscChromeClose />}
              onClick={() => {
                ipcRenderer.close();
              }}
            />
          </Space.Compact>
        </div>
        <div>
          <div style={{ textAlign: 'center', paddingBottom: 10, fontSize: 15 }}>
            目镜控制
          </div>
          <Space.Compact>
            <Button
              type="primary"
              icon={<CaretLeftFilled />}
              onClick={moveLeft}
              size="large"
            />{' '}
            <Button
              type="primary"
              icon={<CaretRightFilled />}
              onClick={moveRight}
              size="large"
            />
          </Space.Compact>
        </div>
      </div>
      <LightScreenFixed screenConf={screen} />
      <Measure1 measureConfType={measure} />
      <Holder holderConf={holder} />
      {lens.map((len, i) => {
        return <Len key={len.id} lenConf={len} holderConf={holder} />;
      })}
      <Ctrl
        ctrlConf={ctrl}
        holderConf={holder}
        lensConf={lens}
        setLens={setLens}
      />
    </>
  );
}

// const setLenDistance= (id:number) => {
//   return (val:number)=>{
//     setLenDistance()
//   }
// }
