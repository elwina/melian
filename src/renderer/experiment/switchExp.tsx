import { useMap } from 'ahooks';
import { Button, Select, Space } from 'antd';
import { ElectronHandler } from 'main/preload';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { InstrumentConfig, StyleConfig } from 'renderer/typing/config.type';
import { Updater } from 'use-immer';
import { defaultExpMap } from './default';

type propType = {
  exp: string;
  styleConfig: StyleConfig;
  setStyleConfig: Updater<StyleConfig>;
  onChange: (name: string, config: InstrumentConfig) => void;
  show?: boolean;
  onChangeExp?: (expMap: Map<string, InstrumentConfig>) => void;
};

export default function SwitchExp({
  exp,
  styleConfig,
  setStyleConfig,
  onChange,
  show = true,
  onChangeExp = () => {},
}: propType) {
  let ipcRenderer: ElectronHandler['ipcRenderer'] | null;
  try {
    ipcRenderer = window.electron.ipcRenderer
      ? window.electron.ipcRenderer
      : null;
  } catch {
    ipcRenderer = null;
  }

  const [expMap, { set: setExpMap }] = useMap(defaultExpMap);

  useEffect(() => {
    onChangeExp(expMap);
  }, [expMap]);

  async function loadExperiments() {
    if (ipcRenderer) {
      const re: InstrumentConfig[] = await ipcRenderer.invoke(
        'loadExperiments',
        []
      );
      re.forEach((conf) => {
        setExpMap(conf.name, conf);
      });
    }
  }

  useEffect(() => {
    loadExperiments();
    const i = setInterval(() => {
      loadExperiments();
    }, 3000);

    return () => {
      clearInterval(i);
    };
  }, []);

  const [expOpt, setExpOpt] = useState([
    { label: 'loading', value: 'loading' },
  ]);

  const ifOpen = styleConfig.global.expOpen;
  const setIfOpen = (val: boolean) => {
    setStyleConfig((draft) => {
      draft.global.expOpen = val;
    });
  };

  useEffect(() => {
    const arr = Array.from(expMap);
    setIfOpen(false);
    setExpOpt(
      arr.map(([label, value]) => {
        return { label: label, value: label };
      })
    );
    setIfOpen(true);
  }, [expMap]);

  function changeConfig(name: string) {
    onChange(name, expMap.get(name) as InstrumentConfig);
  }

  useEffect(() => {
    setIfOpen(false);
    setTimeout(() => {
      setIfOpen(true);
    });
  }, [styleConfig.setting.expHeight]);

  if (show)
    return (
      <div
        style={{
          position: 'fixed',
          bottom: styleConfig.setting.expHeight,
          right: 0,
          zIndex: 200,
        }}
        id="switchExp"
      >
        <Select
          placement="topLeft"
          value={exp}
          options={expOpt}
          open={ifOpen}
          onChange={(value) => {
            changeConfig(value);
          }}
          style={{ width: 200 }}
          suffixIcon={null}
          popupClassName="exp-select"
          dropdownStyle={{ zIndex: 5000 }}
        />
        <br />
        <Space.Compact>
          <Button
            className="loadExpBtn"
            onClick={() => {
              loadExperiments();
            }}
          >
            {styleConfig.global.english ? 'Refresh' : '刷新'}
          </Button>
          <Button
            onClick={() => {
              setIfOpen(!ifOpen);
            }}
            id="switchExpOpenBtn"
          >
            {ifOpen
              ? styleConfig.global.english
                ? 'Hide'
                : '收起'
              : styleConfig.global.english
              ? 'Show'
              : '展开'}
          </Button>
          <Button
            onClick={() => {
              setStyleConfig((draft) => {
                draft.global.welcome = true;
              });
            }}
          >
            {styleConfig.global.english ? 'Welcome' : '欢迎'}
          </Button>{' '}
        </Space.Compact>
      </div>
    );
  else return null;
}
