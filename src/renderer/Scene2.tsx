import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { Channels, ElectronHandler } from 'main/preload';
import { DateTime } from 'luxon';
import Holder from './lab/Holder';
import 'antd/dist/reset.css';
import Measure1 from './lab/Measure1';
import LightScreenFixed2 from './lab/LightScreenFixed2';
import { InstrumentConfig, StyleConfig } from './config.type';
import LenGene from './lab/LenGene';
import Ctrl from './lab/Ctrl';
import LoadSetting from './setting/LoadSetting';
import SwitchExp from './experiment/switchExp';
import young from './experiment/json/young.json';
import Measure2 from './lab/Measure2';

export enum sideControlEnum {
  HOLDER,
  SCREEN,
  MEASURE,
}

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

  const [instrumentConfig, setInstrumentConfig] = useImmer<InstrumentConfig>(
    young as InstrumentConfig
  );

  return (
    <>
      <LoadSetting
        styleConfig={styleConfig}
        instrumentConfig={instrumentConfig}
        setInstrumentConfig={setInstrumentConfig}
        setStyleConfig={setStyleConfig}
      />
      <LightScreenFixed2
        instrumentConfig={instrumentConfig}
        styleConfig={styleConfig}
      />
      <Measure2 instrumentConfig={instrumentConfig} styleConfig={styleConfig} />
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
