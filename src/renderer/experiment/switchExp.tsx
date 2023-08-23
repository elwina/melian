import { useMap } from 'ahooks';
import { Button, Select, Space } from 'antd';
import { ElectronHandler } from 'main/preload';
import { useEffect, useRef, useState } from 'react';
import { InstrumentConfig, StyleConfig } from 'renderer/typing/config.type';
import { Updater } from 'use-immer';
import { defaultExpMap } from './default';

type propType = {
  exp: string;
  styleConfig: StyleConfig;
  setStyleConfig: Updater<StyleConfig>;
  onChange: (name: string, config: InstrumentConfig) => void;
};

export default function SwitchExp({
  exp,
  styleConfig,
  setStyleConfig,
  onChange,
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
        showArrow={false}
        popupClassName="exp-select"
      />
      <br />
      <Space.Compact>
        <Button
          onClick={() => {
            loadExperiments();
          }}
        >
          刷新
        </Button>
        <Button
          onClick={() => {
            setIfOpen(!ifOpen);
          }}
          id="switchExpOpenBtn"
        >
          {ifOpen ? '收起' : '展开'}
        </Button>
      </Space.Compact>
    </div>
  );
}
