import { useEffect, useRef, useState } from 'react';
import { useImmer } from 'use-immer';
import { ElectronHandler } from 'main/preload';
import { sReg } from 'renderer/screens/sReg';
import { mReg } from 'renderer/measures/mReg';
import { ConfigProvider, theme } from 'antd';
import Holder from './Holder';
import 'antd/dist/reset.css';
import { InstrumentConfig, StyleConfig } from '../typing/config.type';
import LenGene from './LenGene';
import Ctrl from './Ctrl';
import LoadSetting from '../setting/LoadSetting';
import SwitchExp from '../experiment/switchExp';
import young from '../experiment/json/young.melian.json';

export default function Scene() {
  let ipcRenderer: ElectronHandler['ipcRenderer'] | null;
  try {
    ipcRenderer = window.electron.ipcRenderer
      ? window.electron.ipcRenderer
      : null;
  } catch {
    ipcRenderer = null;
  }
  const web = !ipcRenderer;

  const [exp, setExp] = useState<string>('杨氏双缝干涉');

  const [styleConfig, setStyleConfig] = useImmer<StyleConfig>({
    global: {
      dark: false,
    },
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
    setting: {
      height: 110,
      expHeight: 120,
    },
    screen: {
      FixedCircle: {
        mm2px: 10,
        scaleX: 1.2,
        scaleY: 1.2,
        leftMargin: 205,
        bottomMargin: 515,
      },
      FixedCirclePolar: {
        mm2px: 6,
        scaleX: 3,
        scaleY: 3,
        leftMargin: 205,
        bottomMargin: 515,
      },
      Board: {
        mm2px: 2,
        totalWidthmm: 200,
        totalHeightmm: 50,
        scaleX: 3,
        scaleY: 3,
        leftMargin: 205,
        bottomMargin: 515,
      },
      BoardPolar: {
        px2mm: 4,
        totalWidthmm: 240,
        totalHeightmm: 240,
        scaleX: 6,
        scaleY: 6,
        leftMargin: 205,
        bottomMargin: 515,
      },
    },
    measure: {
      Square: {
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
      Circle: {
        mm2px: 8,
        hm2px: 10,

        seeSize: 300,
        bigHeight: 250,
        leftPadding: 20,

        mainLine: 20,
        hLine: 40,
        lineWidth: 2,
        mFontSize: 20,
        hFontSize: 16,

        leftMargin: 700,
        bottomMargin: 520,
      },
    },
  });

  const [instrumentConfig, setInstrumentConfig] = useImmer<InstrumentConfig>(
    young as InstrumentConfig
  );

  const RenderMeasure = mReg[instrumentConfig.measure.type];
  const RenderScreen = sReg[instrumentConfig.screen.type];

  // darkmode
  useEffect(() => {
    document.getElementsByTagName('body')[0].className = styleConfig.global.dark
      ? 'dark-mode'
      : 'light-mode';
  }, [styleConfig.global.dark]);

  return (
    <>
      <ConfigProvider
        theme={{
          algorithm: styleConfig.global.dark
            ? theme.darkAlgorithm
            : theme.defaultAlgorithm,
        }}
      >
        <LoadSetting
          styleConfig={styleConfig}
          instrumentConfig={instrumentConfig}
          setInstrumentConfig={setInstrumentConfig}
          setStyleConfig={setStyleConfig}
        />
        <RenderScreen
          instrumentConfig={instrumentConfig}
          styleConfig={styleConfig}
        />

        {!styleConfig.global.dark && (
          <>
            <RenderMeasure
              instrumentConfig={instrumentConfig}
              styleConfig={styleConfig}
            />
            <Holder styleConfig={styleConfig} />
            <SwitchExp
              exp={exp}
              styleConfig={styleConfig}
              onChange={(name, config) => {
                setExp(name);
                setInstrumentConfig(config);
              }}
            />
          </>
        )}

        <LenGene
          instrumentConfig={instrumentConfig}
          styleConfig={styleConfig}
        />
        <Ctrl
          instrumentConfig={instrumentConfig}
          styleConfig={styleConfig}
          onchange={(id, d) => {
            setInstrumentConfig((draft) => {
              draft.lens[id].distancemm = d;
            });
          }}
        />
      </ConfigProvider>
    </>
  );
}
