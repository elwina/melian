import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { Channels } from 'main/preload';
import { DateTime } from 'luxon';
import Holder from './lab/Holder';
import 'antd/dist/reset.css';
import { fourSideProps } from './control/FourSide';
import Measure1 from './lab/Measure1';
import LightScreenFixed2 from './lab/LightScreenFixed2';
import { InstrumentConfig, StyleConfig } from './config.type';
import LenGene from './lab/LenGene';
import Ctrl from './lab/Ctrl';
import LoadSetting from './setting/LoadSetting';

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

export enum sideControlEnum {
  HOLDER,
  SCREEN,
  MEASURE,
}

export default function Scene() {
  let ipcRenderer: {
    sendMessage(channel: Channels, args: unknown[]): void;
    on(channel: Channels, func: (...args: unknown[]) => void): () => void;
    once(channel: Channels, func: (...args: unknown[]) => void): void;
    invoke(channel: Channels, args: unknown[]): Promise<any>;
    minimize(): void;
    maximize(): void;
    unmaximize(): void;
    restore(): void;
    close(): void;
  } | null;
  try {
    ipcRenderer = window.electron.ipcRenderer
      ? window.electron.ipcRenderer
      : null;
  } catch {
    ipcRenderer = null;
  }

  const web = !ipcRenderer;

  // const fourSide3: fourSideProps = {
  //   up: {
  //     value: screen.bottomMargin,
  //     step: 5,
  //     min: 0,
  //     max: document.body.clientHeight,
  //     set: (fn) => {
  //       setScreen((draft) => {
  //         draft.bottomMargin = fn(screen.bottomMargin);
  //       });
  //     },
  //   },
  //   left: {
  //     value: screen.leftMargin,
  //     step: 5,
  //     min: 0,
  //     max: document.body.clientWidth,
  //     set: (fn) => {
  //       setScreen((draft) => {
  //         draft.leftMargin = fn(screen.leftMargin);
  //       });
  //     },
  //   },
  //   side: {
  //     value: screen.scaleY,
  //     step: 0.1,
  //     min: 1,
  //     max: 3,
  //     set: (fn) => {
  //       setScreen((draft) => {
  //         draft.scaleY = fn(screen.scaleY);
  //       });
  //     },
  //   },
  //   bottom: {
  //     value: screen.scaleX,
  //     step: 0.1,
  //     min: 1,
  //     max: 3,
  //     set: (fn) => {
  //       setScreen((draft) => {
  //         draft.scaleX = fn(screen.scaleX);
  //       });
  //     },
  //   },
  // };

  // const fourSide4: fourSideProps = {
  //   up: {
  //     value: measure.bottomMargin,
  //     step: 5,
  //     min: 0,
  //     max: document.body.clientHeight,
  //     set: (fn) => {
  //       setMeasure((draft) => {
  //         draft.bottomMargin = fn(measure.bottomMargin);
  //       });
  //     },
  //   },
  //   left: {
  //     value: measure.leftMargin,
  //     step: 5,
  //     min: 0,
  //     max: document.body.clientWidth,
  //     set: (fn) => {
  //       setMeasure((draft) => {
  //         draft.leftMargin = fn(measure.leftMargin);
  //       });
  //     },
  //   },
  //   side: {
  //     value: measure.dsHeight,
  //     step: 2,
  //     min: 0,
  //     max: document.body.clientHeight,
  //     set: (fn) => {
  //       setMeasure((draft) => {
  //         draft.dsHeight = fn(measure.dsHeight);
  //       });
  //     },
  //   },
  //   bottom: {
  //     value: measure.leftPadding,
  //     step: 4,
  //     min: 0,
  //     max: document.body.clientWidth,
  //     set: (fn) => {
  //       setMeasure((draft) => {
  //         draft.leftPadding = fn(measure.leftPadding);
  //       });
  //     },
  //   },
  // };
  // const fourSide5: fourSideProps = {
  //   up: {
  //     value: measure.upHeight,
  //     step: 2,
  //     min: 0,
  //     max: document.body.clientHeight,
  //     set: (fn) => {
  //       setMeasure((draft) => {
  //         draft.upHeight = fn(measure.upHeight);
  //       });
  //     },
  //   },
  //   left: {
  //     value: measure.downHeight,
  //     step: 2,
  //     min: 0,
  //     max: document.body.clientHeight,
  //     set: (fn) => {
  //       setMeasure((draft) => {
  //         draft.downHeight = fn(measure.downHeight);
  //       });
  //     },
  //   },
  //   side: {
  //     value: measure.fontHeight,
  //     step: 2,
  //     min: 0,
  //     max: document.body.clientHeight,
  //     set: (fn) => {
  //       setMeasure((draft) => {
  //         draft.fontHeight = fn(measure.fontHeight);
  //       });
  //     },
  //   },
  //   bottom: {
  //     value: measure.sfontHeight,
  //     step: 2,
  //     min: 0,
  //     max: document.body.clientHeight,
  //     set: (fn) => {
  //       setMeasure((draft) => {
  //         draft.sfontHeight = fn(measure.sfontHeight);
  //       });
  //     },
  //   },
  // };

  // const fourSide6: fourSideProps = {
  //   up: {
  //     value: measure.fontSize,
  //     step: 2,
  //     min: 0,
  //     max: document.body.clientHeight,
  //     set: (fn) => {
  //       setMeasure((draft) => {
  //         draft.fontSize = fn(measure.fontSize);
  //       });
  //     },
  //   },
  //   left: {
  //     value: measure.sfontSize,
  //     step: 2,
  //     min: 0,
  //     max: document.body.clientHeight,
  //     set: (fn) => {
  //       setMeasure((draft) => {
  //         draft.sfontSize = fn(measure.sfontSize);
  //       });
  //     },
  //   },
  //   side: {
  //     value: measure.lineWidth,
  //     step: 2,
  //     min: 2,
  //     max: 100,
  //     set: (fn) => {
  //       setMeasure((draft) => {
  //         draft.lineWidth = fn(measure.lineWidth);
  //       });
  //     },
  //   },
  //   bottom: {
  //     value: measure.mm2px,
  //     step: 0.5,
  //     min: 0,
  //     max: document.body.clientWidth,
  //     set: (fn) => {
  //       setMeasure((draft) => {
  //         draft.mm2px = fn(measure.mm2px);
  //       });
  //     },
  //   },
  // };

  // 确定模式

  const [styleConfig, setStyleConfig] = useImmer<StyleConfig>({
    holder: {
      leftMargin: 50,
      bottomMargin: 185,
      holderHeight: 28,
      holderWidthmm: 1000,
      leftPadding: 10,
      xScale: 1.1,
      upHeight: 246,
      fontSize: 18,
      baselineHeight: 116,
      lenScaleX: 2,
      lenScaleY: 2.6,
    },
    screen: {
      mmwidth: 20,
      mmheight: 20,
      mm2px: 10,
      scaleX: 1.2,
      scaleY: 1.2,
      leftMargin: 205,
      bottomMargin: 515,
    },
    measure: {
      mm2px: 5.5,

      upHeight: 42,
      downHeight: 44,
      dsHeight: 39,
      fontHeight: 20,
      sfontHeight: 20,

      fontSize: 20,
      sfontSize: 16,
      lineWidth: 2,
      leftPadding: 12,
      upPadding: 5,

      leftMargin: 660,
      bottomMargin: 415,
    },
  });

  const [instrumentConfig, setInstrumentConfig] = useImmer<InstrumentConfig>({
    name: '杨氏双缝干涉',
    lens: [
      {
        id: 0,
        uname: 'light01',
        name: '光源',
        distancemm: 0,
        hide: false,
        option: {},
      },
      {
        id: 1,
        uname: 'convex_lens01',
        name: '透镜',
        distancemm: 100,
        hide: false,
        option: {},
      },
      {
        id: 2,
        uname: 'filter01',
        name: '滤光片',
        distancemm: 220,
        hide: false,
        option: {
          wave: '660',
        },
      },
      {
        id: 3,
        uname: 'single_slit01',
        name: '单缝',
        distancemm: 245,
        hide: false,
        option: {},
      },
      {
        id: 4,
        uname: 'double_slit01',
        name: '双缝',
        distancemm: 365,
        hide: false,
        option: {
          d: 0.1,
        },
      },
      {
        id: 5,
        uname: 'measure_head01',
        name: '测量头',
        distancemm: 965,
        hide: false,
        option: {},
      },
    ],
    light: {
      type: 'D65',
      filter: -1,
    },
    screen: {
      type: 0,
      seemm: 8,
      require: {
        d: '{4}.d',
        r0_2: '[5]',
        r0_1: '[4]',
      },
      func: 'cos(2 * PI / l * d * y / (r0_2 - r0_1) / 2)^2',
    },
    measure: {
      type: 0,
      initmm: 10,
    },
    control: {
      showmm: [0, 1, 2, 3, 4, 5],
      move: [3, 4, 5],
    },
    setting: [
      {
        name: '滤光片',
        type: 'ButtonSlider',
        target: ['light.filter', '{2}.wave'],
        options: {
          options: [
            {
              name: '无',
              value: -1,
            },
            {
              name: '红',
              value: 660,
            },
            {
              name: '绿',
              value: 550,
            },
          ],
          min: 420,
          max: 720,
          step: 1,
          toFixedPoint: 0,
          unit: 'nm',
        },
      },
    ],
    status: {
      offsetmm: 0,
    },
  });

  const [customD, setCustomD] = useState<number>(0.2);

  // const moveLeft = () => {
  //   const now = screen.offsetmm;
  //   const target = now - 0.1;
  //   setScreen((draft) => {
  //     draft.offsetmm = target;
  //   });
  //   setMeasure((draft) => {
  //     draft.offsetmm = target;
  //   });
  // };
  // const moveRight = () => {
  //   const now = screen.offsetmm;
  //   const target = now + 0.1;
  //   setScreen((draft) => {
  //     draft.offsetmm = target;
  //   });
  //   setMeasure((draft) => {
  //     draft.offsetmm = target;
  //   });
  // };

  // const [dpath, setDpath] = useState('');
  // const download = async () => {

  //   };

  //   if (web) {
  //     const a = document.createElement('a');
  //     a.href = URL.createObjectURL(new Blob([JSON.stringify(config, null, 2)]));
  //     a.download = `${DateTime.now().toFormat(
  //       'yyyyLLdd-HH:mm:ss'
  //     )}.melian.json`;
  //     a.click();
  //   }

  //   if (!web) {
  //     if (!ipcRenderer) return;
  //     const path = await ipcRenderer.invoke('saveConf', [dpath, config]);
  //     if (path !== '') {
  //       setDpath(path);
  //     }
  //   }
  // };
  // const load = async () => {
  //   if (!ipcRenderer) return;
  //   const { status, config } = await ipcRenderer.invoke('loadConf', [dpath]);
  //   if (!status) {
  //     // 加载失败
  //     console.error('加载失败');
  //   } else {
  //     // 加载成功
  //   }
  // };

  // useEffect(() => {
  //   if (ipcRenderer) {
  //     ipcRenderer.on('exportConfig', async () => {
  //       await download();
  //     });
  //     ipcRenderer.on('importConfig', async () => {
  //       await load();
  //     });
  //   }
  // }, []);

  // 左下角控制区

  // const [sideControl, setSideControl] = useState<sideControlEnum>(
  //   sideControlEnum.HOLDER
  // );

  return (
    <>
      {/* <div
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
            {web ? (
              <Upload
                beforeUpload={(file) => {
                  if (file.type !== 'application/json') {
                    message.error('请上传json文件');
                  }
                  const reader = new FileReader();
                  reader.readAsText(file);
                  reader.onload = (e) => {
                    if (e.target) {
                      const config = JSON.parse(e.target.result as string);
                      setHolder(config.holder);
                      setLens(config.lens);
                      setCtrl(config.ctrl);
                      setScreen(config.screen);
                      setInterConf(config.interConf);
                      setMeasure(config.measure);
                      setMode(config.mode);
                    }
                  };
                  return false;
                }}
                accept=".melian.json"
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} />
              </Upload>
            ) : (
              <Button icon={<UploadOutlined />} onClick={load} />
            )}
          </Space.Compact>
          <br />
          <Space.Compact>
            <Button
              icon={<VscChromeMaximize />}
              onClick={() => {
                if (ipcRenderer) ipcRenderer.maximize();
              }}
            />{' '}
            <Button
              icon={<VscChromeRestore />}
              onClick={() => {
                if (ipcRenderer) ipcRenderer.unmaximize();
              }}
            />{' '}
            <Button
              icon={<VscChromeClose />}
              onClick={() => {
                if (ipcRenderer) ipcRenderer.close();
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
      </div> */}
      <LoadSetting
        styleConfig={styleConfig}
        instrumentConfig={instrumentConfig}
        setInstrumentConfig={setInstrumentConfig}
      />
      <LightScreenFixed2
        instrumentConfig={instrumentConfig}
        styleConfig={styleConfig}
      />
      <Measure1 instrumentConfig={instrumentConfig} styleConfig={styleConfig} />
      <Holder styleConfig={styleConfig} />
      <LenGene instrumentConfig={instrumentConfig} styleConfig={styleConfig} />
      <Ctrl
        instrumentConfig={instrumentConfig}
        styleConfig={styleConfig}
        onchange={(id, d) => {
          setInstrumentConfig((draft) => {
            draft.lens[id].distancemm = d;
          });
        }}
      />
    </>
  );
}
