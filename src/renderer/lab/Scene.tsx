import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { Channels, ElectronHandler } from 'main/preload';
import { DateTime } from 'luxon';
import { sReg } from 'renderer/screens/sReg';
import { mReg } from 'renderer/measures/mReg';
import Holder from './Holder';
import 'antd/dist/reset.css';
import Square from '../measures/Square';
import LightScreenFixed from '../screens/LightScreenFixed';
import { InstrumentConfig, StyleConfig } from '../typing/config.type';
import LenGene from './LenGene';
import Ctrl from './Ctrl';
import LoadSetting from '../setting/LoadSetting';
import SwitchExp from '../experiment/switchExp';
import young from '../experiment/json/young.json';

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
      FixedCircle: {
        mm2px: 10,
        scaleX: 1.2,
        scaleY: 1.2,
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
    },
  });

  const [instrumentConfig, setInstrumentConfig] = useImmer<InstrumentConfig>(
    young as InstrumentConfig
  );

  const RenderMeasure = mReg[instrumentConfig.measure.type];
  const RenderScreen = sReg[instrumentConfig.screen.type];

  return (
    <>
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

      <RenderMeasure
        instrumentConfig={instrumentConfig}
        styleConfig={styleConfig}
      />
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
      <SwitchExp
        exp={exp}
        onChange={(name, config) => {
          setExp(name);
          setInstrumentConfig(config);
        }}
      />
    </>
  );
}
